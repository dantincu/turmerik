<template>
    <div class="trmrk-drive-explorer">
        <h6 id="folders">
            <button type="button" class="btn btn-light"><i class="bi bi-folder-fill"></i></button>
        </h6>
        <DriveItemsGridComponent :isDriveFoldersGrid="true" :driveItems="driveFolders" :currentDriveFolder="currentDriveFolder"></DriveItemsGridComponent>
        <h6 id="files">
            <button type="button" class="btn btn-light"><i class="bi bi-file"></i></button>
        </h6>
        <DriveItemsGridComponent :isDriveFoldersGrid="false" :driveItems="driveFiles" :currentDriveFolder="currentDriveFolder"></DriveItemsGridComponent>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    import { DriveItem } from '../../services/Entities/Entities';
    import DriveItemsGridComponent from './DriveItemsGridComponent.vue';

    export default defineComponent({
        props: [ "data" ],
        data() {
            const currentDriveFolder = this.data as DriveItem;

            const driveFolders = currentDriveFolder.subFolders;
            const driveFiles = currentDriveFolder.folderFiles;

            return {
                currentDriveFolder,
                driveFolders,
                driveFiles
            };
        },
        components: {
            DriveItemsGridComponent
        }
    });
</script>

<style scoped>
</style>

<style>
    .trmrk-row {
        display: block;
    }
</style>