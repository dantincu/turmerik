using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.PureFuncJs.UnitTests
{
    public class TestData
    {
        public int IntProp1 { get; set; }
        public int? NllblIntProp1 { get; set; }
        public string StrProp1 { get; set; }
        public bool BoolProp1 { get; set; }
        public bool? NllblBoolProp1 { get; set; }
        public decimal DecimalProp1 { get; set; }
        public decimal? NllblDecimalProp1 { get; set; }
        public double DoubleProp1 { get; set; }
        public double? NllblDoubleProp1 { get; set; }
        public DateTime DateTimeProp1 { get; set; }
        public DateTime? NllblDateTimeProp1 { get; set; }

        public TestData Child1 { get; set; }
        public TestData Child2 { get; set; }
    }
}
