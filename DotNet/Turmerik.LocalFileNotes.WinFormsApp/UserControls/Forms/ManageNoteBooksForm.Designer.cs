namespace Turmerik.LocalFileNotes.WinFormsApp
{
    partial class ManageNoteBooksForm
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

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(ManageNoteBooksForm));
            clearAppDatauc1 = new UserControls.ClearAppDataUC();
            SuspendLayout();
            // 
            // clearAppDatauc1
            // 
            clearAppDatauc1.Location = new Point(25, 21);
            clearAppDatauc1.Name = "clearAppDatauc1";
            clearAppDatauc1.Size = new Size(300, 23);
            clearAppDatauc1.TabIndex = 0;
            // 
            // ManageNoteBooksForm
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(1584, 761);
            Controls.Add(clearAppDatauc1);
            Icon = (Icon)resources.GetObject("$this.Icon");
            Name = "ManageNoteBooksForm";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "Turmerik Local File Notes";
            Load += ManageNoteBooksForm_Load;
            ResumeLayout(false);
        }

        #endregion

        private UserControls.ClearAppDataUC clearAppDatauc1;
    }
}