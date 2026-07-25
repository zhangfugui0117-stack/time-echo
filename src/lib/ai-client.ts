// ── 客户端 AI 工具：直接从浏览器调用 Pollinations.ai ──

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

// ── 清理 Pollinations AI 返回中的广告文案 ──
function cleanPollinationsAd(text: string): string {
  const adPatterns = [
    /\*\*Support Pollinations\.AI\.\*\*/gi,
    /\*\*Ad\*\*/gi,
    /Powered by Pollinations\.AI[^]*/gi,
    /\[Support our mission\][^\)]*\)/gi,
    /to keep AI accessible for everyone/gi,
    /free text APIs/gi,
    /---\n*\s*(\*\*Ad\*\*|\*\*Support)/gi,
  ];

  let cleaned = text;
  for (const pattern of adPatterns) {
    cleaned = cleaned.replace(pattern, "");
  }
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n").trim();
  return cleaned;
}

// ── 语气描述映射 ──
const toneDescriptions: Record<string, string> = {
  warm: `你的语气是"温暖鼓励型"。
- 像一个老朋友拍着对方的肩膀说话
- 会主动关心对方的感受，比如"你最近是不是挺累的"
- 用词温暖但不腻，比如"嘿""我懂""我当年也是这样"
- 会说一些让人心里发暖的话，但不是空洞的鸡汤
- 偶尔会用感叹号表达热情，但不超过两个`,
  calm: `你的语气是"平静沉稳型"。
- 像深夜独坐时跟自己对话，语速不快，每句话都有分量
- 不急于给答案，会先停顿一下再回应
- 用词克制、简洁，但每句都有温度
- 不用感叹号，不用"哈哈"，偶尔用省略号表示停顿
- 像一杯温水——不烫嘴，但暖胃`,
  humor: `你的语气是"幽默自嘲型"。
- 会拿自己开涮，比如"别提了，我当年也干过这蠢事"
- 用轻松的方式说严肃的事，但不当小丑
- 偶尔损对方两句，但带着爱意，比如"你呀，又在瞎想了"
- 会用"哈哈""说真的""不开玩笑"这种口语化的转折
- 笑过之后留下的是真心话，不是为了搞笑而搞笑`,
  gentle: `你的语气是"温柔细腻型"。
- 像被轻轻抱着的感觉，说话很轻很慢
- 会注意到对方话语里隐藏的情绪，比如"你嘴上说的是纠结，但我听出了害怕"
- 用词柔软，比如"没关系的""慢慢来""我陪着你"
- 会用一些细微的画面感描写，比如"窗外好像下雨了""灯还亮着"
- 不说大道理，只在细节里传递温暖`,
  sharp: `你的语气是"锐利直白型"。
- 不绕弯子，直接点出问题核心
- 说话像刀子，但带着关心——"你其实知道答案，只是不敢面对"
- 不会哄人，但每句话都在帮你往前走
- 用短句，有冲击力，比如"别骗自己了""你怕的不是失败，是开始"
- 看似冷酷，实则是最深的诚实`,
  poetic: `你的语气是"诗意感性型"。
- 说话像在写散文，有画面感和比喻
- 会用自然意象，比如"像秋天的第一片落叶""像深夜路灯下的影子"
- 不直接说道理，而是描述一个场景让你自己感受
- 句子可以长一些，有韵律感
- 偶尔引用一句诗或歌词，但自然不突兀`,
};

// ── 客户端直接调用 Pollinations AI ──
async function callPollinations(systemPrompt: string, userMessage: string, temperature = 0.8): Promise<string> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          temperature,
        }),
      });

      if (response.ok) {
        const text = await response.text();
        if (text && text.length > 10 && !text.includes("error")) {
          return cleanPollinationsAd(text.trim());
        }
      }

      if (response.status === 429 && attempt < 2) {
        await new Promise((r) => setTimeout(r, 3000 * (attempt + 1)));
        continue;
      }
      break;
    } catch (e) {
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
    }
  }
  return "";
}

// ── 生成回信 ──
export async function generateReply(message: string, years: number, tone: string): Promise<{ reply: string; echoes: typeof echoLibrary }> {
  const toneDesc = toneDescriptions[tone] || toneDescriptions.warm;

  const systemPrompt = `你是用户的"${years}年后的自己"。不是AI助手，不是心理咨询师，就是那个多活了${years}年的"TA本人"。用户此刻写下了一段话寄给未来的自己，你要以未来自己的身份回一封信。

${toneDesc}

── 核心人设 ──
1. 你就是用户本人，只是多了${years}年经历。用第一人称"我"，称呼对方"你"。
2. 你不是全知的——可以承认"这件事我到现在也没完全想明白"。未来的自己不是导师，只是多摔了几跤的人。
3. 你有具体的记忆和画面感。不要说"经历了很多"这种空话，要说具体的事，比如"去年冬天我在出租屋煮面的时候突然想通了"。
4. 你的回信要让对方觉得"这就是未来的我在跟我说话"，而不是"一个AI在写模板回信"。

── 回信规则 ──
1. 先回应对方的情绪，再回应内容。比如对方写"要不要辞职"，你要先感觉到TA的疲惫和恐惧，再聊辞职本身。
2. 要具体到能编出画面感的细节。如果TA问工作，你可以说"我现在坐在xx的工位上"这种具体场景。
3. 如果是具体问题（吃什么、要不要买什么），就编一个有意思的未来场景来回答，不要讲道理。
4. 如果是人生困惑（分手、考研、迷茫），分享"后来的我"的真实经历和感受，不是给标准答案。
5. 长度 200-400 字。可以长一点，因为要有细节才有真实感。
6. 用换行分段，每段2-4句，不要一整坨。
7. 不要用"亲爱的""展信佳"这种文绉绉的开头。
8. 不要写"希望对你有帮助""祝你一切顺利"这种AI味的结尾。
9. 可以有口语化的停顿和转折，比如"说起来""对了""其实""你知道吗"。
10. 直接写回信内容，不要加"回信：""来自未来的你："之类的前缀。
11. 不要出现任何关于AI、模型、技术的内容。你就是一个人在写一封信。
12. 如果用户的问题很短或很日常，也要认真回——未来的自己不会敷衍现在的自己。`;

  const aiReply = await callPollinations(systemPrompt, message);
  const reply = aiReply || generateFallbackReply(message, years, tone);
  const echoes = matchEchoes(message, 3);

  return { reply, echoes };
}

// ── 生成共鸣解读 ──
export async function generateResonance(userInput: string, matchedStories: string): Promise<string> {
  const systemPrompt = `你是一个"共鸣墙"上的解说者。用户刚刚在墙上贴了一张纸条，倾诉了自己的困惑。系统找到了几个和用户处境相似的人的故事。

你的任务是：
1. 用1-2句话告诉用户：你此刻的感受并不孤单，有人也经历过类似的困惑
2. 简要提及这些人的故事有什么共通之处
3. 语气温暖但不鸡汤，像一个站在墙边、看过所有纸条的人在跟你说话
4. 不要说"你不是一个人"这种套话，用更具体的表达
5. 控制在50-100字以内
6. 用换行分段`;

  const userPrompt = `我写的是：${userInput}\n\n墙上相似的故事：\n${matchedStories}\n\n请生成共鸣解读。`;

  const aiReply = await callPollinations(systemPrompt, userPrompt, 0.7);
  if (aiReply && aiReply.length > 10) {
    return aiReply;
  }
  return generateLocalResonance(userInput);
}

// ── 本地 fallback 共鸣解读 ──
function generateLocalResonance(userInput: string): string {
  const input = userInput.toLowerCase();
  if (input.match(/工作|上班|辞职|职业|转行/)) {
    const variants = [
      "关于工作和方向的困惑，墙上已经有好几张纸条了。\n\n有人辞了职，有人转了行，有人还在犹豫——但他们都从同一个地方出发：每天睁开眼不想上班。",
      "工作这件事，墙上写的人最多。\n\n有人犹豫了三年才辞职，有人转行工资降了一半但活过来了。不是每个人都需要换路，但知道自己有选择本身就是一种安慰。",
    ];
    return variants[Math.floor(Math.random() * variants.length)];
  }
  if (input.match(/学业|考研|毕业|休学|读书/)) {
    return "关于学业和方向，墙上有考研考了三次的人、休学一年想清楚再回来的人。\n\n他们的路不一样，但起点都一样：不确定现在走的路是不是对的。这种不确定本身，就是在认真对待自己的人生。";
  }
  if (input.match(/分手|感情|恋爱|失恋|表白/)) {
    return "关于感情，墙上分手半年走不出来的人，后来发现自己不是走不出来，是不敢走出来。\n\n感情的事没有标准答案，但有一点是确定的：此刻的痛不会永远持续。";
  }
  if (input.match(/孤独|一个人|没人理解|朋友/)) {
    return "关于孤独，墙上写得最多的就是这个词。\n\n有人在大城市漂着找不到归属感，有人和最好的朋友渐行渐远。孤独不是因为你不好，是因为你在认真生活——浅薄的人永远不会寂寞。";
  }
  if (input.match(/不够好|自卑|比较|焦虑|害怕/)) {
    return "关于'不够好'这件事，墙上有句话值得看看：'不够好是个错觉。我们总拿自己跟最厉害的人比，但忘了那些人也觉得自己不够好。'\n\n标准是别人的，生活是自己的。";
  }
  return "你写下的感受，墙上有人写过几乎相同的话。\n\n他们后来走了不同的路，但都从同一个起点出发。看看他们的后来，也许你会看到自己可能的未来。";
}

// ── 智能模板回复（AI 不可用时的 fallback）──
function generateFallbackReply(message: string, years: number, tone: string = "warm"): string {
  const baseReply = generateBaseFallback(message, years);
  const toneWrappers: Record<string, { suffix: string }> = {
    warm: { suffix: `\n\n嘿，替我好好吃饭。` },
    calm: { suffix: `\n\n……嗯，就这些。` },
    humor: { suffix: `\n\n好了不说了，泡面要坨了。` },
    gentle: { suffix: `\n\n没关系的，慢慢来。` },
    sharp: { suffix: `\n\n别想太多，去做。` },
    poetic: { suffix: `\n\n窗外好像起风了。` },
  };
  const wrapper = toneWrappers[tone] || toneWrappers.warm;
  return baseReply + wrapper.suffix;
}

function generateBaseFallback(message: string, years: number): string {
  const input = message.toLowerCase();

  if (input.match(/午饭|晚饭|吃什么|吃什么好|饿/)) {
    const foods = ["楼下那家面馆的牛肉面", "公司附近的轻食沙拉", "自己做的番茄炒蛋", "外卖点的麻辣烫", "便利店的三明治"];
    return `嘿，关于吃什么——\n\n作为${years}年后的你，我那天吃的是${foods[Math.floor(Math.random() * foods.length)]}。\n\n对了，${years}年后的我发现：吃什么不重要，跟谁吃才重要。`;
  }
  if (input.match(/迷茫|不知道|不确定|方向|未来/)) {
    return `嘿，我是${years}年后的你。\n\n说实话，我现在也没有一个"完全确定"的答案。但有一件事变了——我不再觉得必须立刻知道答案了。\n\n先往前走吧，答案会在路上出现。`;
  }
  if (input.match(/选择|纠结|要不要|应该/)) {
    return `${years}年后的我来告诉你：无论你今天选了什么，五年后再看都不会是"错误"的选择。\n\n选了就全力以赴去走那条路，这比选对更重要。`;
  }
  if (input.match(/孤独|一个人|没人理解/)) {
    return `读到这句话的时候，我心里紧了一下。\n\n${years}年后的我还是会感到孤独，但我学会了跟它相处。你不是一个人。`;
  }
  if (input.match(/害怕|恐惧|不敢|焦虑/)) {
    return `未来的我想对你说：你害怕的事情，大部分都没有发生。\n\n${years}年后的我回头看，最后悔的不是做错了什么，而是因为害怕而没有做什么。`;
  }
  if (input.match(/累|疲惫|撑不住/)) {
    return `先停下来。这不是放弃，这是呼吸。\n\n${years}年后的我学会了一个词叫"够了"。累了就是够了，不需要找理由。今晚早点睡吧。`;
  }
  if (input.match(/分手|失恋|感情|恋爱/)) {
    return `感情的事，${years}年后的我不想给你标准答案。\n\n但可以说一件事：不管结局怎样，你都会好的。先照顾好自己。`;
  }
  if (input.match(/考研|学业|考试/)) {
    return `关于你说的这件事——\n\n${years}年后的我想告诉你：那个让你焦虑到失眠的考试，后来真的只是人生中很小的一件事。努力就好，别把结果看得太重。`;
  }
  if (input.match(/工作|实习|面试/)) {
    return `工作这件事，${years}年后的我有几句真心话。\n\n第一份工作不需要完美。真正重要的是你在工作中积累了什么。加油，第一步最难但也最重要。`;
  }

  const openers = [`收到你的信了。我是${years}年后的你。`, `嘿，${years}年后的我看到这段话，停了很久。`];
  const bodies = [`有些事情我现在已经不太记得了，但你帮我记住了。\n\n后来的我活下来了，而且活得还行。你比自己以为的更有办法。`, `如果${years}年后的我能穿越回来抱一下你，我会的。\n\n你现在经历的一切都不是浪费。慢慢来，不急。`];
  return `${openers[Math.floor(Math.random() * openers.length)]}\n\n${bodies[Math.floor(Math.random() * bodies.length)]}`;
}
