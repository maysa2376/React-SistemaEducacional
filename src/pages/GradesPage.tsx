import { useEffect, useState } from "react";
import { type Student, type SchoolClass, type Grade } from "../types";

export default function GradesPage() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | undefined>();

  useEffect(() => {
    fetch("https://api-estudo-educacao-1.onrender.com/classes")
      .then((res) => res.json())
      .then(setClasses)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedClassId) return;

    fetch(`https://api-estudo-educacao-1.onrender.com/students?classId=${selectedClassId}`)
      .then((res) => res.json())
      .then(setStudents)
      .catch(console.error);

    fetch(`https://api-estudo-educacao-1.onrender.com/grades?classId=${selectedClassId}`)
      .then((res) => res.json())
      .then(setGrades)
      .catch(console.error);
  }, [selectedClassId]);

  const updateGrade = async (studentId: number, field: "exam" | "work", value: number) => {
    const grade = grades.find((g) => g.studentId === studentId);
    if (!grade) return;

    const updatedGrade = { ...grade, [field]: value };
    await fetch(`https://api-estudo-educacao-1.onrender.com/grades/${studentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedGrade),
    });

    setGrades(grades.map((g) => (g.studentId === studentId ? updatedGrade : g)));
  };

  return (
    <div>
      <h1>Notas</h1>
      <select value={selectedClassId} onChange={(e) => setSelectedClassId(Number(e.target.value))}>
        <option value="">Selecione uma turma</option>
        {classes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {selectedClassId && (
        <table>
          <thead>
            <tr>
              <th>Estudante</th>
              <th>Prova</th>
              <th>Trabalho</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => {
              const grade = grades.find((g) => g.studentId === s.id) || { exam: 0, work: 0, studentId: s.id };
              return (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>
                    <input
                      type="number"
                      value={grade.exam}
                      onChange={(e) => updateGrade(s.id, "exam", Number(e.target.value))}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={grade.work}
                      onChange={(e) => updateGrade(s.id, "work", Number(e.target.value))}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
