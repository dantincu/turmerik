namespace Turmerik.NetCore.ConsoleApps.FilesCloner
{
    public class FileCloneArgs
    {
        public string WorkDir { get; set; }
        public string InputText { get; set; }
        public FileArgs File { get; set; }
        public bool CloneInputFile { get; set; }
    }
}
