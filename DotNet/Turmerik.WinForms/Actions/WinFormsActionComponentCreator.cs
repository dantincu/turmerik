using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Logging;

namespace Turmerik.WinForms.Actions
{
    public interface IWinFormsActionComponentCreator
    {
        IWinFormsActionComponent Create(
            Type componentType);
        IWinFormsActionComponent Create(
            string componentName);
    }

    public class WinFormsActionComponentCreator : IWinFormsActionComponentCreator
    {
        private readonly IAppLoggerCreator appLoggerCreator;

        public WinFormsActionComponentCreator(
            IAppLoggerCreator appLoggerCreator)
        {
            this.appLoggerCreator = appLoggerCreator ?? throw new ArgumentNullException(nameof(appLoggerCreator));
        }

        public IWinFormsActionComponent Create(
            Type componentType) => new WinFormsActionComponent(
                appLoggerCreator.GetSharedAppLogger(
                    componentType));

        public IWinFormsActionComponent Create(
            string componentName) => new WinFormsActionComponent(
                appLoggerCreator.GetSharedAppLogger(
                    componentName));
    }
}
