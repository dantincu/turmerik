using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.PureFuncJs.UnitTests
{
    public class TestJsFile
    {
        public TestJsFile(string fileName, Lazy<string> jsCode)
        {
            FileName = fileName ?? throw new ArgumentNullException(nameof(fileName));
            JsCode = jsCode ?? throw new ArgumentNullException(nameof(jsCode));
        }

        public string FileName { get; set; }
        public Lazy<string> JsCode { get; set; }
    }
}
