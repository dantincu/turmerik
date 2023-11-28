using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.WinForms.Controls
{
    public static class ControlsH
    {
        public static void ApplyBgColor(
            this IUISettingsDataCore uISettingsData,
            Control[] controlsArr,
            Color? backColorNllbl = null)
        {
            Color backColor = backColorNllbl ?? uISettingsData.DefaultBackColor;

            foreach (Control control in controlsArr)
            {
                control.BackColor = backColor;
            }
        }
    }
}
