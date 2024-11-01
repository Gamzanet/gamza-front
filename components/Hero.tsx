export default function HerbicideHero() {
  return (
    <Background>
      <HerbicideTypography />
    </Background>
  );
}

function Background({ children }: { children: React.ReactNode }) {
  return <div className='flex items-center justify-center'>{children}</div>;
}

function HerbicideTypography() {
  return (
    <p className='select-none font-lora font-semibold text-[128px] text-foreground'>
      Herbicide
    </p>
  );
}
