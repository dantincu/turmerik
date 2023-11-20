using Serilog.Events;
using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Logging
{
    public class TrmrkLogEvent : LogEvent
    {
        public TrmrkLogEvent(
            DateTimeOffset timestamp,
            LogEventLevel level,
            Exception exception,
            MessageTemplate messageTemplate,
            IEnumerable<LogEventProperty> properties,
            object data = null) : base(
                timestamp,
                level,
                exception,
                messageTemplate,
                properties)
        {
            Data = data;
        }

        public object Data { get; }
    }
}
