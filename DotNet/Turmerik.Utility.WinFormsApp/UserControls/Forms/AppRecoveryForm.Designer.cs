namespace Turmerik.Utility.WinFormsApp.UserControls.Forms
{
    partial class AppRecoveryForm
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
            clearAppDatauc1 = new ClearAppDataUC();
            buttonRestartApp = new Button();
            buttonExit = new Button();
            SuspendLayout();
            // 
            // clearAppDatauc1
            // 
            clearAppDatauc1.Location = new Point(16, 11);
            clearAppDatauc1.Name = "clearAppDatauc1";
            clearAppDatauc1.Size = new Size(150, 23);
            clearAppDatauc1.TabIndex = 0;
            // 
            // buttonRestartApp
            // 
            buttonRestartApp.Location = new Point(177, 10);
            buttonRestartApp.Name = "buttonRestartApp";
            buttonRestartApp.Size = new Size(85, 23);
            buttonRestartApp.TabIndex = 1;
            buttonRestartApp.Text = "Restart App";
            buttonRestartApp.UseVisualStyleBackColor = true;
            buttonRestartApp.Click += ButtonRestartApp_Click;
            // 
            // buttonExit
            // 
            buttonExit.Location = new Point(268, 10);
            buttonExit.Name = "buttonExit";
            buttonExit.Size = new Size(42, 23);
            buttonExit.TabIndex = 2;
            buttonExit.Text = "Exit";
            buttonExit.UseVisualStyleBackColor = true;
            buttonExit.Click += ButtonExit_Click;
            // 
            // AppRecoveryForm
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(800, 450);
            Controls.Add(buttonExit);
            Controls.Add(buttonRestartApp);
            Controls.Add(clearAppDatauc1);
            Name = "AppRecoveryForm";
            Text = "App Recovery";
            Load += AppRecoveryForm_Load;
            ResumeLayout(false);
        }

        #endregion

        private ClearAppDataUC clearAppDatauc1;
        private Button buttonRestartApp;
        private Button buttonExit;
    }
}