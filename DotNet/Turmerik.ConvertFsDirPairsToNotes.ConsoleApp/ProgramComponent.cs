using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.DriveExplorer;
using Turmerik.Text;
using Turmerik.Helpers;

namespace Turmerik.ConvertFsDirPairsToNotes.ConsoleApp
{
    public class ProgramComponent
    {
        private static readonly string NL = Environment.NewLine;

        private readonly IJsonConversion jsonConversion;
        private readonly INoteDirPairsRetriever noteDirPairsRetriever;

        private readonly AppSettings appSettings;
        private readonly NoteDirsPairSettings trmrk;

        private readonly string noteItemsPfx;
        private readonly string joinStr;

        public ProgramComponent(
            IJsonConversion jsonConversion,
            INoteDirsPairGeneratorFactory noteDirsPairGeneratorFactory)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            appSettings = jsonConversion.LoadConfig<AppSettings>();
            trmrk = appSettings.TrmrkDirPairs;

            this.noteDirPairsRetriever = noteDirsPairGeneratorFactory.PairsRetriever(
                trmrk.DirNames);

            noteItemsPfx = trmrk.DirNames.NoteItemsPfx;
            joinStr = trmrk.DirNames.JoinStr;
        }

        public void Run(string[] args)
        {
            string workDir = Environment.CurrentDirectory;
            string srcDirPath = PathH.AssurePathRooted(args[0], workDir);
            string destnDirPath = PathH.AssurePathRooted(args[1], workDir);
        }
    }
}
