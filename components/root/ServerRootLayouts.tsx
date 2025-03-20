"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

import { Menubar, MenubarMenu } from "@/components/ui/menubar";

export function TopStickMenuBar() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const SimpleRouteMenubarMenu = () => {
    const routes = ["Scan"];
    return routes.map((route) => (
      <MenubarMenu key={`MenubarMenu-${route}`}>
        <Link
          href={`/${route.toLowerCase()}`}
          className={`p-2 space-x-2 hover:text-accent hover:opacity-100 rounded-[50px] text-center justify-center transition ${
            isDarkMode
              ? "text-white opacity-80 hover:bg-gray-700"
              : "text-black opacity-80 hover:bg-[#F1F1F1]"
          }`}
          style={{
            width: "152px",
            height: "51px",
            fontFamily: "'SF Pro Display'",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "31px",
            alignItems: "center",
            textAlign: "center",
          }}
          key={`Link-${route}`}
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
        <Image
          src="/Logo.svg"
          alt="Logo"
          width={200}
          height={71}
          className={`transition ${
            isDarkMode ? "invert" : "" /* Dark mode에서 색 반전 */
          }`}
        />
      </Link>
      {SimpleRouteMenubarMenu()}
      <Link
        href="https://gamza-net.gitbook.io/gamza.net"
        target="_blank"
        className={`p-2 space-x-2 hover:text-accent hover:opacity-100 rounded-[50px] justify-center transition ${
          isDarkMode
            ? "text-white opacity-80 hover:bg-gray-700"
            : "text-black opacity-80 hover:bg-[#F1F1F1]"
        }`}
        style={{
          width: "152px",
          height: "51px",
          fontFamily: "'SF Pro Display'",
          fontStyle: "normal",
          fontWeight: 400,
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