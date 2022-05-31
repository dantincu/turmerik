using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Turmerik.FileExplorer.WinFormsCore.App;

namespace Turmerik.FileExplorer.WinFormsCore.App
{
    public partial class UIMessageItemSummaryUserControl : UserControl
    {
        private Action<IUILogMessage> messageTextBoxClick;

        private Color _defaultBackColor;
        private Color _selectedBackColor;

        public UIMessageItemSummaryUserControl()
        {
            InitializeComponent();
        }

        public IUILogMessage UIMessage { get; private set; }

        public event Action<IUILogMessage> MessageTextBoxClick
        {
            add
            {
                messageTextBoxClick += value;
            }

            remove
            {
                messageTextBoxClick -= value;
            }
        }

        public void SetUIMessage(IUILogMessage uIMessage)
        {
            this.UIMessage = uIMessage;
            buttonMessageException.Visible = uIMessage.Exception != null;

            labelMessageLevel.Text = uIMessage.Level.ToString().ToUpper();
            labelMessageTimeStamp.Text = uIMessage.TimeStampStr;

            textBoxMessageContent.Text = uIMessage.Message;
            SetColors(uIMessage.Level);

            this.BackColor = this._defaultBackColor;
        }

        public void SetSelected(bool selected)
        {
            if (selected)
            {
                this.BackColor = _selectedBackColor;
            }
            else
            {
                this.BackColor = _defaultBackColor;
            }
        }

        private void textBoxMessageContent_Click(object sender, EventArgs e)
        {
            messageTextBoxClick?.Invoke(UIMessage);
        }

        private void SetColors(UILogMessageLevel uILogMessageLevel)
        {
            switch (uILogMessageLevel)
            {
                case UILogMessageLevel.Information:
                    _defaultBackColor = GetColor(24, 24, 0);
                    _selectedBackColor = GetColor(48, 48, 0);
                    break;
                case UILogMessageLevel.Warning:
                    _defaultBackColor = GetColor(0, 4, 44);
                    _selectedBackColor = GetColor(0, 8, 88);
                    break;
                case UILogMessageLevel.Error:
                    _defaultBackColor = GetColor(0, 20, 28);
                    _selectedBackColor = GetColor(0, 40, 56);
                    break;
                default:
                    throw new NotImplementedException();
            }
        }

        private Color GetColor(int redOffset, int greenOffset, int blueOffset)
        {
            var color = Color.FromArgb(
                255 - redOffset,
                255 - greenOffset,
                255 - blueOffset);

            return color;
        }
    }
}
