namespace Turmerik.FsUtils.WinForms.App
{
    partial class ExceptionHierarchyUserControl
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
            this.exceptionHierarchyTreeView = new System.Windows.Forms.TreeView();
            this.exceptionUserControl = new Turmerik.FsUtils.WinForms.App.ExceptionUserControl();
            this.SuspendLayout();
            // 
            // exceptionHierarchyTreeView
            // 
            this.exceptionHierarchyTreeView.Dock = System.Windows.Forms.DockStyle.Top;
            this.exceptionHierarchyTreeView.Location = new System.Drawing.Point(0, 0);
            this.exceptionHierarchyTreeView.Name = "exceptionHierarchyTreeView";
            this.exceptionHierarchyTreeView.Size = new System.Drawing.Size(823, 145);
            this.exceptionHierarchyTreeView.TabIndex = 0;
            // 
            // currentExceptionUserControl
            // 
            this.exceptionUserControl.Dock = System.Windows.Forms.DockStyle.Fill;
            this.exceptionUserControl.Location = new System.Drawing.Point(0, 145);
            this.exceptionUserControl.Name = "currentExceptionUserControl";
            this.exceptionUserControl.Size = new System.Drawing.Size(823, 490);
            this.exceptionUserControl.TabIndex = 1;
            // 
            // ExceptionHierarchyUserControl
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.exceptionUserControl);
            this.Controls.Add(this.exceptionHierarchyTreeView);
            this.Name = "ExceptionHierarchyUserControl";
            this.Size = new System.Drawing.Size(823, 635);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.TreeView exceptionHierarchyTreeView;
        private ExceptionUserControl exceptionUserControl;
    }
}
