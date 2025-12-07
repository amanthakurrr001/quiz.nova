import { Logo } from "./Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Logo />
          <p className="text-sm text-primary-foreground/80">
            &copy; {currentYear} QuizGenius. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
