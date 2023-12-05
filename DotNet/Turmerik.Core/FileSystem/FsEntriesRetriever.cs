using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.Utility;

namespace Turmerik.Core.FileSystem
{
    public interface IFsEntriesRetriever
    {
        FsEntriesRetrieverArgs Retrieve(
            FsEntriesRetrieverOpts opts);

        void NormalizeOpts(FsEntriesRetrieverOpts opts);
    }

    public class FsEntriesRetriever : IFsEntriesRetriever
    {
        private readonly IDataTreeGenerator dataTreeGenerator;

        public FsEntriesRetriever(
            IDataTreeGenerator dataTreeGenerator)
        {
            this.dataTreeGenerator = dataTreeGenerator ?? throw new ArgumentNullException(nameof(dataTreeGenerator));
        }

        public FsEntriesRetrieverArgs Retrieve(
            FsEntriesRetrieverOpts opts)
        {
            NormalizeOpts(opts);
            var retObj = dataTreeGenerator.GetNodes<FsEntriesRetrieverNodeData, FsEntriesRetrieverNode, FsEntriesRetrieverOpts, FsEntriesRetrieverArgs>(opts);
            return retObj;
        }

        public void NormalizeOpts(FsEntriesRetrieverOpts opts)
        {
            /* opts.ParentDirPathFactory = opts.ParentDirPathFactory.IfNull(
                GetParentDirPathFactory);

            opts.InputNmrblFactory = opts.InputNmrblFactory.IfNull(
                GetInputNmrblFactory);

            opts.FsEntryDataFactory = opts.FsEntryDataFactory.IfNull(
                GetFsEntryDataFactory);

            opts.FsEntryPredicate = opts.FsEntryPredicate.IfNull(
                GetFsEntryPredicate);

            opts.OutputNmrblFactory = opts.OutputNmrblFactory.IfNull(
                GetOutputNmrblFactory);

            opts.ChildrenNmrblFactory = opts.ChildrenNmrblFactory.IfNull(
                GetChildrenFactory); */
        }

        /* public Func<FsEntriesRetrieverArgs, string> GetParentDirPathFactory(
            ) => args => Path.Combine(
                [args.Opts.RootDirPath, .. args.Stack.Select(
                    node => node.Data.Name).ToArray()]);

        public Func<FsEntriesRetrieverArgs, IEnumerable<FsEntriesRetrieverNode>, IEnumerable<FsEntriesRetrieverNode>> GetInputNmrblFactory(
            ) => (args, nmrbl) => nmrbl.OrderBy(data => data.Name);

        public Func<FsEntriesRetrieverArgs, string, int, FsEntriesRetrieverNode> GetFsEntryDataFactory(
            ) => (args, path, idx) => new FsEntriesRetrieverNode
            {
                Name = Path.GetFileName(path),
                IsFolder = Directory.Exists(path) ? true : null
            };

        public Func<FsEntriesRetrieverArgs, FsEntriesRetrieverNode, int, bool> GetFsEntryPredicate(
            ) => (args, fsEntry, idx) => true;

        public Func<FsEntriesRetrieverArgs, IEnumerable<FsEntriesRetrieverNode>, IEnumerable<FsEntriesRetrieverNode>> GetOutputNmrblFactory(
            ) => (args, nmrbl) => nmrbl.ToArray();

        public Func<FsEntriesRetrieverArgs, IEnumerable<FsEntriesRetrieverNode>> GetChildrenFactory(
            ) => args => args.Opts.ParentDirPathFactory(args).With(
                parentDirPath => Directory.EnumerateFileSystemEntries(
                    parentDirPath).Select((entry, idx) => args.Opts.FsEntryDataFactory(
                        args, entry, idx)).With(
                            nmrbl => args.Opts.InputNmrblFactory(args, nmrbl)).Where(
                        (data, idx) => args.Opts.FsEntryPredicate(args, data, idx)).With(
                            nmrbl => args.Opts.OutputNmrblFactory(args, nmrbl))); */
    }
}
