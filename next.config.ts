import type { NextConfig } from "next";
import { retiredTopics } from "./lib/curriculum/retired-topics";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  redirects: async () =>
    retiredTopics.map(({ gradeId, retiredTopicId, replacementTopicId }) => ({
      source: `/sheet/${gradeId}/${retiredTopicId}`,
      destination: `/sheet/${gradeId}/${replacementTopicId}`,
      permanent: true,
    })),
};

export default nextConfig;
