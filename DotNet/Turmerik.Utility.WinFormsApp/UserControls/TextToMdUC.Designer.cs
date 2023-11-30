namespace Turmerik.Utility.WinFormsApp.UserControls
{
    partial class TextToMdUC
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
            panelOptionControls = new Panel();
            checkBoxSrcFromCB = new CheckBox();
            iconLabelSrcFromCB = new WinForms.Controls.IconLabel();
            checkBoxResultsToCB = new CheckBox();
            iconLabelResultsToCB = new WinForms.Controls.IconLabel();
            buttonAddMdQuotedLevel = new Button();
            buttonAddMdQuotedLevelEncode = new Button();
            buttonRmMdQuotedLevel = new Button();
            buttonRmMdQuotedLevelDecode = new Button();
            checkBoxMdTableSrcTextIsTabSeparated = new CheckBox();
            textBoxMdTableSrcTextSep = new TextBox();
            buttonMdTable = new Button();
            splitContainerTextAreas = new SplitContainer();
            richTextBoxSrcText = new RichTextBox();
            richTextBoxConvertedText = new RichTextBox();
            ((System.ComponentModel.ISupportInitialize)splitContainerMain).BeginInit();
            splitContainerMain.Panel1.SuspendLayout();
            splitContainerMain.Panel2.SuspendLayout();
            splitContainerMain.SuspendLayout();
            panelOptionControls.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)splitContainerTextAreas).BeginInit();
            splitContainerTextAreas.Panel1.SuspendLayout();
            splitContainerTextAreas.Panel2.SuspendLayout();
            splitContainerTextAreas.SuspendLayout();
            SuspendLayout();
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
            splitContainerMain.Size = new Size(1400, 600);
            splitContainerMain.SplitterDistance = 300;
            splitContainerMain.TabIndex = 0;
            // 
            // panelOptionControls
            // 
            panelOptionControls.AutoSizeMode = AutoSizeMode.GrowAndShrink;
            panelOptionControls.Controls.Add(checkBoxSrcFromCB);
            panelOptionControls.Controls.Add(iconLabelSrcFromCB);
            panelOptionControls.Controls.Add(checkBoxResultsToCB);
            panelOptionControls.Controls.Add(iconLabelResultsToCB);
            panelOptionControls.Controls.Add(buttonAddMdQuotedLevel);
            panelOptionControls.Controls.Add(buttonAddMdQuotedLevelEncode);
            panelOptionControls.Controls.Add(buttonRmMdQuotedLevel);
            panelOptionControls.Controls.Add(buttonRmMdQuotedLevelDecode);
            panelOptionControls.Controls.Add(checkBoxMdTableSrcTextIsTabSeparated);
            panelOptionControls.Controls.Add(textBoxMdTableSrcTextSep);
            panelOptionControls.Controls.Add(buttonMdTable);
            panelOptionControls.Dock = DockStyle.Top;
            panelOptionControls.Location = new Point(0, 0);
            panelOptionControls.Name = "panelOptionControls";
            panelOptionControls.Padding = new Padding(5);
            panelOptionControls.Size = new Size(1400, 33);
            panelOptionControls.TabIndex = 1;
            // 
            // checkBoxSrcFromCB
            // 
            checkBoxSrcFromCB.AutoSize = true;
            checkBoxSrcFromCB.Cursor = Cursors.Hand;
            checkBoxSrcFromCB.Dock = DockStyle.Right;
            checkBoxSrcFromCB.Location = new Point(630, 5);
            checkBoxSrcFromCB.Name = "checkBoxSrcFromCB";
            checkBoxSrcFromCB.Padding = new Padding(5, 0, 0, 0);
            checkBoxSrcFromCB.Size = new Size(98, 23);
            checkBoxSrcFromCB.TabIndex = 9;
            checkBoxSrcFromCB.TabStop = false;
            checkBoxSrcFromCB.Text = "Source From";
            checkBoxSrcFromCB.UseVisualStyleBackColor = true;
            // 
            // iconLabelSrcFromCB
            // 
            iconLabelSrcFromCB.AutoSize = true;
            iconLabelSrcFromCB.Dock = DockStyle.Right;
            iconLabelSrcFromCB.ForeColor = SystemColors.ControlText;
            iconLabelSrcFromCB.Location = new Point(728, 5);
            iconLabelSrcFromCB.Name = "iconLabelSrcFromCB";
            iconLabelSrcFromCB.Padding = new Padding(0, 0, 50, 0);
            iconLabelSrcFromCB.Size = new Size(64, 15);
            iconLabelSrcFromCB.TabIndex = 10;
            iconLabelSrcFromCB.Text = "R";
            iconLabelSrcFromCB.Click += IconLabelSrcFromCB_Click;
            // 
            // checkBoxResultsToCB
            // 
            checkBoxResultsToCB.AutoSize = true;
            checkBoxResultsToCB.Cursor = Cursors.Hand;
            checkBoxResultsToCB.Dock = DockStyle.Right;
            checkBoxResultsToCB.Location = new Point(792, 5);
            checkBoxResultsToCB.Name = "checkBoxResultsToCB";
            checkBoxResultsToCB.Padding = new Padding(5, 0, 0, 0);
            checkBoxResultsToCB.Size = new Size(83, 23);
            checkBoxResultsToCB.TabIndex = 7;
            checkBoxResultsToCB.TabStop = false;
            checkBoxResultsToCB.Text = "Results To";
            checkBoxResultsToCB.UseVisualStyleBackColor = true;
            // 
            // iconLabelResultsToCB
            // 
            iconLabelResultsToCB.AutoSize = true;
            iconLabelResultsToCB.Dock = DockStyle.Right;
            iconLabelResultsToCB.ForeColor = SystemColors.ControlText;
            iconLabelResultsToCB.Location = new Point(875, 5);
            iconLabelResultsToCB.Name = "iconLabelResultsToCB";
            iconLabelResultsToCB.Padding = new Padding(0, 0, 50, 0);
            iconLabelResultsToCB.Size = new Size(64, 15);
            iconLabelResultsToCB.TabIndex = 8;
            iconLabelResultsToCB.Text = "R";
            iconLabelResultsToCB.Click += IconLabelResultsToCB_Click;
            // 
            // buttonAddMdQuotedLevel
            // 
            buttonAddMdQuotedLevel.Dock = DockStyle.Right;
            buttonAddMdQuotedLevel.Location = new Point(939, 5);
            buttonAddMdQuotedLevel.Name = "buttonAddMdQuotedLevel";
            buttonAddMdQuotedLevel.Size = new Size(92, 23);
            buttonAddMdQuotedLevel.TabIndex = 3;
            buttonAddMdQuotedLevel.Text = "Md Quoted +";
            buttonAddMdQuotedLevel.UseVisualStyleBackColor = true;
            buttonAddMdQuotedLevel.Click += ButtonAddMdQuotedLevel_Click;
            // 
            // buttonAddMdQuotedLevelEncode
            // 
            buttonAddMdQuotedLevelEncode.Dock = DockStyle.Right;
            buttonAddMdQuotedLevelEncode.Location = new Point(1031, 5);
            buttonAddMdQuotedLevelEncode.Name = "buttonAddMdQuotedLevelEncode";
            buttonAddMdQuotedLevelEncode.Size = new Size(137, 23);
            buttonAddMdQuotedLevelEncode.TabIndex = 5;
            buttonAddMdQuotedLevelEncode.Text = "Md Quoted + Encode";
            buttonAddMdQuotedLevelEncode.UseVisualStyleBackColor = true;
            buttonAddMdQuotedLevelEncode.Click += ButtonAddMdQuotedLevelEncode_Click;
            // 
            // buttonRmMdQuotedLevel
            // 
            buttonRmMdQuotedLevel.Dock = DockStyle.Right;
            buttonRmMdQuotedLevel.Location = new Point(1168, 5);
            buttonRmMdQuotedLevel.Name = "buttonRmMdQuotedLevel";
            buttonRmMdQuotedLevel.Size = new Size(91, 23);
            buttonRmMdQuotedLevel.TabIndex = 4;
            buttonRmMdQuotedLevel.Text = "Md Quoted -";
            buttonRmMdQuotedLevel.UseVisualStyleBackColor = true;
            buttonRmMdQuotedLevel.Click += ButtonRmMdQuotedLevel_Click;
            // 
            // buttonRmMdQuotedLevelDecode
            // 
            buttonRmMdQuotedLevelDecode.Dock = DockStyle.Right;
            buttonRmMdQuotedLevelDecode.Location = new Point(1259, 5);
            buttonRmMdQuotedLevelDecode.Name = "buttonRmMdQuotedLevelDecode";
            buttonRmMdQuotedLevelDecode.Size = new Size(136, 23);
            buttonRmMdQuotedLevelDecode.TabIndex = 6;
            buttonRmMdQuotedLevelDecode.Text = "Md Quoted - Decode";
            buttonRmMdQuotedLevelDecode.UseVisualStyleBackColor = true;
            buttonRmMdQuotedLevelDecode.Click += ButtonRmMdQuotedLevelDecode_Click;
            // 
            // checkBoxMdTableSrcTextIsTabSeparated
            // 
            checkBoxMdTableSrcTextIsTabSeparated.AutoSize = true;
            checkBoxMdTableSrcTextIsTabSeparated.Dock = DockStyle.Left;
            checkBoxMdTableSrcTextIsTabSeparated.Location = new Point(104, 5);
            checkBoxMdTableSrcTextIsTabSeparated.Name = "checkBoxMdTableSrcTextIsTabSeparated";
            checkBoxMdTableSrcTextIsTabSeparated.Padding = new Padding(3, 0, 0, 0);
            checkBoxMdTableSrcTextIsTabSeparated.Size = new Size(102, 23);
            checkBoxMdTableSrcTextIsTabSeparated.TabIndex = 2;
            checkBoxMdTableSrcTextIsTabSeparated.Text = "Tab Separated";
            checkBoxMdTableSrcTextIsTabSeparated.UseVisualStyleBackColor = true;
            checkBoxMdTableSrcTextIsTabSeparated.CheckedChanged += CheckBoxMdTableSrcTextIsTabSeparated_CheckedChanged;
            // 
            // textBoxMdTableSrcTextSep
            // 
            textBoxMdTableSrcTextSep.Dock = DockStyle.Left;
            textBoxMdTableSrcTextSep.Location = new Point(78, 5);
            textBoxMdTableSrcTextSep.Name = "textBoxMdTableSrcTextSep";
            textBoxMdTableSrcTextSep.Size = new Size(26, 23);
            textBoxMdTableSrcTextSep.TabIndex = 1;
            textBoxMdTableSrcTextSep.KeyUp += TextBoxMdTableSrcTextSep_KeyUp;
            // 
            // buttonMdTable
            // 
            buttonMdTable.Dock = DockStyle.Left;
            buttonMdTable.Location = new Point(5, 5);
            buttonMdTable.Name = "buttonMdTable";
            buttonMdTable.Size = new Size(73, 23);
            buttonMdTable.TabIndex = 0;
            buttonMdTable.Text = "Md Table From";
            buttonMdTable.UseVisualStyleBackColor = true;
            buttonMdTable.Click += ButtonMdTable_Click;
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
            splitContainerTextAreas.Panel2.Controls.Add(richTextBoxConvertedText);
            splitContainerTextAreas.Size = new Size(1400, 296);
            splitContainerTextAreas.SplitterDistance = 700;
            splitContainerTextAreas.TabIndex = 1;
            // 
            // richTextBoxSrcText
            // 
            richTextBoxSrcText.Dock = DockStyle.Fill;
            richTextBoxSrcText.Font = new Font("Consolas", 9F, FontStyle.Regular, GraphicsUnit.Point, 0);
            richTextBoxSrcText.Location = new Point(0, 0);
            richTextBoxSrcText.Name = "richTextBoxSrcText";
            richTextBoxSrcText.Size = new Size(700, 296);
            richTextBoxSrcText.TabIndex = 0;
            richTextBoxSrcText.Text = "";
            // 
            // richTextBoxConvertedText
            // 
            richTextBoxConvertedText.Dock = DockStyle.Fill;
            richTextBoxConvertedText.Font = new Font("Consolas", 9F, FontStyle.Regular, GraphicsUnit.Point, 0);
            richTextBoxConvertedText.Location = new Point(0, 0);
            richTextBoxConvertedText.Name = "richTextBoxConvertedText";
            richTextBoxConvertedText.Size = new Size(696, 296);
            richTextBoxConvertedText.TabIndex = 1;
            richTextBoxConvertedText.Text = "";
            // 
            // TextToMdUC
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            Controls.Add(splitContainerMain);
            Name = "TextToMdUC";
            Size = new Size(1400, 600);
            splitContainerMain.Panel1.ResumeLayout(false);
            splitContainerMain.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)splitContainerMain).EndInit();
            splitContainerMain.ResumeLayout(false);
            panelOptionControls.ResumeLayout(false);
            panelOptionControls.PerformLayout();
            splitContainerTextAreas.Panel1.ResumeLayout(false);
            splitContainerTextAreas.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)splitContainerTextAreas).EndInit();
            splitContainerTextAreas.ResumeLayout(false);
            ResumeLayout(false);
        }

        #endregion

        private SplitContainer splitContainerMain;
        private SplitContainer splitContainerTextAreas;
        private RichTextBox richTextBoxSrcText;
        private RichTextBox richTextBoxConvertedText;
        private Panel panelOptionControls;
        private TextBox textBoxMdTableSrcTextSep;
        private CheckBox checkBoxMdTableSrcTextIsTabSeparated;
        private Button buttonMdTable;
        private Button buttonAddMdQuotedLevel;
        private Button buttonRmMdQuotedLevel;
        private Button buttonAddMdQuotedLevelEncode;
        private Button buttonRmMdQuotedLevelDecode;
        private CheckBox checkBoxSrcFromCB;
        private WinForms.Controls.IconLabel iconLabelSrcFromCB;
        private CheckBox checkBoxResultsToCB;
        private WinForms.Controls.IconLabel iconLabelResultsToCB;
    }
}
