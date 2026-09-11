# LabLens

LabLens is a web application that helps users upload lab reports and receive clear, educational explanations of verified lab values.

> **Medical safety notice:** LabLens is an educational tool. It does not diagnose medical conditions, prescribe treatment, or replace advice from a qualified healthcare professional.

## Current Features

- React frontend built with Vite
- Tailwind CSS styling
- Lab-report file selection interface
- Client-side PDF, PNG, and JPG validation
- Client-side 10 MB file-size validation
- FastAPI backend
- Health-check endpoint
- Report-upload endpoint
- Backend file type and size validation
- React-to-FastAPI upload integration
- Interactive API documentation through Swagger UI

## Tech Stack

### Frontend

- React
- JavaScript
- Vite
- Tailwind CSS
- Recharts (planned for lab-value trend charts)

### Backend

- Python
- FastAPI
- Uvicorn
- `python-multipart`

### Planned Infrastructure

- PostgreSQL for structured application data
- Encrypted object storage for uploaded reports
- Tesseract OCR for report text extraction
- RAG with curated medical sources for cited educational explanations

## Project Structure

```text
Lens_Lab/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   └── UploadReportCard.jsx
│   │   ├── services/
│   │   │   └── reportApi.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   └── main.py
│   └── requirements.txt
│
├── docs/
│   └── PROGRESS.md
│
├── .gitignore
└── README.md