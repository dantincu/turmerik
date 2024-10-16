using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Reflection;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;

namespace Turmerik.LocalFilesExplorer.WebApi.ModelBinders
{
    public class ModelBindersH
    {
        public static Task BindModelAsync(
            ModelBindingContext bindingContext,
            IEnumerable<PropertyInfo> propInfosNmrbl,
            Func<object> modelFactory)
        {
            if (bindingContext == null)
                throw new ArgumentNullException(nameof(bindingContext));

            var model = modelFactory.Invoke();

            // Attempt to bind each property manually
            foreach (var property in DriveExplorerH.DriveItemCoreTypeProps.Value)
            {
                var valueProviderResult = bindingContext.ValueProvider.GetValue(property.Name);
                if (valueProviderResult != ValueProviderResult.None)
                {
                    var value = valueProviderResult.FirstValue;
                    if (!string.IsNullOrEmpty(value))
                    {
                        property.SetValue(model, Convert.ChangeType(value, property.PropertyType));
                    }
                }
            }

            bindingContext.Result = ModelBindingResult.Success(model);
            return Task.CompletedTask;
        }
    }
}
