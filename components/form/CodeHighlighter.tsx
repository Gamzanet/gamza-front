"use client";

import { useState } from "react";
import { useTheme } from "next-themes"; // ✅ 다크모드 감지
import { Prism } from "react-syntax-highlighter";
import { vscDarkPlus, prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { Button } from "../ui/button";
import { Copy } from "lucide-react"; // 복사 아이콘 추가

const CodeHighlighter = ({ codeString, fontSize }: { codeString: string; fontSize: number }) => {
  const { theme } = useTheme(); // ✅ 현재 테마 가져오기
  const isDarkMode = theme === "dark";

  return (
    <pre style={{ margin: 0, overflow: "auto" }}>
      <Prism
        language="solidity"
        style={isDarkMode ? vscDarkPlus : prism} // ✅ 다크모드: vscDarkPlus / 라이트모드: prism
        showLineNumbers={true}
        wrapLongLines={false}
        codeTagProps={{
          style: {
            fontSize: `${fontSize}rem`,
            whiteSpace: "pre",
          },
        }}
      >
        {codeString}
      </Prism>
    </pre>
  );
};

const ScrollableCode = ({
  children,
  className,
  codeString,
}: {
  children?: React.ReactNode;
  className?: string;
  codeString: string;
}) => {
  const { theme } = useTheme(); // ✅ 현재 테마 가져오기
  const isDarkMode = theme === "dark";
  const [fontSize, setFontSize] = useState(1.0);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <ScrollArea.Root
      className={`h-[500px] max-h-[30vh] w-full overflow-hidden rounded relative transition ${
        isDarkMode ? "bg-[#1e1e1e] text-white" : "bg-[#f5f2f0] text-[#333]"
      } ${className}`}
    >
      {/* ✅ Copy 버튼 (다크 & 라이트 모드 적용) */}
      <div className="absolute right-3 top-3 flex items-center gap-2">
        <Button
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition ${
            isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-black"
          }`}
          onClick={handleCopy}
        >
          <Copy size={14} />
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>

      <ScrollArea.Viewport className="size-full rounded">
        {children}
        <CodeHighlighter codeString={codeString} fontSize={fontSize} />
      </ScrollArea.Viewport>

      {/* ✅ 스크롤바 색상 변경 */}
      <ScrollArea.Scrollbar
        className={`flex touch-none select-none p-0.5 transition-colors duration-[160ms] ease-out ${
          isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-300 hover:bg-gray-400"
        } data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col`}
        orientation="vertical"
      >
        <ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-gray-500" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar
        className={`flex touch-none select-none p-0.5 transition-colors duration-[160ms] ease-out ${
          isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-300 hover:bg-gray-400"
        } data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col`}
        orientation="horizontal"
      >
        <ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-gray-500" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner className={isDarkMode ? "bg-gray-700" : "bg-gray-300"} />
    </ScrollArea.Root>
  );
};

export default ScrollableCode;