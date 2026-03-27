import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DownloadButton from "@/components/DownloadButton";
import { defaultFormData, NdaFormData } from "@/types/nda";

// Mock the PDF generator
jest.mock("@/lib/pdf-generator", () => ({
  generateNdaPdf: jest.fn(),
}));

import { generateNdaPdf } from "@/lib/pdf-generator";
const mockGenerateNdaPdf = generateNdaPdf as jest.MockedFunction<
  typeof generateNdaPdf
>;

describe("DownloadButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.URL.createObjectURL = jest.fn(() => "blob:mock-url");
    global.URL.revokeObjectURL = jest.fn();
  });

  it("renders the download button with text", () => {
    render(<DownloadButton data={defaultFormData} />);
    expect(screen.getByText("Download PDF")).toBeInTheDocument();
  });

  it("renders as a button element", () => {
    render(<DownloadButton data={defaultFormData} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("is not disabled initially", () => {
    render(<DownloadButton data={defaultFormData} />);
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("contains an SVG icon", () => {
    render(<DownloadButton data={defaultFormData} />);
    const button = screen.getByRole("button");
    expect(button.querySelector("svg")).toBeTruthy();
  });

  it("calls generateNdaPdf with form data when clicked", async () => {
    const mockBlob = new Blob(["test"], { type: "application/pdf" });
    mockGenerateNdaPdf.mockResolvedValueOnce(mockBlob);

    render(<DownloadButton data={defaultFormData} />);
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(mockGenerateNdaPdf).toHaveBeenCalledWith(defaultFormData);
    });
  });

  it("shows loading state while generating", async () => {
    let resolvePromise: (value: Blob) => void;
    const promise = new Promise<Blob>((resolve) => {
      resolvePromise = resolve;
    });
    mockGenerateNdaPdf.mockReturnValueOnce(promise);

    render(<DownloadButton data={defaultFormData} />);
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Generating PDF...")).toBeInTheDocument();
    });
    expect(screen.getByRole("button")).toBeDisabled();

    resolvePromise!(new Blob(["test"]));
    await waitFor(() => {
      expect(screen.getByText("Download PDF")).toBeInTheDocument();
    });
  });

  it("creates and triggers download link", async () => {
    const mockBlob = new Blob(["test"], { type: "application/pdf" });
    mockGenerateNdaPdf.mockResolvedValueOnce(mockBlob);

    render(<DownloadButton data={defaultFormData} />);
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
    });
  });

  it("revokes object URL after download", async () => {
    const mockBlob = new Blob(["test"], { type: "application/pdf" });
    mockGenerateNdaPdf.mockResolvedValueOnce(mockBlob);

    render(<DownloadButton data={defaultFormData} />);
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
    });
  });

  it("shows alert on PDF generation failure", async () => {
    mockGenerateNdaPdf.mockRejectedValueOnce(new Error("PDF failed"));
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});

    render(<DownloadButton data={defaultFormData} />);
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Failed to generate PDF. Please try again.",
      );
    });

    alertSpy.mockRestore();
  });

  it("logs error to console on failure", async () => {
    mockGenerateNdaPdf.mockRejectedValueOnce(new Error("PDF failed"));
    jest.spyOn(window, "alert").mockImplementation(() => {});
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<DownloadButton data={defaultFormData} />);
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "PDF generation failed:",
        expect.any(Error),
      );
    });

    consoleSpy.mockRestore();
  });

  it("re-enables button after failure", async () => {
    mockGenerateNdaPdf.mockRejectedValueOnce(new Error("PDF failed"));
    jest.spyOn(window, "alert").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});

    render(<DownloadButton data={defaultFormData} />);
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
      expect(screen.getByText("Download PDF")).toBeInTheDocument();
    });
  });

  it("re-enables button after success", async () => {
    const mockBlob = new Blob(["test"], { type: "application/pdf" });
    mockGenerateNdaPdf.mockResolvedValueOnce(mockBlob);

    render(<DownloadButton data={defaultFormData} />);
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });
  });
});
