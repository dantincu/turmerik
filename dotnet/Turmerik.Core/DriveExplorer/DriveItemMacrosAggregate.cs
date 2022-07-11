using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;

namespace Turmerik.Core.DriveExplorer
{
    public class DriveItemMacrosAggregate
    {
        public DriveItemMacrosAggregate(
            ReadOnlyCollection<DriveItemMacroImmtbl> macros,
            ReadOnlyCollection<DriveItemMacroImmtbl> nameMacros)
        {
            Macros = macros ?? throw new ArgumentNullException(nameof(macros));
            NameMacros = nameMacros ?? throw new ArgumentNullException(nameof(nameMacros));
        }

        public ReadOnlyCollection<DriveItemMacroImmtbl> Macros { get; }
        public ReadOnlyCollection<DriveItemMacroImmtbl> NameMacros { get; }
    }
}
