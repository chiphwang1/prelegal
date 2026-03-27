export interface NdaFormData {
  purpose: string;
  effectiveDate: string;
  mndaTermType: "fixed" | "perpetual";
  mndaTermDuration: string;
  confidentialityTermType: "fixed" | "perpetual";
  confidentialityTermDuration: string;
  governingLaw: string;
  jurisdiction: string;
  modifications: string;
  party1Name: string;
  party1Title: string;
  party1Company: string;
  party1Address: string;
  party2Name: string;
  party2Title: string;
  party2Company: string;
  party2Address: string;
}

export const defaultFormData: NdaFormData = {
  purpose:
    "Evaluating whether to enter into a business relationship with the other party.",
  effectiveDate: new Date().toISOString().split("T")[0],
  mndaTermType: "fixed",
  mndaTermDuration: "1 year(s)",
  confidentialityTermType: "fixed",
  confidentialityTermDuration: "1 year(s)",
  governingLaw: "",
  jurisdiction: "",
  modifications: "",
  party1Name: "",
  party1Title: "",
  party1Company: "",
  party1Address: "",
  party2Name: "",
  party2Title: "",
  party2Company: "",
  party2Address: "",
};
