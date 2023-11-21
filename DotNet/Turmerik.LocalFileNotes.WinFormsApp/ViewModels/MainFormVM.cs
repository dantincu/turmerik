using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Actions;
using Turmerik.LocalFileNotes.WinFormsApp.Dependencies;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Helpers;

namespace Turmerik.LocalFileNotes.WinFormsApp.ViewModels
{
    public interface IMainFormVM
    {
        IActionResult OnMainFormLoaded();
    }

    public class MainFormVM : IMainFormVM
    {
        private readonly IServiceProvider svcProv;
        private readonly IWinFormsStatusLabelActionComponent actionComponent;

        public MainFormVM()
        {
            svcProv = ServiceProviderContainer.Instance.Value.Data;
            actionComponent = svcProv.GetRequiredService<IWinFormsActionComponentCreator>().StatusLabel(GetType());
        }

        public IActionResult OnMainFormLoaded() => actionComponent.Execute(
            WinFormsH.ActionOpts(nameof(OnMainFormLoaded), () => new ActionResult(), // throw new Exception("asdf"), // 
                onAfterExecution: result => result.IsFail ? null : new WinFormsMessageTuple(null, "Welcome")));
    }
}
