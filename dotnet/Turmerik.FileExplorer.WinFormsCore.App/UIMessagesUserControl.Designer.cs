namespace Turmerik.FsUtils.WinForms.App
{
    partial class UIMessagesUserControl
    {
        /// <summary> 
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary> 
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Component Designer generated code

        /// <summary> 
        /// Required method for Designer support - do not modify 
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.flowLayoutPanelMessagesList = new System.Windows.Forms.FlowLayoutPanel();
            this.splitContainerCurrentMessage = new System.Windows.Forms.SplitContainer();
            this.uiMessageItemUserControl = new Turmerik.FsUtils.WinForms.App.UIMessageItemUserControl();
            ((System.ComponentModel.ISupportInitialize)(this.splitContainerCurrentMessage)).BeginInit();
            this.splitContainerCurrentMessage.Panel1.SuspendLayout();
            this.splitContainerCurrentMessage.Panel2.SuspendLayout();
            this.splitContainerCurrentMessage.SuspendLayout();
            this.SuspendLayout();
            // 
            // flowLayoutPanelMessagesList
            // 
            this.flowLayoutPanelMessagesList.AutoScroll = true;
            this.flowLayoutPanelMessagesList.BackColor = System.Drawing.SystemColors.ControlDark;
            this.flowLayoutPanelMessagesList.Dock = System.Windows.Forms.DockStyle.Fill;
            this.flowLayoutPanelMessagesList.FlowDirection = System.Windows.Forms.FlowDirection.BottomUp;
            this.flowLayoutPanelMessagesList.Location = new System.Drawing.Point(0, 0);
            this.flowLayoutPanelMessagesList.Name = "flowLayoutPanelMessagesList";
            this.flowLayoutPanelMessagesList.Size = new System.Drawing.Size(787, 802);
            this.flowLayoutPanelMessagesList.TabIndex = 0;
            // 
            // splitContainerCurrentMessage
            // 
            this.splitContainerCurrentMessage.Dock = System.Windows.Forms.DockStyle.Fill;
            this.splitContainerCurrentMessage.Location = new System.Drawing.Point(0, 0);
            this.splitContainerCurrentMessage.Name = "splitContainerCurrentMessage";
            // 
            // splitContainerCurrentMessage.Panel1
            // 
            this.splitContainerCurrentMessage.Panel1.Controls.Add(this.flowLayoutPanelMessagesList);
            // 
            // splitContainerCurrentMessage.Panel2
            // 
            this.splitContainerCurrentMessage.Panel2.Controls.Add(this.uiMessageItemUserControl);
            this.splitContainerCurrentMessage.Size = new System.Drawing.Size(1347, 802);
            this.splitContainerCurrentMessage.SplitterDistance = 787;
            this.splitContainerCurrentMessage.TabIndex = 1;
            // 
            // uiMessageItemUserControl
            // 
            this.uiMessageItemUserControl.Dock = System.Windows.Forms.DockStyle.Fill;
            this.uiMessageItemUserControl.Location = new System.Drawing.Point(0, 0);
            this.uiMessageItemUserControl.Name = "uiMessageItemUserControl";
            this.uiMessageItemUserControl.Size = new System.Drawing.Size(556, 802);
            this.uiMessageItemUserControl.TabIndex = 0;
            // 
            // UIMessagesUserControl
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.splitContainerCurrentMessage);
            this.Name = "UIMessagesUserControl";
            this.Size = new System.Drawing.Size(1347, 802);
            this.splitContainerCurrentMessage.Panel1.ResumeLayout(false);
            this.splitContainerCurrentMessage.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.splitContainerCurrentMessage)).EndInit();
            this.splitContainerCurrentMessage.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion
        private System.Windows.Forms.FlowLayoutPanel flowLayoutPanelMessagesList;
        private System.Windows.Forms.SplitContainer splitContainerCurrentMessage;
        private UIMessageItemUserControl uiMessageItemUserControl;
    }
}
