using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;
using System.Threading;
using Turmerik.Core.Helpers;
using Turmerik.Core.Threading;

namespace Turmerik.Core.Reactive
{
    public class ReactiveList<TRxObj, TData> : SynchronizedList<TRxObj>
        where TRxObj : ReactiveObject<TData>
    {
        private readonly List<TRxObj> items;

        private Action<TData> action;

        public ReactiveList()
        {
        }

        public ReactiveList(List<TRxObj> list) : base(list)
        {
        }

        public ReactiveList(IEnumerable<TRxObj> items) : base(items)
        {
        }

        public event Action<TData> Action
        {
            add
            {
                action += value;
                ExecuteSynchronized(list => list.ForEach(item => item.Action += value));
            }

            remove
            {
                action -= value;
                ExecuteSynchronized(list => list.ForEach(item => item.Action -= value));
            }
        }

        public override void Add(TRxObj item) => ExecuteSynchronized(
            list =>
            {
                list.Add(item);
                item.Action += action;
            });

        public override void AddRange(IEnumerable<TRxObj> items) => ExecuteSynchronized(
            list =>
            {
                list.AddRange(items);

                foreach (var item in items)
                {
                    item.Action += action;
                }
            });

        public override void Clear() => ExecuteSynchronized(
            list =>
            {
                foreach (var item in list)
                {
                    item.Action -= action;
                }

                list.Clear();
            });

        public override void Insert(int index, TRxObj item) => ExecuteSynchronized(
            list =>
            {
                list.Insert(index, item);

                foreach (var item in items)
                {
                    item.Action += action;
                }
            });

        public override void InsertRange(int index, IEnumerable<TRxObj> items) => ExecuteSynchronized(
            list =>
            {
                list.InsertRange(index, items);

                foreach (var item in items)
                {
                    item.Action += action;
                }
            });

        public override bool Remove(TRxObj item) => ExecuteSynchronized(
            list =>
            {
                bool retVal = list.Remove(item);
                item.Action -= action;

                return retVal;
            });

        public override void RemoveAt(int index) => ExecuteSynchronized(
            list =>
            {
                var item = list[index];
                list.RemoveAt(index);

                item.Action -= action;
            });

        public override void RemoveRange(int index, int count) => ExecuteSynchronized(
            list =>
            {
                if (index < 0 || index + count > list.Count)
                {
                    throw new ArgumentOutOfRangeException("index");
                }

                int maxIdx = index + count - 1;

                for (int i = index; i <= maxIdx; i++)
                {
                    list[i].Action -= action;
                }

                list.RemoveRange(index, count);
            });
    }
}
