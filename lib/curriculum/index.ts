import type { Grade, Topic } from "../types";
import grade1Topics from "./grade1";
import grade2Topics from "./grade2";
import grade3Topics from "./grade3";
import grade4Topics from "./grade4";
import grade5Topics from "./grade5";
import grade6Topics from "./grade6";

export const grades: Grade[] = [
  { id: 1, name: "כיתה א'", available: true, topics: grade1Topics },
  { id: 2, name: "כיתה ב'", available: true, topics: grade2Topics },
  { id: 3, name: "כיתה ג'", available: true, topics: grade3Topics },
  { id: 4, name: "כיתה ד'", available: true, topics: grade4Topics },
  { id: 5, name: "כיתה ה'", available: true, topics: grade5Topics },
  { id: 6, name: "כיתה ו'", available: true, topics: grade6Topics },
];

export function getGrade(id: number): Grade | undefined {
  return grades.find((grade) => grade.id === id);
}

export function getTopic(gradeId: number, topicId: string): Topic | undefined {
  return getGrade(gradeId)?.topics.find((topic) => topic.id === topicId);
}
