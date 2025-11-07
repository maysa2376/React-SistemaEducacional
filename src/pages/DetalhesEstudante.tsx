import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import type { Estudante, Matricula, Nota } from "../types";

export default function DetalhesEstudante() {
  const { id } = useParams<{ id: string }>();
  const [estudante, setEstudante] = useState<Estudante | null>(null);
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [notas, setNotas] = useState<Nota[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const estudanteRes = await api.get(`/estudantes/${id}`);
        const matriculasRes = await api.get("/matriculas");
        const notasRes = await api.get("/notas");

        setEstudante(estudanteRes.data);
        setMatriculas(matriculasRes.data.filter((m: Matricula) => m.estudante_id === Number(id)));
        setNotas(notasRes.data);
      } catch (error) {
        console.error("Erro ao carregar detalhes do estudante:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [id]);

  if (loading) return <p>Carregando dados do estudante...</p>;
  if (!estudante) return <p>Estudante não encontrado.</p>;

  return (
    <div>
      <h2>👩‍🎓 Detalhes do Estudante</h2>
      <p><b>Nome:</b> {estudante.nome}</p>
      <p><b>Email:</b> {estudante.email}</p>

      <h3>📝 Matrículas</h3>
      <ul>
        {matriculas.map((m) => (
          <li key={m.id}>
            Turma: {m.turma_id} — 
            Nota: {notas.find((n) => n.matricula_id === m.id)?.valor ?? "Sem nota"}
          </li>
        ))}
      </ul>
    </div>
  );
}
