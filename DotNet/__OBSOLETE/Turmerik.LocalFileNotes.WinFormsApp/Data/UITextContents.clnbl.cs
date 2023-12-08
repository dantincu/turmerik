using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Turmerik.LocalFileNotes.WinFormsApp.Data.UITextContents;

namespace Turmerik.LocalFileNotes.WinFormsApp.Data
{
    public interface IUITextContents
    {
        ISettings GetSettings();
    }

    public class UITextContentsImmtbl : IUITextContents
    {
        public UITextContentsImmtbl(
            IUITextContents src)
        {
            Settings = src.GetSettings()?.ToImmtbl();
        }

        public SettingsImmtbl Settings { get; }

        public ISettings GetSettings() => Settings;
    }

    public class UITextContentsMtbl : IUITextContents
    {
        public UITextContentsMtbl()
        {
        }

        public UITextContentsMtbl(
            IUITextContents src)
        {
            Settings = src.GetSettings()?.ToMtbl();
        }

        public SettingsMtbl Settings { get; set; }

        public ISettings GetSettings() => Settings;
    }

    public static partial class UITextContents
    {
        public static UITextContentsImmtbl ToImmtbl(
            this IUITextContents content) => new UITextContentsImmtbl(content);

        public static UITextContentsMtbl ToMtbl(
            this IUITextContents content) => new UITextContentsMtbl(content);
    }
}
