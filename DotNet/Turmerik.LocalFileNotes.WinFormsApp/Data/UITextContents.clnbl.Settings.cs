using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.LocalFileNotes.WinFormsApp.Data
{
    public partial class UITextContents
    {
        public interface ISettings
        {
            IResetAppData GetResetAppData();
        }

        public class SettingsImmtbl : ISettings
        {
            public SettingsImmtbl(
                ISettings src)
            {
                ResetAppData = src.GetResetAppData()?.ToImmtbl();
            }

            public ResetAppDataImmtbl ResetAppData { get; }

            public IResetAppData GetResetAppData() => ResetAppData;
        }

        public class SettingsMtbl : ISettings
        {
            public SettingsMtbl()
            {
            }

            public SettingsMtbl(
                ISettings src)
            {
                ResetAppData = src.GetResetAppData()?.ToMtbl();
            }

            public ResetAppDataMtbl ResetAppData { get; set; }

            public IResetAppData GetResetAppData() => ResetAppData;
        }

        public static SettingsImmtbl ToImmtbl(
            this ISettings content) => new SettingsImmtbl(content);

        public static SettingsMtbl ToMtbl(
            this ISettings content) => new SettingsMtbl(content);
    }
}
