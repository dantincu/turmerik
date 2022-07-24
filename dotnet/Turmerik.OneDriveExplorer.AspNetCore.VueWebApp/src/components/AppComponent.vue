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
    import { AppSettingsService } from '../services/AppSettingsService';

    import AppContentComponent from './AppContentComponent.vue';
    import AppNavComponent from './AppNavComponent.vue';

    interface Data {
        loading: boolean,
        appSettings: null | string
        status: null | number;
        statusText: null | string;
        error: null | any;
        pageRoutes: IPageRoutes
    }

    export default defineComponent({
        setup() {
            const appSettingsService = inject<AppSettingsService>("appSettingsService") as AppSettingsService;

            return {
                appSettingsService
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
                try {
                    const response = await fetch("api/explorer/getAppSettings");
                    if (response.ok) {
                        const appSettings = await response.json();
                        this.appSettings = appSettings;

                        this.appSettingsService.appSettings = appSettings;
                        this.loading = false;
                    }
                    else {
                        this.status = response.status;
                        this.statusText = response.statusText;
                    }
                }
                catch (reason) {
                    this.error = reason;
                    this.loading = false;
                }
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