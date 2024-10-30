import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className=''>
      <main
        className='flex flex-col items-center justify-center
        w-screen h-screen bg-white text-black'
      >
        <Hero />
      </main>
    </div>
  );
}
