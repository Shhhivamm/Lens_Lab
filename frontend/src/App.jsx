import Header from "./components/Header";
import UploadReportCard from "./components/UploadReportCard";

function App() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
          Your health, explained clearly
        </p>

        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Understand your lab reports with confidence.
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Upload a report, review extracted values, and receive educational
          explanations to help you prepare for conversations with your doctor.
        </p>

        <div className="mt-10 max-w-2xl">
          <UploadReportCard />
        </div>
      </section>
    </main>
  );
}

export default App;