using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;

namespace Turmerik.Core.LocalDeviceEnv
{
    public interface ILocalDevicePathMacrosReplacer
    {
        string ReplacePathMacros(
            string path,
            ILocalDevicePathMacrosMap macrosMap);
    }

    public class LocalDevicePathMacrosReplacer : ILocalDevicePathMacrosReplacer
    {
        public string ReplacePathMacros(
            string path,
            ILocalDevicePathMacrosMap macrosMap)
        {
            foreach (var kvp in macrosMap.GetPathsMap())
            {
                path = path.Replace(kvp.Key, kvp.Value);
            }

            return path;
        }
    }
}
