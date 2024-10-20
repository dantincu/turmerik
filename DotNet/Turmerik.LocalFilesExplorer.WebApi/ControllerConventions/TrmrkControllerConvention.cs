using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Turmerik.Core.Helpers;
using Turmerik.LocalFilesExplorer.WebApi.Helpers;

namespace Turmerik.LocalFilesExplorer.WebApi.ControllerConventions
{
    public class TrmrkControllerConvention : IControllerModelConvention
    {
        public TrmrkControllerConvention()
        {
        }

        private static readonly Type[] allowAlwaysTypes = [];

        private static readonly Type[] allowAnonymousTypes = [
            typeof(Controllers.Anonymous.FilesController)];

        private static readonly Type[] allowAuthTypes = [
            typeof(Controllers.Authenticated.FilesController)];

        public void Apply(ControllerModel controller)
        {
            bool enableController = allowAlwaysTypes.Arr(
                AppH.Instance.AllowAnonymousAuthentication switch
                {
                    true => allowAnonymousTypes,
                    false => allowAuthTypes
                }).Any(typesCollctn => typesCollctn.Contains(controller.ControllerType));

            if (!enableController)
            {
                controller.ApiExplorer.IsVisible = enableController;
                controller.Actions.Clear();
            }
        }
    }
}