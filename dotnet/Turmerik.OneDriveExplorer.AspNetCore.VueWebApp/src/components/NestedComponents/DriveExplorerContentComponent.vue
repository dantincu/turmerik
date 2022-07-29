<template>
    <div class="trmrk-drive-explorer">
        <h6 id="folders">
            <button type="button" class="btn btn-light"><i class="bi bi-folder-fill" @click="addNewFolderClick()"></i></button>
        </h6>

        <DriveItemsGridComponent
            :isDriveFoldersGrid="true"
            :driveItems="driveFolders"
            :currentDriveFolder="currentDriveFolder"
            :editModeValueWrapper="foldersEditModeValWrppr"
            :addModeValueWrapper="foldersAddModeValWrppr"
            :enteredEditMode="enteredEditMode()"
            :exitedEditMode="exitedEditMode()">
        </DriveItemsGridComponent>

        <h6 id="files">
            <button type="button" class="btn btn-light"><i class="bi bi-file" @click="addNewFileClick()"></i></button>
        </h6>

        <DriveItemsGridComponent
            :isDriveFoldersGrid="false"
            :driveItems="driveFiles"
            :currentDriveFolder="currentDriveFolder"
            :editModeValueWrapper="filesEditModeValWrppr"
            :addModeValueWrapper="filesAddModeValWrppr">
        </DriveItemsGridComponent>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    import { IRefValue } from '../../common/core/core';
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
                driveFiles,
                foldersEditModeValWrppr: {
                    value: false
                } as IRefValue<boolean>,
                foldersAddModeValWrppr: {
                    value: false
                } as IRefValue<boolean>,
                filesEditModeValWrppr: {
                    value: false
                } as IRefValue<boolean>,
                filesAddModeValWrppr: {
                    value: false
                } as IRefValue<boolean>
            };
        },
        methods: {
            addNewFolderClick() {
                this.foldersAddModeValWrppr.value = true;
            },
            addNewFileClick() {
                this.filesAddModeValWrppr.value = true;
            },
            enteredEditMode() {
                this.foldersEditModeValWrppr.value = true;
                this.filesEditModeValWrppr.value = true;
            },
            exitedEditMode() {
                this.foldersAddModeValWrppr.value = false;
                this.filesAddModeValWrppr.value = false;
                this.foldersEditModeValWrppr.value = false;
                this.filesEditModeValWrppr.value = false;
            }
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