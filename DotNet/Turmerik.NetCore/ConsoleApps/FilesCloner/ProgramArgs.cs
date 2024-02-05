namespace Turmerik.NetCore.ConsoleApps.FilesCloner
{
    public class ProgramArgs
    {
        public ProgramConfig Config { get; set; }
        public string WorkDir { get; set; }
        public ProgramConfig.Profile Profile { get; set; }
        public FileCloneArgs SingleFileArgs { get; set; }
    }
}
