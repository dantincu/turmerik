using Microsoft.CodeAnalysis.CSharp;
using Microsoft.Extensions.DependencyInjection;
using Turmerik.Code.CSharp.Components.ClnblTypesCsCode;

namespace Turmerik.Code.CSharp.UnitTests
{
    public class MainUnitTest : UnitTestBase
    {
        private readonly IClnblTypesCsCodeGenerator clnblTypesCsCodeGenerator;

        public MainUnitTest()
        {
            clnblTypesCsCodeGenerator = SvcProv.GetRequiredService<IClnblTypesCsCodeGenerator>();
        }

        [Fact]
        public void MainTest()
        {
            var testCaseDataBaseDirPath = Path.Combine(
                Environment.CurrentDirectory, "../../..", "TestCases", "Data");

            var testCaseDirsArr = Directory.GetDirectories(testCaseDataBaseDirPath);

            foreach (var testCaseDir in testCaseDirsArr)
            {
                string inputFilePath = Path.Combine(testCaseDir, "Input.cs");
                string expectedOutputFilePath = Path.Combine(testCaseDir, "Output.expected.cs");
                string actualOutputFilePath = Path.Combine(testCaseDir, "Output.actual.cs");

                string inputCsCode = File.ReadAllText(
                    inputFilePath);

                var tree = CSharpSyntaxTree.ParseText(inputCsCode);

                var compilationUnit = clnblTypesCsCodeGenerator.Generate(new()
                {
                    CompilationUnit = tree.GetRoot()
                }).CompilationUnit;

                var actualOutputCsCode = compilationUnit.ToFullString();
                File.WriteAllText(actualOutputFilePath, actualOutputCsCode);

                var expectedOutputCsCode = File.ReadAllText(
                    expectedOutputFilePath);

                Assert.Equal(expectedOutputCsCode, actualOutputCsCode);
            }
        }
    }
}
