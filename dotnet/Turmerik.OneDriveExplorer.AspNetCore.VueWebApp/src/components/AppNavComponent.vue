<template>
    <div class="trmrk-app-nav">
        <nav class="nav">
            <router-link to="/" class="nav-link trmrk-nav-link"><i class="bi bi-house-door-fill"></i></router-link>
            <router-link to="/options" class="nav-link trmrk-nav-link"><i class="bi bi-gear-fill"></i></router-link>
            
            <a class="nav-link trmrk-nav-no-link" :href="javascriptVoid" v-if="isDriveExplorerPage"><i class="bi bi-house-door-fill"></i></a>
            <a class="nav-link trmrk-nav-no-link" :href="javascriptVoid" v-if="isUserOptionsPage"><i class="bi bi-gear-fill"></i></a>
            <a class="nav-link trmrk-nav-no-link" :href="javascriptVoid" v-if="isImagesExplorerPage"><i class="bi bi-images"></i></a>
            <a class="nav-link trmrk-nav-no-link" :href="javascriptVoid" v-if="isTextFilePage"><i class="bi bi-cursor-text"></i></a>
            <a class="nav-link trmrk-nav-no-link" :href="javascriptVoid" v-if="isVideoFilePage"><i class="bi bi-camera-video-fill"></i></a>
            <a class="nav-link trmrk-nav-no-link" :href="javascriptVoid" v-if="isAudioFilePage"><i class="bi bi-headphones"></i></a>

            <a class="nav-link trmrk-nav-link" :href="javascriptVoid" v-on:click="onLoginClick"><i class="bi bi-person-fill"></i></a>
            <button type="button" class="btn btn-dark" data-bs-toggle="collapse" data-bs-target="#appMenu"><i class="bi bi-arrow-down-up"></i></button>
        </nav>
        <div class="collapse" id="appMenu">
            <DriveExplorerAppMenuComponent v-if="isDriveExplorerPage">
            </DriveExplorerAppMenuComponent>

            <UserOptionsAppMenuComponent v-if="isUserOptionsPage">
            </UserOptionsAppMenuComponent>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    import { TrmrkBootstrapApp } from '../common/browser/bootstrap/bootstrap';
    import { routePaths } from '../appSetup/RegisterRoutes';
    import DriveExplorerAppMenuComponent from "./DriveExplorerAppMenuComponent.vue";
    import UserOptionsAppMenuComponent from "./UserOptionsAppMenuComponent.vue";

    export default defineComponent({
        inject: [
            'trmrkBootstrapApp',
            "driveExplorerService",
            "userOptionsService"],
        data() {
            const loginUrl = process.env.VUE_APP_API_BASE_URL + "/api/mvc/account/loggedIn";

            const trmrkBootstrapApp = this.trmrkBootstrapApp as any as TrmrkBootstrapApp;
            const javascriptVoid: string = trmrkBootstrapApp.browser.core.javascriptVoid;

            return {
                isDriveExplorerPage: false,
                isUserOptionsPage: false,
                isImagesExplorerPage: false,
                isImageFilePage: false,
                isTextFilePage: false,
                isVideoFilePage: false,
                isAudioFilePage: false,
                javascriptVoid: javascriptVoid,
                loginUrl: loginUrl
            };
        },
        methods: {
            onLoginClick() {
                window.open(this.loginUrl, "_blank");
            },
            resetNavLinkFlags() {
                this.isDriveExplorerPage = false;
                this.isUserOptionsPage = false;
                this.isImagesExplorerPage = false;
                this.isTextFilePage = false;
                this.isImageFilePage = false;
                this.isVideoFilePage = false;
                this.isAudioFilePage = false;
            },
            updateNavLinkFlag(routePath: string) {
                switch (routePath) {
                    case routePaths.driveExplorer:
                        this.isDriveExplorerPage = true;
                        break;
                    case routePaths.userOptions:
                        this.isUserOptionsPage = true;
                        break;
                    case routePaths.imagesExplorer:
                        this.isImagesExplorerPage = true;
                        break;
                    case routePaths.textFile:
                        this.isTextFilePage = true;
                        break;
                    case routePaths.imageFile:
                        this.isImageFilePage = true;
                        break;
                    case routePaths.videoFile:
                        this.isVideoFilePage = true;
                        break;
                    case routePaths.audioFile:
                        this.isAudioFilePage = true;
                        break;
                    default:
                        console.error("Unknown route path: " + routePath);
                        break;
                }
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
            DriveExplorerAppMenuComponent,
            UserOptionsAppMenuComponent
        }
    });
</script>

<style scoped>
    .trmrk-app-nav {
        position: fixed;
        width: 100%;
        top: 0px;
        margin-top: 0px;
        background-color: #000;
        color: #FFF;
        max-height: 50vh;
        overflow-y: scroll;
        border: 1px solid #000;
        border-radius: 1px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }

    /* width */
    .trmrk-app-nav::-webkit-scrollbar {
        width: 20px;
    }

    /* Track */
    .trmrk-app-nav::-webkit-scrollbar-track {
        background: #000;
    }
    
    /* Handle */
    .trmrk-app-nav::-webkit-scrollbar-thumb {
        background: #888;
    }

    /* Handle on hover */::-webkit-scrollbar-thumb:hover {
        background: #555;
    }

    .trmrk-nav-link.router-link-active {
        color: #FFF;
    }

    .trmrk-nav-no-link {
        color: #88F;
    }
</style>