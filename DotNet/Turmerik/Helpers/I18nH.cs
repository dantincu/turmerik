using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Helpers
{
    public static class I18nH
    {
        public static CultureInfo ToCultureInfo(string cultureCode)
        {
            CultureInfo cultureInfo;

            if (!string.IsNullOrWhiteSpace(cultureCode))
            {
                cultureInfo = new CultureInfo(cultureCode);
            }
            else
            {
                cultureInfo = CultureInfo.InvariantCulture;
            }

            return cultureInfo;
        }
    }
}
