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
            iconLabelTitleResourceMdLink = new WinForms.Controls.IconLabel();
            panelTitleResourceTitle = new Panel();
            labelTitleResourceTitle = new Label();
            iconLabelResourceTitle = new WinForms.Controls.IconLabel();
            panelTitleResourceUrl = new Panel();
            labelTitleResourceUrl = new Label();
            iconLabelResourceUrl = new WinForms.Controls.IconLabel();
            panelResourceMdLink = new Panel();
            textBoxResourceMdLink = new TextBox();
            checkBoxAutoCopyResourceMdLinkToClipboard = new CheckBox();
            panelResourceTitle = new Panel();
            textBoxResourceTitle = new TextBox();
            checkBoxAutoCopyResourceTitleToClipboard = new CheckBox();
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
            panelTitleResourceMdLink.Controls.Add(iconLabelTitleResourceMdLink);
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
            labelTitleResourceMdLink.Location = new Point(24, 0);
            labelTitleResourceMdLink.Name = "labelTitleResourceMdLink";
            labelTitleResourceMdLink.Padding = new Padding(3);
            labelTitleResourceMdLink.Size = new Size(56, 21);
            labelTitleResourceMdLink.TabIndex = 0;
            labelTitleResourceMdLink.Text = "Md Link";
            // 
            // iconLabelTitleResourceMdLink
            // 
            iconLabelTitleResourceMdLink.AutoSize = true;
            iconLabelTitleResourceMdLink.Dock = DockStyle.Right;
            iconLabelTitleResourceMdLink.Location = new Point(80, 0);
            iconLabelTitleResourceMdLink.Name = "iconLabelTitleResourceMdLink";
            iconLabelTitleResourceMdLink.Padding = new Padding(3);
            iconLabelTitleResourceMdLink.Size = new Size(20, 21);
            iconLabelTitleResourceMdLink.TabIndex = 0;
            iconLabelTitleResourceMdLink.Text = "R";
            iconLabelTitleResourceMdLink.Click += IconLabelTitleResourceMdLink_Click;
            // 
            // panelTitleResourceTitle
            // 
            panelTitleResourceTitle.Controls.Add(labelTitleResourceTitle);
            panelTitleResourceTitle.Controls.Add(iconLabelResourceTitle);
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
            labelTitleResourceTitle.Location = new Point(45, 0);
            labelTitleResourceTitle.Name = "labelTitleResourceTitle";
            labelTitleResourceTitle.Padding = new Padding(3);
            labelTitleResourceTitle.Size = new Size(35, 21);
            labelTitleResourceTitle.TabIndex = 0;
            labelTitleResourceTitle.Text = "Title";
            // 
            // iconLabelResourceTitle
            // 
            iconLabelResourceTitle.AutoSize = true;
            iconLabelResourceTitle.Dock = DockStyle.Right;
            iconLabelResourceTitle.Location = new Point(80, 0);
            iconLabelResourceTitle.Name = "iconLabelResourceTitle";
            iconLabelResourceTitle.Padding = new Padding(3);
            iconLabelResourceTitle.Size = new Size(20, 21);
            iconLabelResourceTitle.TabIndex = 0;
            iconLabelResourceTitle.Text = "R";
            iconLabelResourceTitle.Click += IconLabelResourceTitle_Click;
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
            labelTitleResourceUrl.Location = new Point(52, 0);
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
            iconLabelResourceUrl.Location = new Point(80, 0);
            iconLabelResourceUrl.Name = "iconLabelResourceUrl";
            iconLabelResourceUrl.Padding = new Padding(3);
            iconLabelResourceUrl.Size = new Size(20, 21);
            iconLabelResourceUrl.TabIndex = 0;
            iconLabelResourceUrl.Text = "R";
            iconLabelResourceUrl.Click += IconLabelResourceUrl_Click;
            // 
            // panelResourceMdLink
            // 
            panelResourceMdLink.Controls.Add(textBoxResourceMdLink);
            panelResourceMdLink.Controls.Add(checkBoxAutoCopyResourceMdLinkToClipboard);
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
            textBoxResourceMdLink.Size = new Size(1343, 23);
            textBoxResourceMdLink.TabIndex = 3;
            textBoxResourceMdLink.KeyUp += TextBoxResourceMdLink_KeyUp;
            // 
            // checkBoxAutoCopyResourceMdLinkToClipboard
            // 
            checkBoxAutoCopyResourceMdLinkToClipboard.AutoSize = true;
            checkBoxAutoCopyResourceMdLinkToClipboard.Dock = DockStyle.Right;
            checkBoxAutoCopyResourceMdLinkToClipboard.Location = new Point(1343, 0);
            checkBoxAutoCopyResourceMdLinkToClipboard.Name = "checkBoxAutoCopyResourceMdLinkToClipboard";
            checkBoxAutoCopyResourceMdLinkToClipboard.Size = new Size(153, 23);
            checkBoxAutoCopyResourceMdLinkToClipboard.TabIndex = 0;
            checkBoxAutoCopyResourceMdLinkToClipboard.TabStop = false;
            checkBoxAutoCopyResourceMdLinkToClipboard.Text = "Auto Copy To Clipboard";
            checkBoxAutoCopyResourceMdLinkToClipboard.UseVisualStyleBackColor = true;
            checkBoxAutoCopyResourceMdLinkToClipboard.CheckedChanged += CheckBoxAutoCopyResourceMdLinkToClipboard_CheckedChanged;
            // 
            // panelResourceTitle
            // 
            panelResourceTitle.Controls.Add(textBoxResourceTitle);
            panelResourceTitle.Controls.Add(checkBoxAutoCopyResourceTitleToClipboard);
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
            textBoxResourceTitle.Size = new Size(1343, 23);
            textBoxResourceTitle.TabIndex = 2;
            textBoxResourceTitle.KeyUp += TextBoxResourceTitle_KeyUp;
            // 
            // checkBoxAutoCopyResourceTitleToClipboard
            // 
            checkBoxAutoCopyResourceTitleToClipboard.AutoSize = true;
            checkBoxAutoCopyResourceTitleToClipboard.Dock = DockStyle.Right;
            checkBoxAutoCopyResourceTitleToClipboard.Location = new Point(1343, 0);
            checkBoxAutoCopyResourceTitleToClipboard.Name = "checkBoxAutoCopyResourceTitleToClipboard";
            checkBoxAutoCopyResourceTitleToClipboard.Size = new Size(153, 23);
            checkBoxAutoCopyResourceTitleToClipboard.TabIndex = 0;
            checkBoxAutoCopyResourceTitleToClipboard.TabStop = false;
            checkBoxAutoCopyResourceTitleToClipboard.Text = "Auto Copy To Clipboard";
            checkBoxAutoCopyResourceTitleToClipboard.UseVisualStyleBackColor = true;
            checkBoxAutoCopyResourceTitleToClipboard.CheckedChanged += CheckBoxAutoCopyResourceTitleToClipboard_CheckedChanged;
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
        private CheckBox checkBoxAutoCopyResourceMdLinkToClipboard;
        private TextBox textBoxResourceMdLink;
        private Panel panelResourceTitle;
        private CheckBox checkBoxAutoCopyResourceTitleToClipboard;
        private TextBox textBoxResourceTitle;
        private Panel panelTitleResourceMdLink;
        private Label labelTitleResourceMdLink;
        private WinForms.Controls.IconLabel iconLabelTitleResourceMdLink;
        private Panel panelTitleResourceTitle;
        private Label labelTitleResourceTitle;
        private WinForms.Controls.IconLabel iconLabelResourceTitle;
    }
}
