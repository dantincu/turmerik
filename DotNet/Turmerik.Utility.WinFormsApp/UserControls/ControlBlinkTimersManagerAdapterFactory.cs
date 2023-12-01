using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Utility.WinFormsApp.Settings.UI;
using Turmerik.WinForms.Controls;

namespace Turmerik.Utility.WinFormsApp.UserControls
{
    public class ControlBlinkTimersManagerAdapterFactory
    {
        private IControlBlinkTimersManager timersManager;
        private IUISettingsRetriever uISettings;
        private IUIThemeRetriever uITheme;

        public ControlBlinkTimersManagerAdapterFactory(
            IControlBlinkTimersManager timersManager,
            IUISettingsRetriever uISettings,
            IUIThemeRetriever uITheme)
        {
            this.timersManager = timersManager ?? throw new ArgumentNullException(nameof(timersManager));
            this.uISettings = uISettings ?? throw new ArgumentNullException(nameof(uISettings));
            this.uITheme = uITheme ?? throw new ArgumentNullException(nameof(uITheme));
        }

        public ControlBlinkTimersManagerAdapter Create(
            ControlBlinkTimersManagerAdapterOpts opts) => new ControlBlinkTimersManagerAdapter(
                timersManager,
                uISettings,
                uITheme,
                opts);
    }
}
