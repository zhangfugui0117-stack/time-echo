import { NextRequest, NextResponse } from "next/server";

// ── 调用 Pollinations AI 生成共鸣解读 ──
async function generateResonanceWithAI(userInput: string, matchedStories: string): Promise<string> {
  const systemPrompt = `你是一个"共鸣墙"上的解说者。用户刚刚在墙上贴了一张纸条，倾诉了自己的困惑。系统找到了几个和用户处境相似的人的故事。

你的任务是：
1. 用1-2句话告诉用户：你此刻的感受并不孤单，有人也经历过类似的困惑
2. 简要提及这些人的故事有什么共通之处
3. 语气温暖但不鸡汤，像一个站在墙边、看过所有纸条的人在跟你说话
4. 不要说"你不是一个人"这种套话，用更具体的表达
5. 控制在50-100字以内
6. 用换行分段`;

  const userPrompt = `我写的是：${userInput}

墙上相似的故事：
${matchedStories}

请生成共鸣解读。`;

  try {
    const response = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Pollinations API error: ${response.status}`);
    }

    const text = await response.text();
    // Pollinations returns plain text, try to parse as JSON first
    try {
      const data = JSON.parse(text);
      const content = data.choices?.[0]?.message?.content || data.content || text;
      return content.trim();
    } catch {
      // Plain text response
      return text.trim();
    }
  } catch (error) {
    console.error("Pollinations resonance API error:", error);
    throw error;
  }
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

export async function POST(request: NextRequest) {
  try {
    const { userInput, matchedStories } = await request.json();

    if (!userInput || !matchedStories) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 });
    }

    // 尝试 AI 生成
    try {
      const resonance = await generateResonanceWithAI(userInput, matchedStories);
      if (resonance && resonance.length > 10) {
        return NextResponse.json({ resonance, source: "ai" });
      }
    } catch (e) {
      console.log("AI resonance failed, using local fallback");
    }

    // Fallback
    const resonance = generateLocalResonance(userInput);
    return NextResponse.json({ resonance, source: "local" });

  } catch (error) {
    console.error("Resonance API error:", error);
    return NextResponse.json(
      { error: "服务暂时不可用，请稍后再试" },
      { status: 500 }
    );
  }
}
