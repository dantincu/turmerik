using Jint;
using Jint.Native.Object;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;
using Turmerik.Text;

namespace Turmerik.PureFuncJs.JintCompnts
{
    public interface IJintComponentFactory
    {
        IJintComponent Create(JintComponentOpts opts);

        IJintComponent<TCfg> Create<TCfg>(
            JintComponentOpts<TCfg> opts);
    }

    public class JintComponentFactory : IJintComponentFactory
    {
        private readonly IJintConsoleFactory consoleFactory;
        private readonly IJsonConversion jsonConversion;
        private readonly IJsCodeTransformer jsCodeTransformer;

        public JintComponentFactory(
            IJintConsoleFactory consoleFactory,
            IJsonConversion jsonConversion)
        {
            this.consoleFactory = consoleFactory ?? throw new ArgumentNullException(
                nameof(consoleFactory));

            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.jsCodeTransformer = jsCodeTransformer ?? throw new ArgumentNullException(
                nameof(jsCodeTransformer));
        }

        public IJintComponent Create(
            JintComponentOpts opts)
        {
            NormalizeOpts(opts);

            var component = new JintComponent(
                jsonConversion,
                jsCodeTransformer,
                opts);

            return component;
        }

        public IJintComponent<TCfg> Create<TCfg>(
            JintComponentOpts<TCfg> opts)
        {
            NormalizeOpts(opts);

            var component = new JintComponent<TCfg>(
                jsonConversion,
                jsCodeTransformer,
                opts);

            return component;
        }

        private void NormalizeOpts(
            JintComponentOpts opts)
        {
            opts.JintConsole ??= opts.IncludeDefaultConsoleObj ? consoleFactory.Create() : null;
            opts.JsCode.GlobalThisObjName ??= JsCodeH.GLOBAL_THIS_VAR_NAME;
        }
    }
}
