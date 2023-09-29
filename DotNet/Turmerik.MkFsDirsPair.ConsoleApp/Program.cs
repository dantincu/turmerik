using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.MkFsDirsPair.Lib;

namespace Turmerik.MkFsDirsPair.ConsoleApp
{
    internal class Program
    {
        static void Main(string[] args)
        {
            ProgH.Run(args, new DirsPairInfoGenerator());
        }
    }
}
