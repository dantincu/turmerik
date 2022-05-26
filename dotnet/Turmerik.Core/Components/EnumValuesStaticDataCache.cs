using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using Turmerik.Core.Collections.Cache;
using Turmerik.Core.Helpers;
using Turmerik.Core.Reflection.Wrappers;

namespace Turmerik.Core.Components
{
    public interface IEnumValuesStaticDataCache : IStaticDataCache<Type, IReadOnlyDictionary<string, EnumMemberWrapper>>
    {
        TEnum[] Get<TEnum>();
    }

    public class EnumValuesStaticDataCache : StaticDataCache<Type, IReadOnlyDictionary<string, EnumMemberWrapper>>, IEnumValuesStaticDataCache
    {
        public EnumValuesStaticDataCache() : base(
            type => type.GetFields(
                BindingFlags.Static | BindingFlags.Public).WithHelper(
                fields => Enum.GetValues(type).Nmrbl().Select(
                    value =>
                    {
                        string name = Enum.GetName(type, value);
                        var field = fields.Single(f => f.Name == name);

                        var wrapper = new EnumMemberWrapper(field, value);
                        return wrapper;
                    }).RdnlD(
                    obj => obj.Data.Name,
                    obj => obj)))
        {
        }

        public TEnum[] Get<TEnum>()
        {
            var arr = Get(typeof(TEnum)).Cast<TEnum>().ToArray();
            return arr;
        }
    }
}
