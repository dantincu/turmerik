using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.DriveExplorer
{
    public interface IDriveItemsCreator
    {
        Task<List<DriveItemX>> CreateItemsAsync(
            DriveItemsCreatorOpts opts);
    }

    public class DriveItemsCreator : IDriveItemsCreator
    {
        private readonly IDriveExplorerService dvExplrSvc;

        public DriveItemsCreator(
            IDriveExplorerService dvExplrSvc)
        {
            this.dvExplrSvc = dvExplrSvc ?? throw new ArgumentNullException(nameof(dvExplrSvc));
        }

        public async Task<List<DriveItemX>> CreateItemsAsync(
            DriveItemsCreatorOpts opts)
        {
            foreach (var item in opts.ItemsList)
            {
                if (!item.Data.IsCreated)
                {
                    item.Data ??= new DriveItemXData();
                    DriveItem newItem;

                    if (item.IsFolder == true)
                    {
                        newItem = await dvExplrSvc.CreateFolderAsync(
                            opts.PrIdnf, item.Name);

                        OnItemCreated(item, newItem);
                        var childrenList = GetChildrenList(item);

                        await CreateItemsAsync(new DriveItemsCreatorOpts
                        {
                            ItemsList = childrenList,
                            PrIdnf = item.Idnf
                        });
                    }
                    else
                    {
                        newItem = await dvExplrSvc.CreateTextFileAsync(
                            opts.PrIdnf, item.Name, item.Data.TextFileContents);

                        OnItemCreated(item, newItem);
                    }
                }
            }

            return opts.ItemsList;
        }

        private void OnItemCreated(
            DriveItemX inputItem,
            DriveItem newItem)
        {
            inputItem.Idnf = newItem.Idnf;
            inputItem.Data.IsCreated = true;
        }

        private List<DriveItemX> GetChildrenList(
            DriveItemX item)
        {
            List<DriveItemX> childrenList = new();

            AddChildrenIfReq(childrenList, item.SubFolders);
            AddChildrenIfReq(childrenList, item.FolderFiles);

            return childrenList;
        }

        private void AddChildrenIfReq(
            List<DriveItemX> retChildrenList,
            List<DriveItemX> childrenList)
        {
            if (childrenList != null)
            {
                retChildrenList.AddRange(childrenList);
            }
        }
    }
}
