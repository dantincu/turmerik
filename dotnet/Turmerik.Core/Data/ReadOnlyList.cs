using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Data
{
    public class ReadOnlyList<T> : IEnumerable<T>
    {
        private readonly List<T> list;

        public ReadOnlyList(List<T> list)
        {
            this.list = list ?? new List<T>();
        }

        public int Count => list.Count;

        public T this[int idx]
        {
            get => list[idx];
        }

        public IEnumerator<T> GetEnumerator() => list.GetEnumerator();
        IEnumerator IEnumerable.GetEnumerator() => list.GetEnumerator();
    }
}
