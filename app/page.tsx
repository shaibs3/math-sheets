import GradePicker from "@/components/GradePicker";
import { PROGRESS_ENABLED } from "@/lib/features";
import HeroIllustration from "@/components/HeroIllustration";
import HomeGreeting from "@/components/HomeGreeting";

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <section className="paper-rule -mx-4 mb-10 px-4 pb-10 sm:-mx-6 sm:px-6">
        <div className="flex flex-col-reverse items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="sm:max-w-md">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              דפי עבודה במתמטיקה
            </h1>
          </div>
          <HeroIllustration className="hidden w-40 shrink-0 min-[400px]:block sm:w-48" />
        </div>
      </section>

      {PROGRESS_ENABLED ? (
        <HomeGreeting>
          <GradePicker heading="באיזו כיתה הילד/ה?" />
        </HomeGreeting>
      ) : (
        <GradePicker heading="באיזו כיתה הילד/ה?" />
      )}
    </main>
  );
}
