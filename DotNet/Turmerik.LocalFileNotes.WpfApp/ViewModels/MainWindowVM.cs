using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.WpfLibrary.ViewModels;

namespace Turmerik.LocalFileNotes.WpfApp.ViewModels
{
    public class MainWindowVM : ViewModelBase
    {
        private string firstName;

        public string FirstName
        {
            get
            {
                return firstName;
            }
            set
            {
                firstName = value;
                OnPropertyChanged(nameof(FirstName));
            }
        }

        #region INotifyPropertyChanged Members

        #endregion
    }
}
