export default function Features() {
  return (
    <section className="mt-24 max-w-5xl w-full">

      <h2 className="text-3xl font-bold text-center">
        Why use Tarbiyah Planner?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold">📖 Learn & Read</h3>
          <p className="mt-2 text-gray-600">
            Encourage Quran reading, Hadith and useful knowledge.
          </p>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold">❤️ Good Deeds</h3>
          <p className="mt-2 text-gray-600">
            Help children practice kindness every day.
          </p>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold">🏃 Play & Move</h3>
          <p className="mt-2 text-gray-600">
            Build healthy habits through physical activity.
          </p>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold">🕌 Prayer Routine</h3>
          <p className="mt-2 text-gray-600">
            Help children stay consistent with their daily prayers.
          </p>
        </div>

      </div>

    </section>
  );
}