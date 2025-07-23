import { Event } from '../types';
import { formatDate, formatTime } from './dateUtils';

export function exportToCSV(events: Event[]): void {
  const headers = ['Judul', 'Tanggal', 'Jam', 'Lokasi', 'Kategori', 'Deskripsi'];
  
  const csvContent = [
    headers.join(','),
    ...events.map(event => [
      `"${event.title}"`,
      `"${formatDate(event.startDate)}"`,
      `"${event.startTime}"`,
      `"${event.location}"`,
      `"${event.category.name}"`,
      `"${event.description}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `agenda_kegiatan_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function printCalendar(): void {
  // Create a print-friendly version of the agenda
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  // Get current events from the page
  const eventsData = JSON.parse(localStorage.getItem('currentEvents') || '[]');
  
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Rekapan Agenda Kegiatan Publik</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 20px; 
          color: #333;
          line-height: 1.6;
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px; 
          border-bottom: 2px solid #3B82F6;
          padding-bottom: 20px;
        }
        .header h1 { 
          color: #3B82F6; 
          margin: 0;
          font-size: 24px;
        }
        .header p { 
          color: #666; 
          margin: 5px 0 0 0;
          font-size: 14px;
        }
        .summary {
          background: #f8fafc;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 25px;
          border-left: 4px solid #3B82F6;
        }
        .event { 
          margin-bottom: 20px; 
          padding: 15px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: white;
        }
        .event-title { 
          font-weight: bold; 
          color: #1f2937;
          font-size: 16px;
          margin-bottom: 8px;
        }
        .event-meta { 
          color: #6b7280; 
          font-size: 14px;
          margin-bottom: 8px;
        }
        .event-description { 
          color: #4b5563;
          font-size: 14px;
          line-height: 1.5;
        }
        .category {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          margin-bottom: 8px;
        }
        .category-meeting { background: #dbeafe; color: #1d4ed8; }
        .category-conference { background: #ede9fe; color: #7c3aed; }
        .category-workshop { background: #dcfce7; color: #16a34a; }
        .category-seminar { background: #fed7aa; color: #ea580c; }
        .category-social { background: #fce7f3; color: #db2777; }
        .category-training { background: #e0e7ff; color: #4338ca; }
        .category-other { background: #f3f4f6; color: #374151; }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 12px;
        }
        @media print {
          body { margin: 0; }
          .event { break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📅 Rekapan Agenda Kegiatan Publik</h1>
        <p>Dicetak pada: ${new Date().toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
      </div>
      
      <div class="summary">
        <strong>📊 Ringkasan:</strong> Total ${eventsData.length} agenda kegiatan
      </div>
      
      ${eventsData.map((event: any) => `
        <div class="event">
          <div class="category category-${event.category?.id || 'other'}">
            ${event.category?.name || 'Lainnya'}
          </div>
          <div class="event-title">${event.title}</div>
          <div class="event-meta">
            📅 ${formatDate(event.startDate)}${event.startDate !== event.endDate ? ` - ${formatDate(event.endDate)}` : ''}<br>
            🕐 ${event.startTime} - ${event.endTime}<br>
            📍 ${event.location}
            ${event.externalLink ? `<br>🔗 ${event.externalLink}` : ''}
          </div>
          <div class="event-description">${event.description}</div>
        </div>
      `).join('')}
      
      <div class="footer">
        <p>Sistem Informasi Agenda Terpadu - Agenda Kegiatan Publik</p>
        <p>© 2025 Dibuat oleh Mardiato Eka Saputra</p>
      </div>
    </body>
    </html>
  `;
  
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}