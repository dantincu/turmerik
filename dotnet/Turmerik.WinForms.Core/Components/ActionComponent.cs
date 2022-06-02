using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Turmerik.WinForms.Core.Components
{
    public class ActionComponent
    {
        public ActionComponent()
        {
        }

        public ActionComponent(ToolStripStatusLabel toolStripStatusLabel)
        {
            ToolStripStatusLabel = toolStripStatusLabel;
        }

        public ToolStripStatusLabel ToolStripStatusLabel { get; }

        public bool TryExecute(
            Func<Tuple<bool, string>> action,
            string actionName,
            bool showPopupOnError = true,
            ToolStripStatusLabel toolStripStatusLabel = null,
            bool treatErrorAsCritical = false)
        {
            toolStripStatusLabel = toolStripStatusLabel ?? ToolStripStatusLabel;
            bool retVal;
            Exception exception = null;

            string prefix = "Executing";
            string suffix = "...";
            string content;
            string fullContent = null;

            if (toolStripStatusLabel != null)
            {
                toolStripStatusLabel.Text = GetStatusStripMessage(prefix, actionName, suffix);
            }

            try
            {
                var retTuple = action() ?? new Tuple<bool, string>(
                    false, $"yielded no response");

                retVal = retTuple.Item1;
                suffix = retVal ? "successfully" : "with error";

                content = retTuple.Item2;
            }
            catch (Exception exc)
            {
                retVal = false;
                suffix = "with unhandled error";

                exception = exc;
                var aggExc = exc as AggregateException;

                if (aggExc != null)
                {
                    exc = aggExc.GetBaseException();
                }

                content = exc.Message;
                fullContent = exc.ToString();
            }

            prefix = "Executed";
            string message = GetStatusStripMessage(prefix, actionName, suffix, content);

            if (toolStripStatusLabel != null)
            {
                toolStripStatusLabel.Text = message;
            }

            if (!retVal && showPopupOnError)
            {
                string fullMessage = GetStatusStripMessage(prefix, actionName, suffix, fullContent ?? content);

                MessageBox.Show(
                    fullMessage,
                    retVal ? "Success" : "Error",
                    MessageBoxButtons.OK,
                    retVal ? MessageBoxIcon.Information : MessageBoxIcon.Error);
            }

            if (exception != null && treatErrorAsCritical)
            {
                MessageBox.Show(
                    "The error that has just ocurred was critical and now the app has to exit",
                    "Critical Error",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error);

                Application.Exit();
            }

            return retVal;
        }

        public Task<bool> TryExecuteAsync(
            Func<Task<Tuple<bool, string>>> asyncAction,
            string actionName,
            bool showPopupOnError = false,
            ToolStripStatusLabel toolStripStatusLabel = null,
            bool treatErrorAsCritical = false)
        {
            Func<Tuple<bool, string>> action = () =>
            {
                var task = asyncAction();
                task.Wait();

                var retTuple = task.Result;
                return retTuple;
            };

            bool retVal = TryExecute(
                action,
                actionName,
                showPopupOnError,
                toolStripStatusLabel,
                treatErrorAsCritical);

            return Task.FromResult(retVal);
        }

        private string GetStatusStripMessage(
            string prefix,
            string actionName,
            string suffix,
            string content = null)
        {
            string message = $"{prefix} action [{actionName}] {suffix}";

            if (content != null)
            {
                message = $"{message}: {content}";
            }

            return message;
        }
    }

    public class ActionComponentFactory
    {
        public ActionComponent GetActionComponent(
            ToolStripStatusLabel toolStripStatusLabel)
        {
            var actionComponent = new ActionComponent(toolStripStatusLabel);
            return actionComponent;
        }
    }
}
