using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Turmerik.Core.Components;

namespace Turmerik.FsUtils.WinForms.App
{
    public partial class UIMessagesUserControl : UserControl
    {
        private const int MESSAGES_MAX_COUNT = 100;

        public UIMessagesUserControl()
        {
            InitializeComponent();
            UILogMessages = new List<IUILogMessage>();

            uiMessageItemUserControl.ClearUIMessage();
            uiMessageItemUserControl.Visible = false;
        }

        protected List<IUILogMessage> UILogMessages { get; }

        public void AddUILogMessage(IUILogMessage uILogMessage)
        {
            Action action = GetAddUILogMessageAction(uILogMessage);

            if (this.InvokeRequired)
            {
                this.Invoke(action);
            }
            else
            {
                action();
            }
        }

        private Action GetAddUILogMessageAction(IUILogMessage uILogMessage)
        {
            Action action = () =>
            {
                UILogMessages.Add(uILogMessage);
                var control = GetMessageItemSummaryUserControl(uILogMessage);

                flowLayoutPanelMessagesList.SuspendLayout();

                if (flowLayoutPanelMessagesList.Controls.Count >= MESSAGES_MAX_COUNT)
                {
                    int toRemoveCount = flowLayoutPanelMessagesList.Controls.Count + 1 - MESSAGES_MAX_COUNT;

                    for (int i = 0; i < toRemoveCount; i++)
                    {
                        flowLayoutPanelMessagesList.Controls.RemoveAt(0);
                    }
                }

                flowLayoutPanelMessagesList.Controls.Add(control);

                flowLayoutPanelMessagesList.ResumeLayout(true);
                flowLayoutPanelMessagesList.Refresh();
            };

            return action;
        }

        private UIMessageItemSummaryUserControl GetMessageItemSummaryUserControl(IUILogMessage uILogMessage)
        {
            var control = new UIMessageItemSummaryUserControl();
            control.SetUIMessage(uILogMessage);

            control.MessageTextBoxClick += UIMessageTextBoxClick;
            return control;
        }

        private void UIMessageTextBoxClick(IUILogMessage message)
        {
            uiMessageItemUserControl.Visible = true;
            uiMessageItemUserControl.SetUIMessage(message);

            foreach (UIMessageItemSummaryUserControl control in flowLayoutPanelMessagesList.Controls)
            {
                control.SetSelected(control.UIMessage.Uuid == message.Uuid);
            }
        }
    }
}
