import type { Topic } from "../types";

export const grade12Topics: Topic[] = [
  {
    id: "merchak-ben-nekudot",
    name: "מרחק בין שתי נקודות",
    strand: "גאומטריה אנליטית",
    description: "חישוב אורך קטע לפי קואורדינטות קצותיו.",
    generatorId: "distance-points",
  },
  {
    id: "emtza-keta",
    name: "אמצע קטע",
    strand: "גאומטריה אנליטית",
    description: "מציאת אמצע הקטע או קצה חסר.",
    generatorId: "midpoint",
  },
  {
    id: "shipua-yeshirim",
    name: "ישרים מקבילים ומאונכים",
    strand: "גאומטריה אנליטית",
    description: "שיפוע של ישר מקביל או מאונך ומשוואת ישר דרך נקודה.",
    generatorId: "slope-relations",
  },
  {
    id: "mishvaat-yashar",
    name: "משוואת ישר",
    strand: "גאומטריה אנליטית",
    description: "מציאת שיפוע ומשוואת ישר לפי שתי נקודות.",
    generatorId: "line-from-points",
  },
  {
    id: "nekudat-hitux",
    name: "נקודת חיתוך בין ישרים",
    strand: "גאומטריה אנליטית",
    description: "פתרון מערכת שתי משוואות למציאת נקודת החיתוך.",
    generatorId: "linear-system",
  },
  {
    id: "mishvaa-ribuit",
    name: "משוואות ריבועיות",
    strand: "מודל ריבועי",
    description: "פתרון אלגברי של משוואה ריבועית.",
    generatorId: "quadratic-equation",
  },
  {
    id: "parabola",
    name: "הפרבולה",
    strand: "מודל ריבועי",
    description: "קודקוד, ציר סימטריה וחיתוך עם ציר ה-y.",
    generatorId: "parabola",
  },
  {
    id: "optimum-ribui",
    name: "מקסימום ומינימום במודל ריבועי",
    strand: "מודל ריבועי",
    description: "מציאת רווח מקסימלי או עלות מינימלית.",
    generatorId: "quadratic-optimum",
  },
  {
    id: "gufim-bemerchav",
    name: "נפחי גופים במרחב",
    strand: "גאומטריה במרחב",
    description: "נפח מנסרה, גליל, חרוט ופירמידה.",
    generatorId: "solids-volume",
  },
  {
    id: "trigonometria-bemerchav",
    name: "טריגונומטריה במשולש ישר זווית",
    strand: "גאומטריה במרחב",
    description: "יחסים טריגונומטריים ומציאת צלע לפי זווית.",
    generatorId: "right-triangle-trig",
  },
  {
    id: "hitpalgut-normalit",
    name: "התפלגות נורמלית",
    strand: "התפלגות נורמלית",
    description: "חישוב ציון תקן z ומציאת הערך המתאים לו.",
    generatorId: "z-score",
  },
];

export default grade12Topics;
