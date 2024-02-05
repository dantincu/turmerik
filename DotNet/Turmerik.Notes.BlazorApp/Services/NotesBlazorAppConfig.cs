using Turmerik.Notes.Core;

namespace Turmerik.Notes.BlazorApp.Services
{
    public interface INotesBlazorAppConfig : INotesAppConfig
    {
        string JsFilePath { get; }
    }

    public static class NotesBlazorAppConfigH
    {
        public static NotesBlazorAppConfigImmtbl ToImmtbl(
            this INotesBlazorAppConfig src) => new NotesBlazorAppConfigImmtbl(src);

        public static NotesBlazorAppConfigMtbl ToMtbl(
            this INotesBlazorAppConfig src) => new NotesBlazorAppConfigMtbl(src);
    }

    public class NotesBlazorAppConfigMtbl : NotesAppConfigMtbl, INotesBlazorAppConfig
    {
        public NotesBlazorAppConfigMtbl()
        {
        }

        public NotesBlazorAppConfigMtbl(INotesBlazorAppConfig src) : base(src)
        {
            JsFilePath = src.JsFilePath;
        }

        public string JsFilePath { get; set; }
    }

    public class NotesBlazorAppConfigImmtbl : NotesAppConfigImmtbl, INotesBlazorAppConfig
    {
        public NotesBlazorAppConfigImmtbl(INotesBlazorAppConfig src) : base(src)
        {
            JsFilePath = src.JsFilePath;
        }

        public string JsFilePath { get; set; }
    }
}
