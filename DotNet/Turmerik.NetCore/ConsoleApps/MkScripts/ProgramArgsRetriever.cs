﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.LocalDeviceEnv;

namespace Turmerik.NetCore.ConsoleApps.MkScripts
{
    public interface IProgramArgsRetriever
    {
        ProgramArgs GetArgs(
            string[] rawArgs);
    }

    public class ProgramArgsRetriever : IProgramArgsRetriever
    {
        private readonly IConsoleArgsParser parser;
        private readonly IProgramConfigRetriever programConfigRetriever;
        private readonly ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever;

        public ProgramArgsRetriever(
            IConsoleArgsParser parser,
            IProgramConfigRetriever programConfigRetriever,
            ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever)
        {
            this.parser = parser ?? throw new ArgumentNullException(
                nameof(parser));

            this.programConfigRetriever = programConfigRetriever ?? throw new ArgumentNullException(
                nameof(programConfigRetriever));

            this.localDevicePathMacrosRetriever = localDevicePathMacrosRetriever ?? throw new ArgumentNullException(
                nameof(localDevicePathMacrosRetriever));
        }

        public ProgramArgs GetArgs(
            string[] rawArgs)
        {
            var args = new ProgramArgs
            {
                LocalDevicePathsMap = localDevicePathMacrosRetriever.LoadFromConfigFile(),
                Config = programConfigRetriever.LoadProgramConfig()
            };
            
            args = parser.Parse(
                new ConsoleArgsParserOpts<ProgramArgs>(rawArgs)
                {
                    ArgsFactory = () => args,
                    ArgsBuilder = data => parser.HandleArgs(
                        new ConsoleArgsParseHandlerOpts<ProgramArgs>
                        {
                            Data = data,
                            ThrowOnTooManyArgs = true,
                            ThrowOnUnknownFlag = true,
                            ItemHandlersArr = [],
                            FlagHandlersArr = [
                                parser.ArgsFlagOpts(data, ["cmd"],
                                    data => data.Args.Command = ParseCommand(data.ArgFlagValue!.Single())),
                                parser.ArgsFlagOpts(data, ["pf"],
                                    data => data.Args.ProfileName = data.ArgFlagValue!.Single()),
                                parser.ArgsFlagOpts(data, ["sc"],
                                    data => data.Args.SectionName = data.ArgFlagValue!.Single()),
                                parser.ArgsFlagOpts(data, ["arg"],
                                    data => data.Args.ContentArgsFilterName = data.ArgFlagValue!.Single()),
                                parser.ArgsFlagOpts(data, ["pth"],
                                    data => data.Args.RelDirPathsFilterName = data.ArgFlagValue!.Single())
                            ]
                        })
                }).Args;

            args.Profile = args.Config.Profiles.Single(
                profile => profile.ProfileName == args.ProfileName);

            args.Section = args.Profile.Sections.Single(
                profile => profile.SectionName == args.SectionName);

            return args;
        }

        private ProgramCommand ParseCommand(
            string argFlagValue) => argFlagValue.ToLowerInvariant() switch
        {
            "c" => ProgramCommand.Create,
            "r" => ProgramCommand.Remove,
            _ => throw new ArgumentException(nameof(argFlagValue))
        };
    }
}