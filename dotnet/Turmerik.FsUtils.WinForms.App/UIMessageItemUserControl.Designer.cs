namespace Turmerik.FsUtils.WinForms.App
{
    partial class UIMessageItemUserControl
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
            this.mainTableLayoutPanel = new System.Windows.Forms.TableLayoutPanel();
            this.topTableLayoutPanel = new System.Windows.Forms.TableLayoutPanel();
            this.labelMessageTimeStamp = new System.Windows.Forms.Label();
            this.labelMessageLevel = new System.Windows.Forms.Label();
            this.groupBoxMessageContent = new System.Windows.Forms.GroupBox();
            this.textBoxMessageContent = new System.Windows.Forms.TextBox();
            this.groupBoxExceptionsHierarchy = new System.Windows.Forms.GroupBox();
            this.treeViewExceptionHierarchy = new System.Windows.Forms.TreeView();
            this.groupBoxExceptionType = new System.Windows.Forms.GroupBox();
            this.textBoxExceptionType = new System.Windows.Forms.TextBox();
            this.groupBoxExceptionMessage = new System.Windows.Forms.GroupBox();
            this.textBoxExceptionMessage = new System.Windows.Forms.TextBox();
            this.groupBoxExceptionStackTrace = new System.Windows.Forms.GroupBox();
            this.textBoxExceptionStackTrace = new System.Windows.Forms.TextBox();
            this.mainTableLayoutPanel.SuspendLayout();
            this.topTableLayoutPanel.SuspendLayout();
            this.groupBoxMessageContent.SuspendLayout();
            this.groupBoxExceptionsHierarchy.SuspendLayout();
            this.groupBoxExceptionType.SuspendLayout();
            this.groupBoxExceptionMessage.SuspendLayout();
            this.groupBoxExceptionStackTrace.SuspendLayout();
            this.SuspendLayout();
            // 
            // mainTableLayoutPanel
            // 
            this.mainTableLayoutPanel.ColumnCount = 1;
            this.mainTableLayoutPanel.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 100F));
            this.mainTableLayoutPanel.Controls.Add(this.topTableLayoutPanel, 0, 0);
            this.mainTableLayoutPanel.Controls.Add(this.groupBoxMessageContent, 0, 1);
            this.mainTableLayoutPanel.Controls.Add(this.groupBoxExceptionsHierarchy, 0, 2);
            this.mainTableLayoutPanel.Controls.Add(this.groupBoxExceptionType, 0, 3);
            this.mainTableLayoutPanel.Controls.Add(this.groupBoxExceptionMessage, 0, 4);
            this.mainTableLayoutPanel.Controls.Add(this.groupBoxExceptionStackTrace, 0, 5);
            this.mainTableLayoutPanel.Dock = System.Windows.Forms.DockStyle.Fill;
            this.mainTableLayoutPanel.Location = new System.Drawing.Point(0, 0);
            this.mainTableLayoutPanel.Name = "mainTableLayoutPanel";
            this.mainTableLayoutPanel.RowCount = 6;
            this.mainTableLayoutPanel.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Absolute, 30F));
            this.mainTableLayoutPanel.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Absolute, 60F));
            this.mainTableLayoutPanel.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Absolute, 120F));
            this.mainTableLayoutPanel.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Absolute, 60F));
            this.mainTableLayoutPanel.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Absolute, 60F));
            this.mainTableLayoutPanel.RowStyles.Add(new System.Windows.Forms.RowStyle());
            this.mainTableLayoutPanel.Size = new System.Drawing.Size(705, 790);
            this.mainTableLayoutPanel.TabIndex = 0;
            // 
            // topTableLayoutPanel
            // 
            this.topTableLayoutPanel.ColumnCount = 2;
            this.topTableLayoutPanel.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 46.35193F));
            this.topTableLayoutPanel.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 53.64807F));
            this.topTableLayoutPanel.Controls.Add(this.labelMessageTimeStamp, 0, 0);
            this.topTableLayoutPanel.Controls.Add(this.labelMessageLevel, 0, 0);
            this.topTableLayoutPanel.Dock = System.Windows.Forms.DockStyle.Top;
            this.topTableLayoutPanel.Location = new System.Drawing.Point(3, 3);
            this.topTableLayoutPanel.Name = "topTableLayoutPanel";
            this.topTableLayoutPanel.RowCount = 1;
            this.topTableLayoutPanel.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 50F));
            this.topTableLayoutPanel.Size = new System.Drawing.Size(699, 24);
            this.topTableLayoutPanel.TabIndex = 0;
            // 
            // labelMessageTimeStamp
            // 
            this.labelMessageTimeStamp.AutoSize = true;
            this.labelMessageTimeStamp.Font = new System.Drawing.Font("Microsoft Sans Serif", 9.0F, ((System.Drawing.FontStyle)((System.Drawing.FontStyle.Bold | System.Drawing.FontStyle.Italic))), System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.labelMessageTimeStamp.Location = new System.Drawing.Point(326, 6);
            this.labelMessageTimeStamp.Margin = new System.Windows.Forms.Padding(3, 6, 3, 0);
            this.labelMessageTimeStamp.Name = "labelMessageTimeStamp";
            this.labelMessageTimeStamp.Size = new System.Drawing.Size(79, 13);
            this.labelMessageTimeStamp.TabIndex = 2;
            this.labelMessageTimeStamp.Text = "TIMESTAMP";
            // 
            // labelMessageLevel
            // 
            this.labelMessageLevel.AutoSize = true;
            this.labelMessageLevel.Font = new System.Drawing.Font("Microsoft Sans Serif", 9.0F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.labelMessageLevel.Location = new System.Drawing.Point(3, 6);
            this.labelMessageLevel.Margin = new System.Windows.Forms.Padding(3, 6, 3, 0);
            this.labelMessageLevel.Name = "labelMessageLevel";
            this.labelMessageLevel.Size = new System.Drawing.Size(45, 13);
            this.labelMessageLevel.TabIndex = 1;
            this.labelMessageLevel.Text = "LEVEL";
            // 
            // groupBoxMessageContent
            // 
            this.groupBoxMessageContent.Controls.Add(this.textBoxMessageContent);
            this.groupBoxMessageContent.Dock = System.Windows.Forms.DockStyle.Fill;
            this.groupBoxMessageContent.Location = new System.Drawing.Point(3, 33);
            this.groupBoxMessageContent.Name = "groupBoxMessageContent";
            this.groupBoxMessageContent.Size = new System.Drawing.Size(699, 54);
            this.groupBoxMessageContent.TabIndex = 1;
            this.groupBoxMessageContent.TabStop = false;
            this.groupBoxMessageContent.Text = "Message";
            // 
            // textBoxMessageContent
            // 
            this.textBoxMessageContent.Dock = System.Windows.Forms.DockStyle.Fill;
            this.textBoxMessageContent.Location = new System.Drawing.Point(3, 16);
            this.textBoxMessageContent.Multiline = true;
            this.textBoxMessageContent.Name = "textBoxMessageContent";
            this.textBoxMessageContent.ReadOnly = true;
            this.textBoxMessageContent.Size = new System.Drawing.Size(693, 35);
            this.textBoxMessageContent.TabIndex = 0;
            // 
            // groupBoxExceptionsHierarchy
            // 
            this.groupBoxExceptionsHierarchy.Controls.Add(this.treeViewExceptionHierarchy);
            this.groupBoxExceptionsHierarchy.Dock = System.Windows.Forms.DockStyle.Fill;
            this.groupBoxExceptionsHierarchy.Location = new System.Drawing.Point(3, 93);
            this.groupBoxExceptionsHierarchy.Name = "groupBoxExceptionsHierarchy";
            this.groupBoxExceptionsHierarchy.Size = new System.Drawing.Size(699, 114);
            this.groupBoxExceptionsHierarchy.TabIndex = 2;
            this.groupBoxExceptionsHierarchy.TabStop = false;
            this.groupBoxExceptionsHierarchy.Text = "Exception";
            // 
            // treeViewExceptionHierarchy
            // 
            this.treeViewExceptionHierarchy.Dock = System.Windows.Forms.DockStyle.Fill;
            this.treeViewExceptionHierarchy.Location = new System.Drawing.Point(3, 16);
            this.treeViewExceptionHierarchy.Name = "treeViewExceptionHierarchy";
            this.treeViewExceptionHierarchy.Size = new System.Drawing.Size(693, 95);
            this.treeViewExceptionHierarchy.TabIndex = 0;
            this.treeViewExceptionHierarchy.NodeMouseClick += new System.Windows.Forms.TreeNodeMouseClickEventHandler(this.treeViewExceptionHierarchy_NodeMouseClick);
            // 
            // groupBoxExceptionType
            // 
            this.groupBoxExceptionType.Controls.Add(this.textBoxExceptionType);
            this.groupBoxExceptionType.Dock = System.Windows.Forms.DockStyle.Fill;
            this.groupBoxExceptionType.Location = new System.Drawing.Point(3, 213);
            this.groupBoxExceptionType.Name = "groupBoxExceptionType";
            this.groupBoxExceptionType.Size = new System.Drawing.Size(699, 54);
            this.groupBoxExceptionType.TabIndex = 3;
            this.groupBoxExceptionType.TabStop = false;
            this.groupBoxExceptionType.Text = "Exception type";
            // 
            // textBoxExceptionType
            // 
            this.textBoxExceptionType.Dock = System.Windows.Forms.DockStyle.Fill;
            this.textBoxExceptionType.Font = new System.Drawing.Font("Consolas", 9.0F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.textBoxExceptionType.Location = new System.Drawing.Point(3, 16);
            this.textBoxExceptionType.Multiline = true;
            this.textBoxExceptionType.Name = "textBoxExceptionType";
            this.textBoxExceptionType.ReadOnly = true;
            this.textBoxExceptionType.Size = new System.Drawing.Size(693, 35);
            this.textBoxExceptionType.TabIndex = 1;
            // 
            // groupBoxExceptionMessage
            // 
            this.groupBoxExceptionMessage.Controls.Add(this.textBoxExceptionMessage);
            this.groupBoxExceptionMessage.Dock = System.Windows.Forms.DockStyle.Fill;
            this.groupBoxExceptionMessage.Location = new System.Drawing.Point(3, 273);
            this.groupBoxExceptionMessage.Name = "groupBoxExceptionMessage";
            this.groupBoxExceptionMessage.Size = new System.Drawing.Size(699, 54);
            this.groupBoxExceptionMessage.TabIndex = 4;
            this.groupBoxExceptionMessage.TabStop = false;
            this.groupBoxExceptionMessage.Text = "Exception message";
            // 
            // textBoxExceptionMessage
            // 
            this.textBoxExceptionMessage.Dock = System.Windows.Forms.DockStyle.Fill;
            this.textBoxExceptionMessage.Location = new System.Drawing.Point(3, 16);
            this.textBoxExceptionMessage.Multiline = true;
            this.textBoxExceptionMessage.Name = "textBoxExceptionMessage";
            this.textBoxExceptionMessage.ReadOnly = true;
            this.textBoxExceptionMessage.Size = new System.Drawing.Size(693, 35);
            this.textBoxExceptionMessage.TabIndex = 1;
            // 
            // groupBoxExceptionStackTrace
            // 
            this.groupBoxExceptionStackTrace.Controls.Add(this.textBoxExceptionStackTrace);
            this.groupBoxExceptionStackTrace.Dock = System.Windows.Forms.DockStyle.Fill;
            this.groupBoxExceptionStackTrace.Location = new System.Drawing.Point(3, 333);
            this.groupBoxExceptionStackTrace.Name = "groupBoxExceptionStackTrace";
            this.groupBoxExceptionStackTrace.Size = new System.Drawing.Size(699, 454);
            this.groupBoxExceptionStackTrace.TabIndex = 5;
            this.groupBoxExceptionStackTrace.TabStop = false;
            this.groupBoxExceptionStackTrace.Text = "Exception stack trace";
            // 
            // textBoxExceptionStackTrace
            // 
            this.textBoxExceptionStackTrace.Dock = System.Windows.Forms.DockStyle.Fill;
            this.textBoxExceptionStackTrace.Font = new System.Drawing.Font("Consolas", 9.0F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.textBoxExceptionStackTrace.Location = new System.Drawing.Point(3, 16);
            this.textBoxExceptionStackTrace.Multiline = true;
            this.textBoxExceptionStackTrace.Name = "textBoxExceptionStackTrace";
            this.textBoxExceptionStackTrace.ReadOnly = true;
            this.textBoxExceptionStackTrace.Size = new System.Drawing.Size(693, 435);
            this.textBoxExceptionStackTrace.TabIndex = 1;
            // 
            // UIMessageItemUserControl
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.mainTableLayoutPanel);
            this.Name = "UIMessageItemUserControl";
            this.Size = new System.Drawing.Size(705, 790);
            this.mainTableLayoutPanel.ResumeLayout(false);
            this.topTableLayoutPanel.ResumeLayout(false);
            this.topTableLayoutPanel.PerformLayout();
            this.groupBoxMessageContent.ResumeLayout(false);
            this.groupBoxMessageContent.PerformLayout();
            this.groupBoxExceptionsHierarchy.ResumeLayout(false);
            this.groupBoxExceptionType.ResumeLayout(false);
            this.groupBoxExceptionType.PerformLayout();
            this.groupBoxExceptionMessage.ResumeLayout(false);
            this.groupBoxExceptionMessage.PerformLayout();
            this.groupBoxExceptionStackTrace.ResumeLayout(false);
            this.groupBoxExceptionStackTrace.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.TableLayoutPanel mainTableLayoutPanel;
        private System.Windows.Forms.TableLayoutPanel topTableLayoutPanel;
        private System.Windows.Forms.Label labelMessageLevel;
        private System.Windows.Forms.Label labelMessageTimeStamp;
        private System.Windows.Forms.GroupBox groupBoxMessageContent;
        private System.Windows.Forms.TextBox textBoxMessageContent;
        private System.Windows.Forms.GroupBox groupBoxExceptionsHierarchy;
        private System.Windows.Forms.GroupBox groupBoxExceptionType;
        private System.Windows.Forms.GroupBox groupBoxExceptionMessage;
        private System.Windows.Forms.GroupBox groupBoxExceptionStackTrace;
        private System.Windows.Forms.TextBox textBoxExceptionType;
        private System.Windows.Forms.TextBox textBoxExceptionMessage;
        private System.Windows.Forms.TextBox textBoxExceptionStackTrace;
        private System.Windows.Forms.TreeView treeViewExceptionHierarchy;
    }
}
