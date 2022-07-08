using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;

namespace Turmerik.OneDriveExplorer.AspNetCore.WebApp.Services
{
    public interface IDriveItemNameMacrosService
    {
        ReadOnlyCollection<DriveItemMacroImmtbl> GetDriveItemNameMacros();
    }

    public class DriveItemNameMacrosService : IDriveItemNameMacrosService
    {
        private const int DIGITS_COUNT = 4;

        private static readonly string numberFormat = GetNumberFormat(DIGITS_COUNT);

        private readonly ReadOnlyCollection<DriveItemMacroImmtbl> driveItemNameMacros;

        public DriveItemNameMacrosService()
        {
            this.driveItemNameMacros = this.GetDriveItemNameMacrosCore().Select(
                item => new DriveItemMacroImmtbl(item)).RdnlC();
        }

        public ReadOnlyCollection<DriveItemMacroImmtbl> GetDriveItemNameMacros() => this.driveItemNameMacros;

        private static string GetNumberFormat(int digitsCount) => $"D{digitsCount}";

        private List<DriveItemMacroMtbl> GetDriveItemNameMacrosCore()
        {
            int digitsCount = DIGITS_COUNT;
            string numFmt = numberFormat;

            var alphabeticalOrderingMacro = this.GetDriveItemNameMacro(
                "@A@", "Alphabetical ordering",
                macro => macro.SrcNameFirstLetterWrappingChar = '@');

            var pinnedMacros = new List<DriveItemNameMacroMtbl>()
            {
                this.GetDriveItemNameMacro(MacrosH.ENTRY_NAME, "The drive entry name", item => item.EntryName = string.Empty),
                alphabeticalOrderingMacro,
                this.GetDriveItemNameMacro(MacrosH.SRC_NAME, "The drive entry source name", item => item.SrcName = string.Empty),
            };

            var headingAscMacros = this.GetIndexHeadingAscMacros();
            var headingDescMacros = this.GetIndexHeadingDescMacros();
            var ascMacros = this.GetIndexAscMacros();
            var descMacros = this.GetIndexDescMacros();

            var commonConstDirNameMacros = this.GetCommonConstDirNameMacros();
            var atomicConstDirNameMacros = this.GetAtomicConstDirNameMacros();
            var fileNameExtensionMacros = this.GetFileNameExtensionMacros();

            var retList = new List<DriveItemMacroMtbl>
            {
                this.GetDriveItemMacroMtbl(MacrosH.PINNED, "Miscellaneous", pinnedMacros),
                this.GetDriveItemMacroMtbl(MacrosH.COMMON_CONST, "Common const dir name macros", commonConstDirNameMacros),
                this.GetDriveItemMacroMtbl(MacrosH.DESC_IDX, "Desc Indexing", descMacros),
                this.GetDriveItemMacroMtbl(MacrosH.ASC_IDX, "Asc Indexing", ascMacros),
                this.GetDriveItemMacroMtbl(MacrosH.H_DESC_IDX, "Heading Desc Indexing", headingDescMacros),
                this.GetDriveItemMacroMtbl(MacrosH.H_ASC_IDX, "Heading Asc Indexing", headingAscMacros),
                this.GetDriveItemMacroMtbl(MacrosH.ATOMIC_CONST, "Atomic const dir name macros", commonConstDirNameMacros),
                this.GetDriveItemMacroMtbl(MacrosH.EXT, "File name extensions", commonConstDirNameMacros)
            };

            return retList;
        }

        private DriveItemMacroMtbl GetDriveItemMacroMtbl(
            string key, string name,
            List<DriveItemNameMacroMtbl> nameMacrosList)
        {
            var retMacro = new DriveItemMacroMtbl
            {
                Key = key,
                Name = name,
                Children = nameMacrosList.Select(
                        item => new DriveItemMacroMtbl
                        {
                            Name = item.MacroName,
                            NameMacro = item
                        }).ToList()
            };

            return retMacro;
        }

        private DriveItemNameMacroMtbl GetDriveItemNameMacro(
            string name,
            string description,
            Action<DriveItemNameMacroMtbl> propsFactory)
        {
            var macro = new DriveItemNameMacroMtbl
            {
                MacroName = name,
                MacroDescription = description
            };

            propsFactory(macro);
            return macro;
        }

        private DriveItemNameMacroMtbl GetDriveItemConstNameMacro(
            string name, string description, params string[] nameParts)
        {
            if (nameParts.Length == 0)
            {
                nameParts = new string[] { name };
            }

            description = description ?? name;
            string constDirName = string.Join("-", nameParts);

            var retMacro = this.GetDriveItemNameMacro(
                name, description, macro =>
                {
                    macro.ConstName = constDirName;
                });

            return retMacro;
        }

        private List<DriveItemNameMacroMtbl> GetIndexHeadingAscMacros()
        {
            var headingAscMacros = Enumerable.Range(0, 5).Select(
                idx => this.GetIndexingDriveItemNameMacroMtbl(
                    idx, true, true)).ToList();

            return headingAscMacros;
        }

        private List<DriveItemNameMacroMtbl> GetIndexHeadingDescMacros()
        {
            var headingDescMacros = Enumerable.Range(0, 5).Select(
                idx => this.GetIndexingDriveItemNameMacroMtbl(
                    idx, false, true)).ToList();

            headingDescMacros.Reverse();
            return headingDescMacros;
        }

        private List<DriveItemNameMacroMtbl> GetIndexAscMacros()
        {
            var ascMacros = Enumerable.Range(1, 4).Select(
                idx => this.GetIndexingDriveItemNameMacroMtbl(
                    idx, true)).ToList();

            return ascMacros;
        }

        private List<DriveItemNameMacroMtbl> GetIndexDescMacros()
        {
            var descMacros = Enumerable.Range(0, 5).Select(
                idx => this.GetIndexingDriveItemNameMacroMtbl(
                    idx)).ToList();

            descMacros.Reverse();
            return descMacros;
        }

        private DriveItemNameMacroMtbl GetIndexingDriveItemNameMacroMtbl(
            int idx,
            bool incrementNumber = false,
            bool isHeading = false,
            int digitsCount = 4)
        {
            int factor = this.GetIndexFactor(idx, isHeading);
            int numberSeed = idx * factor * 2;

            int minNumber = numberSeed + 1;
            int maxNumber = numberSeed + factor - 1;

            if (!incrementNumber)
            {
                minNumber += factor;
                maxNumber += factor;
            }

            string macroName = this.GetIndexingDriveItemMacroName(
                digitsCount, incrementNumber, isHeading, minNumber, maxNumber);

            var macro = new DriveItemNameMacroMtbl
            {
                MacroName = macroName,
                MinNumber = minNumber,
                MaxNumber = maxNumber,
                IncrementNumber = incrementNumber,
                DigitsCount = digitsCount
            };

            return macro;
        }

        private int GetIndexFactor(int idx, bool isHeading)
        {
            int factor = 100;

            if (!isHeading)
            {
                factor *= 10;
            }

            return factor;
        }

        private string GetIndexingDriveItemMacroName(
            int digitsCount,
            bool incrementNumber,
            bool isHeading,
            int minNumber,
            int maxNumber)
        {
            var nameParts = this.GetIndexingDriveItemMacroNamePartsList(
                incrementNumber, isHeading);

            string numberFormat = GetNumberFormat(digitsCount);

            string nameCore = this.GetIndexingDriveItemMacroNameCore(
                minNumber, maxNumber, numberFormat, incrementNumber);

            nameParts.Add(nameCore);

            string macroName = string.Join(" ", nameParts);
            return macroName;
        }

        private List<string> GetIndexingDriveItemMacroNamePartsList(
            bool incrementNumber, bool isHeading)
        {
            var nameParts = new List<string>()
            {
                incrementNumber ? "ASC" : "DESC"
            };

            if (isHeading)
            {
                nameParts.Add("Heading");
            }

            return nameParts;
        }

        private string GetIndexingDriveItemMacroNameCore(
            int minNumber, int maxNumber, string numberFormat,
            bool incrementNumber)
        {
            string minNumberStr = minNumber.ToString(numberFormat);
            string maxNumberStr = maxNumber.ToString(numberFormat);

            string nameCore = this.GetIndexingDriveItemMacroNameCore(
                minNumberStr, maxNumberStr, incrementNumber);

            return nameCore;
        }

        private string GetIndexingDriveItemMacroNameCore(
            string minNumberStr, string maxNumberStr,
            bool incrementNumber)
        {
            var parts = new List<string>
            {
                minNumberStr, "-", maxNumberStr
            };

            if (!incrementNumber)
            {
                parts.Reverse();
            }

            string retStr = string.Join(" ", parts);
            return retStr;
        }

        private List<DriveItemNameMacroMtbl> GetFileNameExtensionMacros()
        {
            var macros = new string[]
            {
                "jpg", "zip", "m4a", "mp4", "mp3", "avi", "ogg", "gif", "txt", "png", "ico", "json", "rar", "html", "js", "css", "fnt",
                "docx", "xlsx", "pptx", "doc", "xls", "ppt", "mpg", "mpeg"
            }.Select(ext => this.GetDriveItemNameMacro(
                $".{ext}",
                $"File name extension .{ext}",
                macro =>
                {
                    macro.ConstName = $".{ext}";
                })).ToList();

            return macros;
        }

        private List<DriveItemNameMacroMtbl> GetCommonConstDirNameMacros()
        {
            var macrosList = new List<DriveItemNameMacroMtbl>
            {
                this.GetDriveItemConstNameMacro("@#a-z#", "Alphabetical ordering dir name"),
                this.GetDriveItemConstNameMacro("#photo-imgs.jpg#", ".jpg photo image files"),
                this.GetDriveItemConstNameMacro("#info-photo-imgs.jpg#", ".jpg info photo image files"),
                this.GetDriveItemConstNameMacro("#dwnldd-imgs.jpg#", "Downloaded .jpg files"),
                this.GetDriveItemConstNameMacro("#e-docs.pdf#", ".pdf files"),
                this.GetDriveItemConstNameMacro("#dwnldd-e-docs.pdf#", "Downloaded .pdf files"),
                this.GetDriveItemConstNameMacro("#e-docs.docx#", ".docx files"),
                this.GetDriveItemConstNameMacro("#dwnldd-e-docs.docx#", "Downloaded .docx files"),
                this.GetDriveItemConstNameMacro("#work-item-attachments#", "Work item attachments"),
                this.GetDriveItemConstNameMacro("#upldd-doc-scan-docs.pdf#signed-by-me#", "Uploaded .pdf files containing document scan images signed by me"),
                this.GetDriveItemConstNameMacro("#upldd-doc-scan-docs.pdf#", "Uploaded .pdf files containing document scan images"),
                this.GetDriveItemConstNameMacro("#upldd-doc-scan-docs.jpg#signed-by-me#", "Uploaded .jpg files containing document scan images signed by me"),
                this.GetDriveItemConstNameMacro("#upldd-doc-scan-docs.jpg#", "Uploaded .jpg files containing document scan images"),
                this.GetDriveItemConstNameMacro("#upldd-e-docs.docx#written-by-me#", "Uploaded .docx files written by me"),
                this.GetDriveItemConstNameMacro("#upldd-e-docs.docx#", "Uploaded .docx files"),
                this.GetDriveItemConstNameMacro("#e-docs.docx#written-by-me#", ".docx files written by me"),
                this.GetDriveItemConstNameMacro("#doc-scan-docs.pdf#signed-by-me#", ".pdf files containing document scan images signed by me"),
                this.GetDriveItemConstNameMacro("#doc-scan-docs.jpg#signed-by-me#", ".jpg files containing document scan images signed by me"),
            };

            return macrosList;
        }

        private List<DriveItemNameMacroMtbl> GetAtomicConstDirNameMacros()
        {
            var macrosList = new List<DriveItemNameMacroMtbl>
            {
                this.GetDriveItemConstNameMacro("a-z", "Alphabetical ordering dir name"),
                this.GetDriveItemConstNameMacro("imgs", "Image files"),
                this.GetDriveItemConstNameMacro("photo", "Photos"),
                this.GetDriveItemConstNameMacro("doc", "Document"),
                this.GetDriveItemConstNameMacro("e-docs", "Electronic document"),
                this.GetDriveItemConstNameMacro("scan", "Scanned"),
                this.GetDriveItemConstNameMacro("proc", "Processed"),
                this.GetDriveItemConstNameMacro("prnt", "Print"),
                this.GetDriveItemConstNameMacro("scrn", "Screen"),
                this.GetDriveItemConstNameMacro("snip", "Snip"),
                this.GetDriveItemConstNameMacro("sketch", "Sketch"),
                this.GetDriveItemConstNameMacro("dwnldd", "Downloaded"),
                this.GetDriveItemConstNameMacro("upldd", "Uploaded"),
                this.GetDriveItemConstNameMacro("signed", "Signed"),
                this.GetDriveItemConstNameMacro("written", "Written"),
                this.GetDriveItemConstNameMacro("by", "By"),
                this.GetDriveItemConstNameMacro("me", "Me"),
                this.GetDriveItemConstNameMacro("#", "Const dir name delimiter char"),
                this.GetDriveItemConstNameMacro("-", "Const dir name part delimiter char"),
                this.GetDriveItemConstNameMacro(".", "Const dir name file name extension delimiter char"),
                this.GetDriveItemConstNameMacro("@", "Alphabetical ordering delimiter char"),
                this.GetDriveItemConstNameMacro("Single space char", null, " "),
                this.GetDriveItemConstNameMacro("Empty macro", null, string.Empty),
            };

            return macrosList;
        }
    }
}
