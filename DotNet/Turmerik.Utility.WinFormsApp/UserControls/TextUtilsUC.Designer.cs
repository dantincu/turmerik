﻿namespace Turmerik.Utility.WinFormsApp.UserControls
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
            groupBoxTransformText = new GroupBox();
            transformTextuc1 = new TransformTextUC();
            groupBoxFetchWebResource.SuspendLayout();
            groupBoxConvertNameToIdnf.SuspendLayout();
            groupBoxTransformText.SuspendLayout();
            SuspendLayout();
            // 
            // groupBoxFetchWebResource
            // 
            groupBoxFetchWebResource.Controls.Add(fetchWebResourceUC);
            groupBoxFetchWebResource.Dock = DockStyle.Top;
            groupBoxFetchWebResource.ForeColor = SystemColors.ControlText;
            groupBoxFetchWebResource.Location = new Point(0, 0);
            groupBoxFetchWebResource.Name = "groupBoxFetchWebResource";
            groupBoxFetchWebResource.Size = new Size(1600, 100);
            groupBoxFetchWebResource.TabIndex = 0;
            groupBoxFetchWebResource.TabStop = false;
            groupBoxFetchWebResource.Text = "Fetch Web Resource";
            // 
            // fetchWebResourceUC
            // 
            fetchWebResourceUC.BorderStyle = BorderStyle.Fixed3D;
            fetchWebResourceUC.Dock = DockStyle.Fill;
            fetchWebResourceUC.Location = new Point(3, 19);
            fetchWebResourceUC.Name = "fetchWebResourceUC";
            fetchWebResourceUC.Size = new Size(1594, 78);
            fetchWebResourceUC.TabIndex = 0;
            // 
            // groupBoxConvertNameToIdnf
            // 
            groupBoxConvertNameToIdnf.Controls.Add(nameToIdnfConverterUC);
            groupBoxConvertNameToIdnf.Dock = DockStyle.Top;
            groupBoxConvertNameToIdnf.Location = new Point(0, 100);
            groupBoxConvertNameToIdnf.Name = "groupBoxConvertNameToIdnf";
            groupBoxConvertNameToIdnf.Size = new Size(1600, 72);
            groupBoxConvertNameToIdnf.TabIndex = 1;
            groupBoxConvertNameToIdnf.TabStop = false;
            groupBoxConvertNameToIdnf.Text = "Convert Name To Identifier";
            // 
            // nameToIdnfConverterUC
            // 
            nameToIdnfConverterUC.BorderStyle = BorderStyle.Fixed3D;
            nameToIdnfConverterUC.Dock = DockStyle.Fill;
            nameToIdnfConverterUC.Location = new Point(3, 19);
            nameToIdnfConverterUC.Name = "nameToIdnfConverterUC";
            nameToIdnfConverterUC.Size = new Size(1594, 50);
            nameToIdnfConverterUC.TabIndex = 0;
            // 
            // groupBoxTransformText
            // 
            groupBoxTransformText.Controls.Add(transformTextuc1);
            groupBoxTransformText.Dock = DockStyle.Fill;
            groupBoxTransformText.Location = new Point(0, 172);
            groupBoxTransformText.Name = "groupBoxTransformText";
            groupBoxTransformText.Size = new Size(1600, 628);
            groupBoxTransformText.TabIndex = 2;
            groupBoxTransformText.TabStop = false;
            groupBoxTransformText.Text = "Transform Text";
            // 
            // transformTextuc1
            // 
            transformTextuc1.BorderStyle = BorderStyle.Fixed3D;
            transformTextuc1.Dock = DockStyle.Fill;
            transformTextuc1.Location = new Point(3, 19);
            transformTextuc1.Name = "transformTextuc1";
            transformTextuc1.Size = new Size(1594, 606);
            transformTextuc1.TabIndex = 0;
            // 
            // TextUtilsUC
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            Controls.Add(groupBoxTransformText);
            Controls.Add(groupBoxConvertNameToIdnf);
            Controls.Add(groupBoxFetchWebResource);
            Name = "TextUtilsUC";
            Size = new Size(1600, 800);
            groupBoxFetchWebResource.ResumeLayout(false);
            groupBoxConvertNameToIdnf.ResumeLayout(false);
            groupBoxTransformText.ResumeLayout(false);
            ResumeLayout(false);
        }

        #endregion
        private GroupBox groupBoxFetchWebResource;
        private FetchWebResourceUC fetchWebResourceUC;
        private GroupBox groupBoxConvertNameToIdnf;
        private NameToIdnfConverterUC nameToIdnfConverterUC;
        private GroupBox groupBoxTransformText;
        private TransformTextUC transformTextuc1;
    }
}
