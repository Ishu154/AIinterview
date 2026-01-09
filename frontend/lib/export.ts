/**
 * Export Utilities
 * Functions to export interview transcripts as PDF or JSON
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { InterviewSession, ExportOptions } from '@/types';

/**
 * Format duration in mm:ss format
 */
const formatDuration = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Format timestamp to readable date/time
 */
const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
};

/**
 * Export interview transcript as PDF
 */
export function exportAsPDF(session: InterviewSession, options: ExportOptions = { format: 'pdf' }): void {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('AI Interview Transcript', 14, 22);

    // Metadata
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    let yPos = 35;

    if (options.includeMetadata !== false) {
        doc.text(`Role: ${session.config.role}`, 14, yPos);
        yPos += 6;
        doc.text(`Difficulty: ${session.config.difficulty}`, 14, yPos);
        yPos += 6;
        doc.text(`Questions Answered: ${session.questionsAnswered}`, 14, yPos);
        yPos += 6;

        if (session.startTime && session.endTime) {
            const duration = session.endTime - session.startTime;
            doc.text(`Duration: ${formatDuration(duration)}`, 14, yPos);
            yPos += 6;
        }

        if (session.startTime && options.includeTimestamps) {
            doc.text(`Started: ${formatTimestamp(session.startTime)}`, 14, yPos);
            yPos += 6;
        }

        yPos += 4;
    }

    // Conversation Table
    const tableData = session.conversationHistory.map((entry, index) => {
        const row: any[] = [
            index + 1,
            entry.speaker,
            entry.text,
        ];

        if (options.includeTimestamps) {
            row.push(formatTimestamp(entry.timestamp));
        }

        return row;
    });

    const headers: string[] = ['#', 'Speaker', 'Message'];
    if (options.includeTimestamps) {
        headers.push('Time');
    }

    autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: yPos,
        styles: {
            fontSize: 9,
            cellPadding: 3,
        },
        headStyles: {
            fillColor: [59, 130, 246], // Blue
            fontStyle: 'bold',
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245],
        },
        columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 25 },
            2: { cellWidth: 'auto' },
        },
    });

    // Save PDF
    const filename = `interview-transcript-${Date.now()}.pdf`;
    doc.save(filename);
}

/**
 * Export interview transcript as JSON
 */
export function exportAsJSON(session: InterviewSession, options: ExportOptions = { format: 'json' }): void {
    const data: any = {
        conversationHistory: session.conversationHistory,
    };

    if (options.includeMetadata !== false) {
        data.metadata = {
            role: session.config.role,
            difficulty: session.config.difficulty,
            questionsAnswered: session.questionsAnswered,
            startTime: session.startTime,
            endTime: session.endTime,
            duration: session.startTime && session.endTime
                ? session.endTime - session.startTime
                : null,
        };
    }

    // Convert to JSON string
    const jsonString = JSON.stringify(data, null, 2);

    // Create blob and download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-transcript-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Main export function that routes to the appropriate exporter
 */
export function exportTranscript(session: InterviewSession, options: ExportOptions): void {
    if (options.format === 'pdf') {
        exportAsPDF(session, options);
    } else if (options.format === 'json') {
        exportAsJSON(session, options);
    } else {
        throw new Error(`Unsupported export format: ${options.format}`);
    }
}
