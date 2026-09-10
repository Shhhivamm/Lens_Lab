import { useState } from "react";
import { uploadReport } from "../services/reportApi";

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
];

const MAX_FILE_SIZE_IN_MB = 10;
const MAX_FILE_SIZE_IN_BYTES = MAX_FILE_SIZE_IN_MB * 1024 * 1024;

function UploadReportCard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  function validateSelectedFile(file) {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return "Please choose a PDF, PNG, or JPG report.";
    }

    if (file.size > MAX_FILE_SIZE_IN_BYTES) {
      return `Your file must be smaller than ${MAX_FILE_SIZE_IN_MB} MB.`;
    }

    return "";
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    setErrorMessage("");
    setSuccessMessage("");

    if (!file) {
      return;
    }

    const validationError = validateSelectedFile(file);

    if (validationError) {
      setSelectedFile(null);
      setErrorMessage(validationError);
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  }

  async function handleUpload() {
    if (!selectedFile) {
      return;
    }

    setIsUploading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const uploadResponse = await uploadReport(selectedFile);
      setSuccessMessage(
        `${uploadResponse.message} File: ${uploadResponse.file_name}`,
      );
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      // This always runs, whether the upload succeeds or fails.
      setIsUploading(false);
    }
  }

  function clearSelectedFile() {
    setSelectedFile(null);
    setErrorMessage("");
    setSuccessMessage("");
  }

  return (
    <section className="rounded-2xl border border-dashed border-teal-300 bg-white p-8 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">
        Upload a lab report
      </h2>

      <p className="mt-2 text-slate-600">
        Choose a PDF, JPG, or PNG report up to {MAX_FILE_SIZE_IN_MB} MB.
        You will review extracted values before any analysis.
      </p>

      <label
        htmlFor="report-file"
        className="mt-6 inline-flex cursor-pointer rounded-lg bg-teal-700 px-5 py-3 font-semibold text-white transition hover:bg-teal-800"
      >
        Choose report
      </label>

      <input
        id="report-file"
        type="file"
        accept=".pdf,image/png,image/jpeg"
        className="hidden"
        onChange={handleFileChange}
      />

      {errorMessage && (
        <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm font-medium text-rose-700">
          {errorMessage}
        </p>
      )}

      {successMessage && (
        <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
          {successMessage}
        </p>
      )}

      {selectedFile && (
        <div className="mt-5 rounded-lg bg-teal-50 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-800">
                {selectedFile.name}
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            <button
              type="button"
              onClick={clearSelectedFile}
              disabled={isUploading}
              className="text-sm font-semibold text-rose-700 hover:text-rose-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Remove
            </button>
          </div>

          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="mt-5 rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploading ? "Uploading..." : "Upload report"}
          </button>
        </div>
      )}
    </section>
  );
}

export default UploadReportCard;