using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Turmerik.Core.EqualityComparer;
using Turmerik.Core.Helpers;
using Turmerik.Core.Utility;

namespace Turmerik.Core.FileSystem
{
    public interface IFsEntriesRetriever
    {
        FsEntriesRetrieverArgs Retrieve(
            FsEntriesRetrieverOptions opts);
    }

    public class FsEntriesRetriever : IFsEntriesRetriever
    {
        private readonly IDataTreeGenerator dataTreeGenerator;
        private readonly IBasicComparerFactory basicComparerFactory;
        private readonly BasicComparer<bool?> isFolderComparer;

        public FsEntriesRetriever(
            IDataTreeGeneratorFactory dataTreeGeneratorFactory,
            IBasicComparerFactory basicComparerFactory)
        {
            this.dataTreeGenerator = dataTreeGeneratorFactory.Default;

            this.basicComparerFactory = basicComparerFactory ?? throw new ArgumentNullException(
                nameof(basicComparerFactory));

            isFolderComparer = basicComparerFactory.BoolNllbl();
        }

        public FsEntriesRetrieverArgs Retrieve(
            FsEntriesRetrieverOptions options)
        {
            var opts = CreateOpts(options);
            var retObj = dataTreeGenerator.GetNodes<FsEntriesRetrieverNodeData, FsEntriesRetrieverNode, FsEntriesRetrieverOpts, FsEntriesRetrieverArgs>(opts);
            return retObj;
        }

        public FsEntriesRetrieverOpts CreateOpts(FsEntriesRetrieverOptions inOpts)
        {
            inOpts = new FsEntriesRetrieverOptions(inOpts)
            {
                InputNmrblFactory = inOpts.InputNmrblFactory.FirstNotNull(
                    (args, nmrbl) => nmrbl.OrderBy(data => data.Name).OrderByDescending(
                        data => data.IsFolder, isFolderComparer)),
                FsEntryPredicate = inOpts.FsEntryPredicate.FirstNotNull(
                    (args, fsEntry, idx) => true),
                OutputNmrblFactory = inOpts.OutputNmrblFactory.FirstNotNull(
                    (args, nmrbl) => nmrbl.ToArray()),
            };

            Func<FsEntriesRetrieverArgs, string, int, TryRetrieve1In1Out <FsEntriesRetrieverArgs, FsEntriesRetrieverNode>> nextChildNodeRetrieverFactory = null!;

            Func<FsEntriesRetrieverArgs, string, int, IEnumerable <FsEntriesRetrieverNode>> childNodesNmrblFactory = null!;

            childNodesNmrblFactory = (
                args, path, idx) => Directory.EnumerateFileSystemEntries(path).With(childEntriesNmrbl =>
                {
                    var dataEntriesNmrbl = childEntriesNmrbl.Select(
                        (entry, idx) => GetNodeData(entry, args.LevelIdx, idx));

                    dataEntriesNmrbl = args.Opts.InputNmrblFactory(args, dataEntriesNmrbl);

                    dataEntriesNmrbl = dataEntriesNmrbl.Select(
                        (data, idx) => new FsEntriesRetrieverNodeData(data)
                        {
                            Idx = idx,
                        });

                    dataEntriesNmrbl = dataEntriesNmrbl.Where(
                        (data, idx) => args.Opts.FsEntryPredicate(args, data, idx));

                    dataEntriesNmrbl = args.Opts.OutputNmrblFactory(args, dataEntriesNmrbl);

                    var retNode = dataEntriesNmrbl.Select(
                        (data, idx) => new FsEntriesRetrieverNode(data,
                            a => nextChildNodeRetrieverFactory(
                                args, data.Path, idx)));

                    return retNode;
                });

            nextChildNodeRetrieverFactory = (args, path, idx) => childNodesNmrblFactory(
                args, path, idx).GetEnumerator().GetRetriever(
                node => node, default(FsEntriesRetrieverArgs))!;

            var opts = new FsEntriesRetrieverOpts(
                null, args => nextChildNodeRetrieverFactory(
                    args, inOpts.RootDirPath, 0), args =>
                {
                    var nextNodeData = args.Next.Data;
                    var nextNodeValue = nextNodeData.Value;

                    bool matches = args.Opts.FsEntryPredicate(
                        args, nextNodeValue,
                        nextNodeValue.Idx);

                    var nextStep = ((matches && nextNodeValue.IsFolder == true) switch
                    {
                        true => DataTreeGeneratorStep.Push,
                        false => DataTreeGeneratorStep.Next
                    }).ToData(matches);

                    return nextStep;
                }, inOpts);

            return opts;
        }

        private FsEntriesRetrieverNodeData GetNodeData(
            string path, int levelIdx, int idx) => new FsEntriesRetrieverNodeData
            {
                Path = path,
                Name = Path.GetFileName(path),
                IsFolder = Directory.Exists(path) ? true : null,
                Idx = idx,
                LevelIdx = levelIdx,
            };
    }
}
