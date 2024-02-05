using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.LocalDeviceEnv;

namespace Turmerik.Core.Utility
{
    public interface ITrmrkUniqueDirRetriever
    {
        TrmrkUniqueDir GetTrmrkUniqueDir(
            TrmrkUniqueDirOpts opts = null);
    }

    public class TrmrkUniqueDirRetriever : ITrmrkUniqueDirRetriever
    {
        public TrmrkUniqueDir GetTrmrkUniqueDir(
            TrmrkUniqueDirOpts opts = null)
        {
            opts ??= new TrmrkUniqueDirOpts();
            opts.DirNameFormat ??= "[{0}][{1:N}]";

            if (opts.AppInstanceStartInfo != null)
            {
                opts.DirNameGuid ??= opts.AppInstanceStartInfo.InstanceGuid;
                opts.DirNameTicks ??= opts.AppInstanceStartInfo.InstanceTicks;
            }
            else
            {
                opts.DirNameTicks ??= DateTime.UtcNow.Ticks;
                opts.DirNameGuid ??= Guid.NewGuid();
            }

            var retObj = new TrmrkUniqueDir
            {
                AppEnvDir = opts.AppEnvDir ?? AppEnvDir.Temp,
                AppInstanceStartInfo = opts.AppInstanceStartInfo,
                DirName = string.Format(
                    opts.DirNameFormat,
                    opts.DirNameTicks,
                    opts.DirNameGuid),
                DirNameFormat = opts.DirNameFormat,
                DirNameGuid = opts.DirNameGuid.Value,
                DirNameTicks = opts.DirNameTicks.Value,
            };

            return retObj;
        }
    }
}
