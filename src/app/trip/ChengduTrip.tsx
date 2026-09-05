"use client";

import { useState, useEffect, useRef } from "react";
import "./chengdu.css";

// ── Image extension fallback ──────────────────────────────────────────────────
const EXTS = ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG"];

function nextSrc(src: string): string | null {
  const d = src.lastIndexOf(".");
  const base = src.slice(0, d);
  const ext = src.slice(d + 1);
  const i = EXTS.indexOf(ext);
  return i < EXTS.length - 1 ? `${base}.${EXTS[i + 1]}` : null;
}

// ── FallbackImg: hero thumbnail inside each activity row ──────────────────────
function FallbackImg({ src, ...rest }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  return (
    <img
      {...rest}
      src={imgSrc}
      loading="lazy"
      alt=""
      onError={() => {
        const n = nextSrc(imgSrc);
        n ? setImgSrc(n) : setHidden(true);
      }}
    />
  );
}

// ── PhotoStrip: click-to-lightbox thumbnail row ───────────────────────────────
type SlotState = { src: string; hidden: boolean };

function PhotoStrip({
  folder,
  title,
  openLb,
}: {
  folder: string;
  title: string;
  openLb: (imgs: string[], idx: number, cap: string) => void;
}) {
  const MAX = 6;
  const [slots, setSlots] = useState<SlotState[]>(() =>
    Array.from({ length: MAX }, (_, i) => ({
      src: `/images/${folder}/${i + 1}.jpg`,
      hidden: false,
    }))
  );

  function handleError(i: number) {
    setSlots((prev) => {
      const n = nextSrc(prev[i].src);
      return prev.map((s, j) =>
        j !== i ? s : n ? { ...s, src: n } : { ...s, hidden: true }
      );
    });
  }

  function handleClick(clickedI: number) {
    const visible = slots
      .map((s, i) => ({ ...s, origIdx: i }))
      .filter((s) => !s.hidden);
    const pos = visible.findIndex((v) => v.origIdx === clickedI);
    openLb(
      visible.map((v) => v.src),
      pos >= 0 ? pos : 0,
      title
    );
  }

  const anyVisible = slots.some((s) => !s.hidden);
  if (!anyVisible) return null;

  return (
    <div className="b-strip">
      {slots.map((slot, i) =>
        slot.hidden ? null : (
          <img
            key={i}
            loading="lazy"
            src={slot.src}
            alt=""
            onError={() => handleError(i)}
            onClick={() => handleClick(i)}
          />
        )
      )}
    </div>
  );
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({
  imgs,
  idx,
  cap,
  onClose,
  onNav,
  onGoto,
}: {
  imgs: string[];
  idx: number;
  cap: string;
  onClose: () => void;
  onNav: (d: number) => void;
  onGoto: (i: number) => void;
}) {
  const touchX = useRef(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="lb open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <span className="lb-close" onClick={onClose}>✕</span>
      <span className="lb-nav lb-prev" onClick={() => onNav(-1)}>‹</span>
      <div
        className="lb-box"
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const d = touchX.current - e.changedTouches[0].clientX;
          if (Math.abs(d) > 40) onNav(d > 0 ? 1 : -1);
        }}
      >
        <img className="lb-img" src={imgs[idx]} alt="" />
        <div className="lb-dots">
          {imgs.map((_, i) => (
            <div key={i} className={`lb-dot${i === idx ? " on" : ""}`} onClick={() => onGoto(i)} />
          ))}
        </div>
        <p className="lb-cap">{cap}</p>
      </div>
      <span className="lb-nav lb-next" onClick={() => onNav(1)}>›</span>
    </div>
  );
}

// ── Main ChengduTrip component ────────────────────────────────────────────────
export default function ChengduTrip() {
  const [lb, setLb] = useState({ open: false, imgs: [] as string[], idx: 0, cap: "" });

  const openLb = (imgs: string[], idx: number, cap: string) =>
    setLb({ open: true, imgs, idx, cap });
  const closeLb = () => setLb((s) => ({ ...s, open: false }));
  const navLb = (d: number) =>
    setLb((s) => ({ ...s, idx: (s.idx + d + s.imgs.length) % s.imgs.length }));
  const gotoLb = (i: number) => setLb((s) => ({ ...s, idx: i }));

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      setLb((s) => {
        if (!s.open) return s;
        if (e.key === "ArrowLeft") return { ...s, idx: (s.idx - 1 + s.imgs.length) % s.imgs.length };
        if (e.key === "ArrowRight") return { ...s, idx: (s.idx + 1) % s.imgs.length };
        if (e.key === "Escape") { document.body.style.overflow = ""; return { ...s, open: false }; }
        return s;
      });
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Scroll-triggered reveal animations
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const delay = parseInt((entry.target as HTMLElement).dataset.animDelay || "0");
            setTimeout(() => entry.target.classList.add("vis"), delay);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll(".dc, .fc, .tc").forEach((el, i) => {
      (el as HTMLElement).dataset.animDelay = String((i % 4) * 90);
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const P = (folder: string, title: string) => (
    <PhotoStrip folder={folder} title={title} openLb={openLb} />
  );

  return (
    <>
      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="ink-orb" /><div className="ink-orb" /><div className="ink-orb" />
        <div className="vdeco l">金秋成都 · 探索之旅 · 二〇二六年</div>
        <div className="vdeco r">天府之国 · 美食天堂 · 慢生活圣地</div>
        <p className="eyebrow">2026 · 金秋 · 天府之国</p>
        <h1>成都<span>探索之旅</span></h1>
        <p>Singapore Airlines · Pagoda Design Hotel · 8天7夜深度游</p>
        <div className="pills">
          <span className="pill">SQ842 · 9月17日 出发</span>
          <span style={{ color: "rgba(255,255,255,.3)" }}>——</span>
          <span className="pill">SQ843 · 9月24日 返程</span>
        </div>
        <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 20, position: "relative", animation: "fu 1s .6s ease both" }}>
          {["Winston", "Andy"].map((name, i) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {i > 0 && <span style={{ color: "rgba(255,255,255,.2)", fontSize: 18 }}>·</span>}
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(212,160,23,.2)", border: "2px solid rgba(212,160,23,.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👨</div>
              <span style={{ color: "rgba(255,255,255,.75)", fontSize: 14, letterSpacing: 1 }}>{name}</span>
            </div>
          ))}
        </div>
        <div className="scrollhint"><div className="sline" /><span>向下滑动</span></div>
      </section>

      {/* ══ FLIGHT BANNER ═════════════════════════════════════════════════════ */}
      <div className="fbanner">
        <div className="finner">
          <div className="fleg">
            <span className="sub">SINGAPORE AIRLINES · 出发</span>
            <span className="num">SQ 842</span>
            <span className="rt">🇸🇬 SIN T3 → 🇨🇳 TFU T1</span>
            <span className="tm">9月17日 · 12:25 → 17:10 · 约 4h 45m</span>
          </div>
          <div className="fdiv">✈<span>直飞</span></div>
          <div className="fleg r">
            <span className="sub">SINGAPORE AIRLINES · 返程</span>
            <span className="num">SQ 843</span>
            <span className="rt">🇨🇳 TFU T1 → 🇸🇬 SIN T3</span>
            <span className="tm">9月24日 · 约 4h 飞行</span>
          </div>
        </div>
      </div>

      {/* ══ HOTEL STRIP ═══════════════════════════════════════════════════════ */}
      <div className="hstrip">
        <div className="hinner">
          <div style={{ fontSize: 26 }}>🏨</div>
          <div className="hinfo">
            <h3>Pagoda Design Hotel Chengdu · 成都太古里柏廿设计酒店</h3>
            <p>锦江区华兴东街16号 · 9月17–24日（7晚）· Check-in 15:00 · Check-out 12:00</p>
            <p style={{ marginTop: 4, fontSize: 12, color: "var(--muted)" }}>
              🛏️ 高楼层城景房 · 2张单人床 &nbsp;·&nbsp; 🍳 含每日早餐 &nbsp;·&nbsp; ⭐ 五星级
            </p>
          </div>
          <span className="hbadge">⭐ 五星 · 太古里 步行可达</span>
        </div>
      </div>

      {/* ══ OVERVIEW STATS ════════════════════════════════════════════════════ */}
      <div className="ovw">
        {[["8","天 · 行程"],["7","晚 · Pagoda Hotel"],["12","个 · 景点"],["20°","早晚凉爽"],["🐼","国宝必看"]].map(([n,l]) => (
          <div className="ovw-i" key={l}><div className="n">{n}</div><div className="l">{l}</div></div>
        ))}
      </div>

      {/* ══ TICKER ════════════════════════════════════════════════════════════ */}
      <div className="ticker-wrap">
        <div className="ticker-track">
          {["成都探索之旅","2026 · 金秋","Pagoda Design Hotel","大熊猫繁育基地","三星堆博物馆","都江堰 · 青城山","黄龙溪古镇","武侯祠 · 锦里","天府之国","SQ 842",
            "成都探索之旅","2026 · 金秋","Pagoda Design Hotel","大熊猫繁育基地","三星堆博物馆","都江堰 · 青城山","黄龙溪古镇","武侯祠 · 锦里","天府之国","SQ 842"].map((t, i) => (
            <span key={i}><span className="ti">{t}</span><span className="ts">✦</span></span>
          ))}
        </div>
      </div>

      {/* ══ ITINERARY ═════════════════════════════════════════════════════════ */}
      <div className="sec">
        <div className="sec-h"><div className="ln" /><span style={{ fontSize: 22 }}>🗺️</span><h2>每日行程</h2><div className="ln" /></div>
        <div className="tl">

          {/* Day 1 */}
          <div className="dc" id="day-1">
            <div className="dot">一</div>
            <div className="dh"><span className="ddate">9月17日（周四）</span><span className="dtitle">飞抵成都 · 初见繁华</span><span className="dtag">轻松</span></div>
            <div className="db">
              <div className="sr">
                <div className="si"><FallbackImg src="/images/changi/1.jpg" /><span className="tlabel">早上</span></div>
                <div className="sc">
                  <div className="act">✈️ SQ842 樟宜 T3 起飞</div>
                  <div className="tip">约 10:00 到机场，先去 Marhaba Lounge 悠闲吃早餐候机。12:25 起飞，约 17:10 抵达成都天府机场 T1，飞行 4h 45m。</div>
                  <div className="bgs"><span className="tb s">提前 2.5h 到达 Changi T3</span><span className="tb s">☕ Marhaba Lounge T3</span></div>
                  {P("changi","樟宜机场 T3 · Marhaba Lounge")}
                </div>
              </div>
              <div className="sr">
                <div className="si"><FallbackImg src="/images/pagoda-hotel/1.jpg" /><span>🏨</span><span className="tlabel">傍晚</span></div>
                <div className="sc">
                  <div className="act">🏨 入住 Pagoda Design Hotel Chengdu</div>
                  <div className="tip">机场至酒店约 50km，打车约 50 分钟（¥120–150），或预订酒店商务车 ¥300</div>
                  {P("pagoda-hotel","Pagoda Design Hotel Chengdu")}
                </div>
              </div>
              <div className="sr">
                <div className="si" style={{ background: "#f5f0e8" }}><FallbackImg src="/images/aishan-hotpot/1.jpg" /><span>🍄</span><span className="tlabel">晚餐</span></div>
                <div className="sc">
                  <div className="act">🍄 爱尚菌·云南野生菌火锅（春熙路太古里店）</div>
                  <div className="addr">📍 成都市锦江区东大街388号香槟广场3楼</div>
                  <div className="tip">步行约6分钟。菌子季9月食材最新鲜，清鲜汤底暖胃，完美第一晚。人均约¥104。</div>
                  <div className="bgs"><span className="tb" style={{ background: "#FFF8E7", color: "#7B5E00", borderColor: "#F0D080" }}>🍄 旺季建议提前大众点评预约</span></div>
                  {P("aishan-hotpot","爱尚菌野生菌火锅")}
                </div>
              </div>
              <div className="sr">
                <div className="si"><FallbackImg src="/images/ifs-taikoo/1.jpg" /><span>🐼</span><span className="tlabel">夜晚</span></div>
                <div className="sc">
                  <div className="act">🐼 IFS 爬墙熊猫 → 远洋太古里</div>
                  <div className="addr">📍 IFS：成都市锦江区红星路三段1号 · 太古里：中纱帽街8号</div>
                  <div className="tip">饭后步行约 5 分钟，裸眼 3D 大屏打卡圣地</div>
                  {P("ifs-taikoo","IFS 爬墙熊猫 · 太古里")}
                </div>
              </div>
            </div>
          </div>

          {/* Day 2 */}
          <div className="dc" id="day-2">
            <div className="dot">二</div>
            <div className="dh"><span className="ddate">9月18日（周五）</span><span className="dtitle">国宝熊猫 · 东郊记忆 · SKP · 双子塔</span><span className="dtag">必去</span></div>
            <div className="db">
              <div className="sr">
                <div className="si"><FallbackImg src="/images/panda-base/1.jpg" /><span>🐼</span><span className="tlabel">早上</span></div>
                <div className="sc">
                  <div className="act">🐼 成都大熊猫繁育研究基地</div>
                  <div className="addr">📍 成都市成华区熊猫大道1375号</div>
                  <div className="tip">8:00 前入园，上午熊猫最活跃。打车约 20 分钟。</div>
                  <div className="bgs"><span className="tb m">⚠️ 提前14天公众号预约</span></div>
                  {P("panda-base","成都大熊猫繁育研究基地")}
                </div>
              </div>
              <div className="sr">
                <div className="si"><FallbackImg src="/images/dongjiaojiyi/1.jpg" /><span>🎨</span><span className="tlabel">下午</span></div>
                <div className="sc">
                  <div className="act">🎨 东郊记忆文创园</div>
                  <div className="addr">📍 成都市成华区建设南路4号</div>
                  <div className="tip">旧工厂改造文艺街区，壁画打卡、手冲咖啡</div>
                  {P("dongjiaojiyi","东郊记忆文创园")}
                </div>
              </div>
              <div className="sr">
                <div className="si"><FallbackImg src="/images/skp/1.jpg" /><span>🌊</span><span className="tlabel">夜晚</span></div>
                <div className="sc">
                  <div className="act">🌊 成都 SKP · 音乐喷泉 + 双子塔灯光秀</div>
                  <div className="addr">📍 成都市武侯区武侯大道199号（地铁3/7号线武侯大道站）</div>
                  <div className="tip">SKP 广场音乐喷泉水柱表演后，前往交子公园观赏双子塔灯光秀，色彩变幻绚烂，建议 21:00 后观看。</div>
                  {P("skp","成都SKP · 音乐喷泉 · 双子塔")}
                </div>
              </div>
            </div>
          </div>

          {/* Day 3 */}
          <div className="dc" id="day-3">
            <div className="dot">三</div>
            <div className="dh"><span className="ddate">9月19日（周六）</span><span className="dtitle">博物馆 · 茶馆 · 宽窄巷 · 嘉嘉</span><span className="dtag">文化</span></div>
            <div className="db">
              <div className="sr">
                <div className="si"><FallbackImg src="/images/chengdu-museum/1.jpg" /><span>🏛️</span><span className="tlabel">上午</span></div>
                <div className="sc">
                  <div className="act">🏛️ 成都博物馆</div>
                  <div className="addr">📍 成都市青羊区小河街1号（天府广场西侧）</div>
                  <div className="tip">地铁2号线春熙路站→天府广场站（1站，西1出口直达），或步行约20分钟，免费，需公众号预约</div>
                  <div className="bgs"><span className="tb m">周一闭馆</span></div>
                  {P("chengdu-museum","成都博物馆")}
                </div>
              </div>
              <div className="sr">
                <div className="si"><FallbackImg src="/images/heming-teahouse/1.jpg" /><span>🍵</span><span className="tlabel">下午</span></div>
                <div className="sc">
                  <div className="act">🍵 人民公园 · 鹤鸣茶社</div>
                  <div className="addr">📍 成都市青羊区少城路12号（人民公园内）</div>
                  <div className="tip">5 元盖碗茶 + 采耳，最地道的成都慢生活</div>
                  {P("heming-teahouse","人民公园 · 鹤鸣茶社")}
                </div>
              </div>
              <div className="sr">
                <div className="si"><FallbackImg src="/images/kuanzhai/1.jpg" /><span>🏘️</span><span className="tlabel">傍晚</span></div>
                <div className="sc">
                  <div className="act">🏘️ 宽窄巷子夜游</div>
                  <div className="addr">📍 成都市青羊区宽巷子37号</div>
                  <div className="tip">傍晚人少，历史街区，伴手礼选购</div>
                  {P("kuanzhai","宽窄巷子")}
                </div>
              </div>
              <div className="sr">
                <div className="si" style={{ background: "#fef0f5" }}><FallbackImg src="/images/jiajia/1.jpg" /><span>🥂</span><span className="tlabel">晚上</span></div>
                <div className="sc">
                  <div className="act">🥂 与嘉嘉聚餐</div>
                  <div className="tip">久别重逢！嘉嘉是成都本地人，地道餐厅由她来定，跟着本地人吃才是真正的成都味。</div>
                  <div className="bgs"><span className="tb" style={{ background: "#FEE2F0", color: "#9D174D", borderColor: "#FBCFE8" }}>👧 本地朋友带路</span></div>
                  {P("jiajia","与嘉嘉聚餐")}
                </div>
              </div>
            </div>
          </div>

          {/* Day 4 */}
          <div className="dc" id="day-4">
            <div className="dot">四</div>
            <div className="dh"><span className="ddate">9月20日（周日）</span><span className="dtitle">都江堰 · 青城山 · 蜀境雅韵宴</span><span className="dtag">郊游</span></div>
            <div className="db">
              <div className="sr">
                <div className="si"><FallbackImg src="/images/dujiangyan-qingcheng/1.jpg" /><span>⛰️</span><span className="tlabel">全天</span></div>
                <div className="sc">
                  <div className="act">💧 都江堰 + ⛰️ 青城山</div>
                  <div className="addr">📍 都江堰：四川省都江堰市都江堰景区 · 青城山：都江堰市青城山镇</div>
                  <div className="tip">成灌快铁犀浦站出发约 40 分钟，两景区打车串联约 ¥60。青城山有超萌自拍熊猫！</div>
                  {P("dujiangyan-qingcheng","都江堰 · 青城山")}
                </div>
              </div>
              <div className="sr">
                <div className="si"><FallbackImg src="/images/shu-gong-yan-dinner/1.jpg" /><span>🍷</span><span className="tlabel">晚上</span></div>
                <div className="sc">
                  <div className="act">🍷 蜀境雅韵宴 · 晚宴</div>
                  <div className="tip">19:00 开宴，预选座位 第一排-1-22 · 第一排-1-23。总价 ¥996（定金 ¥200 已支付）。</div>
                  {P("shu-gong-yan-dinner","蜀境雅韵宴 · 晚宴")}
                </div>
              </div>
            </div>
          </div>

          {/* Day 5 */}
          <div className="dc" id="day-5">
            <div className="dot">五</div>
            <div className="dh"><span className="ddate">9月21日（周一）</span><span className="dtitle">黄龙溪古镇 · 武侯祠 · 锦里</span><span className="dtag">人文</span></div>
            <div className="db">
              <div className="sr">
                <div className="si"><FallbackImg src="/images/huanglongxi/1.jpg" /><span>🏘️</span><span className="tlabel">上午</span></div>
                <div className="sc">
                  <div className="act">🏘️ 黄龙溪古镇</div>
                  <div className="addr">📍 成都市双流区黄龙溪镇</div>
                  <div className="tip">距市区约 40km，青石板街道、明清建筑、古码头边喝盖碗茶，悠闲半天。打车约 40 分钟。</div>
                  {P("huanglongxi","黄龙溪古镇")}
                </div>
              </div>
              <div className="sr">
                <div className="si"><FallbackImg src="/images/wuhouci-jinli/1.jpg" /><span>🏮</span><span className="tlabel">下午</span></div>
                <div className="sc">
                  <div className="act">⚔️ 武侯祠 → 🏮 锦里夜景</div>
                  <div className="addr">📍 武侯祠：成都市武侯区武侯祠大街231号 · 锦里：武侯祠大街251号</div>
                  <div className="tip">古镇返市区后前往武侯祠，打车约 30 分钟。锦里夜晚 8 点后最迷人。</div>
                  {P("wuhouci-jinli","武侯祠 · 锦里")}
                </div>
              </div>
            </div>
          </div>

          {/* Day 6 */}
          <div className="dc" id="day-6">
            <div className="dot">六</div>
            <div className="dh"><span className="ddate">9月22日（周二）</span><span className="dtitle">三星堆 · 古蜀文明</span><span className="dtag">震撼</span></div>
            <div className="db">
              <div className="sr">
                <div className="si"><FallbackImg src="/images/sanxingdui/1.jpg" /><span>🏺</span><span className="tlabel">全天</span></div>
                <div className="sc">
                  <div className="act">🏺 三星堆博物馆（广汉）</div>
                  <div className="addr">📍 四川省德阳市广汉市三星堆镇真武村三星堆路</div>
                  <div className="tip">青铜神树、纵目面具，古蜀文明震撼首选。成都北站高铁约 20 分钟至广汉。</div>
                  <div className="bgs"><span className="tb m">⚠️ 提前5天官方小程序抢票！</span></div>
                  {P("sanxingdui","三星堆博物馆")}
                </div>
              </div>
            </div>
          </div>

          {/* Day 7 */}
          <div className="dc" id="day-7">
            <div className="dot">七</div>
            <div className="dh"><span className="ddate">9月23日（周三）</span><span className="dtitle">芳草街 · 华姿路 Citywalk</span><span className="dtag">悠闲漫步</span></div>
            <div className="db">
              <div className="sr">
                <div className="si"><FallbackImg src="/images/fangcao-citywalk/1.jpg" /><span>🚶</span><span className="tlabel">下午</span></div>
                <div className="sc">
                  <div className="act">🚶 芳草街 → 华姿路 漫游</div>
                  <div className="addr">📍 成都市武侯区芳草街（地铁3号线芳草街站D口出发）→ 华姿路火烧堰</div>
                  <div className="tip">白夜花神诗空间咖啡打卡，步行至华姿路棕榈树巷道（火烧堰碧翠廊），全程约 1.5km，轻松半天，穿舒服的鞋即可。</div>
                  {P("fangcao-citywalk","芳草街 · 华姿路")}
                </div>
              </div>
            </div>
          </div>

          {/* Day 8 */}
          <div className="dc" id="day-8">
            <div className="dot">八</div>
            <div className="dh"><span className="ddate">9月24日（周四）</span><span className="dtitle">自由漫游 · SQ843 返程</span><span className="dtag">收尾</span></div>
            <div className="db">
              <div className="sr">
                <div className="si"><FallbackImg src="/images/free-day/1.jpg" /><span>☀️</span><span className="tlabel">上午</span></div>
                <div className="sc">
                  <div className="act">☀️ 自由活动 · 最后的成都时光</div>
                  <div className="tip">漫无目的地溜达才是旅行最好的结尾。顺道补购手信：郫县豆瓣、汉源花椒、熊猫文创。Check-out 12:00，行李可寄存前台。</div>
                  {P("free-day","成都最后一天")}
                </div>
              </div>
              <div className="sr">
                <div className="si"><FallbackImg src="/images/tfu-airport/1.jpg" /><span>✈️</span><span className="tlabel">下午</span></div>
                <div className="sc">
                  <div className="act">✈️ 前往 TFU · SQ843 返新加坡</div>
                  <div className="addr">📍 成都天府国际机场（TFU）T1 航站楼</div>
                  <div className="tip">出发前 3h 前往机场（TFU T1），打车约 50 分钟（¥120–150）</div>
                  <div className="bgs"><span className="tb s">TFU T1 → 樟宜 T3</span></div>
                  {P("tfu-airport","成都天府国际机场")}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ══ FOOD LIST ═════════════════════════════════════════════════════════ */}
      <hr className="div" />
      <div className="sec">
        <div className="sec-h"><div className="ln" /><span style={{ fontSize: 22 }}>🍜</span><h2>必吃美食清单</h2><div className="ln" /></div>
        <div className="fg">
          {[
            ["🍄","爱尚菌野生菌火锅","17号晚首选！菌子季鲜味绝顶，清鲜暖胃，香槟广场3楼。"],
            ["🫕","火锅","电台巷、巴蜀大将，巷子里人多的那家准没错。中辣 or 微辣？"],
            ["🍢","串串香","马路边边、钢管厂五区，麻辣鲜香，边走边吃才够巴适。"],
            ["🥟","成都小吃","甜水面、叶儿粑、蛋烘糕（一定要加肉松！）随处可见。"],
            ["🍲","正宗川菜","陶德砂锅、吃客餐厅、陈麻婆豆腐，百吃不厌。"],
            ["🐰","夜宵","双流老妈兔头、奎星楼街脑花，成都夜宵是另一种信仰。"],
          ].map(([icon, name, desc]) => (
            <div className="fc" key={name}>
              <div className="fi">{icon}</div>
              <div><h3>{name}</h3><p>{desc}</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ TIPS ══════════════════════════════════════════════════════════════ */}
      <hr className="div" />
      <div className="sec">
        <div className="sec-h"><div className="ln" /><span style={{ fontSize: 22 }}>💡</span><h2>出行锦囊</h2><div className="ln" /></div>
        <div className="tg">
          <div className="tc"><h3>✈️ 航班提示</h3><p>SQ842/843 直飞 TFU，约 4h 45m，两地同为 UTC+8 无时差。</p></div>
          <div className="tc"><h3>🏨 Pagoda Design Hotel 小贴士</h3><ul><li>步行即达太古里 · 春熙路商圈</li><li>Check-in 15:00 · Check-out 12:00</li><li>机场商务车 ¥300 单程，礼宾部预订</li></ul></div>
          <div className="tc"><h3>🎟️ 熊猫基地预约</h3><p>提前 <strong>14天</strong> 在"成都大熊猫繁育研究基地"公众号购票，选上午场。</p></div>
          <div className="tc"><h3>🏺 三星堆抢票</h3><p>提前 <strong>5天</strong> 官方小程序抢票，9月旺季票秒没，调好闹钟。</p></div>
          <div className="tc"><h3>🚇 市内交通</h3><p>支付宝/微信乘车码直接刷地铁。酒店附近春熙路站（2/3号线）。</p></div>
          <div className="tc"><h3>👟 天气与穿着</h3><p>20–28°C，备晴雨伞（华西秋雨），每天约 2 万步，平底鞋 + 薄外套标配。</p></div>
        </div>
      </div>

      {/* ══ OUTRO ═════════════════════════════════════════════════════════════ */}
      <div className="outro">
        <blockquote>
          让我们烫起红锅，辣到微汗，<br />
          在这座永远不急不慢的城市里，<br />
          把每一天都过成"巴适得板"。
        </blockquote>
        <p className="auth">— SQ842 · 2026年9月17日 · Winston &amp; Andy · 成都金秋之旅</p>
        <br /><br />
        <span className="spice">🌶️ 请提前表态：中辣 还是 微辣？</span>
        <br /><br />
        <a
          href="https://chat.whatsapp.com/JTxs04lAvFd3npGYLnqaEW?mode=gi_t"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#25D366", color: "#fff", padding: "12px 28px", borderRadius: 40, fontSize: 14, letterSpacing: 1, textDecoration: "none", marginTop: 8 }}
        >
          <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, fill: "#fff", flexShrink: 0 }}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.859L.057 23.899l6.22-1.635A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.001-1.368l-.36-.214-3.713.976.992-3.622-.234-.373A9.818 9.818 0 1112 21.818z" />
          </svg>
          加入旅行 WhatsApp 群组
        </a>
      </div>

      {/* ══ LIGHTBOX ══════════════════════════════════════════════════════════ */}
      {lb.open && (
        <Lightbox
          imgs={lb.imgs}
          idx={lb.idx}
          cap={lb.cap}
          onClose={closeLb}
          onNav={navLb}
          onGoto={gotoLb}
        />
      )}
    </>
  );
}
