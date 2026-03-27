"use client";

import { NdaFormData } from "@/types/nda";

interface NdaFormProps {
  data: NdaFormData;
  onChange: (data: NdaFormData) => void;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none";

function TermField({
  label,
  termType,
  duration,
  perpetualLabel,
  onTypeChange,
  onDurationChange,
  radioName,
}: {
  label: string;
  termType: "fixed" | "perpetual";
  duration: string;
  perpetualLabel: string;
  onTypeChange: (type: "fixed" | "perpetual") => void;
  onDurationChange: (value: string) => void;
  radioName: string;
}) {
  return (
    <Field label={label}>
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name={radioName}
            checked={termType === "fixed"}
            onChange={() => onTypeChange("fixed")}
          />
          Fixed term
        </label>
        {termType === "fixed" && (
          <input
            className={inputClass + " ml-6 w-auto"}
            value={duration}
            onChange={(e) => onDurationChange(e.target.value)}
            placeholder="e.g., 1 year(s)"
          />
        )}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name={radioName}
            checked={termType === "perpetual"}
            onChange={() => onTypeChange("perpetual")}
          />
          {perpetualLabel}
        </label>
      </div>
    </Field>
  );
}

function PartySection({
  partyNum,
  name,
  title,
  company,
  address,
  onFieldChange,
}: {
  partyNum: 1 | 2;
  name: string;
  title: string;
  company: string;
  address: string;
  onFieldChange: (field: keyof NdaFormData, value: string) => void;
}) {
  const prefix = `party${partyNum}` as const;
  return (
    <section>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Party {partyNum}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Print Name">
          <input
            className={inputClass}
            value={name}
            onChange={(e) => onFieldChange(`${prefix}Name`, e.target.value)}
            placeholder="Full name"
          />
        </Field>
        <Field label="Title">
          <input
            className={inputClass}
            value={title}
            onChange={(e) => onFieldChange(`${prefix}Title`, e.target.value)}
            placeholder="Job title"
          />
        </Field>
        <Field label="Company">
          <input
            className={inputClass}
            value={company}
            onChange={(e) => onFieldChange(`${prefix}Company`, e.target.value)}
            placeholder="Company name"
          />
        </Field>
        <Field label="Notice Address">
          <input
            className={inputClass}
            value={address}
            onChange={(e) => onFieldChange(`${prefix}Address`, e.target.value)}
            placeholder="Email or postal address"
          />
        </Field>
      </div>
    </section>
  );
}

export default function NdaForm({ data, onChange }: NdaFormProps) {
  function update(field: keyof NdaFormData, value: string) {
    onChange({ ...data, [field]: value });
  }

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Agreement Details
        </h3>
        <div className="space-y-4">
          <Field label="Purpose">
            <textarea
              className={inputClass + " min-h-[60px]"}
              value={data.purpose}
              onChange={(e) => update("purpose", e.target.value)}
              placeholder="How Confidential Information may be used"
            />
          </Field>

          <Field label="Effective Date">
            <input
              type="date"
              className={inputClass}
              value={data.effectiveDate}
              onChange={(e) => update("effectiveDate", e.target.value)}
            />
          </Field>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms</h3>
        <div className="space-y-4">
          <TermField
            label="MNDA Term"
            termType={data.mndaTermType}
            duration={data.mndaTermDuration}
            perpetualLabel="Continues until terminated"
            onTypeChange={(type) =>
              onChange({ ...data, mndaTermType: type })
            }
            onDurationChange={(v) => update("mndaTermDuration", v)}
            radioName="mndaTermType"
          />

          <TermField
            label="Term of Confidentiality"
            termType={data.confidentialityTermType}
            duration={data.confidentialityTermDuration}
            perpetualLabel="In perpetuity"
            onTypeChange={(type) =>
              onChange({ ...data, confidentialityTermType: type })
            }
            onDurationChange={(v) => update("confidentialityTermDuration", v)}
            radioName="confidentialityTermType"
          />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Governing Law & Jurisdiction
        </h3>
        <div className="space-y-4">
          <Field label="Governing Law (State)">
            <input
              className={inputClass}
              value={data.governingLaw}
              onChange={(e) => update("governingLaw", e.target.value)}
              placeholder="e.g., California"
            />
          </Field>

          <Field label="Jurisdiction">
            <input
              className={inputClass}
              value={data.jurisdiction}
              onChange={(e) => update("jurisdiction", e.target.value)}
              placeholder="e.g., courts located in San Francisco, CA"
            />
          </Field>
        </div>
      </section>

      <PartySection
        partyNum={1}
        name={data.party1Name}
        title={data.party1Title}
        company={data.party1Company}
        address={data.party1Address}
        onFieldChange={update}
      />

      <PartySection
        partyNum={2}
        name={data.party2Name}
        title={data.party2Title}
        company={data.party2Company}
        address={data.party2Address}
        onFieldChange={update}
      />

      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Modifications (Optional)
        </h3>
        <Field label="MNDA Modifications">
          <textarea
            className={inputClass + " min-h-[80px]"}
            value={data.modifications}
            onChange={(e) => update("modifications", e.target.value)}
            placeholder="List any modifications to the MNDA standard terms"
          />
        </Field>
      </section>
    </div>
  );
}
