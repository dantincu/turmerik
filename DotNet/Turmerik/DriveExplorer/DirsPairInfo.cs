using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Utility;

namespace Turmerik.DriveExplorer
{
    public class DirsPairInfo
    {
        public DirsPairInfo(
            string workDir,
            string[] existingEntriesArr,
            List<DataTreeNode<DriveItemOpts>> dirsList,
            string pathToOpen)
        {
            WorkDir = workDir ?? throw new ArgumentNullException(nameof(workDir));
            ExistingEntriesArr = existingEntriesArr ?? throw new ArgumentNullException(nameof(existingEntriesArr));
            DirsList = dirsList ?? throw new ArgumentNullException(nameof(dirsList));
            PathToOpen = pathToOpen;
        }

        public string WorkDir { get; }
        public string[] ExistingEntriesArr { get; }
        public List<DataTreeNode<DriveItemOpts>> DirsList { get; }
        public string PathToOpen { get; }
    }
}
