using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Utility
{
    public interface ITrmrkObj
    {
        Guid? TrmrkGuid { get; }
    }

    public class TrmrkObj : ITrmrkObj
    {
        public Guid? TrmrkGuid { get; set; }
    }
}
