using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Utility;

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
        public void FirstTest()
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

        [Fact]
        public void SecondTest()
        {
            var now = new DateTime(2023, 11, 18, 20, 13, 30, 30, 30);
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

        [Fact]
        public void ThirdTest()
        {
            var now = new DateTime(2023, 11, 18, 20, 13, 30, 0, 30);
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
            TryRetrieve1In1Out<string, DateTime?> factory)
        {
            Assert.True(factory(timeStamp, out var actualValue));
            Assert.Equal(expectedValue, actualValue.Value);
        }

        private void PerformTest(
            string timeStamp,
            DateTime expectedValue,
            TryRetrieve1In2Out<string, DateTime?, TimeSpan?> factory)
        {
            Assert.True(factory(
                timeStamp,
                out var actualValue,
                out var timeZoneOffset));

            if (timeZoneOffset.HasValue)
            {
                var tmZoneOffset = timeZoneOffset.Value;
                var utcNow = DateTime.UtcNow;
                var now = DateTime.Now;
                var currentTz = now - utcNow;

                currentTz = new TimeSpan(
                    currentTz.Hours,
                    currentTz.Minutes,
                    currentTz.Seconds);

                Assert.Equal(
                    tmZoneOffset,
                    currentTz);
            }

            Assert.Equal(expectedValue, actualValue.Value);
        }

        private void PerformTest(
            string timeStamp,
            TimeSpan expectedValue,
            TryRetrieve1In1Out<string, TimeSpan?> factory)
        {
            Assert.True(factory(timeStamp, out var actualValue));
            Assert.Equal(expectedValue, actualValue.Value);
        }
    }
}
