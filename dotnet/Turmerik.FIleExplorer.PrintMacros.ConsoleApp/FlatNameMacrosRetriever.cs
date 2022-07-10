using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.DriveExplorer;

namespace Turmerik.FIleExplorer.PrintMacros.ConsoleApp
{
    public class FlatNameMacrosRetriever
    {
        public List<DriveItemNameMacroImmtbl> GetFlatNameMacros(IReadOnlyCollection<DriveItemMacroImmtbl> macrosHcy)
        {
            var flatList = new List<DriveItemNameMacroImmtbl>();

            foreach (var macro in macrosHcy)
            {
                this.AddNameMacrosToList(flatList, macro);
            }

            return flatList;
        }

        public List<DriveItemNameMacroImmtbl[]> GetFlatMacros(IReadOnlyCollection<DriveItemMacroImmtbl> macrosHcy)
        {
            var flatList = new List<DriveItemNameMacroImmtbl[]>();

            foreach (var macro in macrosHcy)
            {
                this.AddMacrosToList(flatList, macro);
            }

            return flatList;
        }

        public void WriteFlatNameMacrosToFile(
            IReadOnlyCollection<DriveItemMacroImmtbl> macrosHcy,
            string outputFilePath)
        {
            var flatList = this.GetFlatNameMacros(macrosHcy);

            string[] lines = flatList.Select(macro => JsonConvert.SerializeObject(macro, new JsonSerializerSettings
            {
                Formatting = Formatting.None,
                NullValueHandling = NullValueHandling.Ignore,
            })).ToArray();

            File.WriteAllLines(outputFilePath, lines);
        }
        public void WriteFlatMacrosToFile(
            IReadOnlyCollection<DriveItemMacroImmtbl> macrosHcy,
            string outputFilePath)
        {
            var flatList = this.GetFlatMacros(macrosHcy);

            string[][] textMx = flatList.Select(
                macrosArr => macrosArr.Select(
                    macro => JsonConvert.SerializeObject(macro, new JsonSerializerSettings
                    {
                        Formatting = Formatting.None,
                        NullValueHandling = NullValueHandling.Ignore,
                    })).ToArray()).ToArray();

            string[] textLineGroups = textMx.Select(
                macrosArr => string.Join("\n,", macrosArr)).ToArray();

            textLineGroups = textLineGroups.Select(
                linesGroup => string.Concat("{\n  ", linesGroup, "\n}")).ToArray();

            string text = string.Join(string.Empty, textLineGroups);
            File.WriteAllText(outputFilePath, text);
        }

        private void AddNameMacrosToList(
            List<DriveItemNameMacroImmtbl> flatList,
            DriveItemMacroImmtbl macro)
        {
            if (macro.NameMacro != null)
            {
                flatList.Add(macro.NameMacro);
            }

            if (macro.Children != null)
            {
                foreach (var child in macro.Children)
                {
                    this.AddNameMacrosToList(flatList, child);
                }
            }
        }

        private void AddMacrosToList(
            List<DriveItemNameMacroImmtbl[]> flatList,
            DriveItemMacroImmtbl macro)
        {
            if (macro.MultipleDriveItemOps != null)
            {
                var nameMacrosArr = macro.MultipleDriveItemOps.Select(
                    op => op.NameMacro).ToArray();

                flatList.Add(nameMacrosArr);
            }

            if (macro.Children != null)
            {
                foreach (var child in macro.Children)
                {
                    this.AddMacrosToList(flatList, child);
                }
            }
        }
    }
}
