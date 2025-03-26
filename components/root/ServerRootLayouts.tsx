"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Menubar, MenubarMenu } from "@/components/ui/menubar";

export function TopStickMenuBar() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false); // ✅ 클라이언트 마운트 확인용 상태

  useEffect(() => {
    setMounted(true); // ✅ 마운트 완료 후 클라이언트에서만 테마 적용
  }, []);

  const isDarkMode = mounted && theme === "dark"; // ✅ 마운트 이후에만 테마 적용

  const SimpleRouteMenubarMenu = () => {
    const routes = ["Scan"];
    return routes.map((route) => (
      <MenubarMenu key={`MenubarMenu-${route}`}>
        <Link
          href={`/${route.toLowerCase()}`}
          className={`p-2 space-x-2 hover:underline rounded-[50px] text-center justify-center transition ${
            isDarkMode ? "text-white" : "text-black"
          }`}
          style={{
            width: "152px",
            height: "51px",
            fontFamily: "inherit",
            fontStyle: "normal",
            fontWeight: 700,
            fontSize: "31px",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {route}
        </Link>
      </MenubarMenu>
    ));
  };

  return (
    <Menubar
      className={`sticky flex top-[0] w-full border-0 mt-2 rounded-none z-50 pt-6 pb-8 gap-[24px] transition ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <Link href="/" className="pr-8 ml-6">
        {/* ✅ 서버 렌더링 시 Hydration Error 방지 */}
        {mounted && (
          <Image
            src="/Logo.svg"
            alt="Logo"
            width={200}
            height={71}
            className={`transition ${isDarkMode ? "invert" : ""}`}
          />
        )}
      </Link>
      {SimpleRouteMenubarMenu()}
      <Link
        href="https://gamza-net.gitbook.io/gamza.net"
        target="_blank"
        className={`p-2 space-x-2 hover:underline rounded-[50px] justify-center transition ${
          isDarkMode ? "bg-black text-white" : "bg-white text-black"
        }`}
        style={{
          width: "152px",
          height: "51px",
          fontFamily: "inherit",
          fontStyle: "normal",
          fontWeight: 700,
          fontSize: "31px",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        Docs
      </Link>
    </Menubar>
  );
}
