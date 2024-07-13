using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.EqualityComparer;
using Turmerik.Core.Reflection;
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
            Func<B, B, bool> comparer = (a, b) => a.Str == b.Str && a.Int == b.Int && a.BigInt == b.BigInt && a.Dec == b.Dec;

            PerformTestFrom(
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
                comparer);

            PerformTestWith(
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
                comparer);

            PerformTest(
                () => new B(),
                (props, lmHp) => new()
                {
                    { lmHp.Prop(o => o.Str), "qwer" },
                    { lmHp.Prop(o => o.Int), 2 },
                    { lmHp.Prop(o => o.BigInt), 1000L }
                },
                (propValuesMap, lmHp) =>
                {
                    propValuesMap.Add(lmHp.Prop(o => o.Dec), 12.5M);
                },
                new B
                {
                    Str = "qwer",
                    Int = 2,
                    BigInt = 1000,
                    Dec = 12.5M
                },
                comparer);
        }

        private void PerformTestWith<T, TObj>(
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

        private void PerformTestFrom<TObj>(
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

        private void PerformTest<TObj>(
            Expression<Func<TObj>> constructorCallFunc,
            Func<ReadOnlyCollection<PropertyInfo>, ILambdaExprHelper<TObj>, Dictionary<PropertyInfo, object>>? propValuesMapFactory,
            Action<Dictionary<PropertyInfo, object>, ILambdaExprHelper<TObj>>? propValuesMapBuilder,
            TObj expectedResult,
            Func<TObj, TObj, bool> comparer)
        {
            this.AssertEqual(
                () => objectMapper.Create(
                    constructorCallFunc,
                    propValuesMapFactory,
                    propValuesMapBuilder),
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
