import { NextRequest, NextResponse } from "next/server";

// 预置回声语料库
const echoLibrary = [
  { id: "echo_01", question: "毕业了要不要回老家", reply: "三年后的我回来了。不是认输，是终于知道自己要什么了。大城市很好，但那种'我在这里但我不属于这里'的感觉，回老家后反而消失了。", tags: ["职业", "家庭", "选择"] },
  { id: "echo_02", question: "不知道自己到底喜欢什么", reply: "我现在也不确定，但我不再焦虑这件事了。原来'找到热爱'不是一瞬间的事，是不断试错的过程。你现在的迷茫本身就是一种探索。", tags: ["自我", "方向", "迷茫"] },
  { id: "echo_03", question: "和父母的关系越来越远", reply: "后来我主动打了个电话，没说什么大事，就聊了半小时。关系没有一夜变好，但那通电话之后我知道，门还开着。", tags: ["家庭", "沟通", "孤独"] },
  { id: "echo_04", question: "要不要休学一年", reply: "我休了。有人说不值，有人说浪费了一年。但我用这一年想清楚了：我不是不想学，是不确定学这个对不对。回来之后反而更踏实了。", tags: ["学业", "选择", "休学"] },
  { id: "echo_05", question: "感觉身边的人都比我强", reply: "三年后我发现，那些我以为比我强的人也有自己的深夜和崩溃时刻。我们都在演'没事的'，只是没人说破而已。", tags: ["自我怀疑", "比较", "焦虑"] },
  { id: "echo_06", question: "分手后走不出来怎么办", reply: "现在回想起来，那段走不出来的日子其实是我重新认识自己的开始。你失去的不是那个人，是你把所有安全感都寄托在外面的习惯。", tags: ["感情", "失恋", "成长"] },
  { id: "echo_07", question: "工作以后发现不喜欢这个行业", reply: "转行了，工资降了一半但人活过来了。以前觉得'稳定'最重要，后来发现每天睁眼不想上班才是最大的不稳定。", tags: ["职业", "转行", "选择"] },
  { id: "echo_08", question: "考研还是直接找工作", reply: "我选了工作，同学选了考研。三年后我们坐在同一张饭桌上聊天——没有谁的路更好，只是风景不同。关键是别因为害怕做选择而一直等。", tags: ["学业", "职业", "选择"] },
  { id: "echo_09", question: "活着有什么意义", reply: "这个问题我问了很多次。后来某天下午在路边看一只猫晒太阳的时候突然觉得：也许意义不在终点，而在某个瞬间你觉得'嗯，这样也行'的那一刻。", tags: ["存在感", "意义", "人生"] },
  { id: "echo_10", question: "不敢表白怕连朋友都做不成", reply: "我表白了，被拒绝了，确实尴尬了一段时间。但现在我们是朋友——真正的朋友，因为我不用再假装不在乎了。", tags: ["感情", "勇气", "友情"] },
  { id: "echo_11", question: "觉得自己不够好", reply: "未来的我想告诉你：你现在觉得不够好的地方，很多年后回头看，恰恰是让你变得独特的东西。标准是别人的，生活是自己的。", tags: ["自我", "自信", "接纳"] },
  { id: "echo_12", question: "在大城市待不下去了", reply: "我坚持了两年半，然后回了老家附近的城市。不丢人。你知道最讽刺的是什么吗？回去之后才发现，当初让我离开的那些问题，换了地方依然存在——问题不在城市，在我自己。", tags: ["城市", "归属感", "压力"] },
];

function matchEchoes(userInput: string, count = 3) {
  const keywords: Record<string, string[]> = {
    毕业: ["毕业", "工作", "职业", "选择"],
    回家: ["回家", "老家", "城市", "选择"],
    迷茫: ["迷茫", "方向", "自我", "不确定"],
    喜欢: ["喜欢", "热爱", "方向", "自我"],
    父母: ["父母", "家庭", "关系", "沟通"],
    休学: ["休学", "学业", "选择"],
    分手: ["分手", "感情", "失恋"],
    感情: ["分手", "感情", "恋爱", "表白"],
    工作: ["工作", "职业", "转行", "选择"],
    考研: ["考研", "学业", "选择"],
    意义: ["意义", "存在感", "活着"],
    不够好: ["不够好", "自我", "自信", "接纳"],
    大城市: ["大城市", "城市", "归属感", "压力"],
    压力: ["大城市", "压力", "焦虑"],
    孤独: ["孤独", "关系", "连接"],
    累: ["累", "疲惫", "压力", "学业"],
    害怕: ["害怕", "恐惧", "勇气"],
    吃饭: ["日常", "轻松"],
    午饭: ["日常", "轻松"],
  };

  const scored = echoLibrary.map((echo) => {
    let score = 0;
    const input = userInput.toLowerCase();
    for (const tag of echo.tags) {
      if (input.includes(tag)) score += 3;
    }
    for (const [kw, related] of Object.entries(keywords)) {
      if (input.includes(kw)) {
        if (echo.tags.some((t) => related.includes(t))) score += 2;
        if (echo.question.includes(kw)) score += 1;
      }
    }
    return { ...echo, _score: score };
  });

  return scored.sort((a, b) => b._score - a._score).slice(0, count).map(({ _score, ...rest }) => rest);
}

async function generateReplyWithAI(message: string, years: number): Promise<string> {
  const apiKey = process.env.SILICONFLOW_API_KEY;

  if (!apiKey) {
    // 没有 API Key 时回退到智能模板回复
    return generateFallbackReply(message, years);
  }

  const systemPrompt = `你是一个用户的"${years}年后的自己"。用户会写一句话给${years}年后的自己，你要以那个未来的自己的身份回信。

规则：
1. 你就是用户本人，只是多了${years}年的人生经历。用第一人称"我"，称呼对方"你"。
2. 语气要像一个真实的、活过的人——有温度，有幽默感，偶尔自嘲，不说教。
3. 回信要具体、有细节。不要写空洞的鸡汤。
4. 如果用户问的是具体问题（比如"午饭吃什么""要不要买那双鞋"），就具体回答，可以编一个有意思的未来场景。
5. 如果用户问的是人生困惑（比如"要不要分手""考研还是工作"），要像经历过的人一样分享"后来的我"的真实感受，不要给标准答案。
6. 如果用户问的是日常小事，就轻松幽默地回答，不要强行升华。
7. 长度控制在 150-300 字。不要太长。
8. 不要用"亲爱的"开头。不要用"展信佳"这种过于文绉绉的词。
9. 可以承认"我现在也还在摸索"——未来的自己不是全知的，只是多走了几步。
10. 用换行分段，不要一整坨文字。`;

  try {
    const response = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "Qwen/Qwen2.5-72B-Instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.85,
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      console.error("SiliconFlow API Error:", response.status, errorText);
      // AI 失败时回退到模板
      return generateFallbackReply(message, years);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return generateFallbackReply(message, years);
    }

    return reply.trim();
  } catch (error) {
    console.error("AI call failed:", error);
    return generateFallbackReply(message, years);
  }
}

// ── 智能模板回复（AI 不可用时的 fallback）──
function generateFallbackReply(message: string, years: number): string {
  const input = message.toLowerCase();

  // 日常生活类
  if (input.match(/午饭|晚饭|吃什么|吃什么好|饿/)) {
    const foods = ["楼下那家面馆的牛肉面", "公司附近的轻食沙拉（没错，我也开始养生了）", "自己做的番茄炒蛋——三年了厨艺终于进步了", "外卖点的麻辣烫，多加了一份宽粉"];
    const extras = [
      `\n\n顺便说一句，${years}年后的我对吃这件事看得更淡了。以前纠结半天"吃什么"，现在饿了就随便吃点。能吃饱已经是种幸运了。`,
      `\n\n对了，${years}年后的我发现一个真理：吃什么不重要，跟谁吃才重要。如果今天有人陪你吃饭，好好珍惜。`,
      `\n\n哈哈没想到你会问这个！${years}年后的我已经不会为这种事纠结了——饿了就吃，好吃就多吃两口。`,
    ];
    return `嘿，关于吃什么这件事——\n\n作为${years}年后的你，我那天吃的是${foods[Math.floor(Math.random() * foods.length)]}。${extras[Math.floor(Math.random() * extras.length)]}`;
  }

  if (input.match(/猫|狗|宠物|养.*动物/)) {
    return `啊这个话题戳到我了。\n\n${years > 3 ? `养了！而且现在正趴在我脚边睡觉呢。名字叫"年糕"，因为它又软又黏人。` : `${years}年后我还是很想养，如果你在考虑的话——养吧，别犹豫了。那些"麻烦""责任"的顾虑，在它第一次蹭你腿的时候就全消失了。`}\n\n宠物教会我的事比人都多：爱不一定是宏大的，有时候就是每天喂食、铲屎、然后被需要。`;
  }

  if (input.match(/游戏|打游戏|通关|排位/)) {
    return `哈哈被抓到了。\n\n${years}年后的我还打，只是没以前那么猛了。反应速度下降了，但意识还在。偶尔周末晚上还是会开两把，赢了一样爽得拍桌子。\n\n游戏没什么丢人的。${years}年后的我觉得，能找到让自己开心的事本身就是一种能力。别让任何人说你"不务正业"。`;
  }

  // 情感困惑类
  if (input.match(/迷茫|不知道|不确定|方向|未来/)) {
    return `嘿，我是${years}年后的你。\n\n说实话，我现在也没有一个"完全确定"的人生答案。但有一件事变了——我不再觉得必须立刻知道答案了。\n\n你现在的迷茫不是因为你走错了路，是因为你在认真对待自己的人生。那些看起来很笃定的人，大部分也是在装。\n\n先往前走吧，答案会在路上出现。`;
  }

  if (input.match(/选择|纠结|要不要|应该/)) {
    return `${years}年后的我来告诉你：无论你今天选了什么，五年后再看都不会是"错误"的选择。\n\n因为重要的不是选项A或B，而是你做出决定之后的那个自己。选了就全力以赴去走那条路，这比选对更重要。\n\n别再纠结了，选一个，然后让它变成对的选择。`;
  }

  if (input.match(/孤独|一个人|没人理解|孤单/)) {
    return `读到这句话的时候，我心里紧了一下。\n\n${years}年后的我还是会感到孤独，但我学会了跟它相处。孤独不是因为你不好，是因为你有深度——浅薄的人才永远不会寂寞。\n\n而且，你不是一个人。此刻就有很多人和你一样在问同样的问题。这一点，我稍后会证明给你看。`;
  }

  if (input.match(/害怕|恐惧|不敢|担心|焦虑/)) {
    return `未来的我想对你说：你害怕的事情，大部分都没有发生。而真正发生的那些困难，你也都挺过来了。\n\n恐惧是一个糟糕的向导，但它也是一个诚实的信号——说明这件事对你很重要。重要的事值得害怕，也更值得去做。\n\n${years}年后的我回头看，最后悔的不是做错了什么，而是因为害怕而没有做什么。`;
  }

  if (input.match(/累|疲惫|撑不住|不想动了/)) {
    return `先停下来。这不是放弃，这是呼吸。\n\n${years}年后的我学会了一个词叫"够了"。累了就是够了，不需要找理由，不需要自责。休息完再出发的人，比硬撑着走的人走得更远。\n\n今晚早点睡吧。明天的太阳照常升起。`;
  }

  if (input.match(/分手|失恋|感情|恋爱|喜欢的人|表白/)) {
    const advice = Math.random() > 0.5
      ? "如果还没分——坐下来好好聊聊，有些话当面说出来比在心里演一百遍有用得多。"
      : "如果已经分了——允许自己难过，但给自己一个期限。不是'永远忘不掉'那种期限，而是'这周我可以哭，下周我要重新开始'的那种。";
    return `感情的事，${years}年后的我不想给你标准答案，因为我发现每段感情都不一样。\n\n但我可以说一件事：不管结局怎样，你都会好的。真的。那些以为"再也遇不到这样的人了"的念头，都是大脑骗你的。\n\n${advice}`;
  }

  if (input.match(/考研|学业|考试|成绩|挂科|毕业/)) {
    return `关于你说的这件事——\n\n${years}年后的我想告诉你：学历重要，但没有你想象的那么重要。它是一块敲门砖，但进门之后怎么走，靠的是别的本事。\n\n如果你在犹豫要不要考研：考不考都可以，关键是别用"考研"来逃避"不想面对就业"这件事。如果你想清楚了，那就冲；如果只是为了拖延，不如直接去面对。\n\n不管选哪条路，${years}年后的你都在好好的。`;
  }

  if (input.match(/工作|实习|面试|offer|薪资|老板|同事/)) {
    return `工作这件事，${years}年后的我有几句真心话想对你说。\n\n第一份工作不需要完美。它只是一个起点，不是终点。你现在纠结的公司A和公司B，三年后再看区别没那么大。真正重要的是你在工作中积累了什么、学会了什么。\n\n还有——别怕被拒绝。我被拒过很多次，每一次都让我更清楚自己想要什么。\n\n加油，第一步最难，但也最重要。`;
  }

  if (input.match(/钱|穷|没钱|存款|工资/)) {
    return `谈钱不丢人，谈钱很重要。\n\n${years}年后的我关于钱的感悟：钱够用就好，但"够用"这个标准因人而异。不要拿别人的消费水平来要求自己。\n\n另外，${years > 5 ? "存钱真的很重要。从现在开始每个月存一点。" : "开始学着记账和存钱吧，哪怕每月只有几百块，积少成多的感觉很踏实。" }\n\n但记住——钱是工具，不是目的。别为了赚钱把生活本身弄丢了。`;
  }

  if (input.match(/好看|胖|瘦|外貌|长相|颜值/)) {
    return `你想听真话吗？\n\n${years}年后的我再翻从前的照片，觉得当年的自己挺好看的。只是当时身在局中不自知罢了。\n\n外貌会变，但那种"觉得自己不够好"的感觉如果不解决，瘦了十斤也还是会有新的不满意。所以与其纠结外表，不如先学会跟镜子里的自己和解。\n\n你比你想象的好看。相信我，我是过来人。`;
  }

  // 默认通用回复
  const openers = [
    `收到你的信了。我是${years}年后的你。`,
    `嘿，${years}年后的我看到这段话，停了很久。`,
    `说实话，看到这句话的时候，我心里动了一下。`,
  ];

  const bodies = [
    `有些事情我现在已经不太记得当时的感受了，但你帮我记住了。\n\n关于你说的这件事——我没有一个完美的答案。但我可以告诉你：后来的我活下来了，而且活得还行。那些让你此刻睡不着的问题，大部分都会在时间中慢慢找到出路。\n\n你比自己以为的更有办法。`,
    `如果${years}年后的我能穿越回来抱一下你，我会的。\n\n你现在经历的一切都不是浪费。快乐也好痛苦也好，它们都在塑造那个叫"未来的你"的人。而我——我很感谢你没有放弃。\n\n慢慢来，不急。`,
    `${years}年不长也不短。足够让一些事情改变，也足够让一些事情保持原样。\n\n我不能剧透太多（剧透了就没意思了对吧），但我可以确认一件事：你走的路没有白走。每一步都有它的意义。\n\n继续走吧，前面的风景值得期待。`,
  ];

  const closers = [
    `\n\n——来自 ${years} 年后的你`,
    `\n\nPS: 如果你能收到这封信，说明我们之间的连接还在。这就够了。`,
    ``,
  ];

  return `${openers[Math.floor(Math.random() * openers.length)]}\n\n${bodies[Math.floor(Math.random() * bodies.length)]}${closers[Math.floor(Math.random() * closers.length)]}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, years = 3 } = body as { message?: string; years?: number };

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "请输入内容" }, { status: 400 });
    }

    const safeYears = Math.min(Math.max(Number(years) || 3, 1), 100);

    // 调用 AI 生成回信（失败时自动回退到模板）
    const reply = await generateReplyWithAI(message.trim(), safeYears);

    // 匹配回声
    const echoes = matchEchoes(message.trim(), 3);

    return NextResponse.json({ reply, echoes });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "服务器出了点问题，请稍后再试" },
      { status: 500 }
    );
  }
}
