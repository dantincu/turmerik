using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Utility;

namespace Turmerik.MkFsDirsPair.Lib
{
    public interface IDirsPairInfoGenerator
    {
        DirsPairInfo Generate(string[] args);
    }

    public class DirsPairInfo
    {
        public DirsPairInfo(
            string workDir,
            string[] existingEntriesArr,
            List<DataTreeNode<FsEntry>> dirsList,
            string pathToOpen)
        {
            WorkDir = workDir ?? throw new ArgumentNullException(nameof(workDir));
            ExistingEntriesArr = existingEntriesArr ?? throw new ArgumentNullException(nameof(existingEntriesArr));
            DirsList = dirsList ?? throw new ArgumentNullException(nameof(dirsList));
            PathToOpen = pathToOpen;
        }

        public string WorkDir { get; }
        public string[] ExistingEntriesArr { get; }
        public List<DataTreeNode<FsEntry>> DirsList { get; }
        public string PathToOpen { get; }
    }
}
