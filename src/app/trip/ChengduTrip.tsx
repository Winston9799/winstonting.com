// ─── CHENGDU ITINERARY PAGE ───────────────────────────────────────────────────
// Full single-page trip layout: hero, flight/hotel summary cards, the
// day-by-day carousel (DAYS below), a food list, travel tips, and a lightbox
// for the per-day photo galleries. Styled by ./chengdu.css — see design.md
// for the "Obsidian & Gilded Journey" palette this page follows.
// To edit trip content (dates, activities, photos), edit the DAYS array below.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
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

// ── CopyAddr: address text + a copy-to-clipboard icon button — briefly
// swaps to a checkmark on success so tapping it gives visible feedback. ───
function CopyAddr({ addr, textClassName = "a-addr" }: { addr: string; textClassName?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(addr.replace(/^📍\s*/, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable (no HTTPS, no permission, etc) — nothing
      // to fall back to here, so just leave the button inert.
    }
  }

  return (
    <div className="a-addr-row">
      <span className={textClassName}>{addr}</span>
      <button
        type="button"
        className={`a-copy-btn${copied ? " copied" : ""}`}
        aria-label={copied ? "已复制" : "复制地址"}
        onClick={(e) => { e.stopPropagation(); handleCopy(); }}
      >
        {copied ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
        )}
      </button>
    </div>
  );
}

// ── DayGallery: click-to-lightbox grid pulling one photo from each of several
// named folders, each with its own caption — used for the per-day header grid ──
type GalleryItem = { folder: string; slot: number; caption: string };

function DayGallery({
  items,
  openLb,
}: {
  items: GalleryItem[];
  openLb: (imgs: string[], idx: number, caps: string[]) => void;
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
      visible.map((v) => items[v.origIdx]?.caption ?? "")
    );
  }

  if (!tiles || !tiles.some((t) => !t.hidden)) return null;

  return (
    <div className="day-gallery">
      {tiles.map((tile, i) =>
        tile.hidden ? null : (
          <div className="gphoto" key={i} onClick={() => handleClick(i)}>
            <img key={tile.src} decoding="async" src={tile.src} alt={items[i].caption} onError={() => handleError(i)} />
            <span className="gcap">{items[i].caption}</span>
          </div>
        )
      )}
    </div>
  );
}

// ── FoodGallery: same extension-fallback tile grid as DayGallery, but for the
// food-list cards — 3 photos from one folder, no per-photo captions ──────────
function FoodGallery({
  folder,
  name,
  openLb,
}: {
  folder: string;
  name: string;
  openLb: (imgs: string[], idx: number, caps: string[]) => void;
}) {
  type Tile = { src: string; hidden: boolean };
  const [tiles, setTiles] = useState<Tile[] | null>(null);

  useEffect(() => {
    setTiles([1, 2, 3].map((slot) => ({ src: `/images/${folder}/${slot}.jpg`, hidden: false })));
  }, [folder]);

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
    openLb(visible.map((v) => v.src), pos >= 0 ? pos : 0, visible.map(() => name));
  }

  if (!tiles || !tiles.some((t) => !t.hidden)) {
    return (
      <div className="fc-gallery">
        <div className="fc-photo-tile" />
        <div className="fc-photo-tile" />
        <div className="fc-photo-tile" />
      </div>
    );
  }

  return (
    <div className="fc-gallery">
      {tiles.map((tile, i) =>
        tile.hidden ? null : (
          <img
            key={tile.src}
            decoding="async"
            src={tile.src}
            alt={name}
            className="fc-photo-tile fc-photo-img"
            onClick={() => handleClick(i)}
            onError={() => handleError(i)}
          />
        )
      )}
    </div>
  );
}

// ── WeatherForecast: live 16-day forecast for Chengdu via Open-Meteo (free,
// no API key, CORS-enabled, 16 days is its daily-forecast max) — refetches
// on mount and every 30 minutes while the page stays open, falling back to
// the static seasonal blurb if the request fails (offline, API down, etc).
// The strip scrolls horizontally so all 16 days stay reachable in the card's
// fixed width. ───────────────────────────────────────────────────────────
type DayForecast = { key: string; weekday: string; date: string; tMax: number; tMin: number; code: number };

const WEATHER_ICONS: Record<number, string> = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
  45: "🌫️", 48: "🌫️",
  51: "🌦️", 53: "🌦️", 55: "🌦️",
  56: "🌧️", 57: "🌧️",
  61: "🌧️", 63: "🌧️", 65: "🌧️",
  66: "🌧️", 67: "🌧️",
  71: "🌨️", 73: "🌨️", 75: "🌨️", 77: "🌨️",
  80: "🌦️", 81: "🌧️", 82: "⛈️",
  85: "🌨️", 86: "🌨️",
  95: "⛈️", 96: "⛈️", 99: "⛈️",
};
const WEEKDAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

function WeatherForecast() {
  const [days, setDays] = useState<DayForecast[] | null>(null);
  const [error, setError] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=30.5728&longitude=104.0668&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Asia%2FShanghai&forecast_days=16"
        );
        if (!res.ok) throw new Error("bad response");
        const data = await res.json();
        if (cancelled) return;
        const parsed: DayForecast[] = data.daily.time.map((d: string, i: number) => {
          const date = new Date(`${d}T00:00:00`);
          return {
            key: d,
            weekday: WEEKDAYS[date.getDay()],
            date: `${date.getMonth() + 1}/${date.getDate()}`,
            tMax: Math.round(data.daily.temperature_2m_max[i]),
            tMin: Math.round(data.daily.temperature_2m_min[i]),
            code: data.daily.weathercode[i],
          };
        });
        setDays(parsed);
        setError(false);
        setUpdatedAt(new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }));
      } catch {
        if (!cancelled) setError(true);
      }
    }
    load();
    const interval = setInterval(load, 30 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (error) {
    return (
      <p style={{ flex: 1 }}>
        气温约 17–26°C，早晚温差大，长裤搭配薄外套更舒适；随身备晴雨伞以防华西秋雨。每日预计步行近 2 万步，舒适平底鞋必备。
      </p>
    );
  }

  if (!days) {
    return <p style={{ flex: 1, color: "var(--outline)" }}>正在获取成都实时天气…</p>;
  }

  return (
    <div style={{ flex: 1 }}>
      <div className="weather-row">
        {days.map((d) => (
          <div className="weather-day" key={d.key}>
            <span className="weather-wd">{d.weekday}</span>
            <span className="weather-date">{d.date}</span>
            <span className="weather-icon">{WEATHER_ICONS[d.code] ?? "🌡️"}</span>
            <span className="weather-temp">{d.tMax}°/{d.tMin}°</span>
          </div>
        ))}
      </div>
      {updatedAt && <p className="weather-updated">Open-Meteo 实时更新 · {updatedAt}</p>}
    </div>
  );
}

// ── ExchangeRate: live SGD↔CNY rate via Frankfurter (free, no API key,
// CORS-enabled, ECB reference rates) — refetches on mount and every 30
// minutes, falling back to a static blurb if the request fails. ──────────
function ExchangeRate() {
  const [sgdToCny, setSgdToCny] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("https://api.frankfurter.dev/v1/latest?base=SGD&symbols=CNY");
        if (!res.ok) throw new Error("bad response");
        const data = await res.json();
        if (cancelled) return;
        const rate = data.rates?.CNY;
        if (typeof rate !== "number") throw new Error("no rate");
        setSgdToCny(rate);
        setError(false);
        setUpdatedAt(new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }));
      } catch {
        if (!cancelled) setError(true);
      }
    }
    load();
    const interval = setInterval(load, 30 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (error) {
    return (
      <p style={{ flex: 1 }}>
        新加坡出发前可在本地银行或找换店换好人民币现金；到成都后也能用支付宝/微信绑定境外卡直接扫码付款，汇率实时结算更方便。
      </p>
    );
  }

  if (sgdToCny === null) {
    return <p style={{ flex: 1, color: "var(--outline)" }}>正在获取实时汇率…</p>;
  }

  return (
    <div style={{ flex: 1 }}>
      <div className="fx-row">
        <div className="fx-tile">
          <span className="fx-label">1 SGD →</span>
          <span className="fx-value">{sgdToCny.toFixed(3)} CNY</span>
        </div>
        <div className="fx-tile">
          <span className="fx-label">1 CNY →</span>
          <span className="fx-value">{(1 / sgdToCny).toFixed(4)} SGD</span>
        </div>
      </div>
      {updatedAt && <p className="weather-updated">Frankfurter 实时更新 · {updatedAt}</p>}
    </div>
  );
}

// ── HotelMap: Google's key-less search embed (maps.google.com/maps?q=...
// &output=embed) — Google resolves the address text server-side, which for
// a China address like this one lands precisely on the actual building
// (OSM's street-level China coverage is patchy and only got the nearest
// mapped road). No fetch needed: the address goes straight into the iframe
// src, so there's no loading/failure state to handle here. ───────────────
function HotelMap({ address }: { address: string }) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  return (
    <div className="hotel-map">
      <iframe src={src} title="酒店地图位置" loading="lazy" />
    </div>
  );
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({
  imgs,
  idx,
  caps,
  onClose,
  onNav,
  onGoto,
}: {
  imgs: string[];
  idx: number;
  caps: string[];
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
        <p className="lb-cap">{caps[idx]}</p>
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
  link?: { label: string; href: string };
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
    weekday: "周四",
    tag: "轻松漫游",
    title: "飞抵成都 · 初见繁华夜景",
    sub: "落地首夜，快速安顿",
    photos: [
      { folder: "changi", slot: 1, caption: "SQ842 启航" },
      { folder: "pagoda-hotel", slot: 1, caption: "Pagoda 酒店" },
      { folder: "ifs-taikoo", slot: 1, caption: "太古里 IFS" },
    ],
    activities: [
      {
        time: "早上",
        title: "✈️ SQ842 樟宜 T3 起飞 (12:25 - 17:10)",
        desc: "约 10:00 抵达樟宜 T3，前往 Marhaba Lounge 候机，直飞 4h45m。",
        badges: [{ text: "提前 2.5h 抵达 T3" }, { text: "☕ Marhaba Lounge 歇息" }],
      },
      {
        time: "傍晚",
        title: "🏨 入住 Pagoda Design Hotel (成都春熙路太古里店)",
        desc: "机场至酒店约 50km、50 分钟，办理入住高楼层城景双床房。",
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
        title: "🌉 九眼桥 · 锦江夜色",
        addr: "📍 成都市锦江区九眼桥（合江亭附近）",
        desc: "饭后打车约 10-15 分钟，桥头酒吧一条街，河边散步；或体验锦江夜游船（19:00-22:30，¥70-120，合江亭/望江公园上船，光影秀水幕喷泉），收尾第一晚。",
      },
    ],
  },
  {
    num: 2,
    date: "9月18日",
    weekday: "周五",
    tag: "核心必游",
    title: "熊猫谷探秘 · 都江堰水利工程一日游",
    sub: "全天专车，无需操心",
    photos: [
      { folder: "panda-base", slot: 1, caption: "国宝大熊猫" },
      { folder: "panda-base", slot: 4, caption: "害羞小熊猫" },
      { folder: "dujiangyan-qingcheng", slot: 1, caption: "都江堰水利工程" },
    ],
    activities: [
      {
        time: "早上",
        title: "🐼 熊猫谷（都江堰大熊猫繁育与放归研究中心）",
        desc: "专车接送，导游车上讲解大熊猫保育知识。山地生态廊道近距离静赏熊猫啃竹、爬树等自然行为，门票已含。",
        badges: [{ text: "🎫 熊猫谷门票已含" }],
      },
      {
        time: "中午",
        title: "🍽️ 都江堰景区特色午餐",
        desc: "当地特色套餐已含，指定都江堰景区餐厅用餐。",
      },
      {
        time: "下午",
        title: "💧 都江堰水利工程",
        desc: "导游讲解都江堰三大工程：鱼嘴分水堤、飞沙堰溢洪道、宝瓶口引水口，感受两千年前无坝引水的水利智慧。",
        badges: [{ text: "🚐 06:00 出发 · 17:00 返程" }],
        link: { label: "查看 Klook 行程详情", href: "https://www.klook.com/add-upcoming-trip/?id=79fbab41-d676-477a-7a81-c5a457d08f8f" },
      },
    ],
  },
  {
    num: 3,
    date: "9月19日",
    weekday: "周六",
    tag: "巴适市井",
    title: "文殊院禅意 · 宽窄巷子采耳 · 抚琴夜市",
    sub: "老友相伴，慢享一天",
    photos: [
      { folder: "wenshu", slot: 1, caption: "文殊院红墙" },
      { folder: "jiajia", slot: 1, caption: "老友嘉嘉" },
      { folder: "kuanzhai", slot: 1, caption: "宽窄巷子夜韵" },
    ],
    activities: [
      {
        time: "上午",
        title: "🙏 文殊院 → 荷花茶园",
        addr: "📍 地铁1/6号线文殊院站K口出站",
        desc: "10:00-12:30。先游文殊院（免费入场，可领三支香）；11:30后转荷花茶园二选一：传统茶馆（看变脸）或荷田水铺（国潮风，三楼露台拍照）。",
      },
      {
        time: "中午",
        title: "🍽️ 明婷饭店（外曹家巷店）",
        desc: "12:30-14:00，成都苍蝇馆子代表，招牌脑花豆腐、奇香排骨，味道地道。",
      },
      {
        time: "下午",
        title: "🏘️ 宽窄巷子 → 采耳体验",
        addr: "📍 宽窄巷子附近居民楼内（宽窄耳匠采耳）",
        desc: "14:00-17:30。先逛宽窄巷子（宽巷子窄巷子井巷子，老成都市井气息，从文殊院步行/骑车约15-20分钟）；16:00起体验采耳，30-60分钟，约¥100，可搜团购。",
      },
      {
        time: "晚上",
        title: "🌃 抚琴夜市",
        desc: "18:00后，从宽窄巷子打车约10分钟。本地人爱逛的人气夜市，烟火气十足，地道小吃云集，营业至深夜。",
      },
    ],
  },
  {
    num: 4,
    date: "9月20日",
    weekday: "周日",
    tag: "诗韵成都",
    title: "人民公园品茗 · 杜甫草堂访古 · 蜀境雅韵宴",
    sub: "百年茶社，夜宴压轴",
    photos: [
      { folder: "heming-teahouse", slot: 1, caption: "鹤鸣盖碗茶" },
      { folder: "dufu-cottage", slot: 1, caption: "杜甫草堂" },
      { folder: "shu-gong-yan-dinner", slot: 1, caption: "蜀境雅韵宴" },
    ],
    activities: [
      {
        time: "上午",
        title: "🍵 人民公园 · 鹤鸣茶社",
        addr: "📍 成都市青羊区少城路12号（人民公园内）",
        desc: "5 元盖碗茶 + 采耳，最地道的成都慢生活。",
      },
      {
        time: "下午",
        title: "🏡 杜甫草堂",
        addr: "📍 成都市青羊区青华路37号",
        desc: "诗圣杜甫流寓成都的故居，茅屋、竹林、诗史堂静谧清幽，感受千年前的田园诗意。",
      },
      {
        time: "备选",
        title: "📍 附近后备方案",
        desc: "时间充裕可就近安排：浣花溪公园（草堂旁沿江生态公园）、青羊宫（成都最古老道观）、送仙桥古玩艺术城、成都非遗博览园。",
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
    weekday: "周一",
    tag: "文明探秘",
    title: "三星堆探秘 · 东郊记忆大戏台",
    sub: "跨越千年，夜赏戏韵",
    photos: [
      { folder: "sanxingdui", slot: 1, caption: "三星堆博物馆" },
      { folder: "dongjiaojiyi", slot: 2, caption: "东郊记忆" },
      { folder: "dongjiaojiyi", slot: 1, caption: "东郊记忆文创园" },
    ],
    activities: [
      {
        time: "上午",
        title: "🏺 广汉三星堆博物馆",
        addr: "📍 四川省德阳市广汉市三星堆镇真武村三星堆路",
        desc: "距市区约 1.5 小时车程，参观青铜神树、纵目面具，感受三千年前古蜀文明的震撼。建议早出发，预留充足往返时间。",
      },
      {
        time: "傍晚",
        title: "🎭 东郊记忆 → 大戏台夜场",
        addr: "📍 成都市成华区建设南路99号（东郊记忆北二巷）",
        desc: "三星堆返回市区后打车约 30 分钟直达，逛逛工业遗址文创园区，傍晚大戏台戏曲专场约 80 分钟（川剧折子戏、变脸吐火等），257 席位，建议提前订票。",
        badges: [{ text: "🎫 建议提前订票" }],
      },
    ],
  },
  {
    num: 6,
    date: "9月22日",
    weekday: "周二",
    tag: "巴蜀山水",
    title: "乐山大佛 · 黄龙溪古镇一日游",
    sub: "全天包车，轻松惬意",
    photos: [
      { folder: "leshan", slot: 1, caption: "乐山大佛" },
      { folder: "huanglongxi", slot: 1, caption: "黄龙溪古镇" },
      { folder: "leshan", slot: 2, caption: "乐山大佛俯瞰" },
    ],
    activities: [
      {
        time: "早上",
        title: "🚐 接送出发 → 乐山大佛",
        desc: "06:00–08:00 专车接送直达乐山，抵达后自由活动约 2 小时，瞻仰世界最大石刻座佛，感受千年石刻震撼。",
        badges: [{ text: "🎫 门票已含" }],
      },
      {
        time: "中午",
        title: "🍽️ 午餐 → 黄龙溪古镇",
        desc: "约 1 小时用餐后前往黄龙溪，自由活动约 2 小时（免费入场），青石板老街古码头喝盖碗茶，悠闲惬意。",
      },
      {
        time: "傍晚",
        title: "🚩 返程送达",
        desc: "送至指定下车点（金沙遗址博物馆 · 18:00）或自定义地址。",
        link: { label: "查看 Klook 行程详情", href: "https://www.klook.com/add-upcoming-trip/?id=7c0f2e45-76d1-4f13-59bc-cafb020f94a5" },
      },
    ],
  },
  {
    num: 7,
    date: "9月23日",
    weekday: "周三",
    tag: "慢调漫步",
    title: "武侯祠寻踪 · 芳草街 Citywalk · Winston 提前返程",
    sub: "老友惜别，先行返程",
    photos: [
      { folder: "wuhouci-jinli", slot: 1, caption: "武侯祠红墙" },
      { folder: "fangcao-citywalk", slot: 1, caption: "芳草街 · 华姿路" },
      { folder: "tfu-airport", slot: 1, caption: "天府 T1 候机" },
    ],
    activities: [
      {
        time: "上午",
        title: "⚔️ 武侯祠",
        addr: "📍 成都市武侯区武侯祠大街231号",
        desc: "红墙竹影，三国文化圣地，静谧清幽。跟芳草街同在武侯区，逛完打车过去很顺。",
      },
      {
        time: "下午",
        title: "🚶 芳草街 → 华姿路 漫游",
        addr: "📍 成都市武侯区芳草街（地铁3号线芳草街站D口出发）→ 华姿路火烧堰",
        desc: "白夜花神诗空间咖啡打卡，步行至华姿路棕榈树巷道（火烧堰碧翠廊），全程约 1.5km，轻松半天，穿舒服的鞋即可。",
      },
      {
        time: "傍晚",
        title: "✈️ Winston 提前返程 · SQ843 返新加坡",
        addr: "📍 成都天府国际机场（TFU）T1 航站楼",
        desc: "Winston 今日先行搭乘 SQ843 返回新加坡，航班时刻与 24 号一致，仅提前一天出发。出发前 3h 前往机场（TFU T1），打车约 50 分钟（¥120–150）。",
        badges: [{ text: "TFU T1 → 樟宜 T3" }],
      },
    ],
  },
  {
    num: 8,
    date: "9月24日",
    weekday: "周四",
    tag: "圆满收官",
    title: "川味手信采买 · Andy SQ843 飞返新加坡",
    sub: "自由半天，满载而归",
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
        time: "傍晚",
        title: "✈️ Andy 返程 · SQ843 返新加坡",
        addr: "📍 成都天府国际机场（TFU）T1 航站楼",
        desc: "Andy 今日搭乘 SQ843 返回新加坡，航班时刻与 23 号 Winston 那班一致，仅晚一天出发。出发前 3h 前往机场（TFU T1），打车约 50 分钟（¥120–150）。",
        badges: [{ text: "TFU T1 → 樟宜 T3" }],
      },
    ],
  },
];

// ── One day's card, memoized ────────────────────────────────────────────────
// The itinerary carousel updates activeDay on every scroll frame that
// crosses a card boundary (see useCarousel's onLeadingIndexChange below).
// Without memo, that re-renders all 8 cards — galleries, activity lists,
// badges, CTA buttons — on every one of those updates, which is heavy
// enough to make the swipe itself feel janky. memo() skips re-rendering the
// cards whose props didn't actually change, so only the two cards whose
// `active` state flips (old and new) re-render. This only pays off because
// `day` (from the module-level DAYS array), `onSelect`, and `openLb` are all
// referentially stable across renders — a fresh inline function for any of
// those would defeat memo() the same way not having it at all would.
const DayCard = memo(function DayCard({
  day,
  isActive,
  onSelect,
  openLb,
}: {
  day: DayData;
  isActive: boolean;
  onSelect: (num: number) => void;
  openLb: (imgs: string[], idx: number, caps: string[]) => void;
}) {
  return (
    <div className="day-card">
      <div
        className={`day-card-inner glass${isActive ? " active" : ""}`}
        onClick={() => onSelect(day.num)}
      >
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

        <div className="day-title-wrap">
          <div className="day-title">{day.title}</div>
          <div className="day-sub">{day.sub}</div>
        </div>

        <DayGallery items={day.photos} openLb={openLb} />

        <div className="activities">
          {day.activities.map((a, i) => (
            <div className="activity" key={i}>
              <span className="a-time">{a.time}</span>
              <div className="a-title">{a.title}</div>
              {a.addr && <CopyAddr addr={a.addr} />}
              <div className="a-desc">{a.desc}</div>
              {a.badges && (
                <div className="a-badges">
                  {a.badges.map((b) => (
                    <span key={b.text} className={`a-badge${b.warn ? " warn" : ""}`}>{b.text}</span>
                  ))}
                </div>
              )}
              {a.link && (
                <a className="a-cta" href={a.link.href} target="_blank" rel="noopener noreferrer">
                  <span>{a.link.label}</span>
                  <svg className="a-cta-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                    <path d="M15 3h6v6" />
                    <path d="M10 14L21 3" />
                  </svg>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// ── Shared snap-scroll carousel behavior (used by both the day carousel and
// the food-list carousel below) ────────────────────────────────────────────
const CAROUSEL_GAP = 24;

function useCarousel(itemSelector: string, onLeadingIndexChange?: (index: number) => void) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Card width only ever changes at a CSS breakpoint (resize), never during
  // a scroll — but the scroll-driven update() below runs on every animation
  // frame while dragging. Querying the DOM (querySelector) and reading
  // offsetWidth (which forces a synchronous layout) there was expensive
  // enough, sustained at up to 60 times/sec, to show up as jank specifically
  // on a fast/hard swipe (more scroll events fire per second the faster the
  // fling, so this per-frame cost scaled with swipe speed). Measuring the
  // step once here and caching it keeps the hot path free of DOM reads.
  const stepRef = useRef(350);
  const measureStep = useCallback(() => {
    const el = trackRef.current;
    const firstItem = el?.querySelector<HTMLElement>(itemSelector);
    if (firstItem) stepRef.current = firstItem.offsetWidth + CAROUSEL_GAP;
  }, [itemSelector]);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= maxScroll - 4);
  }, []);

  // onLeadingIndexChange drives activeDay, which toggles the .active class
  // on two DayCards — a real DOM mutation. iOS Safari aborts an in-flight
  // scroll-snap settle animation if the DOM is mutated while it's still
  // running, leaving the scroll stuck at whatever position it happened to
  // be at instead of snapping to a card (reported as a swipe landing
  // between two cards and staying there). Debouncing this to fire only
  // once scroll events have gone quiet — i.e. after the snap has actually
  // settled — keeps that mutation from ever landing mid-animation. Scroll
  // events keep firing throughout the settle animation itself, not just
  // during the finger-drag, so the timer's countdown only truly starts
  // once that animation is essentially done — 60ms is enough margin past
  // that without the gold ring visibly lagging behind the swipe.
  const indexTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const updateIndex = useCallback(() => {
    const el = trackRef.current;
    if (!el || !onLeadingIndexChange) return;
    onLeadingIndexChange(Math.max(0, Math.round(el.scrollLeft / stepRef.current)));
  }, [onLeadingIndexChange]);

  // The browser fires "scroll" many times per frame during a touch drag —
  // calling setState on every one competes with the drag for the main
  // thread and makes the swipe feel janky. Coalesce to at most one state
  // update per animation frame instead.
  const raf = useRef<number | null>(null);
  const onScroll = useCallback(() => {
    if (raf.current !== null) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = null;
      update();
    });
    if (indexTimer.current !== null) clearTimeout(indexTimer.current);
    indexTimer.current = setTimeout(updateIndex, 60);
  }, [update, updateIndex]);

  useEffect(() => {
    measureStep();
    update();
    updateIndex();
    const onResize = () => { measureStep(); update(); updateIndex(); };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
      if (indexTimer.current !== null) clearTimeout(indexTimer.current);
    };
  }, [measureStep, update, updateIndex]);

  function scrollByPage(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const step = stepRef.current * (window.innerWidth >= 1024 ? 2 : 1);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  return { trackRef, atStart, atEnd, onScroll, scrollByPage };
}

// ── Main ChengduTrip component ────────────────────────────────────────────────
export default function ChengduTrip() {
  const [lb, setLb] = useState({ open: false, imgs: [] as string[], idx: 0, caps: [] as string[] });
  const [activeDay, setActiveDay] = useState(DAYS[0].num);
  const onDayIndexChange = useCallback((index: number) => {
    setActiveDay(DAYS[Math.min(DAYS.length - 1, index)].num);
  }, []);
  const { trackRef, atStart, atEnd, onScroll: onTrackScroll, scrollByPage: scrollCarousel } = useCarousel(".day-card", onDayIndexChange);
  const { trackRef: foodTrackRef, atStart: foodAtStart, atEnd: foodAtEnd, onScroll: onFoodTrackScroll, scrollByPage: scrollFoodCarousel } = useCarousel(".food-card");
  // Stable references so DayCard's memo() actually bails out re-rendering
  // unaffected cards — an inline arrow function recreated on every render
  // would defeat it just as much as skipping memo() entirely.
  const onSelectDay = useCallback((num: number) => setActiveDay(num), []);

  const openLb = useCallback((imgs: string[], idx: number, caps: string[]) =>
    setLb({ open: true, imgs, idx, caps }), []);
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

  return (
    <div className="trip-page">
      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-bg-frame animate-hero-bg">
            <img src="/hero-chengdu-nightview.jpg" alt="成都夜景" className="hero-bg-img" fetchPriority="high" />
          </div>
          <div className="hero-bg-glow" />
          <div className="hero-bg-fade" />
        </div>
        <h1>成都<span>探索之旅</span></h1>
        <div className="pills">
          <span className="pill">9月17日 出发</span>
          <span style={{ color: "rgba(255,255,255,.2)" }}>——</span>
          <span className="pill">9月24日 返程</span>
        </div>
      </section>

      {/* ══ FLIGHT & HOTEL CARDS ══════════════════════════════════════════════ */}
      <div className="fh-section">
        <div className="sec-h"><h2>航班酒店已准备就绪</h2><p>往返航班、入住与接机信息均已确认</p></div>
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
          </div>
          <div className="route-arc">
            <div className="route-arc-label">去程 · SQ 842 · 9月17日 (周四) · 4h45m 直飞</div>
            <svg viewBox="0 0 400 34" className="route-arc-svg">
              <line x1="30" y1="17" x2="370" y2="17" stroke="rgba(212,160,23,.35)" strokeWidth="2" strokeDasharray="1 8" strokeLinecap="round" />
              <circle cx="30" cy="17" r="5" fill="var(--gold-bright)" />
              <circle cx="370" cy="17" r="5" fill="var(--gold-bright)" />
              <g transform="translate(200 17) rotate(-30) scale(0.85) translate(-12,-12)">
                <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" fill="var(--gold-bright)" />
              </g>
            </svg>
            <div className="route-arc-labels">
              <div className="route-arc-node">
                <span className="route-arc-code">SIN</span>
                <span className="route-arc-time">12:25</span>
              </div>
              <div className="route-arc-node" style={{ alignItems: "flex-end" }}>
                <span className="route-arc-code">TFU</span>
                <span className="route-arc-time">17:10</span>
              </div>
            </div>
          </div>

          <div className="route-arc">
            <div className="route-arc-label">返程 · SQ 843 · 9月23/24日 (Winston/Andy 分批) · 约4h</div>
            <svg viewBox="0 0 400 34" className="route-arc-svg">
              <line x1="30" y1="17" x2="370" y2="17" stroke="rgba(212,160,23,.35)" strokeWidth="2" strokeDasharray="1 8" strokeLinecap="round" />
              <circle cx="30" cy="17" r="5" fill="var(--gold-bright)" />
              <circle cx="370" cy="17" r="5" fill="var(--gold-bright)" />
              <g transform="translate(200 17) rotate(-150) scale(0.85) translate(-12,-12)">
                <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" fill="var(--gold-bright)" />
              </g>
            </svg>
            <div className="route-arc-labels">
              <div className="route-arc-node">
                <span className="route-arc-code">TFU</span>
              </div>
              <div className="route-arc-node" style={{ alignItems: "flex-end" }}>
                <span className="route-arc-code">SIN</span>
              </div>
            </div>
          </div>

          <div className="info-list">
            <div className="info-list-item"><span style={{ color: "var(--gold-leaf)" }}>📶</span><span>全程机上 Wi-Fi；推荐新航鸡尾酒 - Singapore Sling</span></div>
            <div className="info-list-item"><span style={{ color: "var(--gold-leaf)" }}>🧳</span><span>行李可托运额度 30 公斤</span></div>
            <div className="info-list-item"><span style={{ color: "var(--gold-leaf)" }}>📱</span><span>可在 Pelago 兑换 3 天 2GB 免费 eSIM</span></div>
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
                <div className="info-title">Pagoda君亭设计酒店 (成都春熙路太古里店)</div>
                <div className="info-sub">🛬 抵达 TFU 天府机场后入住</div>
              </div>
            </div>
          </div>
          <HotelMap address="成都市锦江区华兴东街16号" />
          <div className="info-list">
            <div className="info-list-item"><span style={{ color: "var(--gold-leaf)" }}>📍</span><span>锦江区华兴东街16号 · 步行5分钟即达远洋太古里与春熙路</span></div>
            <div className="info-list-item"><span style={{ color: "var(--gold-leaf)" }}>🛏️</span><span>高楼层城景双床房 · 9月17日–24日 (7晚连住 · 含每日双人早餐)</span></div>
            <div className="info-list-item"><span style={{ color: "var(--gold-leaf)" }}>🚗</span><span>接机已通过 Agoda 预订</span></div>
          </div>
          <a
            className="a-cta"
            href="https://agoda.mozio.com/en-us/view-reservation/?id=6277e27c94fe464b9272f5e4de879fb5&ref=agoda"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginTop: 0 }}
          >
            <span>管理接机预订</span>
            <svg className="a-cta-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <path d="M15 3h6v6" />
              <path d="M10 14L21 3" />
            </svg>
          </a>
          <div className="info-foot">
            <div style={{ display: "flex", gap: 8 }}>
              <span className="info-chip">Check-in 15:00</span>
              <span className="info-chip">Check-out 12:00</span>
            </div>
            <span style={{ color: "var(--gold-leaf)", opacity: .9 }}>近春熙路地铁站 (2/3号线)</span>
          </div>
        </div>
        </div>
      </div>

      {/* ══ ITINERARY CAROUSEL ════════════════════════════════════════════════ */}
      <div className="sec">
        <div className="carousel-bar">
          <div>
            <h2 className="carousel-h2">每日行程规划</h2>
            <p style={{ fontSize: 14, color: "var(--outline)", marginTop: 6 }}>一览 8 天 7 夜精彩安排 · 支持左右平滑滑动浏览</p>
          </div>
          <div className="carousel-controls">
            <button aria-label="上一页行程" className="nav-arrow" disabled={atStart} onClick={() => scrollCarousel(-1)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
            </button>
            <button aria-label="下一页行程" className="nav-arrow" disabled={atEnd} onClick={() => scrollCarousel(1)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
            </button>
          </div>
        </div>

        <div className="carousel-track" ref={trackRef} onScroll={onTrackScroll}>
          {DAYS.map((day) => (
            <DayCard
              key={day.num}
              day={day}
              isActive={day.num === activeDay}
              onSelect={onSelectDay}
              openLb={openLb}
            />
          ))}
        </div>
      </div>

      {/* ══ FOOD LIST ═════════════════════════════════════════════════════════ */}
      <hr className="div" />
      <div className="sec">
        <div className="carousel-bar">
          <div>
            <h2 className="carousel-h2">必吃美食清单</h2>
            <p style={{ fontSize: 14, color: "var(--outline)", marginTop: 6 }}>辣而不燥、鲜香醇厚的天府味觉探索 · 支持左右滑动浏览</p>
          </div>
          <div className="carousel-controls">
            <button aria-label="上一组美食" className="nav-arrow" disabled={foodAtStart} onClick={() => scrollFoodCarousel(-1)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
            </button>
            <button aria-label="下一组美食" className="nav-arrow" disabled={foodAtEnd} onClick={() => scrollFoodCarousel(1)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
            </button>
          </div>
        </div>
        <div className="carousel-track" ref={foodTrackRef} onScroll={onFoodTrackScroll}>
          {[
            ["🍄","爱尚菌野生菌火锅","17号晚首选！菌子季鲜味绝顶，清鲜暖胃，完美第一晚。","📍锦江区东大街388号香槟广场3楼（春熙路太古里店）","food-junzi"],
            ["🥟","经典成都名小吃","甜水面劲道甜辣、抄手鲜香、蛋烘糕（一定要加肉松！），推荐龙抄手总店。","📍锦江区春熙路南段6-8号龙抄手总店（近中山广场，地铁2/3号线春熙路站D口）","food-longchaoshou"],
            ["🍲","正宗川菜佳肴","层次丰富、百菜百味，回味悠长，推荐陈麻婆豆腐、陶德砂锅、吃客三家老字号。","📍陈麻婆豆腐：青羊区东华门街51号 · 陶德砂锅：锦江区总府路8号鸿德春熙中心3F · 吃客：锦江区致民路48号","food-mapo"],
          ].map(([icon, name, desc, addr, folder]) => (
            <div className="food-card" key={name}>
              <div className="fc glass">
                <div className="fc-head"><div className="fi">{icon}</div><h3>{name}</h3></div>
                <p style={{ flex: 1 }}>{desc}</p>
                <FoodGallery folder={folder} name={name} openLb={openLb} />
                <div className="card-foot"><CopyAddr addr={addr} textClassName="card-foot-l" /></div>
              </div>
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
            <div className="tc-head"><div className="fi">🥐</div><h3>9月18日 · 22日 一日游</h3></div>
            <p style={{ flex: 1 }}>熊猫谷·都江堰、乐山·黄龙溪两个一日游集合时间都很早，来不及吃酒店早餐——记得前一晚先买好点心，路上垫肚子当早餐。</p>
            <div className="card-foot"><span className="card-foot-l">早餐记得自备点心</span><span className="info-chip">集合时间较早</span></div>
          </div>
          <div className="tc glass">
            <div className="tc-head"><div className="fi">🚇</div><h3>市内交通出行</h3></div>
            <p style={{ flex: 1 }}>支付宝或微信乘车码直接扫码乘坐地铁与公交，短途也可叫滴滴打车，方便又实惠。酒店近春熙路站（2号/3号线交汇），出行极便捷。</p>
            <div className="card-foot"><span className="card-foot-l">直接刷乘车码</span><span className="info-chip">春熙路站</span></div>
          </div>
          <div className="tc glass">
            <div className="tc-head"><div className="fi">👟</div><h3>天气与穿着建议</h3></div>
            <WeatherForecast />
            <div className="card-foot"><span className="card-foot-l">薄外套 + 长裤</span><span className="info-chip">未来16天 · 可左右滑动</span></div>
          </div>
          <div className="tc glass">
            <div className="tc-head"><div className="fi">💱</div><h3>新币兑人民币汇率</h3></div>
            <ExchangeRate />
            <div className="card-foot"><span className="card-foot-l">支付宝/微信可直接绑卡付款</span><span className="info-chip">实时汇率</span></div>
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
          caps={lb.caps}
          onClose={closeLb}
          onNav={navLb}
          onGoto={gotoLb}
        />
      )}
    </div>
  );
}
