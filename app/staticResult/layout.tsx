"use client";

export default function Layout({
  children,
  StaticAnalysis,
}: {
  children: React.ReactNode;
  StaticAnalysis: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-[15px]">
      {StaticAnalysis}
      {children}
    </div>
  );
}
