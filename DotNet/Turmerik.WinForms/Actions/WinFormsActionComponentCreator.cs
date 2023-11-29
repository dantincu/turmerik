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

        event Action<WinFormsStatusLabelActionComponentOpts> DefaultStatusLabelOptsChanged;

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

        private WinFormsStatusLabelActionComponentOpts defaultStatusLabelOpts;
        private Action<WinFormsStatusLabelActionComponentOpts> defaultStatusLabelOptsChanged;
        
        public WinFormsActionComponentCreator(
            IAppLoggerCreator appLoggerCreator)
        {
            this.appLoggerCreator = appLoggerCreator ?? throw new ArgumentNullException(
                nameof(appLoggerCreator));
        }

        public WinFormsStatusLabelActionComponentOpts DefaultStatusLabelOpts
        {
            get => defaultStatusLabelOpts;

            set
            {
                defaultStatusLabelOpts = value;
                defaultStatusLabelOptsChanged?.Invoke(value);
            }
        }

        public event Action<WinFormsStatusLabelActionComponentOpts> DefaultStatusLabelOptsChanged
        {
            add => defaultStatusLabelOptsChanged += value;
            remove => defaultStatusLabelOptsChanged -= value;
        }

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
                () => DefaultStatusLabelOpts);

        public IWinFormsStatusLabelActionComponent StatusLabel(
            string componentName) => new WinFormsStatusLabelActionComponent(
                appLoggerCreator.GetSharedAppLogger(
                    componentName),
                () => DefaultStatusLabelOpts);
    }
}
