import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";
import React from "react";

const CodeHighlighter = ({ codeString, fontSize = 1 }) => {
  return (
    <div
      className="code-highlighter max-h-[30vh]"
      style={{ fontSize: `${fontSize}rem` }}
    >
      <SyntaxHighlighter language="solidity" style={solarizedlight}>
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};
export default CodeHighlighter;
