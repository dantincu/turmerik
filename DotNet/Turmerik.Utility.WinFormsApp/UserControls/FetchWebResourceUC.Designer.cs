namespace Turmerik.Utility.WinFormsApp.UserControls
{
    partial class FetchWebResourceUC
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
            splitContainerMain = new SplitContainer();
            panelTitleResourceMdLink = new Panel();
            labelTitleResourceMdLink = new Label();
            iconLabelResxMdLinkToCB = new WinForms.Controls.IconLabel();
            panelTitleResourceTitle = new Panel();
            labelTitleResourceTitle = new Label();
            iconLabelResxTitleToCB = new WinForms.Controls.IconLabel();
            panelTitleResourceUrl = new Panel();
            labelTitleResourceUrl = new Label();
            iconLabelResourceUrl = new WinForms.Controls.IconLabel();
            panelResourceMdLink = new Panel();
            textBoxResourceMdLink = new TextBox();
            checkBoxResxMdLinkFetchToCB = new CheckBox();
            iconLabelResxMdLinkFetchToCB = new WinForms.Controls.IconLabel();
            panelResourceTitle = new Panel();
            textBoxResourceTitle = new TextBox();
            checkBoxResxTitleFetchToCB = new CheckBox();
            iconLabelResxTitleFetchToCB = new WinForms.Controls.IconLabel();
            panelResourceUrl = new Panel();
            textBoxResourceUrl = new TextBox();
            ((System.ComponentModel.ISupportInitialize)splitContainerMain).BeginInit();
            splitContainerMain.Panel1.SuspendLayout();
            splitContainerMain.Panel2.SuspendLayout();
            splitContainerMain.SuspendLayout();
            panelTitleResourceMdLink.SuspendLayout();
            panelTitleResourceTitle.SuspendLayout();
            panelTitleResourceUrl.SuspendLayout();
            panelResourceMdLink.SuspendLayout();
            panelResourceTitle.SuspendLayout();
            panelResourceUrl.SuspendLayout();
            SuspendLayout();
            // 
            // splitContainerMain
            // 
            splitContainerMain.Dock = DockStyle.Fill;
            splitContainerMain.Location = new Point(0, 0);
            splitContainerMain.Name = "splitContainerMain";
            // 
            // splitContainerMain.Panel1
            // 
            splitContainerMain.Panel1.Controls.Add(panelTitleResourceMdLink);
            splitContainerMain.Panel1.Controls.Add(panelTitleResourceTitle);
            splitContainerMain.Panel1.Controls.Add(panelTitleResourceUrl);
            // 
            // splitContainerMain.Panel2
            // 
            splitContainerMain.Panel2.Controls.Add(panelResourceMdLink);
            splitContainerMain.Panel2.Controls.Add(panelResourceTitle);
            splitContainerMain.Panel2.Controls.Add(panelResourceUrl);
            splitContainerMain.Size = new Size(1600, 71);
            splitContainerMain.SplitterDistance = 100;
            splitContainerMain.TabIndex = 0;
            splitContainerMain.TabStop = false;
            // 
            // panelTitleResourceMdLink
            // 
            panelTitleResourceMdLink.Controls.Add(labelTitleResourceMdLink);
            panelTitleResourceMdLink.Controls.Add(iconLabelResxMdLinkToCB);
            panelTitleResourceMdLink.Dock = DockStyle.Top;
            panelTitleResourceMdLink.Location = new Point(0, 46);
            panelTitleResourceMdLink.Name = "panelTitleResourceMdLink";
            panelTitleResourceMdLink.Size = new Size(100, 23);
            panelTitleResourceMdLink.TabIndex = 3;
            // 
            // labelTitleResourceMdLink
            // 
            labelTitleResourceMdLink.AutoSize = true;
            labelTitleResourceMdLink.Dock = DockStyle.Right;
            labelTitleResourceMdLink.Location = new Point(30, 0);
            labelTitleResourceMdLink.Name = "labelTitleResourceMdLink";
            labelTitleResourceMdLink.Padding = new Padding(3);
            labelTitleResourceMdLink.Size = new Size(56, 21);
            labelTitleResourceMdLink.TabIndex = 0;
            labelTitleResourceMdLink.Text = "Md Link";
            // 
            // iconLabelResxMdLinkToCB
            // 
            iconLabelResxMdLinkToCB.AutoSize = true;
            iconLabelResxMdLinkToCB.Dock = DockStyle.Right;
            iconLabelResxMdLinkToCB.Location = new Point(86, 0);
            iconLabelResxMdLinkToCB.Name = "iconLabelResxMdLinkToCB";
            iconLabelResxMdLinkToCB.Size = new Size(14, 15);
            iconLabelResxMdLinkToCB.TabIndex = 0;
            iconLabelResxMdLinkToCB.Text = "R";
            iconLabelResxMdLinkToCB.Click += IconLabelTitleResourceMdLink_Click;
            // 
            // panelTitleResourceTitle
            // 
            panelTitleResourceTitle.Controls.Add(labelTitleResourceTitle);
            panelTitleResourceTitle.Controls.Add(iconLabelResxTitleToCB);
            panelTitleResourceTitle.Dock = DockStyle.Top;
            panelTitleResourceTitle.Location = new Point(0, 23);
            panelTitleResourceTitle.Name = "panelTitleResourceTitle";
            panelTitleResourceTitle.Size = new Size(100, 23);
            panelTitleResourceTitle.TabIndex = 2;
            // 
            // labelTitleResourceTitle
            // 
            labelTitleResourceTitle.AutoSize = true;
            labelTitleResourceTitle.Dock = DockStyle.Right;
            labelTitleResourceTitle.Location = new Point(51, 0);
            labelTitleResourceTitle.Name = "labelTitleResourceTitle";
            labelTitleResourceTitle.Padding = new Padding(3);
            labelTitleResourceTitle.Size = new Size(35, 21);
            labelTitleResourceTitle.TabIndex = 0;
            labelTitleResourceTitle.Text = "Title";
            // 
            // iconLabelResxTitleToCB
            // 
            iconLabelResxTitleToCB.AutoSize = true;
            iconLabelResxTitleToCB.Dock = DockStyle.Right;
            iconLabelResxTitleToCB.Location = new Point(86, 0);
            iconLabelResxTitleToCB.Name = "iconLabelResxTitleToCB";
            iconLabelResxTitleToCB.Size = new Size(14, 15);
            iconLabelResxTitleToCB.TabIndex = 0;
            iconLabelResxTitleToCB.Text = "R";
            iconLabelResxTitleToCB.Click += IconLabelResourceTitle_Click;
            // 
            // panelTitleResourceUrl
            // 
            panelTitleResourceUrl.Controls.Add(labelTitleResourceUrl);
            panelTitleResourceUrl.Controls.Add(iconLabelResourceUrl);
            panelTitleResourceUrl.Dock = DockStyle.Top;
            panelTitleResourceUrl.Location = new Point(0, 0);
            panelTitleResourceUrl.Name = "panelTitleResourceUrl";
            panelTitleResourceUrl.Size = new Size(100, 23);
            panelTitleResourceUrl.TabIndex = 1;
            // 
            // labelTitleResourceUrl
            // 
            labelTitleResourceUrl.AutoSize = true;
            labelTitleResourceUrl.Dock = DockStyle.Right;
            labelTitleResourceUrl.Location = new Point(58, 0);
            labelTitleResourceUrl.Name = "labelTitleResourceUrl";
            labelTitleResourceUrl.Padding = new Padding(3);
            labelTitleResourceUrl.Size = new Size(28, 21);
            labelTitleResourceUrl.TabIndex = 0;
            labelTitleResourceUrl.Text = "Url";
            // 
            // iconLabelResourceUrl
            // 
            iconLabelResourceUrl.AutoSize = true;
            iconLabelResourceUrl.Dock = DockStyle.Right;
            iconLabelResourceUrl.Location = new Point(86, 0);
            iconLabelResourceUrl.Name = "iconLabelResourceUrl";
            iconLabelResourceUrl.Size = new Size(14, 15);
            iconLabelResourceUrl.TabIndex = 0;
            iconLabelResourceUrl.Text = "R";
            iconLabelResourceUrl.Click += IconLabelResourceUrl_Click;
            // 
            // panelResourceMdLink
            // 
            panelResourceMdLink.Controls.Add(textBoxResourceMdLink);
            panelResourceMdLink.Controls.Add(checkBoxResxMdLinkFetchToCB);
            panelResourceMdLink.Controls.Add(iconLabelResxMdLinkFetchToCB);
            panelResourceMdLink.Dock = DockStyle.Top;
            panelResourceMdLink.Location = new Point(0, 46);
            panelResourceMdLink.Name = "panelResourceMdLink";
            panelResourceMdLink.Size = new Size(1496, 23);
            panelResourceMdLink.TabIndex = 2;
            // 
            // textBoxResourceMdLink
            // 
            textBoxResourceMdLink.Dock = DockStyle.Fill;
            textBoxResourceMdLink.Location = new Point(0, 0);
            textBoxResourceMdLink.Name = "textBoxResourceMdLink";
            textBoxResourceMdLink.Size = new Size(1407, 23);
            textBoxResourceMdLink.TabIndex = 3;
            textBoxResourceMdLink.KeyUp += TextBoxResourceMdLink_KeyUp;
            // 
            // checkBoxResxMdLinkFetchToCB
            // 
            checkBoxResxMdLinkFetchToCB.AutoSize = true;
            checkBoxResxMdLinkFetchToCB.Cursor = Cursors.Hand;
            checkBoxResxMdLinkFetchToCB.Dock = DockStyle.Right;
            checkBoxResxMdLinkFetchToCB.Location = new Point(1407, 0);
            checkBoxResxMdLinkFetchToCB.Name = "checkBoxResxMdLinkFetchToCB";
            checkBoxResxMdLinkFetchToCB.Padding = new Padding(5, 0, 0, 0);
            checkBoxResxMdLinkFetchToCB.Size = new Size(75, 23);
            checkBoxResxMdLinkFetchToCB.TabIndex = 0;
            checkBoxResxMdLinkFetchToCB.TabStop = false;
            checkBoxResxMdLinkFetchToCB.Text = "Fetch To";
            checkBoxResxMdLinkFetchToCB.UseVisualStyleBackColor = true;
            // 
            // iconLabelResxMdLinkFetchToCB
            // 
            iconLabelResxMdLinkFetchToCB.AutoSize = true;
            iconLabelResxMdLinkFetchToCB.Dock = DockStyle.Right;
            iconLabelResxMdLinkFetchToCB.ForeColor = SystemColors.ControlText;
            iconLabelResxMdLinkFetchToCB.Location = new Point(1482, 0);
            iconLabelResxMdLinkFetchToCB.Name = "iconLabelResxMdLinkFetchToCB";
            iconLabelResxMdLinkFetchToCB.Size = new Size(14, 15);
            iconLabelResxMdLinkFetchToCB.TabIndex = 4;
            iconLabelResxMdLinkFetchToCB.Text = "R";
            iconLabelResxMdLinkFetchToCB.Click += IconLabelResxMdLinkFetchToCB_Click;
            // 
            // panelResourceTitle
            // 
            panelResourceTitle.Controls.Add(textBoxResourceTitle);
            panelResourceTitle.Controls.Add(checkBoxResxTitleFetchToCB);
            panelResourceTitle.Controls.Add(iconLabelResxTitleFetchToCB);
            panelResourceTitle.Dock = DockStyle.Top;
            panelResourceTitle.Location = new Point(0, 23);
            panelResourceTitle.Name = "panelResourceTitle";
            panelResourceTitle.Size = new Size(1496, 23);
            panelResourceTitle.TabIndex = 1;
            // 
            // textBoxResourceTitle
            // 
            textBoxResourceTitle.Dock = DockStyle.Fill;
            textBoxResourceTitle.Location = new Point(0, 0);
            textBoxResourceTitle.Name = "textBoxResourceTitle";
            textBoxResourceTitle.Size = new Size(1407, 23);
            textBoxResourceTitle.TabIndex = 2;
            textBoxResourceTitle.KeyUp += TextBoxResourceTitle_KeyUp;
            // 
            // checkBoxResxTitleFetchToCB
            // 
            checkBoxResxTitleFetchToCB.AutoSize = true;
            checkBoxResxTitleFetchToCB.Cursor = Cursors.Hand;
            checkBoxResxTitleFetchToCB.Dock = DockStyle.Right;
            checkBoxResxTitleFetchToCB.Location = new Point(1407, 0);
            checkBoxResxTitleFetchToCB.Name = "checkBoxResxTitleFetchToCB";
            checkBoxResxTitleFetchToCB.Padding = new Padding(5, 0, 0, 0);
            checkBoxResxTitleFetchToCB.Size = new Size(75, 23);
            checkBoxResxTitleFetchToCB.TabIndex = 0;
            checkBoxResxTitleFetchToCB.TabStop = false;
            checkBoxResxTitleFetchToCB.Text = "Fetch To";
            checkBoxResxTitleFetchToCB.UseVisualStyleBackColor = true;
            // 
            // iconLabelResxTitleFetchToCB
            // 
            iconLabelResxTitleFetchToCB.AutoSize = true;
            iconLabelResxTitleFetchToCB.Dock = DockStyle.Right;
            iconLabelResxTitleFetchToCB.ForeColor = SystemColors.ControlText;
            iconLabelResxTitleFetchToCB.Location = new Point(1482, 0);
            iconLabelResxTitleFetchToCB.Name = "iconLabelResxTitleFetchToCB";
            iconLabelResxTitleFetchToCB.Size = new Size(14, 15);
            iconLabelResxTitleFetchToCB.TabIndex = 3;
            iconLabelResxTitleFetchToCB.Text = "R";
            iconLabelResxTitleFetchToCB.Click += IconLabelResxTitleFetchToCB_Click;
            // 
            // panelResourceUrl
            // 
            panelResourceUrl.Controls.Add(textBoxResourceUrl);
            panelResourceUrl.Dock = DockStyle.Top;
            panelResourceUrl.Location = new Point(0, 0);
            panelResourceUrl.Name = "panelResourceUrl";
            panelResourceUrl.Size = new Size(1496, 23);
            panelResourceUrl.TabIndex = 0;
            // 
            // textBoxResourceUrl
            // 
            textBoxResourceUrl.Dock = DockStyle.Fill;
            textBoxResourceUrl.Location = new Point(0, 0);
            textBoxResourceUrl.Name = "textBoxResourceUrl";
            textBoxResourceUrl.Size = new Size(1496, 23);
            textBoxResourceUrl.TabIndex = 1;
            textBoxResourceUrl.KeyUp += TextBoxResourceUrl_KeyUp;
            // 
            // FetchWebResourceUC
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            Controls.Add(splitContainerMain);
            Name = "FetchWebResourceUC";
            Size = new Size(1600, 71);
            Load += FetchWebResourceUC_Load;
            splitContainerMain.Panel1.ResumeLayout(false);
            splitContainerMain.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)splitContainerMain).EndInit();
            splitContainerMain.ResumeLayout(false);
            panelTitleResourceMdLink.ResumeLayout(false);
            panelTitleResourceMdLink.PerformLayout();
            panelTitleResourceTitle.ResumeLayout(false);
            panelTitleResourceTitle.PerformLayout();
            panelTitleResourceUrl.ResumeLayout(false);
            panelTitleResourceUrl.PerformLayout();
            panelResourceMdLink.ResumeLayout(false);
            panelResourceMdLink.PerformLayout();
            panelResourceTitle.ResumeLayout(false);
            panelResourceTitle.PerformLayout();
            panelResourceUrl.ResumeLayout(false);
            panelResourceUrl.PerformLayout();
            ResumeLayout(false);
        }

        #endregion

        private SplitContainer splitContainerMain;
        private Label labelTitleResourceUrl;
        private Panel panelTitleResourceUrl;
        private WinForms.Controls.IconLabel iconLabelResourceUrl;
        private Panel panelResourceUrl;
        private TextBox textBoxResourceUrl;
        private Panel panelResourceMdLink;
        private CheckBox checkBoxResxMdLinkFetchToCB;
        private TextBox textBoxResourceMdLink;
        private Panel panelResourceTitle;
        private CheckBox checkBoxResxTitleFetchToCB;
        private TextBox textBoxResourceTitle;
        private Panel panelTitleResourceMdLink;
        private Label labelTitleResourceMdLink;
        private WinForms.Controls.IconLabel iconLabelResxMdLinkToCB;
        private Panel panelTitleResourceTitle;
        private Label labelTitleResourceTitle;
        private WinForms.Controls.IconLabel iconLabelResxTitleToCB;
        private WinForms.Controls.IconLabel iconLabelResxMdLinkFetchToCB;
        private WinForms.Controls.IconLabel iconLabelResxTitleFetchToCB;
    }
}
