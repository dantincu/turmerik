using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextParsing.Md;

namespace Turmerik.UnitTests
{
    public class UpdateMdTitleUnitTest : UnitTestBase
    {
        private IAppEnv appEnv;

        public UpdateMdTitleUnitTest()
        {
            appEnv = SvcProv.GetRequiredService<IAppEnv>();
        }

        [Fact]
        public void MainTest()
        {
            PerformTest("Main.md", "Some title", "Some awesome title", string.Join(
                Environment.NewLine,
                "  asdf  ", "  # {0}  ", "  qwer  "));
        }

        private void PerformTest(
            string fileName,
            string inputTitle,
            string newTitle,
            string textTemplate)
        {
            var filePath = appEnv.GetTypePath(
                AppEnvDir.Temp,
                GetType(),
                fileName);

            var dirPath = Path.GetDirectoryName(filePath);
            Directory.CreateDirectory(dirPath);

            File.WriteAllText(
                filePath,
                string.Format(
                    textTemplate,
                    inputTitle));

            MdH.UpdateMdTitleFromFile(
                filePath,
                (title, line, lineIdx, linesArr) => newTitle);

            string actualText = File.ReadAllText(filePath);

            string expectedText = string.Format(
                textTemplate,
                newTitle);
        }
    }
}
