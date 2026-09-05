import type { Topic } from "../types";

export const grade3Topics: Topic[] = [
  {
    id: "luach-hakefel",
    name: "לוח הכפל",
    strand: "פעולות החשבון",
    description: "ביסוס לוח הכפל עד 10 והחילוק ההפוך.",
    generatorId: "multiply-table",
  },
  {
    id: "kefel-bemeunach",
    name: "כפל במאונך",
    strand: "פעולות החשבון",
    description: "כפל מספר דו-ספרתי או תלת-ספרתי במספר חד-ספרתי.",
    generatorId: "multiply-vertical",
    levels: [1, 2],
  },
  {
    id: "hiluk-im-sheerit",
    name: "חילוק עם שארית",
    strand: "פעולות החשבון",
    description: "חילוק במחלק חד-ספרתי, תשובה עם מנה ושארית.",
    generatorId: "divide-remainder",
  },
  {
    id: "hibur-hisur-bemeunach",
    name: "חיבור וחיסור במאונך",
    strand: "פעולות החשבון",
    description: "חיבור וחיסור במאונך בתחום הרבבה.",
    generatorId: "add-sub-vertical",
  },
  {
    id: "kefel-be-asarot",
    name: "כפל בעשרות ובמאות",
    strand: "פעולות החשבון",
    description: "הגדלה והקטנה פי 10 ופי 100 וכפל בעשרות שלמות.",
    generatorId: "multiply-powers-ten",
  },
  {
    id: "seder-peulot",
    name: "סדר פעולות וסוגריים",
    strand: "פעולות החשבון",
    description: "תרגילים משולבים עם קדימות כפל וחילוק ועם סוגריים.",
    generatorId: "order-of-operations",
    levels: [1, 2],
  },
  {
    id: "simanei-hitchalkut",
    name: "סימני התחלקות ב-2, 5, 10",
    strand: "פעולות החשבון",
    description: "בדיקת התחלקות ללא שארית בתחום הרבבה.",
    generatorId: "divisibility",
  },
  {
    id: "shever-yesodi",
    name: "שבר יסודי",
    strand: "שברים",
    description: "מציאת חלק יסודי מכמות ומציאת הכמות מתוך החלק.",
    generatorId: "unit-fraction",
  },
  {
    id: "midot-zman",
    name: "יחידות זמן",
    strand: "מדידות וגאומטרייה",
    description: "מעבר בין ימים, שעות, דקות ושניות.",
    generatorId: "time-units",
  },
];

export default grade3Topics;
