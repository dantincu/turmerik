using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextSerialization;

namespace Turmerik.DirsPair.ConsoleApps.MkFsDirsPairCfg
{
    public class ProgramConfig : AppConfigCoreBase<ProgramConfigData.Immtbl, ProgramConfigData.Mtbl>
    {
        public ProgramConfig(
            IJsonConversion jsonConversion,
            IAppEnv appEnv) : base(
                jsonConversion,
                appEnv)
        {
        }

        protected override ProgramConfigData.Mtbl GetDefaultConfig(
            ) => new ProgramConfigData.Mtbl
            {
                ChunksMap = new ()
            };

        protected override ProgramConfigData.Immtbl NormalizeConfig(
            ProgramConfigData.Mtbl config) => new ProgramConfigData.Immtbl(
                config);
    }
}
