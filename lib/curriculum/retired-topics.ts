export type RetiredTopic = {
  gradeId: number;
  retiredTopicId: string;
  replacementTopicId: string;
};

export const retiredTopics: RetiredTopic[] = [
  { gradeId: 1, retiredTopicId: "hibur-hisur-ad-100", replacementTopicId: "hibur-hisur-asarot" },
];

export default retiredTopics;
