using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Microsoft.AspNetCore.Mvc;

namespace Turmerik.LocalFilesExplorer.WebApi.ModelBinders
{
    public class NullValidator : IObjectModelValidator
    {
        public void Validate(
            ActionContext actionContext,
            ValidationStateDictionary validationState,
            string prefix,
            object model)
        {
            // Intentionally left blank to bypass default validation
        }
    }

}
