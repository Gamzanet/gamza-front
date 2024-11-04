"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { Button } from "../ui/button";

const CodeHighlighter = ({ codeString }) => {
  const [fontSize, setFontSize] = useState(0.7);
  return (
    <div className={`text-[${fontSize}rem]`}>
      <Button
        className='rounded-full m-2 text-xl w-fit-content text-align-center text-white'
        onClick={() => {
          setFontSize(fontSize + 0.5);
        }}
      >
        +
      </Button>
      <Button
        className='rounded-full m-2 text-xl w-fit-content text-align-center text-white'
        onClick={() => {
          setFontSize(fontSize - 0.5);
        }}
      >
        -
      </Button>
      <SyntaxHighlighter language='solidity' style={dark}>
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};
export default CodeHighlighter;
