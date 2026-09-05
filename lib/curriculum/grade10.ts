import type { Topic } from "../types";

export const grade10Topics: Topic[] = [
  {
    id: "middey-merkaz",
    name: "מדדי מרכז",
    strand: "אשכול חברה ומדע",
    description: "ממוצע, חציון ושכיח של אוסף נתונים.",
    generatorId: "statistics-center",
  },
  {
    id: "histabrut-klasit",
    name: "הסתברות",
    strand: "אשכול חברה ומדע",
    description: "הסתברות של מאורע במרחב מדגם סימטרי.",
    generatorId: "probability-basic",
  },
  {
    id: "shinuy-nose",
    name: "שינוי נושא בנוסחה",
    strand: "אשכול חברה ומדע",
    description: "בידוד נעלם בנוסחה נתונה וחישוב ערכו.",
    generatorId: "formula-rearrange",
  },
  {
    id: "achuzim-tsarchaniim",
    name: "אחוזים בהקשר צרכני",
    strand: "אשכול פיננסי-כלכלי",
    description: "הנחות, מע\"מ ומציאת המחיר לפני ההנחה.",
    generatorId: "consumer-percent",
  },
  {
    id: "mishvaot-yishumiyot",
    name: "משוואות בהקשר יישומי",
    strand: "אשכול פיננסי-כלכלי",
    description: "פתרון משוואה ממעלה ראשונה עם סוגריים ומכנים.",
    generatorId: "linear-equation-brackets",
  },
  {
    id: "hashvaat-kedaiyut",
    name: "השוואת כדאיות",
    strand: "אשכול פיננסי-כלכלי",
    description: "פתרון מערכת שתי משוואות להשוואה בין שני מסלולים.",
    generatorId: "linear-system",
  },
  {
    id: "kotzev-shinuy",
    name: "קצב שינוי ומשוואת הישר",
    strand: "אשכול פיננסי-כלכלי",
    description: "מציאת שיפוע ומשוואת ישר לפי שתי נקודות.",
    generatorId: "line-from-points",
  },
  {
    id: "shetach-veheikef-murkav",
    name: "שטח והיקף של צורות מורכבות",
    strand: "אשכול התמצאות במישור ובמרחב",
    description: "צירוף מלבן, ריבוע וחלקי מעגל לחישוב שטח והיקף.",
    generatorId: "composite-area",
  },
  {
    id: "hamarat-yechidot",
    name: "המרת יחידות",
    strand: "אשכול התמצאות במישור ובמרחב",
    description: "מעבר בין יחידות אורך, משקל ושטח.",
    generatorId: "decimal-units",
  },
  {
    id: "mehirut-merchak-zman",
    name: "מהירות, מרחק וזמן",
    strand: "אשכול התמצאות במישור ובמרחב",
    description: "חישוב מהירות ממוצעת, מרחק ומשך נסיעה.",
    generatorId: "speed-distance-time",
  },
  {
    id: "optimum-ribui",
    name: "מינימום ומקסימום במודל ריבועי",
    strand: "אשכול התמצאות במישור ובמרחב",
    description: "מציאת הקודקוד של פונקציה ריבועית בהקשר יישומי.",
    generatorId: "quadratic-optimum",
  },
];

export default grade10Topics;
