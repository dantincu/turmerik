using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Turmerik.FsUtils.WinForms.App
{
    public partial class ExceptionHierarchyUserControl : UserControl
    {
        public ExceptionHierarchyUserControl()
        {
            InitializeComponent();
        }

        public Exception Exception { get; private set; }

        public void SetException(Exception exception)
        {
            this.Exception = exception;
            exceptionUserControl.SetException(exception);

            var exceptionRootTreeNode = GetExceptionTreeNode(exception);
            exceptionHierarchyTreeView.Nodes.Clear();

            exceptionHierarchyTreeView.Nodes.Add(exceptionRootTreeNode);
        }

        public void ClearException()
        {
            this.Exception = null;
            exceptionUserControl.ClearException();

            exceptionHierarchyTreeView.Nodes.Clear();
        }

        private TreeNode GetExceptionTreeNode(Exception exception)
        {
            var treeNode = new TreeNode(exception.GetType().FullName);

            if (exception.InnerException != null)
            {
                var childTreeNode = GetExceptionTreeNode(exception.InnerException);
                treeNode.Nodes.Add(childTreeNode);
            }

            var aggException = exception as AggregateException;

            if (aggException != null)
            {
                var childTreeNodesArr = aggException.InnerExceptions.Select(
                    GetExceptionTreeNode).ToArray();

                treeNode.Nodes.AddRange(childTreeNodesArr);
            }

            return treeNode;
        }
    }
}
