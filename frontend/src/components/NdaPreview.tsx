"use client";

import { NdaFormData } from "@/types/nda";
import { renderCoverPage, STANDARD_TERMS } from "@/lib/nda-template";

interface NdaPreviewProps {
  data: NdaFormData;
}

export default function NdaPreview({ data }: NdaPreviewProps) {
  const coverPage = renderCoverPage(data);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 max-w-none prose prose-sm prose-gray">
      <div
        dangerouslySetInnerHTML={{
          __html: markdownToHtml(coverPage),
        }}
      />
      <hr className="my-8 border-gray-300" />
      <div
        dangerouslySetInnerHTML={{
          __html: markdownToHtml(STANDARD_TERMS),
        }}
      />
    </div>
  );
}

function markdownToHtml(md: string): string {
  return md
    .split("\n\n")
    .map((block) => {
      block = block.trim();
      if (!block) return "";

      // Headings
      if (block.startsWith("# "))
        return `<h1 class="text-2xl font-bold text-center mb-4">${inline(block.slice(2))}</h1>`;
      if (block.startsWith("## "))
        return `<h2 class="text-xl font-semibold mb-3">${inline(block.slice(3))}</h2>`;
      if (block.startsWith("### "))
        return `<h3 class="text-base font-semibold mt-4 mb-1">${inline(block.slice(4))}</h3>`;

      // Table
      if (block.includes("|")) {
        return renderTable(block);
      }

      // Paragraph
      return `<p class="mb-2 text-sm leading-relaxed">${inline(block)}</p>`;
    })
    .join("\n");
}

function inline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/&/g, (match, offset, str) => {
      // Don't double-escape already escaped entities
      if (str.slice(offset, offset + 5).match(/&amp;|&lt;|&gt;|&quot;/))
        return match;
      return "&amp;";
    });
}

function renderTable(block: string): string {
  const lines = block
    .split("\n")
    .filter((l) => l.trim() && !l.trim().match(/^\|[\s:-]+\|$/));
  if (lines.length === 0) return "";

  const rows = lines.map((line) =>
    line
      .split("|")
      .map((cell) => cell.trim())
      .filter((cell) => cell !== ""),
  );

  let html =
    '<table class="w-full border-collapse border border-gray-300 text-sm my-4">';

  rows.forEach((row, i) => {
    html += "<tr>";
    row.forEach((cell) => {
      const tag = i === 0 ? "th" : "td";
      const cls =
        i === 0
          ? "border border-gray-300 px-3 py-2 bg-gray-50 font-semibold text-left"
          : "border border-gray-300 px-3 py-2";
      html += `<${tag} class="${cls}">${inline(cell)}</${tag}>`;
    });
    html += "</tr>";
  });

  html += "</table>";
  return html;
}
