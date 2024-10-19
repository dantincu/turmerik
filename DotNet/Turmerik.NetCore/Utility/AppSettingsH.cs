using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.NetCore.Utility
{
    public static class AppSettings
    {
        public static T GetCfgValue<T>(this IConfiguration config, string[] sectionNames)
        {
            var section = config.GetSection(sectionNames[0]);

            for (int i = 1; i < sectionNames.Length; i++)
            {
                section = section.GetSection(sectionNames[i]);
            }

            var retVal = section.Get<T>();
            return retVal;
        }
    }
}
