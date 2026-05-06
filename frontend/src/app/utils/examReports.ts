/**
 * Exam report generation utilities for downloads
 */

export interface ExamResult {
  id: number;
  examId: number;
  studentId: number;
  studentName?: string;
  className?: string;
  subjectName: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  remarks?: string;
}

export interface Exam {
  id: number;
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  className?: string;
}

/**
 * Download CSV file utility
 */
const downloadCSV = (fileName: string, csvContent: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Escape CSV values
 */
const escapeCSV = (value: string | number | undefined): string => {
  const text = String(value ?? '');
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

/**
 * Generate and download class-wise result sheet
 */
export const downloadClassWiseResults = (exam: Exam, results: ExamResult[]) => {
  if (!results.length) {
    alert('No results available for this exam');
    return;
  }

  // Group by class
  const byClass = new Map<string, ExamResult[]>();
  results.forEach(r => {
    const className = r.className || 'Unassigned';
    if (!byClass.has(className)) byClass.set(className, []);
    byClass.get(className)!.push(r);
  });

  let csv = `Exam: ${exam.title}\nType: ${exam.type}\nDate: ${new Date(exam.startDate).toLocaleDateString()}\n\n`;

  byClass.forEach((classResults, className) => {
    csv += `CLASS: ${className}\n`;
    csv += 'Roll No,Student Name,Subject,Marks Obtained,Total Marks,Grade,Remarks\n';
    classResults.forEach(r => {
      csv += `${escapeCSV(r.studentId)},${escapeCSV(r.studentName)},${escapeCSV(r.subjectName)},${escapeCSV(r.marksObtained)},${escapeCSV(r.totalMarks)},${escapeCSV(r.grade)},${escapeCSV(r.remarks)}\n`;
    });
    csv += '\n';
  });

  downloadCSV(`${exam.title}_ClassWise_Results.csv`, csv);
};

/**
 * Generate and download student-wise result sheet
 */
export const downloadStudentWiseResults = (exam: Exam, results: ExamResult[]) => {
  if (!results.length) {
    alert('No results available for this exam');
    return;
  }

  // Group by student
  const byStudent = new Map<string, ExamResult[]>();
  results.forEach(r => {
    const studentKey = r.studentName || `Student ${r.studentId}`;
    if (!byStudent.has(studentKey)) byStudent.set(studentKey, []);
    byStudent.get(studentKey)!.push(r);
  });

  let csv = `Exam: ${exam.title}\nType: ${exam.type}\nDate: ${new Date(exam.startDate).toLocaleDateString()}\n\n`;

  byStudent.forEach((studentResults, studentName) => {
    csv += `STUDENT: ${studentName}\n`;
    csv += 'Subject,Marks Obtained,Total Marks,Grade\n';
    let totalMarks = 0;
    let obtainedMarks = 0;
    studentResults.forEach(r => {
      csv += `${escapeCSV(r.subjectName)},${escapeCSV(r.marksObtained)},${escapeCSV(r.totalMarks)},${escapeCSV(r.grade)}\n`;
      totalMarks += r.totalMarks;
      obtainedMarks += r.marksObtained;
    });
    const totalPercentage = totalMarks > 0 ? ((obtainedMarks / totalMarks) * 100).toFixed(2) : '0';
    csv += `\nTotal,${obtainedMarks},${totalMarks},${totalPercentage}%\n\n`;
  });

  downloadCSV(`${exam.title}_StudentWise_Results.csv`, csv);
};

/**
 * Generate and download transcript card (for individual student)
 */
export const downloadTranscriptCard = (exam: Exam, results: ExamResult[]) => {
  if (!results.length) {
    alert('No results available for this exam');
    return;
  }

  let csv = `EXAM TRANSCRIPT CARD\n`;
  csv += `=====================================\n`;
  csv += `Exam: ${exam.title}\n`;
  csv += `Type: ${exam.type}\n`;
  csv += `Date: ${new Date(exam.startDate).toLocaleDateString()}\n`;
  csv += `Status: ${exam.status}\n`;
  csv += `=====================================\n\n`;

  csv += 'Student,Class,Subject,Marks,Out Of,Grade,Remarks\n';
  results.forEach(r => {
    csv += `${escapeCSV(r.studentName)},${escapeCSV(r.className)},${escapeCSV(r.subjectName)},${escapeCSV(r.marksObtained)},${escapeCSV(r.totalMarks)},${escapeCSV(r.grade)},${escapeCSV(r.remarks)}\n`;
  });

  downloadCSV(`${exam.title}_Transcript_Card.csv`, csv);
};

/**
 * Generate and download summary report
 */
export const downloadExamSummary = (exam: Exam, results: ExamResult[]) => {
  if (!results.length) {
    alert('No results available for this exam');
    return;
  }

  // Calculate statistics
  const totalStudents = new Set(results.map(r => r.studentId)).size;
  const avgMarks = results.length > 0 
    ? (results.reduce((sum, r) => sum + r.marksObtained, 0) / results.length).toFixed(2)
    : '0';
  const avgTotal = results.length > 0
    ? (results.reduce((sum, r) => sum + r.totalMarks, 0) / results.length).toFixed(2)
    : '0';
  
  const gradeCount = new Map<string, number>();
  results.forEach(r => {
    gradeCount.set(r.grade, (gradeCount.get(r.grade) || 0) + 1);
  });

  let csv = `EXAM SUMMARY REPORT\n`;
  csv += `=====================================\n`;
  csv += `Exam: ${exam.title}\n`;
  csv += `Type: ${exam.type}\n`;
  csv += `Period: ${new Date(exam.startDate).toLocaleDateString()} to ${new Date(exam.endDate).toLocaleDateString()}\n`;
  csv += `Status: ${exam.status}\n\n`;

  csv += `STATISTICS\n`;
  csv += `Total Students: ${totalStudents}\n`;
  csv += `Total Results: ${results.length}\n`;
  csv += `Average Marks: ${avgMarks} / ${avgTotal}\n\n`;

  csv += `GRADE DISTRIBUTION\n`;
  gradeCount.forEach((count, grade) => {
    csv += `${grade}: ${count} students\n`;
  });

  downloadCSV(`${exam.title}_Summary_Report.csv`, csv);
};
