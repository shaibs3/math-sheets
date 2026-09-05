import type { Topic } from "../types";

export const grade6Topics: Topic[] = [
  {
    id: "kefel-shvarim",
    name: "כפל שברים",
    strand: "שברים",
    description: "כפל שבר בשבר וכפל שלם בשבר, כולל מספרים מעורבים.",
    generatorId: "fractions-multiply",
  },
  {
    id: "hiluk-shvarim",
    name: "חילוק שברים",
    strand: "שברים",
    description: "חילוק שברים פשוטים, תשובה כשבר מצומצם.",
    generatorId: "fractions-divide",
  },
  {
    id: "hibur-hisur-shvarim",
    name: "חיבור וחיסור שברים",
    strand: "שברים",
    description: "חיבור וחיסור שברים עם מכנים שונים.",
    generatorId: "fractions-add-subtract",
  },
  {
    id: "helek-shel-kamut",
    name: "חלק של כמות",
    strand: "שברים",
    description: "מציאת ערך החלק ומציאת הכמות היסודית.",
    generatorId: "fraction-of-quantity",
  },
  {
    id: "shvarim-asroniim",
    name: "פעולות בשברים עשרוניים",
    strand: "שברים",
    description: "כפל וחילוק ב-10, 100, 1000, וחיבור וחיסור עשרוניים.",
    generatorId: "decimals-operations",
  },
  {
    id: "kefel-hiluk-asroniim",
    name: "כפל וחילוק בשבר עשרוני",
    strand: "שברים",
    description: "כפל שבר עשרוני בשבר עשרוני וחילוק בשבר עשרוני.",
    generatorId: "decimal-multiply-divide",
  },
  {
    id: "achuzim",
    name: "אחוזים",
    strand: "אחוזים",
    description: "מציאת אחוז מכמות, מציאת השלם ומציאת האחוז.",
    generatorId: "percent",
  },
  {
    id: "yachas",
    name: "יחס",
    strand: "יחס",
    description: "חלוקת כמות לפי יחס והשלמת ערך חסר ביחס.",
    generatorId: "ratio",
  },
  {
    id: "kne-mida",
    name: "קנה מידה",
    strand: "קנה מידה",
    description: "מעבר בין אורך במפה לאורך במציאות.",
    generatorId: "scale",
  },
  {
    id: "midot-asroniot",
    name: "מידות עשרוניות",
    strand: "מידות עשרוניות",
    description: "מעבר בין יחידות אורך, משקל ושטח.",
    generatorId: "decimal-units",
  },
  {
    id: "maagal-veigul",
    name: "מעגל ועיגול",
    strand: "מדידות",
    description: "היקף המעגל ושטח העיגול לפי רדיוס או קוטר.",
    generatorId: "circle",
  },
  {
    id: "nefach",
    name: "חישובי נפחים",
    strand: "מדידות",
    description: "נפח תיבה, קובייה וגליל.",
    generatorId: "volume",
  },
];

export default grade6Topics;
