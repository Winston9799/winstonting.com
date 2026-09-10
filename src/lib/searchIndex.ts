// ─── SEARCH INDEX ─────────────────────────────────────────────────────────────
// Static list of everything the header search box can jump to. Edit this file
// to add/remove/reword entries — nothing else needs to change.
// href entries like "/trip/chengdu-sep-2026#day-3" rely on each day card in
// ChengduTrip.tsx having a matching id="day-3" and the page reading that hash
// on load to scroll/select the right day (see ChengduTrip.tsx's useEffect).
export interface SearchEntry {
  label: string;
  description: string;
  /** Extra terms to match against, not shown in the result. */
  keywords?: string[];
  href: string;
}

export const SEARCH_INDEX: SearchEntry[] = [
  { label: "Home", description: "Winston's Adventure — homepage", href: "/" },
  { label: "Contact Me", description: "Get in touch with Winston", href: "/contact" },
  {
    label: "Chengdu Sep 2026",
    description: "成都探索之旅 · 8天7夜 · 完整行程总览",
    keywords: ["itinerary", "trip", "成都", "行程"],
    href: "/trip/chengdu-sep-2026",
  },
  {
    label: "Day 1 · 9月17日 · 飞抵成都 · 初见繁华夜景",
    description: "落地首夜，快速安顿 · SQ842 抵达、入住 Pagoda 酒店、爱尚菌火锅、安顺廊桥锦江夜色",
    keywords: ["飞机", "酒店", "入住", "火锅", "廊桥", "锦江"],
    href: "/trip/chengdu-sep-2026#day-1",
  },
  {
    label: "Day 2 · 9月18日 · 熊猫谷探秘 · 都江堰水利工程一日游",
    description: "全天专车，无需操心 · 熊猫谷、都江堰水利工程",
    keywords: ["熊猫", "panda", "都江堰", "水利工程"],
    href: "/trip/chengdu-sep-2026#day-2",
  },
  {
    label: "Day 3 · 9月19日 · 文殊院禅意 · 宽窄巷子采耳 · 抚琴夜市",
    description: "老友相伴，慢享一天 · 文殊院、荷花茶园、明婷饭店、宽窄巷子采耳、抚琴夜市",
    keywords: ["文殊院", "宽窄巷子", "采耳", "夜市"],
    href: "/trip/chengdu-sep-2026#day-3",
  },
  {
    label: "Day 4 · 9月20日 · 人民公园品茗 · 杜甫草堂访古 · 蜀境雅韵宴",
    description: "百年茶社，夜宴压轴 · 人民公园鹤鸣茶社、杜甫草堂、蜀境雅韵宴晚宴",
    keywords: ["茶社", "杜甫草堂", "晚宴"],
    href: "/trip/chengdu-sep-2026#day-4",
  },
  {
    label: "Day 5 · 9月21日 · 三星堆探秘 · 东郊记忆大戏台",
    description: "跨越千年，夜赏戏韵 · 广汉三星堆博物馆、东郊记忆大戏台夜场",
    keywords: ["三星堆", "东郊记忆", "戏台"],
    href: "/trip/chengdu-sep-2026#day-5",
  },
  {
    label: "Day 6 · 9月22日 · 乐山大佛 · 黄龙溪古镇一日游",
    description: "全天包车，轻松惬意 · 乐山大佛、黄龙溪古镇",
    keywords: ["乐山大佛", "黄龙溪", "古镇"],
    href: "/trip/chengdu-sep-2026#day-6",
  },
  {
    label: "Day 7 · 9月23日 · 武侯祠寻踪 · 芳草街 Citywalk · Winston 提前返程",
    description: "老友惜别，先行返程 · 武侯祠、芳草街漫游、Winston 搭乘 SQ843 返新加坡",
    keywords: ["武侯祠", "芳草街", "返程", "citywalk"],
    href: "/trip/chengdu-sep-2026#day-7",
  },
  {
    label: "Day 8 · 9月24日 · 川味手信采买 · Andy SQ843 飞返新加坡",
    description: "自由半天，满载而归 · 自由活动、伴手礼采买、Andy 返程",
    keywords: ["手信", "伴手礼", "返程", "购物"],
    href: "/trip/chengdu-sep-2026#day-8",
  },
];
