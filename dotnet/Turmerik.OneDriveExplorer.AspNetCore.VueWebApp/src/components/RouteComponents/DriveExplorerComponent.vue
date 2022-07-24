<template>
    <div class="trmrk-app-component trmrk-drive-explorer-component">
        <div class="trmrk-drive-explorer" v-if="hasData">
            <h3>Folders</h3>
            <DriveItemsGridComponent @isDriveFoldersGrid="true" @driveItemsArr="(driveFoldersArr as any)"></DriveItemsGridComponent>
            <h3>Files</h3>
            <DriveItemsGridComponent @isDriveFoldersGrid="false" @driveItemsArr="(driveFilesArr as any)"></DriveItemsGridComponent>
        </div>

        <div v-if="isLoading" class="trmrk-component-loading">
            <h3>Loading...</h3>
        </div>

        <div v-if="!isLoading && !hasData" class="trmrk-component-error">
            <h3>{{ errorStatusStr ?? "Error" }}</h3>
            <p><span class="trmrk-err-msg">Oops! </span> {{ errorStatusText ?? errorText ?? "Something went wrong..." }}</p>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject } from 'vue';

    import { AppSettings } from '../../services/Entities/Entities';
    import { AppSettingsService } from '../../services/AppSettingsService';
    import { DriveExplorerService } from '../../services/DriveExplorerService';
    import { DriveItem } from '../../services/Entities/Entities';
    import DriveItemsGridComponent from '../NestedComponents/DriveItemsGridComponent.vue';

    interface DriveExplorerComponentData {
        isLoading: boolean;
        hasData: boolean;
        errorStatusStr: string | null;
        errorStatusText: string | null;
        errorText: string | null;
        driveFoldersArr: DriveItem[];
        driveFilesArr: DriveItem[];
    }

    export default defineComponent({
        setup() {
            const driveExplorerService = inject<DriveExplorerService>("driveExplorerService") as DriveExplorerService;
            const appSettingsService = inject<AppSettingsService>("appSettingsService") as AppSettingsService;

            return {
                driveExplorerService,
                appSettingsService
            };
        },
        data() {
            const data: DriveExplorerComponentData = {
                isLoading: false,
                hasData: false,
                errorStatusStr: null,
                errorStatusText: null,
                errorText: null,
                driveFoldersArr: [],
                driveFilesArr: []
            }

            return data;
        },
        created() {
            this.driveExplorerService.driveExplorerApi.setAppSettings(
            this.appSettingsService.appSettings as AppSettings);

            const driveFolderId = (this.$route.params["driveFolderId"] as string | null | undefined) ?? "";

            this.isLoading = true;
            this.hasData = false;

            this.driveExplorerService.loadDriveFolderAsync(driveFolderId).then(() => {
                this.hasData = this.driveExplorerService.hasData;
                this.isLoading = false;
                
                if (this.driveExplorerService.hasData) {
                    this.driveFoldersArr = this.driveExplorerService.currentDriveFolder?.subFolders as DriveItem[];
                    this.driveFilesArr = this.driveExplorerService.currentDriveFolder?.folderFiles as DriveItem[];
                } else {
                    this.driveFoldersArr = [];
                    this.driveFilesArr = [];
                }
            });
        },
        components: {
            DriveItemsGridComponent
        }
    });
</script>

<style scoped>

</style>