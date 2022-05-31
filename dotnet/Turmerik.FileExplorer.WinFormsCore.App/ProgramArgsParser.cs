using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.FsUtils.WinForms.App
{
    public class ProgramArgsParser
    {
        private const int ARGS_COUNT = 2;

        public IProgramArgs Parse(string[] args)
        {
            var argsMtbl = new ProgramArgsMtbl();
            Parse(args, argsMtbl);

            var argsImmtbl = new ProgramArgsImmtbl(argsMtbl);
            return argsImmtbl;
        }

        private void Parse(string[] args, ProgramArgsMtbl argsMtbl)
        {
            for (int i = 0; i < args.Length; i++)
            {
                ParseItem(
                    argsMtbl,
                    args[i],
                    i);
            }

            for (int i = args.Length; i < ARGS_COUNT; i++)
            {
                ParseItem(
                    argsMtbl,
                    null,
                    i);
            }
        }

        private void ParseItem(
            ProgramArgsMtbl argsMtbl,
            string itemStr,
            int idx)
        {
            switch (idx)
            {
                case 0:
                    SetInitialDirPath(argsMtbl, itemStr);
                    break;
                case 1:
                    SetIsSingleInstance(argsMtbl, itemStr);
                    break;
            }
        }

        private void SetInitialDirPath(
            ProgramArgsMtbl argsMtbl,
            string itemStr)
        {
            argsMtbl.InitialDirPath = itemStr ?? string.Empty;
        }

        private void SetIsSingleInstance(
            ProgramArgsMtbl argsMtbl,
            string itemStr)
        {
            bool isSingleInstance = true;

            if (!string.IsNullOrWhiteSpace(itemStr))
            {
                if (!bool.TryParse(itemStr, out isSingleInstance))
                {
                    isSingleInstance = false;
                }
            }

            argsMtbl.IsSingleInstance = isSingleInstance;
        }
    }
}
