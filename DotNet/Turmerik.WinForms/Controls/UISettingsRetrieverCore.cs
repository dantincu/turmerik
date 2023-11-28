using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Dependencies;
using Turmerik.Core.Helpers;

namespace Turmerik.WinForms.Controls
{
    public class UISettingsRetrieverCore<TClnbl, TImmtbl, TMtbl> : SingletonRegistrarBase<TImmtbl, TMtbl>
        where TClnbl : IUISettingsDataCore
        where TImmtbl : UISettingsDataCoreImmtbl, TClnbl
        where TMtbl : UISettingsDataCoreMtbl, TClnbl
    {
        protected override TImmtbl Convert(
            TMtbl inputData) => inputData.CreateFromSrc<TImmtbl>();
    }
}
