using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Utility.WinFormsApp.Services.FetchMultipleLinks;

namespace Turmerik.Utility.WinFormsApp.UserControls
{
    public interface IFetchLinkItemUC
    {
        void SetItem(FetchLinkDataItemCoreMtbl item);
        void HandleKeyDown(KeyEventArgs e);
        void UnsetItem();
    }
}
