using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Utility.WinFormsApp.UserControls
{
    public interface IAppUserControl
    {
        void HandleKeyDown(KeyEventArgs e);
    }

    public interface IMainFormTabPageContentControl : IAppUserControl
    {
    }
}
