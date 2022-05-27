namespace Turmerik.FsUtils.WinForms.App
{
    partial class ExceptionUserControl
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
            this.groupBoxExceptionType = new System.Windows.Forms.GroupBox();
            this.textBoxExceptionType = new System.Windows.Forms.TextBox();
            this.groupBoxExceptionMessage = new System.Windows.Forms.GroupBox();
            this.textBoxExceptionMessage = new System.Windows.Forms.TextBox();
            this.groupBoxExceptionStacktrace = new System.Windows.Forms.GroupBox();
            this.textBoxExceptionStacktrace = new System.Windows.Forms.TextBox();
            this.groupBoxExceptionType.SuspendLayout();
            this.groupBoxExceptionMessage.SuspendLayout();
            this.groupBoxExceptionStacktrace.SuspendLayout();
            this.SuspendLayout();
            // 
            // groupBoxExceptionType
            // 
            this.groupBoxExceptionType.Controls.Add(this.textBoxExceptionType);
            this.groupBoxExceptionType.Dock = System.Windows.Forms.DockStyle.Top;
            this.groupBoxExceptionType.Location = new System.Drawing.Point(0, 0);
            this.groupBoxExceptionType.Name = "groupBoxExceptionType";
            this.groupBoxExceptionType.Size = new System.Drawing.Size(823, 40);
            this.groupBoxExceptionType.TabIndex = 0;
            this.groupBoxExceptionType.TabStop = false;
            this.groupBoxExceptionType.Text = "Exception type";
            // 
            // textBoxExceptionType
            // 
            this.textBoxExceptionType.Dock = System.Windows.Forms.DockStyle.Top;
            this.textBoxExceptionType.Location = new System.Drawing.Point(3, 16);
            this.textBoxExceptionType.Name = "textBoxExceptionType";
            this.textBoxExceptionType.ReadOnly = true;
            this.textBoxExceptionType.Size = new System.Drawing.Size(817, 20);
            this.textBoxExceptionType.TabIndex = 0;
            // 
            // groupBoxExceptionMessage
            // 
            this.groupBoxExceptionMessage.Controls.Add(this.textBoxExceptionMessage);
            this.groupBoxExceptionMessage.Dock = System.Windows.Forms.DockStyle.Top;
            this.groupBoxExceptionMessage.Location = new System.Drawing.Point(0, 40);
            this.groupBoxExceptionMessage.Name = "groupBoxExceptionMessage";
            this.groupBoxExceptionMessage.Size = new System.Drawing.Size(823, 40);
            this.groupBoxExceptionMessage.TabIndex = 1;
            this.groupBoxExceptionMessage.TabStop = false;
            this.groupBoxExceptionMessage.Text = "Exception message";
            // 
            // textBox1
            // 
            this.textBoxExceptionMessage.Dock = System.Windows.Forms.DockStyle.Top;
            this.textBoxExceptionMessage.Location = new System.Drawing.Point(3, 16);
            this.textBoxExceptionMessage.Name = "textBox1";
            this.textBoxExceptionMessage.ReadOnly = true;
            this.textBoxExceptionMessage.Size = new System.Drawing.Size(817, 20);
            this.textBoxExceptionMessage.TabIndex = 0;
            // 
            // groupBoxExceptionStacktrace
            // 
            this.groupBoxExceptionStacktrace.Controls.Add(this.textBoxExceptionStacktrace);
            this.groupBoxExceptionStacktrace.Dock = System.Windows.Forms.DockStyle.Fill;
            this.groupBoxExceptionStacktrace.Location = new System.Drawing.Point(0, 80);
            this.groupBoxExceptionStacktrace.Name = "groupBoxExceptionStacktrace";
            this.groupBoxExceptionStacktrace.Size = new System.Drawing.Size(823, 555);
            this.groupBoxExceptionStacktrace.TabIndex = 2;
            this.groupBoxExceptionStacktrace.TabStop = false;
            this.groupBoxExceptionStacktrace.Text = "Exception message";
            // 
            // textBoxExceptionStacktrace
            // 
            this.textBoxExceptionStacktrace.Dock = System.Windows.Forms.DockStyle.Fill;
            this.textBoxExceptionStacktrace.Location = new System.Drawing.Point(3, 16);
            this.textBoxExceptionStacktrace.Multiline = true;
            this.textBoxExceptionStacktrace.Name = "textBoxExceptionStacktrace";
            this.textBoxExceptionStacktrace.ReadOnly = true;
            this.textBoxExceptionStacktrace.Size = new System.Drawing.Size(817, 536);
            this.textBoxExceptionStacktrace.TabIndex = 0;
            // 
            // ExceptionUserControl
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.groupBoxExceptionStacktrace);
            this.Controls.Add(this.groupBoxExceptionMessage);
            this.Controls.Add(this.groupBoxExceptionType);
            this.Name = "ExceptionUserControl";
            this.Size = new System.Drawing.Size(823, 635);
            this.groupBoxExceptionType.ResumeLayout(false);
            this.groupBoxExceptionType.PerformLayout();
            this.groupBoxExceptionMessage.ResumeLayout(false);
            this.groupBoxExceptionMessage.PerformLayout();
            this.groupBoxExceptionStacktrace.ResumeLayout(false);
            this.groupBoxExceptionStacktrace.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.GroupBox groupBoxExceptionType;
        private System.Windows.Forms.TextBox textBoxExceptionType;
        private System.Windows.Forms.GroupBox groupBoxExceptionMessage;
        private System.Windows.Forms.TextBox textBoxExceptionMessage;
        private System.Windows.Forms.GroupBox groupBoxExceptionStacktrace;
        private System.Windows.Forms.TextBox textBoxExceptionStacktrace;
    }
}
