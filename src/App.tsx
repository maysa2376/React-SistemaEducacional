import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CoursesPage from "./pages/CoursesPage";
import ClassesPage from "./pages/ClassesPage";
import StudentsPage from "./pages/StudentsPage";
import GradesPage from "./pages/GradesPage";
import "./App.css"; // importa os estilos globais

function App() {
  return (
    <BrowserRouter>
      {/* Navbar fixa no topo */}
      <Navbar />

      {/* Conteúdo principal do site */}
      <div className="container">
        <Routes>
          {/* Página inicial → Cursos */}
          <Route path="/" element={<CoursesPage />} />

          {/* Outras páginas */}
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/grades" element={<GradesPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
