import { NdaFormData } from "@/types/nda";

export function formatDate(dateStr: string): string {
  if (!dateStr) return "_______________";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function placeholder(value: string, fallback: string): string {
  return value.trim() || fallback;
}

export function getMndaTermText(data: NdaFormData): string {
  return data.mndaTermType === "fixed"
    ? `Expires ${placeholder(data.mndaTermDuration, "___")} from Effective Date.`
    : "Continues until terminated in accordance with the terms of the MNDA.";
}

export function getConfidentialityTermText(data: NdaFormData): string {
  return data.confidentialityTermType === "fixed"
    ? `${placeholder(data.confidentialityTermDuration, "___")} from Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws.`
    : "In perpetuity.";
}
