import { useEffect, useState } from "react";
import api from "../services/api";
import type { Nota, Turma, Estudante, Matricula } from "../types";

interface EstudanteComNotas extends Omit<Estudante, 'curso_id'> {
  matricula_id: number;
  nota_prova: number | undefined;
  nota_trabalho: number | undefined;
  curso_id?: number;
}

export default function Notas() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [estudantes, setEstudantes] = useState<EstudanteComNotas[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  // Carregar turmas
  useEffect(() => {
    api.get<Turma[]>("/turmas")
      .then((res) => setTurmas(res.data))
      .catch((err) => console.error("Erro ao carregar turmas:", err))
      .finally(() => setLoading(false));
  }, []);

  // Carregar estudantes e notas quando uma turma for selecionada
  useEffect(() => {
    if (!turmaSelecionada) return;

    const carregarEstudantesENotas = async () => {
      try {
        setLoading(true);
        const [matriculasRes, estudantesRes, notasRes] = await Promise.all([
          api.get<Matricula[]>(`/matriculas?turma_id=${turmaSelecionada}`),
          api.get<Estudante[]>("/estudantes"),
          api.get<Nota[]>("/notas"),
        ]);

        const estudantesDaTurma = matriculasRes.data
          .map(matricula => {
            const estudante = estudantesRes.data.find(e => e.id === matricula.estudante_id);
            if (!estudante) return null;

            const notasDoEstudante = notasRes.data.filter(n => n.matricula_id === matricula.id);
            const notaProva = notasDoEstudante.find(n => n.tipo === "prova")?.valor;
            const notaTrabalho = notasDoEstudante.find(n => n.tipo === "trabalho")?.valor;

            return {
              ...estudante,
              matricula_id: matricula.id,
              nota_prova: notaProva,
              nota_trabalho: notaTrabalho,
            };
          })
          .filter((e): e is EstudanteComNotas => e !== null);

        setEstudantes(estudantesDaTurma);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarEstudantesENotas();
  }, [turmaSelecionada]);

  // Salvar nota
  const salvarNota = async (
    matriculaId: number,
    tipo: "prova" | "trabalho",
    valor: number
  ) => {
    if (valor < 0 || valor > 10) {
      alert("A nota deve estar entre 0 e 10");
      return;
    }

    try {
      setSalvando(true);
      const notasRes = await api.get<Nota[]>(`/notas?matricula_id=${matriculaId}&tipo=${tipo}`);
      const notaExistente = notasRes.data[0];

      if (notaExistente) {
        await api.put(`/notas/${notaExistente.id}`, {
          ...notaExistente,
          valor,
        });
      } else {
        await api.post("/notas", {
          matricula_id: matriculaId,
          tipo,
          valor,
        });
      }

      // Atualizar estado local
      setEstudantes(prev =>
        prev.map(est =>
          est.matricula_id === matriculaId
            ? {
                ...est,
                [tipo === "prova" ? "nota_prova" : "nota_trabalho"]: valor,
              }
            : est
        )
      );
    } catch (error) {
      console.error("Erro ao salvar nota:", error);
      alert("Erro ao salvar nota");
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <h2>📚 Lançamento de Notas</h2>
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>📚 Lançamento de Notas</h2>

      {/* Seletor de Turma */}
      <div className="notas-header">
        <div className="field">
          <label htmlFor="turma">Turma</label>
          <select
            id="turma"
            value={turmaSelecionada}
            onChange={(e) => setTurmaSelecionada(Number(e.target.value))}
          >
            <option value={0}>Selecione uma turma</option>
            {turmas.map((turma) => (
              <option key={turma.id} value={turma.id}>
                {turma.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela de Notas */}
      {turmaSelecionada ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Prova</th>
                <th>Trabalho</th>
                <th>Média</th>
              </tr>
            </thead>
            <tbody>
              {estudantes.map((estudante) => (
                <tr key={estudante.id}>
                  <td>{estudante.nome}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      className="nota-input"
                      value={estudante.nota_prova ?? ""}
                      onChange={(e) =>
                        estudante.matricula_id &&
                        salvarNota(
                          estudante.matricula_id,
                          "prova",
                          Number(e.target.value)
                        )
                      }
                      disabled={salvando}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      className="nota-input"
                      value={estudante.nota_trabalho ?? ""}
                      onChange={(e) =>
                        estudante.matricula_id &&
                        salvarNota(
                          estudante.matricula_id,
                          "trabalho",
                          Number(e.target.value)
                        )
                      }
                      disabled={salvando}
                    />
                  </td>
                  <td>
                    <strong>
                      {estudante.nota_prova !== undefined &&
                      estudante.nota_trabalho !== undefined
                        ? ((estudante.nota_prova + estudante.nota_trabalho) / 2).toFixed(1)
                        : "-"}
                    </strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert">Selecione uma turma para visualizar as notas</div>
      )}
    </div>
  );
}
