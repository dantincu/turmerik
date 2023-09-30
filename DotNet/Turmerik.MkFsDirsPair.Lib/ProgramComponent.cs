using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Turmerik.FileSystem;
using Turmerik.Helpers;
using Turmerik.Utility;

namespace Turmerik.MkFsDirsPair.Lib
{
    public class ProgramComponent
    {
        private readonly IDirsPairInfoGenerator dirNamesPairGenerator;

        public ProgramComponent(
            IDirsPairInfoGenerator dirNamesPairGenerator)
        {
            this.dirNamesPairGenerator = dirNamesPairGenerator ?? throw new ArgumentNullException(nameof(dirNamesPairGenerator));
        }

        public void Run(string[] args)
        {
            var data = dirNamesPairGenerator.Generate(args);

            CreateEntries(
                data.WorkDir,
                data.DirsList,
                true);

            ProcessH.OpenWithDefaultProgramIfNotNull(
                data.PathToOpen);
        }

        private void CreateEntries(
            string parentDirPath,
            List<DataTreeNode<FsEntryOpts>> nodesList,
            bool isRootLevel = false)
        {
            foreach (var node in nodesList)
            {
                var data = node.Data;
                string entryName = data.Name;

                string entryPath = Path.Combine(
                    parentDirPath,
                    entryName);

                if (isRootLevel && !data.OverwriteExisting && FsH.EntryExists(entryPath))
                {
                    throw new InvalidOperationException(
                        $"An entry with name {entryName} already exists at this location");
                }

                CreateEntry(
                    entryPath,
                    data,
                    node);
            }
        }

        private void CreateEntry(
            string entryPath,
            FsEntryOpts data,
            DataTreeNode<FsEntryOpts> node)
        {
            if (data.IsFolder)
            {
                CreateFolder(
                    entryPath,
                    node);
            }
            else
            {
                CreateFile(
                    entryPath,
                    node.Data);
            }
        }

        private void CreateFolder(
            string entryPath,
            DataTreeNode<FsEntryOpts> node)
        {
            Directory.CreateDirectory(entryPath);

            if (node.ChildNodes != null)
            {
                CreateEntries(
                    entryPath,
                    node.ChildNodes);
            }
        }

        private void CreateFile(
            string entryPath,
            FsEntryOpts data)
        {
            File.WriteAllText(
                entryPath,
                data.Contents ?? string.Empty);
        }
    }
}
