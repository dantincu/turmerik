using Microsoft.Extensions.DependencyInjection;
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
    public partial class UILogMessageUserControl : UserControl
    {
        private const int DEFAULT_COLLAPSED_HEIGHT = 55;
        private const int DEFAULT_EXPANDED_HEIGHT = 200;

        private const int DEFAULT_FULL_HEIGHT = 900;

        private readonly ITimeStampHelper timeStampHelper;
        private bool expanded;

        public UILogMessageUserControl()
        {
            InitializeComponent();
            timeStampHelper = ServiceProviderContainer.Instance.Value.Services.GetRequiredService<ITimeStampHelper>();

            labelMessageLevel.Text = string.Empty;
            labelMessageDateTime.Text = string.Empty;
            pictureBoxException.Visible = false;

        }

        public UILogMessageUserControl(IUILogMessage uILogMessage)
        {
            InitializeComponent();
            timeStampHelper = ServiceProviderContainer.Instance.Value.Services.GetRequiredService<ITimeStampHelper>();

            pictureBoxException.Image = Properties.Resources.Error_icon_48x48;
            SetUILogMessage(uILogMessage);
        }

        public IUILogMessage UILogMessage { get; private set; }

        public void SetUILogMessage(IUILogMessage uILogMessage)
        {
            UILogMessage = uILogMessage;
            var colors = GetLevelColors(uILogMessage.Level);

            labelMessageLevel.Text = uILogMessage.Level.ToString().ToUpper();
            labelMessageLevel.ForeColor = colors.ForeColor;

            labelMessageDateTime.Text = timeStampHelper.TmStmp(
                uILogMessage.DateTime, true, TimeStamp.Seconds);

            labelMessageDateTime.ForeColor = colors.ForeColor;

            pictureBoxException.Visible = uILogMessage.Exception != null;
            textBoxMessageContent.Text = uILogMessage.Message;

            this.BackColor = colors.BackgroundColor;
            CollapseControl();

            if (uILogMessage.Exception != null)
            {
                exceptionHierarchyUserControl.SetException(uILogMessage.Exception);
            }
            else
            {
                exceptionHierarchyUserControl.ClearException();
            }
        }

        private ControlColorsTuple GetLevelColors(UILogMessageLevel uILogMessageLevel)
        {
            ControlColorsTuple color;

            switch (uILogMessageLevel)
            {
                case UILogMessageLevel.Information:
                    color = new ControlColorsTuple(
                        Color.FromArgb(0, 64, 128),
                        Color.FromArgb(224, 240, 255));
                    break;
                case UILogMessageLevel.Warning:
                    color = new ControlColorsTuple(
                        Color.FromArgb(96, 96, 0),
                        Color.FromArgb(248, 248, 224));
                    break;
                case UILogMessageLevel.Error:
                    color = new ControlColorsTuple(
                        Color.FromArgb(128, 64, 0),
                        Color.FromArgb(255, 240, 224));
                    break;
                default:
                    throw new NotImplementedException();
            }

            return color;
        }

        private void topPanel_MouseClick(object sender, MouseEventArgs e)
        {
            ToggleControlHeight();
        }

        private void UpdateHeight(int height)
        {
            this.Size = new Size(this.Size.Width, height);
        }

        private void ExpandControl(int height = DEFAULT_EXPANDED_HEIGHT)
        {
            UpdateHeight(height);
            expanded = true;
        }

        private void CollapseControl()
        {
            exceptionHierarchyUserControl.Visible = false;
            UpdateHeight(DEFAULT_COLLAPSED_HEIGHT);
            expanded = false;
        }

        private void ToggleControlHeight()
        {
            if (expanded)
            {
                CollapseControl();
            }
            else
            {
                ExpandControl();
            }
        }

        private void ShowExceptionPanel()
        {
            ExpandControl(DEFAULT_FULL_HEIGHT);
            exceptionHierarchyUserControl.Visible = true;
        }

        private void HideExceptionPanel()
        {
            CollapseControl();
        }

        private void ToggleExceptionPanel()
        {
            if (exceptionHierarchyUserControl.Visible)
            {
                HideExceptionPanel();
            }
            else
            {
                ShowExceptionPanel();
            }
        }

        private void pictureBoxException_MouseClick(object sender, MouseEventArgs e)
        {
            ToggleExceptionPanel();
        }
    }
}
