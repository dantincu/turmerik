using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Turmerik.DriveExplorer;

namespace Turmerik.DriveExplorer.DirsPair
{
    public interface IDirsPairCreator
    {
        Task<List<DriveItemX>> CreateDirsPairAsync(
            DirsPairOpts opts);
    }

    public class DirsPairCreator : IDirsPairCreator
    {
        private readonly IDirsPairGenerator generator;
        private readonly IDriveItemsCreator itemsCreator;

        public DirsPairCreator(
            IDirsPairGenerator generator,
            IDriveItemsCreator itemsCreator)
        {
            this.generator = generator ?? throw new ArgumentNullException(
                nameof(generator));
            this.itemsCreator = itemsCreator ?? throw new ArgumentNullException(
                nameof(itemsCreator));
        }

        public async Task<List<DriveItemX>> CreateDirsPairAsync(
            DirsPairOpts opts)
        {
            var itemsList = await generator.GenerateItemsAsync(opts);

            itemsList = await itemsCreator.CreateItemsAsync(
                new DriveItemsCreatorOpts
                {
                    PrIdnf = opts.PrIdnf,
                    ItemsList = itemsList
                });

            return itemsList;
        }
    }
}
