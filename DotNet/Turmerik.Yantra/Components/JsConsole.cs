using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using Turmerik.Utility;

namespace Turmerik.Yantra.Components
{
    public interface IJsConsole : IDisposable
    {
        void Write(
            LogLevel logLevel,
            params object[] argsArr);

        void Log(params object[] argsArr);
        void Trace(params object[] argsArr);
        void Debug(params object[] argsArr);
        void Info(params object[] argsArr);
        void Warn(params object[] argsArr);
        void Error(params object[] argsArr);
        void Fatal(params object[] argsArr);

        event ParamsAction<LogLevel> OnWrite;
    }

    public interface IJsConsoleFactory
    {
        IJsConsole Create(
            LogLevel defaultLogLevel = LogLevel.Debug);
    }

    public class JsConsole : IJsConsole
    {
        private readonly LogLevel defaultLogLevel;

        private ParamsAction<LogLevel> onWrite;

        public JsConsole(
            LogLevel defaultLogLevel)
        {
            this.defaultLogLevel = defaultLogLevel;
        }

        public event ParamsAction<LogLevel> OnWrite
        {
            add => onWrite += value;
            remove => onWrite -= value;
        }

        public void Write(
            LogLevel logLevel,
            params object[] argsArr) => onWrite?.Invoke(
                logLevel,
                argsArr);

        public void Log(
            params object[] argsArr) => Write(
                defaultLogLevel,
                argsArr);

        public void Trace(
            params object[] argsArr) => Write(
                LogLevel.Trace,
                argsArr);

        public void Debug(
            params object[] argsArr) => Write(
                LogLevel.Debug,
                argsArr);

        public void Info(
            params object[] argsArr) => Write(
                LogLevel.Information,
                argsArr);

        public void Warn(
            params object[] argsArr) => Write(
                LogLevel.Warning,
                argsArr);

        public void Error(
            params object[] argsArr) => Write(
                LogLevel.Error,
                argsArr);

        public void Fatal(
            params object[] argsArr) => Write(
                LogLevel.Critical,
                argsArr);

        public void Dispose()
        {
            onWrite = null;
        }
    }

    public class JintConsoleFactory : IJsConsoleFactory
    {
        public IJsConsole Create(
            LogLevel defaultLogLevel = LogLevel.Debug) => new JsConsole(
                defaultLogLevel);
    }
}
