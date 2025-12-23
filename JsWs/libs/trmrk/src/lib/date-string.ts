import { NullOrUndef, withVal, actWithVal } from './core';
import { extractNumbers, NumbersExtractorChunk } from './numbers-string';
import { createDate } from './date';

export enum TimeStampFormatKind {
  Default = 0,
  ForFileName,
}

export interface TimeStamp {
  dateTime?: Date | NullOrUndef;
  text?: string | NullOrUndef;
  hasDate?: boolean | NullOrUndef;
  hasTime?: boolean | NullOrUndef;
  hasSeconds?: boolean | NullOrUndef;
  hasMillis?: boolean | NullOrUndef;
  timeZone?: number | NullOrUndef;
}

export interface TimeStampFormat extends TimeStamp {
  formatKind?: TimeStampFormatKind | NullOrUndef;
  paddNumbers?: boolean | NullOrUndef;
}

export const timeStampCharRegex = () => /[0-9A-Z\-_\+ \.\:]/;
export const timeStampRegex = () => /\-?[0-9]+([\-_\+ \.\:]+[0-9]+)+[A-Z]{0,3}/;

export const timeZoneToString = (value: TimeStampFormat) => {
  let retStr = '';
  const isForFileName = value.formatKind === TimeStampFormatKind.ForFileName;

  if ((value.timeZone ?? null) !== null) {
    if (value.timeZone === 0) {
      retStr = 'UTC';
    } else {
      const absTimeZone = Math.abs(value.timeZone!);
      const isNegative = absTimeZone !== value.timeZone;
      const hours = absTimeZone / 60;
      const minutes = absTimeZone % 60;

      retStr = [
        isNegative ? '-' : '+',
        [
          withVal(hours.toString(), (hoursStr) =>
            value.paddNumbers ? hoursStr.padStart(2, '0') : hoursStr
          ),
          withVal(minutes.toString(), (minutesStr) =>
            value.paddNumbers ? minutesStr.padStart(2, '0') : minutesStr
          ),
        ].join(isForFileName ? '-' : ':'),
      ].join('');
    }
  }

  return retStr;
};

export const timeStampToStr = (value: TimeStampFormat) => {
  const dateTime = value.dateTime!;
  const isForFileName = value.formatKind === TimeStampFormatKind.ForFileName;

  value = actWithVal({ ...value }, (opts) => {
    opts.paddNumbers ??= isForFileName;
  });

  const partsArr: string[] = [];

  if (value.hasDate) {
    partsArr.push(
      [
        withVal(dateTime.getFullYear().toString(), (fullYearStr) =>
          value.paddNumbers ? fullYearStr.padStart(4, '0') : fullYearStr
        ),
        withVal((dateTime.getMonth() + 1).toString(), (monthStr) =>
          value.paddNumbers ? monthStr.padStart(2, '0') : monthStr
        ),
        withVal(dateTime.getDate().toString(), (dateStr) =>
          value.paddNumbers ? dateStr.padStart(2, '0') : dateStr
        ),
      ].join('-')
    );
  }

  if (value.hasTime) {
    const timePartsArr = [
      withVal(dateTime.getHours().toString(), (hoursStr) =>
        value.paddNumbers ? hoursStr.padStart(2, '0') : hoursStr
      ),
      withVal(dateTime.getMinutes().toString(), (minutesStr) =>
        value.paddNumbers ? minutesStr.padStart(2, '0') : minutesStr
      ),
    ];

    if (value.hasSeconds) {
      timePartsArr.push(
        withVal(dateTime.getSeconds().toString(), (secondsStr) =>
          value.paddNumbers ? secondsStr.padStart(2, '0') : secondsStr
        )
      );
    }

    let timeStr = timePartsArr.join(isForFileName ? '-' : ':');

    if (value.hasMillis) {
      timeStr = [
        timeStr,
        withVal(dateTime.getMilliseconds().toString(), (millisStr) =>
          value.paddNumbers ? millisStr.padStart(3, '0') : millisStr
        ),
      ].join(isForFileName ? '_' : '.');
    }

    if ((value.timeZone ?? null) !== null) {
      timeStr += timeZoneToString(value);
    }

    partsArr.push(timeStr);
  }

  const retStr = partsArr.join(isForFileName ? '_' : ' ');
  return retStr;
};

export class TimeStampFromStrNormalizer {
  isForFileName: boolean;
  chunksArr: NumbersExtractorChunk[];
  numberChunksArr: NumbersExtractorChunk[];
  numbersArr: number[];
  firstDigitIsNegative: boolean;

  constructor(public value: TimeStampFormat) {
    this.isForFileName = value.formatKind === TimeStampFormatKind.ForFileName;
    this.chunksArr = extractNumbers(value.text!);
    this.numberChunksArr = this.chunksArr.filter((chunk) => (chunk.digit ?? null) !== null);
    this.numbersArr = this.numberChunksArr.map((chunk) => chunk.digit!);
    this.firstDigitIsNegative = this.chunksArr[0].str === '-';
  }

  normalize() {
    switch (this.numbersArr.length) {
      case 1:
        let millis = this.numbersArr[0];

        if (this.chunksArr[0].str === '-') {
          millis * -(-1);
        }

        this.value.dateTime = new Date(millis);
        this.value.hasMillis = true;
        break;
      case 2:
        this.value.dateTime = createDate([0, 0, 0, ...this.numbersArr]);
        this.value.hasTime = true;
        break;
      case 3:
        this.onMightHaveDateOrTime();

        if (this.value.hasDate) {
          this.value.dateTime = createDate(this.handleNegativeYearIfReq(this.numbersArr));
        } else if (this.value.hasTime) {
          this.value.hasSeconds = true;
          this.value.dateTime = createDate([0, 0, 0, ...this.numbersArr]);
        }
        break;
      case 4:
        this.value.hasTime = true;

        if ((this.value.hasMillis = this.value.text!.indexOf('.') >= 0)) {
          this.value.hasSeconds = true;
          this.value.dateTime = createDate([0, 0, 0, ...this.numbersArr]);
        } else {
          this.value.dateTime = createDate([0, 0, 0, ...this.numbersArr.slice(0, 2)]);
          this.assignTimeZone();
        }

        break;
      case 5:
        this.onMightHaveDateOrTime();

        if (this.value.hasDate) {
          this.value.dateTime = createDate(this.handleNegativeYearIfReq(this.numbersArr));
        } else if (this.value.hasTime) {
          this.value.hasSeconds = true;
          this.value.hasMillis = true;
          this.value.dateTime = createDate([0, 0, 0, ...this.numbersArr.slice(0, 3)]);
          this.assignTimeZone();
        }
        break;
      case 6:
        this.setHasDateAndSeconds();

        if ((this.value.hasMillis = this.value.text!.indexOf('.') >= 0)) {
          this.value.dateTime = createDate([0, 0, 0, ...this.numbersArr.slice(0, 4)]);
          this.assignTimeZone();
        } else {
          this.value.dateTime = createDate(this.handleNegativeYearIfReq(this.numbersArr));
        }

        break;
      case 7:
        this.setDateAndHasMillis();
        this.value.dateTime = createDate(this.handleNegativeYearIfReq(this.numbersArr));
        break;
      case 8:
        this.setDateAndHasMillis();
        this.value.dateTime = createDate(this.handleNegativeYearIfReq(this.numbersArr));
        this.assignTimeZoneFromHoursOnly();
        break;
      case 9:
        this.setDateAndHasMillis();
        this.value.dateTime = createDate(this.handleNegativeYearIfReq(this.numbersArr.slice(0, 7)));
        this.assignTimeZone();
        break;
    }

    return this.value;
  }

  onMightHaveDateOrTime() {
    if ((this.value.hasDate ?? this.value.hasTime) === null) {
      this.value.hasTime = (this.isForFileName ? /\./ : /\.\:/).test(this.value.text!);
      this.value.hasDate = !this.value.hasTime;
    }
  }

  handleNegativeTimeZoneIfReq() {
    if ((this.value.hasDate ?? this.value.hasTime) === null) {
      this.value.hasTime = (this.isForFileName ? /\./ : /\.\:/).test(this.value.text!);
      this.value.hasDate = !this.value.hasTime;
    }
  }

  assignTimeZone() {
    this.value.timeZone = this.numbersArr.at(-2)! * 60 + this.numbersArr.at(-1)!;
    this.handleNegativeTimeZoneIfReq();
  }

  assignTimeZoneFromHoursOnly() {
    this.value.timeZone = this.numbersArr.at(-1)!;
    this.handleNegativeTimeZoneIfReq();
  }

  handleNegativeYearIfReq(argsArr: number[]) {
    if (this.firstDigitIsNegative) {
      argsArr[0] *= -1;
    }

    return argsArr;
  }

  setHasDateAndSeconds() {
    this.value.hasDate = true;
    this.value.hasTime = true;
    this.value.hasSeconds = true;
  }

  setDateAndHasMillis() {
    this.setHasDateAndSeconds();
    this.value.hasMillis = true;
  }
}

export const timeStampFromStr = (value: TimeStampFormat) =>
  new TimeStampFromStrNormalizer(value).normalize();
