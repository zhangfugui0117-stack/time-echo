"use client";

import { useState, useRef, useCallback, useEffect } from "react";

// ── 预置回声语料库 ──
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

// ── 共鸣墙预置故事 ──
const wallStories = [
  {
    id: "wall_01",
    emoji: "🏠",
    name: "匿名旅人",
    time: "2小时前",
    confession: "每天醒来第一个念头就是不想上班，但又不敢辞职。三年了，还是这样。",
    reflection: "后来我终于辞职了。不是冲动，是攒够了勇气。辞职那天我在出租屋里大哭了一场——不是伤心，是终于松了一口气。现在做自由设计，钱少一半但人活过来了。",
    tags: ["职业", "勇气", "选择"],
  },
  {
    id: "wall_02",
    emoji: "📚",
    name: "匿名书虫",
    time: "5小时前",
    confession: "考研考了两次还是没上岸，不知道要不要再试一次。",
    reflection: "第三次没考上之后我决定不再考了。不是放弃，是发现原来我考研是因为不知道自己想做什么。现在在做自媒体，虽然收入不稳定，但至少每天有方向。",
    tags: ["学业", "选择", "方向"],
  },
  {
    id: "wall_03",
    emoji: "🫂",
    name: "匿名守望者",
    time: "昨天",
    confession: "和最好的朋友渐行渐远了。不是吵架，就是慢慢不再联系。心里很难受但又不知道该说什么。",
    reflection: "我鼓起勇气给TA发了条消息：'最近好吗？' TA秒回了。原来TA也在等我开口。有些关系不是淡了，是双方都在等对方先迈一步。",
    tags: ["友情", "沟通", "孤独"],
  },
  {
    id: "wall_04",
    emoji: "🌊",
    name: "匿名漂泊者",
    time: "3天前",
    confession: "在大城市漂着找不到归属感。每天都是人潮中的孤岛。",
    reflection: "后来我在出租屋里养了一盆绿植，买了喜欢的毯子，冰箱里常备啤酒。那种'这是我的角落'的感觉慢慢就来了。归属感不是城市给的，是自己给自己的。",
    tags: ["城市", "归属感", "孤独"],
  },
  {
    id: "wall_05",
    emoji: "💫",
    name: "匿名星尘",
    time: "一周前",
    confession: "觉得自己永远不够好，不管怎么做都差一点。",
    reflection: "后来我发现'不够好'是个错觉。我总拿自己跟最厉害的人比，但忘了那些人也觉得自己不够好。标准是别人的，生活是自己的。承认'我还在路上'比假装'我已经到了'更勇敢。",
    tags: ["自我", "自信", "接纳"],
  },
  {
    id: "wall_06",
    emoji: "🌙",
    name: "匿名夜行者",
    time: "一周前",
    confession: "分手半年了还是走不出来，觉得自己很没用。",
    reflection: "一年后回头看，那段走不出来的日子其实是我重新认识自己的开始。不是走不出来，是不敢走出来——因为我把所有安全感都寄托在另一个人身上。现在学会了一个人也OK。",
    tags: ["感情", "失恋", "成长"],
  },
  {
    id: "wall_07",
    emoji: "🔥",
    name: "匿名燃者",
    time: "2周前",
    confession: "工作三年了还是不喜欢这个行业，但又怕转行从头开始太晚了。",
    reflection: "转行了。工资降了一半但人活过来了。以前觉得'稳定'最重要，后来发现每天睁眼不想上班才是最大的不稳定。26岁转行不算晚，36岁也不算晚——只要你还活着，就不晚。",
    tags: ["职业", "转行", "选择"],
  },
  {
    id: "wall_08",
    emoji: "🧩",
    name: "匿名拼图",
    time: "3周前",
    confession: "不知道自己到底适合什么，什么都做不好。",
    reflection: "花了两年试了四份工作才找到方向。每一份都'做不好'，但每一份都让我更了解自己：我不擅长什么，我讨厌什么，我真正在意什么。做不好不是失败，是在缩小搜索范围。",
    tags: ["自我", "方向", "迷茫"],
  },
];

// ── 共鸣匹配 ──
function matchWallStories(userInput: string, count = 3) {
  const keywords: Record<string, string[]> = {
    毕业: ["选择", "职业", "学业"],
    回家: ["选择", "城市", "家庭"],
    迷茫: ["方向", "自我", "迷茫"],
    喜欢: ["方向", "自我", "热爱"],
    父母: ["家庭", "沟通"],
    休学: ["学业", "选择"],
    分手: ["感情", "失恋", "成长"],
    感情: ["感情", "失恋"],
    工作: ["职业", "选择", "转行"],
    考研: ["学业", "选择", "方向"],
    意义: ["存在感", "意义", "人生"],
    不够好: ["自我", "自信", "接纳"],
    大城市: ["城市", "归属感", "孤独"],
    压力: ["压力", "焦虑", "职业"],
    孤独: ["孤独", "友情", "沟通"],
    辞职: ["职业", "勇气", "选择"],
    转行: ["职业", "转行", "选择"],
    朋友: ["友情", "沟通", "孤独"],
    爱情: ["感情", "失恋"],
    勇气: ["勇气", "选择"],
  };

  const scored = wallStories.map((story) => {
    let score = 0;
    const input = userInput.toLowerCase();
    for (const tag of story.tags) {
      if (input.includes(tag)) score += 3;
    }
    for (const [kw, related] of Object.entries(keywords)) {
      if (input.includes(kw)) {
        if (story.tags.some((t) => related.includes(t))) score += 2;
      }
    }
    // 随机因子，避免每次匹配完全一样
    score += Math.random() * 0.5;
    return { ...story, _score: score };
  });

  return scored.sort((a, b) => b._score - a._score).slice(0, count).map(({ _score, ...rest }) => rest);
}

// ── 回声匹配（给未来的自己模块） ──
function matchEchoes(userInput: string, count = 3) {
  const keywords: Record<string, string[]> = {
    毕业: ["职业", "家庭", "选择"],
    回家: ["城市", "选择"],
    迷茫: ["自我", "方向", "迷茫"],
    喜欢: ["方向", "自我"],
    父母: ["家庭", "沟通", "孤独"],
    休学: ["学业", "选择"],
    分手: ["感情", "失恋"],
    感情: ["感情", "恋爱", "表白"],
    工作: ["职业", "转行", "选择"],
    考研: ["学业", "选择"],
    意义: ["存在感", "意义", "人生"],
    不够好: ["自我", "自信", "接纳"],
    大城市: ["城市", "归属感", "压力"],
    压力: ["压力", "焦虑"],
    孤独: ["孤独", "关系"],
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

// ── API 调用 ──
async function fetchFutureReply(message: string, years: number) {
  const response = await fetch("/api/reply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, years }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `AI 服务暂时不可用 (${response.status})`);
  }
  return response.json();
}

async function fetchResonance(userInput: string, matchedStories: string) {
  const response = await fetch("/api/resonance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userInput, matchedStories }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `AI 服务暂时不可用 (${response.status})`);
  }
  return response.json();
}

// ── 打字机效果 Hook ──
function useTypewriter(speed = 35) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTyping = useCallback(
    (text: string) => {
      setDisplayedText("");
      setIsTyping(true);
      setIsDone(false);
      let index = 0;
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
        } else {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsTyping(false);
          setIsDone(true);
        }
      }, speed);
    },
    [speed]
  );

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { displayedText, isTyping, isDone, startTyping };
}

// ── 浮动粒子 ──
function Particles() {
  const particles = useRef(
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 15,
      duration: 15 + Math.random() * 20,
      size: 1 + Math.random() * 3,
    }))
  );

  return (
    <div className="particles">
      {particles.current.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
        />
      ))}
    </div>
  );
}

// ══════════════════════════════════════
// ── 主页面 ──
// ══════════════════════════════════════
export default function Home() {
  const [activeTab, setActiveTab] = useState<"future" | "wall">("future");

  // ── 给未来的自己 module state ──
  const [message, setMessage] = useState("");
  const [years, setYears] = useState("3");
  const [futurePhase, setFuturePhase] = useState<"input" | "loading" | "reply" | "echoes">("input");
  const [result, setResult] = useState<{
    reply: string;
    echoes: Array<{ id: string; question: string; reply: string; tags: string[] }>;
  } | null>(null);
  const [futureError, setFutureError] = useState("");
  const [capsuleEmail, setCapsuleEmail] = useState("");
  const [capsuleSealed, setCapsuleSealed] = useState(false);

  const { displayedText, isTyping, isDone, startTyping } = useTypewriter(35);

  // ── 共鸣墙 module state ──
  const [wallInput, setWallInput] = useState("");
  const [wallPhase, setWallPhase] = useState<"wall" | "writing" | "loading" | "resonance">("wall");
  const [matchedStories, setMatchedStories] = useState<Array<typeof wallStories[0]> | null>(null);
  const [resonanceMsg, setResonanceMsg] = useState("");
  const [wallError, setWallError] = useState("");
  const [userWallPosts, setUserWallPosts] = useState<Array<any>>([]);

  // ── 给未来的自己：提交处理 ──
  async function handleFutureSubmit() {
    if (!message.trim()) return;
    setFutureError("");
    setFuturePhase("loading");
    try {
      const data = await fetchFutureReply(message, Number(years));
      setResult(data);
      setFuturePhase("reply");
      startTyping(data.reply);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "网络出了点问题";
      setFutureError(msg);
      setFuturePhase("input");
    }
  }

  // 监听打字完成 → 显示回声
  useEffect(() => {
    if (futurePhase === "reply" && isDone && result) {
      const timer = setTimeout(() => setFuturePhase("echoes"), 800);
      return () => clearTimeout(timer);
    }
  }, [futurePhase, isDone, result]);

  // ── 共鸣墙：提交倾诉 ──
  async function handleWallSubmit() {
    if (!wallInput.trim()) return;
    setWallError("");
    setWallPhase("loading");

    // 匹配相似故事
    const matched = matchWallStories(wallInput, 3);
    setMatchedStories(matched);

    // 尝试调用 AI 生成共鸣解读
    try {
      const storiesText = matched.map(s => `${s.confession} → ${s.reflection}`).join("\n\n");
      const data = await fetchResonance(wallInput, storiesText);
      setResonanceMsg(data.resonance);
    } catch {
      // fallback：本地生成共鸣解读
      setResonanceMsg(generateLocalResonance(wallInput, matched));
    }
    setWallPhase("resonance");
  }

  // ── 本地共鸣解读 fallback ──
  function generateLocalResonance(input: string, matched: Array<typeof wallStories[0]>): string {
    const tags = matched.flatMap(s => s.tags);
    const uniqueTags = [...new Set(tags)].slice(0, 3);
    const tagStr = uniqueTags.map(t => `#${t}`).join(" ");
    return `你此刻的感受，关于${uniqueTags[0] || "人生"}的困惑——墙上那些纸条里，有人写过几乎相同的话。\n\n他们后来走了不同的路，但都从同一个起点出发。看看他们的后来，也许你会看到自己可能的未来。\n\n${tagStr}`;
  }

  // ── 共鸣墙：回到墙 ──
  function backToWall() {
    if (matchedStories && wallInput) {
      setUserWallPosts((prev) => [
        {
          id: `user_${Date.now()}`,
          emoji: "✨",
          name: "匿名倾诉者",
          time: "刚刚",
          confession: wallInput,
          reflection: resonanceMsg,
          tags: matchedStories.flatMap(s => s.tags).slice(0, 3),
        },
        ...prev,
      ]);
    }
    setWallInput("");
    setMatchedStories(null);
    setResonanceMsg("");
    setWallError("");
    setWallPhase("wall");
  }

  // ── 封存时间胶囊 ──
  function sealCapsule() {
    if (!capsuleEmail.trim()) return;
    setCapsuleSealed(true);
  }

  // ── 计算投递日期 ──
  function getDeliveryDate() {
    const now = new Date();
    now.setFullYear(now.getFullYear() + Number(years));
    return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
  }

  // ── 重置给未来的自己 ──
  function resetFuture() {
    setFuturePhase("input");
    setMessage("");
    setResult(null);
    setFutureError("");
    setCapsuleEmail("");
    setCapsuleSealed(false);
  }

  // ── 所有墙帖（预置 + 用户） ──
  const allWallPosts = [...userWallPosts, ...wallStories];

  return (
    <div className="relative min-h-screen flex flex-col items-center px-5 py-8 md:py-14">
      {/* 极光背景 */}
      <div className="aurora-bg">
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
        <div className="aurora-orb aurora-orb-3" />
        <div className="aurora-orb aurora-orb-4" />
      </div>
      <Particles />

      {/* 主内容 */}
      <main className="relative z-10 w-full max-w-xl flex flex-col items-center">
        {/* ── 标题区 ── */}
        <header className="text-center mb-8 md:mb-12 animate-[fadeIn_0.8s_ease]">
          <div className="inline-block mb-3 px-4 py-1.5 rounded-full glass-card text-xs tracking-widest text-white/40 font-sans">
            FROM ME TO WE
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 gradient-text" style={{ fontFamily: "var(--font-serif)" }}>
            时光回声
          </h1>
          <p className="text-sm text-white/40 font-sans tracking-wide">
            写一封信，寄给未来的自己 · 向他人倾诉，发现你不是一个人
          </p>
        </header>

        {/* ── Tab 切换器 ── */}
        <div className="w-full mb-6 flex gap-3 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
          <button
            onClick={() => { setActiveTab("future"); setFuturePhase("input"); setWallPhase("wall"); }}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === "future"
                ? "bg-gradient-to-r from-pink-500/20 to-violet-500/15 border border-pink-400/30 text-pink-200 shadow-lg shadow-pink-500/10"
                : "text-white/35 hover:text-white/55 hover:bg-white/[0.04]"
            }`}
          >
            ✦ 给未来的自己
          </button>
          <button
            onClick={() => { setActiveTab("wall"); setWallPhase("wall"); setFuturePhase("input"); }}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === "wall"
                ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/15 border border-emerald-400/30 text-emerald-200 shadow-lg shadow-emerald-500/10"
                : "text-white/35 hover:text-white/55 hover:bg-white/[0.04]"
            }`}
          >
            🌳 共鸣墙
          </button>
        </div>

        {/* ════════════════════════════════ */}
        {/* ── Module 1: 给未来的自己 ── */}
        {/* ════════════════════════════════ */}
        {activeTab === "future" && (
          <>
            {/* 错误提示 */}
            {futureError && (
              <div className="w-full mb-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-sm text-red-300/80 text-center animate-[fadeIn_0.3s_ease]">
                {futureError}
              </div>
            )}

            {/* ── Step 1: 输入区 ── */}
            {futurePhase === "input" && (
              <section className="w-full animate-[fadeIn_0.6s_ease]">
                <div className="glass-card p-6 md:p-8">
                  {/* 年份选择 */}
                  <div className="mb-5">
                    <label className="text-xs text-white/30 uppercase tracking-widest mb-3 block font-sans">
                      寄给几年后的自己
                    </label>
                    <div className="flex gap-2">
                      {[1, 3, 5, 10].map((y) => (
                        <button
                          key={y}
                          onClick={() => setYears(String(y))}
                          className={`flex-1 py-2.5 text-sm font-medium transition-all ${
                            years === String(y) ? "year-btn-active" : "year-btn text-white/40"
                          }`}
                        >
                          {y} 年后
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 输入框 */}
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleFutureSubmit();
                      }
                    }}
                    placeholder={"写下你想问的话...\n\n比如：三年后的我，现在不知道该不该休学"}
                    className="letter-input w-full h-36 p-4 text-base leading-relaxed text-white/90 placeholder-white/20 resize-none font-sans"
                    autoFocus
                  />

                  {/* 提交按钮 */}
                  <button
                    onClick={handleFutureSubmit}
                    disabled={!message.trim()}
                    className="send-btn mt-5 w-full py-3.5 text-base"
                  >
                    寄出这封信 ✦
                  </button>
                </div>

                <p className="text-center text-xs text-white/20 mt-4 font-sans">
                  不需要登录 · 不需要注册 · 打开就用
                </p>
              </section>
            )}

            {/* ── Loading ── */}
            {futurePhase === "loading" && (
              <section className="w-full text-center py-24 animate-[fadeIn_0.4s_ease]">
                <div className="loading-orb mx-auto mb-6" />
                <p className="text-white/50 text-sm font-sans">未来的你正在读信...</p>
                <p className="text-white/20 text-xs mt-2 font-sans">穿越时空需要一点时间</p>
              </section>
            )}

            {/* ── Step 2: 回信 + Step 3: 回声 ── */}
            {(futurePhase === "reply" || futurePhase === "echoes") && result && (
              <>
                {/* 回信卡片 */}
                <section className="w-full mb-6 reply-unfold">
                  <div className="glass-card p-6 md:p-8">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-pink-400/60 animate-pulse" />
                        <span className="text-xs uppercase tracking-widest text-pink-300/50 font-sans">
                          来自未来的回信
                        </span>
                      </div>
                      <span className="text-xs text-white/30 font-sans px-2.5 py-1 rounded-full bg-white/5">
                        {years} 年后
                      </span>
                    </div>

                    <div className="mb-6 pb-5 border-b border-white/5">
                      <p className="text-xs text-white/25 mb-1.5 font-sans">你问：</p>
                      <p className="text-white/60 italic font-serif text-sm leading-relaxed">
                        &ldquo;{message}&rdquo;
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-white/25 mb-3 font-sans">TA 回答：</p>
                      <div
                        className={`text-base md:text-lg leading-loose text-white/85 whitespace-pre-line font-serif ${
                          isTyping ? "typing-cursor" : "typing-done"
                        }`}
                      >
                        {displayedText}
                      </div>
                    </div>
                  </div>
                </section>

                {/* ── 回声区 ── */}
                {futurePhase === "echoes" && (
                  <section className="w-full animate-[fadeIn_0.6s_ease]">
                    <div className="text-center mb-6 relative">
                      <div className="absolute inset-x-0 top-1/2 h-px divider-line" />
                      <span className="relative inline-block bg-[#0c0a14] px-5 py-1.5 text-sm text-white/30 font-sans">
                        你不是唯一在问这个问题的人
                      </span>
                    </div>

                    <h2 className="text-center text-lg text-white/40 mb-5 font-serif">
                      ◈ 回声
                    </h2>

                    <div className="grid gap-3">
                      {result.echoes.map((echo, i) => (
                        <div
                          key={echo.id}
                          className="echo-card glass-card p-5 hover:bg-white/[0.06] transition-colors"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        >
                          <p className="text-sm text-white/50 italic mb-2.5 font-serif">
                            &ldquo;{echo.question}&rdquo;
                          </p>
                          <p className="text-sm text-white/40 leading-relaxed font-sans">
                            {echo.reply}
                          </p>
                          <div className="mt-3 flex gap-1.5 flex-wrap">
                            {echo.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-0.5 rounded-full bg-pink-500/8 text-pink-300/40 font-sans"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* ── 时间胶囊区域 ── */}
                    <div className="mt-8 text-center relative">
                      <div className="absolute inset-x-0 top-1/2 h-px divider-line" />
                      <span className="relative inline-block bg-[#0c0a14] px-5 py-1.5 text-sm text-white/30 font-sans">
                        让未来的你真正收到这封信
                      </span>
                    </div>

                    {!capsuleSealed ? (
                      <div className="mt-6 glass-card p-6 animate-[fadeIn_0.6s_ease]">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-lg">🔒</span>
                          <h3 className="text-sm text-white/50 font-serif">时间胶囊</h3>
                        </div>
                        <p className="text-xs text-white/25 mb-4 font-sans leading-relaxed">
                          封存这封信，它将在 <span className="text-amber-300/60">{getDeliveryDate()}</span> 投递到你的邮箱。
                          让未来的你真正读到此刻的心声。
                        </p>
                        <input
                          type="email"
                          value={capsuleEmail}
                          onChange={(e) => setCapsuleEmail(e.target.value)}
                          placeholder="输入你的邮箱地址"
                          className="letter-input w-full p-3.5 text-sm text-white/90 placeholder-white/20 font-sans"
                        />
                        <button
                          onClick={sealCapsule}
                          disabled={!capsuleEmail.trim() || !capsuleEmail.includes("@")}
                          className="send-btn mt-4 w-full py-3 text-sm"
                        >
                          封存这封信 🔒
                        </button>
                      </div>
                    ) : (
                      <div className="mt-6 glass-card p-6 md:p-8 text-center animate-[fadeIn_0.6s_ease] capsule-sealed">
                        <div className="text-5xl mb-4 animate-[fadeIn_0.8s_ease]">📜</div>
                        <h3 className="text-lg gradient-text font-serif mb-3">信已封存</h3>
                        <p className="text-sm text-white/50 font-sans mb-2">
                          这封信将在
                        </p>
                        <p className="text-xl text-amber-300/70 font-serif mb-4">
                          {getDeliveryDate()}
                        </p>
                        <p className="text-sm text-white/50 font-sans mb-2">
                          投递至
                        </p>
                        <p className="text-sm text-white/40 font-sans">
                          {capsuleEmail}
                        </p>
                        <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/8">
                          <p className="text-xs text-white/25 font-sans italic">
                            &ldquo;{message}&rdquo;
                          </p>
                        </div>
                        <p className="text-xs text-white/20 mt-4 font-sans">
                          时光胶囊概念演示 · 实际投递需要邮件服务支持
                        </p>
                      </div>
                    )}

                    {/* 再来一封 */}
                    <button
                      onClick={resetFuture}
                      className="mt-8 w-full py-3.5 rounded-2xl bg-white/5 border border-white/8 text-white/40 hover:text-white/70 hover:border-white/15 transition-all text-sm font-sans"
                    >
                      再写一封信 →
                    </button>
                  </section>
                )}
              </>
            )}
          </>
        )}

        {/* ════════════════════════════════ */}
        {/* ── Module 2: 共鸣墙 ── */}
        {/* ════════════════════════════════ */}
        {activeTab === "wall" && (
          <>
            {/* ── 共鸣墙 Feed ── */}
            {wallPhase === "wall" && (
              <section className="w-full animate-[fadeIn_0.6s_ease]">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold gradient-text font-serif mb-2">🌳 共鸣墙</h2>
                  <p className="text-sm text-white/30 font-sans">
                    每张纸条都是一个人的真实经历 · 你不是第一个走到这里的人
                  </p>
                </div>

                {/* 倾诉按钮 */}
                <button
                  onClick={() => setWallPhase("writing")}
                  className="send-btn w-full py-3.5 text-base mb-6"
                >
                  贴一张纸条 📝
                </button>

                {/* 纸条墙 */}
                <div className="grid gap-4">
                  {allWallPosts.map((post, i) => (
                    <div
                      key={post.id}
                      className="glass-card p-5 echo-card"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      {/* 纸条头部 */}
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className="text-lg">{post.emoji}</span>
                        <span className="text-xs text-white/40 font-sans">{post.name}</span>
                        <span className="text-xs text-white/20 font-sans">· {post.time}</span>
                      </div>

                      {/* 当时的心声 */}
                      <p className="text-sm text-white/60 font-sans leading-relaxed italic mb-3">
                        &ldquo;{post.confession}&rdquo;
                      </p>

                      {/* 后来发生的事 */}
                      {post.reflection && (
                        <div className="mt-2 p-3 rounded-xl bg-emerald-500/[0.06] border border-emerald-400/10">
                          <p className="text-xs text-emerald-300/40 mb-1.5 font-sans">后来的TA：</p>
                          <p className="text-sm text-emerald-200/60 font-sans leading-relaxed">
                            {post.reflection}
                          </p>
                        </div>
                      )}

                      {/* 标签 */}
                      <div className="mt-3 flex gap-1.5 flex-wrap">
                        {post.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/8 text-emerald-300/40 font-sans"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-center text-xs text-white/20 mt-6 font-sans">
                  每个人都在经历类似的困惑 · 你不是一个人
                </p>
              </section>
            )}

            {/* ── 共鸣墙：写纸条 ── */}
            {wallPhase === "writing" && (
              <section className="w-full animate-[fadeIn_0.6s_ease]">
                <div className="glass-card p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg">📝</span>
                    <h3 className="text-sm text-white/50 font-serif">贴一张纸条到墙上</h3>
                  </div>
                  <p className="text-xs text-white/25 mb-4 font-sans leading-relaxed">
                    写下你此刻的困惑或感受。墙上有很多人写过类似的话——你贴上之后，会看到他们也走过这条路，以及后来发生了什么。
                  </p>

                  {wallError && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300/80 text-center">
                      {wallError}
                    </div>
                  )}

                  <textarea
                    value={wallInput}
                    onChange={(e) => setWallInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleWallSubmit();
                      }
                    }}
                    placeholder={"写下此刻的感受...\n\n比如：最近工作压力太大了，每天都想辞职"}
                    className="letter-input w-full h-32 p-4 text-base leading-relaxed text-white/90 placeholder-white/20 resize-none font-sans"
                    autoFocus
                  />

                  <button
                    onClick={handleWallSubmit}
                    disabled={!wallInput.trim()}
                    className="send-btn mt-5 w-full py-3.5 text-base"
                  >
                    贴上去 🌳
                  </button>

                  <button
                    onClick={() => {
                      setWallInput("");
                      setWallError("");
                      setWallPhase("wall");
                    }}
                    className="mt-3 w-full py-2.5 rounded-xl bg-white/5 border border-white/8 text-white/30 hover:text-white/50 text-xs font-sans transition-all"
                  >
                    ← 回到共鸣墙
                  </button>
                </div>
              </section>
            )}

            {/* ── 共鸣墙：Loading ── */}
            {wallPhase === "loading" && (
              <section className="w-full text-center py-24 animate-[fadeIn_0.4s_ease]">
                <div className="loading-orb mx-auto mb-6" />
                <p className="text-white/50 text-sm font-sans">在墙上寻找共鸣...</p>
                <p className="text-white/20 text-xs mt-2 font-sans">有人在相似的地方留下过纸条</p>
              </section>
            )}

            {/* ── 共鸣墙：共鸣展示 ── */}
            {wallPhase === "resonance" && matchedStories && (
              <section className="w-full animate-[fadeIn_0.6s_ease]">
                {/* 用户原始倾诉 */}
                <div className="glass-card p-5 mb-5">
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="text-lg">✨</span>
                    <span className="text-xs text-white/40 font-sans">你的纸条</span>
                  </div>
                  <p className="text-sm text-white/70 font-sans leading-relaxed italic">
                    &ldquo;{wallInput}&rdquo;
                  </p>
                </div>

                {/* 共鸣解读 */}
                {resonanceMsg && (
                  <div className="mb-5 p-4 rounded-xl bg-emerald-500/[0.08] border border-emerald-400/15 text-center animate-[fadeIn_0.8s_ease]">
                    <p className="text-sm text-emerald-200/70 font-sans leading-relaxed whitespace-pre-line">
                      {resonanceMsg}
                    </p>
                  </div>
                )}

                {/* 分割线 */}
                <div className="text-center mb-5 relative">
                  <div className="absolute inset-x-0 top-1/2 h-px divider-line" />
                  <span className="relative inline-block bg-[#0c0a14] px-5 py-1.5 text-sm text-white/30 font-sans">
                    他们也走过这条路
                  </span>
                </div>

                {/* 匹配的故事卡片 */}
                <div className="grid gap-4">
                  {matchedStories.map((story, i) => (
                    <div
                      key={story.id}
                      className="glass-card p-5 echo-card"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    >
                      {/* 故事头部 */}
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className="text-lg">{story.emoji}</span>
                        <span className="text-xs text-white/40 font-sans">{story.name}</span>
                        <span className="text-xs text-white/20 font-sans">· {story.time}</span>
                      </div>

                      {/* 当时的困惑 */}
                      <p className="text-sm text-white/60 font-sans leading-relaxed italic mb-3">
                        &ldquo;{story.confession}&rdquo;
                      </p>

                      {/* 后来发生的事 */}
                      <div className="mt-2 p-3 rounded-xl bg-emerald-500/[0.06] border border-emerald-400/10">
                        <p className="text-xs text-emerald-300/40 mb-1.5 font-sans">后来的TA：</p>
                        <p className="text-sm text-emerald-200/60 font-sans leading-relaxed">
                          {story.reflection}
                        </p>
                      </div>

                      {/* 标签 */}
                      <div className="mt-3 flex gap-1.5 flex-wrap">
                        {story.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/8 text-emerald-300/40 font-sans"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 回到墙 */}
                <button
                  onClick={backToWall}
                  className="mt-8 w-full py-3.5 rounded-2xl bg-white/5 border border-white/8 text-white/40 hover:text-white/70 hover:border-white/15 transition-all text-sm font-sans"
                >
                  回到共鸣墙 → 你的纸条将出现在墙上
                </button>
              </section>
            )}
          </>
        )}
      </main>

      {/* 底部 */}
      <footer className="relative z-10 mt-auto pt-16 pb-6 text-center">
        <p className="text-xs text-white/15 font-sans tracking-wide">
          From Me to We · 让成长成为连接的力量
        </p>
      </footer>
    </div>
  );
}
