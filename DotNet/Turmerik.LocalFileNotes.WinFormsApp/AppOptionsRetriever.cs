using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Dependencies;

namespace Turmerik.LocalFileNotes.WinFormsApp
{
    public class AppOptionsRetriever : SingletonRegistrarBase<AppOptionsImmtbl, AppOptionsMtbl>
    {
        protected override AppOptionsImmtbl Convert(
            AppOptionsMtbl inputData) => new AppOptionsImmtbl(inputData);
    }
}
