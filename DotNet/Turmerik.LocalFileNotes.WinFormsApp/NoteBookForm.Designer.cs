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
            newToolStripMenuItem = new ToolStripMenuItem();
            newNoteToolStripMenuItem = new ToolStripMenuItem();
            newTextFileToolStripMenuItem = new ToolStripMenuItem();
            openToolStripMenuItem = new ToolStripMenuItem();
            folderToolStripMenuItem = new ToolStripMenuItem();
            noteToolStripMenuItem = new ToolStripMenuItem();
            fileToolStripMenuItem1 = new ToolStripMenuItem();
            saveToolStripMenuItem = new ToolStripMenuItem();
            saveAllToolStripMenuItem = new ToolStripMenuItem();
            exitAppToolStripMenuItem = new ToolStripMenuItem();
            noteBookToolStripMenuItem = new ToolStripMenuItem();
            switchToNoteBookToolStripMenuItem = new ToolStripMenuItem();
            createNewNoteBookToolStripMenuItem = new ToolStripMenuItem();
            openToolStripMenuItem1 = new ToolStripMenuItem();
            manageToolStripMenuItem = new ToolStripMenuItem();
            settingsToolStripMenuItem = new ToolStripMenuItem();
            helpToolStripMenuItem = new ToolStripMenuItem();
            aboutToolStripMenuItem = new ToolStripMenuItem();
            statusStripMain.SuspendLayout();
            menuStripMain.SuspendLayout();
            SuspendLayout();
            // 
            // statusStripMain
            // 
            statusStripMain.Items.AddRange(new ToolStripItem[] { toolStripStatusLabelMain });
            statusStripMain.Location = new Point(0, 736);
            statusStripMain.Name = "statusStripMain";
            statusStripMain.Size = new Size(1600, 22);
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
            menuStripMain.Size = new Size(1600, 24);
            menuStripMain.TabIndex = 1;
            menuStripMain.Text = "menuStrip1";
            // 
            // fileToolStripMenuItem
            // 
            fileToolStripMenuItem.DropDownItems.AddRange(new ToolStripItem[] { newToolStripMenuItem, openToolStripMenuItem, saveToolStripMenuItem, saveAllToolStripMenuItem, exitAppToolStripMenuItem });
            fileToolStripMenuItem.Name = "fileToolStripMenuItem";
            fileToolStripMenuItem.Size = new Size(37, 20);
            fileToolStripMenuItem.Text = "&File";
            // 
            // newToolStripMenuItem
            // 
            newToolStripMenuItem.DropDownItems.AddRange(new ToolStripItem[] { newNoteToolStripMenuItem, newTextFileToolStripMenuItem });
            newToolStripMenuItem.Name = "newToolStripMenuItem";
            newToolStripMenuItem.Size = new Size(187, 22);
            newToolStripMenuItem.Text = "&New";
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
            // openToolStripMenuItem
            // 
            openToolStripMenuItem.DropDownItems.AddRange(new ToolStripItem[] { folderToolStripMenuItem, noteToolStripMenuItem, fileToolStripMenuItem1 });
            openToolStripMenuItem.Name = "openToolStripMenuItem";
            openToolStripMenuItem.Size = new Size(187, 22);
            openToolStripMenuItem.Text = "&Open";
            // 
            // folderToolStripMenuItem
            // 
            folderToolStripMenuItem.Name = "folderToolStripMenuItem";
            folderToolStripMenuItem.ShortcutKeys = Keys.Control | Keys.Alt | Keys.Shift | Keys.O;
            folderToolStripMenuItem.Size = new Size(205, 22);
            folderToolStripMenuItem.Text = "Fol&der";
            // 
            // noteToolStripMenuItem
            // 
            noteToolStripMenuItem.Name = "noteToolStripMenuItem";
            noteToolStripMenuItem.ShortcutKeys = Keys.Control | Keys.Shift | Keys.O;
            noteToolStripMenuItem.Size = new Size(205, 22);
            noteToolStripMenuItem.Text = "&Note";
            // 
            // fileToolStripMenuItem1
            // 
            fileToolStripMenuItem1.Name = "fileToolStripMenuItem1";
            fileToolStripMenuItem1.ShortcutKeys = Keys.Control | Keys.O;
            fileToolStripMenuItem1.Size = new Size(205, 22);
            fileToolStripMenuItem1.Text = "&File";
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
            saveAllToolStripMenuItem.Text = "Save All";
            // 
            // exitAppToolStripMenuItem
            // 
            exitAppToolStripMenuItem.Name = "exitAppToolStripMenuItem";
            exitAppToolStripMenuItem.Size = new Size(187, 22);
            exitAppToolStripMenuItem.Text = "E&xit";
            // 
            // noteBookToolStripMenuItem
            // 
            noteBookToolStripMenuItem.DropDownItems.AddRange(new ToolStripItem[] { switchToNoteBookToolStripMenuItem, createNewNoteBookToolStripMenuItem, openToolStripMenuItem1 });
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
            createNewNoteBookToolStripMenuItem.Text = "&Create New";
            // 
            // openToolStripMenuItem1
            // 
            openToolStripMenuItem1.Name = "openToolStripMenuItem1";
            openToolStripMenuItem1.ShortcutKeys = Keys.Control | Keys.Alt | Keys.Shift | Keys.B;
            openToolStripMenuItem1.Size = new Size(233, 22);
            openToolStripMenuItem1.Text = "&Open";
            // 
            // manageToolStripMenuItem
            // 
            manageToolStripMenuItem.DropDownItems.AddRange(new ToolStripItem[] { settingsToolStripMenuItem });
            manageToolStripMenuItem.Name = "manageToolStripMenuItem";
            manageToolStripMenuItem.Size = new Size(62, 20);
            manageToolStripMenuItem.Text = "&Manage";
            // 
            // settingsToolStripMenuItem
            // 
            settingsToolStripMenuItem.Name = "settingsToolStripMenuItem";
            settingsToolStripMenuItem.Size = new Size(116, 22);
            settingsToolStripMenuItem.Text = "&Settings";
            // 
            // helpToolStripMenuItem
            // 
            helpToolStripMenuItem.DropDownItems.AddRange(new ToolStripItem[] { aboutToolStripMenuItem });
            helpToolStripMenuItem.Name = "helpToolStripMenuItem";
            helpToolStripMenuItem.Size = new Size(44, 20);
            helpToolStripMenuItem.Text = "&Help";
            // 
            // aboutToolStripMenuItem
            // 
            aboutToolStripMenuItem.Name = "aboutToolStripMenuItem";
            aboutToolStripMenuItem.Size = new Size(107, 22);
            aboutToolStripMenuItem.Text = "&About";
            // 
            // NoteBookForm
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(1600, 758);
            Controls.Add(statusStripMain);
            Controls.Add(menuStripMain);
            Font = new Font("Segoe UI", 9F);
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
        private ToolStripMenuItem openToolStripMenuItem;
        private ToolStripMenuItem newToolStripMenuItem;
        private ToolStripMenuItem saveToolStripMenuItem;
        private ToolStripMenuItem saveAllToolStripMenuItem;
        private ToolStripMenuItem exitAppToolStripMenuItem;
        private ToolStripMenuItem newTextFileToolStripMenuItem;
        private ToolStripMenuItem newNoteToolStripMenuItem;
        private ToolStripMenuItem noteToolStripMenuItem;
        private ToolStripMenuItem fileToolStripMenuItem1;
        private ToolStripMenuItem folderToolStripMenuItem;
        private ToolStripMenuItem noteBookToolStripMenuItem;
        private ToolStripMenuItem createNewNoteBookToolStripMenuItem;
        private ToolStripMenuItem switchToNoteBookToolStripMenuItem;
        private ToolStripMenuItem manageToolStripMenuItem;
        private ToolStripMenuItem helpToolStripMenuItem;
        private ToolStripMenuItem aboutToolStripMenuItem;
        private ToolStripMenuItem settingsToolStripMenuItem;
        private ToolStripMenuItem openToolStripMenuItem1;
    }
}
