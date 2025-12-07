import { BrainCircuit } from "lucide-react";
import Link from "next/link";

export function Logo({ inHeader = false }: { inHeader?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <BrainCircuit className={`h-6 w-6 ${inHeader ? 'text-primary' : 'text-primary-foreground'}`} />
      <span className={`text-xl font-bold ${inHeader ? 'text-foreground' : 'text-primary-foreground'}`}>
        QuizGenius
      </span>
    </Link>
  );
}
