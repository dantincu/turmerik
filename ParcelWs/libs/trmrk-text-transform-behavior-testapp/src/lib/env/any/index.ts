import trmrk_lib from "../../../synced-libs/trmrk";

import { turmerik } from "../../../synced-libs/trmrk-text-transform-mybehavior/env/any";
import { RichTextBoxPseudoMarkup } from "../../../synced-libs/trmrk-text-transform-behavior/core";

const pseudoMarkup: RichTextBoxPseudoMarkup = {
  Lines: [
    {
      Segments: [
        {
          StartIdx: 0,
          Length: 7,
          Text: "import ",
          ForegroundColor: "Green",
          BackgroundColor: "232, 255, 232",
          Font: {
            FontFamilyName: "Microsoft Sans Serif",
            FontSize: 8.0,
            FontStyle: "Bold",
          },
        },
        {
          StartIdx: 7,
          Length: 2,
          Text: "1 ",
          ForegroundColor: "Gray",
          BackgroundColor: "232, 255, 232",
          Font: {
            FontFamilyName: "Microsoft Sans Serif",
            FontSize: 7.0,
            FontStyle: "Regular",
          },
        },
        {
          StartIdx: 9,
          Length: 19,
          Text: "{ Component } from ",
          ForegroundColor: "Black",
          BackgroundColor: "232, 255, 232",
          Font: {
            FontFamilyName: "Microsoft Sans Serif",
            FontSize: 8.0,
            FontStyle: "Regular",
          },
        },
        {
          StartIdx: 28,
          Length: 15,
          Text: "'@angular/core'",
          ForegroundColor: "186, 33, 33",
          BackgroundColor: "232, 255, 232",
          Font: {
            FontFamilyName: "Microsoft Sans Serif",
            FontSize: 8.0,
            FontStyle: "Regular",
          },
        },
        {
          StartIdx: 43,
          Length: 1,
          Text: ";",
          ForegroundColor: "Black",
          BackgroundColor: "232, 255, 232",
          Font: {
            FontFamilyName: "Microsoft Sans Serif",
            FontSize: 8.0,
            FontStyle: "Regular",
          },
        },
      ],
    },
    {
      Segments: [
        {
          StartIdx: 44,
          Length: 2,
          Text: "2 ",
          ForegroundColor: "Gray",
          BackgroundColor: "232, 255, 232",
          Font: {
            FontFamilyName: "Microsoft Sans Serif",
            FontSize: 7.0,
            FontStyle: "Regular",
          },
        },
        {
          StartIdx: 47,
          Length: 7,
          Text: "import ",
          ForegroundColor: "Green",
          BackgroundColor: "232, 255, 232",
          Font: {
            FontFamilyName: "Microsoft Sans Serif",
            FontSize: 8.0,
            FontStyle: "Bold",
          },
        },
        {
          StartIdx: 54,
          Length: 17,
          Text: "{ Article } from ",
          ForegroundColor: "Black",
          BackgroundColor: "232, 255, 232",
          Font: {
            FontFamilyName: "Microsoft Sans Serif",
            FontSize: 8.0,
            FontStyle: "Regular",
          },
        },
        {
          StartIdx: 71,
          Length: 25,
          Text: "'./article/article.model'",
          ForegroundColor: "186, 33, 33",
          BackgroundColor: "232, 255, 232",
          Font: {
            FontFamilyName: "Microsoft Sans Serif",
            FontSize: 8.0,
            FontStyle: "Regular",
          },
        },
        {
          StartIdx: 96,
          Length: 2,
          Text: "; ",
          ForegroundColor: "Black",
          BackgroundColor: "232, 255, 232",
          Font: {
            FontFamilyName: "Microsoft Sans Serif",
            FontSize: 8.0,
            FontStyle: "Regular",
          },
        },
        {
          StartIdx: 98,
          Length: 18,
          Text: "// <-- import this",
          ForegroundColor: "64, 128, 128",
          BackgroundColor: "232, 255, 232",
          Font: {
            FontFamilyName: "Microsoft Sans Serif",
            FontSize: 8.0,
            FontStyle: "Italic",
          },
        },
      ],
    },
  ],
};

turmerik.behavior.TextTransformers[0].RichTextTransformItems![0].JsMethod(
  "asdfasdf",
  pseudoMarkup
);
