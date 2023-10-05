using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Helpers;

namespace Turmerik.PureFuncJs.UnitTests
{
    public abstract class TestJsFilesContainerBase
    {
        public TestJsFilesContainerBase(
            string workDirPath)
        {
            WorkDirPath = workDirPath ?? throw new ArgumentNullException(
                workDirPath);

            FilesMap = GetFilesMap();
        }

        public string WorkDirPath { get; }

        public ReadOnlyDictionary<string, TestJsFile> FilesMap { get; }

        protected abstract void AddFilesToMapCore(
            Dictionary<string, TestJsFile> map);

        protected void AddFileToMap(
            Dictionary<string, TestJsFile> map,
            string propName,
            string fileName = null)
        {
            fileName ??= $"{propName}.js";

            string filePath = Path.Combine(
                WorkDirPath, fileName);

            var testJsFile = new TestJsFile(fileName,
                LazyH.Lazy(() => File.ReadAllText(filePath)));

            map.Add(propName, testJsFile);
        }

        private ReadOnlyDictionary<string, TestJsFile> GetFilesMap() => new Dictionary<string, TestJsFile>
        {

        }.ActWith(map =>
        {
            AddFilesToMapCore(map);
        }).RdnlD();
    }
}
