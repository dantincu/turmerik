namespace Turmerik.LocalFileNotes.WinFormsApp.Settings
{
    public class AppSettingsDataImmtbl : IAppSettingsData
    {
        public AppSettingsDataImmtbl(
            IAppSettingsData src)
        {
            FetchWebResource = src.GetFetchWebResource()?.ToImmtbl();
            NameToIdnfConverter = src.GetNameToIdnfConverter()?.ToImmtbl();
            PathConverter = src.GetPathConverter()?.ToImmtbl();
            TextToMd = src.GetTextToMd()?.ToImmtbl();
        }

        public AppSettingsData.FetchWebResourceImmtbl FetchWebResource { get; }
        public AppSettingsData.NameToIdnfConverterImmtbl NameToIdnfConverter { get; }
        public AppSettingsData.PathConverterImmtbl PathConverter { get; }
        public AppSettingsData.TextToMdImmtbl TextToMd { get; }

        public AppSettingsData.IFetchWebResource GetFetchWebResource() => FetchWebResource;
        public AppSettingsData.INameToIdnfConverter GetNameToIdnfConverter() => NameToIdnfConverter;
        public AppSettingsData.IPathConverter GetPathConverter() => PathConverter;
        public AppSettingsData.ITextToMd GetTextToMd() => TextToMd;
    }
}
