import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        gap: "20px",
        backgroundColor: "#282c34",
        padding: "10px",
      }}
    >
      <Link to="/" style={{ color: "white", textDecoration: "none" }}>Cursos</Link>
      <Link to="/classes" style={{ color: "white", textDecoration: "none" }}>Turmas</Link>
      <Link to="/students" style={{ color: "white", textDecoration: "none" }}>Estudantes</Link>
      <Link to="/grades" style={{ color: "white", textDecoration: "none" }}>Notas</Link>
    </nav>
  );
}
