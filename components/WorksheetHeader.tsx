import StudyLevelBadge from "./StudyLevelBadge";
import TopicIcon from "./TopicIcon";
import type { StudyLevel } from "@/lib/types";

type Props = {
  topicId: string;
  title: string;
  strand: string;
  studyLevel?: StudyLevel;
};

export default function WorksheetHeader({ topicId, title, strand, studyLevel }: Props) {
  return (
    <header className="mb-6 border-b-2 border-black pb-3">
      <div className="flex items-center gap-3">
        <TopicIcon topicId={topicId} className="size-10 shrink-0" />
        <div className="grow">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="flex items-center gap-2 text-sm text-slate-600 print:text-black">
            {strand}
            {studyLevel ? <StudyLevelBadge level={studyLevel} /> : null}
          </p>
        </div>
      </div>
    </header>
  );
}
