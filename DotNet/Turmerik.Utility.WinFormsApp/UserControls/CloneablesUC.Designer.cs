namespace Turmerik.Utility.WinFormsApp.UserControls
{
    partial class CloneablesUC
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
            richTextBoxResultText = new RichTextBox();
            splitContainerTextAreas = new SplitContainer();
            richTextBoxSrcText = new RichTextBox();
            splitContainerMain = new SplitContainer();
            panelOptionControls = new Panel();
            buttonGenerateCloneables = new Button();
            panelMtblClassNameSuffix = new Panel();
            textBoxMtblClassNameSuffix = new TextBox();
            panelMtblClassName = new Panel();
            textBoxMtblClassName = new TextBox();
            panelImmtblClassNameSuffix = new Panel();
            textBoxImmtblClassNameSuffix = new TextBox();
            panelImmtblClassName = new Panel();
            textBoxImmtblClassName = new TextBox();
            panelStaticClassName = new Panel();
            textBoxStaticClassName = new TextBox();
            iconLabelRefreshAllTypeNames = new WinForms.Controls.IconLabel();
            iconLabelClearAllTypeNames = new WinForms.Controls.IconLabel();
            panelCodeType = new Panel();
            comboBoxCodeType = new ComboBox();
            ((System.ComponentModel.ISupportInitialize)splitContainerTextAreas).BeginInit();
            splitContainerTextAreas.Panel1.SuspendLayout();
            splitContainerTextAreas.Panel2.SuspendLayout();
            splitContainerTextAreas.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)splitContainerMain).BeginInit();
            splitContainerMain.Panel1.SuspendLayout();
            splitContainerMain.Panel2.SuspendLayout();
            splitContainerMain.SuspendLayout();
            panelOptionControls.SuspendLayout();
            panelMtblClassNameSuffix.SuspendLayout();
            panelMtblClassName.SuspendLayout();
            panelImmtblClassNameSuffix.SuspendLayout();
            panelImmtblClassName.SuspendLayout();
            panelStaticClassName.SuspendLayout();
            panelCodeType.SuspendLayout();
            SuspendLayout();
            // 
            // richTextBoxResultText
            // 
            richTextBoxResultText.AcceptsTab = true;
            richTextBoxResultText.Dock = DockStyle.Fill;
            richTextBoxResultText.Font = new Font("Consolas", 9F, FontStyle.Bold);
            richTextBoxResultText.Location = new Point(0, 0);
            richTextBoxResultText.Name = "richTextBoxResultText";
            richTextBoxResultText.Size = new Size(796, 763);
            richTextBoxResultText.TabIndex = 0;
            richTextBoxResultText.TabStop = false;
            richTextBoxResultText.Text = "";
            // 
            // splitContainerTextAreas
            // 
            splitContainerTextAreas.Dock = DockStyle.Fill;
            splitContainerTextAreas.Location = new Point(0, 0);
            splitContainerTextAreas.Name = "splitContainerTextAreas";
            // 
            // splitContainerTextAreas.Panel1
            // 
            splitContainerTextAreas.Panel1.Controls.Add(richTextBoxSrcText);
            // 
            // splitContainerTextAreas.Panel2
            // 
            splitContainerTextAreas.Panel2.Controls.Add(richTextBoxResultText);
            splitContainerTextAreas.Size = new Size(1600, 763);
            splitContainerTextAreas.SplitterDistance = 800;
            splitContainerTextAreas.TabIndex = 0;
            splitContainerTextAreas.TabStop = false;
            // 
            // richTextBoxSrcText
            // 
            richTextBoxSrcText.AcceptsTab = true;
            richTextBoxSrcText.Dock = DockStyle.Fill;
            richTextBoxSrcText.Font = new Font("Consolas", 9F, FontStyle.Bold);
            richTextBoxSrcText.Location = new Point(0, 0);
            richTextBoxSrcText.Name = "richTextBoxSrcText";
            richTextBoxSrcText.Size = new Size(800, 763);
            richTextBoxSrcText.TabIndex = 0;
            richTextBoxSrcText.TabStop = false;
            richTextBoxSrcText.Text = "";
            richTextBoxSrcText.KeyUp += RichTextBoxSrcText_KeyUp;
            // 
            // splitContainerMain
            // 
            splitContainerMain.Dock = DockStyle.Fill;
            splitContainerMain.Location = new Point(0, 0);
            splitContainerMain.Name = "splitContainerMain";
            splitContainerMain.Orientation = Orientation.Horizontal;
            // 
            // splitContainerMain.Panel1
            // 
            splitContainerMain.Panel1.Controls.Add(panelOptionControls);
            // 
            // splitContainerMain.Panel2
            // 
            splitContainerMain.Panel2.Controls.Add(splitContainerTextAreas);
            splitContainerMain.Size = new Size(1600, 800);
            splitContainerMain.SplitterDistance = 33;
            splitContainerMain.TabIndex = 1;
            splitContainerMain.TabStop = false;
            // 
            // panelOptionControls
            // 
            panelOptionControls.Controls.Add(buttonGenerateCloneables);
            panelOptionControls.Controls.Add(panelMtblClassNameSuffix);
            panelOptionControls.Controls.Add(panelMtblClassName);
            panelOptionControls.Controls.Add(panelImmtblClassNameSuffix);
            panelOptionControls.Controls.Add(panelImmtblClassName);
            panelOptionControls.Controls.Add(panelStaticClassName);
            panelOptionControls.Controls.Add(iconLabelRefreshAllTypeNames);
            panelOptionControls.Controls.Add(iconLabelClearAllTypeNames);
            panelOptionControls.Controls.Add(panelCodeType);
            panelOptionControls.Dock = DockStyle.Top;
            panelOptionControls.Location = new Point(0, 0);
            panelOptionControls.Name = "panelOptionControls";
            panelOptionControls.Padding = new Padding(5, 3, 0, 0);
            panelOptionControls.Size = new Size(1600, 33);
            panelOptionControls.TabIndex = 0;
            // 
            // buttonGenerateCloneables
            // 
            buttonGenerateCloneables.Dock = DockStyle.Left;
            buttonGenerateCloneables.Location = new Point(1233, 3);
            buttonGenerateCloneables.Name = "buttonGenerateCloneables";
            buttonGenerateCloneables.Size = new Size(78, 30);
            buttonGenerateCloneables.TabIndex = 4;
            buttonGenerateCloneables.TabStop = false;
            buttonGenerateCloneables.Text = "Generate";
            buttonGenerateCloneables.UseVisualStyleBackColor = true;
            buttonGenerateCloneables.Click += ButtonGenerateCloneables_Click;
            // 
            // panelMtblClassNameSuffix
            // 
            panelMtblClassNameSuffix.Controls.Add(textBoxMtblClassNameSuffix);
            panelMtblClassNameSuffix.Dock = DockStyle.Left;
            panelMtblClassNameSuffix.Location = new Point(1133, 3);
            panelMtblClassNameSuffix.Name = "panelMtblClassNameSuffix";
            panelMtblClassNameSuffix.Padding = new Padding(5);
            panelMtblClassNameSuffix.Size = new Size(100, 30);
            panelMtblClassNameSuffix.TabIndex = 10;
            // 
            // textBoxMtblClassNameSuffix
            // 
            textBoxMtblClassNameSuffix.Dock = DockStyle.Fill;
            textBoxMtblClassNameSuffix.Location = new Point(5, 5);
            textBoxMtblClassNameSuffix.Name = "textBoxMtblClassNameSuffix";
            textBoxMtblClassNameSuffix.Size = new Size(90, 23);
            textBoxMtblClassNameSuffix.TabIndex = 3;
            textBoxMtblClassNameSuffix.TabStop = false;
            textBoxMtblClassNameSuffix.Text = "Mtbl";
            textBoxMtblClassNameSuffix.KeyUp += TextBoxMtblClassNameSuffix_KeyUp;
            // 
            // panelMtblClassName
            // 
            panelMtblClassName.Controls.Add(textBoxMtblClassName);
            panelMtblClassName.Dock = DockStyle.Left;
            panelMtblClassName.Location = new Point(883, 3);
            panelMtblClassName.Name = "panelMtblClassName";
            panelMtblClassName.Padding = new Padding(5);
            panelMtblClassName.Size = new Size(250, 30);
            panelMtblClassName.TabIndex = 0;
            // 
            // textBoxMtblClassName
            // 
            textBoxMtblClassName.Dock = DockStyle.Fill;
            textBoxMtblClassName.Location = new Point(5, 5);
            textBoxMtblClassName.Name = "textBoxMtblClassName";
            textBoxMtblClassName.Size = new Size(240, 23);
            textBoxMtblClassName.TabIndex = 3;
            textBoxMtblClassName.TabStop = false;
            textBoxMtblClassName.KeyUp += TextBoxMutableClassName_KeyUp;
            // 
            // panelImmtblClassNameSuffix
            // 
            panelImmtblClassNameSuffix.Controls.Add(textBoxImmtblClassNameSuffix);
            panelImmtblClassNameSuffix.Dock = DockStyle.Left;
            panelImmtblClassNameSuffix.Location = new Point(783, 3);
            panelImmtblClassNameSuffix.Name = "panelImmtblClassNameSuffix";
            panelImmtblClassNameSuffix.Padding = new Padding(5);
            panelImmtblClassNameSuffix.Size = new Size(100, 30);
            panelImmtblClassNameSuffix.TabIndex = 9;
            // 
            // textBoxImmtblClassNameSuffix
            // 
            textBoxImmtblClassNameSuffix.Dock = DockStyle.Fill;
            textBoxImmtblClassNameSuffix.Location = new Point(5, 5);
            textBoxImmtblClassNameSuffix.Name = "textBoxImmtblClassNameSuffix";
            textBoxImmtblClassNameSuffix.Size = new Size(90, 23);
            textBoxImmtblClassNameSuffix.TabIndex = 3;
            textBoxImmtblClassNameSuffix.TabStop = false;
            textBoxImmtblClassNameSuffix.Text = "Immtbl";
            textBoxImmtblClassNameSuffix.KeyUp += TextBoxImmtblClassNameSuffix_KeyUp;
            // 
            // panelImmtblClassName
            // 
            panelImmtblClassName.Controls.Add(textBoxImmtblClassName);
            panelImmtblClassName.Dock = DockStyle.Left;
            panelImmtblClassName.Location = new Point(533, 3);
            panelImmtblClassName.Name = "panelImmtblClassName";
            panelImmtblClassName.Padding = new Padding(5);
            panelImmtblClassName.Size = new Size(250, 30);
            panelImmtblClassName.TabIndex = 0;
            // 
            // textBoxImmtblClassName
            // 
            textBoxImmtblClassName.Dock = DockStyle.Fill;
            textBoxImmtblClassName.Location = new Point(5, 5);
            textBoxImmtblClassName.Name = "textBoxImmtblClassName";
            textBoxImmtblClassName.Size = new Size(240, 23);
            textBoxImmtblClassName.TabIndex = 2;
            textBoxImmtblClassName.TabStop = false;
            textBoxImmtblClassName.KeyUp += TextBoxImmutableClassName_KeyUp;
            // 
            // panelStaticClassName
            // 
            panelStaticClassName.Controls.Add(textBoxStaticClassName);
            panelStaticClassName.Dock = DockStyle.Left;
            panelStaticClassName.Location = new Point(283, 3);
            panelStaticClassName.Name = "panelStaticClassName";
            panelStaticClassName.Padding = new Padding(5);
            panelStaticClassName.Size = new Size(250, 30);
            panelStaticClassName.TabIndex = 0;
            // 
            // textBoxStaticClassName
            // 
            textBoxStaticClassName.Dock = DockStyle.Fill;
            textBoxStaticClassName.Location = new Point(5, 5);
            textBoxStaticClassName.Name = "textBoxStaticClassName";
            textBoxStaticClassName.Size = new Size(240, 23);
            textBoxStaticClassName.TabIndex = 1;
            textBoxStaticClassName.TabStop = false;
            textBoxStaticClassName.KeyUp += TextBoxStaticClassName_KeyUp;
            // 
            // iconLabelRefreshAllTypeNames
            // 
            iconLabelRefreshAllTypeNames.AutoSize = true;
            iconLabelRefreshAllTypeNames.Dock = DockStyle.Left;
            iconLabelRefreshAllTypeNames.ForeColor = SystemColors.ControlText;
            iconLabelRefreshAllTypeNames.Location = new Point(269, 3);
            iconLabelRefreshAllTypeNames.Name = "iconLabelRefreshAllTypeNames";
            iconLabelRefreshAllTypeNames.Padding = new Padding(0, 5, 0, 0);
            iconLabelRefreshAllTypeNames.Size = new Size(14, 20);
            iconLabelRefreshAllTypeNames.TabIndex = 8;
            iconLabelRefreshAllTypeNames.Text = "R";
            iconLabelRefreshAllTypeNames.Click += IconLabelRefreshAllTypeNames_Click;
            // 
            // iconLabelClearAllTypeNames
            // 
            iconLabelClearAllTypeNames.AutoSize = true;
            iconLabelClearAllTypeNames.Dock = DockStyle.Left;
            iconLabelClearAllTypeNames.ForeColor = SystemColors.ControlText;
            iconLabelClearAllTypeNames.Location = new Point(255, 3);
            iconLabelClearAllTypeNames.Name = "iconLabelClearAllTypeNames";
            iconLabelClearAllTypeNames.Padding = new Padding(0, 5, 0, 0);
            iconLabelClearAllTypeNames.Size = new Size(14, 20);
            iconLabelClearAllTypeNames.TabIndex = 7;
            iconLabelClearAllTypeNames.Text = "R";
            iconLabelClearAllTypeNames.Click += IconLabelClearAllTypeNames_Click;
            // 
            // panelCodeType
            // 
            panelCodeType.Controls.Add(comboBoxCodeType);
            panelCodeType.Dock = DockStyle.Left;
            panelCodeType.Location = new Point(5, 3);
            panelCodeType.Name = "panelCodeType";
            panelCodeType.Padding = new Padding(5);
            panelCodeType.Size = new Size(250, 30);
            panelCodeType.TabIndex = 6;
            // 
            // comboBoxCodeType
            // 
            comboBoxCodeType.Dock = DockStyle.Fill;
            comboBoxCodeType.DropDownStyle = ComboBoxStyle.DropDownList;
            comboBoxCodeType.FormattingEnabled = true;
            comboBoxCodeType.Location = new Point(5, 5);
            comboBoxCodeType.Name = "comboBoxCodeType";
            comboBoxCodeType.Size = new Size(240, 23);
            comboBoxCodeType.TabIndex = 5;
            // 
            // CloneablesUC
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            Controls.Add(splitContainerMain);
            Name = "CloneablesUC";
            Size = new Size(1600, 800);
            Load += CloneablesUC_Load;
            splitContainerTextAreas.Panel1.ResumeLayout(false);
            splitContainerTextAreas.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)splitContainerTextAreas).EndInit();
            splitContainerTextAreas.ResumeLayout(false);
            splitContainerMain.Panel1.ResumeLayout(false);
            splitContainerMain.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)splitContainerMain).EndInit();
            splitContainerMain.ResumeLayout(false);
            panelOptionControls.ResumeLayout(false);
            panelOptionControls.PerformLayout();
            panelMtblClassNameSuffix.ResumeLayout(false);
            panelMtblClassNameSuffix.PerformLayout();
            panelMtblClassName.ResumeLayout(false);
            panelMtblClassName.PerformLayout();
            panelImmtblClassNameSuffix.ResumeLayout(false);
            panelImmtblClassNameSuffix.PerformLayout();
            panelImmtblClassName.ResumeLayout(false);
            panelImmtblClassName.PerformLayout();
            panelStaticClassName.ResumeLayout(false);
            panelStaticClassName.PerformLayout();
            panelCodeType.ResumeLayout(false);
            ResumeLayout(false);
        }

        #endregion

        private RichTextBox richTextBoxResultText;
        private SplitContainer splitContainerTextAreas;
        private RichTextBox richTextBoxSrcText;
        private SplitContainer splitContainerMain;
        private Panel panelOptionControls;
        private Panel panelStaticClassName;
        private TextBox textBoxStaticClassName;
        private Panel panelMtblClassName;
        private TextBox textBoxMtblClassName;
        private Panel panelImmtblClassName;
        private TextBox textBoxImmtblClassName;
        private Button buttonGenerateCloneables;
        private ComboBox comboBoxCodeType;
        private Panel panelCodeType;
        private WinForms.Controls.IconLabel iconLabelRefreshAllTypeNames;
        private WinForms.Controls.IconLabel iconLabelClearAllTypeNames;
        private Panel panelImmtblClassNameSuffix;
        private TextBox textBoxImmtblClassNameSuffix;
        private Panel panelMtblClassNameSuffix;
        private TextBox textBoxMtblClassNameSuffix;
    }
}
