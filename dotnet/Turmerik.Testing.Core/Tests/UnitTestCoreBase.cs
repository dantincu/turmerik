using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Turmerik.Testing.Core.Tests
{
    public class UnitTestCoreBase
    {
        public UnitTestCoreBase()
        {
        }

        protected T AssertEqual<T>(Func<T> valueFactory, T expectedValue, IEqualityComparer<T> comparer = null)
        {
            comparer = comparer ?? EqualityComparer<T>.Default;
            T actualValue = valueFactory();

            Assert.Equal(expectedValue, actualValue, comparer);
            return actualValue;
        }

        protected T AssertTrue<T>(Func<T> valueFactory, Func<T, bool> validator)
        {
            T actualValue = valueFactory();
            bool isValid = validator(actualValue);

            Assert.True(isValid);
            return actualValue;
        }

        protected void AssertEqualCore<T>(T expected, T actual)
           where T : class
        {
            if (expected != null)
            {
                Assert.NotNull(actual);
                Assert.Equal(expected, actual);
            }
            else
            {
                Assert.Null(actual);
            }
        }

        protected void AssertSequenceEqual<T>(
            IEnumerable<T> expectedSequence,
            IEnumerable<T> actualSequence,
            IEqualityComparer<T> comparer = null)
        {
            comparer = comparer ?? EqualityComparer<T>.Default;
            bool isValid = expectedSequence.SequenceEqual(actualSequence, comparer);

            Assert.True(isValid);
        }
    }
}
