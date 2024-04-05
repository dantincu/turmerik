namespace Turmerik.LocalFileNotes.WinFormsApp.UserControls.Forms
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(AppRecoveryForm));
            clearAppDatauc1 = new ClearAppDataUC();
            buttonRestartApp = new Button();
            buttonExit = new Button();
            labelTitleOpenAppConfigFolder = new Label();
            labelTitleOpenAppLogsFolder = new Label();
            iconLabelOpenAppConfigFolder = new WinForms.Controls.IconLabel();
            iconLabelOpenAppLogsFolder = new WinForms.Controls.IconLabel();
            iconLabelOpenAppDataFolder = new WinForms.Controls.IconLabel();
            labelTitleOpenAppDataFolder = new Label();
            SuspendLayout();
            // 
            // clearAppDatauc1
            // 
            clearAppDatauc1.Location = new Point(36, 24);
            clearAppDatauc1.Name = "clearAppDatauc1";
            clearAppDatauc1.Size = new Size(150, 23);
            clearAppDatauc1.TabIndex = 0;
            // 
            // buttonRestartApp
            // 
            buttonRestartApp.Location = new Point(197, 23);
            buttonRestartApp.Name = "buttonRestartApp";
            buttonRestartApp.Size = new Size(85, 23);
            buttonRestartApp.TabIndex = 1;
            buttonRestartApp.Text = "Restart App";
            buttonRestartApp.UseVisualStyleBackColor = true;
            buttonRestartApp.Click += ButtonRestartApp_Click;
            // 
            // buttonExit
            // 
            buttonExit.Location = new Point(288, 23);
            buttonExit.Name = "buttonExit";
            buttonExit.Size = new Size(42, 23);
            buttonExit.TabIndex = 2;
            buttonExit.Text = "Exit";
            buttonExit.UseVisualStyleBackColor = true;
            buttonExit.Click += ButtonExit_Click;
            // 
            // labelTitleOpenAppConfigFolder
            // 
            labelTitleOpenAppConfigFolder.AutoSize = true;
            labelTitleOpenAppConfigFolder.Location = new Point(21, 89);
            labelTitleOpenAppConfigFolder.Name = "labelTitleOpenAppConfigFolder";
            labelTitleOpenAppConfigFolder.Size = new Size(136, 15);
            labelTitleOpenAppConfigFolder.TabIndex = 3;
            labelTitleOpenAppConfigFolder.Text = "Open App Config Folder";
            // 
            // labelTitleOpenAppLogsFolder
            // 
            labelTitleOpenAppLogsFolder.AutoSize = true;
            labelTitleOpenAppLogsFolder.Location = new Point(32, 119);
            labelTitleOpenAppLogsFolder.Name = "labelTitleOpenAppLogsFolder";
            labelTitleOpenAppLogsFolder.Size = new Size(125, 15);
            labelTitleOpenAppLogsFolder.TabIndex = 4;
            labelTitleOpenAppLogsFolder.Text = "Open App Logs Folder";
            // 
            // iconLabelOpenAppConfigFolder
            // 
            iconLabelOpenAppConfigFolder.AutoSize = true;
            iconLabelOpenAppConfigFolder.Location = new Point(163, 86);
            iconLabelOpenAppConfigFolder.Name = "iconLabelOpenAppConfigFolder";
            iconLabelOpenAppConfigFolder.Size = new Size(14, 15);
            iconLabelOpenAppConfigFolder.TabIndex = 5;
            iconLabelOpenAppConfigFolder.Text = "R";
            iconLabelOpenAppConfigFolder.Click += IconLabelOpenAppConfigFolder_Click;
            // 
            // iconLabelOpenAppLogsFolder
            // 
            iconLabelOpenAppLogsFolder.AutoSize = true;
            iconLabelOpenAppLogsFolder.Location = new Point(163, 117);
            iconLabelOpenAppLogsFolder.Name = "iconLabelOpenAppLogsFolder";
            iconLabelOpenAppLogsFolder.Size = new Size(14, 15);
            iconLabelOpenAppLogsFolder.TabIndex = 6;
            iconLabelOpenAppLogsFolder.Text = "R";
            iconLabelOpenAppLogsFolder.Click += IconLabelOpenAppLogsFolder_Click;
            // 
            // iconLabelOpenAppDataFolder
            // 
            iconLabelOpenAppDataFolder.AutoSize = true;
            iconLabelOpenAppDataFolder.Location = new Point(163, 56);
            iconLabelOpenAppDataFolder.Name = "iconLabelOpenAppDataFolder";
            iconLabelOpenAppDataFolder.Size = new Size(14, 15);
            iconLabelOpenAppDataFolder.TabIndex = 8;
            iconLabelOpenAppDataFolder.Text = "R";
            iconLabelOpenAppDataFolder.Click += IconLabelOpenAppDataFolder_Click;
            // 
            // labelTitleOpenAppDataFolder
            // 
            labelTitleOpenAppDataFolder.AutoSize = true;
            labelTitleOpenAppDataFolder.Location = new Point(32, 60);
            labelTitleOpenAppDataFolder.Name = "labelTitleOpenAppDataFolder";
            labelTitleOpenAppDataFolder.Size = new Size(124, 15);
            labelTitleOpenAppDataFolder.TabIndex = 7;
            labelTitleOpenAppDataFolder.Text = "Open App Data Folder";
            // 
            // AppRecoveryForm
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(800, 450);
            Controls.Add(iconLabelOpenAppDataFolder);
            Controls.Add(labelTitleOpenAppDataFolder);
            Controls.Add(iconLabelOpenAppLogsFolder);
            Controls.Add(iconLabelOpenAppConfigFolder);
            Controls.Add(labelTitleOpenAppLogsFolder);
            Controls.Add(labelTitleOpenAppConfigFolder);
            Controls.Add(buttonExit);
            Controls.Add(buttonRestartApp);
            Controls.Add(clearAppDatauc1);
            Icon = (Icon)resources.GetObject("$this.Icon");
            Name = "AppRecoveryForm";
            Text = "App Recovery";
            Load += AppRecoveryForm_Load;
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private ClearAppDataUC clearAppDatauc1;
        private Button buttonRestartApp;
        private Button buttonExit;
        private Label labelTitleOpenAppConfigFolder;
        private Label labelTitleOpenAppLogsFolder;
        private WinForms.Controls.IconLabel iconLabelOpenAppConfigFolder;
        private WinForms.Controls.IconLabel iconLabelOpenAppLogsFolder;
        private WinForms.Controls.IconLabel iconLabelOpenAppDataFolder;
        private Label labelTitleOpenAppDataFolder;
    }
}