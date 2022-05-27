namespace Turmerik.FsUtils.WinForms.App
{
    partial class UILogMessageUserControl
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
            this.labelMessageLevel = new System.Windows.Forms.Label();
            this.labelMessageDateTime = new System.Windows.Forms.Label();
            this.topPanel = new System.Windows.Forms.Panel();
            this.pictureBoxException = new System.Windows.Forms.PictureBox();
            this.textBoxMessageContent = new System.Windows.Forms.TextBox();
            this.exceptionHierarchyUserControl = new Turmerik.FsUtils.WinForms.App.ExceptionHierarchyUserControl();
            this.topPanel.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBoxException)).BeginInit();
            this.SuspendLayout();
            // 
            // labelMessageLevel
            // 
            this.labelMessageLevel.AutoSize = true;
            this.labelMessageLevel.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.labelMessageLevel.Location = new System.Drawing.Point(3, 4);
            this.labelMessageLevel.Name = "labelMessageLevel";
            this.labelMessageLevel.Size = new System.Drawing.Size(45, 13);
            this.labelMessageLevel.TabIndex = 0;
            this.labelMessageLevel.Text = "LEVEL";
            // 
            // labelMessageDateTime
            // 
            this.labelMessageDateTime.AutoSize = true;
            this.labelMessageDateTime.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, ((System.Drawing.FontStyle)((System.Drawing.FontStyle.Bold | System.Drawing.FontStyle.Italic))), System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.labelMessageDateTime.Location = new System.Drawing.Point(183, 4);
            this.labelMessageDateTime.Name = "labelMessageDateTime";
            this.labelMessageDateTime.Size = new System.Drawing.Size(70, 13);
            this.labelMessageDateTime.TabIndex = 2;
            this.labelMessageDateTime.Text = "DATETIME";
            // 
            // topPanel
            // 
            this.topPanel.Controls.Add(this.pictureBoxException);
            this.topPanel.Controls.Add(this.labelMessageLevel);
            this.topPanel.Controls.Add(this.labelMessageDateTime);
            this.topPanel.Dock = System.Windows.Forms.DockStyle.Top;
            this.topPanel.Location = new System.Drawing.Point(2, 2);
            this.topPanel.Name = "topPanel";
            this.topPanel.Size = new System.Drawing.Size(957, 23);
            this.topPanel.TabIndex = 3;
            this.topPanel.MouseClick += new System.Windows.Forms.MouseEventHandler(this.topPanel_MouseClick);
            // 
            // pictureBoxException
            // 
            this.pictureBoxException.Dock = System.Windows.Forms.DockStyle.Right;
            this.pictureBoxException.InitialImage = global::Turmerik.FsUtils.WinForms.App.Properties.Resources.Error_icon_48x48;
            this.pictureBoxException.Location = new System.Drawing.Point(933, 0);
            this.pictureBoxException.Name = "pictureBoxException";
            this.pictureBoxException.Size = new System.Drawing.Size(24, 23);
            this.pictureBoxException.SizeMode = System.Windows.Forms.PictureBoxSizeMode.StretchImage;
            this.pictureBoxException.TabIndex = 4;
            this.pictureBoxException.TabStop = false;
            this.pictureBoxException.MouseClick += new System.Windows.Forms.MouseEventHandler(this.pictureBoxException_MouseClick);
            // 
            // textBoxMessageContent
            // 
            this.textBoxMessageContent.Dock = System.Windows.Forms.DockStyle.Top;
            this.textBoxMessageContent.Location = new System.Drawing.Point(2, 25);
            this.textBoxMessageContent.Multiline = true;
            this.textBoxMessageContent.Name = "textBoxMessageContent";
            this.textBoxMessageContent.ReadOnly = true;
            this.textBoxMessageContent.Size = new System.Drawing.Size(957, 160);
            this.textBoxMessageContent.TabIndex = 4;
            // 
            // exceptionHierarchyUserControl
            // 
            this.exceptionHierarchyUserControl.Dock = System.Windows.Forms.DockStyle.Fill;
            this.exceptionHierarchyUserControl.Location = new System.Drawing.Point(2, 185);
            this.exceptionHierarchyUserControl.Name = "exceptionHierarchyUserControl";
            this.exceptionHierarchyUserControl.Size = new System.Drawing.Size(957, 631);
            this.exceptionHierarchyUserControl.TabIndex = 5;
            // 
            // UILogMessageUserControl
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.exceptionHierarchyUserControl);
            this.Controls.Add(this.textBoxMessageContent);
            this.Controls.Add(this.topPanel);
            this.Name = "UILogMessageUserControl";
            this.Padding = new System.Windows.Forms.Padding(2);
            this.Size = new System.Drawing.Size(961, 818);
            this.topPanel.ResumeLayout(false);
            this.topPanel.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBoxException)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label labelMessageLevel;
        private System.Windows.Forms.Label labelMessageDateTime;
        private System.Windows.Forms.Panel topPanel;
        private System.Windows.Forms.PictureBox pictureBoxException;
        private System.Windows.Forms.TextBox textBoxMessageContent;
        private ExceptionHierarchyUserControl exceptionHierarchyUserControl;
    }
}
