namespace Turmerik.LocalFileNotes.WinFormsApp
{
    partial class NoteBookForm
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
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
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(NoteBookForm));
            statusStripMain = new StatusStrip();
            toolStripStatusLabelMain = new ToolStripStatusLabel();
            menuStripMain = new MenuStrip();
            fileToolStripMenuItem = new ToolStripMenuItem();
            fileNewToolStripMenuItem = new ToolStripMenuItem();
            newNoteToolStripMenuItem = new ToolStripMenuItem();
            newTextFileToolStripMenuItem = new ToolStripMenuItem();
            fileOpenToolStripMenuItem = new ToolStripMenuItem();
            openFolderToolStripMenuItem = new ToolStripMenuItem();
            openNoteToolStripMenuItem = new ToolStripMenuItem();
            openFileToolStripMenuItem = new ToolStripMenuItem();
            saveToolStripMenuItem = new ToolStripMenuItem();
            saveAllToolStripMenuItem = new ToolStripMenuItem();
            closeToolStripMenuItem = new ToolStripMenuItem();
            exitAppToolStripMenuItem = new ToolStripMenuItem();
            noteBookToolStripMenuItem = new ToolStripMenuItem();
            switchToNoteBookToolStripMenuItem = new ToolStripMenuItem();
            createNewNoteBookToolStripMenuItem = new ToolStripMenuItem();
            openNoteBookToolStripMenuItem = new ToolStripMenuItem();
            closeNoteBookToolStripMenuItem = new ToolStripMenuItem();
            manageToolStripMenuItem = new ToolStripMenuItem();
            manageSettingsToolStripMenuItem = new ToolStripMenuItem();
            helpToolStripMenuItem = new ToolStripMenuItem();
            helpAboutToolStripMenuItem = new ToolStripMenuItem();
            statusStripMain.SuspendLayout();
            menuStripMain.SuspendLayout();
            SuspendLayout();
            // 
            // statusStripMain
            // 
            statusStripMain.Items.AddRange(new ToolStripItem[] { toolStripStatusLabelMain });
            statusStripMain.Location = new Point(0, 839);
            statusStripMain.Name = "statusStripMain";
            statusStripMain.Size = new Size(1784, 22);
            statusStripMain.TabIndex = 0;
            // 
            // toolStripStatusLabelMain
            // 
            toolStripStatusLabelMain.Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            toolStripStatusLabelMain.Name = "toolStripStatusLabelMain";
            toolStripStatusLabelMain.Size = new Size(0, 17);
            // 
            // menuStripMain
            // 
            menuStripMain.Items.AddRange(new ToolStripItem[] { fileToolStripMenuItem, noteBookToolStripMenuItem, manageToolStripMenuItem, helpToolStripMenuItem });
            menuStripMain.Location = new Point(0, 0);
            menuStripMain.Name = "menuStripMain";
            menuStripMain.Size = new Size(1784, 24);
            menuStripMain.TabIndex = 1;
            menuStripMain.Text = "menuStrip1";
            // 
            // fileToolStripMenuItem
            // 
            fileToolStripMenuItem.DropDownItems.AddRange(new ToolStripItem[] { fileNewToolStripMenuItem, fileOpenToolStripMenuItem, saveToolStripMenuItem, saveAllToolStripMenuItem, closeToolStripMenuItem, exitAppToolStripMenuItem });
            fileToolStripMenuItem.Name = "fileToolStripMenuItem";
            fileToolStripMenuItem.Size = new Size(37, 20);
            fileToolStripMenuItem.Text = "&File";
            // 
            // fileNewToolStripMenuItem
            // 
            fileNewToolStripMenuItem.DropDownItems.AddRange(new ToolStripItem[] { newNoteToolStripMenuItem, newTextFileToolStripMenuItem });
            fileNewToolStripMenuItem.Name = "fileNewToolStripMenuItem";
            fileNewToolStripMenuItem.Size = new Size(187, 22);
            fileNewToolStripMenuItem.Text = "&New";
            // 
            // newNoteToolStripMenuItem
            // 
            newNoteToolStripMenuItem.Name = "newNoteToolStripMenuItem";
            newNoteToolStripMenuItem.ShortcutKeys = Keys.Control | Keys.Shift | Keys.N;
            newNoteToolStripMenuItem.Size = new Size(175, 22);
            newNoteToolStripMenuItem.Text = "&Note";
            // 
            // newTextFileToolStripMenuItem
            // 
            newTextFileToolStripMenuItem.Name = "newTextFileToolStripMenuItem";
            newTextFileToolStripMenuItem.ShortcutKeys = Keys.Control | Keys.N;
            newTextFileToolStripMenuItem.Size = new Size(175, 22);
            newTextFileToolStripMenuItem.Text = "Text &File";
            // 
            // fileOpenToolStripMenuItem
            // 
            fileOpenToolStripMenuItem.DropDownItems.AddRange(new ToolStripItem[] { openFolderToolStripMenuItem, openNoteToolStripMenuItem, openFileToolStripMenuItem });
            fileOpenToolStripMenuItem.Name = "fileOpenToolStripMenuItem";
            fileOpenToolStripMenuItem.Size = new Size(187, 22);
            fileOpenToolStripMenuItem.Text = "&Open";
            // 
            // openFolderToolStripMenuItem
            // 
            openFolderToolStripMenuItem.Name = "openFolderToolStripMenuItem";
            openFolderToolStripMenuItem.ShortcutKeys = Keys.Control | Keys.Alt | Keys.Shift | Keys.O;
            openFolderToolStripMenuItem.Size = new Size(205, 22);
            openFolderToolStripMenuItem.Text = "Fol&der";
            // 
            // openNoteToolStripMenuItem
            // 
            openNoteToolStripMenuItem.Name = "openNoteToolStripMenuItem";
            openNoteToolStripMenuItem.ShortcutKeys = Keys.Control | Keys.Shift | Keys.O;
            openNoteToolStripMenuItem.Size = new Size(205, 22);
            openNoteToolStripMenuItem.Text = "&Note";
            // 
            // openFileToolStripMenuItem
            // 
            openFileToolStripMenuItem.Name = "openFileToolStripMenuItem";
            openFileToolStripMenuItem.ShortcutKeys = Keys.Control | Keys.O;
            openFileToolStripMenuItem.Size = new Size(205, 22);
            openFileToolStripMenuItem.Text = "&File";
            // 
            // saveToolStripMenuItem
            // 
            saveToolStripMenuItem.Name = "saveToolStripMenuItem";
            saveToolStripMenuItem.ShortcutKeys = Keys.Control | Keys.S;
            saveToolStripMenuItem.Size = new Size(187, 22);
            saveToolStripMenuItem.Text = "&Save";
            // 
            // saveAllToolStripMenuItem
            // 
            saveAllToolStripMenuItem.Name = "saveAllToolStripMenuItem";
            saveAllToolStripMenuItem.ShortcutKeys = Keys.Control | Keys.Shift | Keys.S;
            saveAllToolStripMenuItem.Size = new Size(187, 22);
            saveAllToolStripMenuItem.Text = "Save &All";
            // 
            // closeToolStripMenuItem
            // 
            closeToolStripMenuItem.Name = "closeToolStripMenuItem";
            closeToolStripMenuItem.Size = new Size(187, 22);
            closeToolStripMenuItem.Text = "&Close";
            // 
            // exitAppToolStripMenuItem
            // 
            exitAppToolStripMenuItem.Name = "exitAppToolStripMenuItem";
            exitAppToolStripMenuItem.Size = new Size(187, 22);
            exitAppToolStripMenuItem.Text = "E&xit";
            // 
            // noteBookToolStripMenuItem
            // 
            noteBookToolStripMenuItem.DropDownItems.AddRange(new ToolStripItem[] { switchToNoteBookToolStripMenuItem, createNewNoteBookToolStripMenuItem, openNoteBookToolStripMenuItem, closeNoteBookToolStripMenuItem });
            noteBookToolStripMenuItem.Name = "noteBookToolStripMenuItem";
            noteBookToolStripMenuItem.Size = new Size(75, 20);
            noteBookToolStripMenuItem.Text = "Note &Book";
            // 
            // switchToNoteBookToolStripMenuItem
            // 
            switchToNoteBookToolStripMenuItem.Name = "switchToNoteBookToolStripMenuItem";
            switchToNoteBookToolStripMenuItem.ShortcutKeys = Keys.Control | Keys.Alt | Keys.Shift | Keys.S;
            switchToNoteBookToolStripMenuItem.Size = new Size(233, 22);
            switchToNoteBookToolStripMenuItem.Text = "&Switch To";
            // 
            // createNewNoteBookToolStripMenuItem
            // 
            createNewNoteBookToolStripMenuItem.Name = "createNewNoteBookToolStripMenuItem";
            createNewNoteBookToolStripMenuItem.ShortcutKeys = Keys.Control | Keys.Alt | Keys.Shift | Keys.N;
            createNewNoteBookToolStripMenuItem.Size = new Size(233, 22);
            createNewNoteBookToolStripMenuItem.Text = "Create &New";
            // 
            // openNoteBookToolStripMenuItem
            // 
            openNoteBookToolStripMenuItem.Name = "openNoteBookToolStripMenuItem";
            openNoteBookToolStripMenuItem.ShortcutKeys = Keys.Control | Keys.Alt | Keys.Shift | Keys.B;
            openNoteBookToolStripMenuItem.Size = new Size(233, 22);
            openNoteBookToolStripMenuItem.Text = "&Open";
            // 
            // closeNoteBookToolStripMenuItem
            // 
            closeNoteBookToolStripMenuItem.Name = "closeNoteBookToolStripMenuItem";
            closeNoteBookToolStripMenuItem.ShortcutKeys = Keys.Control | Keys.Alt | Keys.Shift | Keys.C;
            closeNoteBookToolStripMenuItem.Size = new Size(233, 22);
            closeNoteBookToolStripMenuItem.Text = "&Close";
            // 
            // manageToolStripMenuItem
            // 
            manageToolStripMenuItem.DropDownItems.AddRange(new ToolStripItem[] { manageSettingsToolStripMenuItem });
            manageToolStripMenuItem.Name = "manageToolStripMenuItem";
            manageToolStripMenuItem.Size = new Size(62, 20);
            manageToolStripMenuItem.Text = "&Manage";
            // 
            // manageSettingsToolStripMenuItem
            // 
            manageSettingsToolStripMenuItem.Name = "manageSettingsToolStripMenuItem";
            manageSettingsToolStripMenuItem.Size = new Size(116, 22);
            manageSettingsToolStripMenuItem.Text = "&Settings";
            // 
            // helpToolStripMenuItem
            // 
            helpToolStripMenuItem.DropDownItems.AddRange(new ToolStripItem[] { helpAboutToolStripMenuItem });
            helpToolStripMenuItem.Name = "helpToolStripMenuItem";
            helpToolStripMenuItem.Size = new Size(44, 20);
            helpToolStripMenuItem.Text = "&Help";
            // 
            // helpAboutToolStripMenuItem
            // 
            helpAboutToolStripMenuItem.Name = "helpAboutToolStripMenuItem";
            helpAboutToolStripMenuItem.Size = new Size(107, 22);
            helpAboutToolStripMenuItem.Text = "&About";
            // 
            // NoteBookForm
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(1784, 861);
            Controls.Add(statusStripMain);
            Controls.Add(menuStripMain);
            Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            Icon = (Icon)resources.GetObject("$this.Icon");
            MainMenuStrip = menuStripMain;
            Name = "NoteBookForm";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "Turmerik Local File Notes - ";
            Load += NoteBookForm_Load;
            statusStripMain.ResumeLayout(false);
            statusStripMain.PerformLayout();
            menuStripMain.ResumeLayout(false);
            menuStripMain.PerformLayout();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private StatusStrip statusStripMain;
        private ToolStripStatusLabel toolStripStatusLabelMain;
        private MenuStrip menuStripMain;
        private ToolStripMenuItem fileToolStripMenuItem;
        private ToolStripMenuItem fileOpenToolStripMenuItem;
        private ToolStripMenuItem fileNewToolStripMenuItem;
        private ToolStripMenuItem saveToolStripMenuItem;
        private ToolStripMenuItem saveAllToolStripMenuItem;
        private ToolStripMenuItem exitAppToolStripMenuItem;
        private ToolStripMenuItem newTextFileToolStripMenuItem;
        private ToolStripMenuItem newNoteToolStripMenuItem;
        private ToolStripMenuItem openNoteToolStripMenuItem;
        private ToolStripMenuItem openFileToolStripMenuItem;
        private ToolStripMenuItem openFolderToolStripMenuItem;
        private ToolStripMenuItem noteBookToolStripMenuItem;
        private ToolStripMenuItem createNewNoteBookToolStripMenuItem;
        private ToolStripMenuItem switchToNoteBookToolStripMenuItem;
        private ToolStripMenuItem manageToolStripMenuItem;
        private ToolStripMenuItem helpToolStripMenuItem;
        private ToolStripMenuItem helpAboutToolStripMenuItem;
        private ToolStripMenuItem manageSettingsToolStripMenuItem;
        private ToolStripMenuItem openNoteBookToolStripMenuItem;
        private ToolStripMenuItem closeNoteBookToolStripMenuItem;
        private ToolStripMenuItem closeToolStripMenuItem;
    }
}
