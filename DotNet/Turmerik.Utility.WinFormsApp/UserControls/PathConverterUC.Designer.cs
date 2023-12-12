namespace Turmerik.Utility.WinFormsApp.UserControls
{
    partial class PathConverterUC
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
            panelTitleUnixPath = new Panel();
            labelTitleUnixPath = new Label();
            iconLabelFromUnixPath = new WinForms.Controls.IconLabel();
            panelTitleEscWinPath = new Panel();
            labelTitleEscWinPath = new Label();
            iconLabelFromEscWinPath = new WinForms.Controls.IconLabel();
            panelTitleWinPath = new Panel();
            labelTitleWinPath = new Label();
            iconLabelFromWinPath = new WinForms.Controls.IconLabel();
            panelUnixPath = new Panel();
            textBoxUnixPath = new TextBox();
            checkBoxUnixPathToCB = new CheckBox();
            iconLabelUnixPathToCB = new WinForms.Controls.IconLabel();
            panelEscWinPath = new Panel();
            textBoxEscWinPath = new TextBox();
            checkBoxEscWinPathToCB = new CheckBox();
            iconLabelEscWinPathToCB = new WinForms.Controls.IconLabel();
            panelWinPath = new Panel();
            textBoxWinPath = new TextBox();
            checkBoxWinPathToCB = new CheckBox();
            iconLabelWinPathToCB = new WinForms.Controls.IconLabel();
            ((System.ComponentModel.ISupportInitialize)splitContainerMain).BeginInit();
            splitContainerMain.Panel1.SuspendLayout();
            splitContainerMain.Panel2.SuspendLayout();
            splitContainerMain.SuspendLayout();
            panelTitleUnixPath.SuspendLayout();
            panelTitleEscWinPath.SuspendLayout();
            panelTitleWinPath.SuspendLayout();
            panelUnixPath.SuspendLayout();
            panelEscWinPath.SuspendLayout();
            panelWinPath.SuspendLayout();
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
            splitContainerMain.Panel1.Controls.Add(panelTitleUnixPath);
            splitContainerMain.Panel1.Controls.Add(panelTitleEscWinPath);
            splitContainerMain.Panel1.Controls.Add(panelTitleWinPath);
            // 
            // splitContainerMain.Panel2
            // 
            splitContainerMain.Panel2.Controls.Add(panelUnixPath);
            splitContainerMain.Panel2.Controls.Add(panelEscWinPath);
            splitContainerMain.Panel2.Controls.Add(panelWinPath);
            splitContainerMain.Size = new Size(1600, 72);
            splitContainerMain.SplitterDistance = 150;
            splitContainerMain.TabIndex = 0;
            // 
            // panelTitleUnixPath
            // 
            panelTitleUnixPath.Controls.Add(labelTitleUnixPath);
            panelTitleUnixPath.Controls.Add(iconLabelFromUnixPath);
            panelTitleUnixPath.Dock = DockStyle.Top;
            panelTitleUnixPath.Location = new Point(0, 46);
            panelTitleUnixPath.Name = "panelTitleUnixPath";
            panelTitleUnixPath.Size = new Size(150, 23);
            panelTitleUnixPath.TabIndex = 0;
            // 
            // labelTitleUnixPath
            // 
            labelTitleUnixPath.AutoSize = true;
            labelTitleUnixPath.Dock = DockStyle.Right;
            labelTitleUnixPath.Location = new Point(72, 0);
            labelTitleUnixPath.Name = "labelTitleUnixPath";
            labelTitleUnixPath.Padding = new Padding(3);
            labelTitleUnixPath.Size = new Size(64, 21);
            labelTitleUnixPath.TabIndex = 0;
            labelTitleUnixPath.Text = "Unix Path";
            // 
            // iconLabelFromUnixPath
            // 
            iconLabelFromUnixPath.AutoSize = true;
            iconLabelFromUnixPath.Dock = DockStyle.Right;
            iconLabelFromUnixPath.Location = new Point(136, 0);
            iconLabelFromUnixPath.Name = "iconLabelFromUnixPath";
            iconLabelFromUnixPath.Size = new Size(14, 15);
            iconLabelFromUnixPath.TabIndex = 0;
            iconLabelFromUnixPath.Text = "R";
            iconLabelFromUnixPath.Click += IconLabelFromUnixPath_Click;
            // 
            // panelTitleEscWinPath
            // 
            panelTitleEscWinPath.Controls.Add(labelTitleEscWinPath);
            panelTitleEscWinPath.Controls.Add(iconLabelFromEscWinPath);
            panelTitleEscWinPath.Dock = DockStyle.Top;
            panelTitleEscWinPath.Location = new Point(0, 23);
            panelTitleEscWinPath.Name = "panelTitleEscWinPath";
            panelTitleEscWinPath.Size = new Size(150, 23);
            panelTitleEscWinPath.TabIndex = 0;
            // 
            // labelTitleEscWinPath
            // 
            labelTitleEscWinPath.AutoSize = true;
            labelTitleEscWinPath.Dock = DockStyle.Right;
            labelTitleEscWinPath.Location = new Point(55, 0);
            labelTitleEscWinPath.Name = "labelTitleEscWinPath";
            labelTitleEscWinPath.Padding = new Padding(3);
            labelTitleEscWinPath.Size = new Size(81, 21);
            labelTitleEscWinPath.TabIndex = 0;
            labelTitleEscWinPath.Text = "Esc Win Path";
            // 
            // iconLabelFromEscWinPath
            // 
            iconLabelFromEscWinPath.AutoSize = true;
            iconLabelFromEscWinPath.Dock = DockStyle.Right;
            iconLabelFromEscWinPath.Location = new Point(136, 0);
            iconLabelFromEscWinPath.Name = "iconLabelFromEscWinPath";
            iconLabelFromEscWinPath.Size = new Size(14, 15);
            iconLabelFromEscWinPath.TabIndex = 0;
            iconLabelFromEscWinPath.Text = "R";
            iconLabelFromEscWinPath.Click += IconLabelFromEscWinPath_Click;
            // 
            // panelTitleWinPath
            // 
            panelTitleWinPath.Controls.Add(labelTitleWinPath);
            panelTitleWinPath.Controls.Add(iconLabelFromWinPath);
            panelTitleWinPath.Dock = DockStyle.Top;
            panelTitleWinPath.Location = new Point(0, 0);
            panelTitleWinPath.Name = "panelTitleWinPath";
            panelTitleWinPath.Size = new Size(150, 23);
            panelTitleWinPath.TabIndex = 0;
            // 
            // labelTitleWinPath
            // 
            labelTitleWinPath.AutoSize = true;
            labelTitleWinPath.Dock = DockStyle.Right;
            labelTitleWinPath.Location = new Point(75, 0);
            labelTitleWinPath.Name = "labelTitleWinPath";
            labelTitleWinPath.Padding = new Padding(3);
            labelTitleWinPath.Size = new Size(61, 21);
            labelTitleWinPath.TabIndex = 0;
            labelTitleWinPath.Text = "Win Path";
            // 
            // iconLabelFromWinPath
            // 
            iconLabelFromWinPath.AutoSize = true;
            iconLabelFromWinPath.Dock = DockStyle.Right;
            iconLabelFromWinPath.Location = new Point(136, 0);
            iconLabelFromWinPath.Name = "iconLabelFromWinPath";
            iconLabelFromWinPath.Size = new Size(14, 15);
            iconLabelFromWinPath.TabIndex = 0;
            iconLabelFromWinPath.Text = "R";
            iconLabelFromWinPath.Click += IconLabelFromWinPath_Click;
            // 
            // panelUnixPath
            // 
            panelUnixPath.Controls.Add(textBoxUnixPath);
            panelUnixPath.Controls.Add(checkBoxUnixPathToCB);
            panelUnixPath.Controls.Add(iconLabelUnixPathToCB);
            panelUnixPath.Dock = DockStyle.Top;
            panelUnixPath.Location = new Point(0, 46);
            panelUnixPath.Name = "panelUnixPath";
            panelUnixPath.Size = new Size(1446, 23);
            panelUnixPath.TabIndex = 0;
            // 
            // textBoxUnixPath
            // 
            textBoxUnixPath.Dock = DockStyle.Fill;
            textBoxUnixPath.Location = new Point(0, 0);
            textBoxUnixPath.Name = "textBoxUnixPath";
            textBoxUnixPath.Size = new Size(1344, 23);
            textBoxUnixPath.TabIndex = 2;
            textBoxUnixPath.TabStop = false;
            textBoxUnixPath.KeyUp += TextBoxUnixPath_KeyUp;
            // 
            // checkBoxUnixPathToCB
            // 
            checkBoxUnixPathToCB.AutoSize = true;
            checkBoxUnixPathToCB.Cursor = Cursors.Hand;
            checkBoxUnixPathToCB.Dock = DockStyle.Right;
            checkBoxUnixPathToCB.Location = new Point(1344, 0);
            checkBoxUnixPathToCB.Name = "checkBoxUnixPathToCB";
            checkBoxUnixPathToCB.Padding = new Padding(5, 0, 0, 0);
            checkBoxUnixPathToCB.Size = new Size(88, 23);
            checkBoxUnixPathToCB.TabIndex = 0;
            checkBoxUnixPathToCB.TabStop = false;
            checkBoxUnixPathToCB.Text = "Convert To";
            checkBoxUnixPathToCB.UseVisualStyleBackColor = true;
            // 
            // iconLabelUnixPathToCB
            // 
            iconLabelUnixPathToCB.AutoSize = true;
            iconLabelUnixPathToCB.Dock = DockStyle.Right;
            iconLabelUnixPathToCB.ForeColor = SystemColors.ControlText;
            iconLabelUnixPathToCB.Location = new Point(1432, 0);
            iconLabelUnixPathToCB.Name = "iconLabelUnixPathToCB";
            iconLabelUnixPathToCB.Size = new Size(14, 15);
            iconLabelUnixPathToCB.TabIndex = 0;
            iconLabelUnixPathToCB.Text = "R";
            iconLabelUnixPathToCB.Click += IconLabelUnixPathToCB_Click;
            // 
            // panelEscWinPath
            // 
            panelEscWinPath.Controls.Add(textBoxEscWinPath);
            panelEscWinPath.Controls.Add(checkBoxEscWinPathToCB);
            panelEscWinPath.Controls.Add(iconLabelEscWinPathToCB);
            panelEscWinPath.Dock = DockStyle.Top;
            panelEscWinPath.Location = new Point(0, 23);
            panelEscWinPath.Name = "panelEscWinPath";
            panelEscWinPath.Size = new Size(1446, 23);
            panelEscWinPath.TabIndex = 0;
            // 
            // textBoxEscWinPath
            // 
            textBoxEscWinPath.Dock = DockStyle.Fill;
            textBoxEscWinPath.Location = new Point(0, 0);
            textBoxEscWinPath.Name = "textBoxEscWinPath";
            textBoxEscWinPath.Size = new Size(1344, 23);
            textBoxEscWinPath.TabIndex = 1;
            textBoxEscWinPath.TabStop = false;
            textBoxEscWinPath.KeyUp += TextBoxEscWinPath_KeyUp;
            // 
            // checkBoxEscWinPathToCB
            // 
            checkBoxEscWinPathToCB.AutoSize = true;
            checkBoxEscWinPathToCB.Cursor = Cursors.Hand;
            checkBoxEscWinPathToCB.Dock = DockStyle.Right;
            checkBoxEscWinPathToCB.Location = new Point(1344, 0);
            checkBoxEscWinPathToCB.Name = "checkBoxEscWinPathToCB";
            checkBoxEscWinPathToCB.Padding = new Padding(5, 0, 0, 0);
            checkBoxEscWinPathToCB.Size = new Size(88, 23);
            checkBoxEscWinPathToCB.TabIndex = 0;
            checkBoxEscWinPathToCB.TabStop = false;
            checkBoxEscWinPathToCB.Text = "Convert To";
            checkBoxEscWinPathToCB.UseVisualStyleBackColor = true;
            // 
            // iconLabelEscWinPathToCB
            // 
            iconLabelEscWinPathToCB.AutoSize = true;
            iconLabelEscWinPathToCB.Dock = DockStyle.Right;
            iconLabelEscWinPathToCB.ForeColor = SystemColors.ControlText;
            iconLabelEscWinPathToCB.Location = new Point(1432, 0);
            iconLabelEscWinPathToCB.Name = "iconLabelEscWinPathToCB";
            iconLabelEscWinPathToCB.Size = new Size(14, 15);
            iconLabelEscWinPathToCB.TabIndex = 0;
            iconLabelEscWinPathToCB.Text = "R";
            iconLabelEscWinPathToCB.Click += IconLabelEscWinPathToCB_Click;
            // 
            // panelWinPath
            // 
            panelWinPath.Controls.Add(textBoxWinPath);
            panelWinPath.Controls.Add(checkBoxWinPathToCB);
            panelWinPath.Controls.Add(iconLabelWinPathToCB);
            panelWinPath.Dock = DockStyle.Top;
            panelWinPath.Location = new Point(0, 0);
            panelWinPath.Name = "panelWinPath";
            panelWinPath.Size = new Size(1446, 23);
            panelWinPath.TabIndex = 0;
            // 
            // textBoxWinPath
            // 
            textBoxWinPath.Dock = DockStyle.Fill;
            textBoxWinPath.Location = new Point(0, 0);
            textBoxWinPath.Name = "textBoxWinPath";
            textBoxWinPath.Size = new Size(1344, 23);
            textBoxWinPath.TabIndex = 0;
            textBoxWinPath.TabStop = false;
            textBoxWinPath.KeyUp += TextBoxWinPath_KeyUp;
            // 
            // checkBoxWinPathToCB
            // 
            checkBoxWinPathToCB.AutoSize = true;
            checkBoxWinPathToCB.Cursor = Cursors.Hand;
            checkBoxWinPathToCB.Dock = DockStyle.Right;
            checkBoxWinPathToCB.Location = new Point(1344, 0);
            checkBoxWinPathToCB.Name = "checkBoxWinPathToCB";
            checkBoxWinPathToCB.Padding = new Padding(5, 0, 0, 0);
            checkBoxWinPathToCB.Size = new Size(88, 23);
            checkBoxWinPathToCB.TabIndex = 0;
            checkBoxWinPathToCB.TabStop = false;
            checkBoxWinPathToCB.Text = "Convert To";
            checkBoxWinPathToCB.UseVisualStyleBackColor = true;
            // 
            // iconLabelWinPathToCB
            // 
            iconLabelWinPathToCB.AutoSize = true;
            iconLabelWinPathToCB.Dock = DockStyle.Right;
            iconLabelWinPathToCB.ForeColor = SystemColors.ControlText;
            iconLabelWinPathToCB.Location = new Point(1432, 0);
            iconLabelWinPathToCB.Name = "iconLabelWinPathToCB";
            iconLabelWinPathToCB.Size = new Size(14, 15);
            iconLabelWinPathToCB.TabIndex = 0;
            iconLabelWinPathToCB.Text = "R";
            iconLabelWinPathToCB.Click += IconLabelWinPathToCB_Click;
            // 
            // PathConverterUC
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            Controls.Add(splitContainerMain);
            Name = "PathConverterUC";
            Size = new Size(1600, 72);
            Load += PathConverterUC_Load;
            splitContainerMain.Panel1.ResumeLayout(false);
            splitContainerMain.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)splitContainerMain).EndInit();
            splitContainerMain.ResumeLayout(false);
            panelTitleUnixPath.ResumeLayout(false);
            panelTitleUnixPath.PerformLayout();
            panelTitleEscWinPath.ResumeLayout(false);
            panelTitleEscWinPath.PerformLayout();
            panelTitleWinPath.ResumeLayout(false);
            panelTitleWinPath.PerformLayout();
            panelUnixPath.ResumeLayout(false);
            panelUnixPath.PerformLayout();
            panelEscWinPath.ResumeLayout(false);
            panelEscWinPath.PerformLayout();
            panelWinPath.ResumeLayout(false);
            panelWinPath.PerformLayout();
            ResumeLayout(false);
        }

        #endregion

        private SplitContainer splitContainerMain;
        private Panel panelTitleWinPath;
        private Label labelTitleWinPath;
        private WinForms.Controls.IconLabel iconLabelFromWinPath;
        private Panel panelWinPath;
        private TextBox textBoxWinPath;
        private CheckBox checkBoxWinPathToCB;
        private WinForms.Controls.IconLabel iconLabelWinPathToCB;
        private Panel panelTitleUnixPath;
        private Label labelTitleUnixPath;
        private WinForms.Controls.IconLabel iconLabelFromUnixPath;
        private Panel panelUnixPath;
        private TextBox textBoxUnixPath;
        private CheckBox checkBoxUnixPathToCB;
        private WinForms.Controls.IconLabel iconLabelUnixPathToCB;
        private Panel panelTitleEscWinPath;
        private Label labelTitleEscWinPath;
        private WinForms.Controls.IconLabel iconLabelFromEscWinPath;
        private Panel panelEscWinPath;
        private TextBox textBoxEscWinPath;
        private CheckBox checkBoxEscWinPathToCB;
        private WinForms.Controls.IconLabel iconLabelEscWinPathToCB;
    }
}
