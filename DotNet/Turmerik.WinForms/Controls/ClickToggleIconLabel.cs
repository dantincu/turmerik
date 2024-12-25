using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.WinForms.Controls
{
    public class ClickToggleIconLabel : IconLabel
    {
        private bool toggledValue;
        private string toggledFalseText;
        private string toggledTrueText;

        private Action<bool> clickToggled;

        public ClickToggleIconLabel()
        {
            Click += ClickToggleIconLabel_Click;
        }

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public bool ToggledValue
        {
            get => toggledValue;

            set
            {
                bool updateText = toggledValue != value;
                toggledValue = value;

                if (updateText)
                {
                    UpdateText(value);
                }
            }
        }

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public string ToggledFalseText
        {
            get => toggledFalseText;

            set
            {
                bool updateText = toggledFalseText != value && !toggledValue;
                toggledFalseText = value;

                if (updateText)
                {
                    UpdateText(toggledValue);
                }
            }
        }

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public string ToggledTrueText
        {
            get => toggledTrueText;

            set
            {
                bool updateText = toggledTrueText != value && toggledValue;
                toggledTrueText = value;

                if (updateText)
                {
                    UpdateText(toggledValue);
                }
            }
        }

        public event Action<bool> ClickToggled
        {
            add => clickToggled += value;
            remove => clickToggled -= value;
        }

        public void SetToggleText(
            string toggledFalseText,
            string toggledTrueText)
        {
            ToggledFalseText = toggledFalseText;
            ToggledTrueText = toggledTrueText;
        }

        private void UpdateText(bool toggledValue)
        {
            Text = toggledValue ? toggledTrueText : toggledFalseText;
        }

        private void ClickToggleIconLabel_Click(object sender, EventArgs e)
        {
            bool toggledValue = !this.toggledValue;
            this.ToggledValue = toggledValue;

            clickToggled?.Invoke(toggledValue);
        }
    }
}
