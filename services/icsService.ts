
import type { TimetableData, Meeting, Course } from '../types';

/**
 * Utility to format Date objects for ICS format (YYYYMMDDTHHMMSSZ)
 * Using UTC (Z) ensures consistency across calendar applications.
 */
const formatIcsDate = (date: Date): string => {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

/**
 * Formats a date for the RRULE UNTIL parameter.
 * It ensures the cutoff time is at the end of the day (23:59:59) 
 * to include the final occurrence of the event.
 */
const formatUntilDate = (date: Date): string => {
  const until = new Date(date);
  // Set to very end of the day in local time before UTC conversion
  until.setHours(23, 59, 59, 999);
  return until.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

/**
 * Maps HKU SIS day abbreviations to iCalendar BYDAY codes
 */
const dayMap: { [key: string]: string } = {
  'Mo': 'MO',
  'Tu': 'TU',
  'We': 'WE',
  'Th': 'TH',
  'Fr': 'FR',
  'Sa': 'SA',
  'Su': 'SU',
};

/**
 * Parses time strings into hours and minutes.
 * Supports both 12-hour (10:30AM) and 24-hour (17:00) formats.
 */
const parseTime = (timeStr: string) => {
  if (!timeStr) return null;
  
  // Try 12-hour format first: 10:30AM or 10:30 PM
  const ampmMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const minutes = parseInt(ampmMatch[2], 10);
    const ampm = ampmMatch[3].toUpperCase();
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    return { hours, minutes };
  }

  // Try 24-hour format: 10:00 or 17:00
  const hhmmMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (hhmmMatch) {
    const hours = parseInt(hhmmMatch[1], 10);
    const minutes = parseInt(hhmmMatch[2], 10);
    return { hours, minutes };
  }

  return null;
};

/**
 * Generates an iCalendar string from TimetableData
 */
export const generateIcs = (data: TimetableData): string => {
  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HKU SIS Timetable Parser//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  data.courses.forEach((course) => {
    course.meetings.forEach((meeting, midx) => {
      // Skip if schedule is missing or TBA
      if (!meeting.daysTimes || meeting.daysTimes.trim().toUpperCase() === 'TBA' || !meeting.daysTimes.trim()) {
        return;
      }

      // 1. Parse dates: "21/01/2026 - 11/02/2026"
      const dateParts = meeting.dates.split(' - ');
      if (dateParts.length !== 2) return;

      const [startD, startM, startY] = dateParts[0].split('/').map(Number);
      const [endD, endM, endY] = dateParts[1].split('/').map(Number);
      
      const startDateBase = new Date(startY, startM - 1, startD);
      const endDateBase = new Date(endY, endM - 1, endD);

      // 2. Parse days and times: "We 10:00 - 10:50" or "Mo We 10:30AM - 11:20AM"
      const timeParts = meeting.daysTimes.split(/\s+/).filter(p => p !== '-');
      // Format usually: [Day1, Day2, ..., StartTime, EndTime]
      const endTimeStr = timeParts[timeParts.length - 1];
      const startTimeStr = timeParts[timeParts.length - 2];
      const days = timeParts.slice(0, timeParts.length - 2);

      const start = parseTime(startTimeStr);
      const end = parseTime(endTimeStr);

      if (!start || !end) return;

      const byDay = days.map(d => dayMap[d]).filter(Boolean).join(',');
      const dayIndexMap: { [key: string]: number } = { 'su': 0, 'mo': 1, 'tu': 2, 'we': 3, 'th': 4, 'fr': 5, 'sa': 6 };
      const targetDayIndices = days.map(d => dayIndexMap[d.toLowerCase()]);

      // Find the first occurrence day that falls within the specified date range
      let firstOccurrence = new Date(startDateBase);
      let found = false;
      // Scan up to 7 days to find the first matching weekday
      for (let i = 0; i < 7; i++) {
        if (targetDayIndices.length === 0 || targetDayIndices.includes(firstOccurrence.getDay())) {
          found = true;
          break;
        }
        firstOccurrence.setDate(firstOccurrence.getDate() + 1);
      }

      // Ensure the first occurrence is actually within the range
      if (found && firstOccurrence <= endDateBase) {
        const eventStart = new Date(firstOccurrence);
        eventStart.setHours(start.hours, start.minutes, 0);
        
        const eventEnd = new Date(firstOccurrence);
        eventEnd.setHours(end.hours, end.minutes, 0);

        ics.push('BEGIN:VEVENT');
        // Unique ID including course code, section, class number, and meeting block index
        ics.push(`UID:${course.courseCode}-${meeting.section}-${meeting.classNbr}-${midx}@hku-sis-parser`);
        ics.push(`DTSTAMP:${formatIcsDate(new Date())}`);
        ics.push(`DTSTART:${formatIcsDate(eventStart)}`);
        ics.push(`DTEND:${formatIcsDate(eventEnd)}`);
        
        // Add RRULE if days are specified. UNTIL must be in UTC if DTSTART is UTC.
        if (byDay) {
          ics.push(`RRULE:FREQ=WEEKLY;UNTIL=${formatUntilDate(endDateBase)};BYDAY=${byDay}`);
        }

        ics.push(`SUMMARY:${course.courseCode} - ${course.courseTitle}${meeting.component ? ` (${meeting.component})` : ''}`);
        ics.push(`LOCATION:${meeting.room || 'TBA'}`);
        ics.push(`DESCRIPTION:Section: ${meeting.section}\\nInstructor: ${meeting.instructor || 'Staff'}\\nClass Nbr: ${meeting.classNbr}\\nUnits: ${course.units}\\nStatus: ${course.status}`);
        ics.push('END:VEVENT');
      }
    });
  });

  ics.push('END:VCALENDAR');
  return ics.join('\r\n');
};
// vim: set ts=2 sw=2 et:
