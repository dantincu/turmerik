using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;
using Turmerik.Core.Threading;

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

        public static IPropChangedEventAdapter<bool, EventArgs> CheckedChanged(
            this IPropChangedEventAdapterFactory factory,
            CheckBox checkBox,
            Action<object, EventArgs, bool> enabledHandler,
            ISynchronizedValueAdapter<bool> synchronizedValueAdapter = null,
            Action<object, EventArgs, bool> disabledHandler = null,
            Action<object, EventArgs, bool, bool> beforeHandler = null,
            Action<object, EventArgs, bool, bool> afterHandler = null,
            bool attachEventHandler = true,
            Action<PropChangedEventAdapterOpts<bool, EventArgs>> optsBuilder = null) => factory.Create(
                new PropChangedEventAdapterOpts<bool, EventArgs>
                {
                    SynchronizedValueAdapter = synchronizedValueAdapter,
                    PropValGetter = () => checkBox.Checked,
                    EnabledHandler = enabledHandler,
                    DisabledHandler = disabledHandler,
                    BeforeHandler = beforeHandler,
                    AfterHandler = afterHandler,
                }.ActWith(optsBuilder)).ActWith(adapter => attachEventHandler.ActIf(
                    () => checkBox.CheckedChanged += (sender, evtArgs) => adapter.FireEventIfRequired(
                        sender, evtArgs)));
    }
}
