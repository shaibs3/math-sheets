import type { Topic } from "../types";

export const grade1Topics: Topic[] = [
  {
    id: "hibur-hisur-ad-20",
    name: "חיבור וחיסור עד 20",
    strand: "פעולות החשבון",
    description: "תרגילי חיבור וחיסור בעשרת הראשונה ובעשרת השנייה.",
    generatorId: "add-sub-20",
  },
  {
    id: "hibur-hisur-ad-100",
    name: "חיבור וחיסור עד 100",
    strand: "פעולות החשבון",
    description: "חיבור וחיסור בתחום ה-100, כולל עשרות שלמות.",
    generatorId: "add-sub-100",
    levels: [1, 2],
  },
  {
    id: "shaalot-hibur-hisur",
    name: "שאלות חיבור וחיסור",
    strand: "פעולות החשבון",
    description: "שאלות מילוליות קצרות של הוספה ושל הורדה.",
    generatorId: "word-add-sub-basic",
    levels: [1, 2],
  },
  {
    id: "hashvaat-misparim",
    name: "השוואת מספרים",
    strand: "המספרים הטבעיים",
    description: "סימני גדול, קטן ושווה בין שני מספרים.",
    generatorId: "compare-numbers",
  },
  {
    id: "yashar-hamisparim",
    name: "ישר המספרים",
    strand: "המספרים הטבעיים",
    description: "השלמת המספר החסר בסדרה על ישר המספרים.",
    generatorId: "number-line-missing",
  },
  {
    id: "zugi-i-zugi",
    name: "זוגי ואי-זוגי",
    strand: "המספרים הטבעיים",
    description: "זיהוי מספרים זוגיים ואי-זוגיים.",
    generatorId: "even-odd",
  },
  {
    id: "shaon",
    name: "שעון",
    strand: "מדידות וגאומטרייה",
    description: "קריאת שעה, חישוב שעה עתידית ומשך זמן.",
    generatorId: "clock",
    levels: [1, 2],
  },
];

export default grade1Topics;
