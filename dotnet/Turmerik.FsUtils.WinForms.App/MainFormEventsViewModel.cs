using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.FsUtils.WinForms.App
{
    public class MainFormEventsViewModel
    {
        private Action<IUILogMessage> uILogMessageAdded;
        private Action<string> statusStripTextChanged;


        public event Action<IUILogMessage> UILogMessageAdded
        {
            add
            {
                uILogMessageAdded += value;
            }

            remove
            {
                uILogMessageAdded -= value;
            }
        }

        public event Action<string> StatusStripTextChanged
        {
            add
            {
                statusStripTextChanged += value;
            }

            remove
            {
                statusStripTextChanged -= value;
            }
        }

        public void AddUILogMessage(IUILogMessage uILogMessage)
        {
            uILogMessageAdded?.Invoke(uILogMessage);
        }

        public void UpdateStatusStripText(string text)
        {
            statusStripTextChanged?.Invoke(text);
        }
    }
}
