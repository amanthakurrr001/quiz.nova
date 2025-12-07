import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How does the AI quiz generation work?',
    answer:
      'Our AI quiz generator uses Google\'s Gemini API. You provide a topic, number of questions, and difficulty level, and it creates a unique quiz for you in seconds.',
  },
  {
    question: 'Can I save and review my quizzes?',
    answer:
      'Absolutely! All quizzes you create or generate can be saved to your profile. You can retake them anytime and track your performance on the "Growth" page.',
  },
  {
    question: 'Is QuizGenius free to use?',
    answer:
      'The platform itself is free to use including AI generation. Feel free to generate as many quizzes as you would like.',
  },
];

export default function FaqSection() {
  return (
    <section className="bg-muted/50 py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="mx-auto mt-12 max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
