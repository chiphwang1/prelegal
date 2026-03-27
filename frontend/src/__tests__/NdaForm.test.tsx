import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NdaForm from "@/components/NdaForm";
import { NdaFormData, defaultFormData } from "@/types/nda";

describe("NdaForm", () => {
  let onChange: jest.Mock;

  beforeEach(() => {
    onChange = jest.fn();
  });

  function renderForm(data: NdaFormData = defaultFormData) {
    return render(<NdaForm data={data} onChange={onChange} />);
  }

  describe("rendering", () => {
    it("renders all section headings", () => {
      renderForm();
      expect(screen.getByText("Agreement Details")).toBeInTheDocument();
      expect(screen.getByText("Terms")).toBeInTheDocument();
      expect(
        screen.getByText("Governing Law & Jurisdiction"),
      ).toBeInTheDocument();
      expect(screen.getByText("Party 1")).toBeInTheDocument();
      expect(screen.getByText("Party 2")).toBeInTheDocument();
      expect(screen.getByText("Modifications (Optional)")).toBeInTheDocument();
    });

    it("renders all form labels", () => {
      renderForm();
      expect(screen.getByText("Purpose")).toBeInTheDocument();
      expect(screen.getByText("Effective Date")).toBeInTheDocument();
      expect(screen.getByText("MNDA Term")).toBeInTheDocument();
      expect(screen.getByText("Term of Confidentiality")).toBeInTheDocument();
      expect(screen.getByText("Governing Law (State)")).toBeInTheDocument();
      expect(screen.getByText("Jurisdiction")).toBeInTheDocument();
      expect(screen.getByText("MNDA Modifications")).toBeInTheDocument();
    });

    it("renders party fields for both parties", () => {
      renderForm();
      // There should be 2 "Print Name" labels (one per party)
      const printNameLabels = screen.getAllByText("Print Name");
      expect(printNameLabels).toHaveLength(2);

      const titleLabels = screen.getAllByText("Title");
      expect(titleLabels).toHaveLength(2);

      const companyLabels = screen.getAllByText("Company");
      expect(companyLabels).toHaveLength(2);

      const addressLabels = screen.getAllByText("Notice Address");
      expect(addressLabels).toHaveLength(2);
    });

    it("renders radio buttons for MNDA term", () => {
      renderForm();
      const fixedRadios = screen.getAllByRole("radio");
      // 2 radios for MNDA term + 2 for confidentiality term = 4
      expect(fixedRadios).toHaveLength(4);
    });

    it("shows duration input only when fixed term is selected", () => {
      renderForm();
      const durationInputs = screen.getAllByPlaceholderText("e.g., 1 year(s)");
      // Both MNDA term and confidentiality term default to fixed
      expect(durationInputs).toHaveLength(2);
    });

    it("hides MNDA duration input when perpetual is selected", () => {
      const data: NdaFormData = {
        ...defaultFormData,
        mndaTermType: "perpetual",
      };
      renderForm(data);
      const durationInputs = screen.getAllByPlaceholderText("e.g., 1 year(s)");
      // Only confidentiality term's duration should be visible
      expect(durationInputs).toHaveLength(1);
    });

    it("displays current form data values", () => {
      const data: NdaFormData = {
        ...defaultFormData,
        governingLaw: "Texas",
        jurisdiction: "Dallas, TX",
        party1Name: "Alice",
        party2Company: "BigCo",
      };
      renderForm(data);
      expect(screen.getByDisplayValue("Texas")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Dallas, TX")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
      expect(screen.getByDisplayValue("BigCo")).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("calls onChange when purpose is edited", async () => {
      renderForm();
      const textarea = screen.getByPlaceholderText(
        "How Confidential Information may be used",
      );
      fireEvent.change(textarea, { target: { value: "New purpose" } });
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ purpose: "New purpose" }),
      );
    });

    it("calls onChange when effective date is changed", () => {
      renderForm();
      const dateInput = screen.getByDisplayValue(defaultFormData.effectiveDate);
      fireEvent.change(dateInput, { target: { value: "2027-01-01" } });
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ effectiveDate: "2027-01-01" }),
      );
    });

    it("calls onChange when governing law is edited", () => {
      renderForm();
      const input = screen.getByPlaceholderText("e.g., California");
      fireEvent.change(input, { target: { value: "New York" } });
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ governingLaw: "New York" }),
      );
    });

    it("calls onChange when jurisdiction is edited", () => {
      renderForm();
      const input = screen.getByPlaceholderText(
        "e.g., courts located in San Francisco, CA",
      );
      fireEvent.change(input, {
        target: { value: "courts in Manhattan, NY" },
      });
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ jurisdiction: "courts in Manhattan, NY" }),
      );
    });

    it("calls onChange when party 1 name is edited", () => {
      renderForm();
      const inputs = screen.getAllByPlaceholderText("Full name");
      fireEvent.change(inputs[0], { target: { value: "Alice Smith" } });
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ party1Name: "Alice Smith" }),
      );
    });

    it("calls onChange when party 2 name is edited", () => {
      renderForm();
      const inputs = screen.getAllByPlaceholderText("Full name");
      fireEvent.change(inputs[1], { target: { value: "Bob Jones" } });
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ party2Name: "Bob Jones" }),
      );
    });

    it("calls onChange when party 1 company is edited", () => {
      renderForm();
      const inputs = screen.getAllByPlaceholderText("Company name");
      fireEvent.change(inputs[0], { target: { value: "Acme Corp" } });
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ party1Company: "Acme Corp" }),
      );
    });

    it("calls onChange when party 2 company is edited", () => {
      renderForm();
      const inputs = screen.getAllByPlaceholderText("Company name");
      fireEvent.change(inputs[1], { target: { value: "Widget Inc" } });
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ party2Company: "Widget Inc" }),
      );
    });

    it("calls onChange when MNDA term type is changed to perpetual", () => {
      renderForm();
      const perpetualRadio = screen.getByLabelText("Continues until terminated");
      fireEvent.click(perpetualRadio);
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ mndaTermType: "perpetual" }),
      );
    });

    it("calls onChange when confidentiality term type is changed to perpetual", () => {
      renderForm();
      const perpetualRadio = screen.getByLabelText("In perpetuity");
      fireEvent.click(perpetualRadio);
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ confidentialityTermType: "perpetual" }),
      );
    });

    it("calls onChange when MNDA term duration is edited", () => {
      renderForm();
      const durationInputs = screen.getAllByPlaceholderText("e.g., 1 year(s)");
      fireEvent.change(durationInputs[0], { target: { value: "5 years" } });
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ mndaTermDuration: "5 years" }),
      );
    });

    it("calls onChange when modifications text is edited", () => {
      renderForm();
      const textarea = screen.getByPlaceholderText(
        "List any modifications to the MNDA standard terms",
      );
      fireEvent.change(textarea, { target: { value: "Custom modification" } });
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ modifications: "Custom modification" }),
      );
    });

    it("calls onChange when party title is edited", () => {
      renderForm();
      const inputs = screen.getAllByPlaceholderText("Job title");
      fireEvent.change(inputs[0], { target: { value: "CEO" } });
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ party1Title: "CEO" }),
      );
    });

    it("calls onChange when party address is edited", () => {
      renderForm();
      const inputs = screen.getAllByPlaceholderText("Email or postal address");
      fireEvent.change(inputs[1], {
        target: { value: "bob@example.com" },
      });
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ party2Address: "bob@example.com" }),
      );
    });
  });

  describe("data preservation", () => {
    it("preserves all existing data when a single field changes", () => {
      const data: NdaFormData = {
        purpose: "Original purpose",
        effectiveDate: "2026-01-01",
        mndaTermType: "fixed",
        mndaTermDuration: "1 year(s)",
        confidentialityTermType: "perpetual",
        confidentialityTermDuration: "",
        governingLaw: "Texas",
        jurisdiction: "Dallas, TX",
        modifications: "Some mods",
        party1Name: "Alice",
        party1Title: "CEO",
        party1Company: "Acme",
        party1Address: "alice@acme.com",
        party2Name: "Bob",
        party2Title: "CTO",
        party2Company: "Widget",
        party2Address: "bob@widget.com",
      };
      renderForm(data);

      const input = screen.getByPlaceholderText("e.g., California");
      fireEvent.change(input, { target: { value: "New York" } });

      const calledWith = onChange.mock.calls[0][0];
      // All existing fields should be preserved
      expect(calledWith.purpose).toBe("Original purpose");
      expect(calledWith.effectiveDate).toBe("2026-01-01");
      expect(calledWith.confidentialityTermType).toBe("perpetual");
      expect(calledWith.party1Name).toBe("Alice");
      expect(calledWith.party2Company).toBe("Widget");
      // Only governingLaw should change
      expect(calledWith.governingLaw).toBe("New York");
    });
  });
});
