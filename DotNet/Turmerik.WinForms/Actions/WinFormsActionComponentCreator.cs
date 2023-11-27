using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Logging;
using Turmerik.Core.Helpers;

namespace Turmerik.WinForms.Actions
{
    public interface IWinFormsActionComponentCreator
    {
        WinFormsStatusLabelActionComponentOpts DefaultStatusLabelOpts { get; set; }

        IWinFormsMsgBoxActionComponent MsgBox(
            Type componentType);

        IWinFormsMsgBoxActionComponent MsgBox(
            string componentName);

        IWinFormsStatusLabelActionComponent StatusLabel(
            Type componentType);

        IWinFormsStatusLabelActionComponent StatusLabel(
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

        public WinFormsStatusLabelActionComponentOpts DefaultStatusLabelOpts { get; set; }

        public IWinFormsMsgBoxActionComponent MsgBox(
            Type componentType) => new WinFormsMsgBoxActionComponent(
                appLoggerCreator.GetSharedAppLogger(
                    componentType));

        public IWinFormsMsgBoxActionComponent MsgBox(
            string componentName) => new WinFormsMsgBoxActionComponent(
                appLoggerCreator.GetSharedAppLogger(
                    componentName));

        public IWinFormsStatusLabelActionComponent StatusLabel(
            Type componentType) => new WinFormsStatusLabelActionComponent(
                appLoggerCreator.GetSharedAppLogger(
                    componentType),
                LazyH.Lazy(() => DefaultStatusLabelOpts));

        public IWinFormsStatusLabelActionComponent StatusLabel(
            string componentName) => new WinFormsStatusLabelActionComponent(
                appLoggerCreator.GetSharedAppLogger(
                    componentName),
                LazyH.Lazy(() => DefaultStatusLabelOpts));
    }
}
