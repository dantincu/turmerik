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
            labelTitleMainAction = new Label();
            iconLabelInfoMainAction = new WinForms.Controls.IconLabel();
            iconLabelMainAction = new WinForms.Controls.IconLabel();
            SuspendLayout();
            // 
            // labelTitleMainAction
            // 
            labelTitleMainAction.AutoSize = true;
            labelTitleMainAction.Dock = DockStyle.Left;
            labelTitleMainAction.Location = new Point(0, 0);
            labelTitleMainAction.Name = "labelTitleMainAction";
            labelTitleMainAction.Padding = new Padding(3);
            labelTitleMainAction.Size = new Size(93, 21);
            labelTitleMainAction.TabIndex = 0;
            labelTitleMainAction.Text = "Reset App Data";
            // 
            // iconLabelInfoMainAction
            // 
            iconLabelInfoMainAction.AutoSize = true;
            iconLabelInfoMainAction.Dock = DockStyle.Left;
            iconLabelInfoMainAction.Location = new Point(93, 0);
            iconLabelInfoMainAction.Name = "iconLabelInfoMainAction";
            iconLabelInfoMainAction.Size = new Size(14, 15);
            iconLabelInfoMainAction.TabIndex = 1;
            iconLabelInfoMainAction.Text = "R";
            iconLabelInfoMainAction.Click += IconLabelInfoMainAction_Click;
            // 
            // iconLabelMainAction
            // 
            iconLabelMainAction.AutoSize = true;
            iconLabelMainAction.Dock = DockStyle.Left;
            iconLabelMainAction.Location = new Point(107, 0);
            iconLabelMainAction.Name = "iconLabelMainAction";
            iconLabelMainAction.Size = new Size(14, 15);
            iconLabelMainAction.TabIndex = 2;
            iconLabelMainAction.Text = "R";
            iconLabelMainAction.Click += IconLabelMainAction_Click;
            // 
            // ClearAppDataUC
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            Controls.Add(iconLabelMainAction);
            Controls.Add(iconLabelInfoMainAction);
            Controls.Add(labelTitleMainAction);
            Name = "ClearAppDataUC";
            Size = new Size(150, 23);
            Load += ClearAppDataUC_Load;
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private Label labelTitleMainAction;
        private WinForms.Controls.IconLabel iconLabelInfoMainAction;
        private WinForms.Controls.IconLabel iconLabelMainAction;
    }
}
