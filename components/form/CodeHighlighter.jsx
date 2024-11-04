import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeHighlighter = ({ codeString }) => {
  return (
    <SyntaxHighlighter language="solidity" style={dark}>
      {codeString}
    </SyntaxHighlighter>
  );
};
export default CodeHighlighter;
