using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Turmerik.DriveExplorer;

namespace Turmerik.Notes
{
    public interface INoteDirsPairCreator
    {
        Task<List<DriveItemX>> CreateDirsPair(
            string prIdnf,
            DirsPairOpts opts);
    }

    public class NoteDirsPairCreator : INoteDirsPairCreator
    {
        private readonly INoteDirsPairGenerator generator;
        private readonly IDriveItemsCreator itemsCreator;

        public NoteDirsPairCreator(
            INoteDirsPairGenerator generator,
            IDriveItemsCreator itemsCreator)
        {
            this.generator = generator ?? throw new ArgumentNullException(
                nameof(generator));
            this.itemsCreator = itemsCreator ?? throw new ArgumentNullException(
                nameof(itemsCreator));
        }

        public async Task<List<DriveItemX>> CreateDirsPair(
            string prIdnf,
            DirsPairOpts opts)
        {
            var itemsList = generator.GenerateItems(opts);

            itemsList = await itemsCreator.CreateItemsAsync(new DriveItemsCreatorOpts
            {
                PrIdnf = prIdnf,
                ItemsList = itemsList
            });

            return itemsList;
        }
    }
}
