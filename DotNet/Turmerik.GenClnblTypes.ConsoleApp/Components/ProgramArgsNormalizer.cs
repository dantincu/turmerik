using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Cloneables;

namespace Turmerik.GenClnblTypes.ConsoleApp.Components
{
    public class ProgramArgsNormalizer
    {
        public void NormalizeArgs(
            ProgramArgs args)
        {
            args.BaseName ??= nameof(Clnbl);
        }
    }
}
