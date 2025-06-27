using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;
using Turmerik.Jint.Behavior;

namespace Turmerik.Jint.ConsoleApps
{
    public class ProgramConfigWrapper<TProgramConfig>
    {
        public ProgramConfigWrapper(
            TProgramConfig config,
            ReadOnlyDictionary<string, ITrmrkJintAdapter> jintAdaptersMap)
        {
            Config = config;

            JintAdaptersMap = jintAdaptersMap ?? throw new ArgumentNullException(
                nameof(jintAdaptersMap));
        }

        public TProgramConfig Config { get; }
        public ReadOnlyDictionary<string, ITrmrkJintAdapter> JintAdaptersMap { get; }
    }
}
