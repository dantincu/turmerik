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
    public partial class ExceptionUserControl : UserControl
    {
        public ExceptionUserControl()
        {
            InitializeComponent();
        }

        public Exception Exception { get; private set; }

        public void SetException(Exception exception)
        {
            this.Exception = exception;
            textBoxExceptionType.Text = exception.GetType().FullName;

            textBoxExceptionMessage.Text = exception.Message;
            textBoxExceptionStacktrace.Text = exception.StackTrace;
        }

        public void ClearException()
        {
            this.Exception = null;
            textBoxExceptionType.Text = string.Empty;

            textBoxExceptionMessage.Text = string.Empty;
            textBoxExceptionStacktrace.Text = string.Empty;
        }
    }
}
