import ProjectUpdates from "@/components/common/ProjectUpdates";

// ROUTE: /updates — a separate page for feature news and planned improvements.
export default function UpdatesPage() {
  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Edit config/projectUpdates.ts, then deploy, to publish a new update. */}
        <ProjectUpdates />
      </div>
    </main>
  );
}
