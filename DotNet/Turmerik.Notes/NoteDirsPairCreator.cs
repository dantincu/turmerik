using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Turmerik.DriveExplorer;

namespace Turmerik.Notes
{
    public interface INoteDirsPairCreator
    {
        Task<NoteDirsPair> CreateDirsPairAsync(
            NoteDirsPairOpts opts);
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

        public async Task<NoteDirsPair> CreateDirsPairAsync(
            NoteDirsPairOpts opts)
        {
            var result = await generator.GenerateItemsAsync(opts);

            result.DirPairs = await itemsCreator.CreateItemsAsync(
                new DriveItemsCreatorOpts
                {
                    PrIdnf = opts.PrIdnf,
                    ItemsList = result.DirPairs
                });

            return result;
        }
    }
}
