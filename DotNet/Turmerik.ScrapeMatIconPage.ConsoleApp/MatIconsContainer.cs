using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.ScrapeMatIconPage.ConsoleApp
{
    public class MatIconsContainer
    {
        public List<MatIconsGroup> GroupsList { get; set; }
    }

    public class MatIconsGroup
    {
        public string GroupName { get; set; }
        public List<MatIcon> IconsList { get; set; }
    }

    public class MatIcon
    {
        public string IconName { get; set; }
    }
}
