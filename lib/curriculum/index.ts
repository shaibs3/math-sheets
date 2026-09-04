import type { Grade, Topic } from "../types";
import grade6Topics from "./grade6";

export const grades: Grade[] = [
  { id: 1, name: "כיתה א'", available: false, topics: [] },
  { id: 2, name: "כיתה ב'", available: false, topics: [] },
  { id: 3, name: "כיתה ג'", available: false, topics: [] },
  { id: 4, name: "כיתה ד'", available: false, topics: [] },
  { id: 5, name: "כיתה ה'", available: false, topics: [] },
  { id: 6, name: "כיתה ו'", available: true, topics: grade6Topics },
];

export function getGrade(id: number): Grade | undefined {
  return grades.find((grade) => grade.id === id);
}

export function getTopic(gradeId: number, topicId: string): Topic | undefined {
  return getGrade(gradeId)?.topics.find((topic) => topic.id === topicId);
}
