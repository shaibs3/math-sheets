import type { Topic } from "../types";

export const grade7Topics: Topic[] = [
  {
    id: "misparim-mechuvanim",
    name: "מספרים מכוונים",
    strand: "תחום מספרי",
    description: "ארבע פעולות החשבון במספרים חיוביים ושליליים.",
    generatorId: "signed-numbers",
  },
  {
    id: "seder-peulot",
    name: "סדר פעולות",
    strand: "תחום מספרי",
    description: "חוק הפילוג וסדר פעולות החשבון בביטויים מספריים.",
    generatorId: "order-of-operations",
  },
  {
    id: "hezkot-veshorashim",
    name: "חזקות ושורש ריבועי",
    strand: "תחום מספרי",
    description: "חזקה עם מעריך טבעי ושורש ריבועי של ריבוע שלם.",
    generatorId: "powers-roots",
  },
  {
    id: "hatzava-bebituy",
    name: "הצבה בביטוי אלגברי",
    strand: "תחום אלגברי",
    description: "חישוב הערך המספרי של ביטוי אלגברי עבור ערך נתון של x.",
    generatorId: "algebraic-substitution",
  },
  {
    id: "kinus-evarim",
    name: "כינוס איברים דומים",
    strand: "תחום אלגברי",
    description: "פישוט ביטוי אלגברי על ידי כינוס איברים דומים.",
    generatorId: "collect-like-terms",
  },
  {
    id: "ptichat-sograim",
    name: "פתיחת סוגריים",
    strand: "תחום אלגברי",
    description: "חוק הפילוג בביטויים אלגבריים, כולל מקדם שלילי.",
    generatorId: "distributive-expand",
  },
  {
    id: "mishvaot-maala-rishona",
    name: "משוואות ממעלה ראשונה",
    strand: "תחום אלגברי",
    description: "פתרון משוואה בנעלם אחד, כולל נעלם בשני האגפים.",
    generatorId: "linear-equation",
  },
  {
    id: "shealot-milulot-mishvaa",
    name: "שאלות מילוליות במשוואה",
    strand: "תחום אלגברי",
    description: "תרגום שאלה מילולית למשוואה ממעלה ראשונה ופתרונה.",
    generatorId: "equation-word-problems",
  },
  {
    id: "erech-funktsia",
    name: "ערך של פונקציה",
    strand: "תחום אלגברי",
    description: "חישוב y לפי x ומציאת x לפי y בפונקציה קווית.",
    generatorId: "function-value",
  },
  {
    id: "zaviot",
    name: "חישובי זוויות",
    strand: "תחום גאומטרי",
    description: "זוויות צמודות, סכום זוויות במשולש ובמצולע וזוויות בין מקבילים.",
    generatorId: "angles",
  },
  {
    id: "shetach-veheikef",
    name: "שטח והיקף מצולעים",
    strand: "תחום גאומטרי",
    description: "מלבן, משולש, מקבילית וטרפז.",
    generatorId: "area-shapes",
  },
  {
    id: "maagal-veigul",
    name: "מעגל ועיגול",
    strand: "תחום גאומטרי",
    description: "היקף המעגל ושטח העיגול לפי רדיוס או קוטר.",
    generatorId: "circle",
  },
  {
    id: "nefach-gufim",
    name: "נפח ושטח פנים",
    strand: "תחום גאומטרי",
    description: "נפח ושטח פנים של תיבה וקובייה.",
    generatorId: "box-volume-surface",
  },
];

export default grade7Topics;
