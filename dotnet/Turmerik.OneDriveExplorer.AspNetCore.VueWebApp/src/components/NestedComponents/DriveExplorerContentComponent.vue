<template>
    <div class="trmrk-drive-explorer">
        <h3>Folders</h3>
        <DriveItemsGridComponent :isDriveFoldersGrid="true" :driveItems="driveFolders" :currentDriveFolder="currentDriveFolder"></DriveItemsGridComponent>
        <h3>Files</h3>
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