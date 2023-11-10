using Markdig.Parsers;
using Markdig.Syntax;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Turmerik.Helpers;

namespace Turmerik.Notes.Md
{
    public interface IMdObjectsRetriever
    {
        MdObjectsRetrieverArgs GetObjects(
            MdObjectsRetrieverOpts opts);

        void GetObjects(
            MdObjectsRetrieverArgs args);

        bool GetObjects(
            MdObjectsRetrieverArgs args,
            ref MdObjectsRetrieverStepData nextStep,
            MarkdownObject childObj);
    }

    public class MdObjectsRetriever : IMdObjectsRetriever
    {
        public MdObjectsRetrieverArgs GetObjects(
            MdObjectsRetrieverOpts opts)
        {
            var args = new MdObjectsRetrieverArgs
            {
                Opts = opts,
                RetMap = new Dictionary<int[], MarkdownObject>(),
                Path = new List<int>(),
                Stack = new Stack<MarkdownObject>(),
                Parent = opts.MdDoc ??= MarkdownParser.Parse(opts.MdContent)
            };

            args.Stack.Push(args.Parent);
            GetObjects(args);

            return args;
        }

        public void GetObjects(
            MdObjectsRetrieverArgs args)
        {
            MdObjectsRetrieverStepData nextStep = default;
            args.Idx = 0;

            foreach (var childObj in args.Parent.Descendants())
            {
                if (GetObjects(args, ref nextStep, childObj))
                {
                    break;
                }
            }
        }

        public bool GetObjects(
            MdObjectsRetrieverArgs args,
            ref MdObjectsRetrieverStepData nextStep,
            MarkdownObject childObj)
        {
            bool @break = nextStep.Value == MdObjectsRetrieverStep.Stop;

            if (!@break)
            {
                var path = args.Path;
                args.Idx = 0;

                args.Current = childObj;
                nextStep = args.Opts.NextStepPredicate(args);

                if (nextStep.Matches)
                {
                    path.Add(args.Idx);

                    args.RetMap.Add(
                        path.ToArray(),
                    childObj);
                    path.RemoveAt(path.Count - 1);
                }

                if (nextStep.Value == MdObjectsRetrieverStep.Next)
                {
                    args.Idx++;
                }
                if (nextStep.Value == MdObjectsRetrieverStep.Push)
                {
                    if (childObj is MarkdownObject mdObj)
                    {
                        args.Path.Add(args.Idx);
                        args.Stack.Push(mdObj);
                        args.Parent = mdObj;
                        args.Current = null;

                        GetObjects(args);

                        path.RemoveAt(path.Count - 1);
                        args.Current = args.Parent;
                        args.Parent = args.Stack.Pop();
                    }
                    else
                    {
                        args.Idx++;
                    }
                }
                else if (nextStep.Value == MdObjectsRetrieverStep.Pop)
                {
                    path.RemoveAt(path.Count - 1);
                    args.Current = args.Parent;
                    args.Parent = args.Stack.Pop();

                    if (args.Stack.None())
                    {
                        nextStep = MdObjectsRetrieverStep.Stop.ToData();
                    }
                }
            }

            return @break;
        }
    }
}
