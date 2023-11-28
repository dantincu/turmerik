using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Utility.WinFormsApp.Settings;

namespace Turmerik.Utility.WinFormsApp.ViewModels
{
    public interface ITextUtilsVM
    {
    }

    public class TextUtilsVM : ViewModelBase, ITextUtilsVM
    {
        public TextUtilsVM(
            IAppSettings appSettings) : base(appSettings)
        {
        }
    }
}
