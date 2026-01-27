
import type { TimetableData, Course, Meeting } from '../types';

/**
 * Parses the provided HKU SIS HTML string into structured JSON.
 * Note: This implementation targets the specific DOM structure of the HKU portal
 * as seen in the provided snippet.
 */
export const parseSisHtml = (html: string): TimetableData => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // 1. Extract Global Info
  const studentName = doc.getElementById('DERIVED_SSTSNAV_PERSON_NAME')?.innerText.trim() || 'Unknown Student';
  const term = doc.getElementById('DERIVED_REGFRM1_SSR_STDNTKEY_DESCR$11$')?.innerText.trim() || 'Unknown Term';

  // 2. Identify Course Blocks
  // The structure uses tables with IDs like win0divDERIVED_REGFRM1_DESCR20$0, $1, etc.
  const courseBlocks = doc.querySelectorAll('div[id^="win0divDERIVED_REGFRM1_DESCR20$"]');
  const courses: Course[] = [];

  courseBlocks.forEach((block, index) => {
    // Course Title (e.g. "AILT 1001 - AI Literacy I")
    const header = block.querySelector('.PAGROUPDIVIDER');
    if (!header) return;
    
    const fullTitle = header.textContent?.trim() || '';
    const titleParts = fullTitle.split(' - ');
    const courseCode = titleParts[0] || '';
    const courseTitle = titleParts.slice(1).join(' - ') || '';

    // Status / Units Grid
    // ID pattern: SSR_DUMMY_RECVW$scroll$0
    const status = doc.getElementById(`STATUS$${index}`)?.innerText.trim() || '';
    const units = doc.getElementById(`DERIVED_REGFRM1_UNT_TAKEN$${index}`)?.innerText.trim() || '';

    // Meetings Grid
    // ID pattern: CLASS_MTG_VW$scroll$0
    const meetings: Meeting[] = [];
    const meetingTable = doc.getElementById(`CLASS_MTG_VW$scroll$${index}`);
    
    if (meetingTable) {
      // Find all rows in this meeting table. We look for rows starting with 'trCLASS_MTG_VW$index_row'
      const meetingRows = meetingTable.querySelectorAll(`tr[id^="trCLASS_MTG_VW$${index}_row"]`);
      
      let lastClassNbr = '';
      let lastSection = '';
      let lastComponent = '';

      meetingRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 7) return;

        // PeopleSoft often uses empty cells in subsequent rows for the same section.
        // We'll carry forward the values from the previous row if current is empty.
        const currentClassNbr = cells[0].innerText.trim();
        const currentSection = cells[1].innerText.trim();
        const currentComponent = cells[2].innerText.trim();

        if (currentClassNbr) lastClassNbr = currentClassNbr;
        if (currentSection) lastSection = currentSection;
        if (currentComponent && currentComponent !== '--') lastComponent = currentComponent;

        const meeting: Meeting = {
          classNbr: lastClassNbr,
          section: lastSection,
          component: lastComponent,
          daysTimes: cells[3].innerText.trim().replace(/\u00a0/g, ''),
          room: cells[4].innerText.trim(),
          instructor: cells[5].innerText.trim(),
          dates: cells[6].innerText.trim(),
        };

        meetings.push(meeting);
      });
    }

    courses.push({
      id: index.toString(),
      courseCode,
      courseTitle,
      status,
      units,
      grading: doc.getElementById(`GB_DESCR$${index}`)?.innerText.trim() || '',
      meetings
    });
  });

  return {
    studentName,
    term,
    courses,
    generatedAt: new Date().toISOString()
  };
};
// vim: set ts=2 sw=2 et:
