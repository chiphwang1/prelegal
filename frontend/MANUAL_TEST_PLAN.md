# Manual Test Plan — Mutual NDA Creator

## Prerequisites
- Run `cd frontend && npm install && npm run dev`
- Open `http://localhost:3000` in a browser

---

## 1. Page Load & Layout

| # | Test | Expected Result |
|---|------|----------------|
| 1.1 | Page loads without errors | Header "Mutual NDA Creator" visible, form and preview sections render |
| 1.2 | Page has correct title | Browser tab shows "Mutual NDA Creator" |
| 1.3 | Footer shows attribution | "Based on Common Paper Mutual NDA (Version 1.0)" visible |
| 1.4 | Download PDF button visible | Blue button with download icon in the preview section header |

---

## 2. Form — Default Values

| # | Test | Expected Result |
|---|------|----------------|
| 2.1 | Purpose pre-filled | "Evaluating whether to enter into a business relationship with the other party." |
| 2.2 | Effective Date is today | Date picker shows today's date |
| 2.3 | MNDA Term defaults to fixed | "Fixed term" radio selected, "1 year(s)" duration shown |
| 2.4 | Confidentiality Term defaults to fixed | "Fixed term" radio selected, "1 year(s)" duration shown |
| 2.5 | Governing Law empty | Placeholder "e.g., California" shown |
| 2.6 | Jurisdiction empty | Placeholder shown |
| 2.7 | Party fields empty | All 8 party fields (2 parties x 4 fields) show placeholders |
| 2.8 | Modifications empty | Textarea with placeholder shown |

---

## 3. Form — Field Interactions

| # | Test | Expected Result |
|---|------|----------------|
| 3.1 | Edit Purpose text | Preview updates immediately with new text |
| 3.2 | Change Effective Date | Preview shows newly formatted date |
| 3.3 | Switch MNDA Term to "Continues until terminated" | Duration input disappears; preview shows "Continues until terminated..." |
| 3.4 | Switch MNDA Term back to "Fixed term" | Duration input reappears with previous value |
| 3.5 | Edit MNDA Term duration to "5 years" | Preview shows "Expires 5 years from Effective Date." |
| 3.6 | Switch Confidentiality to "In perpetuity" | Preview shows "In perpetuity." |
| 3.7 | Enter Governing Law "California" | Preview shows "Governing Law: California" |
| 3.8 | Enter Jurisdiction "courts in SF, CA" | Preview shows "Jurisdiction: courts in SF, CA" |
| 3.9 | Enter Party 1 Name, Title, Company, Address | All 4 values appear in the preview signature table |
| 3.10 | Enter Party 2 Name, Title, Company, Address | All 4 values appear in the preview signature table |
| 3.11 | Enter Modifications text | "MNDA Modifications" heading appears in preview with the text |
| 3.12 | Clear Modifications text | "MNDA Modifications" section disappears from preview |

---

## 4. Preview — Document Structure

| # | Test | Expected Result |
|---|------|----------------|
| 4.1 | Cover page title | "Mutual Non-Disclosure Agreement" as H1 |
| 4.2 | Section headings present | Purpose, Effective Date, MNDA Term, Term of Confidentiality, Governing Law & Jurisdiction |
| 4.3 | Signature table present | Table with columns: (blank), PARTY 1, PARTY 2 |
| 4.4 | Table rows | Signature, Print Name, Title, Company, Notice Address, Date |
| 4.5 | Divider between cover page and terms | Visible horizontal line |
| 4.6 | Standard Terms heading | "Standard Terms" as H1 |
| 4.7 | All 11 sections present | Sections 1-11 with bold titles: Introduction, Use and Protection, Exceptions, etc. |
| 4.8 | CC BY 4.0 attribution | Footer text for both cover page and standard terms |

---

## 5. PDF Download

| # | Test | Expected Result |
|---|------|----------------|
| 5.1 | Click Download PDF with default data | PDF downloads; filename is "Mutual-NDA.pdf" |
| 5.2 | Fill in both company names, download | Filename includes company names: "Mutual-NDA-Acme-Widget.pdf" |
| 5.3 | Loading state during generation | Button shows spinner + "Generating PDF..." and is disabled |
| 5.4 | Button re-enables after download | Button returns to "Download PDF" state |
| 5.5 | PDF page 1 — Cover Page | All filled-in fields appear correctly |
| 5.6 | PDF page 2 — Standard Terms | All 11 sections present with bold section titles |
| 5.7 | PDF with all fields filled | Every field value appears in the PDF |
| 5.8 | PDF with empty fields | Placeholder underlines "_______________" appear for unfilled fields |

---

## 6. Edge Cases

| # | Test | Expected Result |
|---|------|----------------|
| 6.1 | Very long company name (100+ chars) | Preview wraps text; PDF handles overflow without clipping |
| 6.2 | Special characters: `O'Brien & Co.` | Renders correctly in both preview and PDF |
| 6.3 | Quotes in input: `"The Best" Corp` | Renders correctly without breaking HTML |
| 6.4 | HTML in input: `<b>Bold</b>` | Displayed as literal text, NOT rendered as HTML (XSS safety) |
| 6.5 | Script tag: `<script>alert(1)</script>` | Displayed as escaped text, no JS execution |
| 6.6 | Ampersand: `A & B Corp` | Renders as "A & B Corp" (not "A &amp; B Corp") in visible text |
| 6.7 | Unicode: `Müller GmbH` | Renders correctly in preview and PDF |
| 6.8 | Whitespace-only input | Treated as empty; placeholder shown |
| 6.9 | Multi-line modifications | Each line renders as separate paragraph in preview |
| 6.10 | Markdown-like input: `# Heading` | Displayed as literal text, NOT rendered as heading |

---

## 7. Cross-Browser Testing

| # | Browser | Test |
|---|---------|------|
| 7.1 | Chrome (latest) | Full workflow: fill form, preview, download PDF |
| 7.2 | Firefox (latest) | Full workflow: fill form, preview, download PDF |
| 7.3 | Safari (latest) | Full workflow: fill form, preview, download PDF |
| 7.4 | Edge (latest) | Full workflow: fill form, preview, download PDF |
| 7.5 | Mobile Safari (iOS) | Form fills and preview renders correctly |
| 7.6 | Chrome (Android) | Form fills and preview renders correctly |

---

## 8. Responsive Design

| # | Viewport | Test | Expected Result |
|---|----------|------|----------------|
| 8.1 | Desktop (1440px) | Full layout | Form and preview stack vertically with comfortable width |
| 8.2 | Tablet (768px) | Layout | Content fits within viewport; party fields may stack |
| 8.3 | Mobile (375px) | Layout | All form fields visible; preview scrolls horizontally if needed |
| 8.4 | Mobile (375px) | Party section grid | 2-column grid may be cramped; verify inputs are usable |

---

## 9. Accessibility

| # | Test | Expected Result |
|---|------|----------------|
| 9.1 | Keyboard navigation | Tab through all form fields in logical order |
| 9.2 | Radio button keyboard | Arrow keys switch between Fixed/Perpetual options |
| 9.3 | Download button keyboard | Enter/Space triggers download |
| 9.4 | Screen reader (VoiceOver/NVDA) | Form labels announced when inputs focused |
| 9.5 | Color contrast | Text readable against backgrounds |
| 9.6 | Focus indicators | Visible focus ring on all interactive elements |

---

## 10. Error Handling

| # | Test | Expected Result |
|---|------|----------------|
| 10.1 | Download with slow network | Loading state persists until complete |
| 10.2 | PDF generation failure (simulate) | Error alert shown; button re-enabled |
| 10.3 | Rapid double-click on Download | Only one PDF generated (button disabled during generation) |
