using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;
using Turmerik.NetCore.Reflection.AssemblyLoading;

namespace Turmerik.NetCore.ConsoleApps.DotNetTypesToTypescript
{
    public partial class ProgramComponent
    {
        private int CompareMethods(
            MethodItem m1,
            MethodItem m2)
        {
            int result = m1.Name.CompareTo(m2.Name);

            if (result == 0)
            {
                result = CompareTypes(
                    m1.ReturnType.Value,
                    m2.ReturnType.Value);
            }

            if (result == 0)
            {
                result = CompareMethodParams(
                    m1.Params, m2.Params);
            }

            return result;
        }

        private int CompareProps(
            PropertyItem p1,
            PropertyItem p2)
        {
            int result = p1.Name.CompareTo(p2.Name);

            if (result == 0)
            {
                result = CompareTypes(
                    p1.PropertyType.Value,
                    p2.PropertyType.Value);
            }

            return result;
        }

        private int CompareMethodParams(
            IEnumerable<KeyValuePair<string, TypeItemCoreBase>> nmrbl1,
            IEnumerable<KeyValuePair<string, TypeItemCoreBase>> nmrbl2) => CompareMethodParamsCollctn(
                nmrbl1, nmrbl2, value => value);

        private int CompareMethodParams(
            IEnumerable<KeyValuePair<string, Lazy<TypeItemCoreBase>>> nmrbl1,
            IEnumerable<KeyValuePair<string, Lazy<TypeItemCoreBase>>> nmrbl2) => CompareMethodParamsCollctn(
                nmrbl1, nmrbl2, lazy => lazy.Value);

        private int CompareMethodParamsCollctn<TParam>(
            IEnumerable<KeyValuePair<string, TParam>> nmrbl1,
            IEnumerable<KeyValuePair<string, TParam>> nmrbl2,
            Func<TParam, TypeItemCoreBase> paramFactory) => nmrbl1.CompareNmrbls(
                nmrbl2, (kvp1, kvp2) => CompareMethodParams(
                    kvp1, kvp2,
                    paramFactory), out _);

        private int CompareMethodParams(
            KeyValuePair<string, TypeItemCoreBase> kvp1,
            KeyValuePair<string, TypeItemCoreBase> kvp2) => CompareMethodParams(
                kvp1, kvp2, value => value);

        private int CompareMethodParams(
            KeyValuePair<string, Lazy<TypeItemCoreBase>> kvp1,
            KeyValuePair<string, Lazy<TypeItemCoreBase>> kvp2) => CompareMethodParams(
                kvp1, kvp2, lazy => lazy.Value);

        private int CompareMethodParams<TParam>(
            KeyValuePair<string, TParam> kvp1,
            KeyValuePair<string, TParam> kvp2,
            Func<TParam, TypeItemCoreBase> paramFactory)
        {
            int result = kvp1.Key.CompareTo(kvp2.Key);

            if (result == 0)
            {
                result = CompareTypes(
                    paramFactory(kvp1.Value),
                    paramFactory(kvp2.Value));
            }

            return result;
        }

        private int CompareTypes(
            TypeItemCoreBase t1,
            TypeItemCoreBase t2) => t1.FullIdnfName.CompareTo(
                t2.FullIdnfName);
    }
}
