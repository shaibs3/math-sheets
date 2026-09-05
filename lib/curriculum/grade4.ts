import type { Topic } from "../types";

export const grade4Topics: Topic[] = [
  {
    id: "shever-pashut",
    name: "השבר הפשוט",
    strand: "שברים",
    description: "מציאת חלק מכמות ומציאת הכמות מתוך החלק.",
    generatorId: "fraction-of-quantity",
    levels: [1, 2],
  },
  {
    id: "kefel-bemeunach",
    name: "כפל במאונך",
    strand: "פעולות החשבון",
    description: "כפל בגורם רב-ספרתי.",
    generatorId: "multiply-vertical",
  },
  {
    id: "hiluk-aroch",
    name: "חילוק ארוך",
    strand: "פעולות החשבון",
    description: "חילוק במחלק חד-ספרתי או בעשרת שלמה.",
    generatorId: "long-division",
  },
  {
    id: "seder-peulot",
    name: "סדר פעולות וסוגריים",
    strand: "פעולות החשבון",
    description: "תרגילים משולבים בארבע פעולות עם סוגריים.",
    generatorId: "order-of-operations",
  },
  {
    id: "simanei-hitchalkut-369",
    name: "סימני התחלקות ב-3, 6, 9",
    strand: "פעולות החשבון",
    description: "בדיקת התחלקות לפי סכום הספרות.",
    generatorId: "divisibility-369",
  },
  {
    id: "rishoniim-prikim",
    name: "מספרים ראשוניים ופריקים",
    strand: "פעולות החשבון",
    description: "זיהוי מספר ראשוני ומציאת מחלק של מספר פריק.",
    generatorId: "primes",
  },
  {
    id: "chezkot",
    name: "חזקות",
    strand: "פעולות החשבון",
    description: "חישוב ערך של חזקה עם מעריך קטן.",
    generatorId: "powers",
  },
  {
    id: "shetach-vehekef-malben",
    name: "שטח והיקף מלבן",
    strand: "מדידות",
    description: "נוסחאות השטח וההיקף של מלבן ומציאת צלע חסרה.",
    generatorId: "rectangle-area",
  },
  {
    id: "nefach-teiva",
    name: "נפח תיבה ושטח פנים",
    strand: "מדידות",
    description: "חישוב נפח תיבה ושטח הפנים שלה.",
    generatorId: "box-volume-surface",
  },
  {
    id: "erech-hamakom-milion",
    name: "ערך המקום עד מיליון",
    strand: "פעולות החשבון",
    description: "ספרות וערכן במספרים בני חמש ושש ספרות ופירוק לפי ערך המקום.",
    generatorId: "place-value-million",
  },
  {
    id: "beayot-miluliot-kesef-umidot",
    name: "בעיות מילוליות בכסף ובמידות",
    strand: "בעיות מילוליות",
    description: "בעיות רב-שלביות בהקשרי קנייה, עודף, אורך ונפח.",
    generatorId: "word-money-measure",
  },
];

export default grade4Topics;
