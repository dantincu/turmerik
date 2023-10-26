using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.MkFsDirsPair.Lib;
using Turmerik.Helpers;
using Turmerik.DriveExplorer;

namespace Turmerik.MkNoteDirsPair.ConsoleApp
{
    public class ProgramArgsRetriever
    {
        public MkNoteDirsPairArgs Retrieve(
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
            MkNoteDirsPairArgs pa,
            Dictionary<string, Action<MkNoteDirsPairArgs>> optsArr,
            Dictionary<string, Action<MkNoteDirsPairArgs, string>> argOptsArr)
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
            MkNoteDirsPairArgs pa,
            Dictionary<string, Action<MkNoteDirsPairArgs>> optsArr,
            Dictionary<string, Action<MkNoteDirsPairArgs, string>> argOptsArr,
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
                    pa.OpenCreatedDocFile = arg.Last() == ':';
                }
            }
        }

        private MkNoteDirsPairArgs PrepArgs(
            AppSettings appSettings,
            out Dictionary<string, Action<MkNoteDirsPairArgs>> optsArr,
            out Dictionary<string, Action<MkNoteDirsPairArgs, string>> argOptsArr)
        {
            var trmrk = appSettings.NoteDirPairs;
            var pfxes = trmrk.Prefixes;
            var argOpts = trmrk.ArgOpts;
            MkNoteDirsPairArgs pa = new();

            optsArr = new Dictionary<string, Action<MkNoteDirsPairArgs>>
            {
                { pfxes.Note, pAgs => pAgs.CreateNote = true },
                { pfxes.NoteBook, pAgs => pAgs.CreateNoteBook = true },
                { pfxes.NoteFiles, pAgs => pAgs.CreateNoteFiles = true },
                { pfxes.NoteInternals, pAgs => pAgs.CreateNoteInternals = true },
            }.ToDictionary(
                kvp => $"/{kvp.Key}",
                kvp => kvp.Value);

            argOptsArr = new Dictionary<string, Action<MkNoteDirsPairArgs, string>>
            {
                { argOpts.WorkDir, (pAgs, arg) => pAgs.WorkDir = arg },
                { argOpts.SortIdx, (pAgs, arg) => pAgs.SortIdx = int.Parse(arg) }
            };

            return pa;
        }

        private void ValidateProgramArgs(
            MkNoteDirsPairArgs pa)
        {
            ThrowIfCreateNoteAndNameNull(pa);
            ThrowIfCreateNoteAndBookBothSet(pa);
        }

        private void ThrowIfCreateNoteAndNameNull(
            MkNoteDirsPairArgs pa)
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
            MkNoteDirsPairArgs pa)
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
