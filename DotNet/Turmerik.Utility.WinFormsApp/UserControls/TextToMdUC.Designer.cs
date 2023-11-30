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
            horizontalSplitPanelResultsToCB = new WinForms.Controls.HorizontalSplitPanel();
            checkBoxResultsToCB = new CheckBox();
            iconLabelResultsToCB = new WinForms.Controls.IconLabel();
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
            horizontalSplitPanelResultsToCB.SuspendLayout();
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
            panelOptionControls.Controls.Add(horizontalSplitPanelResultsToCB);
            panelOptionControls.Controls.Add(horizontalSplitPanelSrcFromCB);
            panelOptionControls.Controls.Add(checkBoxMdTableSrcTextIsTabSeparated);
            panelOptionControls.Controls.Add(panelMdTableSrcTextSep);
            panelOptionControls.Controls.Add(buttonMdTable);
            panelOptionControls.Dock = DockStyle.Top;
            panelOptionControls.Location = new Point(0, 0);
            panelOptionControls.Name = "panelOptionControls";
            panelOptionControls.Padding = new Padding(0, 3, 0, 0);
            panelOptionControls.Size = new Size(1400, 33);
            panelOptionControls.TabIndex = 1;
            // 
            // horizontalSplitPanelResultsToCB
            // 
            horizontalSplitPanelResultsToCB.Controls.Add(checkBoxResultsToCB);
            horizontalSplitPanelResultsToCB.Controls.Add(iconLabelResultsToCB);
            horizontalSplitPanelResultsToCB.Dock = DockStyle.Left;
            horizontalSplitPanelResultsToCB.Location = new Point(339, 3);
            horizontalSplitPanelResultsToCB.Name = "horizontalSplitPanelResultsToCB";
            horizontalSplitPanelResultsToCB.Padding = new Padding(1);
            horizontalSplitPanelResultsToCB.Size = new Size(122, 30);
            horizontalSplitPanelResultsToCB.TabIndex = 12;
            // 
            // checkBoxResultsToCB
            // 
            checkBoxResultsToCB.AutoSize = true;
            checkBoxResultsToCB.Cursor = Cursors.Hand;
            checkBoxResultsToCB.Dock = DockStyle.Left;
            checkBoxResultsToCB.Location = new Point(1, 1);
            checkBoxResultsToCB.Name = "checkBoxResultsToCB";
            checkBoxResultsToCB.Padding = new Padding(5, 5, 0, 0);
            checkBoxResultsToCB.Size = new Size(83, 28);
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
            iconLabelResultsToCB.Location = new Point(107, 1);
            iconLabelResultsToCB.Name = "iconLabelResultsToCB";
            iconLabelResultsToCB.Padding = new Padding(0, 5, 0, 0);
            iconLabelResultsToCB.Size = new Size(14, 20);
            iconLabelResultsToCB.TabIndex = 8;
            iconLabelResultsToCB.Text = "R";
            iconLabelResultsToCB.Click += IconLabelResultsToCB_Click;
            // 
            // horizontalSplitPanelSrcFromCB
            // 
            horizontalSplitPanelSrcFromCB.Controls.Add(iconLabelSrcFromCB);
            horizontalSplitPanelSrcFromCB.Controls.Add(checkBoxSrcFromCB);
            horizontalSplitPanelSrcFromCB.Dock = DockStyle.Left;
            horizontalSplitPanelSrcFromCB.Location = new Point(211, 3);
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
            checkBoxMdTableSrcTextIsTabSeparated.Location = new Point(109, 3);
            checkBoxMdTableSrcTextIsTabSeparated.Name = "checkBoxMdTableSrcTextIsTabSeparated";
            checkBoxMdTableSrcTextIsTabSeparated.Padding = new Padding(3, 5, 0, 0);
            checkBoxMdTableSrcTextIsTabSeparated.Size = new Size(102, 30);
            checkBoxMdTableSrcTextIsTabSeparated.TabIndex = 2;
            checkBoxMdTableSrcTextIsTabSeparated.Text = "Tab Separated";
            checkBoxMdTableSrcTextIsTabSeparated.UseVisualStyleBackColor = true;
            checkBoxMdTableSrcTextIsTabSeparated.CheckedChanged += CheckBoxMdTableSrcTextIsTabSeparated_CheckedChanged;
            // 
            // panelMdTableSrcTextSep
            // 
            panelMdTableSrcTextSep.Controls.Add(textBoxMdTableSrcTextSep);
            panelMdTableSrcTextSep.Dock = DockStyle.Left;
            panelMdTableSrcTextSep.Location = new Point(73, 3);
            panelMdTableSrcTextSep.Name = "panelMdTableSrcTextSep";
            panelMdTableSrcTextSep.Padding = new Padding(0, 5, 0, 0);
            panelMdTableSrcTextSep.Size = new Size(36, 30);
            panelMdTableSrcTextSep.TabIndex = 13;
            // 
            // textBoxMdTableSrcTextSep
            // 
            textBoxMdTableSrcTextSep.Dock = DockStyle.Fill;
            textBoxMdTableSrcTextSep.Location = new Point(0, 5);
            textBoxMdTableSrcTextSep.Name = "textBoxMdTableSrcTextSep";
            textBoxMdTableSrcTextSep.Size = new Size(36, 23);
            textBoxMdTableSrcTextSep.TabIndex = 1;
            textBoxMdTableSrcTextSep.KeyUp += TextBoxMdTableSrcTextSep_KeyUp;
            // 
            // buttonMdTable
            // 
            buttonMdTable.Dock = DockStyle.Left;
            buttonMdTable.Location = new Point(0, 3);
            buttonMdTable.Name = "buttonMdTable";
            buttonMdTable.Padding = new Padding(0, 5, 0, 0);
            buttonMdTable.Size = new Size(73, 30);
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
            horizontalSplitPanelResultsToCB.ResumeLayout(false);
            horizontalSplitPanelResultsToCB.PerformLayout();
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
        private Button buttonMdTable;
        private CheckBox checkBoxSrcFromCB;
        private WinForms.Controls.IconLabel iconLabelSrcFromCB;
        private CheckBox checkBoxResultsToCB;
        private WinForms.Controls.IconLabel iconLabelResultsToCB;
        private WinForms.Controls.HorizontalSplitPanel horizontalSplitPanelSrcFromCB;
        private WinForms.Controls.HorizontalSplitPanel horizontalSplitPanelResultsToCB;
        private Panel panelMdTableSrcTextSep;
    }
}
