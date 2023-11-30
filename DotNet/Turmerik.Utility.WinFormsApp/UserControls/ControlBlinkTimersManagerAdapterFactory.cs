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
        private UISettingsRetriever uISettings;

        public ControlBlinkTimersManagerAdapterFactory(
            IControlBlinkTimersManager timersManager,
            UISettingsRetriever uISettings)
        {
            this.timersManager = timersManager ?? throw new ArgumentNullException(nameof(timersManager));
            this.uISettings = uISettings ?? throw new ArgumentNullException(nameof(uISettings));
        }

        public ControlBlinkTimersManagerAdapter Create(
            ControlBlinkTimersManagerAdapterOpts opts) => new ControlBlinkTimersManagerAdapter(
                timersManager,
                uISettings,
                opts);
    }
}
