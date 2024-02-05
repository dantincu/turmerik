using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Turmerik.Core.Utility;

namespace Turmerik.Core.LocalDeviceEnv
{
    public interface ITrmrkUniqueDirCreator
    {
        TrmrkUniqueDir CreateTrmrkUniqueDir(
            TrmrkUniqueDirOpts opts = null);
    }

    public class TrmrkUniqueDirCreator : ITrmrkUniqueDirCreator
    {
        private readonly IAppEnv appEnv;
        private readonly ITrmrkUniqueDirRetriever trmrkUniqueDirRetriever;

        public TrmrkUniqueDirCreator(
            IAppEnv appEnv,
            ITrmrkUniqueDirRetriever trmrkUniqueDirRetriever)
        {
            this.appEnv = appEnv ?? throw new ArgumentNullException(
                nameof(appEnv));

            this.trmrkUniqueDirRetriever = trmrkUniqueDirRetriever ?? throw new ArgumentNullException(
                nameof(trmrkUniqueDirRetriever));
        }

        public TrmrkUniqueDir CreateTrmrkUniqueDir(
            TrmrkUniqueDirOpts opts = null)
        {
            var uniqueDir = trmrkUniqueDirRetriever.GetTrmrkUniqueDir(opts);

            var pathPartsList = opts.PathPartsArr?.ToList() ?? new List<string>();
            pathPartsList.Add(uniqueDir.DirName);

            uniqueDir.DirPath = appEnv.GetTypePath(
                uniqueDir.AppEnvDir,
                opts.DirNameType,
                pathPartsList.ToArray());

            if (opts.CreateDirectory != false)
            {
                Directory.CreateDirectory(uniqueDir.DirPath);
            }

            return uniqueDir;
        }
    }
}
