using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Dependencies;
using Turmerik.PureFuncJs.JintCompnts;
using Turmerik.Testing;

namespace Turmerik.PureFuncJs.UnitTests
{
    public class UnitTestBase : UnitTestCoreBase
    {
        static UnitTestBase()
        {
            ServiceProviderContainer.Instance.Value.RegisterData(
                new ServiceCollection().AsOpts());
        }

        public UnitTestBase()
        {
            SvcProv = ServiceProviderContainer.Instance.Value.Data;
            JintF = SvcProv.GetRequiredService<IJintComponentFactory>();
            JsCodeTransformer = SvcProv.GetRequiredService<IJsCodeTransformer>();

            DfTestJsFiles = new TestJsFilesContainer(
                Environment.CurrentDirectory);
        }

        protected IServiceProvider SvcProv { get; }
        protected IJintComponentFactory JintF { get; }
        protected IJsCodeTransformer JsCodeTransformer { get; }
        protected TestJsFilesContainer DfTestJsFiles { get; }

        protected void PerformJsCodeTransformerTest<TTestJsFilesContainer>(
            JsCodeTransformerTestArgs<TTestJsFilesContainer> args)
            where TTestJsFilesContainer : TestJsFilesContainerBase
        {
            string jsCode = args.TestJsFiles.FilesMap[
                args.InputFilePropName].JsCode.Value;

            string expectedOutputCode = args.TestJsFiles.FilesMap[
                args.ExpectedOutputFilePropName].JsCode.Value;

            string actualOutputCode = JsCodeTransformer.GetJsCode(new JsCodeOpts(
                jsCode, args.GlobalThisObjName, args.ArgsArr));

            Assert.Equal(expectedOutputCode, actualOutputCode);
        }

        protected class JsCodeTransformerTestArgs
        {
            public string InputFilePropName { get; set; }
            public string ExpectedOutputFilePropName { get; set; }
            public string GlobalThisObjName { get; set; }
            public JsArg[] ArgsArr { get; set; }
        }

        protected class JsCodeTransformerTestArgs<TTestJsFilesContainer> : JsCodeTransformerTestArgs
            where TTestJsFilesContainer : TestJsFilesContainerBase
        {
            public TTestJsFilesContainer TestJsFiles { get; set; }
        }
    }
}
