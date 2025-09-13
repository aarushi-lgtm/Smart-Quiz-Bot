import React, { useMemo } from 'react';

interface MarkdownRendererProps {
  markdown: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
  const parsedContent = useMemo(() => {
    const lines = markdown.split('\n');
    const elements = [];
    let inCodeBlock = false;
    let codeContent = '';

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      if (line.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        if (!inCodeBlock) {
          elements.push(
            <pre key={`code-${i}`} className="bg-slate-900 p-4 rounded-lg my-4 overflow-x-auto">
              <code className="text-sm text-cyan-300">{codeContent.trim()}</code>
            </pre>
          );
          codeContent = '';
        }
        continue;
      }

      if (inCodeBlock) {
        codeContent += line + '\n';
        continue;
      }
      
      if (line.trim() === '') {
        continue;
      }

      // Headings
      if (line.startsWith('# ')) {
        elements.push(<h2 key={i} className="text-2xl font-bold mt-6 mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">{line.substring(2)}</h2>);
        continue;
      }
       if (line.startsWith('## ')) {
        elements.push(<h3 key={i} className="text-xl font-bold mt-5 mb-2 text-cyan-300">{line.substring(3)}</h3>);
        continue;
      }

      // Lists
      if (line.startsWith('* ') || line.startsWith('- ')) {
        elements.push(
          <li key={i} className="ml-6 my-1 list-disc text-slate-300">
            {line.substring(2)}
          </li>
        );
        continue;
      }
      
      // Bold, Italic, Inline Code
      const formatText = (text: string) => {
        return text
          .split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g)
          .map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={index} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('*') && part.endsWith('*')) {
              return <em key={index} className="italic text-slate-300">{part.slice(1, -1)}</em>;
            }
            if (part.startsWith('`') && part.endsWith('`')) {
              return <code key={index} className="bg-slate-700 text-sm text-cyan-300 rounded px-1.5 py-1 mx-0.5">{part.slice(1, -1)}</code>;
            }
            return part;
          });
      };
      
      elements.push(<p key={i} className="my-3 leading-relaxed text-slate-300">{formatText(line)}</p>);
    }

    return elements;
  }, [markdown]);

  return <div>{parsedContent}</div>;
};

export default MarkdownRenderer;
