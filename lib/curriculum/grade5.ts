import type { Topic } from "../types";

export const grade5Topics: Topic[] = [
  {
    id: "tzimtzum-veharchava",
    name: "צמצום והרחבה",
    strand: "שברים",
    description: "צמצום שבר לצורתו הפשוטה והרחבתו למכנה נתון.",
    generatorId: "fraction-simplify",
  },
  {
    id: "mispar-meorav",
    name: "שבר מדומה ומספר מעורב",
    strand: "שברים",
    description: "מעבר בין שבר גדול מ-1 ובין מספר מעורב.",
    generatorId: "improper-mixed",
  },
  {
    id: "hibur-hisur-shvarim",
    name: "חיבור וחיסור שברים",
    strand: "שברים",
    description: "חיבור וחיסור שברים עם מכנים שונים.",
    generatorId: "fractions-add-subtract",
    levels: [1, 2],
  },
  {
    id: "mavar-lashever-asroni",
    name: "משבר פשוט לשבר עשרוני",
    strand: "שברים",
    description: "המרה בין שבר פשוט לשבר עשרוני סופי ובחזרה.",
    generatorId: "fraction-to-decimal",
  },
  {
    id: "shvarim-asroniim",
    name: "פעולות בשברים עשרוניים",
    strand: "שברים",
    description: "חיבור וחיסור עשרוניים וכפל וחילוק ב-10, 100, 1000.",
    generatorId: "decimals-operations",
    levels: [1, 2],
  },
  {
    id: "hiluk-be-dusifrati",
    name: "חילוק במספר דו-ספרתי",
    strand: "פעולות החשבון",
    description: "חילוק ארוך שבו המחלק הוא דו-ספרתי.",
    generatorId: "divide-two-digit",
  },
  {
    id: "memutza",
    name: "ממוצע",
    strand: "חקר נתונים",
    description: "חישוב ממוצע של קבוצת מספרים.",
    generatorId: "average",
  },
  {
    id: "shetach-mishulash-umakbilit",
    name: "שטח משולש ומקבילית",
    strand: "מדידות שטחים",
    description: "חישוב שטח לפי בסיס וגובה.",
    generatorId: "area-shapes",
  },
  {
    id: "hashvaat-shvarim",
    name: "השוואת שברים",
    strand: "שברים",
    description: "השוואה בין שני שברים ובין שבר למספר שלם.",
    generatorId: "compare-fractions",
  },
];

export default grade5Topics;
