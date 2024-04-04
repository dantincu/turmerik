using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Logging;
using Turmerik.Core.Helpers;

namespace Turmerik.WpfLibrary.Actions
{
    public interface IWpfActionComponentCreator
    {
        WpfStatusLabelActionComponentOpts DefaultStatusLabelOpts { get; set; }

        event Action<WpfStatusLabelActionComponentOpts> DefaultStatusLabelOptsChanged;

        IWpfMsgBoxActionComponent MsgBox(
            Type componentType);

        IWpfMsgBoxActionComponent MsgBox(
            string componentName);

        IWpfStatusLabelActionComponent StatusLabel(
            Type componentType);

        IWpfStatusLabelActionComponent StatusLabel(
            string componentName);
    }

    public class WpfActionComponentCreator : IWpfActionComponentCreator
    {
        private readonly IAppLoggerCreator appLoggerCreator;

        private WpfStatusLabelActionComponentOpts defaultStatusLabelOpts;
        private Action<WpfStatusLabelActionComponentOpts> defaultStatusLabelOptsChanged;

        public WpfActionComponentCreator(
            IAppLoggerCreator appLoggerCreator)
        {
            this.appLoggerCreator = appLoggerCreator ?? throw new ArgumentNullException(
                nameof(appLoggerCreator));
        }

        public WpfStatusLabelActionComponentOpts DefaultStatusLabelOpts
        {
            get => defaultStatusLabelOpts;

            set
            {
                defaultStatusLabelOpts = value;
                defaultStatusLabelOptsChanged?.Invoke(value);
            }
        }

        public event Action<WpfStatusLabelActionComponentOpts> DefaultStatusLabelOptsChanged
        {
            add => defaultStatusLabelOptsChanged += value;
            remove => defaultStatusLabelOptsChanged -= value;
        }

        public IWpfMsgBoxActionComponent MsgBox(
            Type componentType) => new WpfMsgBoxActionComponent(
                appLoggerCreator.GetSharedAppLogger(
                    componentType));

        public IWpfMsgBoxActionComponent MsgBox(
            string componentName) => new WpfMsgBoxActionComponent(
                appLoggerCreator.GetSharedAppLogger(
                    componentName));

        public IWpfStatusLabelActionComponent StatusLabel(
            Type componentType) => new WpfStatusLabelActionComponent(
                appLoggerCreator.GetSharedAppLogger(
                    componentType),
                () => DefaultStatusLabelOpts);

        public IWpfStatusLabelActionComponent StatusLabel(
            string componentName) => new WpfStatusLabelActionComponent(
                appLoggerCreator.GetSharedAppLogger(
                    componentName),
                () => DefaultStatusLabelOpts);
    }
}
