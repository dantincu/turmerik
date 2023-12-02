using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Reactive
{
    public static class RxH
    {
        public static ReactiveList<TRxObj, TData> RxC<TRxObj, TData>(
            this List<TRxObj> items)
            where TRxObj : ReactiveObject<TData> => new ReactiveList<TRxObj, TData>(items);
    }
}
