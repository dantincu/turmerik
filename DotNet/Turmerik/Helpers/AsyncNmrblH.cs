using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Helpers
{
    public static class AsyncNmrblH
    {
        public static async Task<List<T>> ToListAsync<T>(
            this IAsyncEnumerable<T> asyncNmrbl)
            {
                var itemsList = new List<T>();

                await foreach (var item in asyncNmrbl)
                {
                    itemsList.Add(item);
                }

                return itemsList;
            }
    }
}
