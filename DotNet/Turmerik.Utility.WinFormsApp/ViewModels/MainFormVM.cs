using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Utility.WinFormsApp.Settings;

namespace Turmerik.Utility.WinFormsApp.ViewModels
{
    public interface IMainFormVM
    {
    }

    public class MainFormVM : ViewModelBase, IMainFormVM
    {
        public MainFormVM(
            IAppSettings appSettings) : base(appSettings)
        {
        }
    }
}
