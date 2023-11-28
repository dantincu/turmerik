using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Utility.WinFormsApp.Settings;

namespace Turmerik.Utility.WinFormsApp.ViewModels
{
    public interface IMdLinesIndentVM
    {
    }

    public class MdLinesIndentVM : ViewModelBase, IMdLinesIndentVM
    {
        public MdLinesIndentVM(
            IAppSettings appSettings) : base(appSettings)
        {
        }
    }
}
