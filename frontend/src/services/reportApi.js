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

export async function submitVerifiedLabValues(values) {
  const response = await fetch(
    `${API_BASE_URL}/api/lab-values/verify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values }),
    },
  );

  const responseData = await response.json();

  if (!response.ok) {
    const firstValidationError = responseData.detail?.[0]?.msg;

    throw new Error(
      firstValidationError || "Could not submit verified lab values.",
    );
  }

  return responseData;
}