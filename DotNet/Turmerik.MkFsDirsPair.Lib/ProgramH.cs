using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.MkFsDirsPair.ConsoleApp;

namespace Turmerik.MkFsDirsPair.Lib
{
    public static class ProgramH
    {
        public static void Run(
            string[] args,
            IDirsPairInfoGenerator generator)
        {
            try
            {
                new ProgramComponent(generator).Run(args);
            }
            catch (Exception ex)
            {
                Console.Error.WithExcp(ex);
            }
        }
    }
}
