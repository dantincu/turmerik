using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Helpers
{
    public static class AttrH
    {
        public static string GetAttrName(string attrTypeName) => attrTypeName.GetTypeDisplayName(
            (ref string baseTypeName, ref string restOfName) =>
            {
                string baseAttrTypeName = nameof(Attribute);

                if (baseTypeName.EndsWith(baseAttrTypeName))
                {
                    baseTypeName = baseTypeName.Substring(0, baseTypeName.Length - baseAttrTypeName.Length);
                }

                restOfName = "";
            });
    }
}
