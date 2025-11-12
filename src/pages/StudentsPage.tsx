import { useEffect, useState } from "react";
import { type Student, type SchoolClass } from "../types";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [name, setName] = useState("");
  const [classId, setClassId] = useState<number | undefined>();

  useEffect(() => {
    fetch("https://api-estudo-educacao-1.onrender.com/students")
      .then((res) => res.json())
      .then(setStudents)
      .catch(console.error);

    fetch("https://api-estudo-educacao-1.onrender.com/classes")
      .then((res) => res.json())
      .then(setClasses)
      .catch(console.error);
  }, []);

  const addStudent = async () => {
    if (!name || !classId) return;
    const res = await fetch("https://api-estudo-educacao-1.onrender.com/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, classId }),
    });
    const newStudent = await res.json();
    setStudents([...students, newStudent]);
    setName("");
    setClassId(undefined);
  };

  const deleteStudent = async (id: number) => {
    await fetch(`https://api-estudo-educacao-1.onrender.com/students/${id}`, {
      method: "DELETE",
    });
    setStudents(students.filter((s) => s.id !== id));
  };

  return (
    <div>
      <h1>Estudantes</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Novo estudante"
      />
      <select value={classId} onChange={(e) => setClassId(Number(e.target.value))}>
        <option value="">Selecione uma turma</option>
        {classes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <button onClick={addStudent}>Adicionar Estudante</button>

      <ul>
        {students.map((s) => (
          <li key={s.id}>
            {s.name} (Turma ID: {s.classId})
            <button onClick={() => deleteStudent(s.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
