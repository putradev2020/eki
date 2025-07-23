export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatTime(timeString: string): string {
  return timeString;
}

export function formatDateTime(dateString: string, timeString: string): string {
  return `${formatDate(dateString)} ${formatTime(timeString)}`;
}

export function isSameDate(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString();
}

export function isToday(date: Date): boolean {
  return isSameDate(date, new Date());
}

export function getMonthName(date: Date): string {
  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
}

export function getWeekDays(): string[] {
  return ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
}

export function getDaysInMonth(date: Date): Date[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const days: Date[] = [];
  const current = new Date(startDate);
  
  for (let i = 0; i < 42; i++) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return days;
}

export function getWeekDates(date: Date): Date[] {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    dates.push(day);
  }
  
  return dates;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addWeeks(date: Date, weeks: number): Date {
  return addDays(date, weeks * 7);
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function getEventsForDate(events: Event[], date: Date): Event[] {
  const dateString = date.toISOString().split('T')[0];
  return events.filter(event => {
    const eventStart = event.startDate;
    const eventEnd = event.endDate;
    return dateString >= eventStart && dateString <= eventEnd;
  });
}

export function getHourlyEvents(events: Event[], date: Date): { [hour: string]: Event[] } {
  const dateEvents = getEventsForDate(events, date);
  const hourlyEvents: { [hour: string]: Event[] } = {};
  
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, '0') + ':00';
    hourlyEvents[hour] = [];
  }
  
  dateEvents.forEach(event => {
    const startHour = event.startTime.split(':')[0] + ':00';
    if (hourlyEvents[startHour]) {
      hourlyEvents[startHour].push(event);
    }
  });
  
  return hourlyEvents;
}

export function getFirstDayOfMonth(date: Date): number {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  return firstDay.getDay();
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}