export function format(str: string, ...args: any[]): string {
  if (args.length === 0) return str;
  return str.replace(/{(\d+)}/g, (match, number) => {
    return typeof args[number] !== 'undefined' ? args[number] : match;
  });
}