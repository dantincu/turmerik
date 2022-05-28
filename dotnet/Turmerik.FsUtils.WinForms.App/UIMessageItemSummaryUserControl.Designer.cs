namespace Turmerik.FsUtils.WinForms.App
{
    partial class UIMessageItemSummaryUserControl
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
            this.tableLayoutPanel = new System.Windows.Forms.TableLayoutPanel();
            this.labelMessageTimeStamp = new System.Windows.Forms.Label();
            this.labelMessageLevel = new System.Windows.Forms.Label();
            this.textBoxMessageContent = new System.Windows.Forms.TextBox();
            this.buttonMessageException = new System.Windows.Forms.Button();
            this.tableLayoutPanel.SuspendLayout();
            this.SuspendLayout();
            // 
            // tableLayoutPanel
            // 
            this.tableLayoutPanel.ColumnCount = 4;
            this.tableLayoutPanel.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Absolute, 100F));
            this.tableLayoutPanel.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Absolute, 150F));
            this.tableLayoutPanel.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Absolute, 30F));
            this.tableLayoutPanel.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle());
            this.tableLayoutPanel.Controls.Add(this.labelMessageTimeStamp, 1, 0);
            this.tableLayoutPanel.Controls.Add(this.labelMessageLevel, 0, 0);
            this.tableLayoutPanel.Controls.Add(this.textBoxMessageContent, 3, 0);
            this.tableLayoutPanel.Controls.Add(this.buttonMessageException, 2, 0);
            this.tableLayoutPanel.Dock = System.Windows.Forms.DockStyle.Fill;
            this.tableLayoutPanel.Location = new System.Drawing.Point(0, 0);
            this.tableLayoutPanel.Name = "tableLayoutPanel";
            this.tableLayoutPanel.RowCount = 1;
            this.tableLayoutPanel.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 100F));
            this.tableLayoutPanel.Size = new System.Drawing.Size(1100, 25);
            this.tableLayoutPanel.TabIndex = 0;
            // 
            // labelMessageTimeStamp
            // 
            this.labelMessageTimeStamp.AutoSize = true;
            this.labelMessageTimeStamp.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, ((System.Drawing.FontStyle)((System.Drawing.FontStyle.Bold | System.Drawing.FontStyle.Italic))), System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.labelMessageTimeStamp.Location = new System.Drawing.Point(103, 6);
            this.labelMessageTimeStamp.Margin = new System.Windows.Forms.Padding(3, 6, 3, 0);
            this.labelMessageTimeStamp.Name = "labelMessageTimeStamp";
            this.labelMessageTimeStamp.Size = new System.Drawing.Size(79, 13);
            this.labelMessageTimeStamp.TabIndex = 1;
            this.labelMessageTimeStamp.Text = "TIMESTAMP";
            // 
            // labelMessageLevel
            // 
            this.labelMessageLevel.AutoSize = true;
            this.labelMessageLevel.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.labelMessageLevel.Location = new System.Drawing.Point(3, 6);
            this.labelMessageLevel.Margin = new System.Windows.Forms.Padding(3, 6, 3, 0);
            this.labelMessageLevel.Name = "labelMessageLevel";
            this.labelMessageLevel.Size = new System.Drawing.Size(45, 13);
            this.labelMessageLevel.TabIndex = 0;
            this.labelMessageLevel.Text = "LEVEL";
            // 
            // textBoxMessageContent
            // 
            this.textBoxMessageContent.Dock = System.Windows.Forms.DockStyle.Top;
            this.textBoxMessageContent.Location = new System.Drawing.Point(283, 3);
            this.textBoxMessageContent.Name = "textBoxMessageContent";
            this.textBoxMessageContent.ReadOnly = true;
            this.textBoxMessageContent.Size = new System.Drawing.Size(814, 20);
            this.textBoxMessageContent.TabIndex = 2;
            this.textBoxMessageContent.Click += new System.EventHandler(this.textBoxMessageContent_Click);
            // 
            // buttonMessageException
            // 
            this.buttonMessageException.BackColor = System.Drawing.Color.OrangeRed;
            this.buttonMessageException.Dock = System.Windows.Forms.DockStyle.Fill;
            this.buttonMessageException.FlatAppearance.BorderColor = System.Drawing.Color.OrangeRed;
            this.buttonMessageException.FlatAppearance.BorderSize = 0;
            this.buttonMessageException.Font = new System.Drawing.Font("Microsoft Sans Serif", 7F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.buttonMessageException.ForeColor = System.Drawing.SystemColors.Control;
            this.buttonMessageException.Location = new System.Drawing.Point(253, 3);
            this.buttonMessageException.Name = "buttonMessageException";
            this.buttonMessageException.Size = new System.Drawing.Size(24, 19);
            this.buttonMessageException.TabIndex = 3;
            this.buttonMessageException.UseVisualStyleBackColor = false;
            // 
            // UIMessageItemSummaryUserControl
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.tableLayoutPanel);
            this.Name = "UIMessageItemSummaryUserControl";
            this.Size = new System.Drawing.Size(1100, 25);
            this.tableLayoutPanel.ResumeLayout(false);
            this.tableLayoutPanel.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.TableLayoutPanel tableLayoutPanel;
        private System.Windows.Forms.Label labelMessageLevel;
        private System.Windows.Forms.Label labelMessageTimeStamp;
        private System.Windows.Forms.TextBox textBoxMessageContent;
        private System.Windows.Forms.Button buttonMessageException;
    }
}
