namespace Turmerik.Utility.WinFormsApp.UserControls
{
    partial class TextUtilsUC
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
            groupBoxFetchWebResource = new GroupBox();
            fetchWebResourceUC = new FetchWebResourceUC();
            groupBoxConvertNameToIdnf = new GroupBox();
            nameToIdnfConverterUC = new NameToIdnfConverterUC();
            groupBoxTextToMd = new GroupBox();
            textToMdUC = new TextToMdUC();
            groupBoxFetchWebResource.SuspendLayout();
            groupBoxConvertNameToIdnf.SuspendLayout();
            groupBoxTextToMd.SuspendLayout();
            SuspendLayout();
            // 
            // groupBoxFetchWebResource
            // 
            groupBoxFetchWebResource.Controls.Add(fetchWebResourceUC);
            groupBoxFetchWebResource.Dock = DockStyle.Top;
            groupBoxFetchWebResource.Font = new Font("Arial", 9.75F, FontStyle.Bold);
            groupBoxFetchWebResource.ForeColor = SystemColors.ControlText;
            groupBoxFetchWebResource.Location = new Point(0, 0);
            groupBoxFetchWebResource.Name = "groupBoxFetchWebResource";
            groupBoxFetchWebResource.Padding = new Padding(3, 5, 3, 5);
            groupBoxFetchWebResource.Size = new Size(1600, 110);
            groupBoxFetchWebResource.TabIndex = 0;
            groupBoxFetchWebResource.TabStop = false;
            groupBoxFetchWebResource.Text = "Fetch Web Resource";
            // 
            // fetchWebResourceUC
            // 
            fetchWebResourceUC.BorderStyle = BorderStyle.Fixed3D;
            fetchWebResourceUC.Dock = DockStyle.Fill;
            fetchWebResourceUC.Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            fetchWebResourceUC.Location = new Point(3, 20);
            fetchWebResourceUC.Name = "fetchWebResourceUC";
            fetchWebResourceUC.Size = new Size(1594, 85);
            fetchWebResourceUC.TabIndex = 0;
            // 
            // groupBoxConvertNameToIdnf
            // 
            groupBoxConvertNameToIdnf.Controls.Add(nameToIdnfConverterUC);
            groupBoxConvertNameToIdnf.Dock = DockStyle.Top;
            groupBoxConvertNameToIdnf.Font = new Font("Arial", 9.75F, FontStyle.Bold);
            groupBoxConvertNameToIdnf.Location = new Point(0, 110);
            groupBoxConvertNameToIdnf.Name = "groupBoxConvertNameToIdnf";
            groupBoxConvertNameToIdnf.Padding = new Padding(3, 5, 3, 5);
            groupBoxConvertNameToIdnf.Size = new Size(1600, 80);
            groupBoxConvertNameToIdnf.TabIndex = 1;
            groupBoxConvertNameToIdnf.TabStop = false;
            groupBoxConvertNameToIdnf.Text = "Convert Name To Identifier";
            // 
            // nameToIdnfConverterUC
            // 
            nameToIdnfConverterUC.BorderStyle = BorderStyle.Fixed3D;
            nameToIdnfConverterUC.Dock = DockStyle.Fill;
            nameToIdnfConverterUC.Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            nameToIdnfConverterUC.Location = new Point(3, 20);
            nameToIdnfConverterUC.Name = "nameToIdnfConverterUC";
            nameToIdnfConverterUC.Size = new Size(1594, 55);
            nameToIdnfConverterUC.TabIndex = 0;
            // 
            // groupBoxTextToMd
            // 
            groupBoxTextToMd.Controls.Add(textToMdUC);
            groupBoxTextToMd.Dock = DockStyle.Fill;
            groupBoxTextToMd.Font = new Font("Arial", 9.75F, FontStyle.Bold);
            groupBoxTextToMd.Location = new Point(0, 190);
            groupBoxTextToMd.Name = "groupBoxTextToMd";
            groupBoxTextToMd.Padding = new Padding(3, 5, 3, 5);
            groupBoxTextToMd.Size = new Size(1600, 610);
            groupBoxTextToMd.TabIndex = 0;
            groupBoxTextToMd.TabStop = false;
            groupBoxTextToMd.Text = "Text To Md";
            // 
            // textToMdUC
            // 
            textToMdUC.BorderStyle = BorderStyle.Fixed3D;
            textToMdUC.Dock = DockStyle.Fill;
            textToMdUC.Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            textToMdUC.Location = new Point(3, 20);
            textToMdUC.Name = "textToMdUC";
            textToMdUC.Size = new Size(1594, 585);
            textToMdUC.TabIndex = 0;
            textToMdUC.TabStop = false;
            // 
            // TextUtilsUC
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            Controls.Add(groupBoxTextToMd);
            Controls.Add(groupBoxConvertNameToIdnf);
            Controls.Add(groupBoxFetchWebResource);
            Name = "TextUtilsUC";
            Size = new Size(1600, 800);
            groupBoxFetchWebResource.ResumeLayout(false);
            groupBoxConvertNameToIdnf.ResumeLayout(false);
            groupBoxTextToMd.ResumeLayout(false);
            ResumeLayout(false);
        }

        #endregion
        private GroupBox groupBoxFetchWebResource;
        private FetchWebResourceUC fetchWebResourceUC;
        private GroupBox groupBoxConvertNameToIdnf;
        private NameToIdnfConverterUC nameToIdnfConverterUC;
        private GroupBox groupBoxTextToMd;
        private TextToMdUC textToMdUC;
    }
}
