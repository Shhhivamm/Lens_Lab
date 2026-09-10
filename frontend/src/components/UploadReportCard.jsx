import { useState } from "react";

function UploadReportCard() {
  const [selectedFile, setSelectedFile] = useState(null);

  function handleFileChange(event) {
    // `files` is a list because an input can support multiple uploads.
    // We accept only the first selected file for this MVP.
    const file = event.target.files?.[0];

    if (file) {
      setSelectedFile(file);
    }
  }

  function clearSelectedFile() {
    setSelectedFile(null);
  }

  return (
    <section className="rounded-2xl border border-dashed border-teal-300 bg-white p-8 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">
        Upload a lab report
      </h2>

      <p className="mt-2 text-slate-600">
        Choose a PDF, JPG, or PNG report. You will review extracted values
        before any analysis.
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

      {selectedFile && (
        <div className="mt-5 flex items-center justify-between gap-4 rounded-lg bg-teal-50 p-4">
          <div>
            <p className="font-semibold text-slate-800">{selectedFile.name}</p>
            <p className="mt-1 text-sm text-slate-600">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>

          <button
            type="button"
            onClick={clearSelectedFile}
            className="text-sm font-semibold text-rose-700 hover:text-rose-900"
          >
            Remove
          </button>
        </div>
      )}
    </section>
  );
}

export default UploadReportCard;