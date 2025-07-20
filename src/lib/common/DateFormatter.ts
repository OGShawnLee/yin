function format(str: string, ...values: any[]): string {
  return str.replace(/{(\d+)}/g, (match, index) => {
    return typeof values[index] !== 'undefined' ? values[index] : match;
  });
}

export default class DateFormatter {
  private static readonly FORMATTER = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    hourCycle: 'h12'
  });

  public static getRelativeDate(date: Date | undefined | null): string | null {
    if (date === undefined || date === null) return null;

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) {
      return format("{0} year{1} ago", years, years > 1 ? 's' : '');
    } else if (months > 0) {
      return format("{0} month{1} ago", months, months > 1 ? 's' : '');
    } else if (days > 0) {
      return format("{0} day{1} ago", days, days > 1 ? 's' : '');
    } else if (hours > 0) {
      return format("{0} hour{1} ago", hours, hours > 1 ? 's' : '');
    } else if (minutes > 0) {
      return format("{0} minute{1} ago", minutes, minutes > 1 ? 's' : '');
    } else {
      return "just now";
    }
  }

  public static getFormattedDate(date: Date | undefined | null): string | null {
    if (date === undefined || date === null) return null;

    return DateFormatter.FORMATTER.format(date);
  }
}