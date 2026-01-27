
export interface Meeting {
  classNbr: string;
  section: string;
  component: string;
  daysTimes: string;
  room: string;
  instructor: string;
  dates: string;
}

export interface Course {
  id: string;
  courseCode: string;
  courseTitle: string;
  status: string;
  units: string;
  grading: string;
  meetings: Meeting[];
}

export interface TimetableData {
  studentName: string;
  term: string;
  courses: Course[];
  generatedAt: string;
}
