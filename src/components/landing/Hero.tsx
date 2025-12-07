import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container text-center">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl font-headline">
          Create, Play, and Master with AI-Powered Quizzes
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Welcome to QuizGenius, your ultimate tool for generating intelligent quizzes.
          Whether you want to create quizzes from any topic using AI or build them manually, we have you covered.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
