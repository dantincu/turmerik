using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Collections.ObjectModel;
using System.Reflection;
using Turmerik.Core.DriveExplorer;

namespace Turmerik.LocalFilesExplorerAnonymous.WebApi.ModelBinders
{
    public class AcceptMissingPropsModelBinder<TModel> : IModelBinder
    {
        public Task BindModelAsync(
            ModelBindingContext bindingContext) => ModelBindersH.BindModelAsync(
                bindingContext,
                DriveExplorerH.DriveItemCoreTypeProps.Value,
                () => Activator.CreateInstance<TModel>()!);
    }
}
