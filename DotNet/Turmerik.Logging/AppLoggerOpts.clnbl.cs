using Microsoft.Extensions.Logging;
using Serilog.Events;
using Serilog.Formatting;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.LocalDevice.Core.Env;
using Turmerik.Text;
using Turmerik.Utility;

namespace Turmerik.Logging
{
    public partial class AppLoggerOpts
    {
        public interface IClnbl
        {
            string LogDirRelPath { get; }
            IAppEnv AppEnv { get; }
            IAppInstanceStartInfoProvider AppInstanceStartInfoProvider { get; }
            ITextFormatter TextFormatter { get; }
            IStringTemplateParser StringTemplateParser { get; }
            LogLevel LogLevel { get; }
            bool IsLoggerBuffered { get; }
            bool IsLoggerShared { get; }
        }

        public class Immtbl : IClnbl
        {
            public Immtbl(IClnbl src)
            {
                LogDirRelPath = src.LogDirRelPath;
                AppEnv = src.AppEnv;
                AppInstanceStartInfoProvider = src.AppInstanceStartInfoProvider;
                TextFormatter = src.TextFormatter;
                StringTemplateParser = src.StringTemplateParser;
                LogLevel = src.LogLevel;
                IsLoggerBuffered = src.IsLoggerBuffered;
                IsLoggerShared = src.IsLoggerShared;
            }

            public string LogDirRelPath { get; }
            public IAppEnv AppEnv { get; }
            public IAppInstanceStartInfoProvider AppInstanceStartInfoProvider { get; }
            public ITextFormatter TextFormatter { get; }
            public IStringTemplateParser StringTemplateParser { get; }
            public LogLevel LogLevel { get; }
            public bool IsLoggerBuffered { get; }
            public bool IsLoggerShared { get; }
        }

        public class Mtbl : IClnbl
        {
            public Mtbl()
            {
            }

            public Mtbl(IClnbl src)
            {
                LogDirRelPath = src.LogDirRelPath;
                AppEnv = src.AppEnv;
                AppInstanceStartInfoProvider = src.AppInstanceStartInfoProvider;
                TextFormatter = src.TextFormatter;
                StringTemplateParser = src.StringTemplateParser;
                LogLevel = src.LogLevel;
                IsLoggerBuffered = src.IsLoggerBuffered;
                IsLoggerShared = src.IsLoggerShared;
            }

            public string LogDirRelPath { get; set; }
            public IAppEnv AppEnv { get; set; }
            public IAppInstanceStartInfoProvider AppInstanceStartInfoProvider { get; set; }
            public ITextFormatter TextFormatter { get; set; }
            public IStringTemplateParser StringTemplateParser { get; set; }
            public LogLevel LogLevel { get; set; }
            public bool IsLoggerBuffered { get; set; }
            public bool IsLoggerShared { get; set; }
        }
    }
}
