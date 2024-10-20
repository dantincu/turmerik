using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Turmerik.LocalFilesExplorer.WebApi.Helpers;

namespace Turmerik.LocalFilesExplorer.WebApi.ControllerConventions
{
    public class TrmrkControllerConvention : IControllerModelConvention
    {
        public TrmrkControllerConvention()
        {
        }

        private static readonly Type[] allowAnonymousTypes = [
            typeof(Controllers.Anonymous.FilesController)];

        private static readonly Type[] requireAuthTypes = [
            typeof(Controllers.Authenticated.FilesController)];

        public void Apply(ControllerModel controller)
        {
            var typesCollctn = AppH.Instance.AllowAnonymousAuthentication switch
            {
                true => allowAnonymousTypes,
                false => requireAuthTypes
            };

            bool enableController = typesCollctn.Contains(controller.ControllerType);

            if (!enableController)
            {
                controller.ApiExplorer.IsVisible = enableController;
                controller.Actions.Clear();
            }
        }
    }
}