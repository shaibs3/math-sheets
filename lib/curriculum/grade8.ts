import type { Topic } from "../types";

export const grade8Topics: Topic[] = [
  {
    id: "mishvaot-im-sograim",
    name: "משוואות עם סוגריים ומכנים",
    strand: "תחום אלגברי",
    description: "פתרון משוואה ממעלה ראשונה הכוללת סוגריים או חילוק במספר.",
    generatorId: "linear-equation-brackets",
  },
  {
    id: "i-shivyonot",
    name: "אי-שוויונות",
    strand: "תחום אלגברי",
    description: "פתרון אי-שוויון ממעלה ראשונה, כולל היפוך סימן במקדם שלילי.",
    generatorId: "linear-inequality",
  },
  {
    id: "maarechet-mishvaot",
    name: "מערכת שתי משוואות",
    strand: "תחום אלגברי",
    description: "פתרון מערכת של שתי משוואות בשני נעלמים.",
    generatorId: "linear-system",
  },
  {
    id: "erech-muhlat",
    name: "משוואות עם ערך מוחלט",
    strand: "תחום אלגברי",
    description: "פתרון משוואה מהצורה |ax + b| = c ושני פתרונותיה.",
    generatorId: "absolute-value-equation",
  },
  {
    id: "funktsia-kavit",
    name: "הפונקציה הקווית",
    strand: "תחום אלגברי",
    description: "שיפוע ונקודות החיתוך של y = mx + b עם הצירים.",
    generatorId: "linear-function",
  },
  {
    id: "shipua-mishtei-nekudot",
    name: "שיפוע לפי שתי נקודות",
    strand: "תחום אלגברי",
    description: "חישוב שיפוע הישר העובר דרך שתי נקודות נתונות במערכת הצירים.",
    generatorId: "coordinate-slope",
  },
  {
    id: "mishvaat-yashar",
    name: "משוואת ישר משתי נקודות",
    strand: "תחום אלגברי",
    description: "מציאת שיפוע ומשוואת ישר לפי שתי נקודות נתונות.",
    generatorId: "line-from-points",
  },
  {
    id: "achuzim-shinuy",
    name: "העלאה והורדה באחוזים",
    strand: "תחום מספרי",
    description: "התייקרות, הוזלה ושינוי אחוזים עוקב.",
    generatorId: "percent-change",
  },
  {
    id: "kne-mida",
    name: "יחס וקנה מידה",
    strand: "תחום מספרי",
    description: "מעבר בין אורך במפה לאורך במציאות.",
    generatorId: "scale",
  },
  {
    id: "middey-merkaz",
    name: "ממוצע, חציון ושכיח",
    strand: "תחום מספרי",
    description: "מדדי מרכז של אוסף נתונים.",
    generatorId: "statistics-center",
  },
  {
    id: "histabrut",
    name: "הסתברות בסיסית",
    strand: "תחום מספרי",
    description: "הסתברות של מאורע במרחב מדגם סימטרי.",
    generatorId: "probability-basic",
  },
  {
    id: "pitagoras",
    name: "משפט פיתגורס",
    strand: "תחום גאומטרי",
    description: "מציאת יתר או ניצב במשולש ישר זווית.",
    generatorId: "pythagoras",
  },
  {
    id: "dimyon-meshulashim",
    name: "דמיון משולשים",
    strand: "תחום גאומטרי",
    description: "יחס דמיון, יחסי צלעות, היקפים ושטחים.",
    generatorId: "similar-triangles",
  },
  {
    id: "galil",
    name: "גליל",
    strand: "תחום גאומטרי",
    description: "נפח ושטח פנים של גליל ישר.",
    generatorId: "cylinder",
  },
];

export default grade8Topics;
