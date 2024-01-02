using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;
using Turmerik.DirsPair.ConsoleApps.UpdFsDirPairsIdxes;

namespace Turmerik.Notes.UnitTests
{
    public class IdxesUpdaterTestUnit : UnitTestBase
    {
        private readonly IdxesUpdater idxesUpdater;

        private readonly int[] ascIdxes = [
            3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51,
            54, 57, 60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90, 93, 96, 99 ];

        private readonly int[] descIdxes = [
            997, 994, 991, 988, 985, 982, 979, 976, 973, 970, 967, 964, 961, 958, 955, 952, 949,
            946, 943, 940, 937, 934, 931, 928, 925, 922, 919, 916, 913, 910, 907, 904, 901 ];

        public IdxesUpdaterTestUnit()
        {
            idxesUpdater = SvcProv.GetRequiredService<IdxesUpdater>();
        }

        [Fact]
        public void PerformDefaultTests()
        {
            PerformMultipleSrcIdxesTestsCore([3, 6, 7, 11, 14, 17, 21 ],
                new Dictionary<int, int>
                {
                    { 3, 6 },
                    { 6, 3 }
                }.Arr(new Dictionary<int, int>
                {
                    { 6, 17 },
                    { 17, 6 }
                },
                new Dictionary<int, int>
                {
                    { 17, 21 },
                    { 21, 17 }
                },
                new Dictionary<int, int>
                {
                    { 3, 7 },
                    { 7, 3 }
                },
                new Dictionary<int, int>
                {
                    { 7, 14 },
                    { 14, 7 }
                },
                new Dictionary<int, int>
                {
                    { 14, 21 },
                    { 21, 14 }
                },
                new Dictionary<int, int>
                {
                    { 3, 21 },
                    { 21, 3 }
                },
                new Dictionary<int, int>
                {
                    { 6, 17 },
                    { 17, 6 }
                }));

            PerformMultipleTestsCore(true, [ 3, 6, 9, 12, 15, 18, 21, 24, 27, 30 ], Tuple.Create(new IdxesUpdateMapping
            {
                SrcIdxes = NewIdxesFilter(null, null).Lst(),
                TrgIdxes = NewIdxesFilter(null, null).Lst()
            }.Arr(), new Dictionary<int, int>
            {
                { 3, 1 }, { 6, 2 }, { 9, 3 }, { 12, 4 }, { 15, 5 }, { 18, 6 }, { 21, 7 }, { 24, 8 }, { 27, 9 }, { 30, 10 }
            }).Arr(
                Tuple.Create(new IdxesUpdateMapping
                {
                    SrcIdxes = NewIdxesFilter(9, null).Lst(),
                    TrgIdxes = NewIdxesFilter(null, 40).Lst()
                }.Arr(), new Dictionary<int, int>
                {
                    { 9, 33 }, { 12, 34 }, { 15, 35 }, { 18, 36 }, { 21, 37 }, { 24, 38 }, { 27, 39 }, { 30, 40 }
                }),
                Tuple.Create(new IdxesUpdateMapping
                {
                    SrcIdxes = NewIdxesFilter(null, 21).Lst(),
                    TrgIdxes = NewIdxesFilter(40, null).Lst()
                }.Arr(), new Dictionary<int, int>
                {
                    { 3, 40 }, { 6, 41 }, { 9, 42 }, { 12, 43 }, { 15, 44 }, { 18, 45 }, { 21, 46 }
                }),
                Tuple.Create(new IdxesUpdateMapping
                {
                    SrcIdxes = NewIdxesFilter(6, 12).Lst(),
                    TrgIdxes = NewIdxesFilter(8, null).Lst()
                }.Arr(new IdxesUpdateMapping
                {
                    SrcIdxes = NewIdxesFilter(18, 24).Lst(),
                    TrgIdxes = NewIdxesFilter(null, 22).Lst()
                }), new Dictionary<int, int>
                {
                    { 6, 8 }, { 9, 9 }, { 12, 10 }, { 18, 20 }, { 21, 21 }, { 24, 22 }
                }),
                Tuple.Create(new IdxesUpdateMapping
                {
                    SrcIdxes = NewIdxesFilter(3, 12).Lst(),
                    TrgIdxes = NewIdxesFilter(null, 10).Lst()
                }.Arr(new IdxesUpdateMapping
                {
                    SrcIdxes = NewIdxesFilter(18, 24).Lst(),
                    TrgIdxes = NewIdxesFilter(null, null).Lst()
                }), new Dictionary<int, int>
                {
                    { 3, 7 }, { 6, 8 }, { 9, 9 }, { 12, 10 }, { 18, 1 }, { 21, 2 }, { 24, 3 }
                })));

            PerformMultipleTestsCore(false, [ 997, 994, 991, 988, 985, 982, 979, 976, 973, 970 ], Tuple.Create(new IdxesUpdateMapping
            {
                SrcIdxes = NewIdxesFilter(991, null).Lst(),
                TrgIdxes = NewIdxesFilter(null, 900).Lst()
            }.Arr(), new Dictionary<int, int>
            {
                { 991, 907 }, { 988, 906 }, { 985, 905 }, { 982, 904 }, { 979, 903 }, { 976, 902 }, { 973, 901 }, { 970, 900 }
            }).Arr(
                Tuple.Create(new IdxesUpdateMapping
                {
                    SrcIdxes = NewIdxesFilter(null, 979).Lst(),
                    TrgIdxes = NewIdxesFilter(900, null).Lst()
                }.Arr(), new Dictionary<int, int>
                {
                    { 997, 900 }, { 994, 899 }, { 991, 898 }, { 988, 897 }, { 985, 896 }, { 982, 895 }, { 979, 894 }
                }),
                Tuple.Create(new IdxesUpdateMapping
                {
                    SrcIdxes = NewIdxesFilter(994, 988).Lst(),
                    TrgIdxes = NewIdxesFilter(992, null).Lst()
                }.Arr(
                    new IdxesUpdateMapping
                    {
                        SrcIdxes = NewIdxesFilter(979, 973).Lst(),
                        TrgIdxes = NewIdxesFilter(null, 975).Lst()
                    }), new Dictionary<int, int>
                {
                    { 994, 992 }, { 991, 991 }, { 988, 990 }, { 979, 977 }, { 976, 976 }, { 973, 975 }
                }),
                Tuple.Create(new IdxesUpdateMapping
                {
                    SrcIdxes = NewIdxesFilter(997, 988).Lst(),
                    TrgIdxes = NewIdxesFilter(null, 990).Lst()
                }.Arr(
                    new IdxesUpdateMapping
                    {
                        SrcIdxes = NewIdxesFilter(979, 973).Lst(),
                        TrgIdxes = NewIdxesFilter(null, null).Lst()
                    }), new Dictionary<int, int>
                {
                    { 997, 993 }, { 994, 992 }, { 991, 991 }, { 988, 990 }, { 979, 999 }, { 976, 998 }, { 973, 997 }
                })));
        }

        [Fact]
        public void PerformFirstAscTests()
        {
            PerformMultipleTestsCore(true, ascIdxes, Tuple.Create(new IdxesUpdateMapping
            {
                SrcIdxes = NewIdxesFilter(3, 6).Lst(),
                TrgIdxes = NewIdxesFilter(4, 5).Lst(),
            }.Arr(), new Dictionary<int, int>
            {
                { 3, 4 }, { 6, 5 }
            }).Arr(
                Tuple.Create(new IdxesUpdateMapping
                    {
                        SrcIdxes = NewIdxesFilter(3, 9).Lst(),
                        TrgIdxes = NewIdxesFilter(4, 6).Lst(),
                    }.Arr(), new Dictionary<int, int>
                    {
                        { 3, 4 }, { 6, 5 }, { 9, 6 }
                    }),
                Tuple.Create(new IdxesUpdateMapping
                    {
                        SrcIdxes = NewIdxesFilter(3, 9).Lst(),
                        TrgIdxes = NewIdxesFilter(4, null).Lst(),
                    }.Arr(), new Dictionary<int, int>
                    {
                        { 3, 4 }, { 6, 5 }, { 9, 6 }
                    }),
                Tuple.Create(new IdxesUpdateMapping
                {
                    SrcIdxes = NewIdxesFilter(3, 9).Lst(),
                    TrgIdxes = NewIdxesFilter(null, 6).Lst(),
                }.Arr(), new Dictionary<int, int>
                    {
                        { 3, 4 }, { 6, 5 }, { 9, 6 }
                    })));
        }

        [Fact]
        public void PerformFirstDescTests()
        {
            PerformMultipleTestsCore(false, descIdxes, Tuple.Create(new IdxesUpdateMapping
            {
                SrcIdxes = NewIdxesFilter(997, 994).Lst(),
                TrgIdxes = NewIdxesFilter(996, 995).Lst(),
            }.Arr(), new Dictionary<int, int>
            {
                { 997, 996 }, { 994, 995 }
            }).Arr(
                Tuple.Create(new IdxesUpdateMapping
                {
                    SrcIdxes = NewIdxesFilter(997, 991).Lst(),
                    TrgIdxes = NewIdxesFilter(996, 994).Lst(),
                }.Arr(), new Dictionary<int, int>
                    {
                        { 997, 996 }, { 994, 995 }, { 991, 994 }
                    }),
                Tuple.Create(new IdxesUpdateMapping
                {
                    SrcIdxes = NewIdxesFilter(997, 991).Lst(),
                    TrgIdxes = NewIdxesFilter(996, null).Lst(),
                }.Arr(), new Dictionary<int, int>
                    {
                        { 997, 996 }, { 994, 995 }, { 991, 994 }
                    }),
                Tuple.Create(new IdxesUpdateMapping
                {
                    SrcIdxes = NewIdxesFilter(997, 991).Lst(),
                    TrgIdxes = NewIdxesFilter(null, 994).Lst(),
                }.Arr(), new Dictionary<int, int>
                    {
                        { 997, 996 }, { 994, 995 }, { 991, 994 }
                    })));
        }

        [Fact]
        public void PerformSecondAscTests()
        {
            PerformMultipleTestsCore(true, ascIdxes, Tuple.Create(new IdxesUpdateMapping
            {
                SrcIdxes = NewIdxesFilter(6, 9).Lst(),
                TrgIdxes = NewIdxesFilter(7, 8).Lst(),
            }.Arr(), new Dictionary<int, int>
            {
                { 6, 7 }, { 9, 8 }
            }).Arr(
                Tuple.Create(new IdxesUpdateMapping
                {
                    SrcIdxes = NewIdxesFilter(6, 12).Lst(),
                    TrgIdxes = NewIdxesFilter(7, 9).Lst(),
                }.Arr(), new Dictionary<int, int>
                    {
                        { 6, 7 }, { 9, 8 }, { 12, 9 }
                    }),
                Tuple.Create(new IdxesUpdateMapping
                {
                    SrcIdxes = NewIdxesFilter(6, 12).Lst(),
                    TrgIdxes = NewIdxesFilter(7, null).Lst(),
                }.Arr(), new Dictionary<int, int>
                    {
                        { 6, 7 }, { 9, 8 }, { 12, 9 }
                    }),
                Tuple.Create(new IdxesUpdateMapping
                {
                    SrcIdxes = NewIdxesFilter(6, 12).Lst(),
                    TrgIdxes = NewIdxesFilter(null, 9).Lst(),
                }.Arr(), new Dictionary<int, int>
                    {
                        { 6, 7 }, { 9, 8 }, { 12, 9 }
                    })));
        }

        [Fact]
        public void PerformSecondDescTests()
        {
            PerformMultipleTestsCore(false, descIdxes, Tuple.Create(new IdxesUpdateMapping
            {
                SrcIdxes = NewIdxesFilter(994, 991).Lst(),
                TrgIdxes = NewIdxesFilter(993, 992).Lst(),
            }.Arr(), new Dictionary<int, int>
            {
                { 994, 993 }, { 991, 992 }
            }).Arr(
                Tuple.Create(new IdxesUpdateMapping
                {
                    SrcIdxes = NewIdxesFilter(994, 988).Lst(),
                    TrgIdxes = NewIdxesFilter(993, 991).Lst(),
                }.Arr(), new Dictionary<int, int>
                    {
                        { 994, 993 }, { 991, 992 }, { 988, 991 }
                    }),
                Tuple.Create(new IdxesUpdateMapping
                {
                    SrcIdxes = NewIdxesFilter(994, 988).Lst(),
                    TrgIdxes = NewIdxesFilter(993, null).Lst(),
                }.Arr(), new Dictionary<int, int>
                    {
                        { 994, 993 }, { 991, 992 }, { 988, 991 }
                    }),
                Tuple.Create(new IdxesUpdateMapping
                {
                    SrcIdxes = NewIdxesFilter(994, 988).Lst(),
                    TrgIdxes = NewIdxesFilter(null, 991).Lst(),
                }.Arr(), new Dictionary<int, int>
                    {
                        { 994, 993 }, { 991, 992 }, { 988, 991 }
                    })));
        }

        private void PerformMultipleSrcIdxesTestsCore(
            int[] prevIdxes, Dictionary<int, int>[] testDataArr)
        {
            PerformMultipleTestsCore(prevIdxes, testDataArr.Select(
                testData => Tuple.Create(
                    new IdxesUpdateMapping
                    {
                        SrcIdxes = testData.Select(
                            kvp => SingleIdxesFilter(kvp.Key)).ToList(),
                        TrgIdxes = testData.Select(
                            kvp => SingleIdxesFilter(kvp.Value)).ToList()
                    }.Arr(), testData)).ToArray());
        }

        private void PerformMultipleTestsCore(
            int[] prevIdxes,
            Tuple<IdxesUpdateMapping[], Dictionary<int, int>>[] tuplesArr)
        {
            foreach (var tuple in tuplesArr)
            {
                PerformTest(prevIdxes, tuple.Item1, tuple.Item2);
            }
        }

        private void PerformMultipleTestsCore(
            bool incIdx,
            int[] prevIdxes,
            Tuple<IdxesUpdateMapping[], Dictionary<int, int>>[] tuplesArr)
        {
            foreach (var tuple in tuplesArr)
            {
                PerformTest(incIdx, prevIdxes, tuple.Item1, tuple.Item2);
            }
        }

        private void PerformTest(
            int[] prevIdxes,
            IdxesUpdateMapping[] idxesUpdateMappings,
            Dictionary<int, int> expectedOutput)
        {
            PerformTest(false, prevIdxes, idxesUpdateMappings, expectedOutput);
            PerformTest(true, prevIdxes, idxesUpdateMappings, expectedOutput);
        }

        private void PerformTest(
            bool incIdx,
            int[] prevIdxes,
            IdxesUpdateMapping[] idxesUpdateMappings,
            Dictionary<int, int> expectedOutput)
        {
            var actualOutput = idxesUpdater.UpdateIdxes(new IdxesUpdaterOpts
            {
                MinIdx = 1,
                MaxIdx = 999,
                IncIdx = incIdx,
                PrevIdxes = prevIdxes,
                IdxesUpdateMappings = idxesUpdateMappings
            });

            this.AssertSequenceEqual(
                expectedOutput, actualOutput);
        }

        private IdxesFilter SingleIdxesFilter(
            int singleIdx) => new IdxesFilter
            {
                SingleIdx = singleIdx
            };

        private IdxesFilter NewIdxesFilter(
            int? stIdx, int? endIdx) => new IdxesFilter
            {
                StartIdx = stIdx,
                EndIdx = endIdx
            };
    }
}
