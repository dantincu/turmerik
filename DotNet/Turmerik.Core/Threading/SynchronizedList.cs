using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices.ComTypes;
using System.Text;
using System.Threading;

namespace Turmerik.Core.Threading
{
    public interface ISynchronizedList<TItem> : IList<TItem>
    {
        int ForEach(
            Action<TItem> callback,
            Action<int> countCallback = null);

        int ForEach(
            Action<TItem, int> callback,
            Action<int> countCallback = null);

        List<TItem> ToPlainList();

        List<TItem> WithPlainList(
            Action<List<TItem>> callback);

        TResult WithPlainList<TResult>(
            Func<List<TItem>, TResult> callback);

        void AddRange(
            IEnumerable<TItem> items);

        void InsertRange(
            int index,
            IEnumerable<TItem> items);

        void RemoveRange(
            int index,
            int count);
    }

    public class SynchronizedList<TItem> : ISynchronizedList<TItem>
    {
        private readonly SemaphoreSlim semaphore;
        private readonly List<TItem> list;
        
        public SynchronizedList()
        {
            semaphore = new SemaphoreSlim(1);
            list = new List<TItem>();
        }

        public SynchronizedList(
            List<TItem> list)
        {
            semaphore = new SemaphoreSlim(1);
            this.list = list ?? new List<TItem>();
        }

        public SynchronizedList(
            IEnumerable<TItem> items)
        {
            semaphore = new SemaphoreSlim(1);
            list = items?.ToList() ?? new List<TItem>();
        }

        public TItem this[int index]
        {
            get => ExecuteSynchronized(list => list[index]);
            set => ExecuteSynchronized(list => list[index] = value);
        }

        public int Count => ExecuteSynchronized(
            list => list.Count);

        public bool IsReadOnly => false;

        public int ForEach(
            Action<TItem> callback,
            Action<int> countCallback = null) => ExecuteSynchronized(
            list =>
            {
                int count = list.Count;
                countCallback?.Invoke(count);

                list.ForEach(callback);
                return count;
            });

        public int ForEach(
            Action<TItem, int> callback,
            Action<int> countCallback = null) => ExecuteSynchronized(
            list =>
            {
                int count = list.Count;
                countCallback?.Invoke(count);

                for (int i = 0; i < count; i++)
                {
                    callback(list[i], i);
                }

                return count;
            });

        public List<TItem> ToPlainList() => ExecuteSynchronized(
            list => list.ToList());

        public List<TItem> WithPlainList(
            Action<List<TItem>> callback) => ExecuteSynchronized(
                list =>
                {
                    callback(list);
                    return list;
                });

        public TResult WithPlainList<TResult>(
            Func<List<TItem>, TResult> callback) => ExecuteSynchronized(
                list => callback(list));

        public bool Contains(
            TItem item) => ExecuteSynchronized(
            list => list.Contains(item));

        public void CopyTo(
            TItem[] array,
            int arrayIndex) => ExecuteSynchronized(
                list => list.CopyTo(array, arrayIndex));

        public int IndexOf(
            TItem item) => ExecuteSynchronized(
            list => list.IndexOf(item));

        public virtual void Add(
            TItem item) => ExecuteSynchronized(
            list => list.Add(item));

        public virtual void Clear() => ExecuteSynchronized(
            list => list.Clear());

        public virtual void Insert(
            int index,
            TItem item) => ExecuteSynchronized(
            list => list.Insert(index, item));

        public virtual bool Remove(
            TItem item) => ExecuteSynchronized(
            list => list.Remove(item));

        public virtual void RemoveAt(
            int index) => ExecuteSynchronized(
            list => list.RemoveAt(index));

        public virtual void AddRange(
            IEnumerable<TItem> items) => ExecuteSynchronized(
            list => list.AddRange(items));

        public virtual void InsertRange(
            int index,
            IEnumerable<TItem> items) => ExecuteSynchronized(
                list => list.InsertRange(index, items));

        public virtual void RemoveRange(
            int index,
            int count) => ExecuteSynchronized(
            list => list.RemoveRange(index, count));

        public IEnumerator<TItem> GetEnumerator() => ExecuteSynchronized(
            list => list.GetEnumerator());

        IEnumerator IEnumerable.GetEnumerator() => ExecuteSynchronized(
            list => list.GetEnumerator());

        protected void ExecuteSynchronized(
            Action<List<TItem>> callback)
        {
            semaphore.Wait();

            try
            {
                callback(list);
            }
            finally
            {
                semaphore.Release();
            }
        }

        protected T ExecuteSynchronized<T>(
            Func<List<TItem>, T> callback)
        {
            T retVal;
            semaphore.Wait();

            try
            {
                retVal = callback(list);
            }
            finally
            {
                semaphore.Release();
            }

            return retVal;
        }
    }
}
