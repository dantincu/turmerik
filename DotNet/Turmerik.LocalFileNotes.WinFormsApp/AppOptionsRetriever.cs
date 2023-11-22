using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Dependencies;

namespace Turmerik.LocalFileNotes.WinFormsApp
{
    public class AppOptionsRetriever : SingletonRegistrarBase<AppOptionsImmtbl, AppOptionsImmtbl>
    {
        protected override AppOptionsImmtbl Convert(
            AppOptionsImmtbl inputData) => inputData;
    }
}
