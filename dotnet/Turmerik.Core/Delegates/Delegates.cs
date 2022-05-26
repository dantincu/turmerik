using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Delegates
{
    public delegate void RefAction<T>(ref T t);
    public delegate void RefAction<T1, T2>(ref T1 t1, ref T2 t2);

    public delegate T1 RefFunc<T1, T2>(ref T2 t2);
}
