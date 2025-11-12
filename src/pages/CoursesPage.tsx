import { useEffect, useState } from "react";
import { type Course } from "../types";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetch("https://api-estudo-educacao-1.onrender.com/courses")
      .then((res) => res.json())
      .then(setCourses)
      .catch(console.error);
  }, []);

  const addCourse = async () => {
    if (!name) return;
    const res = await fetch("https://api-estudo-educacao-1.onrender.com/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const newCourse = await res.json();
    setCourses([...courses, newCourse]);
    setName("");
  };

  const deleteCourse = async (id: number) => {
    await fetch(`https://api-estudo-educacao-1.onrender.com/courses/${id}`, {
      method: "DELETE",
    });
    setCourses(courses.filter((c) => c.id !== id));
  };

  return (
    <div>
      <h1>Cursos</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Novo curso"
      />
      <button onClick={addCourse}>Adicionar Curso</button>

      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            {course.name}
            <button onClick={() => deleteCourse(course.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
