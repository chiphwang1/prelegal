import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { NdaFormData } from "@/types/nda";
import { STANDARD_TERMS_SECTIONS } from "@/lib/nda-template";
import {
  formatDate,
  placeholder,
  getMndaTermText,
  getConfidentialityTermText,
} from "@/lib/utils";

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },
  title: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginTop: 14,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 8,
    color: "#666",
    marginBottom: 4,
    fontStyle: "italic",
  },
  paragraph: {
    marginBottom: 8,
    textAlign: "justify",
  },
  table: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableHeader: {
    width: "33.33%",
    padding: 6,
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  tableHeaderLast: {
    width: "33.33%",
    padding: 6,
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },
  tableCell: {
    width: "33.33%",
    padding: 6,
    fontSize: 9,
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  tableCellLast: {
    width: "33.33%",
    padding: 6,
    fontSize: 9,
  },
  footer: {
    marginTop: 20,
    fontSize: 8,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
  },
  standardTermsTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 16,
  },
  numberedItem: {
    marginBottom: 8,
    textAlign: "justify",
  },
  introText: {
    marginBottom: 12,
    fontSize: 9,
    textAlign: "justify",
  },
});

function NdaPdfDocument({ data }: { data: NdaFormData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Mutual Non-Disclosure Agreement</Text>

        <Text style={styles.introText}>
          This Mutual Non-Disclosure Agreement (the &quot;MNDA&quot;) consists
          of: (1) this Cover Page (&quot;Cover Page&quot;) and (2) the Common
          Paper Mutual NDA Standard Terms Version 1.0 (&quot;Standard
          Terms&quot;) identical to those posted at
          commonpaper.com/standards/mutual-nda/1.0. Any modifications of the
          Standard Terms should be made on the Cover Page, which will control
          over conflicts with the Standard Terms.
        </Text>

        <Text style={styles.sectionTitle}>Purpose</Text>
        <Text style={styles.subtitle}>
          How Confidential Information may be used
        </Text>
        <Text style={styles.paragraph}>
          {placeholder(data.purpose, "_______________")}
        </Text>

        <Text style={styles.sectionTitle}>Effective Date</Text>
        <Text style={styles.paragraph}>{formatDate(data.effectiveDate)}</Text>

        <Text style={styles.sectionTitle}>MNDA Term</Text>
        <Text style={styles.subtitle}>The length of this MNDA</Text>
        <Text style={styles.paragraph}>{getMndaTermText(data)}</Text>

        <Text style={styles.sectionTitle}>Term of Confidentiality</Text>
        <Text style={styles.subtitle}>
          How long Confidential Information is protected
        </Text>
        <Text style={styles.paragraph}>
          {getConfidentialityTermText(data)}
        </Text>

        <Text style={styles.sectionTitle}>
          Governing Law & Jurisdiction
        </Text>
        <Text style={styles.paragraph}>
          Governing Law: {placeholder(data.governingLaw, "_______________")}
        </Text>
        <Text style={styles.paragraph}>
          Jurisdiction: {placeholder(data.jurisdiction, "_______________")}
        </Text>

        {data.modifications ? (
          <>
            <Text style={styles.sectionTitle}>MNDA Modifications</Text>
            <Text style={styles.paragraph}>{data.modifications}</Text>
          </>
        ) : null}

        <Text style={{ marginTop: 12, marginBottom: 8 }}>
          By signing this Cover Page, each party agrees to enter into this MNDA
          as of the Effective Date.
        </Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}></Text>
            <Text style={styles.tableHeader}>PARTY 1</Text>
            <Text style={styles.tableHeaderLast}>PARTY 2</Text>
          </View>
          {[
            ["Signature", "", ""],
            [
              "Print Name",
              placeholder(data.party1Name, "_______________"),
              placeholder(data.party2Name, "_______________"),
            ],
            [
              "Title",
              placeholder(data.party1Title, "_______________"),
              placeholder(data.party2Title, "_______________"),
            ],
            [
              "Company",
              placeholder(data.party1Company, "_______________"),
              placeholder(data.party2Company, "_______________"),
            ],
            [
              "Notice Address",
              placeholder(data.party1Address, "_______________"),
              placeholder(data.party2Address, "_______________"),
            ],
            ["Date", "", ""],
          ].map((row, i) => (
            <View style={styles.tableRow} key={i}>
              <Text style={styles.tableCell}>{row[0]}</Text>
              <Text style={styles.tableCell}>{row[1]}</Text>
              <Text style={styles.tableCellLast}>{row[2]}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use
          under CC BY 4.0.
        </Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.standardTermsTitle}>Standard Terms</Text>

        {STANDARD_TERMS_SECTIONS.map((section) => (
          <Text style={styles.numberedItem} key={section.num}>
            {section.num}. {section.title}. {section.text}
          </Text>
        ))}

        <Text style={styles.footer}>
          Common Paper Mutual Non-Disclosure Agreement Version 1.0 free to use
          under CC BY 4.0.
        </Text>
      </Page>
    </Document>
  );
}

export function generateNdaPdf(data: NdaFormData): Promise<Blob> {
  return pdf(<NdaPdfDocument data={data} />).toBlob();
}
