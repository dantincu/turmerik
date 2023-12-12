namespace Turmerik.Utility.WinFormsApp.UserControls
{
    partial class TextLineConvertUC
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
            panelComboBoxConverter = new Panel();
            comboBoxConverter = new ComboBox();
            panelComboBoxConverter.SuspendLayout();
            SuspendLayout();
            // 
            // panelComboBoxConverter
            // 
            panelComboBoxConverter.Controls.Add(comboBoxConverter);
            panelComboBoxConverter.Dock = DockStyle.Top;
            panelComboBoxConverter.Location = new Point(0, 0);
            panelComboBoxConverter.Name = "panelComboBoxConverter";
            panelComboBoxConverter.Size = new Size(1600, 23);
            panelComboBoxConverter.TabIndex = 0;
            // 
            // comboBoxConverter
            // 
            comboBoxConverter.Dock = DockStyle.Fill;
            comboBoxConverter.DropDownStyle = ComboBoxStyle.DropDownList;
            comboBoxConverter.FormattingEnabled = true;
            comboBoxConverter.Location = new Point(0, 0);
            comboBoxConverter.Name = "comboBoxConverter";
            comboBoxConverter.Size = new Size(1600, 23);
            comboBoxConverter.TabIndex = 0;
            // 
            // TextLineConvertUC
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            Controls.Add(panelComboBoxConverter);
            Name = "TextLineConvertUC";
            Size = new Size(1600, 23);
            Load += TextLineConvertUC_Load;
            panelComboBoxConverter.ResumeLayout(false);
            ResumeLayout(false);
        }

        #endregion

        private Panel panelComboBoxConverter;
        private ComboBox comboBoxConverter;
    }
}
