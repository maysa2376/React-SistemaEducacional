import { useEffect, useState } from "react";
import { type SchoolClass, type Course } from "../types";

export default function ClassesPage() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [name, setName] = useState("");
  const [courseId, setCourseId] = useState<number | undefined>();

  useEffect(() => {
    fetch("https://api-estudo-educacao-1.onrender.com/classes")
      .then((res) => res.json())
      .then(setClasses)
      .catch(console.error);

    fetch("https://api-estudo-educacao-1.onrender.com/courses")
      .then((res) => res.json())
      .then(setCourses)
      .catch(console.error);
  }, []);

  const addClass = async () => {
    if (!name || !courseId) return;
    const res = await fetch("https://api-estudo-educacao-1.onrender.com/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, courseId }),
    });
    const newClass = await res.json();
    setClasses([...classes, newClass]);
    setName("");
    setCourseId(undefined);
  };

  const deleteClass = async (id: number) => {
    await fetch(`https://api-estudo-educacao-1.onrender.com/classes/${id}`, {
      method: "DELETE",
    });
    setClasses(classes.filter((c) => c.id !== id));
  };

  return (
    <div>
      <h1>Turmas</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nova turma"
      />
      <select value={courseId} onChange={(e) => setCourseId(Number(e.target.value))}>
        <option value="">Selecione um curso</option>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <button onClick={addClass}>Adicionar Turma</button>

      <ul>
        {classes.map((c) => (
          <li key={c.id}>
            {c.name} (Curso ID: {c.courseId})
            <button onClick={() => deleteClass(c.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
