<template>
    <AppNavComponent :pageRoutes="pageRoutes" />

    <main class="trmrk-app-container">
        <div v-if="loading" class="trmrk-app-loading">
            <h3>Loading...</h3>
        </div>

        <AppContentComponent v-else-if="email" :pageRoutes="pageRoutes" />

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
    import { defineComponent } from 'vue';
    
    import { routePaths } from '../appSetup/RegisterRoutes';
    import { IPageRoutes } from '@/services/Entities/PageRoutes';

    import AppContentComponent from './AppContentComponent.vue';
    import AppNavComponent from './AppNavComponent.vue';

    interface Data {
        loading: boolean,
        email: null | string
        status: null | number;
        statusText: null | string;
        error: null | any;
        pageRoutes: IPageRoutes
    }

    export default defineComponent({
        data(): Data {
            return {
                loading: false,
                email: null,
                status: null,
                statusText: null,
                error: null,
                pageRoutes: {
                    isDriveExplorerPage: false,
                    isUserOptionsPage: false,
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
                this.email = null;
                this.loading = true;
                try {
                    const response = await fetch("api/mvc/account/getEmail");
                    if (response.ok) {
                        const text = await response.text();
                        this.email = text;
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
                this.pageRoutes.isDriveExplorerPage = false;
                this.pageRoutes.isUserOptionsPage = false;
                this.pageRoutes.isImagesExplorerPage = false;
                this.pageRoutes.isTextFilePage = false;
                this.pageRoutes.isImageFilePage = false;
                this.pageRoutes.isVideoFilePage = false;
                this.pageRoutes.isAudioFilePage = false;
            },
            updateNavLinkFlag(routePath: string) {
                switch (routePath) {
                    case routePaths.driveExplorer:
                        this.pageRoutes.isDriveExplorerPage = true;
                        break;
                    case routePaths.userOptions:
                        this.pageRoutes.isUserOptionsPage = true;
                        break;
                    case routePaths.imagesExplorer:
                        this.pageRoutes.isImagesExplorerPage = true;
                        break;
                    case routePaths.imageFile:
                        this.pageRoutes.isImageFilePage = true;
                        break;
                    case routePaths.videoFile:
                        this.pageRoutes.isVideoFilePage = true;
                        break;
                    case routePaths.audioFile:
                        this.pageRoutes.isAudioFilePage = true;
                        break;
                    case routePaths.textFile:
                        this.pageRoutes.isTextFilePage = true;
                        break;
                    default:
                        console.error("Unknown route path: " + routePath);
                        break;
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