using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Utility;

namespace Turmerik.UnitTests
{
    public class TimeStampHelperParseUnitTest : UnitTestBase
    {
        private readonly ITimeStampHelper timeStampHelper;

        public TimeStampHelperParseUnitTest()
        {
            timeStampHelper = SvcProv.GetRequiredService<ITimeStampHelper>();
        }

        [Fact]
        public void MainTest()
        {
            var now = DateTime.Now;
            var date = now.Date;

            string dateTimeStampStr = timeStampHelper.TmStmp(
                now, true, TimeStamp.Ticks, true);

            string timeStampStr = timeStampHelper.TmStmp(
                now, false, TimeStamp.Ticks, true);

            PerformDateTimeParseTest(
                dateTimeStampStr, now);

            PerformDateParseTest(
                dateTimeStampStr, date);

            PerformTimeParseTest(
                timeStampStr, now.TimeOfDay);
        }

        private void PerformDateTimeParseTest(
            string timeStamp,
            DateTime expectedValue) => PerformTest(
                timeStamp,
                expectedValue,
                timeStampHelper.TryParseDateTime);

        private void PerformDateParseTest(
            string timeStamp,
            DateTime expectedValue) => PerformTest(
                timeStamp,
                expectedValue,
                timeStampHelper.TryParseDate);

        private void PerformTimeParseTest(
            string timeStamp,
            TimeSpan expectedValue) => PerformTest(
                timeStamp,
                expectedValue,
                timeStampHelper.TryParseTime);

        private void PerformTest(
            string timeStamp,
            DateTime expectedValue,
            TryRetrieve<string, DateTime?> factory)
        {
            Assert.True(factory(timeStamp, out var actualValue));
            Assert.Equal(expectedValue, actualValue.Value);
        }

        private void PerformTest(
            string timeStamp,
            TimeSpan expectedValue,
            TryRetrieve<string, TimeSpan?> factory)
        {
            Assert.True(factory(timeStamp, out var actualValue));
            Assert.Equal(expectedValue, actualValue.Value);
        }
    }
}
