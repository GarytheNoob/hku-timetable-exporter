import type { TimetableData } from '../types';

/**
 * Mock timetable data for development/testing purposes
 * This data is only used in dev mode to preview the UI
 */
export const MOCK_TIMETABLE_DATA: TimetableData = {
  studentName: "Dev User",
  term: "2024-25 Second Semester | Instruction",
  generatedAt: new Date().toISOString(),
  courses: [
    {
      id: "comp3230-001",
      courseCode: "COMP3230",
      courseTitle: "Principles of Operating Systems",
      courseSection: "2A",
      status: "Enrolled",
      units: "6.00",
      grading: "Letter Graded",
      meetings: [
        {
          classNbr: "10234",
          component: "",
          daysTimes: "Mo 02:30PM - 04:20PM",
          room: "CB 301",
          instructor: "Dr. Chan",
          dates: "09/01/2025 - 12/12/2025"
        },
        {
          classNbr: "10235",
          component: "",
          daysTimes: "We 10:30AM - 11:20AM",
          room: "CPD-LG.18",
          instructor: "Teaching Assistant",
          dates: "09/01/2025 - 12/12/2025"
        }
      ]
    },
    {
      id: "fina2322-001",
      courseCode: "FINA2322",
      courseTitle: "Derivatives",
      courseSection: "2A",
      status: "Enrolled",
      units: "6.00",
      grading: "Letter Graded",
      meetings: [
        {
          classNbr: "20156",
          component: "",
          daysTimes: "Tu Th 11:30AM - 01:00PM",
          room: "KKL 101",
          instructor: "Prof. Wong",
          dates: "09/01/2025 - 12/12/2025"
        }
      ]
    },
    {
      id: "econ1210-001",
      courseCode: "ECON1210",
      courseTitle: "Introductory Microeconomics",
      courseSection: "2A",
      status: "Waitlist",
      units: "6.00",
      grading: "Letter Graded",
      meetings: [
        {
          classNbr: "30421",
          component: "",
          daysTimes: "Mo We 09:30AM - 10:50AM",
          room: "MB 101",
          instructor: "Dr. Lee",
          dates: "09/01/2025 - 12/12/2025"
        }
      ]
    },
    {
      id: "stat2602-001",
      courseCode: "STAT2602",
      courseTitle: "Probability and Statistics I",
      courseSection: "2A",
      status: "Enrolled",
      units: "6.00",
      grading: "Letter Graded",
      meetings: [
        {
          classNbr: "40789",
          component: "",
          daysTimes: "Tu 02:30PM - 04:20PM",
          room: "CPD-3.04",
          instructor: "Prof. Zhang",
          dates: "09/01/2025 - 12/12/2025"
        },
        {
          classNbr: "40790",
          component: "",
          daysTimes: "Fr 03:30PM - 05:20PM",
          room: "CYM 505",
          instructor: "Lab Instructor",
          dates: "09/01/2025 - 12/12/2025"
        }
      ]
    },
    {
      id: "busi1002-001",
      courseCode: "BUSI1002",
      courseTitle: "Introduction to Accounting",
      courseSection: "2A",
      status: "Enrolled",
      units: "6.00",
      grading: "Letter Graded",
      meetings: [
        {
          classNbr: "50234",
          component: "",
          daysTimes: "We 01:30PM - 03:20PM",
          room: "KKL 103",
          instructor: "Dr. Tam",
          dates: "09/01/2025 - 12/12/2025"
        },
        {
          classNbr: "50235",
          component: "",
          daysTimes: "Fr 09:30AM - 10:20AM",
          room: "KB 303",
          instructor: "Tutor",
          dates: "09/01/2025 - 12/12/2025"
        }
      ]
    },
    {
      id: "math1853-001",
      courseCode: "MATH1853",
      courseTitle: "Linear Algebra, Probability and Statistics",
      courseSection: "2A",
      status: "Waitlist",
      units: "6.00",
      grading: "Letter Graded",
      meetings: [
        {
          classNbr: "60567",
          component: "",
          daysTimes: "Mo We Fr 11:30AM - 12:20PM",
          room: "MB 201",
          instructor: "Dr. Liu",
          dates: "09/01/2025 - 12/12/2025"
        },
        {
          classNbr: "60568",
          component: "",
          daysTimes: "Th 04:30PM - 05:20PM",
          room: "CPD-LG.18",
          instructor: "TA Team",
          dates: "09/01/2025 - 12/12/2025"
        }
      ]
    }
  ]
};
// vim: set ts=2 sw=2 et:
