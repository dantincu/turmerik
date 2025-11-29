namespace Turmerik.Utility.WinFormsApp.UserControls
{
    partial class FetchLinkUrlItemUC
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
            splitContainerMain = new SplitContainer();
            panelScriptsContainer = new Panel();
            tableLayoutPanelScripts = new TableLayoutPanel();
            panelWebView = new Panel();
            panelWebViewTopControls = new Panel();
            textBoxWebViewAddress = new TextBox();
            ((System.ComponentModel.ISupportInitialize)splitContainerMain).BeginInit();
            splitContainerMain.Panel1.SuspendLayout();
            splitContainerMain.Panel2.SuspendLayout();
            splitContainerMain.SuspendLayout();
            panelScriptsContainer.SuspendLayout();
            panelWebViewTopControls.SuspendLayout();
            SuspendLayout();
            // 
            // splitContainerMain
            // 
            splitContainerMain.Dock = DockStyle.Fill;
            splitContainerMain.Location = new Point(0, 0);
            splitContainerMain.Name = "splitContainerMain";
            // 
            // splitContainerMain.Panel1
            // 
            splitContainerMain.Panel1.Controls.Add(panelScriptsContainer);
            // 
            // splitContainerMain.Panel2
            // 
            splitContainerMain.Panel2.Padding = new Padding(5, 0, 0, 0);
            splitContainerMain.Panel2.Controls.Add(panelWebView);
            splitContainerMain.Panel2.Controls.Add(panelWebViewTopControls);
            splitContainerMain.Size = new Size(1000, 800);
            splitContainerMain.SplitterDistance = 498;
            splitContainerMain.TabIndex = 2;
            splitContainerMain.SplitterMoving += SplitContainerMain_SplitterMoving;
            splitContainerMain.SplitterMoved += SplitContainerMain_SplitterMoved;
            // 
            // panelScriptsContainer
            // 
            panelScriptsContainer.AutoScroll = true;
            panelScriptsContainer.Controls.Add(tableLayoutPanelScripts);
            panelScriptsContainer.Dock = DockStyle.Fill;
            panelScriptsContainer.Location = new Point(0, 0);
            panelScriptsContainer.Name = "panelScriptsContainer";
            panelScriptsContainer.Size = new Size(498, 800);
            panelScriptsContainer.TabIndex = 1;
            // 
            // tableLayoutPanelScripts
            // 
            tableLayoutPanelScripts.AutoSize = true;
            tableLayoutPanelScripts.AutoSizeMode = AutoSizeMode.GrowAndShrink;
            tableLayoutPanelScripts.ColumnCount = 1;
            tableLayoutPanelScripts.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100F));
            tableLayoutPanelScripts.Dock = DockStyle.Top;
            tableLayoutPanelScripts.Location = new Point(0, 0);
            tableLayoutPanelScripts.Name = "tableLayoutPanelScripts";
            tableLayoutPanelScripts.RowCount = 1;
            tableLayoutPanelScripts.RowStyles.Add(new RowStyle());
            tableLayoutPanelScripts.Size = new Size(498, 0);
            tableLayoutPanelScripts.TabIndex = 0;
            // 
            // panelWebView
            // 
            panelWebView.Dock = DockStyle.Fill;
            panelWebView.Location = new Point(0, 23);
            panelWebView.Name = "panelWebView";
            panelWebView.Size = new Size(498, 777);
            panelWebView.TabIndex = 1;
            // 
            // panelWebViewTopControls
            // 
            panelWebViewTopControls.Controls.Add(textBoxWebViewAddress);
            panelWebViewTopControls.Dock = DockStyle.Top;
            panelWebViewTopControls.Location = new Point(0, 0);
            panelWebViewTopControls.Name = "panelWebViewTopControls";
            panelWebViewTopControls.Size = new Size(498, 23);
            panelWebViewTopControls.TabIndex = 0;
            // 
            // textBoxWebViewAddress
            // 
            textBoxWebViewAddress.Dock = DockStyle.Fill;
            textBoxWebViewAddress.Location = new Point(0, 0);
            textBoxWebViewAddress.Name = "textBoxWebViewAddress";
            textBoxWebViewAddress.ReadOnly = true;
            textBoxWebViewAddress.Size = new Size(498, 23);
            textBoxWebViewAddress.TabIndex = 0;
            // 
            // FetchLinkUrlItemUC
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            Controls.Add(splitContainerMain);
            Name = "FetchLinkUrlItemUC";
            Size = new Size(1000, 800);
            Load += FetchLinkUrlItemUC_Load;
            splitContainerMain.Panel1.ResumeLayout(false);
            splitContainerMain.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)splitContainerMain).EndInit();
            splitContainerMain.ResumeLayout(false);
            panelScriptsContainer.ResumeLayout(false);
            panelScriptsContainer.PerformLayout();
            panelWebViewTopControls.ResumeLayout(false);
            panelWebViewTopControls.PerformLayout();
            ResumeLayout(false);
        }

        #endregion

        private SplitContainer splitContainerMain;
        private Panel panelWebViewTopControls;
        private TextBox textBoxWebViewAddress;
        private Panel panelWebView;
        private TableLayoutPanel tableLayoutPanelScripts;
        private Panel panelScriptsContainer;
    }
}
