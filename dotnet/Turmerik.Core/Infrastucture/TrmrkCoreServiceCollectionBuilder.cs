using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Data;
using Turmerik.Core.Components;
using Turmerik.Core.FileSystem;

namespace Turmerik.Core.Infrastucture
{
    public interface ITrmrkCoreServiceCollection
    {
        ILambdaExprHelperFactory LambdaExprHelperFactory { get; }
        ITypesStaticDataCache TypesStaticDataCache { get; }
        IEnumValuesStaticDataCache EnumValuesStaticDataCache { get; }
    }

    public class TrmrkCoreServiceCollectionImmtbl : ITrmrkCoreServiceCollection
    {
        public TrmrkCoreServiceCollectionImmtbl(ITrmrkCoreServiceCollection src)
        {
            LambdaExprHelperFactory = src.LambdaExprHelperFactory;
            TypesStaticDataCache = src.TypesStaticDataCache;
            EnumValuesStaticDataCache = src.EnumValuesStaticDataCache;
        }

        public ILambdaExprHelperFactory LambdaExprHelperFactory { get; }
        public ITypesStaticDataCache TypesStaticDataCache { get; }
        public IEnumValuesStaticDataCache EnumValuesStaticDataCache { get; }
    }

    public class TrmrkCoreServiceCollectionMtbl : ITrmrkCoreServiceCollection
    {
        public TrmrkCoreServiceCollectionMtbl()
        {
        }

        public TrmrkCoreServiceCollectionMtbl(ITrmrkCoreServiceCollection src)
        {
            LambdaExprHelperFactory = src.LambdaExprHelperFactory;
            TypesStaticDataCache = src.TypesStaticDataCache;
            EnumValuesStaticDataCache = src.EnumValuesStaticDataCache;
        }

        public ILambdaExprHelperFactory LambdaExprHelperFactory { get; set; }
        public ITypesStaticDataCache TypesStaticDataCache { get; set; }
        public IEnumValuesStaticDataCache EnumValuesStaticDataCache { get; set; }
    }

    public class TrmrkCoreServiceCollectionBuilder
    {
        public static ITrmrkCoreServiceCollection RegisterAll(IServiceCollection services)
        {
            var mtbl = new TrmrkCoreServiceCollectionMtbl
            {
                LambdaExprHelperFactory = new LambdaExprHelperFactory(),
                TypesStaticDataCache = new TypesStaticDataCache(),
                EnumValuesStaticDataCache = new EnumValuesStaticDataCache(),
            };

            var immtbl = new TrmrkCoreServiceCollectionImmtbl(mtbl);

            services.AddSingleton(immtbl.LambdaExprHelperFactory);
            services.AddSingleton(immtbl.TypesStaticDataCache);
            services.AddSingleton(immtbl.EnumValuesStaticDataCache);

            services.AddSingleton<IConsoleComponent, ConsoleComponent>();
            services.AddSingleton<ITimeStampHelper, TimeStampHelper>();

            services.AddSingleton<IStringToStringConverterCore, StringToStringConverterCore>();
            services.AddSingleton<IStringToIntConverter, StringToIntConverter>();
            services.AddSingleton<IStringToBoolConverter, StringToBoolConverter>();
            services.AddSingleton<IStringToEnumConverter, StringToEnumConverter>();
            services.AddSingleton<IStringToDateTimeConverter, StringToDateTimeConverter>();

            services.AddSingleton<IFsPathNormalizer, FsPathNormalizer>();
            return immtbl;
        }
    }
}
