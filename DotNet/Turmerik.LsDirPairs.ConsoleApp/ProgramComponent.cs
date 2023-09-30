using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Helpers;
using Turmerik.MkFsDirsPair.Lib;
using Turmerik.Text;

namespace Turmerik.LsDirPairs.ConsoleApp
{
    public class ProgramComponent
    {
        private readonly IServiceProvider svcProv;
        private readonly IJsonConversion jsonConversion;

        private readonly AppSettings appSettings;
        private readonly AppSettings.TrmrkT trmrk;

        public ProgramComponent()
        {
            svcProv = ServiceProviderContainer.Instance.Value.Data;
            jsonConversion = svcProv.GetRequiredService<IJsonConversion>();

            appSettings = jsonConversion.LoadConfig<AppSettings>();
            trmrk = appSettings.Trmrk;
        }

        public void Run(string[] args)
        {
            var wka = GetWorkArgs(args);



        }

        private WorkArgs GetWorkArgs(
            string[] args)
        {
            var workDir = Environment.CurrentDirectory;

            var dirsArr = Directory.GetDirectories(workDir).Select(
                dir => Path.GetFileName(dir)).ToArray();

            var wka = new WorkArgs
            {
                WorkDir = workDir,
                ExistingDirsArr = dirsArr
            };

            return wka;
        }

        private class WorkArgs
        {
            public string WorkDir { get; set; }
            public string[] ExistingDirsArr { get; set; }
            public Tuple<string, string>[][] DirPairs { get; set; }
        }
    }
}
