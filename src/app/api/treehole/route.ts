import { NextRequest, NextResponse } from "next/server";

// ── 树洞 fallback 回复模板 ──
function getFallbackReplies(message: string): Array<{ role: string; name: string; emoji: string; reply: string }> {
  const input = message.toLowerCase();

  if (input.match(/上班|工作|不想上班|辞职|倦怠|不想干/)) {
    return [
      { role: "知心朋友", name: "小暖", emoji: "🌸", reply: "我特别理解你。'不想上班'不是懒，是对现状的一种本能抗拒。你坚持了三年，说明你比想象中更有韧性。不是你的问题，是那个环境的问题。" },
      { role: "过来人", name: "老陈", emoji: "🧭", reply: "我也犹豫了三年。后来发现原地踏步本身就是一种选择——选择了忍受。早点做决定吧，不管选哪条路都比耗着强。" },
      { role: "安慰者", name: "月月", emoji: "🌙", reply: "你已经很勇敢了。能坚持三年本身就是勇气，很多人连承认'我不想上班'都不敢。今晚好好休息，明天的事明天想。" },
    ];
  }

  if (input.match(/考研|考试|上岸|学业|挂科|成绩/)) {
    return [
      { role: "知心朋友", name: "小暖", emoji: "🌸", reply: "两次都没上岸真的很沮丧吧。但我想说——你的努力不会白费，即使结果不是你想要的，那些学到的东西都在你身上。" },
      { role: "过来人", name: "老陈", emoji: "🧭", reply: "我考了三次才上岸。但说实话，如果第三次还是没考上我会换路。不是放弃，是换一种方式到达。有时候绕路反而更快。" },
      { role: "安慰者", name: "月月", emoji: "🌙", reply: "你已经在努力了，这就够了。结果不是衡量你的唯一标准。给自己一个拥抱，你值得。" },
    ];
  }

  if (input.match(/朋友|友谊|渐行渐远|不再联系|社交/)) {
    return [
      { role: "知心朋友", name: "小暖", emoji: "🌸", reply: "最难受的分离就是这样悄无声息的。不是吵架，只是慢慢不再联系。你心里一定有很多话想对TA说。" },
      { role: "过来人", name: "老陈", emoji: "🧭", reply: "后来我发现，有些友情就是有保质期的。不是谁做错了什么，是各自的轨道不同了。真正留下的朋友，不需要你刻意维护。" },
      { role: "安慰者", name: "月月", emoji: "🌙", reply: "那段美好的回忆不会消失，它们永远属于你。即使人不在身边，那些一起笑过的日子仍然温暖着你。" },
    ];
  }

  if (input.match(/不够好|自我怀疑|差一点|永远不够|比不上/)) {
    return [
      { role: "知心朋友", name: "小暖", emoji: "🌸", reply: "你说的'差一点'其实说明你已经很接近了。那个'一点'不是你的缺陷，是成长的空间。" },
      { role: "过来人", name: "老陈", emoji: "🧭", reply: "后来我发现'不够好'是个错觉。我们总拿自己跟最厉害的人比，但忘了那些人也觉得自己不够好。标准是别人的，生活是自己的。" },
      { role: "安慰者", name: "月月", emoji: "🌙", reply: "你已经很好了，只是你自己暂时看不到。就像鱼不知道自己会游泳一样。给自己一点耐心。" },
    ];
  }

  if (input.match(/大城市|漂|归属|孤岛|想家|老家|回家/)) {
    return [
      { role: "知心朋友", name: "小暖", emoji: "🌸", reply: "人潮中的孤岛——我懂这种感觉。在一个充满人的地方却觉得自己是最透明的那一个。" },
      { role: "过来人", name: "老陈", emoji: "🧭", reply: "归属感不是城市给的，是自己给的。后来我在出租屋里养了一盆绿植、买了喜欢的毯子，那种'这里是我的角落'的感觉就慢慢来了。" },
      { role: "安慰者", name: "月月", emoji: "🌙", reply: "你正在建立属于自己的生活。每一步都在扎根，只是根还没长到你能感受到的程度。有一天你会发现——我属于这里。" },
    ];
  }

  if (input.match(/分手|失恋|感情|恋爱|表白|喜欢的人/)) {
    return [
      { role: "知心朋友", name: "小暖", emoji: "🌸", reply: "感情里纠结本身就已经是答案了——真正对的人不会让你反复犹豫。你的感受很重要，别让它发酵太久。" },
      { role: "过来人", name: "老陈", emoji: "🧭", reply: "后来我发现每段感情都在教我怎么爱下一个人，包括爱自己。先照顾好自己，对的人不会让你这么纠结。" },
      { role: "安慰者", name: "月月", emoji: "🌙", reply: "不管结局怎样，你都会好的。那些以为'再也遇不到这样的人了'的念头，都是大脑在骗你。你值得被好好爱。" },
    ];
  }

  if (input.match(/迷茫|不知道|不确定|方向|未来/)) {
    return [
      { role: "知心朋友", name: "小暖", emoji: "🌸", reply: "迷茫恰恰说明你在认真对待自己的人生。那些看起来很笃定的人，大部分也是在装。你不是走错了路，是在找路。" },
      { role: "过来人", name: "老陈", emoji: "🧭", reply: "我当年也是这样，后来不是'想通了'而是'做了'——随便选一个方向先走起来，走着走着路就清晰了。别让迷茫变成原地踏步的理由。" },
      { role: "安慰者", name: "月月", emoji: "🌙", reply: "给自己一点时间。不是所有问题都需要立刻有答案。你现在焦虑的大部分事情，回头看都不是事。" },
    ];
  }

  if (input.match(/孤独|一个人|没人理解|孤单/)) {
    return [
      { role: "知心朋友", name: "小暖", emoji: "🌸", reply: "你不是一个人在问这个问题。此刻有很多人和你一样感到孤独。说出'我孤独'本身就是在建立连接。" },
      { role: "过来人", name: "老陈", emoji: "🧭", reply: "孤独不会消失，但它会变形。从'好孤独好难受'变成'独处也挺好的'。后来我发现，真正懂我的人都是在独处时遇见的。" },
      { role: "安慰者", name: "月月", emoji: "🌙", reply: "你的深度让你感到孤独，但同样的深度也会让你遇见真正懂你的人。别怀疑自己。" },
    ];
  }

  if (input.match(/累|疲惫|撑不住|不想动/)) {
    return [
      { role: "知心朋友", name: "小暖", emoji: "🌸", reply: "累了就停下来，这不是放弃，是呼吸。你的身体在告诉你它需要休息，请认真听它的声音。" },
      { role: "过来人", name: "老陈", emoji: "🧭", reply: "休息完再出发的人，比硬撑着走的人走得更远。躺平一天不会毁掉你的人生，但继续硬撑可能会。" },
      { role: "安慰者", name: "月月", emoji: "🌙", reply: "今晚早点睡吧。什么都不做也是在做一件重要的事——叫做休息。明天太阳照常升起。" },
    ];
  }

  // 通用 fallback
  return [
    { role: "知心朋友", name: "小暖", emoji: "🌸", reply: "谢谢你愿意说出来。不管是什么，你都不是一个人在面对。能倾诉本身就需要勇气。" },
    { role: "过来人", name: "老陈", emoji: "🧭", reply: "我走过类似的路。那时候觉得走不出来，后来发现时间比想象中更宽容。慢慢来，不急。" },
    { role: "安慰者", name: "月月", emoji: "🌙", reply: "你值得被温柔对待。有些事不是你的错，有些情绪不需要理由。允许自己此刻不太好。" },
  ];
}

// ── 解析 AI 多视角回复 ──
function parseStructuredResponse(text: string): Array<{ role: string; name: string; emoji: string; reply: string }> | null {
  const results: Array<{ role: string; name: string; emoji: string; reply: string }> = [];

  const markers = [
    { keyword: "知心朋友", role: "知心朋友", name: "小暖", emoji: "🌸" },
    { keyword: "过来人", role: "过来人", name: "老陈", emoji: "🧭" },
    { keyword: "安慰者", role: "安慰者", name: "月月", emoji: "🌙" },
  ];

  for (const m of markers) {
    // 匹配标记后的内容，直到下一个标记或文本末尾
    const regex = new RegExp(
      `[【\\[\\(]?${m.keyword}[】\\]\\)]?[「"']?\\s*\\n*([\\s\\S]+?)(?=[【\\[\\(]?(?:知心朋友|过来人|安慰者)[】\\]\\)]?|$)`,
      "s"
    );
    const match = text.match(regex);
    if (match && match[1].trim().length > 10) {
      results.push({
        role: m.role,
        name: m.name,
        emoji: m.emoji,
        reply: match[1].trim(),
      });
    }
  }

  return results.length >= 2 ? results : null;
}

// ── 调用 Pollinations AI 生成树洞多视角回复 ──
async function generateRepliesWithAI(message: string): Promise<Array<{ role: string; name: string; emoji: string; reply: string }>> {
  const systemPrompt = `你是三个不同的倾听者，正在回复一个人的匿名倾诉。请分别从以下三个视角给出回复：

1. 知心朋友「小暖」：温暖共情，理解对方的感受，让对方知道"你不是一个人"
2. 过来人「老陈」：有实际经验，给出务实建议，像走过这条路的人
3. 温柔安慰者「月月」：温柔坚定，肯定对方的感受，让对方觉得被善待

规则：
- 每个角色回复 80-150 字
- 语气要真实自然，像真人聊天，不要空洞鸡汤
- 用第一人称"我"回复
- 如果倾诉内容是日常小事，就轻松幽默
- 如果是深刻困惑，就认真回应
- 直接写内容，不要加前缀
- 用换行分段

请严格用以下格式输出：
【知心朋友】
回复内容
【过来人】
回复内容
【安慰者】
回复内容`;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
        }),
      });

      if (response.ok) {
        const text = await response.text();
        if (text && text.length > 50) {
          const parsed = parseStructuredResponse(text);
          if (parsed && parsed.length >= 2) {
            return parsed;
          }
        }
      }

      if (response.status === 429 && attempt < 2) {
        await new Promise((r) => setTimeout(r, 3000 * (attempt + 1)));
        continue;
      }
      break;
    } catch (e) {
      console.error("Treehole AI call failed:", e);
      break;
    }
  }

  return getFallbackReplies(message);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body as { message?: string };

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "请输入内容" }, { status: 400 });
    }

    const replies = await generateRepliesWithAI(message.trim());
    return NextResponse.json({ replies });
  } catch (error) {
    console.error("Treehole API Error:", error);
    return NextResponse.json({ error: "服务器出了点问题" }, { status: 500 });
  }
}
