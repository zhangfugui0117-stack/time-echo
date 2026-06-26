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

// ── 树洞预置语料 ──
const treeholeSeeds = [
  {
    id: "th_01",
    emoji: "🏠",
    name: "匿名旅人",
    time: "2小时前",
    content: "每天醒来第一个念头就是不想上班，但又不敢辞职。三年了，还是这样。",
    replies: [
      { role: "知心朋友", name: "小暖", emoji: "🌸", reply: "我特别理解你。'不想上班'不是懒，是对现状的一种本能抗拒。你坚持了三年，说明你比想象中更有韧性。" },
      { role: "过来人", name: "老陈", emoji: "🧭", reply: "我也犹豫了三年。后来发现原地踏步本身就是一种选择——选择了忍受。早点做决定吧，不管选哪条路都比耗着强。" },
      { role: "安慰者", name: "月月", emoji: "🌙", reply: "你已经很勇敢了。能坚持三年本身就是勇气，很多人连承认'我不想上班'都不敢。" },
    ],
  },
  {
    id: "th_02",
    emoji: "📚",
    name: "匿名书虫",
    time: "5小时前",
    content: "考研考了两次还是没上岸，不知道要不要再试一次。",
    replies: [
      { role: "知心朋友", name: "小暖", emoji: "🌸", reply: "两次都没上岸真的很沮丧吧。但你的努力不会白费，即使结果不是你想要的，那些学到的东西都在你身上。" },
      { role: "过来人", name: "老陈", emoji: "🧭", reply: "我考了三次才上岸。但如果第三次还是没考上我会换路。不是放弃，是换一种方式到达。有时候绕路反而更快。" },
      { role: "安慰者", name: "月月", emoji: "🌙", reply: "你已经在努力了，这就够了。给自己一个拥抱，你值得。" },
    ],
  },
  {
    id: "th_03",
    emoji: "🫂",
    name: "匿名守望者",
    time: "昨天",
    content: "和最好的朋友渐行渐远了。不是吵架，就是慢慢不再联系。心里很难受但又不知道该说什么。",
    replies: [
      { role: "知心朋友", name: "小暖", emoji: "🌸", reply: "最难受的分离就是这样悄无声息的。不是吵架，只是慢慢不再联系。你心里一定有很多话想对TA说。" },
      { role: "过来人", name: "老陈", emoji: "🧭", reply: "后来我发现，有些友情就是有保质期的。不是谁做错了什么，是各自的轨道不同了。真正留下的朋友，不需要你刻意维护。" },
      { role: "安慰者", name: "月月", emoji: "🌙", reply: "那段美好的回忆不会消失，它们永远属于你。即使人不在身边，那些一起笑过的日子仍然温暖着你。" },
    ],
  },
  {
    id: "th_04",
    emoji: "🌊",
    name: "匿名漂泊者",
    time: "3天前",
    content: "在大城市漂着找不到归属感。每天都是人潮中的孤岛。",
    replies: [
      { role: "知心朋友", name: "小暖", emoji: "🌸", reply: "人潮中的孤岛——我懂这种感觉。在一个充满人的地方却觉得自己是最透明的那一个。" },
      { role: "过来人", name: "老陈", emoji: "🧭", reply: "归属感不是城市给的，是自己给的。后来我在出租屋里养了一盆绿植、买了喜欢的毯子，那种'这里是我的角落'的感觉就慢慢来了。" },
      { role: "安慰者", name: "月月", emoji: "🌙", reply: "你正在建立属于自己的生活。每一步都在扎根，只是根还没长到你能感受到的程度。" },
    ],
  },
  {
    id: "th_05",
    emoji: "💫",
    name: "匿名星尘",
    time: "一周前",
    content: "觉得自己永远不够好，不管怎么做都差一点。",
    replies: [
      { role: "知心朋友", name: "小暖", emoji: "🌸", reply: "你说的'差一点'其实说明你已经很接近了。那个'一点'不是你的缺陷，是成长的空间。" },
      { role: "过来人", name: "老陈", emoji: "🧭", reply: "后来我发现'不够好'是个错觉。我们总拿自己跟最厉害的人比，但忘了那些人也觉得自己不够好。标准是别人的，生活是自己的。" },
      { role: "安慰者", name: "月月", emoji: "🌙", reply: "你已经很好了，只是你自己暂时看不到。就像鱼不知道自己会游泳一样。给自己一点耐心。" },
    ],
  },
];

// ── 回声匹配 ──
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

async function fetchTreeholeReplies(message: string) {
  const response = await fetch("/api/treehole", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
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

// ── 听者角色颜色映射 ──
const roleColors: Record<string, { bg: string; border: string; text: string; accent: string }> = {
  "知心朋友": { bg: "bg-pink-500/8", border: "border-pink-300/20", text: "text-pink-200/80", accent: "#ec4899" },
  "过来人": { bg: "bg-amber-500/8", border: "border-amber-300/20", text: "text-amber-200/80", accent: "#f59e0b" },
  "安慰者": { bg: "bg-violet-500/8", border: "border-violet-300/20", text: "text-violet-200/80", accent: "#8b5cf6" },
};

// ══════════════════════════════════════
// ── 主页面 ──
// ══════════════════════════════════════
export default function Home() {
  const [activeTab, setActiveTab] = useState<"future" | "treehole">("future");

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

  // ── 树洞 module state ──
  const [treeholeInput, setTreeholeInput] = useState("");
  const [treeholePhase, setTreeholePhase] = useState<"feed" | "writing" | "loading" | "replies">("feed");
  const [treeholeReplies, setTreeholeReplies] = useState<Array<{ role: string; name: string; emoji: string; reply: string }> | null>(null);
  const [treeholeError, setTreeholeError] = useState("");
  const [userPosts, setUserPosts] = useState<Array<any>>([]);

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

  // ── 树洞：提交倾诉 ──
  async function handleTreeholeSubmit() {
    if (!treeholeInput.trim()) return;
    setTreeholeError("");
    setTreeholePhase("loading");
    try {
      const data = await fetchTreeholeReplies(treeholeInput);
      setTreeholeReplies(data.replies);
      setTreeholePhase("replies");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "网络出了点问题";
      setTreeholeError(msg);
      setTreeholePhase("writing");
    }
  }

  // ── 树洞：回到 feed ──
  function backToFeed() {
    if (treeholeReplies && treeholeInput) {
      // 把用户帖子加入 feed
      setUserPosts((prev) => [
        {
          id: `user_${Date.now()}`,
          emoji: "✨",
          name: "匿名倾诉者",
          time: "刚刚",
          content: treeholeInput,
          replies: treeholeReplies,
        },
        ...prev,
      ]);
    }
    setTreeholeInput("");
    setTreeholeReplies(null);
    setTreeholeError("");
    setTreeholePhase("feed");
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

  // ── 所有帖子（预置 + 用户） ──
  const allTreeholePosts = [...userPosts, ...treeholeSeeds];

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
        <div className="w-full mb-8 flex gap-2">
          <button
            onClick={() => setActiveTab("future")}
            className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-all ${
              activeTab === "future"
                ? "tab-active"
                : "bg-white/5 border border-white/8 text-white/30 hover:text-white/50 hover:border-white/15"
            }`}
          >
            ✦ 给未来的自己
          </button>
          <button
            onClick={() => setActiveTab("treehole")}
            className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-all ${
              activeTab === "treehole"
                ? "tab-active-treehole"
                : "bg-white/5 border border-white/8 text-white/30 hover:text-white/50 hover:border-white/15"
            }`}
          >
            🌳 树洞
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
        {/* ── Module 2: 树洞 ── */}
        {/* ════════════════════════════════ */}
        {activeTab === "treehole" && (
          <>
            {/* ── 树洞 Feed ── */}
            {treeholePhase === "feed" && (
              <section className="w-full animate-[fadeIn_0.6s_ease]">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold gradient-text font-serif mb-2">🌳 树洞</h2>
                  <p className="text-sm text-white/30 font-sans">
                    匿名倾诉你的烦恼，所有人都能倾听并即时回信
                  </p>
                </div>

                {/* 倾诉按钮 */}
                <button
                  onClick={() => setTreeholePhase("writing")}
                  className="send-btn w-full py-3.5 text-base mb-6"
                >
                  我想说点什么 🌳
                </button>

                {/* 帖子列表 */}
                <div className="grid gap-4">
                  {allTreeholePosts.map((post, i) => (
                    <div
                      key={post.id}
                      className="glass-card p-5 echo-card"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      {/* 帖子头部 */}
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className="text-lg">{post.emoji}</span>
                        <span className="text-xs text-white/40 font-sans">{post.name}</span>
                        <span className="text-xs text-white/20 font-sans">· {post.time}</span>
                      </div>

                      {/* 帖子内容 */}
                      <p className="text-sm text-white/70 font-sans leading-relaxed mb-4">
                        {post.content}
                      </p>

                      {/* 回信列表 */}
                      {post.replies && post.replies.length > 0 && (
                        <div className="grid gap-2.5 mt-3 pt-3 border-t border-white/5">
                          {post.replies.map((reply: any, j: number) => {
                            const colors = roleColors[reply.role] || roleColors["知心朋友"];
                            return (
                              <div
                                key={j}
                                className={`p-3.5 rounded-xl ${colors.bg} border ${colors.border}`}
                                style={{ animationDelay: `${(i * 0.1) + (j * 0.08)}s` }}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm">{reply.emoji}</span>
                                  <span className={`text-xs ${colors.text} font-sans`}>
                                    {reply.name}
                                  </span>
                                  <span className="text-xs text-white/20 font-sans">
                                    · {reply.role}
                                  </span>
                                </div>
                                <p className={`text-sm ${colors.text} font-sans leading-relaxed opacity-90`}>
                                  {reply.reply}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-center text-xs text-white/20 mt-6 font-sans">
                  每个人都在经历类似的困惑 · 你不是一个人
                </p>
              </section>
            )}

            {/* ── 树洞：写倾诉 ── */}
            {treeholePhase === "writing" && (
              <section className="w-full animate-[fadeIn_0.6s_ease]">
                <div className="glass-card p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg">🌳</span>
                    <h3 className="text-sm text-white/50 font-serif">匿名倾诉</h3>
                  </div>
                  <p className="text-xs text-white/25 mb-4 font-sans leading-relaxed">
                    写下你的烦恼，三位倾听者会即时回复你。完全匿名，没有人知道你是谁。
                  </p>

                  {treeholeError && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300/80 text-center">
                      {treeholeError}
                    </div>
                  )}

                  <textarea
                    value={treeholeInput}
                    onChange={(e) => setTreeholeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleTreeholeSubmit();
                      }
                    }}
                    placeholder={"写下你的烦恼...\n\n比如：最近工作压力太大了，每天都想辞职"}
                    className="letter-input w-full h-32 p-4 text-base leading-relaxed text-white/90 placeholder-white/20 resize-none font-sans"
                    autoFocus
                  />

                  <button
                    onClick={handleTreeholeSubmit}
                    disabled={!treeholeInput.trim()}
                    className="send-btn mt-5 w-full py-3.5 text-base"
                  >
                    倾诉 🌳
                  </button>

                  <button
                    onClick={() => {
                      setTreeholeInput("");
                      setTreeholeError("");
                      setTreeholePhase("feed");
                    }}
                    className="mt-3 w-full py-2.5 rounded-xl bg-white/5 border border-white/8 text-white/30 hover:text-white/50 text-xs font-sans transition-all"
                  >
                    ← 回到树洞
                  </button>
                </div>
              </section>
            )}

            {/* ── 树洞：Loading ── */}
            {treeholePhase === "loading" && (
              <section className="w-full text-center py-24 animate-[fadeIn_0.4s_ease]">
                <div className="loading-orb mx-auto mb-6" />
                <p className="text-white/50 text-sm font-sans">倾听者们正在阅读...</p>
                <p className="text-white/20 text-xs mt-2 font-sans">三位倾听者正在准备他们的回信</p>
              </section>
            )}

            {/* ── 树洞：回复展示 ── */}
            {treeholePhase === "replies" && treeholeReplies && (
              <section className="w-full animate-[fadeIn_0.6s_ease]">
                {/* 用户原始倾诉 */}
                <div className="glass-card p-5 mb-4">
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="text-lg">✨</span>
                    <span className="text-xs text-white/40 font-sans">你的倾诉</span>
                  </div>
                  <p className="text-sm text-white/70 font-sans leading-relaxed">
                    {treeholeInput}
                  </p>
                </div>

                {/* 分割线 */}
                <div className="text-center mb-5 relative">
                  <div className="absolute inset-x-0 top-1/2 h-px divider-line" />
                  <span className="relative inline-block bg-[#0c0a14] px-5 py-1.5 text-sm text-white/30 font-sans">
                    三位倾听者的回信
                  </span>
                </div>

                {/* 回信卡片 */}
                <div className="grid gap-3.5">
                  {treeholeReplies.map((reply, i) => {
                    const colors = roleColors[reply.role] || roleColors["知心朋友"];
                    return (
                      <div
                        key={i}
                        className="echo-card p-4 rounded-xl glass-card"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      >
                        <div className="flex items-center gap-2.5 mb-3">
                          <span
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                            style={{ background: `${colors.accent}20`, border: `1px solid ${colors.accent}40` }}
                          >
                            {reply.emoji}
                          </span>
                          <div>
                            <span className={`text-sm ${colors.text} font-sans block`}>{reply.name}</span>
                            <span className="text-xs text-white/20 font-sans">{reply.role}</span>
                          </div>
                        </div>
                        <p className={`text-sm ${colors.text} font-sans leading-relaxed opacity-90`}>
                          {reply.reply}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* 操作按钮 */}
                <button
                  onClick={backToFeed}
                  className="mt-8 w-full py-3.5 rounded-2xl bg-white/5 border border-white/8 text-white/40 hover:text-white/70 hover:border-white/15 transition-all text-sm font-sans"
                >
                  回到树洞 → 你的倾诉将出现在树洞中
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
