using Turmerik.Core.Utility;

namespace Turmerik.Logging.UnitTests
{
    public class MainUnitTest : UnitTestBase
    {
        [Fact]
        public void MainTest()
        {
            using (var logger = AppLoggerCreator.GetSharedAppLogger(GetType(), null, false))
            {
                using (var nestedLogger = AppLoggerCreator.GetSharedAppLogger(GetType(), null, true))
                {
                    for (int i = 0; i < 100; i++)
                    {
                        logger.Debug("Should not be written");
                        nestedLogger.Debug("Should not be written");

                        logger.InformationData(
                            Tuple.Create(DateTime.Now, Guid.NewGuid()),
                            "Should be written {0} {1}", DateTime.Now, Guid.NewGuid());

                        nestedLogger.InformationData(
                            Tuple.Create(DateTime.Now, Guid.NewGuid()),
                            new TrmrkException<Tuple<int, decimal>>("asdf", null, Tuple.Create(i, i * 1.1m)),
                            "Should be written {0} {1}", DateTime.Now, Guid.NewGuid());
                    }
                }
            }
        }
    }
}