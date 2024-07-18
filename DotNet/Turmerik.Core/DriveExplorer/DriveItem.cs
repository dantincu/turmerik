using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.DriveExplorer
{
    public class DriveItem : DriveItem<DriveItem>
    {
        public DriveItem()
        {
        }

        public DriveItem(DriveItemCore src) : base(src)
        {
        }

        public DriveItem(DriveItem<DriveItem> src, int depth = 0) : base(src, depth)
        {
        }
    }

    public class DriveItem<TDriveItem, TData> : DriveItem<TDriveItem>
        where TDriveItem : DriveItem<TDriveItem, TData>
    {
        public DriveItem()
        {
        }

        public DriveItem(DriveItemCore src) : base(src)
        {
        }

        public DriveItem(DriveItem<TDriveItem, TData> src, int depth = 0) : base(src, depth)
        {
            Data = src.Data;
        }

        public DriveItem(DriveItem<TDriveItem> src, int depth = 0) : base(src, depth)
        {
        }

        public TData Data { get; set; }
    }
}
