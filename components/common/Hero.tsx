import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="max-w-2xl text-center">
      <h1 className="text-5xl font-bold">
        Tarbiyah Planner
      </h1>

      <p className="mt-6 text-lg text-gray-600">
        Help your child build good habits, strong character and love for deen
        through simple daily routines.
      </p>

      <div className="mt-10 flex justify-center gap-4">
        <Button>
            Get Started
        </Button>
        
        <Button variant="outline">
            Login
        </Button>
      </div>
    </section>
  );
}