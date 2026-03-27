import { render, screen, fireEvent } from "@testing-library/react";
import Home from "@/app/page";

// Mock the PDF generator to avoid react-pdf issues in JSDOM
jest.mock("@/lib/pdf-generator", () => ({
  generateNdaPdf: jest.fn().mockResolvedValue(new Blob(["test"])),
}));

describe("Home Page", () => {
  describe("layout", () => {
    it("renders the page header", () => {
      render(<Home />);
      expect(screen.getByText("Mutual NDA Creator")).toBeInTheDocument();
    });

    it("renders the description text", () => {
      render(<Home />);
      expect(
        screen.getByText(/Fill in the details below to generate/),
      ).toBeInTheDocument();
    });

    it("renders the NDA Details section", () => {
      render(<Home />);
      expect(screen.getByText("NDA Details")).toBeInTheDocument();
    });

    it("renders the Document Preview section", () => {
      render(<Home />);
      expect(screen.getByText("Document Preview")).toBeInTheDocument();
    });

    it("renders the footer with attribution", () => {
      render(<Home />);
      // Footer specifically contains "Based on" prefix
      expect(
        screen.getByText(/Based on Common Paper Mutual NDA/),
      ).toBeInTheDocument();
    });

    it("renders the Download PDF button", () => {
      render(<Home />);
      expect(screen.getByText("Download PDF")).toBeInTheDocument();
    });
  });

  describe("form-to-preview integration", () => {
    it("updates preview when governing law is entered", () => {
      render(<Home />);
      const input = screen.getByPlaceholderText("e.g., California");
      fireEvent.change(input, { target: { value: "New York" } });

      // The preview should now contain "New York"
      expect(screen.getByText(/Governing Law: New York/)).toBeInTheDocument();
    });

    it("updates preview when party 1 name is entered", () => {
      render(<Home />);
      const inputs = screen.getAllByPlaceholderText("Full name");
      fireEvent.change(inputs[0], { target: { value: "Jane Doe" } });

      // Jane Doe should appear in the preview table
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });

    it("updates preview when party 2 company is entered", () => {
      render(<Home />);
      const inputs = screen.getAllByPlaceholderText("Company name");
      fireEvent.change(inputs[1], { target: { value: "MegaCorp" } });

      expect(screen.getByText("MegaCorp")).toBeInTheDocument();
    });

    it("updates preview when MNDA term is switched to perpetual", () => {
      render(<Home />);
      const perpetualRadio = screen.getByLabelText(
        "Continues until terminated",
      );
      fireEvent.click(perpetualRadio);

      expect(
        screen.getByText(/Continues until terminated in accordance/),
      ).toBeInTheDocument();
    });

    it("updates preview when confidentiality term is switched to perpetual", () => {
      render(<Home />);
      const perpetualRadio = screen.getByLabelText("In perpetuity");
      fireEvent.click(perpetualRadio);

      expect(screen.getByText(/In perpetuity\./)).toBeInTheDocument();
    });

    it("updates preview when modifications are entered", () => {
      render(<Home />);
      const textarea = screen.getByPlaceholderText(
        "List any modifications to the MNDA standard terms",
      );
      fireEvent.change(textarea, {
        target: { value: "Section 3 is removed." },
      });

      expect(
        screen.getByText("Section 3 is removed."),
      ).toBeInTheDocument();
    });

    it("shows default purpose in preview", () => {
      render(<Home />);
      // The purpose text appears in both form and preview, so use getAllByText
      const matches = screen.getAllByText(
        /Evaluating whether to enter into a business/,
      );
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });

    it("updates preview when purpose is changed", () => {
      render(<Home />);
      const textarea = screen.getByPlaceholderText(
        "How Confidential Information may be used",
      );
      fireEvent.change(textarea, {
        target: { value: "Technical collaboration" },
      });

      // Should appear in both the form (textarea value) and preview
      const texts = screen.getAllByText(/Technical collaboration/);
      expect(texts.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("form defaults", () => {
    it("starts with default purpose text", () => {
      render(<Home />);
      const textarea = screen.getByPlaceholderText(
        "How Confidential Information may be used",
      );
      expect(textarea).toHaveValue(
        "Evaluating whether to enter into a business relationship with the other party.",
      );
    });

    it("starts with today's date", () => {
      render(<Home />);
      const today = new Date().toISOString().split("T")[0];
      expect(screen.getByDisplayValue(today)).toBeInTheDocument();
    });

    it("starts with fixed MNDA term selected", () => {
      render(<Home />);
      const fixedRadios = screen.getAllByLabelText("Fixed term");
      expect(fixedRadios[0]).toBeChecked();
    });

    it("starts with 1 year(s) duration", () => {
      render(<Home />);
      const durationInputs = screen.getAllByDisplayValue("1 year(s)");
      expect(durationInputs).toHaveLength(2);
    });

    it("starts with empty governing law", () => {
      render(<Home />);
      const input = screen.getByPlaceholderText("e.g., California");
      expect(input).toHaveValue("");
    });

    it("starts with empty party fields", () => {
      render(<Home />);
      const nameInputs = screen.getAllByPlaceholderText("Full name");
      nameInputs.forEach((input) => {
        expect(input).toHaveValue("");
      });
    });
  });
});
