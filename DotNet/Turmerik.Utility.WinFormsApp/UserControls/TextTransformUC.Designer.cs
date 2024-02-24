namespace Turmerik.Utility.WinFormsApp.UserControls
{
    partial class TextTransformUC
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
            panelSrcTextBoxTopControls = new Panel();
            iconLabelSrcTextBoxDecreaseZoomFactory = new WinForms.Controls.IconLabel();
            iconLabelSrcTextBoxIncreaseZoomFactory = new WinForms.Controls.IconLabel();
            buttonSetSrcTextBoxZoomFactor = new Button();
            textBoxSrcTextBoxNewZoomValue = new TextBox();
            labelSrcTextBoxZoom = new Label();
            labelTitleScrTextBoxZoom = new Label();
            panelResultTextBoxTopControls = new Panel();
            iconLabelResultTextBoxDecreaseZoomFactory = new WinForms.Controls.IconLabel();
            iconLabelResultTextBoxIncreaseZoomFactory = new WinForms.Controls.IconLabel();
            buttonSetResultTextBoxZoomFactor = new Button();
            textBoxResultTextBoxNewZoomValue = new TextBox();
            labelResultTextBoxZoom = new Label();
            labelTitleResultTextBoxZoom = new Label();
            splitContainerMain = new SplitContainer();
            splitContainerTransformers = new SplitContainer();
            treeViewTransformers = new TreeView();
            panelCurrentTransformer = new Panel();
            richTextBoxCurrentTransformerDescription = new RichTextBox();
            panelCurrentTransformerName = new Panel();
            textBoxCurrentTransformerName = new TextBox();
            iconLabelRunCurrentTransformer = new WinForms.Controls.IconLabel();
            ((System.ComponentModel.ISupportInitialize)splitContainerTextAreas).BeginInit();
            splitContainerTextAreas.Panel1.SuspendLayout();
            splitContainerTextAreas.Panel2.SuspendLayout();
            splitContainerTextAreas.SuspendLayout();
            panelSrcTextBoxTopControls.SuspendLayout();
            panelResultTextBoxTopControls.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)splitContainerMain).BeginInit();
            splitContainerMain.Panel1.SuspendLayout();
            splitContainerMain.Panel2.SuspendLayout();
            splitContainerMain.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)splitContainerTransformers).BeginInit();
            splitContainerTransformers.Panel1.SuspendLayout();
            splitContainerTransformers.Panel2.SuspendLayout();
            splitContainerTransformers.SuspendLayout();
            panelCurrentTransformer.SuspendLayout();
            panelCurrentTransformerName.SuspendLayout();
            SuspendLayout();
            // 
            // richTextBoxResultText
            // 
            richTextBoxResultText.AcceptsTab = true;
            richTextBoxResultText.Dock = DockStyle.Fill;
            richTextBoxResultText.Font = new Font("Consolas", 9F, FontStyle.Bold);
            richTextBoxResultText.Location = new Point(0, 23);
            richTextBoxResultText.Name = "richTextBoxResultText";
            richTextBoxResultText.Size = new Size(796, 373);
            richTextBoxResultText.TabIndex = 0;
            richTextBoxResultText.TabStop = false;
            richTextBoxResultText.Text = "";
            richTextBoxResultText.KeyDown += RichTextBoxResultText_KeyDown;
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
            splitContainerTextAreas.Panel1.Controls.Add(panelSrcTextBoxTopControls);
            // 
            // splitContainerTextAreas.Panel2
            // 
            splitContainerTextAreas.Panel2.Controls.Add(richTextBoxResultText);
            splitContainerTextAreas.Panel2.Controls.Add(panelResultTextBoxTopControls);
            splitContainerTextAreas.Size = new Size(1600, 396);
            splitContainerTextAreas.SplitterDistance = 800;
            splitContainerTextAreas.TabIndex = 0;
            splitContainerTextAreas.TabStop = false;
            // 
            // richTextBoxSrcText
            // 
            richTextBoxSrcText.AcceptsTab = true;
            richTextBoxSrcText.Dock = DockStyle.Fill;
            richTextBoxSrcText.Font = new Font("Consolas", 9F, FontStyle.Bold);
            richTextBoxSrcText.Location = new Point(0, 23);
            richTextBoxSrcText.Name = "richTextBoxSrcText";
            richTextBoxSrcText.Size = new Size(800, 373);
            richTextBoxSrcText.TabIndex = 0;
            richTextBoxSrcText.TabStop = false;
            richTextBoxSrcText.Text = "";
            richTextBoxSrcText.KeyDown += RichTextBoxSrcText_KeyDown;
            // 
            // panelSrcTextBoxTopControls
            // 
            panelSrcTextBoxTopControls.Controls.Add(iconLabelSrcTextBoxDecreaseZoomFactory);
            panelSrcTextBoxTopControls.Controls.Add(iconLabelSrcTextBoxIncreaseZoomFactory);
            panelSrcTextBoxTopControls.Controls.Add(buttonSetSrcTextBoxZoomFactor);
            panelSrcTextBoxTopControls.Controls.Add(textBoxSrcTextBoxNewZoomValue);
            panelSrcTextBoxTopControls.Controls.Add(labelSrcTextBoxZoom);
            panelSrcTextBoxTopControls.Controls.Add(labelTitleScrTextBoxZoom);
            panelSrcTextBoxTopControls.Dock = DockStyle.Top;
            panelSrcTextBoxTopControls.Location = new Point(0, 0);
            panelSrcTextBoxTopControls.Name = "panelSrcTextBoxTopControls";
            panelSrcTextBoxTopControls.Size = new Size(800, 23);
            panelSrcTextBoxTopControls.TabIndex = 1;
            // 
            // iconLabelSrcTextBoxDecreaseZoomFactory
            // 
            iconLabelSrcTextBoxDecreaseZoomFactory.AutoSize = true;
            iconLabelSrcTextBoxDecreaseZoomFactory.Dock = DockStyle.Left;
            iconLabelSrcTextBoxDecreaseZoomFactory.Location = new Point(173, 0);
            iconLabelSrcTextBoxDecreaseZoomFactory.Name = "iconLabelSrcTextBoxDecreaseZoomFactory";
            iconLabelSrcTextBoxDecreaseZoomFactory.Size = new Size(14, 15);
            iconLabelSrcTextBoxDecreaseZoomFactory.TabIndex = 5;
            iconLabelSrcTextBoxDecreaseZoomFactory.Text = "R";
            iconLabelSrcTextBoxDecreaseZoomFactory.Click += IconLabelSrcTextBoxDecreaseZoomFactory_Click;
            // 
            // iconLabelSrcTextBoxIncreaseZoomFactory
            // 
            iconLabelSrcTextBoxIncreaseZoomFactory.AutoSize = true;
            iconLabelSrcTextBoxIncreaseZoomFactory.Dock = DockStyle.Left;
            iconLabelSrcTextBoxIncreaseZoomFactory.Location = new Point(159, 0);
            iconLabelSrcTextBoxIncreaseZoomFactory.Name = "iconLabelSrcTextBoxIncreaseZoomFactory";
            iconLabelSrcTextBoxIncreaseZoomFactory.Size = new Size(14, 15);
            iconLabelSrcTextBoxIncreaseZoomFactory.TabIndex = 4;
            iconLabelSrcTextBoxIncreaseZoomFactory.Text = "R";
            iconLabelSrcTextBoxIncreaseZoomFactory.Click += IconLabelSrcTextBoxIncreaseZoomFactory_Click;
            // 
            // buttonSetSrcTextBoxZoomFactor
            // 
            buttonSetSrcTextBoxZoomFactor.Dock = DockStyle.Left;
            buttonSetSrcTextBoxZoomFactor.Location = new Point(121, 0);
            buttonSetSrcTextBoxZoomFactor.Name = "buttonSetSrcTextBoxZoomFactor";
            buttonSetSrcTextBoxZoomFactor.Size = new Size(38, 23);
            buttonSetSrcTextBoxZoomFactor.TabIndex = 3;
            buttonSetSrcTextBoxZoomFactor.Text = "Set";
            buttonSetSrcTextBoxZoomFactor.UseVisualStyleBackColor = true;
            buttonSetSrcTextBoxZoomFactor.Click += ButtonSetSrcTextBoxZoomFactor_Click;
            // 
            // textBoxSrcTextBoxNewZoomValue
            // 
            textBoxSrcTextBoxNewZoomValue.Dock = DockStyle.Left;
            textBoxSrcTextBoxNewZoomValue.Font = new Font("Consolas", 9F, FontStyle.Regular, GraphicsUnit.Point, 0);
            textBoxSrcTextBoxNewZoomValue.Location = new Point(86, 0);
            textBoxSrcTextBoxNewZoomValue.Name = "textBoxSrcTextBoxNewZoomValue";
            textBoxSrcTextBoxNewZoomValue.Size = new Size(35, 22);
            textBoxSrcTextBoxNewZoomValue.TabIndex = 2;
            textBoxSrcTextBoxNewZoomValue.Text = "100";
            textBoxSrcTextBoxNewZoomValue.KeyDown += TextBoxSrcTextBoxNewZoomValue_KeyDown;
            // 
            // labelSrcTextBoxZoom
            // 
            labelSrcTextBoxZoom.AutoSize = true;
            labelSrcTextBoxZoom.Dock = DockStyle.Left;
            labelSrcTextBoxZoom.Font = new Font("Consolas", 9F, FontStyle.Regular, GraphicsUnit.Point, 0);
            labelSrcTextBoxZoom.Location = new Point(45, 0);
            labelSrcTextBoxZoom.Name = "labelSrcTextBoxZoom";
            labelSrcTextBoxZoom.Padding = new Padding(3);
            labelSrcTextBoxZoom.Size = new Size(41, 20);
            labelSrcTextBoxZoom.TabIndex = 1;
            labelSrcTextBoxZoom.Text = "100%";
            // 
            // labelTitleScrTextBoxZoom
            // 
            labelTitleScrTextBoxZoom.AutoSize = true;
            labelTitleScrTextBoxZoom.Dock = DockStyle.Left;
            labelTitleScrTextBoxZoom.Location = new Point(0, 0);
            labelTitleScrTextBoxZoom.Name = "labelTitleScrTextBoxZoom";
            labelTitleScrTextBoxZoom.Padding = new Padding(3);
            labelTitleScrTextBoxZoom.Size = new Size(45, 21);
            labelTitleScrTextBoxZoom.TabIndex = 0;
            labelTitleScrTextBoxZoom.Text = "Zoom";
            // 
            // panelResultTextBoxTopControls
            // 
            panelResultTextBoxTopControls.Controls.Add(iconLabelResultTextBoxDecreaseZoomFactory);
            panelResultTextBoxTopControls.Controls.Add(iconLabelResultTextBoxIncreaseZoomFactory);
            panelResultTextBoxTopControls.Controls.Add(buttonSetResultTextBoxZoomFactor);
            panelResultTextBoxTopControls.Controls.Add(textBoxResultTextBoxNewZoomValue);
            panelResultTextBoxTopControls.Controls.Add(labelResultTextBoxZoom);
            panelResultTextBoxTopControls.Controls.Add(labelTitleResultTextBoxZoom);
            panelResultTextBoxTopControls.Dock = DockStyle.Top;
            panelResultTextBoxTopControls.Location = new Point(0, 0);
            panelResultTextBoxTopControls.Name = "panelResultTextBoxTopControls";
            panelResultTextBoxTopControls.Size = new Size(796, 23);
            panelResultTextBoxTopControls.TabIndex = 2;
            // 
            // iconLabelResultTextBoxDecreaseZoomFactory
            // 
            iconLabelResultTextBoxDecreaseZoomFactory.AutoSize = true;
            iconLabelResultTextBoxDecreaseZoomFactory.Dock = DockStyle.Left;
            iconLabelResultTextBoxDecreaseZoomFactory.Location = new Point(173, 0);
            iconLabelResultTextBoxDecreaseZoomFactory.Name = "iconLabelResultTextBoxDecreaseZoomFactory";
            iconLabelResultTextBoxDecreaseZoomFactory.Size = new Size(14, 15);
            iconLabelResultTextBoxDecreaseZoomFactory.TabIndex = 5;
            iconLabelResultTextBoxDecreaseZoomFactory.Text = "R";
            iconLabelResultTextBoxDecreaseZoomFactory.Click += IconLabelResultTextBoxDecreaseZoomFactory_Click;
            // 
            // iconLabelResultTextBoxIncreaseZoomFactory
            // 
            iconLabelResultTextBoxIncreaseZoomFactory.AutoSize = true;
            iconLabelResultTextBoxIncreaseZoomFactory.Dock = DockStyle.Left;
            iconLabelResultTextBoxIncreaseZoomFactory.Location = new Point(159, 0);
            iconLabelResultTextBoxIncreaseZoomFactory.Name = "iconLabelResultTextBoxIncreaseZoomFactory";
            iconLabelResultTextBoxIncreaseZoomFactory.Size = new Size(14, 15);
            iconLabelResultTextBoxIncreaseZoomFactory.TabIndex = 4;
            iconLabelResultTextBoxIncreaseZoomFactory.Text = "R";
            iconLabelResultTextBoxIncreaseZoomFactory.Click += IconLabelResultTextBoxIncreaseZoomFactory_Click;
            // 
            // buttonSetResultTextBoxZoomFactor
            // 
            buttonSetResultTextBoxZoomFactor.Dock = DockStyle.Left;
            buttonSetResultTextBoxZoomFactor.Location = new Point(121, 0);
            buttonSetResultTextBoxZoomFactor.Name = "buttonSetResultTextBoxZoomFactor";
            buttonSetResultTextBoxZoomFactor.Size = new Size(38, 23);
            buttonSetResultTextBoxZoomFactor.TabIndex = 3;
            buttonSetResultTextBoxZoomFactor.Text = "Set";
            buttonSetResultTextBoxZoomFactor.UseVisualStyleBackColor = true;
            buttonSetResultTextBoxZoomFactor.Click += ButtonSetResultTextBoxZoomFactor_Click;
            // 
            // textBoxResultTextBoxNewZoomValue
            // 
            textBoxResultTextBoxNewZoomValue.Dock = DockStyle.Left;
            textBoxResultTextBoxNewZoomValue.Font = new Font("Consolas", 9F, FontStyle.Regular, GraphicsUnit.Point, 0);
            textBoxResultTextBoxNewZoomValue.Location = new Point(86, 0);
            textBoxResultTextBoxNewZoomValue.Name = "textBoxResultTextBoxNewZoomValue";
            textBoxResultTextBoxNewZoomValue.Size = new Size(35, 22);
            textBoxResultTextBoxNewZoomValue.TabIndex = 2;
            textBoxResultTextBoxNewZoomValue.Text = "100";
            textBoxResultTextBoxNewZoomValue.KeyDown += TextBoxResultTextBoxNewZoomValue_KeyDown;
            // 
            // labelResultTextBoxZoom
            // 
            labelResultTextBoxZoom.AutoSize = true;
            labelResultTextBoxZoom.Dock = DockStyle.Left;
            labelResultTextBoxZoom.Font = new Font("Consolas", 9F, FontStyle.Regular, GraphicsUnit.Point, 0);
            labelResultTextBoxZoom.Location = new Point(45, 0);
            labelResultTextBoxZoom.Name = "labelResultTextBoxZoom";
            labelResultTextBoxZoom.Padding = new Padding(3);
            labelResultTextBoxZoom.Size = new Size(41, 20);
            labelResultTextBoxZoom.TabIndex = 1;
            labelResultTextBoxZoom.Text = "100%";
            // 
            // labelTitleResultTextBoxZoom
            // 
            labelTitleResultTextBoxZoom.AutoSize = true;
            labelTitleResultTextBoxZoom.Dock = DockStyle.Left;
            labelTitleResultTextBoxZoom.Location = new Point(0, 0);
            labelTitleResultTextBoxZoom.Name = "labelTitleResultTextBoxZoom";
            labelTitleResultTextBoxZoom.Padding = new Padding(3);
            labelTitleResultTextBoxZoom.Size = new Size(45, 21);
            labelTitleResultTextBoxZoom.TabIndex = 0;
            labelTitleResultTextBoxZoom.Text = "Zoom";
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
            splitContainerMain.Panel1.Controls.Add(splitContainerTransformers);
            // 
            // splitContainerMain.Panel2
            // 
            splitContainerMain.Panel2.Controls.Add(splitContainerTextAreas);
            splitContainerMain.Size = new Size(1600, 800);
            splitContainerMain.SplitterDistance = 400;
            splitContainerMain.TabIndex = 1;
            splitContainerMain.TabStop = false;
            // 
            // splitContainerTransformers
            // 
            splitContainerTransformers.Dock = DockStyle.Fill;
            splitContainerTransformers.Location = new Point(0, 0);
            splitContainerTransformers.Name = "splitContainerTransformers";
            // 
            // splitContainerTransformers.Panel1
            // 
            splitContainerTransformers.Panel1.Controls.Add(treeViewTransformers);
            // 
            // splitContainerTransformers.Panel2
            // 
            splitContainerTransformers.Panel2.Controls.Add(panelCurrentTransformer);
            splitContainerTransformers.Panel2.Controls.Add(panelCurrentTransformerName);
            splitContainerTransformers.Size = new Size(1600, 400);
            splitContainerTransformers.SplitterDistance = 533;
            splitContainerTransformers.TabIndex = 0;
            // 
            // treeViewTransformers
            // 
            treeViewTransformers.Dock = DockStyle.Fill;
            treeViewTransformers.Location = new Point(0, 0);
            treeViewTransformers.Name = "treeViewTransformers";
            treeViewTransformers.Size = new Size(533, 400);
            treeViewTransformers.TabIndex = 0;
            treeViewTransformers.NodeMouseClick += TreeViewTransformers_NodeMouseClick;
            // 
            // panelCurrentTransformer
            // 
            panelCurrentTransformer.Controls.Add(richTextBoxCurrentTransformerDescription);
            panelCurrentTransformer.Dock = DockStyle.Top;
            panelCurrentTransformer.Location = new Point(0, 26);
            panelCurrentTransformer.Name = "panelCurrentTransformer";
            panelCurrentTransformer.Size = new Size(1063, 100);
            panelCurrentTransformer.TabIndex = 0;
            // 
            // richTextBoxCurrentTransformerDescription
            // 
            richTextBoxCurrentTransformerDescription.Dock = DockStyle.Fill;
            richTextBoxCurrentTransformerDescription.Font = new Font("Consolas", 9F, FontStyle.Bold);
            richTextBoxCurrentTransformerDescription.Location = new Point(0, 0);
            richTextBoxCurrentTransformerDescription.Name = "richTextBoxCurrentTransformerDescription";
            richTextBoxCurrentTransformerDescription.ReadOnly = true;
            richTextBoxCurrentTransformerDescription.Size = new Size(1063, 100);
            richTextBoxCurrentTransformerDescription.TabIndex = 1;
            richTextBoxCurrentTransformerDescription.Text = "";
            // 
            // panelCurrentTransformerName
            // 
            panelCurrentTransformerName.Controls.Add(textBoxCurrentTransformerName);
            panelCurrentTransformerName.Controls.Add(iconLabelRunCurrentTransformer);
            panelCurrentTransformerName.Dock = DockStyle.Top;
            panelCurrentTransformerName.Location = new Point(0, 0);
            panelCurrentTransformerName.Name = "panelCurrentTransformerName";
            panelCurrentTransformerName.Size = new Size(1063, 26);
            panelCurrentTransformerName.TabIndex = 2;
            // 
            // textBoxCurrentTransformerName
            // 
            textBoxCurrentTransformerName.Dock = DockStyle.Fill;
            textBoxCurrentTransformerName.Font = new Font("Consolas", 10F, FontStyle.Bold, GraphicsUnit.Point, 0);
            textBoxCurrentTransformerName.Location = new Point(0, 0);
            textBoxCurrentTransformerName.Name = "textBoxCurrentTransformerName";
            textBoxCurrentTransformerName.ReadOnly = true;
            textBoxCurrentTransformerName.Size = new Size(1049, 23);
            textBoxCurrentTransformerName.TabIndex = 0;
            // 
            // iconLabelRunCurrentTransformer
            // 
            iconLabelRunCurrentTransformer.AutoSize = true;
            iconLabelRunCurrentTransformer.Dock = DockStyle.Right;
            iconLabelRunCurrentTransformer.Enabled = false;
            iconLabelRunCurrentTransformer.Location = new Point(1049, 0);
            iconLabelRunCurrentTransformer.Name = "iconLabelRunCurrentTransformer";
            iconLabelRunCurrentTransformer.Size = new Size(14, 15);
            iconLabelRunCurrentTransformer.TabIndex = 0;
            iconLabelRunCurrentTransformer.Text = "R";
            iconLabelRunCurrentTransformer.Click += IconLabelRunCurrentTransformer_Click;
            // 
            // TextTransformUC
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            Controls.Add(splitContainerMain);
            Name = "TextTransformUC";
            Size = new Size(1600, 800);
            Load += TextTransformUC_Load;
            splitContainerTextAreas.Panel1.ResumeLayout(false);
            splitContainerTextAreas.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)splitContainerTextAreas).EndInit();
            splitContainerTextAreas.ResumeLayout(false);
            panelSrcTextBoxTopControls.ResumeLayout(false);
            panelSrcTextBoxTopControls.PerformLayout();
            panelResultTextBoxTopControls.ResumeLayout(false);
            panelResultTextBoxTopControls.PerformLayout();
            splitContainerMain.Panel1.ResumeLayout(false);
            splitContainerMain.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)splitContainerMain).EndInit();
            splitContainerMain.ResumeLayout(false);
            splitContainerTransformers.Panel1.ResumeLayout(false);
            splitContainerTransformers.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)splitContainerTransformers).EndInit();
            splitContainerTransformers.ResumeLayout(false);
            panelCurrentTransformer.ResumeLayout(false);
            panelCurrentTransformerName.ResumeLayout(false);
            panelCurrentTransformerName.PerformLayout();
            ResumeLayout(false);
        }

        #endregion

        private RichTextBox richTextBoxResultText;
        private SplitContainer splitContainerTextAreas;
        private RichTextBox richTextBoxSrcText;
        private SplitContainer splitContainerMain;
        private SplitContainer splitContainerTransformers;
        private TreeView treeViewTransformers;
        private Panel panelCurrentTransformer;
        private TextBox textBoxCurrentTransformerName;
        private RichTextBox richTextBoxCurrentTransformerDescription;
        private Panel panelCurrentTransformerName;
        private WinForms.Controls.IconLabel iconLabelRunCurrentTransformer;
        private Panel panelSrcTextBoxTopControls;
        private Label labelTitleScrTextBoxZoom;
        private Label labelSrcTextBoxZoom;
        private TextBox textBoxSrcTextBoxNewZoomValue;
        private Button buttonSetSrcTextBoxZoomFactor;
        private WinForms.Controls.IconLabel iconLabelSrcTextBoxIncreaseZoomFactory;
        private WinForms.Controls.IconLabel iconLabelSrcTextBoxDecreaseZoomFactory;
        private Panel panelResultTextBoxTopControls;
        private WinForms.Controls.IconLabel iconLabelResultTextBoxDecreaseZoomFactory;
        private WinForms.Controls.IconLabel iconLabelResultTextBoxIncreaseZoomFactory;
        private Button buttonSetResultTextBoxZoomFactor;
        private TextBox textBoxResultTextBoxNewZoomValue;
        private Label labelResultTextBoxZoom;
        private Label labelTitleResultTextBoxZoom;
    }
}
