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
        public List<DriveItemNameMacroImmtbl> GetFlatMacros(IReadOnlyCollection<DriveItemMacroImmtbl> macrosHcy)
        {
            var flatList = new List<DriveItemNameMacroImmtbl>();

            foreach (var macro in macrosHcy)
            {
                this.AddMacrosToList(flatList, macro);
            }

            return flatList;
        }

        private void AddMacrosToList(
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
                    this.AddMacrosToList(flatList, child);
                }
            }
        }
    }
}
