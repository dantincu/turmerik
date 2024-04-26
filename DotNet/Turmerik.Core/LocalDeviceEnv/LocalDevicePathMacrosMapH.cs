using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Turmerik.Core.Text;
using Turmerik.Core.TextParsing;
using Turmerik.Core.TextSerialization;

namespace Turmerik.Core.LocalDeviceEnv
{
    public static class LocalDevicePathMacrosMapH
    {
        public const string CONFIG_FILE_NAME = "trmrk-localdevice-paths.json";

        public static string NormalizePath(
            this ITextMacrosReplacer textMacrosReplacer,
            LocalDevicePathMacrosMapMtbl localDevicePathsMap,
            string? path,
            string? baseDirPath)
        {
            if (!string.IsNullOrWhiteSpace(path))
            {
                path = textMacrosReplacer.ReplaceMacros(
                    new TextMacrosReplacerOpts
                    {
                        InputText = path,
                        MacrosMap = localDevicePathsMap.GetPathsMap(),
                    });

                path = NormPathH.NormPath(path);

                path = NormPathH.AssurePathIsRooted(
                    path, () => baseDirPath?.Nullify() ?? Environment.CurrentDirectory);
            }
            else
            {
                path = baseDirPath?.Nullify() ?? Environment.CurrentDirectory;
            }

            return path;
        }
    }
}
