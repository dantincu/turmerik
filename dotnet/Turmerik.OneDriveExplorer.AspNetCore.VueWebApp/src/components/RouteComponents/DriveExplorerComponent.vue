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

    import { TrmrkAxiosApiResult } from '../../common/axios/trmrkAxios';
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
        methods: {
            applyError(apiResponse: TrmrkAxiosApiResult | null, reason: any | null = null) {
                apiResponse = apiResponse ?? new TrmrkAxiosApiResult({
                    isSuccess: false,
                    exc: reason ?? "Error"
                });

                this.hasData = false;
                this.isLoading = false;

                this.errorStatusStr = apiResponse.getStatusStr() as string;
                this.errorStatusText = apiResponse.getStatusText() as string;
                this.errorText = JSON.stringify(apiResponse.exc ?? "Error");
                
                this.driveFoldersArr = [];
                this.driveFilesArr = [];
            }
        },
        created() {
            this.isLoading = true;
            this.hasData = false;

            this.appSettingsService.getAppSettingsAsync().then(
                (appSettings: TrmrkAxiosApiResult<AppSettings>) => {
                    if (appSettings.isSuccess) {
                        this.driveExplorerService.driveExplorerApi.setAppSettings(appSettings.data as AppSettings);
                        const driveFolderId = (this.$route.params["driveFolderId"] as string | null | undefined) ?? "";

                        this.driveExplorerService.loadDriveFolderAsync(driveFolderId).then((apiResponse: TrmrkAxiosApiResult) => {
                            this.isLoading = false;
                     
                            if (this.driveExplorerService.hasData) {
                                this.driveFoldersArr = this.driveExplorerService.currentDriveFolder?.subFolders as DriveItem[];
                                this.driveFilesArr = this.driveExplorerService.currentDriveFolder?.folderFiles as DriveItem[];
                                this.hasData = true;
                            } else {
                                this.applyError(apiResponse);
                            }
                        });
                    } else {
                        this.applyError(appSettings);
                    }
                },
                (reason: any) => {
                    this.applyError(null, reason);
                }
            );
            
            
        },
        components: {
            DriveItemsGridComponent
        }
    });
</script>

<style scoped>

</style>