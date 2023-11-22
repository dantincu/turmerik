using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Helpers;
using Turmerik.LocalDevice.Core.Env;
using Turmerik.TextSerialization;

namespace Turmerik.LocalDeviceEnv
{
    public interface IAppDataFactory
    {
        TAppData Create<TAppData, TImmtbl, TMtblSrlzbl>(
            string jsonDirRelPath = null)
            where TAppData : IAppDataCore<TImmtbl, TMtblSrlzbl>
            where TImmtbl : class;

        TAppData Create<TAppData, TImmtbl, TMtblSrlzbl>(
            AppDataCoreOpts<TImmtbl, TMtblSrlzbl> opts = null,
            string jsonDirRelPath = null)
            where TAppData : AppDataCore<TImmtbl, TMtblSrlzbl>, IAppDataCore<TImmtbl, TMtblSrlzbl>
            where TImmtbl : class;

        IAppDataCore<TImmtbl, TMtblSrlzbl> CreateDefault<TImmtbl, TMtblSrlzbl>(
            AppDataCoreOpts<TImmtbl, TMtblSrlzbl> opts = null,
            string jsonDirRelPath = null)
            where TImmtbl : class;
    }

    public class AppDataFactory : IAppDataFactory
    {
        private IJsonConversion jsonConversion;
        private IAppEnv appEnv;

        public AppDataFactory(
            IJsonConversion jsonConversion,
            IAppEnv appEnv)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(nameof(jsonConversion));
            this.appEnv = appEnv ?? throw new ArgumentNullException(nameof(appEnv));
        }

        public TAppData Create<TAppData, TImmtbl, TMtblSrlzbl>(
            string jsonDirRelPath = null)
            where TAppData : IAppDataCore<TImmtbl, TMtblSrlzbl>
            where TImmtbl : class => jsonConversion.CreateFromSrc<TAppData>(
                null, appEnv, jsonDirRelPath);

        public TAppData Create<TAppData, TImmtbl, TMtblSrlzbl>(
            AppDataCoreOpts<TImmtbl, TMtblSrlzbl> opts = null,
            string jsonDirRelPath = null)
            where TAppData : AppDataCore<TImmtbl, TMtblSrlzbl>, IAppDataCore<TImmtbl, TMtblSrlzbl>
            where TImmtbl : class => jsonConversion.CreateFromSrc<TAppData>(
                null, appEnv, opts, jsonDirRelPath);

        public IAppDataCore<TImmtbl, TMtblSrlzbl> CreateDefault<TImmtbl, TMtblSrlzbl>(
            AppDataCoreOpts<TImmtbl, TMtblSrlzbl> opts = null,
            string jsonDirRelPath = null)
            where TImmtbl : class => new AppDataCore<TImmtbl, TMtblSrlzbl>(
                null, appEnv, opts, jsonDirRelPath);
    }
}
