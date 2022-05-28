using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Turmerik.Core.Data;
using Turmerik.Core.Helpers;

namespace Turmerik.FsUtils.WinForms.App
{
    public partial class UIMessageItemUserControl : UserControl
    {
        public UIMessageItemUserControl()
        {
            InitializeComponent();
        }

        public IUILogMessage UIMessage { get; private set; }

        private DataTreeNode<Tuple<Exception, TreeNode>> ExceptionHierarchy { get; set; }
        private List<DataTreeNode<Tuple<Exception, TreeNode>>> ExceptionsFlatList { get; set; }

        public void SetUIMessage(IUILogMessage uIMessage)
        {
            this.UIMessage = uIMessage;

            labelMessageLevel.Text = uIMessage.Level.ToString().ToUpper();
            labelMessageTimeStamp.Text = uIMessage.TimeStampStr;

            textBoxMessageContent.Text = uIMessage.Message;

            if (uIMessage.Exception != null)
            {
                ExceptionsFlatList = new List<DataTreeNode<Tuple<Exception, TreeNode>>>();
                var rootNode = GetExceptionTreeViewNode(uIMessage.Exception);

                treeViewExceptionHierarchy.Nodes.Add(rootNode.Data.Item2);
                ShowException(rootNode);
            }
            else
            {
                ClearException();
            }
        }

        public void ClearUIMessage()
        {
            this.UIMessage = null;

            labelMessageLevel.Text = string.Empty;
            labelMessageTimeStamp.Text = string.Empty;

            textBoxMessageContent.Text = string.Empty;
            ClearException();
        }

        private DataTreeNode<Tuple<Exception, TreeNode>> GetExceptionTreeViewNode(Exception exc)
        {
            TreeNode treeNode = new TreeNode(exc.GetType().Name);
            var childNodes = new List<DataTreeNode<Tuple<Exception, TreeNode>>>();

            if (exc.InnerException != null)
            {
                var childNode = GetExceptionTreeViewNode(exc.InnerException);
                childNodes.Add(childNode);

                ExceptionsFlatList.Add(childNode);
                treeNode.Nodes.Add(childNode.Data.Item2);
            }

            var aggExc = exc as AggregateException;

            if (aggExc?.InnerExceptions != null)
            {
                foreach (var innerExc in aggExc.InnerExceptions)
                {
                    var childNode = GetExceptionTreeViewNode(innerExc);
                    childNodes.Add(childNode);

                    ExceptionsFlatList.Add(childNode);
                    treeNode.Nodes.Add(childNode.Data.Item2);
                }
            }

            var rootNode = new DataTreeNode<Tuple<Exception, TreeNode>>(
                new Tuple<Exception, TreeNode>(
                    exc, treeNode));

            return rootNode;
        }

        private void treeViewExceptionHierarchy_Click(object sender, EventArgs e)
        {
            var selectedNode = treeViewExceptionHierarchy.SelectedNode;

            var kvp = ExceptionsFlatList.FindVal(
                node => node.Data.Item2 == selectedNode);

            if (kvp.Key >= 0)
            {
                ShowException(kvp.Value);
            }
            else
            {
                ClearException();
            }
        }

        private void ShowException(DataTreeNode<Tuple<Exception, TreeNode>> dataNode)
        {
            var exc = dataNode.Data.Item1;

            textBoxExceptionMessage.Text = exc.Message;
            textBoxExceptionType.Text = exc.GetType().FullName;
            textBoxExceptionStackTrace.Text = exc.StackTrace;
        }

        private void ClearException()
        {
            textBoxExceptionMessage.Text = string.Empty;
            textBoxExceptionType.Text = string.Empty;
            textBoxExceptionStackTrace.Text = string.Empty;
        }
    }
}
