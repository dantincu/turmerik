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

        private static readonly ReadOnlyDictionary<string, string> extensionsDictnr = new Dictionary<string, string>
        {
            { "jpg", ".jpg image files" },
            { "pdf", ".images groupped into .pdf files" },
            { "docx", ".images groupped into .docx files" }
        }.RdnlD();

        private static readonly ReadOnlyDictionary<string, string> eSignedExtensionsDictnr = new Dictionary<string, string>
        {
            { "jpg", ".jpg image files" },
        }.RdnlD();

        private readonly ReadOnlyCollection<DriveItemMacroImmtbl> driveItemNameMacros;

        public DriveItemNameMacrosService()
        {
            this.driveItemNameMacros = this.GetDriveItemNameMacrosCore().Select(
                item => new DriveItemMacroImmtbl(item)).RdnlC();
        }

        public ReadOnlyCollection<DriveItemMacroImmtbl> GetDriveItemNameMacros() => this.driveItemNameMacros;

        private static string GetNumberFormat(int digitsCount) => $"D{digitsCount}";

        private static string JoinNameParts(string joinStr, string startStr, string endStr, params string[] nameParts)
        {
            nameParts = nameParts.SkipWhile(str => string.IsNullOrWhiteSpace(str)).ToArray();
            string retStr = string.Join(joinStr, nameParts);

            retStr = string.Concat(startStr, retStr, endStr);
            return retStr;
        }

        private List<DriveItemMacroMtbl> GetDriveItemNameMacrosCore()
        {
            var alphabeticalOrderingMacro = this.GetDriveItemNameMacro(
                "@A@", "Alphabetical ordering",
                macro => macro.SrcNameFirstLetterWrappingChar = '@');

            var entryNameMacro = this.GetDriveItemNameMacro(MacrosH.ENTRY_NAME, "The drive entry name", item => item.EntryName = string.Empty);
            var srcNameMacro = this.GetDriveItemNameMacro(MacrosH.SRC_NAME, "The drive entry source name", item => item.SrcName = string.Empty);

            var miscMacros = new List<DriveItemNameMacroMtbl>()
            {
                entryNameMacro,
                alphabeticalOrderingMacro,
                srcNameMacro
            };

            var headingAscMacros = this.GetIndexHeadingAscMacros();
            var headingDescMacros = this.GetIndexHeadingDescMacros();
            var ascMacros = this.GetIndexAscMacros();
            var descMacros = this.GetIndexDescMacros();

            var defaultDescMacro = descMacros.Skip(1).First();
            var pinnedMacros = miscMacros.ToList();

            pinnedMacros.Insert(0, defaultDescMacro);

            var constDirNameMacros = this.GetConstDirMacros();
            var atomicConstDirNameMacros = this.GetAtomicConstDirNameMacros();
            var fileNameExtensionMacros = this.GetFileNameExtensionMacros();

            var retList = new List<DriveItemMacroMtbl>
            {
                this.GetDriveItemMacroMtbl(MacrosH.PINNED, "Pinned", pinnedMacros),
                this.GetDriveItemMacroMtbl(MacrosH.CONST, "Const dir name macros", null, constDirNameMacros),
                this.GetDriveItemMacroMtbl(MacrosH.DESC_IDX, "Desc Indexing", descMacros),
                this.GetDriveItemMacroMtbl(MacrosH.ASC_IDX, "Asc Indexing", ascMacros),
                this.GetDriveItemMacroMtbl(MacrosH.H_DESC_IDX, "Heading Desc Indexing", headingDescMacros),
                this.GetDriveItemMacroMtbl(MacrosH.H_ASC_IDX, "Heading Asc Indexing", headingAscMacros),
                this.GetDriveItemMacroMtbl(MacrosH.MISC, "Heading Asc Indexing", miscMacros),
                this.GetDriveItemMacroMtbl(MacrosH.ATOMIC_CONST, "Atomic const dir name macros", atomicConstDirNameMacros),
                this.GetDriveItemMacroMtbl(MacrosH.EXT, "File name extensions", fileNameExtensionMacros)
            };

            return retList;
        }

        private DriveItemMacroMtbl GetDriveItemMacroMtbl(
            string key, string name,
            List<DriveItemNameMacroMtbl> nameMacrosList,
            List<DriveItemMacroMtbl> childrenList = null)
        {
            var retMacro = new DriveItemMacroMtbl
            {
                Key = key,
                Name = name,
                Children = childrenList ?? nameMacrosList.Select(
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

        private DriveItemMacroMtbl GetDriveItemConstMacro(
            string name, Action<DriveItemMacroMtbl> callback, string key = null)
        {
            var mtbl = new DriveItemMacroMtbl
            {
                Key = key ?? name,
                Name = name,
                Children = new List<DriveItemMacroMtbl>()
            };

            callback(mtbl);
            return mtbl;
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
                    if (!string.IsNullOrEmpty(constDirName))
                    {
                        macro.ConstName = constDirName;
                    }
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

        private List<DriveItemMacroMtbl> GetConstDirMacros()
        {
            var macrosList = new List<DriveItemMacroMtbl>()
            {
                this.GetDriveItemConstMacro(ConstMacrosH.E_DOCS, mtbl =>
                {
                    this.AddDocConstDirMacros(mtbl, null, null, true);
                }),
                this.GetDriveItemConstMacro(ConstMacrosH.PhotoImgs, mtbl =>
                {
                    this.AddImgsConstDirMacros(mtbl, "Photo", null, true);
                }),
                this.GetDriveItemConstMacro(ConstMacrosH.InfoPhotoImgs, mtbl =>
                {
                    this.AddImgsConstDirMacros(mtbl, "Info Photo", null, true);
                }),
                this.GetDriveItemConstMacro(ConstMacrosH.DocScanImgs, mtbl =>
                {
                    this.AddImgsConstDirMacros(mtbl, "Doc Scan", null, true, true);
                }),
                this.GetDriveItemConstMacro(ConstMacrosH.DocRdblPhotoImgs, mtbl =>
                {
                    this.AddImgsConstDirMacros(mtbl, "Doc Readable Photo", null, true);
                }),
                this.GetDriveItemConstMacro(ConstMacrosH.PrintScreenImgs, mtbl =>
                {
                    this.AddImgsConstDirMacros(mtbl, "Print Screen", null, true);
                }),
                this.GetDriveItemConstMacro(ConstMacrosH.SnipSketchImgs, mtbl =>
                {
                    this.AddImgsConstDirMacros(mtbl, "Snip & Sketch", null, true);
                }),
                this.GetDriveItemConstMacro(ConstMacrosH.ScreenSnipSketchImgs, mtbl =>
                {
                    this.AddImgsConstDirMacros(mtbl, "Screen Snip & Sketch", null, true);
                }),
            };

            return macrosList;
        }

        private void AddDocConstDirMacros(
            DriveItemMacroMtbl parent,
            string descriptionPrefix = null,
            string addExtn = null,
            bool parentIsRoot = false)
        {
            parent.Children.Add(new DriveItemMacroMtbl
            {
                NameMacro = this.GetDriveItemConstNameMacro(
                    JoinNameParts("-", "#", $".pdf{addExtn}#", parent.Name),
                    JoinNameParts(" ", null, null, descriptionPrefix, $".pdf files"))
            });

            parent.Children.Add(new DriveItemMacroMtbl
            {
                NameMacro = this.GetDriveItemConstNameMacro(
                    JoinNameParts("-", "#", $".docx{addExtn}#", parent.Name),
                    JoinNameParts(" ", null, null, descriptionPrefix, $".docx files"))
            });

            parent.Children.Add(new DriveItemMacroMtbl
            {
                NameMacro = this.GetDriveItemConstNameMacro(
                    JoinNameParts("-", "#", $".pdf{addExtn}#{ConstMacrosH.GNRTD}#", parent.Name),
                    JoinNameParts(" ", null, null, descriptionPrefix, $".pdf files generated by a software tool"))
            });

            parent.Children.Add(new DriveItemMacroMtbl
            {
                NameMacro = this.GetDriveItemConstNameMacro(
                    JoinNameParts("-", "#", $".docx{addExtn}#{ConstMacrosH.WrttnByMe}#", parent.Name),
                    JoinNameParts(" ", null, null, descriptionPrefix, $".docx files written by me"))
            });

            parent.Children.Add(new DriveItemMacroMtbl
            {
                NameMacro = this.GetDriveItemConstNameMacro(
                    JoinNameParts("-", "#", $".pdf{addExtn}#{ConstMacrosH.GNRTD}#{ConstMacrosH.WrttnByMe}#", parent.Name),
                    JoinNameParts(" ", null, null, descriptionPrefix, $".pdf files generated by a software tool from docs written by me"))
            });

            parent.Children.Add(new DriveItemMacroMtbl
            {
                NameMacro = this.GetDriveItemConstNameMacro(
                    JoinNameParts("-", "#", $".pdf{addExtn}#{ConstMacrosH.ElecSgndByMe}#", parent.Name),
                    JoinNameParts(" ", null, null, descriptionPrefix, $".pdf files electronically signed by me"))
            });

            parent.Children.Add(new DriveItemMacroMtbl
            {
                NameMacro = this.GetDriveItemConstNameMacro(
                    JoinNameParts("-", "#", $".pdf{addExtn}#{ConstMacrosH.ElecSgnd}#", parent.Name),
                    JoinNameParts(" ", null, null, descriptionPrefix, $".pdf files electronically signed"))
            });

            if (parentIsRoot)
            {
                var dwnlddChild = this.GetDriveItemConstMacro(
                    string.Join("-", ConstMacrosH.DWNLDD, parent.Name), mtbl =>
                    {
                        this.AddDocConstDirMacros(mtbl, "Downloaded");
                    });

                var uplddChild = this.GetDriveItemConstMacro(
                    string.Join("-", ConstMacrosH.UPLDD, parent.Name), mtbl =>
                    {
                        this.AddDocConstDirMacros(mtbl, "Uploaded");
                    });

                var zippedUplddChild = this.GetDriveItemConstMacro(
                    string.Join("-", ConstMacrosH.UPLDD, parent.Name), mtbl =>
                    {
                        this.AddDocConstDirMacros(mtbl, "Zipped Uploaded", ".zip");
                    });

                var dwnlddZippedChild = this.GetDriveItemConstMacro(
                    string.Join("-", ConstMacrosH.DWNLDD, parent.Name), mtbl =>
                    {
                        this.AddDocConstDirMacros(mtbl, "Downloaded Zipped", ".zip");
                    });

                parent.Children.AddRange(
                    dwnlddChild,
                    uplddChild,
                    zippedUplddChild,
                    dwnlddZippedChild);
            }
        }

        private void AddImgsConstDirMacros(
            DriveItemMacroMtbl parent,
            string descriptionPrefix = null,
            string addExtn = null,
            bool parentIsRoot = false,
            bool isDocScan = false)
        {
            foreach (var kvp in extensionsDictnr)
            {
                parent.Children.Add(new DriveItemMacroMtbl
                {
                    NameMacro = this.GetDriveItemConstNameMacro(
                        JoinNameParts("-", "#", $".{kvp.Key}{addExtn}#", parent.Name),
                        JoinNameParts(" ", null, null, descriptionPrefix, kvp.Value))
                });

                if (isDocScan)
                {
                    parent.Children.Add(new DriveItemMacroMtbl
                    {
                        NameMacro = this.GetDriveItemConstNameMacro(
                        JoinNameParts("-", "#", $".{kvp.Key}#{ConstMacrosH.MnllSgndByMe}#{addExtn}#", parent.Name),
                        JoinNameParts(" ", null, null, $"Manually signed by me {descriptionPrefix}", kvp.Value))
                    });

                    if (kvp.Key == "pdf")
                    {
                        parent.Children.Add(new DriveItemMacroMtbl
                        {
                            NameMacro = this.GetDriveItemConstNameMacro(
                                JoinNameParts("-", "#", $".{kvp.Key}#{ConstMacrosH.ElecSgndByMe}#{addExtn}#", parent.Name),
                                JoinNameParts(" ", null, null, $"Electronically signed by me {descriptionPrefix}", kvp.Value))
                        });

                        parent.Children.Add(new DriveItemMacroMtbl
                        {
                            NameMacro = this.GetDriveItemConstNameMacro(
                                JoinNameParts("-", "#", $".{kvp.Key}#{ConstMacrosH.ElecSgnd}#{addExtn}#", parent.Name),
                                JoinNameParts(" ", null, null, $"Electronically signed {descriptionPrefix}", kvp.Value))
                        });
                    }
                }
            }

            if (parentIsRoot)
            {
                var dwnlddChild = this.GetDriveItemConstMacro(
                    string.Join("-", ConstMacrosH.DWNLDD, parent.Name), mtbl =>
                    {
                        this.AddImgsConstDirMacros(mtbl, $"Downloaded {descriptionPrefix}", null, false, isDocScan);
                    });

                var uplddChild = this.GetDriveItemConstMacro(
                    string.Join("-", ConstMacrosH.UPLDD, parent.Name), mtbl =>
                    {
                        this.AddImgsConstDirMacros(mtbl, $"Uploaded {descriptionPrefix}", null, false, isDocScan);
                    });

                var zippedUplddChild = this.GetDriveItemConstMacro(
                    string.Join("-", ConstMacrosH.UPLDD, parent.Name), mtbl =>
                    {
                        this.AddImgsConstDirMacros(mtbl, $"Zipped Uploaded {descriptionPrefix}", ".zip", false, isDocScan);
                    });

                var dwnlddZippedChild = this.GetDriveItemConstMacro(
                    string.Join("-", ConstMacrosH.UPLDD, parent.Name), mtbl =>
                    {
                        this.AddImgsConstDirMacros(mtbl, $"Downloaded Zipped {descriptionPrefix}", ".zip", false, isDocScan);
                    });

                parent.Children.AddRange(
                    dwnlddChild,
                    uplddChild,
                    zippedUplddChild,
                    dwnlddZippedChild);
            }
        }

        private List<DriveItemNameMacroMtbl> GetAtomicConstDirNameMacros()
        {
            var macrosList = new List<DriveItemNameMacroMtbl>
            {
                this.GetDriveItemConstNameMacro("a-z", "Alphabetical ordering dir name"),
                this.GetDriveItemConstNameMacro(ConstMacrosH.IMGS, "Image files"),
                this.GetDriveItemConstNameMacro(ConstMacrosH.PHOTO, "Photos"),
                this.GetDriveItemConstNameMacro(ConstMacrosH.DOC, "Document"),
                this.GetDriveItemConstNameMacro(ConstMacrosH.E_DOCS, "Electronic document"),
                this.GetDriveItemConstNameMacro(ConstMacrosH.SCAN, "Scanned"),
                this.GetDriveItemConstNameMacro(ConstMacrosH.PRINT, "Print"),
                this.GetDriveItemConstNameMacro(ConstMacrosH.PRINT, "Screen"),
                this.GetDriveItemConstNameMacro(ConstMacrosH.SNIP, "Snip"),
                this.GetDriveItemConstNameMacro(ConstMacrosH.SKETCH, "Sketch"),
                this.GetDriveItemConstNameMacro(ConstMacrosH.DWNLDD, "Downloaded"),
                this.GetDriveItemConstNameMacro(ConstMacrosH.UPLDD, "Uploaded"),
                this.GetDriveItemConstNameMacro(ConstMacrosH.SGND, "Signed"),
                this.GetDriveItemConstNameMacro(ConstMacrosH.WRTTN, "Written"),
                this.GetDriveItemConstNameMacro(ConstMacrosH.BY, "By"),
                this.GetDriveItemConstNameMacro(ConstMacrosH.ME, "Me"),
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
