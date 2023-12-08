using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Actions;
using Turmerik.Core.UIActions;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.Helpers;

namespace Turmerik.LocalFileNotes.WinFormsApp.ViewModels
{
    public interface IManageNoteBooksFormVM
    {
        IActionResult OnFormLoaded();
    }

    public class ManageNoteBooksFormVM : IManageNoteBooksFormVM
    {
        private readonly IServiceProvider svcProv;
        private readonly IWinFormsMsgBoxActionComponent actionComponent;

        public ManageNoteBooksFormVM()
        {
            svcProv = ServiceProviderContainer.Instance.Value.Data;
            actionComponent = svcProv.GetRequiredService<IWinFormsActionComponentCreator>().MsgBox(GetType());
        }

        public IActionResult OnFormLoaded() => actionComponent.Execute(
            WinFormsH.ActionOpts(nameof(OnFormLoaded), () =>
            {
                // throw new Exception("asdf");
                return new ActionResult();
            }));
    }
}
