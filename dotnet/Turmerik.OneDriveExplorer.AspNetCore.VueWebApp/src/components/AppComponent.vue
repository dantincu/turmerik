<template>
    <AppNavComponent
        :pageRoutes="nestedProps.pageRoutes"
        :currentDriveFolder="currentDriveFolder" />

    <main class="trmrk-app-container">
        <ApiGetCallComponent
            :childComponent="AppContentComponent"
            :apiCallFunc="getAppSettingsAsync"
            :apiSuccessCallback="onAppSettingsSuccess"
            :childProps="nestedProps"
            :errorCssClass="'trmrk-app-error container-xxl'"
            :loadingCssClass="'trmrk-app-loading container-xxl'"
            @upstreamEvent="upstreamEventHandler"></ApiGetCallComponent>
    </main>
</template>

<script lang="ts">
    import { defineComponent, inject } from 'vue';
    
    import { routePaths } from '../appSetup/RegisterRoutes';
    import { IPageRoutes } from '../services/Entities/PageRoutes';
    import { TrmrkAxiosApiResult } from '../common/axios/trmrkAxios';
    import { AppSettings } from '../services/Entities/Entities';
    import { AppSettingsService } from '../services/AppSettingsService';
    import { DriveExplorerService } from '../services/DriveExplorerService';
    import ApiGetCallComponent from './ApiGetCallComponent.vue';

    import AppContentComponent from './AppContentComponent.vue';
    import AppNavComponent from './AppNavComponent.vue';
    import { DriveItem } from '../services/Entities/Entities';

    interface Data {
        loading: boolean,
        appSettings: null | AppSettings
        status: null | number | string;
        statusText: null | string;
        error: null | any;
        nestedProps: {
            pageRoutes: IPageRoutes
        },
        currentDriveFolder: DriveItem | null
    }

    export default defineComponent({
        setup() {
            const appSettingsService = inject<AppSettingsService>("appSettingsService") as AppSettingsService;
            const driveExplorerService = inject<DriveExplorerService>("driveExplorerService") as DriveExplorerService;

            return {
                appSettingsService,
                driveExplorerService,
                AppContentComponent,
            }
        },
        data(): Data {
            return {
                loading: false,
                appSettings: null,
                status: null,
                statusText: null,
                error: null,
                nestedProps: {
                    pageRoutes: {
                        isHomePage: false,
                        isUserOptionsPage: false,
                        isDriveExplorerPage: false,
                        isImagesExplorerPage: false,
                        isTextFilePage: false,
                        isImageFilePage: false,
                        isVideoFilePage: false,
                        isAudioFilePage: false,
                        isDownloadFilePage: false,
                    }
                },
                currentDriveFolder: null
            };
        },
        methods: {
            async getAppSettingsAsync() {
                const apiResponse = await this.appSettingsService.getAppSettingsAsync();
                return apiResponse;
            },
            onAppSettingsSuccess(apiReponse: TrmrkAxiosApiResult<AppSettings>) {
                this.driveExplorerService.driveExplorerApi.setAppSettings(apiReponse.data as AppSettings);
            },
            resetNavLinkFlags() {
                this.nestedProps.pageRoutes.isHomePage = false;
                this.nestedProps.pageRoutes.isDriveExplorerPage = false;
                this.nestedProps.pageRoutes.isUserOptionsPage = false;
                this.nestedProps.pageRoutes.isImagesExplorerPage = false;
                this.nestedProps.pageRoutes.isTextFilePage = false;
                this.nestedProps.pageRoutes.isImageFilePage = false;
                this.nestedProps.pageRoutes.isVideoFilePage = false;
                this.nestedProps.pageRoutes.isAudioFilePage = false;
                this.nestedProps.pageRoutes.isDownloadFilePage = false;
            },
            updateNavLinkFlag(routePath: string) {
                if (routePath.startsWith(routePaths.userOptions)) {
                    this.nestedProps.pageRoutes.isUserOptionsPage = true;
                } else if (routePath.startsWith(routePaths.driveExplorer)) {
                    this.nestedProps.pageRoutes.isDriveExplorerPage = true;
                } else if (routePath.startsWith(routePaths.imagesExplorer)) {
                    this.nestedProps.pageRoutes.isImagesExplorerPage = true;
                } else if (routePath.startsWith(routePaths.imageFile)) {
                    this.nestedProps.pageRoutes.isImageFilePage = true;
                } else if (routePath.startsWith(routePaths.videoFile)) {
                    this.nestedProps.pageRoutes.isVideoFilePage = true;
                } else if (routePath.startsWith(routePaths.audioFile)) {
                    this.nestedProps.pageRoutes.isAudioFilePage = true;
                } else if (routePath.startsWith(routePaths.textFile)) {
                    this.nestedProps.pageRoutes.isTextFilePage = true;
                } else if (routePath.startsWith(routePaths.downloadFile)) {
                    this.nestedProps.pageRoutes.isDownloadFilePage = true;
                } else if (routePath.startsWith(routePaths.home)) {
                    this.nestedProps.pageRoutes.isHomePage = true;
                } else {
                    console.error("Unknown route path: " + routePath);
                }
            },
            upstreamEventHandler(source: string, type: string, payload: any) {
                if (source === "DriveExplorer") {
                    this.driveExplorerEventHandler(type, payload);
                }
            },
            driveExplorerEventHandler(type: string, payload: any) {
                if (type === "currentDriveFolderLoaded") {
                    this.currentDriveFolderLoaded(payload.data);
                }
            },
            currentDriveFolderLoaded(currentDriveFolder: DriveItem) {
                this.currentDriveFolder = currentDriveFolder;
            }
        },
        created() {
            // watch the params of the route to fetch the data again
            this.$watch(
                () => this.$route.path,
                (newPath: string) => {
                    this.resetNavLinkFlags();
                    this.updateNavLinkFlag(newPath);
                },
                // fetch the data when the view is created and the data is
                // already being observed
                { immediate: true }
            )
        },
        components: {
            ApiGetCallComponent,
            // eslint-disable-next-line vue/no-unused-components
            AppContentComponent,
            AppNavComponent
        }
    });
</script>

<style>
    .trmrk-app-error, .trmrk-app-loading {
        margin-top: 60px;
    }
</style>