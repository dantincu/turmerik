using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;

namespace Turmerik.UnitTests
{
    public partial class FilteredDriveEntriesSynchronizerUnitTest
    {
        private static readonly ReadOnlyCollection<ReadOnlyCollection<int>> Perms3From5 = CreatePerms3From5(
            GetPerms3From5Input());

        private static readonly ReadOnlyCollection<ReadOnlyCollection<int>> Perms3From5Reversed = CreatePerms3From5Reversed(
            GetPerms3From5Input());

        private static readonly ReadOnlyCollection<ReadOnlyCollection<int>> Perms3From5Mirrorred = CreatePerms3From5Mirrorred(
            GetPerms3From5Input());

        private static ReadOnlyCollection<ReadOnlyCollection<int>> CreatePerms3From5(
            int[][] input) => input.Select(
                line => line.RdnlC()).RdnlC();

        private static ReadOnlyCollection<ReadOnlyCollection<int>> CreatePerms3From5Reversed(
            int[][] input) => input.Reverse().Select(
                line => line.RdnlC()).RdnlC();

        private static ReadOnlyCollection<ReadOnlyCollection<int>> CreatePerms3From5Mirrorred(
            int[][] input) => input.Concat(input.Reverse()).Select(
                line => line.RdnlC()).RdnlC();

        private static int[][] GetPerms3From5Input() => [
            [0, 1, 2], [0, 1, 3], [0, 1, 4], [0, 2, 3], [0, 2, 4], [0, 3, 4],
            [1, 2, 3], [1, 2, 4], [1, 3, 4],
            [2, 3, 4]];

        private static ReadOnlyCollection<int> GetPerm3From5(
            ref int idx,
            ReadOnlyCollection<ReadOnlyCollection<int>> perms3From5 = null)
        {
            perms3From5 ??= Perms3From5;
            idx = idx % perms3From5.Count;

            var retPerm = perms3From5[idx];
            return retPerm;
        }

        private DriveItem CreateLibContents(
            int libIndex,
            int syncedLibIndex,
            string textContentPrefix)
        {
            int idx = libIndex * 13 + syncedLibIndex * 7;

            var rootFolder = CreateLibContents("lib", libIndex, (libIdx, levelStack, isFolder, i) =>
            {
                var perm3From5 = GetPerm3From5(ref idx);
                idx++;

                bool create = perm3From5.Contains(i);
                return create;
            }, textContentPrefix);

            return rootFolder;
        }

        private DriveItem CreateLibContents(
            string folderName,
            int libIdx,
            Func<int, List<int>, bool, int, bool> predicate,
            string textContentPrefix,
            List<int> levelStack = null,
            int depth = 4,
            int breadth = 5)
        {
            levelStack ??= new List<int>();

            var retFolder = new DriveItem
            {
                Name = folderName,
                FolderFiles = new List<DriveItem>(),
                SubFolders = new List<DriveItem>()
            };

            for (int i = 0; i < breadth; i++)
            {
                if (predicate(libIdx, levelStack, false, i))
                {
                    string name = GetItemName(libIdx, levelStack.Count, i);

                    if (!string.IsNullOrEmpty(textContentPrefix))
                    {
                    }

                    retFolder.FolderFiles.Add(CreateFile(
                        name + ".txt", textContentPrefix + name));
                }
            }

            if (levelStack.Count < depth)
            {
                for (int i = 0; i < breadth; i++)
                {
                    if (predicate(libIdx, levelStack, true, i))
                    {
                        string name = GetItemName(libIdx, levelStack.Count, i);
                        levelStack.Add(i);

                        var subFolder = CreateLibContents(
                            name, libIdx, predicate, textContentPrefix, levelStack, depth, breadth);

                        levelStack.RemoveAt(levelStack.Count - 1);
                        retFolder.SubFolders.Add(subFolder);
                    }
                }
            }

            return retFolder;
        }
    }
}
