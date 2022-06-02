using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Components;
using Turmerik.Core.Infrastucture;
using Turmerik.Core.Helpers;

namespace Turmerik.JavascriptClassFileGenerator.ConsoleApp
{
    public class ProgramArgsParser : ProgramArgsParserBase<ProgramArgs>
    {
        private const string BASE_TYPE_NAME = "EntityBase";
        private const string BASE_TYPE_FILE_PATH = "./entityBase.js";
        private const string COPY_PROPS_METHOD_NAME = "__copyProps";
        private const string CONSTRUCTOR_ARGS = "src, throwOnUnknownProp = false";
        private const string COPY_PROPS_METHOD_CALL_PARAMS = "src, throwOnUnknownProp";

        public ProgramArgsParser(
            ITypesStaticDataCache typesStaticDataCache) : base(
                typesStaticDataCache)
        {
        }

        protected override void AddPropParsers(
            ProgramArgs programArgs,
            List<Tuple<string, Action<ProgramArgs, string>>> propParsersList)
        {
            AddStrPropParser(propParsersList,
                nameof(programArgs.FullTypeName));

            AddStrPropParser(propParsersList,
                nameof(programArgs.BaseTypeName),
                BASE_TYPE_NAME);

            AddStrPropParser(propParsersList,
                nameof(programArgs.BaseTypeRelFilePath),
                BASE_TYPE_FILE_PATH);

            AddStrPropParser(propParsersList,
                nameof(programArgs.CopyPropsMethodName),
                COPY_PROPS_METHOD_NAME);

            AddStrPropParser(propParsersList,
                nameof(programArgs.ConstructorArgs),
                CONSTRUCTOR_ARGS);

            AddStrPropParser(propParsersList,
                nameof(programArgs.BaseConstructorParams));

            AddStrPropParser(propParsersList,
                nameof(programArgs.CopyPropsMethodCallParams),
                COPY_PROPS_METHOD_CALL_PARAMS);

            AddStrPropParser(propParsersList,
                nameof(programArgs.CopyPropsMethodCallParams),
                COPY_PROPS_METHOD_CALL_PARAMS);

            AddPropParser(propParsersList,
                nameof(programArgs.OutputFilePath),
                (args, value) =>
                {
                    if (!string.IsNullOrWhiteSpace(value))
                    {
                        args.OutputFilePath = value;
                    }
                    else
                    {
                        string typeName = args.FullTypeName.Split(
                            '.').Last().DecapitalizeFirstLetter();

                        args.OutputFilePath = $"{typeName}.js";
                    }
                });
        }
    }
}
