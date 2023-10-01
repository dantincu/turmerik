using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.DriveExplorer;
using Turmerik.MkFsDirsPair.Lib;

namespace Turmerik.MkFsDirsPair.ConsoleApp
{
    internal class Program
    {
        static void Main(string[] args)
        {
            var svcProv = ServiceProviderContainer.Instance.Value.RegisterData(new ServiceCollection());

            ProgH.Run(args, new DirsPairInfoGenerator(
                svcProv.GetRequiredService<INoteDirsPairFullNamePartRetriever>()));
        }
    }
}
