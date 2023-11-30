﻿namespace Turmerik.Utility.WinFormsApp.UserControls
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
            iconLabelCopyResultToCB = new WinForms.Controls.IconLabel();
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
            horizontalSplitPanelSrcFromCB = new WinForms.Controls.HorizontalSplitPanel();
            iconLabelSrcFromCB = new WinForms.Controls.IconLabel();
            checkBoxSrcFromCB = new CheckBox();
            checkBoxMdTableSrcTextIsTabSeparated = new CheckBox();
            panelMdTableSrcTextSep = new Panel();
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
            horizontalSplitPanelHtmlEncode.SuspendLayout();
            horizontalSplitPanelResultToCB.SuspendLayout();
            horizontalSplitPanelHtmlDecode.SuspendLayout();
            horizontalSplitPanelSrcFromCB.SuspendLayout();
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
            // 
            // panelOptionControls
            // 
            panelOptionControls.AutoSizeMode = AutoSizeMode.GrowAndShrink;
            panelOptionControls.Controls.Add(iconLabelCopyResultToCB);
            panelOptionControls.Controls.Add(horizontalSplitPanelHtmlEncode);
            panelOptionControls.Controls.Add(horizontalSplitPanelResultToCB);
            panelOptionControls.Controls.Add(horizontalSplitPanelHtmlDecode);
            panelOptionControls.Controls.Add(horizontalSplitPanelSrcFromCB);
            panelOptionControls.Controls.Add(checkBoxMdTableSrcTextIsTabSeparated);
            panelOptionControls.Controls.Add(panelMdTableSrcTextSep);
            panelOptionControls.Controls.Add(buttonMdTable);
            panelOptionControls.Dock = DockStyle.Top;
            panelOptionControls.Location = new Point(0, 0);
            panelOptionControls.Name = "panelOptionControls";
            panelOptionControls.Padding = new Padding(5, 3, 0, 0);
            panelOptionControls.Size = new Size(1400, 33);
            panelOptionControls.TabIndex = 1;
            // 
            // iconLabelCopyResultToCB
            // 
            iconLabelCopyResultToCB.AutoSize = true;
            iconLabelCopyResultToCB.Dock = DockStyle.Left;
            iconLabelCopyResultToCB.ForeColor = SystemColors.ControlText;
            iconLabelCopyResultToCB.Location = new Point(734, 3);
            iconLabelCopyResultToCB.Name = "iconLabelCopyResultToCB";
            iconLabelCopyResultToCB.Padding = new Padding(0, 5, 0, 0);
            iconLabelCopyResultToCB.Size = new Size(14, 20);
            iconLabelCopyResultToCB.TabIndex = 15;
            iconLabelCopyResultToCB.Text = "R";
            iconLabelCopyResultToCB.Click += IconLabelCopyResultToCB_Click;
            // 
            // horizontalSplitPanelHtmlEncode
            // 
            horizontalSplitPanelHtmlEncode.Controls.Add(checkBoxAddMdQtLvlAndHtmlEncode);
            horizontalSplitPanelHtmlEncode.Controls.Add(iconLabelAddMdQtLvl);
            horizontalSplitPanelHtmlEncode.Controls.Add(iconLabelHtmlEncode);
            horizontalSplitPanelHtmlEncode.Dock = DockStyle.Left;
            horizontalSplitPanelHtmlEncode.Location = new Point(609, 3);
            horizontalSplitPanelHtmlEncode.Name = "horizontalSplitPanelHtmlEncode";
            horizontalSplitPanelHtmlEncode.Padding = new Padding(1);
            horizontalSplitPanelHtmlEncode.Size = new Size(125, 30);
            horizontalSplitPanelHtmlEncode.TabIndex = 2;
            // 
            // checkBoxAddMdQtLvlAndHtmlEncode
            // 
            checkBoxAddMdQtLvlAndHtmlEncode.AutoSize = true;
            checkBoxAddMdQtLvlAndHtmlEncode.Dock = DockStyle.Fill;
            checkBoxAddMdQtLvlAndHtmlEncode.Location = new Point(15, 1);
            checkBoxAddMdQtLvlAndHtmlEncode.Name = "checkBoxAddMdQtLvlAndHtmlEncode";
            checkBoxAddMdQtLvlAndHtmlEncode.Padding = new Padding(10, 5, 0, 0);
            checkBoxAddMdQtLvlAndHtmlEncode.Size = new Size(95, 28);
            checkBoxAddMdQtLvlAndHtmlEncode.TabIndex = 15;
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
            iconLabelAddMdQtLvl.TabIndex = 13;
            iconLabelAddMdQtLvl.Text = "R";
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
            iconLabelHtmlEncode.TabIndex = 12;
            iconLabelHtmlEncode.Text = "R";
            // 
            // horizontalSplitPanelResultToCB
            // 
            horizontalSplitPanelResultToCB.Controls.Add(checkBoxResultToCB);
            horizontalSplitPanelResultToCB.Controls.Add(iconLabelResultToCB);
            horizontalSplitPanelResultToCB.Dock = DockStyle.Left;
            horizontalSplitPanelResultToCB.Location = new Point(487, 3);
            horizontalSplitPanelResultToCB.Name = "horizontalSplitPanelResultToCB";
            horizontalSplitPanelResultToCB.Padding = new Padding(1);
            horizontalSplitPanelResultToCB.Size = new Size(122, 30);
            horizontalSplitPanelResultToCB.TabIndex = 12;
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
            checkBoxResultToCB.TabIndex = 7;
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
            iconLabelResultToCB.TabIndex = 8;
            iconLabelResultToCB.Text = "R";
            iconLabelResultToCB.Click += IconLabelResultsToCB_Click;
            // 
            // horizontalSplitPanelHtmlDecode
            // 
            horizontalSplitPanelHtmlDecode.Controls.Add(checkBoxRmMdQtLvlAndHtmlDecode);
            horizontalSplitPanelHtmlDecode.Controls.Add(iconLabelRmMdQtLvl);
            horizontalSplitPanelHtmlDecode.Controls.Add(iconLabelHtmlDecode);
            horizontalSplitPanelHtmlDecode.Dock = DockStyle.Left;
            horizontalSplitPanelHtmlDecode.Location = new Point(362, 3);
            horizontalSplitPanelHtmlDecode.Name = "horizontalSplitPanelHtmlDecode";
            horizontalSplitPanelHtmlDecode.Padding = new Padding(1);
            horizontalSplitPanelHtmlDecode.Size = new Size(125, 30);
            horizontalSplitPanelHtmlDecode.TabIndex = 3;
            // 
            // checkBoxRmMdQtLvlAndHtmlDecode
            // 
            checkBoxRmMdQtLvlAndHtmlDecode.AutoSize = true;
            checkBoxRmMdQtLvlAndHtmlDecode.Dock = DockStyle.Fill;
            checkBoxRmMdQtLvlAndHtmlDecode.Location = new Point(15, 1);
            checkBoxRmMdQtLvlAndHtmlDecode.Name = "checkBoxRmMdQtLvlAndHtmlDecode";
            checkBoxRmMdQtLvlAndHtmlDecode.Padding = new Padding(10, 5, 0, 0);
            checkBoxRmMdQtLvlAndHtmlDecode.Size = new Size(95, 28);
            checkBoxRmMdQtLvlAndHtmlDecode.TabIndex = 14;
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
            iconLabelRmMdQtLvl.TabIndex = 12;
            iconLabelRmMdQtLvl.Text = "R";
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
            iconLabelHtmlDecode.TabIndex = 11;
            iconLabelHtmlDecode.Text = "R";
            // 
            // horizontalSplitPanelSrcFromCB
            // 
            horizontalSplitPanelSrcFromCB.Controls.Add(iconLabelSrcFromCB);
            horizontalSplitPanelSrcFromCB.Controls.Add(checkBoxSrcFromCB);
            horizontalSplitPanelSrcFromCB.Dock = DockStyle.Left;
            horizontalSplitPanelSrcFromCB.Location = new Point(234, 3);
            horizontalSplitPanelSrcFromCB.Name = "horizontalSplitPanelSrcFromCB";
            horizontalSplitPanelSrcFromCB.Padding = new Padding(1);
            horizontalSplitPanelSrcFromCB.Size = new Size(128, 30);
            horizontalSplitPanelSrcFromCB.TabIndex = 11;
            // 
            // iconLabelSrcFromCB
            // 
            iconLabelSrcFromCB.AutoSize = true;
            iconLabelSrcFromCB.Dock = DockStyle.Right;
            iconLabelSrcFromCB.ForeColor = SystemColors.ControlText;
            iconLabelSrcFromCB.Location = new Point(113, 1);
            iconLabelSrcFromCB.Name = "iconLabelSrcFromCB";
            iconLabelSrcFromCB.Padding = new Padding(0, 5, 0, 0);
            iconLabelSrcFromCB.Size = new Size(14, 20);
            iconLabelSrcFromCB.TabIndex = 10;
            iconLabelSrcFromCB.Text = "R";
            iconLabelSrcFromCB.Click += IconLabelSrcFromCB_Click;
            // 
            // checkBoxSrcFromCB
            // 
            checkBoxSrcFromCB.AutoSize = true;
            checkBoxSrcFromCB.Cursor = Cursors.Hand;
            checkBoxSrcFromCB.Dock = DockStyle.Left;
            checkBoxSrcFromCB.Location = new Point(1, 1);
            checkBoxSrcFromCB.Name = "checkBoxSrcFromCB";
            checkBoxSrcFromCB.Padding = new Padding(5, 5, 0, 0);
            checkBoxSrcFromCB.Size = new Size(98, 28);
            checkBoxSrcFromCB.TabIndex = 9;
            checkBoxSrcFromCB.TabStop = false;
            checkBoxSrcFromCB.Text = "Source From";
            checkBoxSrcFromCB.UseVisualStyleBackColor = true;
            // 
            // checkBoxMdTableSrcTextIsTabSeparated
            // 
            checkBoxMdTableSrcTextIsTabSeparated.AutoSize = true;
            checkBoxMdTableSrcTextIsTabSeparated.Dock = DockStyle.Left;
            checkBoxMdTableSrcTextIsTabSeparated.Location = new Point(130, 3);
            checkBoxMdTableSrcTextIsTabSeparated.Name = "checkBoxMdTableSrcTextIsTabSeparated";
            checkBoxMdTableSrcTextIsTabSeparated.Padding = new Padding(5, 5, 0, 0);
            checkBoxMdTableSrcTextIsTabSeparated.Size = new Size(104, 30);
            checkBoxMdTableSrcTextIsTabSeparated.TabIndex = 2;
            checkBoxMdTableSrcTextIsTabSeparated.Text = "Tab Separated";
            checkBoxMdTableSrcTextIsTabSeparated.UseVisualStyleBackColor = true;
            // 
            // panelMdTableSrcTextSep
            // 
            panelMdTableSrcTextSep.Controls.Add(textBoxMdTableSrcTextSep);
            panelMdTableSrcTextSep.Dock = DockStyle.Left;
            panelMdTableSrcTextSep.Location = new Point(80, 3);
            panelMdTableSrcTextSep.Name = "panelMdTableSrcTextSep";
            panelMdTableSrcTextSep.Padding = new Padding(5);
            panelMdTableSrcTextSep.Size = new Size(50, 30);
            panelMdTableSrcTextSep.TabIndex = 13;
            // 
            // textBoxMdTableSrcTextSep
            // 
            textBoxMdTableSrcTextSep.Dock = DockStyle.Fill;
            textBoxMdTableSrcTextSep.Location = new Point(5, 5);
            textBoxMdTableSrcTextSep.Name = "textBoxMdTableSrcTextSep";
            textBoxMdTableSrcTextSep.Size = new Size(40, 23);
            textBoxMdTableSrcTextSep.TabIndex = 1;
            textBoxMdTableSrcTextSep.KeyUp += TextBoxMdTableSrcTextSep_KeyUp;
            // 
            // buttonMdTable
            // 
            buttonMdTable.Dock = DockStyle.Left;
            buttonMdTable.Location = new Point(5, 3);
            buttonMdTable.Name = "buttonMdTable";
            buttonMdTable.Size = new Size(75, 30);
            buttonMdTable.TabIndex = 14;
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
            splitContainerTextAreas.TabIndex = 1;
            // 
            // richTextBoxSrcText
            // 
            richTextBoxSrcText.Dock = DockStyle.Fill;
            richTextBoxSrcText.Font = new Font("Consolas", 9F, FontStyle.Bold);
            richTextBoxSrcText.Location = new Point(0, 0);
            richTextBoxSrcText.Name = "richTextBoxSrcText";
            richTextBoxSrcText.Size = new Size(700, 296);
            richTextBoxSrcText.TabIndex = 0;
            richTextBoxSrcText.Text = "";
            // 
            // richTextBoxConvertedText
            // 
            richTextBoxConvertedText.Dock = DockStyle.Fill;
            richTextBoxConvertedText.Font = new Font("Consolas", 9F, FontStyle.Bold);
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
            horizontalSplitPanelHtmlEncode.ResumeLayout(false);
            horizontalSplitPanelHtmlEncode.PerformLayout();
            horizontalSplitPanelResultToCB.ResumeLayout(false);
            horizontalSplitPanelResultToCB.PerformLayout();
            horizontalSplitPanelHtmlDecode.ResumeLayout(false);
            horizontalSplitPanelHtmlDecode.PerformLayout();
            horizontalSplitPanelSrcFromCB.ResumeLayout(false);
            horizontalSplitPanelSrcFromCB.PerformLayout();
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
        private CheckBox checkBoxSrcFromCB;
        private WinForms.Controls.IconLabel iconLabelSrcFromCB;
        private CheckBox checkBoxResultToCB;
        private WinForms.Controls.IconLabel iconLabelResultToCB;
        private WinForms.Controls.HorizontalSplitPanel horizontalSplitPanelSrcFromCB;
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
        private WinForms.Controls.IconLabel iconLabelCopyResultToCB;
    }
}
