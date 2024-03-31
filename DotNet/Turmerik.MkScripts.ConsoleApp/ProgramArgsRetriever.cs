using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.MkScripts.ConsoleApp
{
    public interface IProgramArgsRetriever
    {
        ProgramArgs GetArgs(
            string[] rawArgs);
    }

    public class ProgramArgsRetriever : IProgramArgsRetriever
    {
        public ProgramArgs GetArgs(
            string[] rawArgs)
        {
            throw new NotImplementedException();
        }
    }
}
