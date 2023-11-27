using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Utility;
using Turmerik.DriveExplorer.Notes;
using Turmerik.Md;

namespace Turmerik.Notes.UnitTests
{
    public class NoteMdParserUnitTest : UnitTestBase
    {
        private readonly INoteMdParser noteMdParser;

        public NoteMdParserUnitTest()
        {
            noteMdParser = SvcProv.GetRequiredService<INoteMdParser>();
        }

        [Fact]
        public void MainTest()
        {
            PerformTest(
                $"<div><input type=\"hidden\" name=\"trmrk_guid\" value=\"{Trmrk.TrmrkGuidStrNoDash}\" /></div>\n\n<div>\n\n#  asdf  \n\n</div>",
                "asdf");
        }

        private void PerformTest(
            string mdContent,
            string expectedTitle,
            bool mustBeSuccessfull = true,
            string? trmrkUuidInputName = null)
        {
            PerformTest(
                mdContent,
                new NoteItemCore
                {
                    TrmrkGuid = Trmrk.TrmrkGuid,
                    Title = expectedTitle,
                },
                mustBeSuccessfull,
                trmrkUuidInputName);
        }

        private void PerformTest(
            string mdContent,
            NoteItemCore? expectedItem,
            bool mustBeSuccessfull = true,
            string? trmrkUuidInputName = null)
        {
            var mdDoc = noteMdParser.TryParse(
                mdContent,
                out var actualItem,
                trmrkUuidInputName);

            Assert.Equal(
                mustBeSuccessfull,
                mdDoc != null);

            if (mustBeSuccessfull)
            {
                AssertAreEqual(
                    expectedItem,
                    actualItem);
            }
        }

        private void AssertAreEqual(
            NoteItemCore? expectedItem,
            NoteItemCore? actualItem)
        {
            Assert.Equal(
                expectedItem.TrmrkGuid,
                actualItem.TrmrkGuid);
            {
                Assert.Equal(
                    expectedItem.Title,
                    actualItem.Title);
            }
        }
    }
}
