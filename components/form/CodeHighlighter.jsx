"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeHighlighter = ({ codeString, fontSize = 1 }) => {
  return (
    <div className="code-highlighter" style={{ fontSize: `${fontSize}rem` }}>
      <SyntaxHighlighter language="solidity" style={solarizedlight}>
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};
export default CodeHighlighter;
