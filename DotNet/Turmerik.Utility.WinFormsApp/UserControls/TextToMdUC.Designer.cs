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
            iconLabelEncodeAllHtml = new WinForms.Controls.IconLabel();
            checkBoxInsertSpacesBetweenTokens = new CheckBox();
            iconLabelCopyResultTextToCB = new WinForms.Controls.IconLabel();
            horizontalSplitPanelHtmlEncode = new WinForms.Controls.HorizontalSplitPanel();
            checkBoxAddMdQtLvlAndHtmlEncode = new CheckBox();
            iconLabelAddMdQtLvl = new WinForms.Controls.IconLabel();
            iconLabelHtmlEncode = new WinForms.Controls.IconLabel();
            horizontalSplitPanelResultToCB = new WinForms.Controls.HorizontalSplitPanel();
            checkBoxResultToCB = new CheckBox();
            iconLabelResultToCB = new WinForms.Controls.IconLabel();
            horizontalSplitPanelHtmlDecode = new WinForms.Controls.HorizontalSplitPanel();
            checkBoxRmMdQtLvlAndHtmlDecode = new CheckBox();
            iconLabelRmMdQtLvl = new WinForms.Controls.IconLabel();
            iconLabelHtmlDecode = new WinForms.Controls.IconLabel();
            iconLabelCopySrcTextToCB = new WinForms.Controls.IconLabel();
            checkBoxMdTableSurroundRowWithCellSep = new CheckBox();
            checkBoxMdTableSrcTextIsTabSeparated = new CheckBox();
            panelMdTableSrcTextSep = new Panel();
            textBoxMdTableSrcTextSep = new TextBox();
            checkBoxMdTableFirstLineIsHeader = new CheckBox();
            buttonMdTable = new Button();
            splitContainerTextAreas = new SplitContainer();
            richTextBoxSrcText = new RichTextBox();
            richTextBoxConvertedText = new RichTextBox();
            ((System.ComponentModel.ISupportInitialize)splitContainerMain).BeginInit();
            splitContainerMain.Panel1.SuspendLayout();
            splitContainerMain.Panel2.SuspendLayout();
            splitContainerMain.SuspendLayout();
            panelOptionControls.SuspendLayout();
            horizontalSplitPanelHtmlEncode.SuspendLayout();
            horizontalSplitPanelResultToCB.SuspendLayout();
            horizontalSplitPanelHtmlDecode.SuspendLayout();
            panelMdTableSrcTextSep.SuspendLayout();
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
            splitContainerMain.TabStop = false;
            // 
            // panelOptionControls
            // 
            panelOptionControls.AutoSizeMode = AutoSizeMode.GrowAndShrink;
            panelOptionControls.Controls.Add(iconLabelEncodeAllHtml);
            panelOptionControls.Controls.Add(checkBoxInsertSpacesBetweenTokens);
            panelOptionControls.Controls.Add(iconLabelCopyResultTextToCB);
            panelOptionControls.Controls.Add(horizontalSplitPanelHtmlEncode);
            panelOptionControls.Controls.Add(horizontalSplitPanelResultToCB);
            panelOptionControls.Controls.Add(horizontalSplitPanelHtmlDecode);
            panelOptionControls.Controls.Add(iconLabelCopySrcTextToCB);
            panelOptionControls.Controls.Add(checkBoxMdTableSurroundRowWithCellSep);
            panelOptionControls.Controls.Add(checkBoxMdTableSrcTextIsTabSeparated);
            panelOptionControls.Controls.Add(panelMdTableSrcTextSep);
            panelOptionControls.Controls.Add(checkBoxMdTableFirstLineIsHeader);
            panelOptionControls.Controls.Add(buttonMdTable);
            panelOptionControls.Dock = DockStyle.Top;
            panelOptionControls.Location = new Point(0, 0);
            panelOptionControls.Name = "panelOptionControls";
            panelOptionControls.Padding = new Padding(5, 3, 0, 0);
            panelOptionControls.Size = new Size(1400, 33);
            panelOptionControls.TabIndex = 0;
            // 
            // iconLabelEncodeAllHtml
            // 
            iconLabelEncodeAllHtml.AutoSize = true;
            iconLabelEncodeAllHtml.Dock = DockStyle.Left;
            iconLabelEncodeAllHtml.ForeColor = SystemColors.ControlText;
            iconLabelEncodeAllHtml.Location = new Point(1126, 3);
            iconLabelEncodeAllHtml.Name = "iconLabelEncodeAllHtml";
            iconLabelEncodeAllHtml.Padding = new Padding(0, 5, 0, 0);
            iconLabelEncodeAllHtml.Size = new Size(14, 20);
            iconLabelEncodeAllHtml.TabIndex = 4;
            iconLabelEncodeAllHtml.Text = "R";
            iconLabelEncodeAllHtml.Click += IconLabelEncodeAllHtml_Click;
            // 
            // checkBoxInsertSpacesBetweenTokens
            // 
            checkBoxInsertSpacesBetweenTokens.AutoSize = true;
            checkBoxInsertSpacesBetweenTokens.Dock = DockStyle.Left;
            checkBoxInsertSpacesBetweenTokens.Location = new Point(943, 3);
            checkBoxInsertSpacesBetweenTokens.Name = "checkBoxInsertSpacesBetweenTokens";
            checkBoxInsertSpacesBetweenTokens.Padding = new Padding(5, 5, 0, 0);
            checkBoxInsertSpacesBetweenTokens.Size = new Size(183, 30);
            checkBoxInsertSpacesBetweenTokens.TabIndex = 3;
            checkBoxInsertSpacesBetweenTokens.TabStop = false;
            checkBoxInsertSpacesBetweenTokens.Text = "InsertSpaces Between Tokens";
            checkBoxInsertSpacesBetweenTokens.UseVisualStyleBackColor = true;
            // 
            // iconLabelCopyResultTextToCB
            // 
            iconLabelCopyResultTextToCB.AutoSize = true;
            iconLabelCopyResultTextToCB.Dock = DockStyle.Left;
            iconLabelCopyResultTextToCB.ForeColor = SystemColors.ControlText;
            iconLabelCopyResultTextToCB.Location = new Point(929, 3);
            iconLabelCopyResultTextToCB.Name = "iconLabelCopyResultTextToCB";
            iconLabelCopyResultTextToCB.Padding = new Padding(0, 5, 0, 0);
            iconLabelCopyResultTextToCB.Size = new Size(14, 20);
            iconLabelCopyResultTextToCB.TabIndex = 0;
            iconLabelCopyResultTextToCB.Text = "R";
            iconLabelCopyResultTextToCB.Click += IconLabelCopyResultToCB_Click;
            // 
            // horizontalSplitPanelHtmlEncode
            // 
            horizontalSplitPanelHtmlEncode.Controls.Add(checkBoxAddMdQtLvlAndHtmlEncode);
            horizontalSplitPanelHtmlEncode.Controls.Add(iconLabelAddMdQtLvl);
            horizontalSplitPanelHtmlEncode.Controls.Add(iconLabelHtmlEncode);
            horizontalSplitPanelHtmlEncode.Dock = DockStyle.Left;
            horizontalSplitPanelHtmlEncode.Location = new Point(804, 3);
            horizontalSplitPanelHtmlEncode.Name = "horizontalSplitPanelHtmlEncode";
            horizontalSplitPanelHtmlEncode.Padding = new Padding(1);
            horizontalSplitPanelHtmlEncode.Size = new Size(125, 30);
            horizontalSplitPanelHtmlEncode.TabIndex = 0;
            // 
            // checkBoxAddMdQtLvlAndHtmlEncode
            // 
            checkBoxAddMdQtLvlAndHtmlEncode.AutoSize = true;
            checkBoxAddMdQtLvlAndHtmlEncode.Dock = DockStyle.Fill;
            checkBoxAddMdQtLvlAndHtmlEncode.Location = new Point(15, 1);
            checkBoxAddMdQtLvlAndHtmlEncode.Name = "checkBoxAddMdQtLvlAndHtmlEncode";
            checkBoxAddMdQtLvlAndHtmlEncode.Padding = new Padding(10, 5, 0, 0);
            checkBoxAddMdQtLvlAndHtmlEncode.Size = new Size(95, 28);
            checkBoxAddMdQtLvlAndHtmlEncode.TabIndex = 0;
            checkBoxAddMdQtLvlAndHtmlEncode.TabStop = false;
            checkBoxAddMdQtLvlAndHtmlEncode.Text = "and";
            checkBoxAddMdQtLvlAndHtmlEncode.UseVisualStyleBackColor = true;
            // 
            // iconLabelAddMdQtLvl
            // 
            iconLabelAddMdQtLvl.AutoSize = true;
            iconLabelAddMdQtLvl.Dock = DockStyle.Left;
            iconLabelAddMdQtLvl.ForeColor = SystemColors.ControlText;
            iconLabelAddMdQtLvl.Location = new Point(1, 1);
            iconLabelAddMdQtLvl.Name = "iconLabelAddMdQtLvl";
            iconLabelAddMdQtLvl.Padding = new Padding(0, 5, 0, 0);
            iconLabelAddMdQtLvl.Size = new Size(14, 20);
            iconLabelAddMdQtLvl.TabIndex = 0;
            iconLabelAddMdQtLvl.Text = "R";
            iconLabelAddMdQtLvl.Click += IconLabelAddMdQtLvl_Click;
            // 
            // iconLabelHtmlEncode
            // 
            iconLabelHtmlEncode.AutoSize = true;
            iconLabelHtmlEncode.Dock = DockStyle.Right;
            iconLabelHtmlEncode.ForeColor = SystemColors.ControlText;
            iconLabelHtmlEncode.Location = new Point(110, 1);
            iconLabelHtmlEncode.Name = "iconLabelHtmlEncode";
            iconLabelHtmlEncode.Padding = new Padding(0, 5, 0, 0);
            iconLabelHtmlEncode.Size = new Size(14, 20);
            iconLabelHtmlEncode.TabIndex = 0;
            iconLabelHtmlEncode.Text = "R";
            iconLabelHtmlEncode.Click += IconLabelHtmlEncode_Click;
            // 
            // horizontalSplitPanelResultToCB
            // 
            horizontalSplitPanelResultToCB.Controls.Add(checkBoxResultToCB);
            horizontalSplitPanelResultToCB.Controls.Add(iconLabelResultToCB);
            horizontalSplitPanelResultToCB.Dock = DockStyle.Left;
            horizontalSplitPanelResultToCB.Location = new Point(682, 3);
            horizontalSplitPanelResultToCB.Name = "horizontalSplitPanelResultToCB";
            horizontalSplitPanelResultToCB.Padding = new Padding(1);
            horizontalSplitPanelResultToCB.Size = new Size(122, 30);
            horizontalSplitPanelResultToCB.TabIndex = 0;
            // 
            // checkBoxResultToCB
            // 
            checkBoxResultToCB.AutoSize = true;
            checkBoxResultToCB.Cursor = Cursors.Hand;
            checkBoxResultToCB.Dock = DockStyle.Left;
            checkBoxResultToCB.Location = new Point(1, 1);
            checkBoxResultToCB.Name = "checkBoxResultToCB";
            checkBoxResultToCB.Padding = new Padding(5, 5, 0, 0);
            checkBoxResultToCB.Size = new Size(83, 28);
            checkBoxResultToCB.TabIndex = 0;
            checkBoxResultToCB.TabStop = false;
            checkBoxResultToCB.Text = "Results To";
            checkBoxResultToCB.UseVisualStyleBackColor = true;
            // 
            // iconLabelResultToCB
            // 
            iconLabelResultToCB.AutoSize = true;
            iconLabelResultToCB.Dock = DockStyle.Right;
            iconLabelResultToCB.ForeColor = SystemColors.ControlText;
            iconLabelResultToCB.Location = new Point(107, 1);
            iconLabelResultToCB.Name = "iconLabelResultToCB";
            iconLabelResultToCB.Padding = new Padding(0, 5, 0, 0);
            iconLabelResultToCB.Size = new Size(14, 20);
            iconLabelResultToCB.TabIndex = 0;
            iconLabelResultToCB.Text = "R";
            iconLabelResultToCB.Click += IconLabelResultsToCB_Click;
            // 
            // horizontalSplitPanelHtmlDecode
            // 
            horizontalSplitPanelHtmlDecode.Controls.Add(checkBoxRmMdQtLvlAndHtmlDecode);
            horizontalSplitPanelHtmlDecode.Controls.Add(iconLabelRmMdQtLvl);
            horizontalSplitPanelHtmlDecode.Controls.Add(iconLabelHtmlDecode);
            horizontalSplitPanelHtmlDecode.Dock = DockStyle.Left;
            horizontalSplitPanelHtmlDecode.Location = new Point(557, 3);
            horizontalSplitPanelHtmlDecode.Name = "horizontalSplitPanelHtmlDecode";
            horizontalSplitPanelHtmlDecode.Padding = new Padding(1);
            horizontalSplitPanelHtmlDecode.Size = new Size(125, 30);
            horizontalSplitPanelHtmlDecode.TabIndex = 0;
            // 
            // checkBoxRmMdQtLvlAndHtmlDecode
            // 
            checkBoxRmMdQtLvlAndHtmlDecode.AutoSize = true;
            checkBoxRmMdQtLvlAndHtmlDecode.Dock = DockStyle.Fill;
            checkBoxRmMdQtLvlAndHtmlDecode.Location = new Point(15, 1);
            checkBoxRmMdQtLvlAndHtmlDecode.Name = "checkBoxRmMdQtLvlAndHtmlDecode";
            checkBoxRmMdQtLvlAndHtmlDecode.Padding = new Padding(10, 5, 0, 0);
            checkBoxRmMdQtLvlAndHtmlDecode.Size = new Size(95, 28);
            checkBoxRmMdQtLvlAndHtmlDecode.TabIndex = 0;
            checkBoxRmMdQtLvlAndHtmlDecode.TabStop = false;
            checkBoxRmMdQtLvlAndHtmlDecode.Text = "and";
            checkBoxRmMdQtLvlAndHtmlDecode.UseVisualStyleBackColor = true;
            // 
            // iconLabelRmMdQtLvl
            // 
            iconLabelRmMdQtLvl.AutoSize = true;
            iconLabelRmMdQtLvl.Dock = DockStyle.Left;
            iconLabelRmMdQtLvl.ForeColor = SystemColors.ControlText;
            iconLabelRmMdQtLvl.Location = new Point(1, 1);
            iconLabelRmMdQtLvl.Name = "iconLabelRmMdQtLvl";
            iconLabelRmMdQtLvl.Padding = new Padding(0, 5, 0, 0);
            iconLabelRmMdQtLvl.Size = new Size(14, 20);
            iconLabelRmMdQtLvl.TabIndex = 0;
            iconLabelRmMdQtLvl.Text = "R";
            iconLabelRmMdQtLvl.Click += IconLabelRmMdQtLvl_Click;
            // 
            // iconLabelHtmlDecode
            // 
            iconLabelHtmlDecode.AutoSize = true;
            iconLabelHtmlDecode.Dock = DockStyle.Right;
            iconLabelHtmlDecode.ForeColor = SystemColors.ControlText;
            iconLabelHtmlDecode.Location = new Point(110, 1);
            iconLabelHtmlDecode.Name = "iconLabelHtmlDecode";
            iconLabelHtmlDecode.Padding = new Padding(0, 5, 0, 0);
            iconLabelHtmlDecode.Size = new Size(14, 20);
            iconLabelHtmlDecode.TabIndex = 0;
            iconLabelHtmlDecode.Text = "R";
            iconLabelHtmlDecode.Click += IconLabelHtmlDecode_Click;
            // 
            // iconLabelCopySrcTextToCB
            // 
            iconLabelCopySrcTextToCB.AutoSize = true;
            iconLabelCopySrcTextToCB.Dock = DockStyle.Left;
            iconLabelCopySrcTextToCB.ForeColor = SystemColors.ControlText;
            iconLabelCopySrcTextToCB.Location = new Point(543, 3);
            iconLabelCopySrcTextToCB.Name = "iconLabelCopySrcTextToCB";
            iconLabelCopySrcTextToCB.Padding = new Padding(0, 5, 0, 0);
            iconLabelCopySrcTextToCB.Size = new Size(14, 20);
            iconLabelCopySrcTextToCB.TabIndex = 5;
            iconLabelCopySrcTextToCB.Text = "R";
            iconLabelCopySrcTextToCB.Click += IconLabelCopySrcTextToClipboard_Click;
            // 
            // checkBoxMdTableSurroundRowWithCellSep
            // 
            checkBoxMdTableSurroundRowWithCellSep.AutoSize = true;
            checkBoxMdTableSurroundRowWithCellSep.Dock = DockStyle.Left;
            checkBoxMdTableSurroundRowWithCellSep.Location = new Point(364, 3);
            checkBoxMdTableSurroundRowWithCellSep.Name = "checkBoxMdTableSurroundRowWithCellSep";
            checkBoxMdTableSurroundRowWithCellSep.Padding = new Padding(5, 5, 0, 0);
            checkBoxMdTableSurroundRowWithCellSep.Size = new Size(179, 30);
            checkBoxMdTableSurroundRowWithCellSep.TabIndex = 2;
            checkBoxMdTableSurroundRowWithCellSep.TabStop = false;
            checkBoxMdTableSurroundRowWithCellSep.Text = "Surround Row With Cell Sep";
            checkBoxMdTableSurroundRowWithCellSep.UseVisualStyleBackColor = true;
            // 
            // checkBoxMdTableSrcTextIsTabSeparated
            // 
            checkBoxMdTableSrcTextIsTabSeparated.AutoSize = true;
            checkBoxMdTableSrcTextIsTabSeparated.Dock = DockStyle.Left;
            checkBoxMdTableSrcTextIsTabSeparated.Location = new Point(260, 3);
            checkBoxMdTableSrcTextIsTabSeparated.Name = "checkBoxMdTableSrcTextIsTabSeparated";
            checkBoxMdTableSrcTextIsTabSeparated.Padding = new Padding(5, 5, 0, 0);
            checkBoxMdTableSrcTextIsTabSeparated.Size = new Size(104, 30);
            checkBoxMdTableSrcTextIsTabSeparated.TabIndex = 0;
            checkBoxMdTableSrcTextIsTabSeparated.TabStop = false;
            checkBoxMdTableSrcTextIsTabSeparated.Text = "Tab Separated";
            checkBoxMdTableSrcTextIsTabSeparated.UseVisualStyleBackColor = true;
            // 
            // panelMdTableSrcTextSep
            // 
            panelMdTableSrcTextSep.Controls.Add(textBoxMdTableSrcTextSep);
            panelMdTableSrcTextSep.Dock = DockStyle.Left;
            panelMdTableSrcTextSep.Location = new Point(210, 3);
            panelMdTableSrcTextSep.Name = "panelMdTableSrcTextSep";
            panelMdTableSrcTextSep.Padding = new Padding(5);
            panelMdTableSrcTextSep.Size = new Size(50, 30);
            panelMdTableSrcTextSep.TabIndex = 0;
            // 
            // textBoxMdTableSrcTextSep
            // 
            textBoxMdTableSrcTextSep.Dock = DockStyle.Fill;
            textBoxMdTableSrcTextSep.Location = new Point(5, 5);
            textBoxMdTableSrcTextSep.Name = "textBoxMdTableSrcTextSep";
            textBoxMdTableSrcTextSep.Size = new Size(40, 23);
            textBoxMdTableSrcTextSep.TabIndex = 0;
            textBoxMdTableSrcTextSep.TabStop = false;
            textBoxMdTableSrcTextSep.KeyUp += TextBoxMdTableSrcTextSep_KeyUp;
            // 
            // checkBoxMdTableFirstLineIsHeader
            // 
            checkBoxMdTableFirstLineIsHeader.AutoSize = true;
            checkBoxMdTableFirstLineIsHeader.Dock = DockStyle.Left;
            checkBoxMdTableFirstLineIsHeader.Location = new Point(80, 3);
            checkBoxMdTableFirstLineIsHeader.Name = "checkBoxMdTableFirstLineIsHeader";
            checkBoxMdTableFirstLineIsHeader.Padding = new Padding(5, 5, 0, 0);
            checkBoxMdTableFirstLineIsHeader.Size = new Size(130, 30);
            checkBoxMdTableFirstLineIsHeader.TabIndex = 1;
            checkBoxMdTableFirstLineIsHeader.TabStop = false;
            checkBoxMdTableFirstLineIsHeader.Text = "First Line Is Header";
            checkBoxMdTableFirstLineIsHeader.UseVisualStyleBackColor = true;
            // 
            // buttonMdTable
            // 
            buttonMdTable.Dock = DockStyle.Left;
            buttonMdTable.Location = new Point(5, 3);
            buttonMdTable.Name = "buttonMdTable";
            buttonMdTable.Size = new Size(75, 30);
            buttonMdTable.TabIndex = 0;
            buttonMdTable.TabStop = false;
            buttonMdTable.Text = "Md Table";
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
            richTextBoxSrcText.Size = new Size(700, 296);
            richTextBoxSrcText.TabIndex = 0;
            richTextBoxSrcText.TabStop = false;
            richTextBoxSrcText.Text = "";
            richTextBoxSrcText.KeyUp += RichTextBoxSrcText_KeyUp;
            // 
            // richTextBoxConvertedText
            // 
            richTextBoxConvertedText.AcceptsTab = true;
            richTextBoxConvertedText.Dock = DockStyle.Fill;
            richTextBoxConvertedText.Font = new Font("Consolas", 9F, FontStyle.Bold);
            richTextBoxConvertedText.Location = new Point(0, 0);
            richTextBoxConvertedText.Name = "richTextBoxConvertedText";
            richTextBoxConvertedText.Size = new Size(696, 296);
            richTextBoxConvertedText.TabIndex = 0;
            richTextBoxConvertedText.TabStop = false;
            richTextBoxConvertedText.Text = "";
            richTextBoxConvertedText.KeyUp += RichTextBoxConvertedText_KeyUp;
            // 
            // TextToMdUC
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            Controls.Add(splitContainerMain);
            Name = "TextToMdUC";
            Size = new Size(1400, 600);
            Load += TextToMdUC_Load;
            splitContainerMain.Panel1.ResumeLayout(false);
            splitContainerMain.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)splitContainerMain).EndInit();
            splitContainerMain.ResumeLayout(false);
            panelOptionControls.ResumeLayout(false);
            panelOptionControls.PerformLayout();
            horizontalSplitPanelHtmlEncode.ResumeLayout(false);
            horizontalSplitPanelHtmlEncode.PerformLayout();
            horizontalSplitPanelResultToCB.ResumeLayout(false);
            horizontalSplitPanelResultToCB.PerformLayout();
            horizontalSplitPanelHtmlDecode.ResumeLayout(false);
            horizontalSplitPanelHtmlDecode.PerformLayout();
            panelMdTableSrcTextSep.ResumeLayout(false);
            panelMdTableSrcTextSep.PerformLayout();
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
        private CheckBox checkBoxResultToCB;
        private WinForms.Controls.IconLabel iconLabelResultToCB;
        private WinForms.Controls.HorizontalSplitPanel horizontalSplitPanelResultToCB;
        private Panel panelMdTableSrcTextSep;
        private WinForms.Controls.HorizontalSplitPanel horizontalSplitPanelHtmlEncode;
        private WinForms.Controls.HorizontalSplitPanel horizontalSplitPanelHtmlDecode;
        private WinForms.Controls.IconLabel iconLabelHtmlDecode;
        private WinForms.Controls.IconLabel iconLabelHtmlEncode;
        private WinForms.Controls.IconLabel iconLabelRmMdQtLvl;
        private WinForms.Controls.IconLabel iconLabelAddMdQtLvl;
        private CheckBox checkBoxRmMdQtLvlAndHtmlDecode;
        private CheckBox checkBoxAddMdQtLvlAndHtmlEncode;
        private Button buttonMdTable;
        private WinForms.Controls.IconLabel iconLabelCopyResultTextToCB;
        private CheckBox checkBoxMdTableFirstLineIsHeader;
        private CheckBox checkBoxMdTableSurroundRowWithCellSep;
        private CheckBox checkBoxInsertSpacesBetweenTokens;
        private WinForms.Controls.IconLabel iconLabelEncodeAllHtml;
        private WinForms.Controls.IconLabel iconLabelCopySrcTextToCB;
    }
}
