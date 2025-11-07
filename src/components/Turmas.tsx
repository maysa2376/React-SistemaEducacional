import { useEffect, useState } from "react";
import api from "../services/api";
import type { Turma, Curso } from "../types";

interface TurmaComCurso extends Turma {
  cursoNome?: string;
}

export default function Turmas() {
  const [turmas, setTurmas] = useState<TurmaComCurso[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);

  const [novaTurma, setNovaTurma] = useState<Partial<Turma>>({
    nome: "",
    curso_id: 0,
  });

  const [editandoId, setEditandoId] = useState<number | null>(null);

  // Carregar turmas e cursos
  const carregarDados = async () => {
    try {
      const [turmasRes, cursosRes] = await Promise.all([
        api.get<Turma[]>("/turmas"),
        api.get<Curso[]>("/cursos"),
      ]);
      setTurmas(
        turmasRes.data.map((t) => {
          const curso = cursosRes.data.find((c) => c.id === t.curso_id);
          return { ...t, cursoNome: curso?.nome || "" };
        })
      );
      setCursos(cursosRes.data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // Adicionar turma
  const adicionarTurma = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaTurma.nome || !novaTurma.curso_id) {
      alert("Informe o nome da turma e selecione um curso");
      return;
    }
    try {
      await api.post("/turmas", novaTurma);
      setNovaTurma({ nome: "", curso_id: 0 });
      carregarDados();
    } catch (error) {
      console.error("Erro ao adicionar turma:", error);
    }
  };

  // Excluir turma
  const excluirTurma = async (id: number) => {
    if (!confirm("Deseja realmente excluir esta turma?")) return;
    try {
      await api.delete(`/turmas/${id}`);
      carregarDados();
    } catch (error) {
      console.error("Erro ao excluir turma:", error);
    }
  };

  // Entrar no modo edição
  const editarTurma = (turma: Turma) => {
    setEditandoId(turma.id);
    setNovaTurma({ nome: turma.nome, curso_id: turma.curso_id });
  };

  // Salvar edição
  const salvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editandoId) return;
    try {
      await api.put(`/turmas/${editandoId}`, novaTurma);
      setEditandoId(null);
      setNovaTurma({ nome: "", curso_id: 0 });
      carregarDados();
    } catch (error) {
      console.error("Erro ao editar turma:", error);
    }
  };

  // Cancelar edição
  const cancelarEdicao = () => {
    setEditandoId(null);
    setNovaTurma({ nome: "", curso_id: 0 });
  };

  if (loading) {
    return (
      <div className="container">
        <h2>🏫 Gerenciamento de Turmas</h2>
        <div className="loading">Carregando turmas...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>🏫 Gerenciamento de Turmas</h2>

      {/* Formulário */}
      <form onSubmit={editandoId ? salvarEdicao : adicionarTurma}>
        <div className="field">
          <label htmlFor="nome">Nome da Turma</label>
          <input
            id="nome"
            type="text"
            placeholder="Nome da turma"
            value={novaTurma.nome || ""}
            onChange={(e) => setNovaTurma({ ...novaTurma, nome: e.target.value })}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="curso">Curso</label>
          <select
            id="curso"
            value={novaTurma.curso_id || 0}
            onChange={(e) => setNovaTurma({ ...novaTurma, curso_id: Number(e.target.value) })}
            required
          >
            <option value={0}>Selecione um curso</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="actions">
          <button type="submit">
            {editandoId ? "💾 Salvar" : "➕ Adicionar"}
          </button>
          {editandoId && (
            <button type="button" onClick={cancelarEdicao}>
              ❌ Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Tabela */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Curso</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {turmas.map((turma) => (
              <tr key={turma.id}>
                <td>{turma.id}</td>
                <td>{turma.nome}</td>
                <td>{turma.cursoNome}</td>
                <td>
                  <div className="actions">
                    <button
                      type="button"
                      className="btn-edit"
                      onClick={() => editarTurma(turma)}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      type="button"
                      className="btn-delete"
                      onClick={() => excluirTurma(turma.id)}
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
