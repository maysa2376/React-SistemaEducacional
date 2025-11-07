import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [dados, setDados] = useState({
    estudantes: 0,
    cursos: 0,
    turmas: 0,
    matriculas: 0,
    notas: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const [estudantes, cursos, turmas, matriculas, notas] = await Promise.all([
          api.get("/estudantes"),
          api.get("/cursos"),
          api.get("/turmas"),
          api.get("/matriculas"),
          api.get("/notas"),
        ]);

        setDados({
          estudantes: estudantes.data.length,
          cursos: cursos.data.length,
          turmas: turmas.data.length,
          matriculas: matriculas.data.length,
          notas: notas.data.length,
        });
      } catch (error) {
        console.error("Erro ao carregar resumo:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  if (loading) return <p>Carregando resumo...</p>;

  return (
    <div>
      <h2>📊 Dashboard - Resumo Geral</h2>
      <ul>
        <li>👩‍🎓 Estudantes: {dados.estudantes}</li>
        <li>🎓 Cursos: {dados.cursos}</li>
        <li>🏫 Turmas: {dados.turmas}</li>
        <li>📝 Matrículas: {dados.matriculas}</li>
        <li>📈 Notas: {dados.notas}</li>
      </ul>
    </div>
  );
}
