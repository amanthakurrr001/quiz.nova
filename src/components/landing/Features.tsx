import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Bot, Edit3, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const features = [
  {
    icon: <Bot className="h-8 w-8" />,
    title: 'AI Quiz Generation',
    description: 'Instantly generate engaging quizzes on any topic using the power of Gemini. Just provide a prompt, and let our AI do the rest.',
    imageId: 'feature-ai'
  },
  {
    icon: <Edit3 className="h-8 w-8" />,
    title: 'Manual Quiz Creator',
    description: 'Have specific questions in mind? Use our intuitive form-based editor to build your quizzes from scratch with full control.',
    imageId: 'feature-manual'
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: 'Track Your Growth',
    description: 'Save your quizzes and track your performance over time. Our visual dashboards help you see your progress in different topics.',
    imageId: 'feature-tracking'
  },
];

export default function FeaturesSection() {
    const images = PlaceHolderImages.filter(img => features.some(f => f.imageId === img.id));

  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            Everything You Need to Succeed
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            QuizGenius offers a powerful suite of tools to enhance your learning and testing experience.
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => {
            const image = images.find(img => img.id === feature.imageId);
            return (
              <Card key={index} className="text-center shadow-sm hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                   {image && (
                     <div className="relative aspect-video mt-4 rounded-md overflow-hidden">
                       <Image
                         src={image.imageUrl}
                         alt={image.description}
                         fill
                         sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                         className="object-cover"
                         data-ai-hint={image.imageHint}
                       />
                     </div>
                   )}
                  <CardTitle className="pt-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  );
}
