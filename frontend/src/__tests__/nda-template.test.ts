import {
  renderCoverPage,
  STANDARD_TERMS,
  STANDARD_TERMS_SECTIONS,
} from "@/lib/nda-template";
import { NdaFormData, defaultFormData } from "@/types/nda";

describe("renderCoverPage", () => {
  const filledData: NdaFormData = {
    purpose: "Evaluating a potential partnership",
    effectiveDate: "2026-03-12",
    mndaTermType: "fixed",
    mndaTermDuration: "2 years",
    confidentialityTermType: "fixed",
    confidentialityTermDuration: "3 years",
    governingLaw: "California",
    jurisdiction: "courts located in San Francisco, CA",
    modifications: "",
    party1Name: "Alice Smith",
    party1Title: "CEO",
    party1Company: "Acme Corp",
    party1Address: "alice@acme.com",
    party2Name: "Bob Jones",
    party2Title: "CTO",
    party2Company: "Widget Inc",
    party2Address: "bob@widget.com",
  };

  it("includes the document title", () => {
    const result = renderCoverPage(filledData);
    expect(result).toContain("# Mutual Non-Disclosure Agreement");
  });

  it("includes the purpose", () => {
    const result = renderCoverPage(filledData);
    expect(result).toContain("Evaluating a potential partnership");
  });

  it("includes the formatted effective date", () => {
    const result = renderCoverPage(filledData);
    expect(result).toContain("March 12, 2026");
  });

  it("includes the MNDA term for fixed type", () => {
    const result = renderCoverPage(filledData);
    expect(result).toContain("Expires 2 years from Effective Date.");
  });

  it("includes perpetual MNDA term when selected", () => {
    const data = { ...filledData, mndaTermType: "perpetual" as const };
    const result = renderCoverPage(data);
    expect(result).toContain("Continues until terminated");
  });

  it("includes the confidentiality term", () => {
    const result = renderCoverPage(filledData);
    expect(result).toContain("3 years from Effective Date");
  });

  it("includes perpetual confidentiality when selected", () => {
    const data = {
      ...filledData,
      confidentialityTermType: "perpetual" as const,
    };
    const result = renderCoverPage(data);
    expect(result).toContain("In perpetuity.");
  });

  it("includes governing law", () => {
    const result = renderCoverPage(filledData);
    expect(result).toContain("Governing Law: California");
  });

  it("includes jurisdiction", () => {
    const result = renderCoverPage(filledData);
    expect(result).toContain(
      "Jurisdiction: courts located in San Francisco, CA",
    );
  });

  it("includes party 1 details in table", () => {
    const result = renderCoverPage(filledData);
    expect(result).toContain("Alice Smith");
    expect(result).toContain("CEO");
    expect(result).toContain("Acme Corp");
    expect(result).toContain("alice@acme.com");
  });

  it("includes party 2 details in table", () => {
    const result = renderCoverPage(filledData);
    expect(result).toContain("Bob Jones");
    expect(result).toContain("CTO");
    expect(result).toContain("Widget Inc");
    expect(result).toContain("bob@widget.com");
  });

  it("shows placeholders for empty fields", () => {
    const data: NdaFormData = {
      ...defaultFormData,
      effectiveDate: "",
      governingLaw: "",
      jurisdiction: "",
      party1Name: "",
      party2Name: "",
    };
    const result = renderCoverPage(data);
    expect(result).toContain("Governing Law: _______________");
    expect(result).toContain("Jurisdiction: _______________");
    // Party names should have placeholders in the table
    const tableSection = result.split("PARTY 1")[1];
    expect(tableSection).toContain("_______________");
  });

  it("includes modifications when provided", () => {
    const data = {
      ...filledData,
      modifications: "Section 3 is amended to exclude oral disclosures.",
    };
    const result = renderCoverPage(data);
    expect(result).toContain("### MNDA Modifications");
    expect(result).toContain(
      "Section 3 is amended to exclude oral disclosures.",
    );
  });

  it("omits modifications section when empty", () => {
    const result = renderCoverPage(filledData);
    expect(result).not.toContain("### MNDA Modifications");
  });

  it("includes the CC BY 4.0 attribution", () => {
    const result = renderCoverPage(filledData);
    expect(result).toContain("CC BY 4.0");
  });

  it("includes the signature table structure", () => {
    const result = renderCoverPage(filledData);
    expect(result).toContain("| Signature |");
    expect(result).toContain("| Print Name |");
    expect(result).toContain("| Title |");
    expect(result).toContain("| Company |");
    expect(result).toContain("| Notice Address |");
    expect(result).toContain("| Date |");
  });

  it("handles special characters in party names", () => {
    const data = {
      ...filledData,
      party1Name: "O'Brien & Associates",
      party1Company: 'Smith "The Great" LLC',
    };
    const result = renderCoverPage(data);
    expect(result).toContain("O'Brien & Associates");
    expect(result).toContain('Smith "The Great" LLC');
  });

  it("handles very long purpose text", () => {
    const longPurpose = "A".repeat(1000);
    const data = { ...filledData, purpose: longPurpose };
    const result = renderCoverPage(data);
    expect(result).toContain(longPurpose);
  });
});

describe("STANDARD_TERMS", () => {
  it("contains all 11 sections", () => {
    for (let i = 1; i <= 11; i++) {
      expect(STANDARD_TERMS).toContain(`${i}. **`);
    }
  });

  it("contains key section titles", () => {
    expect(STANDARD_TERMS).toContain("Introduction");
    expect(STANDARD_TERMS).toContain("Use and Protection of Confidential Information");
    expect(STANDARD_TERMS).toContain("Exceptions");
    expect(STANDARD_TERMS).toContain("Disclosures Required by Law");
    expect(STANDARD_TERMS).toContain("Term and Termination");
    expect(STANDARD_TERMS).toContain("Return or Destruction");
    expect(STANDARD_TERMS).toContain("Proprietary Rights");
    expect(STANDARD_TERMS).toContain("Disclaimer");
    expect(STANDARD_TERMS).toContain("Governing Law and Jurisdiction");
    expect(STANDARD_TERMS).toContain("Equitable Relief");
    expect(STANDARD_TERMS).toContain("General");
  });

  it("includes CC BY 4.0 attribution", () => {
    expect(STANDARD_TERMS).toContain("CC BY 4.0");
  });
});

describe("STANDARD_TERMS_SECTIONS", () => {
  it("has 11 sections", () => {
    expect(STANDARD_TERMS_SECTIONS).toHaveLength(11);
  });

  it("sections are numbered 1 through 11", () => {
    STANDARD_TERMS_SECTIONS.forEach((section, i) => {
      expect(section.num).toBe(i + 1);
    });
  });

  it("each section has a title and text", () => {
    STANDARD_TERMS_SECTIONS.forEach((section) => {
      expect(section.title).toBeTruthy();
      expect(section.text).toBeTruthy();
      expect(section.text.length).toBeGreaterThan(50);
    });
  });

  it("section titles match STANDARD_TERMS markdown", () => {
    STANDARD_TERMS_SECTIONS.forEach((section) => {
      expect(STANDARD_TERMS).toContain(section.title);
    });
  });

  it("section text content matches STANDARD_TERMS markdown", () => {
    // Verify the first 50 chars of each section's text appears in STANDARD_TERMS
    STANDARD_TERMS_SECTIONS.forEach((section) => {
      const snippet = section.text.slice(0, 50);
      expect(STANDARD_TERMS).toContain(snippet);
    });
  });
});
