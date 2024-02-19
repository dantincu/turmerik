using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Helpers;
using Turmerik.NetCore.ConsoleApps.FilesCloner;

namespace Turmerik.NetCore.ConsoleApps.FilesClonerConfigFilesGenerator
{
    public partial class ProgramComponent
    {
        private ProgramConfig.Profile GenerateBlazorAppCfgProfile(
            bool isDevEnv) => GenerateConfigProfile("notes-blazorapp",
                new ProgramConfig.Profile
                {
                    FileGroups = new List<ProgramConfig.FilesGroup>
                    {
                        new ProgramConfig.FilesGroup
                        {
                            WorkDir = "|$TURMERIK_REPO_DIR|\\DotNet\\Turmerik.Notes.BlazorApp",
                            CloneBaseDirLocator = new FsEntryLocator
                            {
                                EntryRelPath = "./wwwroot"
                            },
                            Files = new List<FileArgs>
                            {
                                new FileArgs
                                {
                                    InputFileLocator = new FsEntryLocator
                                    {
                                        EntryRelPath = "./trmrk-notes-config.json"
                                    },
                                    CloneDirLocator = new FsEntryLocator
                                    {
                                        EntryRelPath = "./trmrk-notes-config"
                                    },
                                    UseChecksum = true
                                },
                                new FileArgs
                                {
                                    InputFileLocator = new FsEntryLocator
                                    {
                                        EntryRelPath = "./trmrk-notes-config.json"
                                    },
                                    CloneDirLocator = new FsEntryLocator
                                    {
                                        EntryRelPath = "../"
                                    },
                                    CloneFileNameTpl = "FileCheckSums.TrmrkNotesConfigFile.cs",
                                    CloneTplLines = new List<string>
                                    {
                                        "namespace Turmerik.Notes.BlazorApp",
                                        "{{",
                                        "    public static partial class FileCheckSums",
                                        "    {{",
                                        "        public const string TRMRK_NOTES_CONFIG_FILE = \"{1}\";",
                                        "    }}",
                                        "}}"
                                    },
                                    ForceOverwrite = true
                                }
                            }
                        },
                        new ProgramConfig.FilesGroup
                        {
                            WorkDir = "|$TURMERIK_REPO_DIR|\\DotNet\\Turmerik.Notes.BlazorApp",
                            InputBaseDirLocator = new FsEntryLocator
                            {
                                EntryRelPath = "../../ParcelWs-V2/apps/trmrk-notes-blazorapp"
                            },
                            CloneBaseDirLocator = new FsEntryLocator
                            {
                                EntryRelPath = "./wwwroot"
                            },
                            Files = new List<FileArgs>
                            {
                                new FileArgs
                                {
                                    InputFileLocator = new FsEntryLocator
                                    {
                                        EntryRelPath = Path.Combine("dist",
                                            isDevEnv ? "dev" : "prod", "index.js")
                                    },
                                    CloneDirLocator = new FsEntryLocator
                                    {
                                        EntryRelPath = Path.Combine("js",
                                            isDevEnv ? "dev" : "prod")
                                    },
                                    UseChecksum = true,
                                    CloneTplLines = [
                                        "const turmerikObj = {{}};",
                                        "{0}",
                                        "export const turmerik = turmerikObj.turmerik;",
                                        "window.turmerik = turmerik;" ]
                                },
                                new FileArgs
                                {
                                    InputFileLocator = new FsEntryLocator
                                    {
                                        EntryRelPath = "./dist/dev/index.js" // bogus, will not be used
                                    },
                                    CloneDirLocator = new FsEntryLocator
                                    {
                                        EntryRelPath = "../"
                                    },
                                    CloneFileNameTpl = "FileCheckSums.JsFile.cs",
                                    CloneTplLines = new List<string>
                                    {
                                        "namespace Turmerik.Notes.BlazorApp",
                                        "{{",
                                        "    public static partial class FileCheckSums",
                                        "    {{",
                                        "        public const string DEV_JS_FILE = \"{1}\";",
                                        "        public const string PROD_JS_FILE = \"{2}\";",
                                        "    }}",
                                        "}}"
                                    },
                                    ForceOverwrite = true
                                }
                            }
                        }
                    },
                    ScriptGroups = new List<ProgramConfig.ScriptsGroup>
                    {
                        new ProgramConfig.ScriptsGroup
                        {
                            WorkDir = "|$TURMERIK_REPO_DIR|\\ParcelWs-V2/apps/trmrk-notes-blazorapp",
                            OnBeforeScripts = new List<ProgramConfig.Script>
                            {
                                new ProgramConfig.Script
                                {
                                    PowerShellCmd = new Utility.PowerShellAdapterOpts
                                    {
                                        Commands = new Utility.PowerShellCommandOpts
                                        {
                                            CommandName = "rmitem",
                                            CommandArguments = [ ".parcel-cache", ":fr", ":rc" ]
                                        }.Lst(new Utility.PowerShellCommandOpts
                                        {
                                            CommandName = "rmitem",
                                            CommandArguments = [ "dist", ":fr", ":rc" ]
                                        })
                                    }
                                },
                                new ProgramConfig.Script
                                {
                                    WinShellCmd = new Core.Utility.ProcessLauncherOpts
                                    {
                                        FileName = "npm",
                                        ArgumentsNmrbl = [ "run", isDevEnv ? "build-dev" : "build-prod" ]
                                    }
                                }
                            }
                        },
                        new ProgramConfig.ScriptsGroup
                        {
                            WorkDir = "|$TURMERIK_REPO_DIR|\\DotNet\\Turmerik.Notes.BlazorApp",
                            OnBeforeScripts = new List<ProgramConfig.Script>
                            {
                                new ProgramConfig.Script
                                {
                                    PowerShellCmd = new Utility.PowerShellAdapterOpts
                                    {
                                        Commands = new Utility.PowerShellCommandOpts
                                        {
                                            CommandName = "rmitem",
                                            CommandArguments = [ "js", ":fr", ":rc" ]
                                        }.Lst(new Utility.PowerShellCommandOpts
                                        {
                                            CommandName = "rmitem",
                                            CommandArguments = [ "trmrk-notes-config", ":fr", ":rc" ]
                                        })
                                    },
                                    WorkDir = "./wwwroot"
                                }
                            }
                        }
                    }
                });
    }
}
