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
        ReadOnlyDictionary<string, Tuple<string, ReadOnlyCollection<DriveItemNameMacro>>> GetDriveItemNameMacros();
    }

    public class DriveItemNameMacrosService : IDriveItemNameMacrosService
    {
        private readonly Dictionary<string, Tuple<string, List<DriveItemNameMacro>>> driveItemNameMacrosMx;

        public DriveItemNameMacrosService()
        {
            this.driveItemNameMacrosMx = this.GetDriveItemNameMacrosList();
        }

        public ReadOnlyDictionary<string, Tuple<string, ReadOnlyCollection<DriveItemNameMacro>>> GetDriveItemNameMacros()
        {
            var driveItemNameMacros = this.driveItemNameMacrosMx.ToDictionary(
                kvp => kvp.Key,
                kvp => new Tuple<string, ReadOnlyCollection<DriveItemNameMacro>>(
                    kvp.Value.Item1,
                    kvp.Value.Item2.Select(
                    item => new DriveItemNameMacro(
                        item)).ToArray().RdnlC())).RdnlD();

            return driveItemNameMacros;
        }

        private Dictionary<string, Tuple<string, List<DriveItemNameMacro>>> GetDriveItemNameMacrosList()
        {
            int digitsCount = 4;
            string numFmt = $"D{digitsCount}";

            var alphabeticalOrderingMacro = this.GetDriveItemNameMacro(
                "@A@", "Alphabetical ordering",
                macro => macro.SrcNameFirstLetterWrappingChar = '@');

            var miscMacros = new List<DriveItemNameMacro>()
            {
                alphabeticalOrderingMacro
            };

            var headingAscMacros = this.GetIndexHeadingAscMacros(digitsCount, numFmt);
            var headingDescMacros = this.GetIndexHeadingDescMacros(digitsCount, numFmt);

            var ascMacros = this.GetIndexAscMacros(digitsCount, numFmt);
            var descMacros = this.GetIndexDescMacros(digitsCount, numFmt);

            var commonConstDirNameMacros = this.GetCommonConstDirNameMacros();
            var atomicConstDirNameMacros = this.GetAtomicConstDirNameMacros();
            var fileNameExtensionMacros = this.GetFileNameExtensionMacros();

            var dictnr = new Dictionary<string, Tuple<string, List<DriveItemNameMacro>>>
            {
                { MacrosH.COMMON_CONST, new Tuple<string, List<DriveItemNameMacro>>("Common const dir name macros", commonConstDirNameMacros) },
                { MacrosH.DESC_IDX, new Tuple<string, List<DriveItemNameMacro>>("Desc Indexing", descMacros) },
                { MacrosH.ASC_IDX, new Tuple<string, List<DriveItemNameMacro>>("Asc Indexing", ascMacros) },
                { MacrosH.H_DESC_IDX, new Tuple<string, List<DriveItemNameMacro>>("Heading Desc Indexing", headingDescMacros) },
                { MacrosH.H_ASC_IDX, new Tuple<string, List<DriveItemNameMacro>>("Heading Asc Indexing", headingAscMacros) },
                { MacrosH.MISC, new Tuple<string, List<DriveItemNameMacro>>("Miscellaneous", miscMacros) },
                { MacrosH.ATOMIC_CONST, new Tuple<string, List<DriveItemNameMacro>>("Atomic const dir name macros", atomicConstDirNameMacros) },
                { MacrosH.EXT, new Tuple<string, List<DriveItemNameMacro>>("File name extensions", fileNameExtensionMacros) }
            };

            return dictnr;
        }

        private DriveItemNameMacro GetDriveItemNameMacro(
            string name,
            string description,
            Action<DriveItemNameMacro> propsFactory)
        {
            var macro = new DriveItemNameMacro
            {
                // MacroUuid = Guid.NewGuid(),
                MacroName = name,
                MacroDescription = description
            };

            propsFactory(macro);
            return macro;
        }

        private DriveItemNameMacro GetDriveItemConstNameMacro(
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

        private List<DriveItemNameMacro> GetIndexHeadingAscMacros(
            int digitsCount,
            string numFmt)
        {
            var headingAscMacros = Enumerable.Range(0, 5).Select(i => this.GetDriveItemNameMacro(
                string.Join("-",
                    (i * 200 + 1).ToString(numFmt),
                    (i * 200 + 99).ToString(numFmt)),
                $"ASC Heading Indexing {i * 200 + 1} - {i * 200 + 99}",
                macro =>
                {
                    macro.MinNumber = 0 * 200 + 1;
                    macro.MaxNumber = 0 * 200 + 99;
                    macro.IncrementNumber = true;
                    macro.DigitsCount = digitsCount;
                })).ToList();

            return headingAscMacros;
        }

        private List<DriveItemNameMacro> GetIndexHeadingDescMacros(
            int digitsCount,
            string numFmt)
        {
            var headingDescMacros = Enumerable.Range(0, 5).Select(i => this.GetDriveItemNameMacro(
                string.Join("-",
                    (i * 200 + 199).ToString(numFmt),
                    (i * 200 + 101).ToString(numFmt)),
                $"DESC Heading Indexing {i * 200 + 199} - {i * 200 + 101}",
                macro =>
                {
                    macro.MinNumber = 0 * 200 + 101;
                    macro.MaxNumber = 0 * 200 + 199;
                    macro.IncrementNumber = false;
                    macro.DigitsCount = digitsCount;
                })).ToList();

            headingDescMacros.Reverse();
            return headingDescMacros;
        }

        private List<DriveItemNameMacro> GetIndexAscMacros(
            int digitsCount,
            string numFmt)
        {
            var ascMacros = Enumerable.Range(0, 5).Select(i => this.GetDriveItemNameMacro(
                string.Join("-",
                    (i * 2000 + 1).ToString(numFmt),
                    (i * 2000 + 999).ToString(numFmt)),
                $"ASC Indexing {i * 2000 + 1} - {i * 2000 + 999}",
                macro =>
                {
                    macro.MinNumber = 0 * 2000 + 1;
                    macro.MaxNumber = 0 * 2000 + 999;
                    macro.IncrementNumber = true;
                    macro.DigitsCount = digitsCount;
                })).ToList();

            return ascMacros;
        }

        private List<DriveItemNameMacro> GetIndexDescMacros(
            int digitsCount,
            string numFmt)
        {
            var descMacros = Enumerable.Range(0, 5).Select(i => this.GetDriveItemNameMacro(
                string.Join("-",
                    (i * 2000 + 1999).ToString(numFmt),
                    (i * 200 + 1001).ToString(numFmt)),
                $"DESC Indexing {i * 2000 + 1999} - {i * 2000 + 1001}",
                macro =>
                {
                    macro.MinNumber = 0 * 2000 + 1001;
                    macro.MaxNumber = 0 * 2000 + 1999;
                    macro.IncrementNumber = false;
                    macro.DigitsCount = digitsCount;
                })).ToList();

            descMacros.Reverse();
            return descMacros;
        }

        private List<DriveItemNameMacro> GetFileNameExtensionMacros()
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

        private List<DriveItemNameMacro> GetCommonConstDirNameMacros()
        {
            var macrosList = new List<DriveItemNameMacro>
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

        private List<DriveItemNameMacro> GetAtomicConstDirNameMacros()
        {
            var macrosList = new List<DriveItemNameMacro>
            {
                this.GetDriveItemConstNameMacro("EntryName", "The drive item name", string.Empty),
                this.GetDriveItemConstNameMacro("SrcName", "The source name", string.Empty),
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
