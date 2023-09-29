using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Helpers;

namespace Turmerik.MkFsDirsPair.Lib
{
    public static class ProgH
    {
        public static void Run(
            string[] args,
            IDirsPairInfoGenerator generator) => ProgramH.Run(
                () => new ProgramComponent(generator).Run(args));
    }
}
