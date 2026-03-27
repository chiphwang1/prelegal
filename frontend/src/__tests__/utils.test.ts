import {
  formatDate,
  placeholder,
  getMndaTermText,
  getConfidentialityTermText,
} from "@/lib/utils";
import { NdaFormData, defaultFormData } from "@/types/nda";

describe("formatDate", () => {
  it("formats a valid date string", () => {
    const result = formatDate("2026-03-12");
    expect(result).toBe("March 12, 2026");
  });

  it("formats January 1st correctly", () => {
    expect(formatDate("2025-01-01")).toBe("January 1, 2025");
  });

  it("formats December 31st correctly", () => {
    expect(formatDate("2025-12-31")).toBe("December 31, 2025");
  });

  it("returns placeholder for empty string", () => {
    expect(formatDate("")).toBe("_______________");
  });

  it("handles leap year date", () => {
    expect(formatDate("2024-02-29")).toBe("February 29, 2024");
  });
});

describe("placeholder", () => {
  it("returns value when non-empty", () => {
    expect(placeholder("hello", "fallback")).toBe("hello");
  });

  it("returns fallback for empty string", () => {
    expect(placeholder("", "fallback")).toBe("fallback");
  });

  it("returns fallback for whitespace-only string", () => {
    expect(placeholder("   ", "fallback")).toBe("fallback");
  });

  it("trims leading/trailing whitespace from value", () => {
    expect(placeholder("  hello  ", "fallback")).toBe("hello");
  });

  it("handles special characters in value", () => {
    expect(placeholder("O'Brien & Co.", "fallback")).toBe("O'Brien & Co.");
  });

  it("handles unicode characters", () => {
    expect(placeholder("Müller GmbH", "fallback")).toBe("Müller GmbH");
  });
});

describe("getMndaTermText", () => {
  it("returns fixed term text with duration", () => {
    const data: NdaFormData = {
      ...defaultFormData,
      mndaTermType: "fixed",
      mndaTermDuration: "2 years",
    };
    expect(getMndaTermText(data)).toBe(
      "Expires 2 years from Effective Date.",
    );
  });

  it("returns perpetual text", () => {
    const data: NdaFormData = {
      ...defaultFormData,
      mndaTermType: "perpetual",
    };
    expect(getMndaTermText(data)).toBe(
      "Continues until terminated in accordance with the terms of the MNDA.",
    );
  });

  it("uses placeholder when duration is empty", () => {
    const data: NdaFormData = {
      ...defaultFormData,
      mndaTermType: "fixed",
      mndaTermDuration: "",
    };
    expect(getMndaTermText(data)).toBe("Expires ___ from Effective Date.");
  });

  it("uses placeholder when duration is whitespace", () => {
    const data: NdaFormData = {
      ...defaultFormData,
      mndaTermType: "fixed",
      mndaTermDuration: "   ",
    };
    expect(getMndaTermText(data)).toBe("Expires ___ from Effective Date.");
  });
});

describe("getConfidentialityTermText", () => {
  it("returns fixed term text with duration", () => {
    const data: NdaFormData = {
      ...defaultFormData,
      confidentialityTermType: "fixed",
      confidentialityTermDuration: "3 years",
    };
    const result = getConfidentialityTermText(data);
    expect(result).toContain("3 years from Effective Date");
    expect(result).toContain("trade secret");
  });

  it("returns perpetual text", () => {
    const data: NdaFormData = {
      ...defaultFormData,
      confidentialityTermType: "perpetual",
    };
    expect(getConfidentialityTermText(data)).toBe("In perpetuity.");
  });

  it("uses placeholder when duration is empty", () => {
    const data: NdaFormData = {
      ...defaultFormData,
      confidentialityTermType: "fixed",
      confidentialityTermDuration: "",
    };
    const result = getConfidentialityTermText(data);
    expect(result).toContain("___ from Effective Date");
  });
});
