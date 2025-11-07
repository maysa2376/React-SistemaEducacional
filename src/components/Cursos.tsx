import { useEffect, useState } from "react";
import api from "../services/api";
import type { Curso } from "../types";

export default function Cursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);

  const [novoCurso, setNovoCurso] = useState<Partial<Curso>>({
    nome: "",
    descricao: "",
  });

  const [editandoId, setEditandoId] = useState<number | null>(null);

  // 🔹 Carregar cursos
  const carregarCursos = async () => {
    try {
      const res = await api.get<Curso[]>("/cursos");
      setCursos(res.data);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCursos();
  }, []);

  // 🔹 Criar novo curso
  const adicionarCurso = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!novoCurso.nome) {
      alert("Informe o nome do curso");
      return;
    }

    try {
      await api.post("/cursos", novoCurso);
      setNovoCurso({ nome: "", descricao: "" });
      carregarCursos();
    } catch (error) {
      console.error("Erro ao adicionar curso:", error);
    }
  };

  // 🔹 Excluir curso
  const excluirCurso = async (id: number) => {
    if (!confirm("Deseja realmente excluir este curso?")) return;

    try {
      await api.delete(`/cursos/${id}`);
      carregarCursos();
    } catch (error) {
      console.error("Erro ao excluir curso:", error);
    }
  };

  // 🔹 Entrar no modo de edição
  const editarCurso = (curso: Curso) => {
    setEditandoId(curso.id);
    setNovoCurso({ nome: curso.nome, descricao: curso.descricao });
  };

  // 🔹 Salvar edição
  const salvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editandoId) return;

    try {
      await api.put(`/cursos/${editandoId}`, novoCurso);
      setEditandoId(null);
      setNovoCurso({ nome: "", descricao: "" });
      carregarCursos();
    } catch (error) {
      console.error("Erro ao editar curso:", error);
    }
  };

  // 🔹 Cancelar edição
  const cancelarEdicao = () => {
    setEditandoId(null);
    setNovoCurso({ nome: "", descricao: "" });
  };

  if (loading) {
    return (
      <div className="container">
        <h2>🎓 Gerenciamento de Cursos</h2>
        <div className="loading">Carregando cursos...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>🎓 Gerenciamento de Cursos</h2>

      {/* 🔸 Formulário */}
      <form onSubmit={editandoId ? salvarEdicao : adicionarCurso}>
        <div className="field">
          <label htmlFor="nome">Nome do curso</label>
          <input
            id="nome"
            type="text"
            placeholder="Nome do curso"
            value={novoCurso.nome || ""}
            onChange={(e) => setNovoCurso({ ...novoCurso, nome: e.target.value })}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="descricao">Descrição</label>
          <input
            id="descricao"
            type="text"
            placeholder="Descrição do curso"
            value={novoCurso.descricao || ""}
            onChange={(e) => setNovoCurso({ ...novoCurso, descricao: e.target.value })}
          />
        </div>

        <div className="actions">
          <button type="submit">{editandoId ? "💾 Salvar" : "➕ Adicionar"}</button>
          {editandoId && (
            <button type="button" onClick={cancelarEdicao}>
              ❌ Cancelar
            </button>
          )}
        </div>
      </form>

      {/* 🔸 Lista de cursos */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {cursos.map((curso) => (
              <tr key={curso.id}>
                <td>{curso.id}</td>
                <td>{curso.nome}</td>
                <td>{curso.descricao}</td>
                <td>
                  <div className="actions">
                    <button 
                      type="button"
                      className="btn-edit"
                      onClick={() => editarCurso(curso)}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      type="button" 
                      className="btn-delete"
                      onClick={() => excluirCurso(curso.id)}
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
