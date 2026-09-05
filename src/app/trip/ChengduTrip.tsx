"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

// ── DayGallery: click-to-lightbox grid pulling one photo from each of several
// named folders, each with its own caption — used for the per-day header grid ──
type GalleryItem = { folder: string; slot: number; caption: string };

function DayGallery({
  items,
  openLb,
}: {
  items: GalleryItem[];
  openLb: (imgs: string[], idx: number, cap: string) => void;
}) {
  // Tiles start unset and are only populated after mount — otherwise the
  // browser can start fetching the guessed src straight from the
  // server-rendered HTML before React finishes attaching onError, and a
  // failed guess never gets retried.
  type Tile = { src: string; hidden: boolean };
  const [tiles, setTiles] = useState<Tile[] | null>(null);

  useEffect(() => {
    setTiles(items.map((it) => ({ src: `/images/${it.folder}/${it.slot}.jpg`, hidden: false })));
  }, [items]);

  function handleError(i: number) {
    setTiles((prev) => {
      if (!prev) return prev;
      const n = nextSrc(prev[i].src);
      return prev.map((t, j) => (j !== i ? t : n ? { ...t, src: n } : { ...t, hidden: true }));
    });
  }

  function handleClick(clickedI: number) {
    if (!tiles) return;
    const visible = tiles
      .map((t, i) => ({ ...t, origIdx: i }))
      .filter((t) => !t.hidden);
    const pos = visible.findIndex((v) => v.origIdx === clickedI);
    openLb(
      visible.map((v) => v.src),
      pos >= 0 ? pos : 0,
      items[clickedI]?.caption ?? ""
    );
  }

  if (!tiles || !tiles.some((t) => !t.hidden)) return null;

  return (
    <div className="day-gallery">
      {tiles.map((tile, i) =>
        tile.hidden ? null : (
          <div className="gphoto" key={i} onClick={() => handleClick(i)}>
            <img key={tile.src} loading="lazy" src={tile.src} alt={items[i].caption} onError={() => handleError(i)} />
            <span className="gcap">{items[i].caption}</span>
          </div>
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

// ── Day data ────────────────────────────────────────────────────────────────
type Activity = {
  time: string;
  title: string;
  addr?: string;
  desc: string;
  badges?: { text: string; warn?: boolean }[];
};

type DayData = {
  num: number;
  date: string;
  weekday: string;
  tag: string;
  title: string;
  sub: string;
  photos: GalleryItem[];
  activities: Activity[];
};

const DAYS: DayData[] = [
  {
    num: 1,
    date: "9月17日",
    weekday: "周四 · 启程抵蓉",
    tag: "轻松漫游",
    title: "飞抵成都 · 初见繁华夜景",
    sub: "入住太古里柏廿设计酒店，品尝野生菌火锅，漫步锦江之夜",
    photos: [
      { folder: "changi", slot: 1, caption: "SQ842 启航" },
      { folder: "pagoda-hotel", slot: 1, caption: "Pagoda 酒店" },
      { folder: "ifs-taikoo", slot: 1, caption: "太古里 IFS" },
    ],
    activities: [
      {
        time: "早上",
        title: "✈️ SQ842 樟宜 T3 起飞 (12:25 - 17:10)",
        desc: "约 10:00 抵达新加坡樟宜 T3，前往 Marhaba Lounge 候机。直飞 4h45m 舒适落地下榻。",
        badges: [{ text: "提前 2.5h 抵达 T3" }, { text: "☕ Marhaba Lounge 歇息" }],
      },
      {
        time: "傍晚",
        title: "🏨 入住 Pagoda Design Hotel (太古里店)",
        desc: "机场至酒店约 50km，打车约 50 分钟（¥120–150），或预订酒店商务车 ¥300。办理入住高楼层城景双床房。",
      },
      {
        time: "晚餐",
        title: "🍄 爱尚菌·云南野生菌火锅（春熙路太古里店）",
        addr: "📍 成都市锦江区东大街388号香槟广场3楼",
        desc: "步行约6分钟。菌子季9月食材最新鲜，清鲜汤底暖胃，完美第一晚。人均约¥104。",
        badges: [{ text: "🍄 旺季建议提前大众点评预约", warn: true }],
      },
      {
        time: "夜晚",
        title: "🐼 IFS 爬墙熊猫 → 远洋太古里",
        addr: "📍 IFS：成都市锦江区红星路三段1号 · 太古里：中纱帽街8号",
        desc: "饭后步行约 5 分钟，裸眼 3D 大屏打卡圣地，感受蓉城夜色。",
      },
    ],
  },
  {
    num: 2,
    date: "9月18日",
    weekday: "周五 · 必看必玩",
    tag: "核心必游",
    title: "大熊猫基地 · 东郊记忆 · 天府双子塔",
    sub: "清晨看萌宝吃竹嬉戏，下午探复古厂区潮流，入夜赏交子公园天际灯光秀",
    photos: [
      { folder: "panda-base", slot: 1, caption: "国宝大熊猫" },
      { folder: "dongjiaojiyi", slot: 1, caption: "东郊记忆文创" },
      { folder: "skp", slot: 1, caption: "双子塔光影秀" },
    ],
    activities: [
      {
        time: "早上",
        title: "🐼 成都大熊猫繁育研究基地",
        addr: "📍 成都市成华区熊猫大道1375号",
        desc: "8:00 前入园，上午熊猫最活跃。打车约 20 分钟。",
        badges: [{ text: "⚠️ 提前14天公众号预约", warn: true }],
      },
      {
        time: "下午",
        title: "🎨 东郊记忆文创园",
        addr: "📍 成都市成华区建设南路4号",
        desc: "旧工厂改造文艺街区，壁画打卡、手冲咖啡。",
      },
      {
        time: "夜晚",
        title: "🌊 成都 SKP · 音乐喷泉 + 双子塔灯光秀",
        addr: "📍 成都市武侯区武侯大道199号（地铁3/7号线武侯大道站）",
        desc: "SKP 广场音乐喷泉水柱表演后，前往交子公园观赏双子塔灯光秀，色彩变幻绚烂，建议 21:00 后观看。",
      },
    ],
  },
  {
    num: 3,
    date: "9月19日",
    weekday: "周六 · 文化慢活",
    tag: "巴适市井",
    title: "成博天府汉风 · 鹤鸣盖碗茶 · 宽窄巷子",
    sub: "天府广场千年文脉、百年人民公园品茗采耳、古巷闲庭老友重聚",
    photos: [
      { folder: "chengdu-museum", slot: 1, caption: "成都博物馆" },
      { folder: "heming-teahouse", slot: 1, caption: "鹤鸣盖碗茶" },
      { folder: "kuanzhai", slot: 1, caption: "宽窄巷子夜韵" },
    ],
    activities: [
      {
        time: "上午",
        title: "🏛️ 成都博物馆",
        addr: "📍 成都市青羊区小河街1号（天府广场西侧）",
        desc: "地铁2号线春熙路站→天府广场站（1站，西1出口直达），或步行约20分钟，免费，需公众号预约。",
        badges: [{ text: "周一闭馆" }],
      },
      {
        time: "下午",
        title: "🍵 人民公园 · 鹤鸣茶社",
        addr: "📍 成都市青羊区少城路12号（人民公园内）",
        desc: "5 元盖碗茶 + 采耳，最地道的成都慢生活。",
      },
      {
        time: "傍晚",
        title: "🏘️ 宽窄巷子夜游",
        addr: "📍 成都市青羊区宽巷子37号",
        desc: "傍晚人少，历史街区，伴手礼选购。",
      },
      {
        time: "晚上",
        title: "🥂 与嘉嘉聚餐",
        desc: "久别重逢！嘉嘉是成都本地人，地道餐厅由她来定，跟着本地人吃才是真正的成都味。",
        badges: [{ text: "👧 本地朋友带路" }],
      },
    ],
  },
  {
    num: 4,
    date: "9月20日",
    weekday: "周日 · 名山胜水",
    tag: "天地之美",
    title: "都江堰奇迹 · 青城天下幽 · 蜀境雅韵宴",
    sub: "千年水利工程灌溉天府，道教发源幽静山林，夜宿蜀宴汉唐乐舞盛典",
    photos: [
      { folder: "dujiangyan-qingcheng", slot: 1, caption: "都江堰 · 青城山" },
      { folder: "shu-gong-yan-dinner", slot: 1, caption: "蜀境雅韵宴" },
    ],
    activities: [
      {
        time: "全天",
        title: "💧 都江堰水利工程 + ⛰️ 青城山",
        desc: "成灌快铁犀浦站出发约 40 分钟，两景区打车串联约 ¥60。观鱼嘴分水堤、飞沙堰与安澜索桥；青城山有超萌自拍熊猫！",
      },
      {
        time: "晚上",
        title: "🍷 蜀境雅韵宴 · 晚宴",
        desc: "19:00 开宴，预选座位 第一排-1-22 · 第一排-1-23。总价 ¥996（定金 ¥200 已支付）。",
        badges: [{ text: "VIP 席位已完成锁定" }],
      },
    ],
  },
  {
    num: 5,
    date: "9月21日",
    weekday: "周一 · 三国古意",
    tag: "三国古韵",
    title: "黄龙溪千年水乡 · 武侯祠红墙 · 锦里夜游",
    sub: "青石板古镇榕树品茶，漫步武侯祠红墙竹影，穿梭锦里大红灯笼夜市",
    photos: [
      { folder: "huanglongxi", slot: 1, caption: "黄龙溪古镇" },
      { folder: "wuhouci-jinli", slot: 1, caption: "武侯祠 · 锦里" },
    ],
    activities: [
      {
        time: "上午",
        title: "🏘️ 黄龙溪古镇",
        addr: "📍 成都市双流区黄龙溪镇",
        desc: "距市区约 40km，青石板街道、明清建筑、古码头边喝盖碗茶，悠闲半天。打车约 40 分钟。",
      },
      {
        time: "下午",
        title: "⚔️ 武侯祠 → 🏮 锦里夜景",
        addr: "📍 武侯祠：成都市武侯区武侯祠大街231号 · 锦里：武侯祠大街251号",
        desc: "古镇返市区后前往武侯祠，打车约 30 分钟。锦里夜晚 8 点后最迷人。",
      },
    ],
  },
  {
    num: 6,
    date: "9月22日",
    weekday: "周二 · 震撼视界",
    tag: "世界奇迹",
    title: "广汉三星堆新馆 · 沉睡数千年的古蜀文明",
    sub: "沉睡三千年，一醒惊天下。青铜神树、金面具与纵目面具的神秘凝视",
    photos: [
      { folder: "sanxingdui", slot: 1, caption: "三星堆博物馆" },
    ],
    activities: [
      {
        time: "全天",
        title: "🏺 三星堆博物馆（广汉）",
        addr: "📍 四川省德阳市广汉市三星堆镇真武村三星堆路",
        desc: "青铜神树、纵目面具，古蜀文明震撼首选。成都北站高铁约 20 分钟至广汉。",
        badges: [{ text: "⚠️ 提前5天官方小程序抢票！", warn: true }],
      },
    ],
  },
  {
    num: 7,
    date: "9月23日",
    weekday: "周三 · 慢调闲适",
    tag: "慢调漫步",
    title: "芳草街 · 华姿路棕榈巷 Citywalk",
    sub: "深入老成都社区肌理，穿梭文艺独立书店、精品咖啡与隐秘小巷",
    photos: [
      { folder: "fangcao-citywalk", slot: 1, caption: "芳草街 · 华姿路" },
    ],
    activities: [
      {
        time: "下午",
        title: "🚶 芳草街 → 华姿路 漫游",
        addr: "📍 成都市武侯区芳草街（地铁3号线芳草街站D口出发）→ 华姿路火烧堰",
        desc: "白夜花神诗空间咖啡打卡，步行至华姿路棕榈树巷道（火烧堰碧翠廊），全程约 1.5km，轻松半天，穿舒服的鞋即可。",
      },
    ],
  },
  {
    num: 8,
    date: "9月24日",
    weekday: "周四 · 满载而归",
    tag: "圆满收官",
    title: "川味手信采买 · SQ843 飞返新加坡",
    sub: "满载天府香辣美味与非遗回忆，乘新航 SQ843 荣耀返抵樟宜",
    photos: [
      { folder: "free-day", slot: 1, caption: "成都最后一天" },
      { folder: "tfu-airport", slot: 1, caption: "天府 T1 候机" },
    ],
    activities: [
      {
        time: "上午",
        title: "☀️ 自由活动 · 最后的成都时光",
        desc: "漫无目的地溜达才是旅行最好的结尾。顺道补购手信：郫县豆瓣、汉源花椒、熊猫文创。Check-out 12:00，行李可寄存前台。",
      },
      {
        time: "下午",
        title: "✈️ 前往 TFU · SQ843 返新加坡",
        addr: "📍 成都天府国际机场（TFU）T1 航站楼",
        desc: "出发前 3h 前往机场（TFU T1），打车约 50 分钟（¥120–150）。",
        badges: [{ text: "TFU T1 → 樟宜 T3" }],
      },
    ],
  },
];

// ── Main ChengduTrip component ────────────────────────────────────────────────
export default function ChengduTrip() {
  const [lb, setLb] = useState({ open: false, imgs: [] as string[], idx: 0, cap: "" });
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const openLb = (imgs: string[], idx: number, cap: string) =>
    setLb({ open: true, imgs, idx, cap });
  const closeLb = () => setLb((s) => ({ ...s, open: false }));
  const navLb = (d: number) =>
    setLb((s) => ({ ...s, idx: (s.idx + d + s.imgs.length) % s.imgs.length }));
  const gotoLb = (i: number) => setLb((s) => ({ ...s, idx: i }));

  // Keyboard navigation for the lightbox
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

  // Itinerary carousel: track scroll position to update arrow disabled state
  const updateCarouselState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= maxScroll - 4);
  }, []);

  useEffect(() => {
    updateCarouselState();
    window.addEventListener("resize", updateCarouselState);
    return () => window.removeEventListener("resize", updateCarouselState);
  }, [updateCarouselState]);

  function scrollCarousel(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>(".day-card");
    const gap = 24;
    const step = ((firstCard?.offsetWidth ?? 350) + gap) * (window.innerWidth >= 1024 ? 2 : 1);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  return (
    <div className="trip-page">
      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section className="hero">
        <div className="hero-bg" />
        <h1>成都<span>探索之旅</span></h1>
        <div className="pills">
          <span className="pill">SQ842 · 9月17日 出发</span>
          <span style={{ color: "rgba(255,255,255,.2)" }}>——</span>
          <span className="pill">SQ843 · 9月24日 返程</span>
        </div>
      </section>

      {/* ══ FLIGHT & HOTEL CARDS ══════════════════════════════════════════════ */}
      <div className="fh-grid">
        <div className="info-card glass">
          <div className="info-head">
            <div className="info-head-l">
              <span className="info-icon">✈️</span>
              <div>
                <div className="info-title">航班信息 · 新航直飞</div>
                <div className="info-sub">Singapore Airlines · 往返执飞</div>
              </div>
            </div>
            <span className="badge-gold">A350 宽体客机</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="flight-leg">
              <div className="flight-leg-top">
                <span className="flight-leg-num">去程 · SQ 842</span>
                <span className="flight-leg-when">9月17日 (周四) · 4h 45m</span>
              </div>
              <div className="flight-leg-route">
                <span>🇸🇬 SIN 樟宜 T3 <span style={{ color: "var(--gold-leaf)", fontWeight: 400, fontSize: 11 }}>12:25</span></span>
                <span style={{ color: "var(--outline)" }}>➔</span>
                <span>🇨🇳 TFU 天府 T1 <span style={{ color: "var(--gold-leaf)", fontWeight: 400, fontSize: 11 }}>17:10</span></span>
              </div>
            </div>
            <div className="flight-leg">
              <div className="flight-leg-top">
                <span className="flight-leg-num">返程 · SQ 843</span>
                <span className="flight-leg-when">9月24日 (周四) · 约 4h</span>
              </div>
              <div className="flight-leg-route">
                <span>🇨🇳 TFU 天府 T1</span>
                <span style={{ color: "var(--outline)" }}>➔</span>
                <span>🇸🇬 SIN 樟宜 T3</span>
              </div>
            </div>
          </div>
          <div className="info-foot">
            <span style={{ color: "var(--gold-leaf)", opacity: .9 }}>直飞无时差 (两地均为 UTC+8)</span>
            <span className="info-chip">提前 2.5h 抵机场候机</span>
          </div>
        </div>

        <div className="info-card glass">
          <div className="info-head">
            <div className="info-head-l">
              <span className="info-icon">🏨</span>
              <div>
                <div className="info-title">成都太古里柏廿设计酒店</div>
                <div className="info-sub">Pagoda Design Hotel Chengdu</div>
              </div>
            </div>
            <span className="info-chip">太古里核心商圈</span>
          </div>
          <div className="info-list">
            <div className="info-list-item"><span style={{ color: "var(--gold-leaf)" }}>📍</span><span>锦江区华兴东街16号 · 步行5分钟即达远洋太古里与春熙路</span></div>
            <div className="info-list-item"><span style={{ color: "var(--gold-leaf)" }}>🛏️</span><span>高楼层城景双床房 · 9月17日–24日 (7晚连住 · 含每日双人早餐)</span></div>
            <div className="info-list-item"><span style={{ color: "var(--gold-leaf)" }}>🚗</span><span>礼宾部已安排机场商务车专车往返接送机，无缝直达酒店</span></div>
          </div>
          <div className="info-foot">
            <div style={{ display: "flex", gap: 8 }}>
              <span className="info-chip">Check-in 15:00</span>
              <span className="info-chip">Check-out 12:00</span>
            </div>
            <span style={{ color: "var(--gold-leaf)", opacity: .9 }}>近春熙路地铁站 (2/3号线)</span>
          </div>
        </div>
      </div>

      {/* ══ ITINERARY CAROUSEL ════════════════════════════════════════════════ */}
      <div className="sec">
        <div className="carousel-bar">
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 500, color: "#fff" }}>每日行程规划</h2>
            <p style={{ fontSize: 12, color: "var(--outline)", marginTop: 6 }}>一览 8 天 7 夜精彩安排 · 支持左右平滑滑动浏览</p>
          </div>
          <div className="carousel-controls">
            <button aria-label="上一页行程" className="nav-arrow" disabled={atStart} onClick={() => scrollCarousel(-1)}>‹</button>
            <button aria-label="下一页行程" className="nav-arrow" disabled={atEnd} onClick={() => scrollCarousel(1)}>›</button>
          </div>
        </div>

        <div className="carousel-track" ref={trackRef} onScroll={updateCarouselState}>
          {DAYS.map((day) => (
            <div className="day-card" key={day.num}>
              <div className="day-card-inner glass">
                <div className="day-head">
                  <div className="day-head-l">
                    <div className="day-num">{day.num}</div>
                    <div>
                      <div className="day-date">{day.date}</div>
                      <div className="day-weekday">{day.weekday}</div>
                    </div>
                  </div>
                  <span className="day-tag">{day.tag}</span>
                </div>

                <div>
                  <div className="day-title">{day.title}</div>
                  <div className="day-sub">{day.sub}</div>
                </div>

                <DayGallery items={day.photos} openLb={openLb} />

                <div className="activities">
                  {day.activities.map((a, i) => (
                    <div className="activity" key={i}>
                      <span className="a-time">{a.time}</span>
                      <div className="a-title">{a.title}</div>
                      {a.addr && <div className="a-addr">{a.addr}</div>}
                      <div className="a-desc">{a.desc}</div>
                      {a.badges && (
                        <div className="a-badges">
                          {a.badges.map((b) => (
                            <span key={b.text} className={`a-badge${b.warn ? " warn" : ""}`}>{b.text}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ FOOD LIST ═════════════════════════════════════════════════════════ */}
      <hr className="div" />
      <div className="sec">
        <div className="sec-h"><h2>必吃美食清单</h2><p>辣而不燥、鲜香醇厚的天府味觉探索</p></div>
        <div className="fg">
          {[
            ["🍄","爱尚菌野生菌火锅","17号晚首选！菌子季鲜味绝顶，清鲜暖胃，香槟广场3楼。","首夜暖胃必选","香槟广场"],
            ["🫕","地道正宗火锅","电台巷、巴蜀大将，挑巷子里人多的那家准没错。牛油香浓，中辣 or 微辣？","老成都经典麻辣","街巷老店"],
            ["🍢","街头串串香","马路边边、钢管厂五区。麻辣鲜香入味，抓一把竹签边涮边聊才够巴适。","市井烟火气","传统热锅"],
            ["🥟","经典成都名小吃","甜水面劲道甜辣、叶儿粑清香软糯、蛋烘糕（一定要加肉松！）随处可见。","街巷寻味","百味小点"],
            ["🍲","正宗川菜佳肴","陶德砂锅、吃客餐厅、陈麻婆豆腐。层次丰富、百菜百味，回味悠长。","醇厚天府滋味","老字号"],
            ["🐰","深夜江湖夜宵","双流老妈兔头、奎星楼街冒脑花与特色烤脑花。成都夜宵是另一种市井信仰。","越夜越巴适","午夜江湖"],
          ].map(([icon, name, desc, foot, chip]) => (
            <div className="fc glass" key={name}>
              <div className="fc-head"><div className="fi">{icon}</div><h3>{name}</h3></div>
              <p style={{ flex: 1 }}>{desc}</p>
              <div className="card-foot"><span className="card-foot-l">{foot}</span><span className="info-chip">{chip}</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ TIPS ══════════════════════════════════════════════════════════════ */}
      <hr className="div" />
      <div className="sec">
        <div className="sec-h"><h2>出行锦囊与实用小贴士</h2><p>细致考量，令每一刻旅途安心惬意</p></div>
        <div className="tg">
          <div className="tc glass">
            <div className="tc-head"><div className="fi">✈️</div><h3>航班提示</h3></div>
            <p style={{ flex: 1 }}>SQ842/843 直飞成都天府国际机场 (TFU)，航程约 4h 45m。两地同为 UTC+8，无时差无颠倒。</p>
            <div className="card-foot"><span className="card-foot-l">直飞无时差</span><span className="info-chip">新航 A350</span></div>
          </div>
          <div className="tc glass">
            <div className="tc-head"><div className="fi">🏨</div><h3>Pagoda Hotel 小贴士</h3></div>
            <p style={{ flex: 1 }}>步行即达太古里 · 春熙路商圈。Check-in 15:00 · Check-out 12:00；已确认机场商务专车接驳。</p>
            <div className="card-foot"><span className="card-foot-l">太古里核心商圈</span><span className="info-chip">高层城景</span></div>
          </div>
          <div className="tc glass">
            <div className="tc-head"><div className="fi">🎟️</div><h3>熊猫基地预约</h3></div>
            <p style={{ flex: 1 }}>提前 14 天在“成都大熊猫繁育研究基地”微信公众号实名购票，务必选上午场看萌宝活跃进食。</p>
            <div className="card-foot"><span className="card-foot-l">提前 14 天预约</span><span className="info-chip">晨间进场</span></div>
          </div>
          <div className="tc glass">
            <div className="tc-head"><div className="fi">🏺</div><h3>三星堆抢票</h3></div>
            <p style={{ flex: 1 }}>提前 5 天官方小程序抢票，9月旺季常秒空，务必调好闹钟提前填好信息。</p>
            <div className="card-foot"><span className="card-foot-l">提前5天抢票</span><span className="info-chip">9月旺季</span></div>
          </div>
          <div className="tc glass">
            <div className="tc-head"><div className="fi">🚇</div><h3>市内交通出行</h3></div>
            <p style={{ flex: 1 }}>支付宝或微信乘车码直接扫码乘坐地铁与公交。酒店近春熙路站（2号/3号线交汇），出行极便捷。</p>
            <div className="card-foot"><span className="card-foot-l">直接刷乘车码</span><span className="info-chip">春熙路站</span></div>
          </div>
          <div className="tc glass">
            <div className="tc-head"><div className="fi">👟</div><h3>天气与穿着建议</h3></div>
            <p style={{ flex: 1 }}>气温 20–28°C，随身备晴雨伞以防华西秋雨。每日预计步行近 2 万步，舒适平底鞋与轻便薄外套必备。</p>
            <div className="card-foot"><span className="card-foot-l">舒适平底鞋</span><span className="info-chip">20~28°C</span></div>
          </div>
        </div>
      </div>

      {/* ══ OUTRO ═════════════════════════════════════════════════════════════ */}
      <div className="outro">
        <blockquote>
          让我们烫起红锅，辣到微汗，<br />
          在这座永远不急不慢的城市里，<br />
          把每一天都过成"巴适得板"。
        </blockquote>
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
    </div>
  );
}
