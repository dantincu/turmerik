import { NullOrUndef } from './core';

// JavaScript epoch starts at 1970-01-01
export const epoch1970Milliseconds = new Date(1970, 0, 1).getTime(); // 0 milliseconds

// Custom date for 0001-01-01
export const epoch0001Milliseconds = new Date(0).setFullYear(1, 0, 1); // Adjust the starting year

// Calculate the difference in milliseconds
export const millisecondsBetweenEpochs0001And1970 = epoch1970Milliseconds - epoch0001Milliseconds;

export const ticksToMillis = (ticks: number, round?: boolean | NullOrUndef) => {
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

export const moveLocalTimeToUtcDate = (date: Date, offsetInMillis?: number) => {
  offsetInMillis ??= -1 * getOffsetInMilliseconds();
  addMillis(date, offsetInMillis);

  return date;
};

export const dateToDisplayStr = (date: Date) => {
  const str = [date.toLocaleDateString(), date.toLocaleTimeString()].join(' ');
  return str;
};

export const isLeapYear = (year: number) => {
  // 1. If the year is not divisible by 4, it's a common year.
  if (year % 4 !== 0) {
    return false;
  }

  // 2. If the year is NOT divisible by 100, it's a leap year.
  if (year % 100 !== 0) {
    return true;
  }

  // 3. If the year is not divisible by 400, it's a common year.
  if (year % 400 !== 0) {
    return false;
  }

  return true;
};

export const isRevisedJulianLeapYear = (year: number) => {
  // 1. If the year is not divisible by 4, it's a common year.
  if (year % 4 !== 0) {
    return false;
  }

  // 2. If the year is NOT divisible by 100, it's a leap year.
  if (year % 100 !== 0) {
    return true;
  }

  // 3. If divisible by 100, it's only a leap year if:
  //    (year % 900) results in a remainder of 200 or 600.
  const remainder = year % 900;
  return remainder === 200 || remainder === 600;
};

export const createDate = (args: number[]) => {
  switch (args.length) {
    case 0:
      return new Date();
    case 1:
      return new Date(args[0]);
    case 2:
      return new Date(args[0], args[1]);
    case 3:
      return new Date(args[0], args[1], args[2]);
    case 4:
      return new Date(args[0], args[1], args[2], args[3]);
    case 5:
      return new Date(args[0], args[1], args[2], args[3], args[4]);
    case 6:
      return new Date(args[0], args[1], args[2], args[3], args[4], args[5]);
    case 7:
      return new Date(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
    default:
      throw new Error(`The Date object receives between 0 and 7 arguments, but got ${args.length}`);
  }
};
