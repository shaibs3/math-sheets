import TopicIcon from "./TopicIcon";

type Props = {
  topicId: string;
  title: string;
  strand: string;
  seed: number;
};

export default function WorksheetHeader({ topicId, title, strand, seed }: Props) {
  return (
    <header className="mb-6 border-b-2 border-black pb-3">
      <div className="flex items-center gap-3">
        <TopicIcon topicId={topicId} className="size-10 shrink-0" />
        <div className="grow">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-slate-600 print:text-black">{strand}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
        <span>שם: ________________________</span>
        <span>תאריך: ______________</span>
        <span className="text-slate-500 print:text-black">דף מס׳ {seed}</span>
      </div>
    </header>
  );
}
