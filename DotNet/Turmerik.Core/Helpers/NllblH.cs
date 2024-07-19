using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Helpers
{
    public static class NllblH
    {
        public static TRetVal WithNllbl<TRetVal, T>(
            this T? nllblVal,
            Func<T, TRetVal> valueFactory,
            Func<TRetVal> defaultValueFactory) where T : struct
        {
            TRetVal retVal;

            if (nllblVal.HasValue)
            {
                retVal = valueFactory(nllblVal.Value);
            }
            else
            {
                retVal = defaultValueFactory();
            }

            return retVal;
        }

        public static T? ActWithNllbl<T>(
            this T? nllblVal,
            Action<T> callback,
            Action defaultCallback) where T : struct
        {
            if (nllblVal.HasValue)
            {
                callback(nllblVal.Value);
            }
            else
            {
                defaultCallback();
            }

            return nllblVal;
        }
    }
}
