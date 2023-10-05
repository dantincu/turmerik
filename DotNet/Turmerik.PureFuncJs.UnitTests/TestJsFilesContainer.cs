using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Helpers;

namespace Turmerik.PureFuncJs.UnitTests
{
    public class TestJsFilesContainer : TestJsFilesContainerBase
    {
        public TestJsFilesContainer(
            string workDirPath) : base(workDirPath)
        {
        }

        protected override void AddFilesToMapCore(
            Dictionary<string, TestJsFile> map)
        {
            // AddFileToMap(map, );
        }
    }
}
