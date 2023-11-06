using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Notes.Md
{
    public enum MdObjectsRetrieverStep
    {
        Next,
        Push,
        Pop,
        Stop
    }

    public readonly struct MdObjectsRetrieverStepData
    {
        public MdObjectsRetrieverStepData(
            bool matches,
            MdObjectsRetrieverStep value)
        {
            Matches = matches;
            Value = value;
        }

        public bool Matches { get; }
        public MdObjectsRetrieverStep Value { get; }
    }
}
