using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.TextParsing
{
    public enum Step
    {
        Next = 0,
        Push,
        Pop
    }

    public readonly struct StepData
    {
        public StepData(
            bool matches,
            Step value)
        {
            Matches = matches;
            Value = value;
        }

        public bool Matches { get; }
        public Step Value { get; }
    }
}
