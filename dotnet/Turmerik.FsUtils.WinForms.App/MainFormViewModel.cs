using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Components;

namespace Turmerik.FsUtils.WinForms.App
{
    public class MainFormViewModel
    {
        private readonly string[] args;

        private Action<IUILogMessage> uILogMessageAdded;
        private Action<string> statusStripTextChanged;

        public MainFormViewModel(string[] args)
        {
            this.args = args ?? throw new ArgumentNullException(nameof(args));
            UILogMessages = new List<IUILogMessage>();

            CurrentDirPath = args.FirstOrDefault() ?? Environment.GetFolderPath(
                Environment.SpecialFolder.UserProfile);

            CurrentDirVPath = GetCurrentDirVPath(CurrentDirPath);
        }

        public List<IUILogMessage> UILogMessages { get; }

        public string CurrentDirPath { get; }
        public string CurrentDirVPath { get; }

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

        public void TryExecute(
            string actionName,
            Func<Tuple<bool, string>> action)
        {
            statusStripTextChanged?.Invoke($"Executing action {actionName}");
            Exception exception = null;

            string resultMessage;
            bool resultIsSuccess;

            try
            {
                var result = action();

                if (result != null)
                {
                    resultIsSuccess = result.Item1;

                    if (resultIsSuccess)
                    {
                        resultMessage = result.Item2 ?? $"Action {actionName} executed successfully";
                    }
                    else
                    {
                        resultMessage = result.Item2 ?? $"An error ocurred while executing action {actionName}";
                    }
                }
                else
                {
                    resultIsSuccess = false;
                    resultMessage = $"Something went wrong while executing action {actionName}";
                }
            }
            catch (Exception exc)
            {
                resultIsSuccess = false;
                resultMessage = $"An Unhandled error ocurred while executing action {actionName}";

                exception = exc;
            }

            var uILogMessageLevel = resultIsSuccess ? UILogMessageLevel.Information : UILogMessageLevel.Error;

            AddUILogMessage(
                uILogMessageLevel,
                resultMessage,
                exception);
        }

        public void AddUILogMessage(IUILogMessage uILogMessage)
        {
            uILogMessageAdded?.Invoke(uILogMessage);
        }

        public void AddUILogMessage(UILogMessageMtbl uILogMessage)
        {
            var logMessage = new UILogMessageImmtbl(uILogMessage);
            AddUILogMessage(logMessage);
        }

        public void AddUILogMessage(
            UILogMessageLevel level,
            string message,
            Exception exc = null,
            DateTime? dateTime = null)
        {
            var uiLogMessage = new UILogMessageMtbl
            {
                Level = level,
                Message = message,
                Exception = exc,
                DateTime = dateTime ?? DateTime.Now
            };

            AddUILogMessage(uiLogMessage);
        }

        public void AddUIInfoMsg(
            string message,
            Exception exc = null)
        {
            AddUILogMessage(
                UILogMessageLevel.Information,
                message, exc);
        }

        public void AddUIWarnMsg(
            string message,
            Exception exc = null)
        {
            AddUILogMessage(
                UILogMessageLevel.Warning,
                message, exc);
        }

        public void AddUIErrMsg(
            string message,
            Exception exc = null)
        {
            AddUILogMessage(
                UILogMessageLevel.Error,
                message, exc);
        }

        private string GetCurrentDirVPath(string currentDirPath)
        {
            return currentDirPath;
        }
    }
}
