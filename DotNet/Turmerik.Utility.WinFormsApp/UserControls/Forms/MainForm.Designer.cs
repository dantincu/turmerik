using Turmerik.Utility.WinFormsApp.UserControls;

namespace Turmerik.Utility.WinFormsApp
{
    partial class MainForm
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
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

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(MainForm));
            statusStripMain = new StatusStrip();
            toolStripStatusLabelMain = new ToolStripStatusLabel();
            tabControlMain = new TabControl();
            tabPageTextUtils = new TabPage();
            textUtilsUC = new TextUtilsUC();
            tabPageTextTransform = new TabPage();
            textTransformUC = new TextTransformUC();
            tabPageOpenMultipleLinks = new TabPage();
            openMultipleLinksuc1 = new OpenMultipleLinksUC();
            tabPageFetchMultipleLinks = new TabPage();
            fetchMultipleLinksuc1 = new FetchMultipleLinksUC();
            menuStripMain = new MenuStrip();
            textUtilsActionsToolStripMenuItem = new ToolStripMenuItem();
            goToWebResourceUrlToolStripMenuItem = new ToolStripMenuItem();
            goToMarkdownSourceTextToolStripMenuItem = new ToolStripMenuItem();
            goToMarkdownResultTextToolStripMenuItem = new ToolStripMenuItem();
            textTransformActionsToolStripMenuItem = new ToolStripMenuItem();
            goToTextTransformSrcTextBoxToolStripMenuItem = new ToolStripMenuItem();
            helpToolStripMenuItem = new ToolStripMenuItem();
            toolStripMenuItemShowHints = new ToolStripMenuItem();
            toolStripComboBoxShowHints = new ToolStripComboBox();
            startAppRecoveryToolToolStripMenuItem = new ToolStripMenuItem();
            panelCustomCommand = new Panel();
            textBoxCustomCommand = new TextBox();
            labelTitleCustomCommand = new Label();
            statusStripMain.SuspendLayout();
            tabControlMain.SuspendLayout();
            tabPageTextUtils.SuspendLayout();
            tabPageTextTransform.SuspendLayout();
            tabPageOpenMultipleLinks.SuspendLayout();
            tabPageFetchMultipleLinks.SuspendLayout();
            menuStripMain.SuspendLayout();
            panelCustomCommand.SuspendLayout();
            SuspendLayout();
            // 
            // statusStripMain
            // 
            statusStripMain.Items.AddRange(new ToolStripItem[] { toolStripStatusLabelMain });
            statusStripMain.Location = new Point(0, 878);
            statusStripMain.Name = "statusStripMain";
            statusStripMain.Size = new Size(1800, 22);
            statusStripMain.TabIndex = 1;
            // 
            // toolStripStatusLabelMain
            // 
            toolStripStatusLabelMain.Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            toolStripStatusLabelMain.Name = "toolStripStatusLabelMain";
            toolStripStatusLabelMain.Size = new Size(0, 17);
            // 
            // tabControlMain
            // 
            tabControlMain.Controls.Add(tabPageTextUtils);
            tabControlMain.Controls.Add(tabPageTextTransform);
            tabControlMain.Controls.Add(tabPageOpenMultipleLinks);
            tabControlMain.Controls.Add(tabPageFetchMultipleLinks);
            tabControlMain.Dock = DockStyle.Fill;
            tabControlMain.Font = new Font("Arial", 10F, FontStyle.Bold, GraphicsUnit.Point, 0);
            tabControlMain.Location = new Point(0, 47);
            tabControlMain.Name = "tabControlMain";
            tabControlMain.SelectedIndex = 0;
            tabControlMain.Size = new Size(1800, 831);
            tabControlMain.TabIndex = 2;
            tabControlMain.SelectedIndexChanged += TabControlMain_SelectedIndexChanged;
            // 
            // tabPageTextUtils
            // 
            tabPageTextUtils.Controls.Add(textUtilsUC);
            tabPageTextUtils.Location = new Point(4, 25);
            tabPageTextUtils.Name = "tabPageTextUtils";
            tabPageTextUtils.Padding = new Padding(3);
            tabPageTextUtils.Size = new Size(1792, 802);
            tabPageTextUtils.TabIndex = 0;
            tabPageTextUtils.Text = "Text Utils";
            tabPageTextUtils.UseVisualStyleBackColor = true;
            // 
            // textUtilsUC
            // 
            textUtilsUC.Dock = DockStyle.Fill;
            textUtilsUC.Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            textUtilsUC.Location = new Point(3, 3);
            textUtilsUC.Name = "textUtilsUC";
            textUtilsUC.Size = new Size(1786, 796);
            textUtilsUC.TabIndex = 0;
            // 
            // tabPageTextTransform
            // 
            tabPageTextTransform.Controls.Add(textTransformUC);
            tabPageTextTransform.Location = new Point(4, 25);
            tabPageTextTransform.Name = "tabPageTextTransform";
            tabPageTextTransform.Size = new Size(192, 71);
            tabPageTextTransform.TabIndex = 1;
            tabPageTextTransform.Text = "Text Transform";
            tabPageTextTransform.UseVisualStyleBackColor = true;
            // 
            // textTransformUC
            // 
            textTransformUC.Dock = DockStyle.Fill;
            textTransformUC.Location = new Point(0, 0);
            textTransformUC.Name = "textTransformUC";
            textTransformUC.Size = new Size(192, 71);
            textTransformUC.TabIndex = 0;
            // 
            // tabPageOpenMultipleLinks
            // 
            tabPageOpenMultipleLinks.Controls.Add(openMultipleLinksuc1);
            tabPageOpenMultipleLinks.Location = new Point(4, 25);
            tabPageOpenMultipleLinks.Name = "tabPageOpenMultipleLinks";
            tabPageOpenMultipleLinks.Size = new Size(192, 71);
            tabPageOpenMultipleLinks.TabIndex = 2;
            tabPageOpenMultipleLinks.Text = "Open Multiple Links";
            tabPageOpenMultipleLinks.UseVisualStyleBackColor = true;
            // 
            // openMultipleLinksuc1
            // 
            openMultipleLinksuc1.Dock = DockStyle.Fill;
            openMultipleLinksuc1.Location = new Point(0, 0);
            openMultipleLinksuc1.Name = "openMultipleLinksuc1";
            openMultipleLinksuc1.Size = new Size(192, 71);
            openMultipleLinksuc1.TabIndex = 0;
            // 
            // tabPageFetchMultipleLinks
            // 
            tabPageFetchMultipleLinks.Controls.Add(fetchMultipleLinksuc1);
            tabPageFetchMultipleLinks.Location = new Point(4, 25);
            tabPageFetchMultipleLinks.Name = "tabPageFetchMultipleLinks";
            tabPageFetchMultipleLinks.Size = new Size(192, 71);
            tabPageFetchMultipleLinks.TabIndex = 3;
            tabPageFetchMultipleLinks.Text = "Fetch Multiple Links";
            tabPageFetchMultipleLinks.UseVisualStyleBackColor = true;
            // 
            // fetchMultipleLinksuc1
            // 
            fetchMultipleLinksuc1.Dock = DockStyle.Fill;
            fetchMultipleLinksuc1.Location = new Point(0, 0);
            fetchMultipleLinksuc1.Name = "fetchMultipleLinksuc1";
            fetchMultipleLinksuc1.Size = new Size(192, 71);
            fetchMultipleLinksuc1.TabIndex = 0;
            // 
            // menuStripMain
            // 
            menuStripMain.Items.AddRange(new ToolStripItem[] { textUtilsActionsToolStripMenuItem, textTransformActionsToolStripMenuItem, helpToolStripMenuItem });
            menuStripMain.Location = new Point(0, 0);
            menuStripMain.Name = "menuStripMain";
            menuStripMain.Size = new Size(1800, 24);
            menuStripMain.TabIndex = 3;
            menuStripMain.Text = "menuStrip1";
            // 
            // textUtilsActionsToolStripMenuItem
            // 
            textUtilsActionsToolStripMenuItem.DropDownItems.AddRange(new ToolStripItem[] { goToWebResourceUrlToolStripMenuItem, goToMarkdownSourceTextToolStripMenuItem, goToMarkdownResultTextToolStripMenuItem });
            textUtilsActionsToolStripMenuItem.Name = "textUtilsActionsToolStripMenuItem";
            textUtilsActionsToolStripMenuItem.Size = new Size(59, 20);
            textUtilsActionsToolStripMenuItem.Text = "&Actions";
            // 
            // goToWebResourceUrlToolStripMenuItem
            // 
            goToWebResourceUrlToolStripMenuItem.Name = "goToWebResourceUrlToolStripMenuItem";
            goToWebResourceUrlToolStripMenuItem.Size = new Size(228, 22);
            goToWebResourceUrlToolStripMenuItem.Text = "Go To &Web Resource Url";
            goToWebResourceUrlToolStripMenuItem.Click += GoToWebResourceUrlToolStripMenuItem_Click;
            // 
            // goToMarkdownSourceTextToolStripMenuItem
            // 
            goToMarkdownSourceTextToolStripMenuItem.Name = "goToMarkdownSourceTextToolStripMenuItem";
            goToMarkdownSourceTextToolStripMenuItem.Size = new Size(228, 22);
            goToMarkdownSourceTextToolStripMenuItem.Text = "Go To Markdown &Source Text";
            goToMarkdownSourceTextToolStripMenuItem.Click += GoToMarkdownSourceTextToolStripMenuItem_Click;
            // 
            // goToMarkdownResultTextToolStripMenuItem
            // 
            goToMarkdownResultTextToolStripMenuItem.Name = "goToMarkdownResultTextToolStripMenuItem";
            goToMarkdownResultTextToolStripMenuItem.Size = new Size(228, 22);
            goToMarkdownResultTextToolStripMenuItem.Text = "Go To Markdown &Result Text";
            goToMarkdownResultTextToolStripMenuItem.Click += GoToMarkdownResultTextToolStripMenuItem_Click;
            // 
            // textTransformActionsToolStripMenuItem
            // 
            textTransformActionsToolStripMenuItem.DropDownItems.AddRange(new ToolStripItem[] { goToTextTransformSrcTextBoxToolStripMenuItem });
            textTransformActionsToolStripMenuItem.Name = "textTransformActionsToolStripMenuItem";
            textTransformActionsToolStripMenuItem.Size = new Size(59, 20);
            textTransformActionsToolStripMenuItem.Text = "&Actions";
            // 
            // goToTextTransformSrcTextBoxToolStripMenuItem
            // 
            goToTextTransformSrcTextBoxToolStripMenuItem.Name = "goToTextTransformSrcTextBoxToolStripMenuItem";
            goToTextTransformSrcTextBoxToolStripMenuItem.Size = new Size(167, 22);
            goToTextTransformSrcTextBoxToolStripMenuItem.Text = "Go To &Src TextBox";
            goToTextTransformSrcTextBoxToolStripMenuItem.Click += GoToTextTransformSrcTextBoxToolStripMenuItem_Click;
            // 
            // helpToolStripMenuItem
            // 
            helpToolStripMenuItem.DropDownItems.AddRange(new ToolStripItem[] { toolStripMenuItemShowHints, startAppRecoveryToolToolStripMenuItem });
            helpToolStripMenuItem.Name = "helpToolStripMenuItem";
            helpToolStripMenuItem.Size = new Size(44, 20);
            helpToolStripMenuItem.Text = "&Help";
            // 
            // toolStripMenuItemShowHints
            // 
            toolStripMenuItemShowHints.DropDownItems.AddRange(new ToolStripItem[] { toolStripComboBoxShowHints });
            toolStripMenuItemShowHints.Name = "toolStripMenuItemShowHints";
            toolStripMenuItemShowHints.Size = new Size(200, 22);
            toolStripMenuItemShowHints.Text = "Show &Hints";
            // 
            // toolStripComboBoxShowHints
            // 
            toolStripComboBoxShowHints.DropDownStyle = ComboBoxStyle.DropDownList;
            toolStripComboBoxShowHints.Name = "toolStripComboBoxShowHints";
            toolStripComboBoxShowHints.Size = new Size(100, 23);
            toolStripComboBoxShowHints.SelectedIndexChanged += ToolStripComboBoxShowHints_SelectedIndexChanged;
            // 
            // startAppRecoveryToolToolStripMenuItem
            // 
            startAppRecoveryToolToolStripMenuItem.Name = "startAppRecoveryToolToolStripMenuItem";
            startAppRecoveryToolToolStripMenuItem.Size = new Size(200, 22);
            startAppRecoveryToolToolStripMenuItem.Text = "Start App Recovery Tool";
            startAppRecoveryToolToolStripMenuItem.Click += StartAppRecoveryToolToolStripMenuItem_Click;
            // 
            // panelCustomCommand
            // 
            panelCustomCommand.Controls.Add(textBoxCustomCommand);
            panelCustomCommand.Controls.Add(labelTitleCustomCommand);
            panelCustomCommand.Dock = DockStyle.Top;
            panelCustomCommand.Location = new Point(0, 24);
            panelCustomCommand.Name = "panelCustomCommand";
            panelCustomCommand.Size = new Size(1800, 23);
            panelCustomCommand.TabIndex = 4;
            // 
            // textBoxCustomCommand
            // 
            textBoxCustomCommand.Dock = DockStyle.Fill;
            textBoxCustomCommand.Location = new Point(179, 0);
            textBoxCustomCommand.Name = "textBoxCustomCommand";
            textBoxCustomCommand.Size = new Size(1621, 23);
            textBoxCustomCommand.TabIndex = 1;
            textBoxCustomCommand.KeyDown += TextBoxCustomCommand_KeyDown;
            textBoxCustomCommand.KeyPress += TextBoxCustomCommand_KeyPress;
            // 
            // labelTitleCustomCommand
            // 
            labelTitleCustomCommand.AutoSize = true;
            labelTitleCustomCommand.Dock = DockStyle.Left;
            labelTitleCustomCommand.Location = new Point(0, 0);
            labelTitleCustomCommand.Name = "labelTitleCustomCommand";
            labelTitleCustomCommand.Padding = new Padding(3);
            labelTitleCustomCommand.Size = new Size(179, 21);
            labelTitleCustomCommand.TabIndex = 0;
            labelTitleCustomCommand.Text = "Custom Command (Ctrl + F12)";
            // 
            // MainForm
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(1800, 900);
            Controls.Add(tabControlMain);
            Controls.Add(panelCustomCommand);
            Controls.Add(statusStripMain);
            Controls.Add(menuStripMain);
            Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            Icon = (Icon)resources.GetObject("$this.Icon");
            Name = "MainForm";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "Turmerik Utility";
            Load += MainForm_Load;
            Shown += MainForm_Shown;
            ResizeEnd += MainForm_ResizeEnd;
            KeyDown += MainForm_KeyDown;
            KeyUp += MainForm_KeyUp;
            Move += MainForm_Move;
            statusStripMain.ResumeLayout(false);
            statusStripMain.PerformLayout();
            tabControlMain.ResumeLayout(false);
            tabPageTextUtils.ResumeLayout(false);
            tabPageTextTransform.ResumeLayout(false);
            tabPageOpenMultipleLinks.ResumeLayout(false);
            tabPageFetchMultipleLinks.ResumeLayout(false);
            menuStripMain.ResumeLayout(false);
            menuStripMain.PerformLayout();
            panelCustomCommand.ResumeLayout(false);
            panelCustomCommand.PerformLayout();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private StatusStrip statusStripMain;
        private ToolStripStatusLabel toolStripStatusLabelMain;
        private TabControl tabControlMain;
        private TabPage tabPageTextUtils;
        private UserControls.TextUtilsUC textUtilsUC;
        private MenuStrip menuStripMain;
        private ToolStripMenuItem helpToolStripMenuItem;
        private ToolStripMenuItem toolStripMenuItemShowHints;
        private ToolStripComboBox toolStripComboBoxShowHints;
        private ToolStripMenuItem startAppRecoveryToolToolStripMenuItem;
        private ToolStripMenuItem textUtilsActionsToolStripMenuItem;
        private ToolStripMenuItem goToWebResourceUrlToolStripMenuItem;
        private ToolStripMenuItem goToMarkdownSourceTextToolStripMenuItem;
        private ToolStripMenuItem goToMarkdownResultTextToolStripMenuItem;
        private TabPage tabPageTextTransform;
        private UserControls.TextTransformUC textTransformUC;
        private ToolStripMenuItem textTransformActionsToolStripMenuItem;
        private ToolStripMenuItem goToTextTransformSrcTextBoxToolStripMenuItem;
        private TabPage tabPageOpenMultipleLinks;
        private UserControls.OpenMultipleLinksUC openMultipleLinksuc1;
        private Panel panelCustomCommand;
        private Label labelTitleCustomCommand;
        private TextBox textBoxCustomCommand;
        private TabPage tabPageFetchMultipleLinks;
        private UserControls.FetchMultipleLinksUC fetchMultipleLinksuc1;
    }
}
