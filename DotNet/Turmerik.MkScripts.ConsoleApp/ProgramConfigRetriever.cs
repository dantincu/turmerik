using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.MkScripts.ConsoleApp
{
    public interface IProgramConfigRetriever
    {
        ProgramConfig LoadProgramConfig(
            string configFilePath = null);

        ProgramConfig.Profile MergeProfiles(
            ProgramConfig.Profile destnProfile,
            ProgramConfig.Profile srcProfile);
    }

    /* public class ProgramConfigRetriever : IProgramConfigRetriever
    {
    } */
}
