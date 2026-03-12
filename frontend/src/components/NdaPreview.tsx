"use client";

import { useMemo } from "react";
import { NdaFormData } from "@/types/nda";
import { renderCoverPage, STANDARD_TERMS } from "@/lib/nda-template";

interface NdaPreviewProps {
  data: NdaFormData;
}

// Static standard terms HTML computed once at module load
const STANDARD_TERMS_HTML = markdownToHtml(STANDARD_TERMS);

export default function NdaPreview({ data }: NdaPreviewProps) {
  const coverPageHtml = useMemo(
    () => markdownToHtml(renderCoverPage(data)),
    [data],
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 max-w-none prose prose-sm prose-gray">
      <div
        dangerouslySetInnerHTML={{
          __html: coverPageHtml,
        }}
      />
      <hr className="my-8 border-gray-300" />
      <div
        dangerouslySetInnerHTML={{
          __html: STANDARD_TERMS_HTML,
        }}
      />
    </div>
  );
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function markdownToHtml(md: string): string {
  return md
    .split("\n\n")
    .map((block) => {
      block = block.trim();
      if (!block) return "";

      // Headings
      if (block.startsWith("### "))
        return `<h3 class="text-base font-semibold mt-4 mb-1">${inline(block.slice(4))}</h3>`;
      if (block.startsWith("## "))
        return `<h2 class="text-xl font-semibold mb-3">${inline(block.slice(3))}</h2>`;
      if (block.startsWith("# "))
        return `<h1 class="text-2xl font-bold text-center mb-4">${inline(block.slice(2))}</h1>`;

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
  // Escape HTML first, then apply markdown formatting
  const escaped = escapeHtml(text);
  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

function renderTable(block: string): string {
  const lines = block.split("\n").filter((l) => {
    const t = l.trim();
    if (!t) return false;
    // Filter out markdown table separator rows (e.g., |:---|:---:|:---:|)
    const cells = t
      .split("|")
      .map((c) => c.trim())
      .filter((c) => c !== "");
    return !cells.every((c) => /^[-:]+$/.test(c));
  });
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
