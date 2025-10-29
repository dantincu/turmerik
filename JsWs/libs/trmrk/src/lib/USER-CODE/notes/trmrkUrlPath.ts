import { TrmrkItemUrlPath, TrmrkUrlPath } from './types';

export const trmrkUrlChars = Object.freeze({
  noteRoot: '!',
  note: '!.',
  itemRoot: '|',
  item: '|.',
  currentDir: '.',
  parentDir: '..',
  segmentSep: '/',
});

class TrmrkUrlPathParser {
  noteSeg: TrmrkItemUrlPath | null = null;
  itemSeg: TrmrkItemUrlPath | null = null;
  seg!: TrmrkItemUrlPath;
  urlParts!: string[];
  firstUrlPart!: string;

  constructor(private inputUrl: string) {}

  public parse() {
    this.urlParts = this.inputUrl.split(trmrkUrlChars.segmentSep);
    this.firstUrlPart = this.urlParts[0];

    this.digestFirstPart();
    this.digestUrlParts();

    if (this.itemSeg && this.noteSeg) {
      this.itemSeg.startsFromRoot = null;
    }

    const retObj: TrmrkUrlPath = {
      item: this.itemSeg,
      note: this.noteSeg,
    };

    return retObj;
  }

  private digestFirstPart() {
    switch (this.firstUrlPart.length) {
      case 0:
        this.onDoubleSlashesFoundInTrmrkUrl();
        break;
      case 1:
        this.onFirstPartLength1();
        break;
      case 2:
        this.onFirstPartLength2();
        break;
      default:
        this.onStartsWithItem();
        break;
    }
  }

  private onDoubleSlashesFoundInTrmrkUrl() {
    throw new Error('Double slashes not allowed in trmrk url');
  }

  private onFirstPartLength1() {
    switch (this.firstUrlPart) {
      case trmrkUrlChars.noteRoot:
        this.onStartsWithNote(true);
        break;
      case trmrkUrlChars.itemRoot:
        this.onStartsWithItem(true);
        break;
      default:
        this.onStartsWithItem();
        break;
    }
  }

  private onFirstPartLength2() {
    switch (this.firstUrlPart) {
      case trmrkUrlChars.note:
        this.onStartsWithNote();
        break;
      default:
        this.onStartsWithItem();
        break;
    }
  }

  private createUrlSegmentsObj(
    part: string | null = null,
    startsFromRoot: boolean | null = null
  ): TrmrkItemUrlPath {
    return {
      segments: (part ?? null) !== null ? [part!] : [],
      startsFromRoot,
    };
  }

  private onNoteStart(
    part: string | null = null,
    startsFromRoot: boolean | null = null
  ) {
    this.noteSeg = this.seg = this.createUrlSegmentsObj(part, startsFromRoot);
  }

  private onItemStart(
    part: string | null = null,
    startsFromRoot: boolean | null = null
  ) {
    this.itemSeg = this.seg = this.createUrlSegmentsObj(part, startsFromRoot);
  }

  private onStartsWithNote(startsFromRoot: boolean | null = null) {
    this.onNoteStart(null, startsFromRoot);
  }

  private onStartsWithItem(startsFromRoot: boolean | null = null) {
    this.onItemStart(null, startsFromRoot);
  }

  private onGoToParentPointer() {
    const segments = this.seg.segments;

    if (
      segments.length &&
      segments[segments.length - 1] !== trmrkUrlChars.parentDir
    ) {
      segments.splice(-1, 1);
    } else {
      segments.push(trmrkUrlChars.parentDir);
    }
  }

  private digestPartWithLength1(part: string) {
    switch (part) {
      case trmrkUrlChars.noteRoot:
        this.onNoteStart(part, true);
        break;
      case trmrkUrlChars.itemRoot:
        this.onItemStart(part, true);
        break;
      case trmrkUrlChars.parentDir:
        this.onGoToParentPointer();
        break;
      default:
        this.seg.segments.push(part);
        break;
    }
  }

  private digestPartWithLength2(part: string) {
    switch (part) {
      case trmrkUrlChars.note:
        this.onNoteStart(part);
        break;
      case trmrkUrlChars.item:
        this.onItemStart(part);
        break;
      case trmrkUrlChars.currentDir:
        break;
      default:
        this.seg.segments.push(part);
        break;
    }
  }

  private digestUrlParts() {
    for (let part of this.urlParts) {
      switch (this.firstUrlPart.length) {
        case 0:
          this.onDoubleSlashesFoundInTrmrkUrl();
          break;
        case 1:
          this.digestPartWithLength1(part);
          break;
        case 2:
          this.digestPartWithLength2(part);
          break;
        default:
          this.seg.segments.push(part);
          break;
      }
    }
  }
}

export const parseTrmrkUrlPath = (inputUrl: string) =>
  new TrmrkUrlPathParser(inputUrl).parse();

export const normalizeTrmrkUrlPath = (url: string | TrmrkUrlPath) => {
  if ('string' === typeof url) {
    url = parseTrmrkUrlPath(url);
  }

  return url;
};

export const serializeTrmrkItemUrlPath = (
  url: TrmrkItemUrlPath,
  isNoteItem: boolean
) =>
  [
    isNoteItem
      ? url.startsFromRoot
        ? trmrkUrlChars.noteRoot
        : trmrkUrlChars.note
      : url.startsFromRoot
      ? trmrkUrlChars.itemRoot
      : trmrkUrlChars.item,
    ...url.segments,
  ].join(trmrkUrlChars.segmentSep);

export const serializeTrmrkUrl = (url: TrmrkUrlPath) => {
  let outputUrl: string;

  if (url.note && url.item) {
    outputUrl = [
      serializeTrmrkItemUrlPath(url.note, true),
      serializeTrmrkItemUrlPath(url.item, false),
    ].join(trmrkUrlChars.segmentSep);
  } else if (url.note) {
    outputUrl = serializeTrmrkItemUrlPath(url.note, true);
  } else if (url.item) {
    outputUrl = serializeTrmrkItemUrlPath(url.item, false);
  } else {
    outputUrl = '';
  }

  return outputUrl;
};
