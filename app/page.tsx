import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main
      className='flex flex-col items-center justify-center
        w-screen h-screen bg-white text-black'
    >
      <ResultContainer>
        <Hero />
      </ResultContainer>
    </main>
  );
}

function ResultContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      {children}
    </div>
  );
}
