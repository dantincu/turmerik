<template>
    <AppNavComponent :pageRoutes="pageRoutes" />

    <main class="trmrk-app-container">
        <div v-if="loading" class="trmrk-app-loading">
            <h3>Loading...</h3>
        </div>

        <AppContentComponent v-else-if="appSettings" :pageRoutes="pageRoutes" />

        <div v-else class="trmrk-app-error container-xxl">
            <h3>{{ status ?? "Error" }}</h3>
            <p><span class="trmrk-err-msg">Oops! </span> {{ statusText ?? error ?? "Something went wrong..." }}</p>
        </div>
    </main>
</template>

<style scoped>
    .trmrk-app-container {
        margin-top: 60px;
    }

    .trmrk-app-error .trmrk-err-msg {
        color: red;
    }
</style>

<script lang="ts">
    import { defineComponent, inject } from 'vue';
    
    import { routePaths } from '../appSetup/RegisterRoutes';
    import { IPageRoutes } from '../services/Entities/PageRoutes';
    import { TrmrkAxiosApiResult } from '../common/axios/trmrkAxios';
    import { AppSettings } from '../services/Entities/Entities';
    import { AppSettingsService } from '../services/AppSettingsService';
    import { DriveExplorerService } from '../services/DriveExplorerService';

    import AppContentComponent from './AppContentComponent.vue';
    import AppNavComponent from './AppNavComponent.vue';

    interface Data {
        loading: boolean,
        appSettings: null | AppSettings
        status: null | number | string;
        statusText: null | string;
        error: null | any;
        pageRoutes: IPageRoutes
    }

    export default defineComponent({
        setup() {
            const appSettingsService = inject<AppSettingsService>("appSettingsService") as AppSettingsService;
            const driveExplorerService = inject<DriveExplorerService>("driveExplorerService") as DriveExplorerService;

            return {
                appSettingsService,
                driveExplorerService
            }
        },
        data(): Data {
            return {
                loading: false,
                appSettings: null,
                status: null,
                statusText: null,
                error: null,
                pageRoutes: {
                    isHomePage: false,
                    isUserOptionsPage: false,
                    isDriveExplorerPage: false,
                    isImagesExplorerPage: false,
                    isTextFilePage: false,
                    isImageFilePage: false,
                    isVideoFilePage: false,
                    isAudioFilePage: false,
                }
            };
        },
        methods: {
            async fetchData() {
                this.appSettings = null;
                this.loading = true;

                this.appSettingsService.getAppSettingsAsync().then((apiReponse: TrmrkAxiosApiResult<AppSettings>) => {
                    if (apiReponse.isSuccess) {
                        this.driveExplorerService.driveExplorerApi.setAppSettings(apiReponse.data as AppSettings);
                        this.appSettings = apiReponse.data;
                        this.loading = false;
                    } else {
                        this.status = apiReponse.getStatusStr() as string;
                        this.statusText = apiReponse.getStatusText() as string;
                    }
                }, (reason: any) => {
                    this.error = reason;
                    this.loading = false;
                });
            },
            resetNavLinkFlags() {
                this.pageRoutes.isHomePage = false;
                this.pageRoutes.isDriveExplorerPage = false;
                this.pageRoutes.isUserOptionsPage = false;
                this.pageRoutes.isImagesExplorerPage = false;
                this.pageRoutes.isTextFilePage = false;
                this.pageRoutes.isImageFilePage = false;
                this.pageRoutes.isVideoFilePage = false;
                this.pageRoutes.isAudioFilePage = false;
            },
            updateNavLinkFlag(routePath: string) {
                if (routePath.startsWith(routePaths.userOptions)) {
                    this.pageRoutes.isUserOptionsPage = true;
                } else if (routePath.startsWith(routePaths.driveExplorer)) {
                    this.pageRoutes.isDriveExplorerPage = true;
                } else if (routePath.startsWith(routePaths.imagesExplorer)) {
                    this.pageRoutes.isImagesExplorerPage = true;
                } else if (routePath.startsWith(routePaths.imageFile)) {
                    this.pageRoutes.isImageFilePage = true;
                } else if (routePath.startsWith(routePaths.videoFile)) {
                    this.pageRoutes.isVideoFilePage = true;
                } else if (routePath.startsWith(routePaths.audioFile)) {
                    this.pageRoutes.isAudioFilePage = true;
                } else if (routePath.startsWith(routePaths.textFile)) {
                    this.pageRoutes.isTextFilePage = true;
                } else if (routePath.startsWith(routePaths.home)) {
                    this.pageRoutes.isHomePage = true;
                } else {
                    console.error("Unknown route path: " + routePath);
                }
            },
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
            
            // fetch the data when the view is created and the data is
            // already being observed
            this.fetchData();
        },
        components: {
            AppContentComponent,
            AppNavComponent
        }
    });
</script>