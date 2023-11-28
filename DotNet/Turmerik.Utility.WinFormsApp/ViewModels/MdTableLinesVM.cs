using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Utility.WinFormsApp.Settings;

namespace Turmerik.Utility.WinFormsApp.ViewModels
{
    public interface IMdTableLinesVM
    {
    }

    public class MdTableLinesVM : ViewModelBase, IMdTableLinesVM
    {
        public MdTableLinesVM(
            IAppSettings appSettings) : base(appSettings)
        {
        }
    }
}
