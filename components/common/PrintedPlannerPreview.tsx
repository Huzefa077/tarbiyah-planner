import { Star } from "lucide-react";

const activities = [
  ["Learn & Read", "Read for 20 minutes"],
  ["Good Deeds", "Help at home"],
  ["Play & Move", "Outdoor play"],
  ["Family Time", "Creative activity"],
];

// A small visual reference to the real printable template, not a digital tracker.
export default function PrintedPlannerPreview() {
  return (
    <div className="relative w-full max-w-md px-3 py-5 sm:px-5">
      <Star aria-hidden="true" className="physical-star physical-star-float absolute -left-1 top-6 size-9 fill-amber-400 text-amber-500 sm:-left-3" />
      <Star aria-hidden="true" className="physical-star physical-star-glow absolute -right-1 bottom-8 size-11 fill-amber-400 text-amber-500 sm:-right-4" />

      <article className="relative rotate-0 rounded-md border border-zinc-300 bg-[#fffefb] p-4 text-zinc-950 shadow-xl shadow-black/20 sm:p-5 lg:rotate-1">
        <div className="flex items-start justify-between gap-3 border-b border-zinc-300 pb-3">
          <div className="text-[8px] font-medium sm:text-[9px]">
            <p>Name: __________________</p>
            <p className="mt-1">Month: __________</p>
          </div>
          <div className="text-center">
            <h2 className="text-sm font-bold sm:text-base">My 30 Day Journey</h2>
            <p className="mt-0.5 text-[7px] text-zinc-500 sm:text-[8px]">Little steps today, better me tomorrow.</p>
          </div>
          <div className="text-right text-[8px] font-medium sm:text-[9px]">
            <p>Focus of the Month</p>
            <div className="mt-2 w-16 border-b border-zinc-700 sm:w-20" />
          </div>
        </div>

        <div className="mt-4 overflow-hidden border border-zinc-800 text-[8px] sm:text-[9px]">
          <div className="grid grid-cols-[0.9fr_1.45fr_repeat(5,minmax(0,0.45fr))] border-b border-zinc-800 bg-zinc-100 text-center font-bold">
            <span className="border-r border-zinc-800 p-1">Section</span>
            <span className="border-r border-zinc-800 p-1">Activity</span>
            {[1, 2, 3, 4, 5].map((day) => <span className="border-r border-zinc-800 p-1 last:border-r-0" key={day}>{day}</span>)}
          </div>
          {activities.map(([section, activity]) => (
            <div className="grid grid-cols-[0.9fr_1.45fr_repeat(5,minmax(0,0.45fr))] border-b border-zinc-300 last:border-b-0" key={activity}>
              <span className="border-r border-zinc-300 p-1.5 font-semibold">{section}</span>
              <span className="border-r border-zinc-300 p-1.5">{activity}</span>
              {[1, 2, 3, 4, 5].map((day) => <span className="border-r border-zinc-300 p-1.5 last:border-r-0" key={day}><i aria-hidden="true" className="mx-auto block size-2 border border-zinc-700 sm:size-2.5" /></span>)}
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-[1.2fr_0.7fr_1.3fr] overflow-hidden border border-zinc-800 text-[8px] sm:text-[9px]">
          <div className="border-r border-zinc-800 p-2">
            <p className="font-bold">Weekly Rewards</p>
            <div className="mt-2 grid grid-cols-2 gap-1"><span className="rounded border border-zinc-300 p-1.5">Week 1</span><span className="rounded border border-zinc-300 p-1.5">Week 2</span></div>
          </div>
          <div className="border-r border-zinc-800 p-2"><p className="font-bold">Month Reward</p></div>
          <div className="p-2"><p className="font-bold">Daily Stars</p><div className="mt-2 flex flex-wrap gap-1 text-amber-500">{[1, 2, 3, 4, 5].map((star) => <Star aria-hidden="true" className="size-3 fill-amber-400" key={star} />)}</div></div>
        </div>

        <Star aria-hidden="true" className="physical-star physical-star-stuck absolute -right-3 top-1/2 size-8 fill-amber-400 text-amber-500" />
      </article>
    </div>
  );
}
