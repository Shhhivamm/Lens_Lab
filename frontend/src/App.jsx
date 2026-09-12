import Header from "./components/Header";
import UploadReportCard from "./components/UploadReportCard";
import LabValueReview from "./components/LabValueReview";

function App() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl space-y-10 px-6 py-10">
        <UploadReportCard />
        <LabValueReview />
      </main>
    </>
  );
}



export default App;


