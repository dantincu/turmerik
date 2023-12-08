using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace TrmrkMkFsDirsPair
{
    internal class ProgramConfigRetriever
    {
        const string CONFIG_FILE_NAME = "trmrk-config.xml";
        const string KEEP = ".keep";
        const string NOTE = "[note]";
        const string NOTE_FILES = "[note-files]";
        const string JOIN_STR = "-";
        const string OPEN_MD_FILE = ":o";
        const int MAX_DIR_NAME_LEN = 100;

        private readonly XmlSerializer serializer;

        private ProgramConfigRetriever()
        {
            serializer = new XmlSerializer(typeof(ProgramConfig));
            Config = GetConfig();
        }

        public static Lazy<ProgramConfigRetriever> Instance { get; } = new Lazy<ProgramConfigRetriever>(
            () => new ProgramConfigRetriever());

        public static string ConfigFilePath { get; } = Path.Combine(
            UtilsH.ExecutingAssemmblyPath, CONFIG_FILE_NAME);

        public ProgramConfig Config { get; }

        public void DumpConfig(
            ProgramConfig config = null)
        {
            config ??= Config;
            string dumpConfigFileName = GetDumpConfigFileName();

            if (File.Exists(dumpConfigFileName))
            {
                throw new InvalidOperationException(
                    $"File with name {dumpConfigFileName} already exists");
            }

            using (var writer = new StreamWriter(dumpConfigFileName))
            {
                serializer.Serialize(writer, config);
            }
        }

        private ProgramConfig GetConfig()
        {
            ProgramConfig programConfig;

            if (File.Exists(ConfigFilePath))
            {
                programConfig = GetConfigCore();
            }
            else
            {
                programConfig = new ProgramConfig();
            }

            NormalizeConfig(programConfig);
            return programConfig;
        }

        private void NormalizeConfig(
            ProgramConfig config)
        {
            config.KeepFileName ??= KEEP;
            config.NoteFileName ??= NOTE;
            config.NoteFilesFullDirNamePart ??= NOTE_FILES;
            config.FullDirNameJoinStr ??= JOIN_STR;
            config.OpenMdFileCmdArgName ??= OPEN_MD_FILE;
            config.MaxDirNameLength = config.MaxDirNameLength.Nullify() ?? MAX_DIR_NAME_LEN;
        }

        private ProgramConfig GetConfigCore()
        {
            ProgramConfig programConfig = null;

            using (var reader = new StreamReader(ConfigFilePath))
            {
                programConfig = serializer.Deserialize(reader) as ProgramConfig;
            }

            return programConfig;
        }

        private string GetDumpConfigFileName()
        {
            var now = DateTime.UtcNow;
            string tmStmp = now.ToString("yyyy-MM-dd_HH-mm-ss.FFFFFFFK");

            string dumpConfigFileName = Path.GetFileNameWithoutExtension(CONFIG_FILE_NAME);
            string dumpConfigFileExtn = Path.GetExtension(CONFIG_FILE_NAME);

            dumpConfigFileName = $"{dumpConfigFileName}-{tmStmp}{dumpConfigFileExtn}";

            Console.WriteLine($"Dumped configuration to file {dumpConfigFileName}");
            return dumpConfigFileName;
        }
    }
}
