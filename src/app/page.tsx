import FaqSection from "@/components/landing/Faq";
import FeaturesSection from "@/components/landing/Features";
import Footer from "@/components/Footer";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/Hero";
import QuizDemo from "@/components/landing/QuizDemo";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <QuizDemo />
        <FeaturesSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
