using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Cloneables;
using Turmerik.Core.Helpers;

#region DummyRegion
#region DummyRegion1
#endregion DummyRegion1
#endregion DummyRegion

#region DummyRegion

class X
{
}

#endregion DummyRegion

namespace Turmerik.Code.CSharp.UnitTests.TestCases.Data.Basic
{
    public static class DummyClass
    {
        [ClnblIntf(typeof(Immtbl), typeof(Mtbl))]
        public interface IClnbl
        {
            //asdf
            /* asdfasdf */
            string Name { get; }
            int Value { get; }

            IClnbl GetNested();

            IEnumerable<int> GetList();
            IEnumerable<IClnbl> GetClnblList();
            IReadOnlyDictionary<int, int> GetDictionary();
            IEnumerable<KeyValuePair<int, IClnbl>> GetClnblDictionary();
        }

        public class Immtbl : IClnbl
        {
            public Immtbl(IClnbl src)
            {
                // var x = nameof(src.Value);

                Name = src.Name;
                Nested = src.GetNested()?.With(s => new Immtbl(s));
                Value = src.Value;
                List = src.GetList()?.ToList();
                ClnblList = src.GetClnblList()?.Select(s => new Immtbl(s)).ToList();
                Dictionary = src.GetDictionary()?.ToDictionary().RdnlD();
                ClnblDictionary = src.GetClnblDictionary()?.ToClnblRdnlDctnr(v => new Immtbl(v));
            }

            public string Name { get; private set; }
            public Immtbl Nested { get; init; }
            public int Value { get; protected init; }
            public List<int> List { get; protected set; }
            public List<Immtbl> ClnblList { get; }
            public ReadOnlyDictionary<int, int> Dictionary { get; set; }
            public ClnblRdnlDictionary<int, IClnbl, Immtbl> ClnblDictionary { get; }

            public IEnumerable<int> GetList() => List;
            public IClnbl GetNested() => Nested;
            public IEnumerable<IClnbl> GetClnblList() => ClnblList;
            public IReadOnlyDictionary<int, int> GetDictionary() => Dictionary;
            public IEnumerable<KeyValuePair<int, IClnbl>> GetClnblDictionary() => ClnblDictionary;
        }

        public class Mtbl : IClnbl
        {
            public Mtbl(IClnbl src)
            {
                Name = src.Name;
                Nested = src.GetNested()?.With(s => new Mtbl(s));
                Value = src.Value;
                List = src.GetList()?.ToList();
                ClnblList = src.GetClnblList()?.Select(s => new Mtbl(s)).ToList();
                Dictionary = src.GetDictionary()?.ToDictionary();
                ClnblDictionary = src.GetClnblDictionary()?.ToClnblEdtblDctnr(v => new Mtbl(v));
            }

            public Mtbl()
            {
            }

            public string Name { get; set; }
            public Mtbl Nested { get; set; }
            public int Value { get; init; }
            public List<int> List { get; set; }
            public List<Mtbl> ClnblList { get; set; }
            public Dictionary<int, int> Dictionary { get; set; }
            public ClnblEdtblDictionary<int, IClnbl, Mtbl> ClnblDictionary { get; set; }

            public IEnumerable<int> GetList() => List;
            public IClnbl GetNested() => Nested;
            public IEnumerable<IClnbl> GetClnblList() => ClnblList;
            public IReadOnlyDictionary<int, int> GetDictionary() => Dictionary;
            public IEnumerable<KeyValuePair<int, IClnbl>> GetClnblDictionary() => ClnblDictionary;
        }
    }
}

#region DummyRegion99
#endregion DummyRegion99