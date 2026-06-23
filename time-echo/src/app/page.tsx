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

// ── 调用后端 AI 生成回信 ──
async function generateReply(message: string, years: number): Promise<{ reply: string; echoes: ReturnType<typeof matchEchoes> }> {
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

// ── 主页面 ──
export default function Home() {
  const [message, setMessage] = useState("");
  const [years, setYears] = useState("3");
  const [phase, setPhase] = useState<"input" | "loading" | "reply" | "echoes">("input");
  const [result, setResult] = useState<{
    reply: string;
    echoes: Array<{ id: string; question: string; reply: string; tags: string[] }>;
  } | null>(null);
  const [error, setError] = useState("");

  const { displayedText, isTyping, isDone, startTyping } = useTypewriter(35);

  // ── 提交处理 ──
  async function handleSubmit() {
    if (!message.trim()) return;

    setError("");
    setPhase("loading");

    try {
      const data = await generateReply(message, Number(years));
      setResult(data);
      setPhase("reply");
      startTyping(data.reply);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "网络出了点问题";
      setError(msg);
      setPhase("input");
    }
  }

  // 监听打字完成，显示回声
  useEffect(() => {
    if (phase === "reply" && isDone && result) {
      const timer = setTimeout(() => setPhase("echoes"), 800);
      return () => clearTimeout(timer);
    }
  }, [phase, isDone, result]);

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
        <header className="text-center mb-10 md:mb-14 animate-[fadeIn_0.8s_ease]">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full glass-card text-xs tracking-widest text-white/40 font-sans">
            FROM ME TO WE
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 gradient-text" style={{ fontFamily: "var(--font-serif)" }}>
            时光回声
          </h1>
          <p className="text-sm text-white/40 font-sans tracking-wide">
            写一封信，寄给未来的自己
          </p>
        </header>

        {/* ── 错误提示 ── */}
        {error && (
          <div className="w-full mb-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-sm text-red-300/80 text-center animate-[fadeIn_0.3s_ease]">
            {error}
          </div>
        )}

        {/* ── Step 1: 输入区 ── */}
        {phase === "input" && (
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
                    handleSubmit();
                  }
                }}
                placeholder={"写下你想问的话...\n\n比如：三年后的我，现在不知道该不该休学"}
                className="letter-input w-full h-36 p-4 text-base leading-relaxed text-white/90 placeholder-white/20 resize-none font-sans"
                autoFocus
              />

              {/* 提交按钮 */}
              <button
                onClick={handleSubmit}
                disabled={!message.trim()}
                className="send-btn mt-5 w-full py-3.5 text-base"
              >
                寄出这封信 ✦
              </button>
            </div>

            {/* 提示 */}
            <p className="text-center text-xs text-white/20 mt-4 font-sans">
              不需要登录 · 不需要注册 · 打开就用
            </p>
          </section>
        )}

        {/* ── Loading 状态 ── */}
        {phase === "loading" && (
          <section className="w-full text-center py-24 animate-[fadeIn_0.4s_ease]">
            <div className="loading-orb mx-auto mb-6" />
            <p className="text-white/50 text-sm font-sans">未来的你正在读信...</p>
            <p className="text-white/20 text-xs mt-2 font-sans">穿越时空需要一点时间</p>
          </section>
        )}

        {/* ── Step 2: 回信展示 ── */}
        {(phase === "reply" || phase === "echoes") && result && (
          <>
            <section className="w-full mb-6 reply-unfold">
              <div className="glass-card p-6 md:p-8">
                {/* 回信标签 */}
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

                {/* 用户的问题 */}
                <div className="mb-6 pb-5 border-b border-white/5">
                  <p className="text-xs text-white/25 mb-1.5 font-sans">你问：</p>
                  <p className="text-white/60 italic font-serif text-sm leading-relaxed">
                    &ldquo;{message}&rdquo;
                  </p>
                </div>

                {/* AI 回信（打字机效果） */}
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

            {/* ── Step 3: 回声区 ── */}
            {phase === "echoes" && (
              <section className="w-full animate-[fadeIn_0.6s_ease]">
                {/* 分割线 + 文案 */}
                <div className="text-center mb-6 relative">
                  <div className="absolute inset-x-0 top-1/2 h-px divider-line" />
                  <span className="relative inline-block bg-[#0c0a14] px-5 py-1.5 text-sm text-white/30 font-sans">
                    你不是唯一在问这个问题的人
                  </span>
                </div>

                <h2 className="text-center text-lg text-white/40 mb-5 font-serif">
                  ◈ 回声
                </h2>

                {/* 回声卡片列表 */}
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

                {/* 再来一封 */}
                <button
                  onClick={() => {
                    setPhase("input");
                    setMessage("");
                    setResult(null);
                    setError("");
                  }}
                  className="mt-8 w-full py-3.5 rounded-2xl bg-white/5 border border-white/8 text-white/40 hover:text-white/70 hover:border-white/15 transition-all text-sm font-sans"
                >
                  再写一封信 →
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
