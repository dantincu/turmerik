using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Reflection.Wrappers;
using Turmerik.Core.Helpers;
using System.Collections.ObjectModel;

namespace Turmerik.JavascriptClassFileGenerator.ConsoleApp
{
    internal class JavascriptClassGenerator
    {
        private const string IMPORT_LINE_TPL = "import {{{0}}} from '{1}'";
        private const string CLASS_DEF_LINE_TPL = "class {0} extends EntityBase {";

        private static readonly string PropIndent = new string(Enumerable.Range(0, 4).Select(
            idx => ' ').ToArray());

        public string GetJavascriptCode(ProgramArgs programArgs)
        {
            List<string> linesList = new List<string>()
            {

            };
        }

        private string GetPropertyCodeLine(PropertyWrapper wrapper)
        {
            string jsPropName = wrapper.Name.DecapitalizeFirstLetter();
            string line = $"{PropIndent}{jsPropName};";

            return line;
        }
    }
}
