using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.LocalFileNotes.WinFormsApp
{
    public class AppArgsParser
    {
        public AppArgsMtbl Parse(string[] args)
        {
            var appArgs = new AppArgsMtbl
            {
                RawArgs = args
            };

            return appArgs;
        }
    }
}
