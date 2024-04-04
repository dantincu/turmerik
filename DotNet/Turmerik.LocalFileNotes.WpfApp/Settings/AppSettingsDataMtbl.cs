namespace Turmerik.LocalFileNotes.WpfApp.Settings
{
    public class AppSettingsDataMtbl : IAppSettingsData
    {
        public AppSettingsDataMtbl()
        {
        }

        public AppSettingsDataMtbl(
            IAppSettingsData src)
        {
            FetchWebResource = src.GetFetchWebResource()?.ToMtbl();
            NameToIdnfConverter = src.GetNameToIdnfConverter()?.ToMtbl();
            PathConverter = src.GetPathConverter()?.ToMtbl();
            TextToMd = src.GetTextToMd()?.ToMtbl();
        }

        public AppSettingsData.FetchWebResourceMtbl FetchWebResource { get; set; }
        public AppSettingsData.NameToIdnfConverterMtbl NameToIdnfConverter { get; set; }
        public AppSettingsData.PathConverterMtbl PathConverter { get; set; }
        public AppSettingsData.TextToMdMtbl TextToMd { get; set; }

        public AppSettingsData.IFetchWebResource GetFetchWebResource() => FetchWebResource;
        public AppSettingsData.INameToIdnfConverter GetNameToIdnfConverter() => NameToIdnfConverter;
        public AppSettingsData.IPathConverter GetPathConverter() => PathConverter;
        public AppSettingsData.ITextToMd GetTextToMd() => TextToMd;
    }
}
