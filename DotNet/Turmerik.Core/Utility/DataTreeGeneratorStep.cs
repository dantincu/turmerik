using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Utility
{
    public enum DataTreeGeneratorStep
    {
        Next = 0,
        Push,
        Pop
    }

    public readonly struct DataTreeGeneratorStepData
    {
        public DataTreeGeneratorStepData(
            bool matches,
            DataTreeGeneratorStep value)
        {
            Matches = matches;
            Value = value;
        }

        public bool Matches { get; }
        public DataTreeGeneratorStep Value { get; }
    }
}
