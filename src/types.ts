// types.ts
export interface Student {
  id: number;
  name: string;
  classId: number; // vincula ao SchoolClass
}

export interface SchoolClass {
  id: number;
  name: string;
  courseId: number;
}

export interface Course {
  id: number;
  name: string;
  description: string;
}

export interface Grade {
  studentId: number;
  exam: number;
  work: number;
}
