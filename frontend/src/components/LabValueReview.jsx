import { useState } from "react";
import {
  analyzeLabValues,
  submitVerifiedLabValues,
} from "../services/reportApi";

const EMPTY_LAB_VALUE = {
  testName: "",
  value: "",
  unit: "",
  lowRange: "",
  highRange: "",
};

const STATUS_STYLES = {
  low: "bg-amber-100 text-amber-800",
  normal: "bg-emerald-100 text-emerald-800",
  high: "bg-rose-100 text-rose-800",
  unknown: "bg-slate-100 text-slate-700",
};

function LabValueReview() {
  const [formData, setFormData] = useState(EMPTY_LAB_VALUE);
  const [labValues, setLabValues] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [analysisResults, setAnalysisResults] = useState([]);
  const [safetyNotice, setSafetyNotice] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  function handleFieldChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  function handleAddLabValue(event) {
    event.preventDefault();
    setErrorMessage("");

    if (!formData.testName || !formData.value || !formData.unit) {
      setErrorMessage("Test name, value, and unit are required.");
      return;
    }

    const newLabValue = {
      id: crypto.randomUUID(),
      testName: formData.testName.trim(),
      value: Number(formData.value),
      unit: formData.unit.trim(),
      lowRange: formData.lowRange ? Number(formData.lowRange) : null,
      highRange: formData.highRange ? Number(formData.highRange) : null,
    };

    setLabValues((currentLabValues) => [
      ...currentLabValues,
      newLabValue,
    ]);

    setFormData(EMPTY_LAB_VALUE);
  }

  function handleRemoveLabValue(id) {
    setLabValues((currentLabValues) =>
      currentLabValues.filter((labValue) => labValue.id !== id),
    );
  }

  async function handleSubmitVerifiedValues() {
  if (labValues.length === 0) {
    setErrorMessage("Add at least one lab value before submitting.");
    return;
  }

  async function handleAnalyzeLabValues() {
  if (labValues.length === 0) {
    setErrorMessage("Add at least one lab value before analysis.");
    return;
  }

  setIsAnalyzing(true);
  setErrorMessage("");
  setSuccessMessage("");

  try {
    // Send only user-reviewed values to the analysis endpoint.
    const response = await analyzeLabValues(labValues);

    // Save the backend response so React can render the status cards.
    setAnalysisResults(response.results);
    setSafetyNotice(response.safety_notice);
  } catch (error) {
    setErrorMessage(error.message);
  } finally {
    // Restore the button state after the API request finishes.
    setIsAnalyzing(false);
  }
}

  setIsSubmitting(true);
  setErrorMessage("");
  setSuccessMessage("");

  try {
    const response = await submitVerifiedLabValues(labValues);

    setSuccessMessage(
      `${response.total_values} verified lab value(s) sent to the backend.`,
    );
  } catch (error) {
    setErrorMessage(error.message);
  } finally {
    // Restore the button state after either success or failure.
    setIsSubmitting(false);
  }
}

  return (
    <section className="mt-10 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-teal-700">
          Step 2
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Review lab values
        </h2>

        <p className="mt-2 max-w-2xl text-slate-600">
          Add values from your report carefully. These values should be reviewed
          before any educational explanation is generated.
        </p>
      </div>

      <form
        onSubmit={handleAddLabValue}
        className="mt-6 grid gap-4 md:grid-cols-2"
      >
        <label className="text-sm font-medium text-slate-700">
          Test name
          <input
            name="testName"
            value={formData.testName}
            onChange={handleFieldChange}
            placeholder="Example: Hemoglobin"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Result value
          <input
            name="value"
            type="number"
            step="any"
            value={formData.value}
            onChange={handleFieldChange}
            placeholder="Example: 13.5"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Unit
          <input
            name="unit"
            value={formData.unit}
            onChange={handleFieldChange}
            placeholder="Example: g/dL"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Lower reference range
          <input
            name="lowRange"
            type="number"
            step="any"
            value={formData.lowRange}
            onChange={handleFieldChange}
            placeholder="Optional"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Upper reference range
          <input
            name="highRange"
            type="number"
            step="any"
            value={formData.highRange}
            onChange={handleFieldChange}
            placeholder="Optional"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          />
        </label>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-lg bg-teal-700 px-5 py-2.5 font-semibold text-white transition hover:bg-teal-800"
          >
            Add verified value
          </button>
        </div>
      </form>

      {errorMessage && (
        <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm font-medium text-rose-700">
          {errorMessage}
        </p>
      )}

      {labValues.length > 0 && (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-500">
                <th className="px-3 py-3 font-semibold">Test</th>
                <th className="px-3 py-3 font-semibold">Value</th>
                <th className="px-3 py-3 font-semibold">Unit</th>
                <th className="px-3 py-3 font-semibold">Reference range</th>
                <th className="px-3 py-3 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {labValues.map((labValue) => (
                <tr
                  key={labValue.id}
                  className="border-b border-slate-100 text-sm text-slate-700"
                >
                  <td className="px-3 py-4 font-semibold">
                    {labValue.testName}
                  </td>

                  <td className="px-3 py-4">{labValue.value}</td>

                  <td className="px-3 py-4">{labValue.unit}</td>

                  <td className="px-3 py-4">
                    {labValue.lowRange ?? "—"} to {labValue.highRange ?? "—"}
                  </td>

                  <td className="px-3 py-4">
                    <button
                      type="button"
                      onClick={() => handleRemoveLabValue(labValue.id)}
                      className="font-semibold text-rose-700 hover:text-rose-900"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {labValues.length > 0 && (
  <div className="mt-6 flex flex-wrap items-center gap-4">
    <button
      type="button"
      onClick={handleSubmitVerifiedValues}
      disabled={isSubmitting}
      className="rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isSubmitting
        ? "Submitting values..."
        : "Submit verified values"}
    </button>

    {successMessage && (
      <p className="text-sm font-semibold text-emerald-700">
        {successMessage}
      </p>
    )}
  </div>
)}
    </section>
  );
}

export default LabValueReview;