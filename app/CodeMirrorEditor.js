"use client";
import CodeMirror from "@uiw/react-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { php } from "@codemirror/lang-php";

// Map language string → CodeMirror extension
const getLangExtension = (lang) => {
  switch (lang) {
    case "javascript": return [javascript({ jsx: true })];
    case "typescript": return [javascript({ typescript: true })];
    case "python":     return [python()];
    case "java":       return [java()];
    case "cpp":
    case "csharp":     return [cpp()];
    case "php":        return [php()];
    // Go, Ruby, Swift — fall back to plain text (no extra package needed)
    default:           return [];
  }
};

export default function CodeMirrorEditor({ value, language, onChange }) {
  return (
    <CodeMirror
      value={value}
      height="100%"
      theme={oneDark}
      extensions={getLangExtension(language)}
      onChange={onChange}
      basicSetup={{
        lineNumbers: true,
        highlightActiveLineGutter: true,
        highlightSpecialChars: true,
        foldGutter: true,
        dropCursor: true,
        allowMultipleSelections: true,
        indentOnInput: true,
        syntaxHighlighting: true,
        bracketMatching: true,
        closeBrackets: true,
        autocompletion: true,
        rectangularSelection: true,
        crosshairCursor: false,
        highlightActiveLine: true,
        highlightSelectionMatches: true,
        closeBracketsKeymap: true,
        defaultKeymap: true,
        searchKeymap: true,
        historyKeymap: true,
        foldKeymap: true,
        completionKeymap: true,
        lintKeymap: true,
      }}
      style={{
        height: "100%",
        fontSize: "14px",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    />
  );
}
