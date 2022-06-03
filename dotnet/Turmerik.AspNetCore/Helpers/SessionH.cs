using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;

namespace Turmerik.AspNetCore.Helpers
{
    public static class SessionH
    {
        public static bool TryGetValue<TValue>(
            this ISession session,
            string key,
            out TValue value,
            Func<TValue> defaultValueFactory = null,
            bool? rethrowError = true)
        {
            string json = null;
            bool retVal = false;

            defaultValueFactory = defaultValueFactory.FirstNotNull(
                () => default(TValue));

            if (session.Keys.Contains(key))
            {
                json = session.GetString(key);
            }

            if (json != null)
            {
                try
                {
                    value = JsonSrlzH.FromJson<TValue>(json);
                    retVal = true;
                }
                catch (Exception exc)
                {
                    if (rethrowError.HasValue)
                    {
                        if (rethrowError.Value)
                        {
                            throw;
                        }
                        else
                        {
                            session.Remove(key);
                        }
                    }

                    value = defaultValueFactory();
                }
            }
            else
            {
                value = defaultValueFactory();
            }

            return retVal;
        }
    }
}
