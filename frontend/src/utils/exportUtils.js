import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Export data to CSV
 * @param {Array} data - Array of objects to export
 * @param {Array} headers - Array of header objects { label: 'Display Name', key: 'dataKey' }
 * @param {string} filename - Name of the file to download
 */
export const exportToCSV = (data, headers, filename = 'export.csv') => {
    // Create CSV content
    const csvContent = [
        // Headers row
        headers.map(h => h.label).join(','),
        // Data rows
        ...data.map(row =>
            headers.map(h => {
                const value = row[h.key];
                // Handle strings with commas or quotes
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value !== null && value !== undefined ? value : '';
            }).join(',')
        )
    ].join('\n');

    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

/**
 * Export data to PDF
 * @param {Array} data - Array of objects to export
 * @param {Array} headers - Array of header objects { header: 'Display Name', dataKey: 'dataKey' }
 * @param {string} filename - Name of the file to download
 * @param {string} title - Title to display on top of the PDF
 */
export const exportToPDF = (data, headers, filename = 'export.pdf', title = 'Data Export') => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Create table using functional pattern
    autoTable(doc, {
        startY: 35,
        head: [headers.map(h => h.header)],
        // Extract values based on dataKeys
        body: data.map(item => headers.map(h => item[h.dataKey] || '')),
        theme: 'grid',
        headStyles: { fillColor: [66, 139, 202] },
    });

    doc.save(filename);
};
