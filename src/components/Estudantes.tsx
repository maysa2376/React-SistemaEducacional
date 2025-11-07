import { useEffect, useState } from "react";
import api from "../services/api";
import type { Estudante, Turma, Curso } from "../types";

interface TurmaComCurso extends Turma {
  cursoNome?: string;
}

interface EstudanteComTurma extends Estudante {
  turmaNome?: string;
}

export default function Estudantes() {
  const [estudantes, setEstudantes] = useState<EstudanteComTurma[]>([]);
  const [turmas, setTurmas] = useState<TurmaComCurso[]>([]);
  const [loading, setLoading] = useState(true);

  const [novoEstudante, setNovoEstudante] = useState<Partial<Estudante>>({
    nome: "",
    email: "",
    curso_id: 0,
  });

  const [editandoId, setEditandoId] = useState<number | null>(null);

  // Carregar estudantes e turmas
  const carregarDados = async () => {
    try {
      const [estRes, turRes, cursosRes] = await Promise.all([
        api.get<Estudante[]>("/estudantes"),
        api.get<Turma[]>("/turmas"),
        api.get<Curso[]>("/cursos"),
      ]);

      // Mapear nome do curso em cada turma
      const turmasComCurso = turRes.data.map((t) => {
        const curso = cursosRes.data.find((c) => c.id === t.curso_id);
        return { ...t, cursoNome: curso?.nome || "" };
      });
      setTurmas(turmasComCurso);

      // Mapear nome da turma em cada estudante
      const estudantesComTurma = estRes.data.map((e) => {
        const turma = turmasComCurso.find((t) => t.id === e.curso_id);
        return { ...e, turmaNome: turma?.nome || "" };
      });

      setEstudantes(estudantesComTurma);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // Adicionar estudante
  const adicionarEstudante = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoEstudante.nome || !novoEstudante.email || !novoEstudante.curso_id) {
      alert("Preencha todos os campos");
      return;
    }
    try {
      await api.post("/estudantes", novoEstudante);
        setNovoEstudante({ nome: "", email: "", curso_id: 0 });
      carregarDados();
    } catch (error) {
      console.error("Erro ao adicionar estudante:", error);
    }
  };

  // Excluir estudante
  const excluirEstudante = async (id: number) => {
    if (!confirm("Deseja realmente excluir este estudante?")) return;
    try {
      await api.delete(`/estudantes/${id}`);
      carregarDados();
    } catch (error) {
      console.error("Erro ao excluir estudante:", error);
    }
  };

  // Entrar no modo edição
  const editarEstudante = (est: Estudante) => {
    setEditandoId(est.id);
    setNovoEstudante({
      nome: est.nome,
      email: est.email,
      curso_id: est.curso_id,
    });
  };

  // Salvar edição
  const salvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editandoId) return;
    try {
      await api.put(`/estudantes/${editandoId}`, novoEstudante);
      setEditandoId(null);
      setNovoEstudante({ nome: "", email: "", curso_id: 0 });
      carregarDados();
    } catch (error) {
      console.error("Erro ao editar estudante:", error);
    }
  };

  // Cancelar edição
  const cancelarEdicao = () => {
    setEditandoId(null);
     setNovoEstudante({ nome: "", email: "", curso_id: 0 });
  };

  if (loading) {
    return (
      <div className="container">
        <h2>👩‍🎓 Gerenciamento de Estudantes</h2>
        <div className="loading">Carregando estudantes...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>👩‍🎓 Gerenciamento de Estudantes</h2>

      {/* Formulário */}
      <form onSubmit={editandoId ? salvarEdicao : adicionarEstudante}>
        <div className="field">
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            type="text"
            placeholder="Nome do estudante"
            value={novoEstudante.nome || ""}
            onChange={(e) => setNovoEstudante({ ...novoEstudante, nome: e.target.value })}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email do estudante"
            value={novoEstudante.email || ""}
            onChange={(e) => setNovoEstudante({ ...novoEstudante, email: e.target.value })}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="turma">Turma</label>
          <select
            id="turma"
            value={novoEstudante.curso_id || 0}
            onChange={(e) => setNovoEstudante({ ...novoEstudante, curso_id: Number(e.target.value) })}
            required
          >
            <option value={0}>Selecione uma turma</option>
            {turmas.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nome} ({t.cursoNome})
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
              <th>Email</th>
              <th>Turma</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {estudantes.map((est) => (
              <tr key={est.id}>
                <td>{est.id}</td>
                <td>{est.nome}</td>
                <td>{est.email}</td>
                <td>{est.turmaNome}</td>
                <td>
                  <div className="actions">
                    <button
                      type="button"
                      className="btn-edit"
                      onClick={() => editarEstudante(est)}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      type="button"
                      className="btn-delete"
                      onClick={() => excluirEstudante(est.id)}
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
