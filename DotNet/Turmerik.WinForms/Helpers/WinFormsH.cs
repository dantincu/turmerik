using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Actions;
using Turmerik.Core.Helpers;
using Turmerik.WinForms.Actions;
using static System.Windows.Forms.VisualStyles.VisualStyleElement;

namespace Turmerik.WinForms.Helpers
{
    public static class WinFormsH
    {
        public static void InvokeIfReq(
            this Control control,
            Action action)
        {
            if (control.InvokeRequired)
            {
                control.Invoke(action);
            }
            else
            {
                action();
            }
        }

        public static T InvokeIfReq<T>(
            this Control control,
            Func<T> action)
        {
            T retVal;

            if (control.InvokeRequired)
            {
                retVal = default;

                control.Invoke(
                    () => retVal = action());
            }
            else
            {
                retVal = action();
            }

            return retVal;
        }

        public static WinFormsActionOpts<T> ActionOpts<T>(
            string actionName,
            Func<IActionResult<T>> action,
            Func<IWinFormsMessageTuple> onBeforeExecution = null,
            Func<Exception, IWinFormsMessageTuple> onUnhandledError = null,
            Func<IActionResult<T>, IWinFormsMessageTuple> onAfterExecution = null) => new WinFormsActionOpts<T>
            {
                ActionName = actionName,
                Action = action,
                OnBeforeExecution = onBeforeExecution,
                OnUnhandledError = onUnhandledError,
                OnAfterExecution = onAfterExecution
            };

        public static WinFormsActionOpts<object> ActionOpts(
            string actionName,
            Func<IActionResult> action,
            Func<IWinFormsMessageTuple> onBeforeExecution = null,
            Func<Exception, IWinFormsMessageTuple> onUnhandledError = null,
            Func<IActionResult, IWinFormsMessageTuple> onAfterExecution = null) => new WinFormsActionOpts<object>
            {
                ActionName = actionName,
                Action = () => action().With(result => new ActionResult<object>(
                    null, result.Exception, result.IsFail)),
                OnBeforeExecution = onBeforeExecution,
                OnUnhandledError = onUnhandledError,
                OnAfterExecution = onAfterExecution
            };

        public static WinFormsAsyncActionOpts<T> AsyncActionOpts<T>(
            string actionName,
            Func<Task<IActionResult<T>>> action,
            Func<IWinFormsMessageTuple> onBeforeExecution = null,
            Func<Exception, IWinFormsMessageTuple> onUnhandledError = null,
            Func<IActionResult<T>, IWinFormsMessageTuple> onAfterExecution = null) => new WinFormsAsyncActionOpts<T>
            {
                ActionName = actionName,
                Action = action,
                OnBeforeExecution = onBeforeExecution,
                OnUnhandledError = onUnhandledError,
                OnAfterExecution = onAfterExecution
            };

        public static WinFormsAsyncActionOpts<object> AsyncActionOpts(
            string actionName,
            Func<Task<IActionResult>> action,
            Func<IWinFormsMessageTuple> onBeforeExecution = null,
            Func<Exception, IWinFormsMessageTuple> onUnhandledError = null,
            Func<IActionResult, IWinFormsMessageTuple> onAfterExecution = null) => new WinFormsAsyncActionOpts<object>
            {
                ActionName = actionName,
                Action = async () => (await action()).With(result => new ActionResult<object>(
                    null, result.Exception, result.IsFail)),
                OnBeforeExecution = onBeforeExecution,
                OnUnhandledError = onUnhandledError,
                OnAfterExecution = onAfterExecution
            };

        public static KeyValuePair<int, TabPage?> GetTabPageHead(
            this TabControl tabControl,
            Point location)
        {
            int idx = -1;
            TabPage tabPage = null;

            for (int i = 0; i < tabControl.TabCount; ++i)
            {
                Rectangle tabRect = tabControl.GetTabRect(i);

                if (tabRect.Contains(location))
                {
                    // The tab at index 'i' was right-clicked
                    TabPage clickedTabPage = tabControl.TabPages[i];
                    // Now you can work with 'clickedTabPage'
                    // For example, display its name:
                    // MessageBox.Show($"Right-clicked on tab: {clickedTabPage.Text}");

                    idx = i;
                    tabPage = clickedTabPage;
                    break; // Exit the loop once found
                }
            }

            return new KeyValuePair<int, TabPage?>(
                idx, tabPage);
        }

        public static KeyValuePair<int, TabPage?> GetTabPageHead(
            this TabControl tabControl,
            MouseEventArgs e) => tabControl.GetTabPageHead(e.Location);
    }
}
