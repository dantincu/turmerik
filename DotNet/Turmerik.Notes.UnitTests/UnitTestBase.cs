using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Testing;
using Turmerik.Notes.UnitTests;
using Turmerik.Core.Dependencies;
using Turmerik.Notes.Core;
using Turmerik.DirsPair.ConsoleApps.UpdFsDirPairsIdxes;
using Turmerik.Core.DriveExplorer;

namespace Turmerik.Notes.UnitTests
{
    public class UnitTestBase : UnitTestCoreBase
    {
        static UnitTestBase()
        {
            var svcProvContnr = ServiceProviderContainer.Instance.Value;

            svcProvContnr.RegisterData(
                new ServiceCollection().AsOpts(services =>
                {
                    services.AddSingleton<IdxesUpdater>();
                }));

            SvcProv = svcProvContnr.Data;
            RootDriveItem = svcProvContnr.RootDriveItem;
            Semaphore = new SemaphoreSlim(1);
        }

        protected static IServiceProvider SvcProv { get; }
        protected static DriveItem RootDriveItem { get; }

        protected static SemaphoreSlim Semaphore { get; }

        protected void AssertEqual(
            NoteMdTuple expectedResult,
            NoteMdTuple actualResult)
        {
            AssertEqual<NoteItemCore>(
                expectedResult,
                actualResult);
        }

        protected void AssertEqual(
            NoteTupleCore<NoteItemCore> expectedResult,
            NoteTupleCore<NoteItemCore> actualResult)
        {
            AssertEqual<NoteItemCore>(
                expectedResult,
                actualResult);
        }

        protected void AssertEqual<TItem>(
            NoteJsonTupleCore<TItem> expectedResult,
            NoteJsonTupleCore<TItem> actualResult)
            where TItem : NoteItemCoreBase
        {
            AssertEqual(expectedResult,
                (NoteTupleCore<TItem>)actualResult);
        }

        protected void AssertEqual<TItem>(
            NoteTupleCore<TItem> expectedResult,
            NoteTupleCore<TItem> actualResult)
            where TItem : NoteItemCoreBase
        {
            Assert.Equal(
                expectedResult.TrmrkGuidIsValid,
                actualResult.TrmrkGuidIsValid);

            Assert.Equal(
                expectedResult.FileIdnf,
                actualResult.FileIdnf);

            AssertEqual(
                expectedResult.File,
                actualResult.File);

            Assert.Equal(
                expectedResult.RawContent,
                actualResult.RawContent);

            AssertEqual(
                expectedResult.Item,
                actualResult.Item);
        }

        protected void AssertEqual(
            DriveItem expectedItem,
            DriveItem actualItem)
        {
            bool bothAreNull = expectedItem == null && actualItem == null;

            if (!bothAreNull)
            {
                Assert.NotNull(expectedItem);
                Assert.NotNull(actualItem);

                AssertEqualCore(
                    expectedItem,
                    actualItem);
            }
        }

        protected void AssertEqual(
            NoteItemCoreBase expectedItem,
            NoteItemCoreBase actualItem)
        {
            bool bothAreNull = expectedItem == null && actualItem == null;

            if (!bothAreNull)
            {
                Assert.NotNull(expectedItem);
                Assert.NotNull(actualItem);

                AssertEqualCore(
                    expectedItem,
                    actualItem);
            }
        }

        protected void AssertEqualCore(
            DriveItem expectedItem,
            DriveItem actualItem)
        {
            Assert.Equal(
                expectedItem.Idnf,
                actualItem.Idnf);

            Assert.Equal(
                expectedItem.Name,
                actualItem.Name);

            Assert.Equal(
                expectedItem.IsFolder,
                actualItem.IsFolder);

            Assert.Equal(
                expectedItem.IsRootFolder,
                actualItem.IsRootFolder);

            Assert.Equal(
                expectedItem.PrIdnf,
                actualItem.PrIdnf);
        }

        protected void AssertEqualCore(
            NoteItemCoreBase expectedItem,
            NoteItemCoreBase actualItem)
        {
            Assert.Equal(
                expectedItem.Title,
                actualItem.Title);

            Assert.Equal(
                expectedItem.TrmrkGuid,
                actualItem.TrmrkGuid);
        }

        protected void RefreshRootItem(
            Action<DriveItem> rootItemBuilder)
        {
            RootDriveItem.SubFolders.Clear();
            RootDriveItem.FolderFiles.Clear();
            rootItemBuilder(RootDriveItem);
        }
    }
}
