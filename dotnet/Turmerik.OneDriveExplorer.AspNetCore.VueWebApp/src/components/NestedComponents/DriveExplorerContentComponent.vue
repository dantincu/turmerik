<template>
    <div class="trmrk-drive-explorer">
        <h6 id="folders">
            <button type="button" class="btn btn-light"><i class="bi bi-folder-fill" @click="addNewFolderClick()"></i></button>
        </h6>

        <DriveItemsGridComponent
            :isDriveFoldersGrid="true"
            :driveItems="driveFolders"
            :currentDriveFolder="currentDriveFolder"
            :isEditMode="foldersEditMode"
            :isAddMode="foldersAddMode"
            @itemAddingCancelled="(newItem: any) => itemAddingCancelled(newItem)"
            @itemEditingStarted="(driveFolderEl: any) => itemEditingStarted(driveFolderEl)"
            @itemEditingCancelled="(driveFolderEl: any) => itemEditingCancelled(driveFolderEl)"
            @editedItemSaved="(driveFolderEl: any, newFolderName: string) => editedFolderSaved(driveFolderEl, newFolderName)"
            @addedItemSaved="(newFolderEl: any, newFolderName: string) => addedFolderSaved(newFolderEl, newFolderName)"
            @editedItemRemoved="(driveFolderEl: any) => editedFolderRemoved(driveFolderEl)">
        </DriveItemsGridComponent>

        <h6 id="files">
            <button type="button" class="btn btn-light"><i class="bi bi-file" @click="addNewFileClick()"></i></button>
        </h6>

        <DriveItemsGridComponent
            :isDriveFoldersGrid="false"
            :driveItems="driveFiles"
            :currentDriveFolder="currentDriveFolder"
            :isEditMode="filesEditMode"
            :isAddMode="filesAddMode"
            @itemAddingCancelled="(newItem: any) => itemAddingCancelled(newItem)"
            @itemEditingStarted="(driveFileEl: any) => itemEditingStarted(driveFileEl)"
            @itemEditingCancelled="(driveFileEl: any) => itemEditingCancelled(driveFileEl)"
            @editedItemSaved="(driveFileEl: any, newFileName: string) => editedFileSaved(driveFileEl, newFileName)"
            @addedItemSaved="(newFileEl: any, newFileName: string) => addedFileSaved(newFileEl, newFileName)"
            @editedItemRemoved="(driveFileEl: any) => editedFileRemoved(driveFileEl)">
        </DriveItemsGridComponent>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    import { DriveItem } from '../../services/Entities/Entities';
    import { DriveItemEl } from './DriveItemEl';
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
                driveFiles,
                foldersEditMode: false,
                foldersAddMode: false,
                filesEditMode: false,
                filesAddMode: false
            };
        },
        methods: {
            addNewFolderClick() {
                this.foldersAddMode = true;
                this.filesEditMode = true;
            },
            addNewFileClick() {
                this.filesAddMode = true;
                this.foldersEditMode = true;
            },
            // eslint-disable-next-line no-unused-vars
            itemEditingStarted(driveitemEl: DriveItemEl) {
                this.foldersEditMode = true;
                this.filesEditMode = true;
            },
            // eslint-disable-next-line no-unused-vars
            itemEditingCancelled(driveItemEl: DriveItemEl) {
                this.foldersEditMode = false;
                this.filesEditMode = false;
            },
            // eslint-disable-next-line no-unused-vars
            itemAddingCancelled(newItem: DriveItemEl) {
                this.foldersAddMode = false;
                this.filesAddMode = false;
                this.foldersEditMode = false;
                this.filesEditMode = false;
            },
            // eslint-disable-next-line no-unused-vars
            editedFolderSaved(driveFolderEl: DriveItemEl, newFolderName: string) {
                this.foldersEditMode = false;
                this.filesEditMode = false;
            },
            // eslint-disable-next-line no-unused-vars
            editedFileSaved(driveFileEl: DriveItemEl, newFileName: string) {
                this.foldersEditMode = false;
                this.filesEditMode = false;
            },
            // eslint-disable-next-line no-unused-vars
            addedFolderSaved(newItem: DriveItemEl, newValue: string) {
                this.foldersAddMode = false;
                this.filesEditMode = false;
            },
            // eslint-disable-next-line no-unused-vars
            addedFileSaved(newItem: DriveItemEl, newValue: string) {
                this.filesAddMode = false;
                this.foldersEditMode = false;
            },
            // eslint-disable-next-line no-unused-vars
            editedFolderRemoved(driveFolderEl: DriveItemEl) {
                this.foldersEditMode = false;
                this.filesEditMode = false;
            },
            // eslint-disable-next-line no-unused-vars
            editedFileRemoved(driveFileEl: DriveItemEl) {
                this.foldersEditMode = false;
                this.filesEditMode = false;
            },
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