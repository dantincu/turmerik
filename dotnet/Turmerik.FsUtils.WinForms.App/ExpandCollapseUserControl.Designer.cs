namespace Turmerik.FsUtils.WinForms.App
{
    partial class ExpandCollapseUserControl
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
            this.buttonCollapse = new System.Windows.Forms.Button();
            this.buttonExpand = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // buttonCollapse
            // 
            this.buttonCollapse.Cursor = System.Windows.Forms.Cursors.Hand;
            this.buttonCollapse.Dock = System.Windows.Forms.DockStyle.Left;
            this.buttonCollapse.Image = global::Turmerik.FsUtils.WinForms.App.Properties.Resources.arrow_head_down_16x16;
            this.buttonCollapse.Location = new System.Drawing.Point(0, 0);
            this.buttonCollapse.Name = "buttonCollapse";
            this.buttonCollapse.Size = new System.Drawing.Size(32, 23);
            this.buttonCollapse.TabIndex = 5;
            this.buttonCollapse.UseVisualStyleBackColor = true;
            this.buttonCollapse.Click += new System.EventHandler(this.buttonCollapse_Click);
            // 
            // buttonExpand
            // 
            this.buttonExpand.Cursor = System.Windows.Forms.Cursors.Hand;
            this.buttonExpand.Dock = System.Windows.Forms.DockStyle.Left;
            this.buttonExpand.Image = global::Turmerik.FsUtils.WinForms.App.Properties.Resources.arrow_head_right_16x16;
            this.buttonExpand.Location = new System.Drawing.Point(32, 0);
            this.buttonExpand.Name = "buttonExpand";
            this.buttonExpand.Size = new System.Drawing.Size(32, 23);
            this.buttonExpand.TabIndex = 6;
            this.buttonExpand.UseVisualStyleBackColor = true;
            this.buttonExpand.Click += new System.EventHandler(this.buttonExpand_Click);
            // 
            // ExpandCollapseUserControl
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.buttonExpand);
            this.Controls.Add(this.buttonCollapse);
            this.Name = "ExpandCollapseUserControl";
            this.Size = new System.Drawing.Size(33, 23);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Button buttonCollapse;
        private System.Windows.Forms.Button buttonExpand;
    }
}
