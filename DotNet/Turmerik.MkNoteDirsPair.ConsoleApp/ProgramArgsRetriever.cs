using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.MkFsDirsPair.Lib;
using Turmerik.Helpers;

namespace Turmerik.MkNoteDirsPair.ConsoleApp
{
    public class ProgramArgsRetriever
    {
        public ProgramArgs Retrieve(
            string[] args,
            AppSettings appSettings)
        {
            var pa = PrepArgs(
                appSettings,
                out var optsArr,
                out var argOptsArr);

            BuildArgs(args, pa,
                optsArr, argOptsArr);

            ValidateProgramArgs(pa);
            return pa;
        }

        private void BuildArgs(
            string[] args,
            ProgramArgs pa,
            Dictionary<string, Action<ProgramArgs>> optsArr,
            Dictionary<string, Action<ProgramArgs, string>> argOptsArr)
        {
            foreach (var arg in args)
            {
                BuildArgsCore(
                    pa, optsArr,
                    argOptsArr,
                    arg);
            }
        }

        private void BuildArgsCore(
            ProgramArgs pa,
            Dictionary<string, Action<ProgramArgs>> optsArr,
            Dictionary<string, Action<ProgramArgs, string>> argOptsArr,
            string arg)
        {
            var optsKvp = optsArr.FirstKvp(
                    (kvp, i) => kvp.Key == arg);

            var optsSetter = optsKvp.Value.Value;

            if (optsSetter != null)
            {
                optsSetter(pa);
            }
            else
            {
                var argOptsKvp = argOptsArr.FirstKvp(
                    (kvp, i) => arg.StartsWith(kvp.Key));

                var argOptsSetter = argOptsKvp.Value.Value;

                if (argOptsSetter != null)
                {
                    var argValStr = arg.Substring(
                        argOptsKvp.Value.Key.Length);

                    argOptsSetter(pa, argValStr);
                }
                else
                {
                    pa.NoteName = arg;
                    pa.CreateNote = true;
                    pa.DoNotOpenCreatedDocFile = arg.Last() == ':';
                }
            }
        }

        private ProgramArgs PrepArgs(
            AppSettings appSettings,
            out Dictionary<string, Action<ProgramArgs>> optsArr,
            out Dictionary<string, Action<ProgramArgs, string>> argOptsArr)
        {
            var trmrk = appSettings.TrmrkDirPairs;
            var pfxes = trmrk.Prefixes;
            var argOpts = trmrk.ArgOpts;
            ProgramArgs pa = new();

            optsArr = new Dictionary<string, Action<ProgramArgs>>
            {
                { pfxes.Note, pAgs => pAgs.CreateNote = true },
                { pfxes.NoteBook, pAgs => pAgs.CreateNoteBook = true },
                { pfxes.NoteFiles, pAgs => pAgs.CreateNoteFiles = true },
                { pfxes.NoteInternals, pAgs => pAgs.CreateNoteInternals = true },
            }.ToDictionary(
                kvp => $"/{kvp.Key}",
                kvp => kvp.Value);

            argOptsArr = new Dictionary<string, Action<ProgramArgs, string>>
            {
                { argOpts.WorkDir, (pAgs, arg) => pAgs.WorkDir = arg }
            };

            return pa;
        }

        private void ValidateProgramArgs(
            ProgramArgs pa)
        {
            ThrowIfCreateNoteAndNameNull(pa);
            ThrowIfCreateNoteAndBookBothSet(pa);
        }

        private void ThrowIfCreateNoteAndNameNull(
            ProgramArgs pa)
        {
            if (pa.CreateNote && pa.NoteName == null)
            {
                throw new ArgumentNullException(
                    string.Format("{0} cannot be null when {1} is set",
                    nameof(pa.NoteName),
                    nameof(pa.CreateNote)));
            }
        }

        private void ThrowIfCreateNoteAndBookBothSet(
            ProgramArgs pa)
        {
            if (pa.CreateNote && pa.CreateNoteBook)
            {
                throw new ArgumentException(
                    string.Format("{0} and {1} cannot be both specified",
                        nameof(pa.CreateNote),
                        nameof(pa.CreateNoteBook)));
            }
        }
    }
}
