namespace Turmerik.Utility.WinFormsApp.UserControls
{
    partial class NameToIdnfConverterUC
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
            textBoxName = new TextBox();
            checkBoxNameConvertToCB = new CheckBox();
            iconLabelNameConvertToCB = new WinForms.Controls.IconLabel();
            panelIdnf = new Panel();
            textBoxIndf = new TextBox();
            panelName = new Panel();
            labelTitleName = new Label();
            iconLabelConvertName = new WinForms.Controls.IconLabel();
            labelTitleIdnf = new Label();
            iconLabelIdnfToCB = new WinForms.Controls.IconLabel();
            panelTitleIdnf = new Panel();
            splitContainerMain = new SplitContainer();
            panelTitleName = new Panel();
            panelIdnf.SuspendLayout();
            panelName.SuspendLayout();
            panelTitleIdnf.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)splitContainerMain).BeginInit();
            splitContainerMain.Panel1.SuspendLayout();
            splitContainerMain.Panel2.SuspendLayout();
            splitContainerMain.SuspendLayout();
            panelTitleName.SuspendLayout();
            SuspendLayout();
            // 
            // textBoxName
            // 
            textBoxName.Dock = DockStyle.Fill;
            textBoxName.Location = new Point(0, 0);
            textBoxName.Name = "textBoxName";
            textBoxName.Size = new Size(1496, 23);
            textBoxName.TabIndex = 1;
            textBoxName.KeyUp += TextBoxName_KeyUp;
            // 
            // checkBoxNameConvertToCB
            // 
            checkBoxNameConvertToCB.AutoSize = true;
            checkBoxNameConvertToCB.Cursor = Cursors.Hand;
            checkBoxNameConvertToCB.Dock = DockStyle.Right;
            checkBoxNameConvertToCB.Location = new Point(1394, 0);
            checkBoxNameConvertToCB.Name = "checkBoxNameConvertToCB";
            checkBoxNameConvertToCB.Padding = new Padding(5, 0, 0, 0);
            checkBoxNameConvertToCB.Size = new Size(88, 23);
            checkBoxNameConvertToCB.TabIndex = 0;
            checkBoxNameConvertToCB.TabStop = false;
            checkBoxNameConvertToCB.Text = "Convert To";
            checkBoxNameConvertToCB.UseVisualStyleBackColor = true;
            // 
            // iconLabelNameConvertToCB
            // 
            iconLabelNameConvertToCB.AutoSize = true;
            iconLabelNameConvertToCB.Dock = DockStyle.Right;
            iconLabelNameConvertToCB.ForeColor = SystemColors.ControlText;
            iconLabelNameConvertToCB.Location = new Point(1482, 0);
            iconLabelNameConvertToCB.Name = "iconLabelNameConvertToCB";
            iconLabelNameConvertToCB.Size = new Size(14, 15);
            iconLabelNameConvertToCB.TabIndex = 3;
            iconLabelNameConvertToCB.Text = "R";
            iconLabelNameConvertToCB.Click += IconLabelNameConvertToCB_Click;
            // 
            // panelIdnf
            // 
            panelIdnf.Controls.Add(textBoxIndf);
            panelIdnf.Controls.Add(checkBoxNameConvertToCB);
            panelIdnf.Controls.Add(iconLabelNameConvertToCB);
            panelIdnf.Dock = DockStyle.Top;
            panelIdnf.Location = new Point(0, 23);
            panelIdnf.Name = "panelIdnf";
            panelIdnf.Size = new Size(1496, 23);
            panelIdnf.TabIndex = 1;
            // 
            // textBoxIndf
            // 
            textBoxIndf.Dock = DockStyle.Fill;
            textBoxIndf.Location = new Point(0, 0);
            textBoxIndf.Name = "textBoxIndf";
            textBoxIndf.Size = new Size(1394, 23);
            textBoxIndf.TabIndex = 2;
            textBoxIndf.KeyUp += TextBoxIndf_KeyUp;
            // 
            // panelName
            // 
            panelName.Controls.Add(textBoxName);
            panelName.Dock = DockStyle.Top;
            panelName.Location = new Point(0, 0);
            panelName.Name = "panelName";
            panelName.Size = new Size(1496, 23);
            panelName.TabIndex = 0;
            // 
            // labelTitleName
            // 
            labelTitleName.AutoSize = true;
            labelTitleName.Dock = DockStyle.Right;
            labelTitleName.Location = new Point(41, 0);
            labelTitleName.Name = "labelTitleName";
            labelTitleName.Padding = new Padding(3);
            labelTitleName.Size = new Size(45, 21);
            labelTitleName.TabIndex = 0;
            labelTitleName.Text = "Name";
            // 
            // iconLabelConvertName
            // 
            iconLabelConvertName.AutoSize = true;
            iconLabelConvertName.Dock = DockStyle.Right;
            iconLabelConvertName.Location = new Point(86, 0);
            iconLabelConvertName.Name = "iconLabelConvertName";
            iconLabelConvertName.Size = new Size(14, 15);
            iconLabelConvertName.TabIndex = 0;
            iconLabelConvertName.Text = "R";
            iconLabelConvertName.Click += IconLabelConvertName_Click;
            // 
            // labelTitleIdnf
            // 
            labelTitleIdnf.AutoSize = true;
            labelTitleIdnf.Dock = DockStyle.Right;
            labelTitleIdnf.Location = new Point(26, 0);
            labelTitleIdnf.Name = "labelTitleIdnf";
            labelTitleIdnf.Padding = new Padding(3);
            labelTitleIdnf.Size = new Size(60, 21);
            labelTitleIdnf.TabIndex = 0;
            labelTitleIdnf.Text = "Identifier";
            // 
            // iconLabelIdnfToCB
            // 
            iconLabelIdnfToCB.AutoSize = true;
            iconLabelIdnfToCB.Dock = DockStyle.Right;
            iconLabelIdnfToCB.Location = new Point(86, 0);
            iconLabelIdnfToCB.Name = "iconLabelIdnfToCB";
            iconLabelIdnfToCB.Size = new Size(14, 15);
            iconLabelIdnfToCB.TabIndex = 0;
            iconLabelIdnfToCB.Text = "R";
            iconLabelIdnfToCB.Click += IconLabelIdnfToCB_Click;
            // 
            // panelTitleIdnf
            // 
            panelTitleIdnf.Controls.Add(labelTitleIdnf);
            panelTitleIdnf.Controls.Add(iconLabelIdnfToCB);
            panelTitleIdnf.Dock = DockStyle.Top;
            panelTitleIdnf.Location = new Point(0, 23);
            panelTitleIdnf.Name = "panelTitleIdnf";
            panelTitleIdnf.Size = new Size(100, 23);
            panelTitleIdnf.TabIndex = 2;
            // 
            // splitContainerMain
            // 
            splitContainerMain.Dock = DockStyle.Fill;
            splitContainerMain.Location = new Point(0, 0);
            splitContainerMain.Name = "splitContainerMain";
            // 
            // splitContainerMain.Panel1
            // 
            splitContainerMain.Panel1.Controls.Add(panelTitleIdnf);
            splitContainerMain.Panel1.Controls.Add(panelTitleName);
            // 
            // splitContainerMain.Panel2
            // 
            splitContainerMain.Panel2.Controls.Add(panelIdnf);
            splitContainerMain.Panel2.Controls.Add(panelName);
            splitContainerMain.Size = new Size(1600, 48);
            splitContainerMain.SplitterDistance = 100;
            splitContainerMain.TabIndex = 1;
            splitContainerMain.TabStop = false;
            // 
            // panelTitleName
            // 
            panelTitleName.Controls.Add(labelTitleName);
            panelTitleName.Controls.Add(iconLabelConvertName);
            panelTitleName.Dock = DockStyle.Top;
            panelTitleName.Location = new Point(0, 0);
            panelTitleName.Name = "panelTitleName";
            panelTitleName.Size = new Size(100, 23);
            panelTitleName.TabIndex = 1;
            // 
            // NameToIdnfConverterUC
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            Controls.Add(splitContainerMain);
            Name = "NameToIdnfConverterUC";
            Size = new Size(1600, 48);
            panelIdnf.ResumeLayout(false);
            panelIdnf.PerformLayout();
            panelName.ResumeLayout(false);
            panelName.PerformLayout();
            panelTitleIdnf.ResumeLayout(false);
            panelTitleIdnf.PerformLayout();
            splitContainerMain.Panel1.ResumeLayout(false);
            splitContainerMain.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)splitContainerMain).EndInit();
            splitContainerMain.ResumeLayout(false);
            panelTitleName.ResumeLayout(false);
            panelTitleName.PerformLayout();
            ResumeLayout(false);
        }

        #endregion

        private TextBox textBoxName;
        private CheckBox checkBoxNameConvertToCB;
        private WinForms.Controls.IconLabel iconLabelNameConvertToCB;
        private Panel panelIdnf;
        private TextBox textBoxIndf;
        private Panel panelName;
        private Label labelTitleName;
        private WinForms.Controls.IconLabel iconLabelConvertName;
        private Label labelTitleIdnf;
        private WinForms.Controls.IconLabel iconLabelIdnfToCB;
        private Panel panelTitleIdnf;
        private SplitContainer splitContainerMain;
        private Panel panelTitleName;
    }
}
