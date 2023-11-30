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
            this IUIThemeDataCore uISettingsData,
            Control[] controlsArr,
            Color? backColorNllbl = null)
        {
            Color backColor = backColorNllbl ?? uISettingsData.DefaultBackColor;

            foreach (Control control in controlsArr)
            {
                control.BackColor = backColor;
            }
        }

        public static bool ToggleEnabled(
            this Control control)
        {
            bool enabled = !control.Enabled;
            control.Enabled = enabled;

            return enabled;
        }

        public static bool ToggleChecked(
            this CheckBox checkBox)
        {
            bool @checked = !checkBox.Checked;
            checkBox.Checked = @checked;

            return @checked;
        }

        public static bool ToggleReadOnly(
            this TextBoxBase textBox)
        {
            bool readOnly = !textBox.ReadOnly;
            textBox.ReadOnly = readOnly;

            return readOnly;
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

        public static Keys ControlKeys(this KeyEventArgs e)
        {
            Keys retVal = default;

            if (e.Control)
            {
                retVal |= Keys.Control;
            }

            if (e.Alt)
            {
                retVal |= Keys.Alt;
            }

            if (e.Shift)
            {
                retVal |= Keys.Shift;
            }

            return retVal;
        }

        public static Keys KeyboardKey(
            this KeyEventArgs e,
            Keys keyboardKey)
        {
            var controlKeys = e.ControlKeys();
            var retVal = controlKeys | keyboardKey;

            return retVal;
        }

        public static bool IsKeyboardKey(
            this KeyEventArgs e,
            Keys keyboardKey,
            char? keyboardChar = null)
        {
            var refValue = e.KeyboardKey(
                keyboardKey);

            bool retVal = refValue == keyboardKey;

            if (keyboardChar.HasValue)
            {
                retVal = retVal && keyboardChar == e.KeyValue;
            }

            return retVal;
        }
    }
}
