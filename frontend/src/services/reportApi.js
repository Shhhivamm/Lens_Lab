const API_BASE_URL = "http://127.0.0.1:8000";

export async function uploadReport(file) {
  const formData = new FormData();

  // "report" name backend ke `report: UploadFile` parameter se match karta hai.
  formData.append("report", file);

  const response = await fetch(`${API_BASE_URL}/api/reports/upload`, {
    method: "POST",
    body: formData,
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.detail || "Report upload failed.");
  }

  return responseData;
}