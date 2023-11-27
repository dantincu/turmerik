using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;
using Turmerik.Core.TextSerialization;

namespace Turmerik.Yantra.Components
{
    public interface IYantraComponentFactory
    {
        IYantraComponent Create(YantraComponentOpts opts);

        IYantraComponent<TCfg> Create<TCfg>(
            YantraComponentOpts<TCfg> opts);
    }

    public class YantraComponentFactory : IYantraComponentFactory
    {
        private readonly IJsConsoleFactory consoleFactory;
        private readonly IJsonConversion jsonConversion;
        private readonly IJsCodeTransformer jsCodeTransformer;

        public YantraComponentFactory(
            IJsConsoleFactory consoleFactory,
            IJsonConversion jsonConversion)
        {
            this.consoleFactory = consoleFactory ?? throw new ArgumentNullException(
                nameof(consoleFactory));

            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            jsCodeTransformer = jsCodeTransformer ?? throw new ArgumentNullException(
                nameof(jsCodeTransformer));
        }

        public IYantraComponent Create(
            YantraComponentOpts opts)
        {
            NormalizeOpts(opts);

            var component = new YantraComponent(
                jsonConversion,
                jsCodeTransformer,
                opts);

            return component;
        }

        public IYantraComponent<TCfg> Create<TCfg>(
            YantraComponentOpts<TCfg> opts)
        {
            NormalizeOpts(opts);

            var component = new JintComponent<TCfg>(
                jsonConversion,
                jsCodeTransformer,
                opts);

            return component;
        }

        private void NormalizeOpts(
            YantraComponentOpts opts)
        {
            opts.JsConsole ??= opts.IncludeDefaultConsoleObj ? consoleFactory.Create() : null;
            opts.UserJsCode.GlobalThisObjName ??= JsCodeH.GLOBAL_THIS_VAR_NAME;
        }
    }
}
