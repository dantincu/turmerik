using Microsoft.Extensions.DependencyInjection;
using ReactiveUI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.MkFsBackup.AvaloniaApp.ViewModels
{
    public class SectionsBrowserViewModel : ReactiveObject
    {
        private readonly IServiceProvider svcProv;
        private readonly AppGlobals appGlobalsWrapper;
        private IAppGlobalsData appGlobals;

        public SectionsBrowserViewModel()
        {
            svcProv = ServiceProviderContainer.Instance.Value.Data;

            appGlobalsWrapper = svcProv.GetRequiredService<AppGlobals>();
            appGlobalsWrapper.Registered += AppGlobalsWrapper_Registered;
        }

        private void AppGlobalsWrapper_Registered(IAppGlobalsData data)
        {
            appGlobals = data;
            appGlobalsWrapper.Registered -= AppGlobalsWrapper_Registered;
        }
    }
}
