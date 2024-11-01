import HerbicideHero from "@/components/Hero";

export default function Home() {
  return (
    <main
      className='flex flex-col items-center justify-center
        w-full h-full bg-white text-black'
    >
      <HerbicideHero />
      <ResultContainer>aa</ResultContainer>
    </main>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function ResultContainer({ children }: { children: React.ReactNode }) {
  return (
    <Carousel className='w-full max-w-xs'>
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className='p-1'>
              <Card>
                <CardContent className='flex aspect-square items-center justify-center p-6'>
                  {children}
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
