import type { Topic } from "../types";

export const grade2Topics: Topic[] = [
  {
    id: "hibur-hisur-bemeuzan",
    name: "חיבור וחיסור במאוזן",
    strand: "פעולות החשבון",
    description: "חיבור וחיסור בתחום ה-100 בעל פה ובכתיבה מאוזנת.",
    generatorId: "add-sub-100",
  },
  {
    id: "hibur-hisur-bemeunach",
    name: "חיבור וחיסור במאונך",
    strand: "פעולות החשבון",
    description: "חיבור וחיסור של מספרים דו-ספרתיים ותלת-ספרתיים במאונך.",
    generatorId: "add-sub-vertical",
    levels: [1, 2],
  },
  {
    id: "kefel-vehiluk",
    name: "כפל וחילוק",
    strand: "פעולות החשבון",
    description: "תרגילי לוח הכפל הראשוני והחילוק ההפוך להם.",
    generatorId: "multiply-table",
    levels: [1, 2],
  },
  {
    id: "shaalot-hibur-hisur",
    name: "שאלות חיבור וחיסור",
    strand: "פעולות החשבון",
    description: "שאלות מילוליות בתחום ה-100.",
    generatorId: "word-add-sub-basic",
  },
  {
    id: "simanei-hitchalkut",
    name: "סימני התחלקות ב-2, 5, 10",
    strand: "פעולות החשבון",
    description: "בדיקה אם מספר מתחלק ב-2, ב-5 או ב-10 ללא שארית.",
    generatorId: "divisibility",
    levels: [1],
  },
  {
    id: "erech-hamakom",
    name: "ערך המקום",
    strand: "המספרים הטבעיים",
    description: "ספרות היחידות, העשרות והמאות והערך שהן מייצגות.",
    generatorId: "place-value",
  },
  {
    id: "shaon",
    name: "מדידות זמן",
    strand: "מדידות וגאומטרייה",
    description: "שעות שלמות, חצאי שעה ורבעי שעה ומשך זמן.",
    generatorId: "clock",
  },
  {
    id: "kesef",
    name: "כסף ועודף",
    strand: "מדידות וגאומטרייה",
    description: "חישוב מחיר כולל וחישוב עודף בשקלים.",
    generatorId: "money",
  },
  {
    id: "midot-orech",
    name: "מדידות אורך",
    strand: "מדידות וגאומטרייה",
    description: "מעבר בין מטר, סנטימטר ומילימטר.",
    generatorId: "length-units",
  },
];

export default grade2Topics;
