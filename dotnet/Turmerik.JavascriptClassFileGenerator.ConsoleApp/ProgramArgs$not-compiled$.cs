using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.JavascriptClassFileGenerator.ConsoleApp
{
    public class ProgramArgs
    {
        public string FullTypeName { get; set; }
        public string BaseTypeName { get; set; }
        public string BaseTypeRelFilePath { get; set; }
        public string CopyPropsMethodName { get; set; }
        public string ConstructorArgs { get; set; }
        public string BaseConstructorParams { get; set; }
        public string CopyPropsMethodCallParams { get; set; }
        public string OutputFilePath { get; set; }
    }
}
