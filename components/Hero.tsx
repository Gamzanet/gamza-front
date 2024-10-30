import { ReactNode } from "react";

export default function Hero() {
  return (
    <Background>
      <HerbicideTypography />
    </Background>
  );
}

export function Background({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background:
          "radial-gradient(89.67% 159.84% at 76.02% 19.88%, #EB487F 0%, #D29FB8 34%, #F71097 75%, #ED6AC4 100%)",
      }}
      className='absolute w-[90vw] h-[90vh] overflow-x-hidden select-none'
    >
      <div className='position absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
        {children}
      </div>
    </div>
  );
}

export function HerbicideTypography() {
  return (
    <p
      style={{
        fontFamily: "Lora",
        fontWeight: 600,
        fontSize: "128px",
      }}
      className='text-white'
    >
      Herbicide
    </p>
  );
}

// TODO: Add ellipsis animation to the text