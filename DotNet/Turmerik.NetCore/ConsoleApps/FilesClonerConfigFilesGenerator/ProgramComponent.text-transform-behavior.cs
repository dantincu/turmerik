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
        private ProgramConfig.Profile GenerateTextTransformBehaviorCfgProfile(
            bool isDevEnv) => GenerateConfigProfile("text-transform-behavior",
                new ProgramConfig.Profile
                {
                    FileGroups = new List<ProgramConfig.FilesGroup>
                    {
                        new ProgramConfig.FilesGroup
                        {
                            WorkDir = "|$TURMERIK_REPO_DIR|\\ParcelWs-V2\\apps\\trmrk-text-transform-behavior",
                            CloneBaseDirLocator = new FsEntryLocator
                            {
                                EntryPath = "|$TURMERIK_DOTNET_UTILITY_APPS_ENV_DIR|"
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
                                        EntryRelPath = ".\\Config\\Turmerik.Utility.WinFormsApp.UserControls.TextTransformBehavior",
                                    },
                                    CloneFileNameTpl = "behavior.js",
                                    CloneTplLines = [
                                        "const turmerikObj = {{}};",
                                        "{0}",
                                        "this.turmerik = turmerikObj.turmerik;" ]
                                },
                            }
                        },
                    },
                    ScriptGroups = new List<ProgramConfig.ScriptsGroup>
                    {
                        new ProgramConfig.ScriptsGroup
                        {
                            WorkDir = "|$TURMERIK_REPO_DIR|\\ParcelWs-V2\\apps\\trmrk-text-transform-behavior",
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
                            WorkDir = "|$TURMERIK_DOTNET_UTILITY_APPS_ENV_DIR|\\Config\\Turmerik.Utility.WinFormsApp.UserControls.TextTransformBehavior",
                            OnBeforeScripts = new List<ProgramConfig.Script>
                            {
                                new ProgramConfig.Script
                                {
                                    /* WinShellCmd = new Core.Utility.ProcessLauncherOpts
                                    {
                                        FileName = "cmd",
                                        ArgumentsNmrbl = [ "/c", "del", "behavior.js" ],
                                        UseShellExecute = false
                                    }*/
                                    PowerShellCmd = new Utility.PowerShellAdapterOpts
                                    {
                                        Commands = new Utility.PowerShellCommandOpts
                                        {
                                            CommandName = "rmitem",
                                            CommandArguments = [ "behavior.js", ":fr", ":rc" ]
                                        }.Lst()
                                    }
                                }
                            }
                        }
                    }
                });
    }
}
