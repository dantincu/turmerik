using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.EqualityComparer;
using Turmerik.Core.Utility;

namespace Turmerik.UnitTests
{
    public class ObjectMapperUnitTest : UnitTestBase
    {
        private readonly IObjectMapper objectMapper;
        private readonly IBasicEqualityComparerFactory basicEqualityComparerFactory;

        public ObjectMapperUnitTest()
        {
            objectMapper = SvcProv.GetRequiredService<IObjectMapper>();
            basicEqualityComparerFactory = SvcProv.GetRequiredService<IBasicEqualityComparerFactory>();
        }

        [Fact]
        public void MainTest()
        {
            PerformTest(
                new B
                {
                    Str = "asdf",
                    Int = 1,
                    BigInt = 1000
                },
                () => new(),
                [ () => new()
                {
                    Str = "qwer"
                },
                () => new()
                {
                    Int = 2,
                } ],
                new B
                {
                    Str = "qwer",
                    Int = 2,
                    BigInt = 1000,
                },
                (a, b) => a.Str == b.Str && a.Int == b.Int && a.BigInt == b.BigInt && a.Dec == b.Dec);

            PerformTestCore(
                new B
                {
                    Str = "asdf",
                    Int = 1,
                    BigInt = 1000
                },
                () => new()
                {
                    Dec = 12.5M
                },
                [ () => new()
                {
                    Str = "qwer"
                },
                () => new()
                {
                    Int = 2,
                } ],
                new B
                {
                    Str = "qwer",
                    Int = 2,
                    BigInt = 1000,
                    Dec = 12.5M
                },
                (a, b) => a.Str == b.Str && a.Int == b.Int && a.BigInt == b.BigInt && a.Dec == b.Dec);
        }

        private void PerformTestCore<T, TObj>(
            T src,
            Expression<Func<TObj>> constructorCallFunc,
            Expression<Func<TObj>>[] initializersArr,
            TObj expectedResult,
            Func<TObj, TObj, bool> comparer)
            where TObj : T
        {
            this.AssertEqual(
                () => objectMapper.CreateWith(
                    src, constructorCallFunc, initializersArr),
                expectedResult,
                basicEqualityComparerFactory.GetEqualityComparer(
                    comparer));
        }

        private void PerformTest<TObj>(
            TObj src,
            Expression<Func<TObj>> constructorCallFunc,
            Expression<Func<TObj>>[] initializersArr,
            TObj expectedResult,
            Func<TObj, TObj, bool> comparer)
        {
            this.AssertEqual(
                () => objectMapper.CreateFrom(
                    src, constructorCallFunc, initializersArr),
                expectedResult,
                basicEqualityComparerFactory.GetEqualityComparer(
                    comparer));
        }

        class A
        {
            public string Str { get; init; }
            public int Int { get; init; }
            public decimal Dec { get; init; }
        }

        class B : A
        {
            public long BigInt { get; init; }

            public int NoSet { get; }
        }
    }
}
