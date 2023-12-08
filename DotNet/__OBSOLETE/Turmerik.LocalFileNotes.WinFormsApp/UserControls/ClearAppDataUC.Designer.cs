namespace Turmerik.LocalFileNotes.WinFormsApp.UserControls
{
    partial class ClearAppDataUC
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
            buttonClearAppData = new Button();
            labelExplanation = new Label();
            iconLabelToggleExplanationLabel = new WinForms.Controls.IconLabel();
            panelButton = new Panel();
            panelButton.SuspendLayout();
            SuspendLayout();
            // 
            // buttonClearAppData
            // 
            buttonClearAppData.Dock = DockStyle.Left;
            buttonClearAppData.Location = new Point(0, 0);
            buttonClearAppData.Name = "buttonClearAppData";
            buttonClearAppData.Size = new Size(105, 23);
            buttonClearAppData.TabIndex = 0;
            buttonClearAppData.Text = "Clear App Data";
            buttonClearAppData.UseVisualStyleBackColor = true;
            buttonClearAppData.Click += ButtonClearAppData_Click;
            // 
            // labelExplanation
            // 
            labelExplanation.AutoSize = true;
            labelExplanation.Dock = DockStyle.Top;
            labelExplanation.Location = new Point(0, 23);
            labelExplanation.MaximumSize = new Size(300, 150);
            labelExplanation.Name = "labelExplanation";
            labelExplanation.Size = new Size(92, 15);
            labelExplanation.TabIndex = 1;
            labelExplanation.Text = "Explanation text";
            // 
            // iconLabelToggleExplanationLabel
            // 
            iconLabelToggleExplanationLabel.AutoEllipsis = true;
            iconLabelToggleExplanationLabel.AutoSize = true;
            iconLabelToggleExplanationLabel.BackColor = SystemColors.Control;
            iconLabelToggleExplanationLabel.Dock = DockStyle.Left;
            iconLabelToggleExplanationLabel.Location = new Point(105, 0);
            iconLabelToggleExplanationLabel.Name = "iconLabelToggleExplanationLabel";
            iconLabelToggleExplanationLabel.Size = new Size(10, 15);
            iconLabelToggleExplanationLabel.TabIndex = 2;
            iconLabelToggleExplanationLabel.Text = "I";
            iconLabelToggleExplanationLabel.Click += IconLabelToggleExplanationLabel_Click;
            // 
            // panelButton
            // 
            panelButton.Controls.Add(iconLabelToggleExplanationLabel);
            panelButton.Controls.Add(buttonClearAppData);
            panelButton.Dock = DockStyle.Top;
            panelButton.Location = new Point(0, 0);
            panelButton.Name = "panelButton";
            panelButton.Size = new Size(300, 23);
            panelButton.TabIndex = 3;
            // 
            // ClearAppDataUC
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            Controls.Add(labelExplanation);
            Controls.Add(panelButton);
            Name = "ClearAppDataUC";
            Size = new Size(300, 58);
            panelButton.ResumeLayout(false);
            panelButton.PerformLayout();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private Button buttonClearAppData;
        private Label labelExplanation;
        private WinForms.Controls.IconLabel iconLabelToggleExplanationLabel;
        private Panel panelButton;
    }
}
