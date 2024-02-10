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
            panelMutableClassName = new Panel();
            textBoxMutableClassName = new TextBox();
            panelImmutableClassName = new Panel();
            textBoxImmutableClassName = new TextBox();
            panelStaticClassName = new Panel();
            textBoxStaticClassName = new TextBox();
            ((System.ComponentModel.ISupportInitialize)splitContainerTextAreas).BeginInit();
            splitContainerTextAreas.Panel1.SuspendLayout();
            splitContainerTextAreas.Panel2.SuspendLayout();
            splitContainerTextAreas.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)splitContainerMain).BeginInit();
            splitContainerMain.Panel1.SuspendLayout();
            splitContainerMain.Panel2.SuspendLayout();
            splitContainerMain.SuspendLayout();
            panelOptionControls.SuspendLayout();
            panelMutableClassName.SuspendLayout();
            panelImmutableClassName.SuspendLayout();
            panelStaticClassName.SuspendLayout();
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
            panelOptionControls.Controls.Add(panelMutableClassName);
            panelOptionControls.Controls.Add(panelImmutableClassName);
            panelOptionControls.Controls.Add(panelStaticClassName);
            panelOptionControls.Dock = DockStyle.Top;
            panelOptionControls.Location = new Point(0, 0);
            panelOptionControls.Name = "panelOptionControls";
            panelOptionControls.Size = new Size(1600, 33);
            panelOptionControls.TabIndex = 0;
            // 
            // buttonGenerateCloneables
            // 
            buttonGenerateCloneables.Dock = DockStyle.Left;
            buttonGenerateCloneables.Location = new Point(750, 0);
            buttonGenerateCloneables.Name = "buttonGenerateCloneables";
            buttonGenerateCloneables.Size = new Size(65, 33);
            buttonGenerateCloneables.TabIndex = 4;
            buttonGenerateCloneables.TabStop = false;
            buttonGenerateCloneables.Text = "Generate";
            buttonGenerateCloneables.UseVisualStyleBackColor = true;
            buttonGenerateCloneables.Click += ButtonGenerateCloneables_Click;
            // 
            // panelMutableClassName
            // 
            panelMutableClassName.Controls.Add(textBoxMutableClassName);
            panelMutableClassName.Dock = DockStyle.Left;
            panelMutableClassName.Location = new Point(500, 0);
            panelMutableClassName.Name = "panelMutableClassName";
            panelMutableClassName.Padding = new Padding(5);
            panelMutableClassName.Size = new Size(250, 33);
            panelMutableClassName.TabIndex = 0;
            // 
            // textBoxMutableClassName
            // 
            textBoxMutableClassName.Dock = DockStyle.Fill;
            textBoxMutableClassName.Location = new Point(5, 5);
            textBoxMutableClassName.Name = "textBoxMutableClassName";
            textBoxMutableClassName.Size = new Size(240, 23);
            textBoxMutableClassName.TabIndex = 3;
            textBoxMutableClassName.TabStop = false;
            textBoxMutableClassName.TextChanged += TextBoxMutableClassName_TextChanged;
            // 
            // panelImmutableClassName
            // 
            panelImmutableClassName.Controls.Add(textBoxImmutableClassName);
            panelImmutableClassName.Dock = DockStyle.Left;
            panelImmutableClassName.Location = new Point(250, 0);
            panelImmutableClassName.Name = "panelImmutableClassName";
            panelImmutableClassName.Padding = new Padding(5);
            panelImmutableClassName.Size = new Size(250, 33);
            panelImmutableClassName.TabIndex = 0;
            // 
            // textBoxImmutableClassName
            // 
            textBoxImmutableClassName.Dock = DockStyle.Fill;
            textBoxImmutableClassName.Location = new Point(5, 5);
            textBoxImmutableClassName.Name = "textBoxImmutableClassName";
            textBoxImmutableClassName.Size = new Size(240, 23);
            textBoxImmutableClassName.TabIndex = 2;
            textBoxImmutableClassName.TabStop = false;
            textBoxImmutableClassName.TextChanged += TextBoxImmutableClassName_TextChanged;
            // 
            // panelStaticClassName
            // 
            panelStaticClassName.Controls.Add(textBoxStaticClassName);
            panelStaticClassName.Dock = DockStyle.Left;
            panelStaticClassName.Location = new Point(0, 0);
            panelStaticClassName.Name = "panelStaticClassName";
            panelStaticClassName.Padding = new Padding(5);
            panelStaticClassName.Size = new Size(250, 33);
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
            textBoxStaticClassName.TextChanged += TextBoxStaticClassName_TextChanged;
            // 
            // CloneablesUC
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            Controls.Add(splitContainerMain);
            Name = "CloneablesUC";
            Size = new Size(1600, 800);
            splitContainerTextAreas.Panel1.ResumeLayout(false);
            splitContainerTextAreas.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)splitContainerTextAreas).EndInit();
            splitContainerTextAreas.ResumeLayout(false);
            splitContainerMain.Panel1.ResumeLayout(false);
            splitContainerMain.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)splitContainerMain).EndInit();
            splitContainerMain.ResumeLayout(false);
            panelOptionControls.ResumeLayout(false);
            panelMutableClassName.ResumeLayout(false);
            panelMutableClassName.PerformLayout();
            panelImmutableClassName.ResumeLayout(false);
            panelImmutableClassName.PerformLayout();
            panelStaticClassName.ResumeLayout(false);
            panelStaticClassName.PerformLayout();
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
        private Panel panelMutableClassName;
        private TextBox textBoxMutableClassName;
        private Panel panelImmutableClassName;
        private TextBox textBoxImmutableClassName;
        private Button buttonGenerateCloneables;
    }
}
