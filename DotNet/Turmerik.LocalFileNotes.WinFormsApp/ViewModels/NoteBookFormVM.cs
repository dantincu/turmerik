using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Actions;
using Turmerik.WinForms.Actions;
using Turmerik.WinForms.Dependencies;
using Turmerik.WinForms.Helpers;

namespace Turmerik.LocalFileNotes.WinFormsApp.ViewModels
{
    public interface INoteBookFormVM
    {
        IActionResult OnFormLoaded();
    }

    public class NoteBookFormVM : INoteBookFormVM
    {
        private readonly IServiceProvider svcProv;
        private readonly IWinFormsStatusLabelActionComponent actionComponent;

        public NoteBookFormVM()
        {
            svcProv = ServiceProviderContainer.Instance.Value.Data;
            actionComponent = svcProv.GetRequiredService<IWinFormsActionComponentCreator>().StatusLabel(GetType());
        }

        public IActionResult OnFormLoaded() => actionComponent.Execute(
            WinFormsH.ActionOpts(nameof(OnFormLoaded), () =>
                {
                    // throw new Exception("asdf");
                    return new ActionResult();
                },
                onUnhandledError: ex =>
                {
                    return new WinFormsMessageTuple(null, null, "Error");
                    // return new WinFormsMessageTuple(null, null, null);
                },
                onAfterExecution: result => result.IsSuccess.If(
                    () => new WinFormsMessageTuple(null, "Welcome"))));
    }
}
