// JavaScript epoch starts at 1970-01-01
export const epoch1970Milliseconds = new Date(1970, 0, 1).getTime(); // 0 milliseconds

// Custom date for 0001-01-01
export const epoch0001Milliseconds = new Date(0).setFullYear(1, 0, 1); // Adjust the starting year

// Calculate the difference in milliseconds
export const millisecondsBetweenEpochs0001And1970 =
  epoch1970Milliseconds - epoch0001Milliseconds;

export const ticksToMillis = (
  ticks: number,
  round?: boolean | null | undefined
) => {
  let millis = ticks / 10000;
  round ??= true;

  if (round) {
    millis = Math.round(millis);
  }

  return millis;
};

export const dotNetDateTimeToJsMillis = (dotNetMillis: number) => {
  const jsMillis = dotNetMillis - millisecondsBetweenEpochs0001And1970;
  return jsMillis;
};

export const getOffsetInMilliseconds = () => {
  const now = new Date();

  // Get the time zone offset in minutes
  const offsetInMinutes = now.getTimezoneOffset();
  const offsetInMillis = offsetInMinutes * 60 * 1000;

  return offsetInMillis;
};

export const addMillis = (date: Date, millisToAdd: number) => {
  const totalMillis = date.setTime(date.getTime() + millisToAdd);
  return totalMillis;
};

export const moveUtcDateToLocalTime = (date: Date, offsetInMillis?: number) => {
  offsetInMillis ??= getOffsetInMilliseconds();
  addMillis(date, offsetInMillis);

  return date;
};

export const dateToDisplayStr = (date: Date) => {
  const str = [date.toLocaleDateString(), date.toLocaleTimeString()].join(" ");
  return str;
};
