import { defaultFormData, NdaFormData } from "@/types/nda";

describe("defaultFormData", () => {
  it("has all required fields", () => {
    const requiredKeys: (keyof NdaFormData)[] = [
      "purpose",
      "effectiveDate",
      "mndaTermType",
      "mndaTermDuration",
      "confidentialityTermType",
      "confidentialityTermDuration",
      "governingLaw",
      "jurisdiction",
      "modifications",
      "party1Name",
      "party1Title",
      "party1Company",
      "party1Address",
      "party2Name",
      "party2Title",
      "party2Company",
      "party2Address",
    ];
    requiredKeys.forEach((key) => {
      expect(defaultFormData).toHaveProperty(key);
    });
  });

  it("has a non-empty default purpose", () => {
    expect(defaultFormData.purpose.length).toBeGreaterThan(0);
  });

  it("has today's date as effective date", () => {
    const today = new Date().toISOString().split("T")[0];
    expect(defaultFormData.effectiveDate).toBe(today);
  });

  it("defaults to fixed MNDA term", () => {
    expect(defaultFormData.mndaTermType).toBe("fixed");
  });

  it("defaults to fixed confidentiality term", () => {
    expect(defaultFormData.confidentialityTermType).toBe("fixed");
  });

  it("has 1 year(s) as default durations", () => {
    expect(defaultFormData.mndaTermDuration).toBe("1 year(s)");
    expect(defaultFormData.confidentialityTermDuration).toBe("1 year(s)");
  });

  it("has empty strings for party fields", () => {
    expect(defaultFormData.party1Name).toBe("");
    expect(defaultFormData.party1Title).toBe("");
    expect(defaultFormData.party1Company).toBe("");
    expect(defaultFormData.party1Address).toBe("");
    expect(defaultFormData.party2Name).toBe("");
    expect(defaultFormData.party2Title).toBe("");
    expect(defaultFormData.party2Company).toBe("");
    expect(defaultFormData.party2Address).toBe("");
  });

  it("has empty strings for optional fields", () => {
    expect(defaultFormData.governingLaw).toBe("");
    expect(defaultFormData.jurisdiction).toBe("");
    expect(defaultFormData.modifications).toBe("");
  });

  it("can be spread to create a modified copy", () => {
    const modified = { ...defaultFormData, governingLaw: "Texas" };
    expect(modified.governingLaw).toBe("Texas");
    expect(modified.purpose).toBe(defaultFormData.purpose);
    // Original unchanged
    expect(defaultFormData.governingLaw).toBe("");
  });
});
