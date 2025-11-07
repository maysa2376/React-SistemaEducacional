import { useEffect, useState } from "react";
import api from "../services/api";
import type { Matricula } from "../types";

export default function Matriculas() {
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Matricula[]>("/matriculas")
      .then((res) => setMatriculas(res.data))
      .catch((err) => console.error("Erro ao carregar matrículas:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="container">
        <h2>🎓 Gerenciamento de Matrículas</h2>
        <p>Carregando matrículas...</p>
      </div>
    );

  return (
    <div className="container">
      <h2>🎓 Gerenciamento de Matrículas</h2>
      <table border={1} width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Estudante ID</th>
            <th>Turma ID</th>
          </tr>
        </thead>
        <tbody>
          {matriculas.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.estudante_id}</td>
              <td>{m.turma_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
