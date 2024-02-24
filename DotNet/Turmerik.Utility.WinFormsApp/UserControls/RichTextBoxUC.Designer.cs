namespace Turmerik.Utility.WinFormsApp.UserControls
{
    partial class RichTextBoxUC
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
            panelTopControls = new Panel();
            iconLabelDecreaseZoomFactory = new WinForms.Controls.IconLabel();
            iconLabelIncreaseZoomFactory = new WinForms.Controls.IconLabel();
            buttonSetZoomFactor = new Button();
            textBoxNewZoomValue = new TextBox();
            labelZoomValue = new Label();
            labelTitleZoomValue = new Label();
            richTextBox = new RichTextBox();
            panelTopControls.SuspendLayout();
            SuspendLayout();
            // 
            // panelSrcTextBoxTopControls
            // 
            panelTopControls.Controls.Add(iconLabelDecreaseZoomFactory);
            panelTopControls.Controls.Add(iconLabelIncreaseZoomFactory);
            panelTopControls.Controls.Add(buttonSetZoomFactor);
            panelTopControls.Controls.Add(textBoxNewZoomValue);
            panelTopControls.Controls.Add(labelZoomValue);
            panelTopControls.Controls.Add(labelTitleZoomValue);
            panelTopControls.Dock = DockStyle.Top;
            panelTopControls.Location = new Point(0, 0);
            panelTopControls.Name = "panelTopControls";
            panelTopControls.Size = new Size(225, 23);
            panelTopControls.TabIndex = 2;
            // 
            // iconLabelSrcTextBoxDecreaseZoomFactory
            // 
            iconLabelDecreaseZoomFactory.AutoSize = true;
            iconLabelDecreaseZoomFactory.Dock = DockStyle.Left;
            iconLabelDecreaseZoomFactory.Location = new Point(173, 0);
            iconLabelDecreaseZoomFactory.Name = "iconLabelDecreaseZoomFactory";
            iconLabelDecreaseZoomFactory.Size = new Size(14, 15);
            iconLabelDecreaseZoomFactory.TabIndex = 5;
            iconLabelDecreaseZoomFactory.Text = "R";
            iconLabelDecreaseZoomFactory.Click += IconLabelSrcTextBoxDecreaseZoomFactory_Click;
            // 
            // iconLabelSrcTextBoxIncreaseZoomFactory
            // 
            iconLabelIncreaseZoomFactory.AutoSize = true;
            iconLabelIncreaseZoomFactory.Dock = DockStyle.Left;
            iconLabelIncreaseZoomFactory.Location = new Point(159, 0);
            iconLabelIncreaseZoomFactory.Name = "iconLabelIncreaseZoomFactory";
            iconLabelIncreaseZoomFactory.Size = new Size(14, 15);
            iconLabelIncreaseZoomFactory.TabIndex = 4;
            iconLabelIncreaseZoomFactory.Text = "R";
            iconLabelIncreaseZoomFactory.Click += IconLabelSrcTextBoxIncreaseZoomFactory_Click;
            // 
            // buttonSetSrcTextBoxZoomFactor
            // 
            buttonSetZoomFactor.Dock = DockStyle.Left;
            buttonSetZoomFactor.Location = new Point(121, 0);
            buttonSetZoomFactor.Name = "buttonSetZoomFactor";
            buttonSetZoomFactor.Size = new Size(38, 23);
            buttonSetZoomFactor.TabIndex = 3;
            buttonSetZoomFactor.Text = "Set";
            buttonSetZoomFactor.UseVisualStyleBackColor = true;
            // 
            // textBoxNewZoomValue
            // 
            textBoxNewZoomValue.Dock = DockStyle.Left;
            textBoxNewZoomValue.Font = new Font("Consolas", 9F, FontStyle.Regular, GraphicsUnit.Point, 0);
            textBoxNewZoomValue.Location = new Point(86, 0);
            textBoxNewZoomValue.Name = "textBoxNewZoomValue";
            textBoxNewZoomValue.Size = new Size(35, 22);
            textBoxNewZoomValue.TabIndex = 2;
            textBoxNewZoomValue.Text = "100";
            textBoxNewZoomValue.KeyDown += TextBoxSrcTextBoxNewZoomValue_KeyDown;
            // 
            // labelTextBoxZoom
            // 
            labelZoomValue.AutoSize = true;
            labelZoomValue.Dock = DockStyle.Left;
            labelZoomValue.Font = new Font("Consolas", 9F, FontStyle.Regular, GraphicsUnit.Point, 0);
            labelZoomValue.Location = new Point(45, 0);
            labelZoomValue.Name = "labelZoomValue";
            labelZoomValue.Padding = new Padding(3);
            labelZoomValue.Size = new Size(41, 20);
            labelZoomValue.TabIndex = 1;
            labelZoomValue.Text = "100%";
            // 
            // labelTitleScrTextBoxZoom
            // 
            labelTitleZoomValue.AutoSize = true;
            labelTitleZoomValue.Dock = DockStyle.Left;
            labelTitleZoomValue.Location = new Point(0, 0);
            labelTitleZoomValue.Name = "labelTitleZoomValue";
            labelTitleZoomValue.Padding = new Padding(3);
            labelTitleZoomValue.Size = new Size(45, 21);
            labelTitleZoomValue.TabIndex = 0;
            labelTitleZoomValue.Text = "Zoom";
            // 
            // richTextBox
            // 
            richTextBox.Dock = DockStyle.Fill;
            richTextBox.Location = new Point(0, 23);
            richTextBox.Name = "richTextBox";
            richTextBox.Size = new Size(225, 127);
            richTextBox.TabIndex = 3;
            richTextBox.Text = "";
            richTextBox.KeyDown += RichTextBox_KeyDown;
            // 
            // RichTextBoxUC
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            Controls.Add(richTextBox);
            Controls.Add(panelTopControls);
            Name = "RichTextBoxUC";
            Size = new Size(225, 150);
            panelTopControls.ResumeLayout(false);
            panelTopControls.PerformLayout();
            ResumeLayout(false);
        }

        #endregion

        private Panel panelTopControls;
        private WinForms.Controls.IconLabel iconLabelDecreaseZoomFactory;
        private WinForms.Controls.IconLabel iconLabelIncreaseZoomFactory;
        private Button buttonSetZoomFactor;
        private TextBox textBoxNewZoomValue;
        private Label labelZoomValue;
        private Label labelTitleZoomValue;
        private RichTextBox richTextBox;
    }
}
