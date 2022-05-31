using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Components;

namespace Turmerik.FsUtils.WinForms.App
{
    public class MainFormEventsViewModel
    {
        private readonly ITimeStampHelper timeStampHelper;

        private Action<IUILogMessage, bool> uILogMessageAdded;
        private Action<string> statusStripTextChanged;

        public MainFormEventsViewModel(
            ITimeStampHelper timeStampHelper)
        {
            this.timeStampHelper = timeStampHelper ?? throw new ArgumentNullException(nameof(timeStampHelper));
        }

        public event Action<IUILogMessage, bool> UILogMessageAdded
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

        public void AddUILogMessage(
            IUILogMessage uILogMessage,
            bool showMessageBox = false)
        {
            uILogMessageAdded?.Invoke(uILogMessage, showMessageBox);
        }

        public void AddUILogMessage(
            UILogMessageLevel level,
            string message,
            Exception exc = null,
            DateTime? dateTime = null,
            bool showMessageBox = false)
        {
            var timeStamp = dateTime ?? DateTime.Now;

            var uiLogMessage = new UILogMessageMtbl
            {
                Uuid = Guid.NewGuid(),
                Level = level,
                Message = message,
                Exception = exc,
                TimeStamp = timeStamp,
                TimeStampStr = timeStampHelper.TmStmp(
                    timeStamp, true,
                    TimeStamp.Seconds)
            };

            AddUILogMessage(uiLogMessage, showMessageBox);
        }

        public void AddUILogMessage(
            UILogMessageLevel level,
            string message,
            Exception exc = null,
            bool showMessageBox = false)
        {
            AddUILogMessage(level, message,
                exc, null, showMessageBox);
        }

        public void AddUIInfoMsg(
            string message,
            Exception exc = null,
            bool showMessageBox = false)
        {
            AddUILogMessage(
                UILogMessageLevel.Information,
                message, exc, null, showMessageBox);
        }

        public void AddUIWarnMsg(
            string message,
            Exception exc = null,
            bool showMessageBox = false)
        {
            AddUILogMessage(
                UILogMessageLevel.Warning,
                message, exc, null, showMessageBox);
        }

        public void AddUIErrMsg(
            string message,
            Exception exc = null,
            bool showMessageBox = false)
        {
            AddUILogMessage(
                UILogMessageLevel.Error,
                message, exc, null, showMessageBox);
        }

        public void UpdateStatusStripText(string text)
        {
            statusStripTextChanged?.Invoke(text);
        }
    }
}
