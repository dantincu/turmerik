﻿using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextSerialization;

namespace Turmerik.Core.LocalDeviceEnv
{
    public interface IAppDataFactory
    {
        TAppData Create<TAppData, TImmtbl, TMtblSrlzbl>(
            string jsonDirRelPath = null)
            where TAppData : IAppDataCore<TImmtbl, TMtblSrlzbl>
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
    }
}
