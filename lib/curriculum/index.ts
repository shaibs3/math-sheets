import type { Grade, Topic } from "../types";
import grade1Topics from "./grade1";
import grade2Topics from "./grade2";
import grade3Topics from "./grade3";
import grade4Topics from "./grade4";
import grade5Topics from "./grade5";
import grade6Topics from "./grade6";
import grade7Topics from "./grade7";
import grade8Topics from "./grade8";
import grade9Topics from "./grade9";
import grade10Topics from "./grade10";
import grade11Topics from "./grade11";
import grade12Topics from "./grade12";

export const grades: Grade[] = [
  { id: 1, name: "כיתה א'", available: true, topics: grade1Topics },
  { id: 2, name: "כיתה ב'", available: true, topics: grade2Topics },
  { id: 3, name: "כיתה ג'", available: true, topics: grade3Topics },
  { id: 4, name: "כיתה ד'", available: true, topics: grade4Topics },
  { id: 5, name: "כיתה ה'", available: true, topics: grade5Topics },
  { id: 6, name: "כיתה ו'", available: true, topics: grade6Topics },
  { id: 7, name: "כיתה ז'", available: true, topics: grade7Topics },
  { id: 8, name: "כיתה ח'", available: true, topics: grade8Topics },
  { id: 9, name: "כיתה ט'", available: true, topics: grade9Topics },
  { id: 10, name: "כיתה י'", available: true, topics: grade10Topics },
  { id: 11, name: "כיתה י\"א", available: true, topics: grade11Topics },
  { id: 12, name: "כיתה י\"ב", available: true, topics: grade12Topics },
];

export function getGrade(id: number): Grade | undefined {
  return grades.find((grade) => grade.id === id);
}

export function getTopic(gradeId: number, topicId: string): Topic | undefined {
  return getGrade(gradeId)?.topics.find((topic) => topic.id === topicId);
}

export function gradeForTopic(topicId: string): Grade | undefined {
  return grades.find((grade) => grade.topics.some((topic) => topic.id === topicId));
}
