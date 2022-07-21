<template>
    <div class="trmrk-app-nav">
        <nav class="nav">
            <router-link to="/" :class="homePageRouterLinkCssClass"><i class="bi bi-house-door-fill"></i></router-link>
            <router-link to="/options" :class="userOptionsRouterLinkCssClass"><i class="bi bi-gear-fill"></i></router-link>
            
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
    import { defineComponent, watch } from 'vue';
    import { useRoute } from 'vue-router'

    import { TrmrkBootstrapApp } from '../common/browser/bootstrap/bootstrap';
    import { routePaths } from '../routes';
    import DriveExplorerAppMenuComponent from "./DriveExplorerAppMenuComponent.vue";
    import UserOptionsAppMenuComponent from "./UserOptionsAppMenuComponent.vue";

    const routerLinkCssClassesArr = ["nav-link", "trmrk-nav-link"];
    const currentRouterLinkCssClassesArr = [...routerLinkCssClassesArr, "active"];

    const routerLinkCssClass = routerLinkCssClassesArr.join(" ");
    const currentRouterLinkCssClass = currentRouterLinkCssClassesArr.join(" ");

    const getRouterLinkCssClass = (isCurrent: boolean) => isCurrent ? currentRouterLinkCssClass : routerLinkCssClass;

    export default defineComponent({
        inject: [
            'trmrkBootstrapApp',
            "driveExplorerService",
            "userOptionsService"],
        data() {
            const loginUrl = process.env.VUE_APP_API_BASE_URL + "/api/mvc/account/loggedIn";
            const route = useRoute();
            // fetch the user information when params change
            
            let isDriveExplorerPage = false;
            let isUserOptionsPage = false;
            let isImagesExplorerPage = false;
            let isTextFilePage = false;
            let isImageFilePage = false;
            let isVideoFilePage = false;
            let isAudioFilePage = false;

            watch(
                () => route.path,
                async newPath => {
                    switch (newPath) {
                        case routePaths.driveExplorer:
                            isDriveExplorerPage = true;
                            break;
                        case routePaths.userOptions:
                            isUserOptionsPage = true;
                            break;
                        case routePaths.imagesExplorer:
                            isImagesExplorerPage = true;
                            break;
                        case routePaths.textFile:
                            isTextFilePage = true;
                            break;
                        case routePaths.imageFile:
                            isImageFilePage = true;
                            break;
                        case routePaths.videoFile:
                            isVideoFilePage = true;
                            break;
                        case routePaths.audioFile:
                            isAudioFilePage = true;
                            break;
                        default:
                            console.error("Unknown route path: " + newPath);
                            break;
                    }
                }
            )

            const trmrkBootstrapApp = this.trmrkBootstrapApp as any as TrmrkBootstrapApp;
            const javascriptVoid: string = trmrkBootstrapApp.browser.core.javascriptVoid;

            const homePageRouterLinkCssClass = getRouterLinkCssClass(isDriveExplorerPage);
            const userOptionsRouterLinkCssClass = getRouterLinkCssClass(isUserOptionsPage);

            return {
                isDriveExplorerPage: isDriveExplorerPage,
                isUserOptionsPage: isUserOptionsPage,
                isImagesExplorerPage: isImagesExplorerPage,
                isImageFilePage: isImageFilePage,
                isTextFilePage: isTextFilePage,
                isVideoFilePage: isVideoFilePage,
                isAudioFilePage: isAudioFilePage,
                javascriptVoid: javascriptVoid,
                loginUrl: loginUrl,
                homePageRouterLinkCssClass: homePageRouterLinkCssClass,
                userOptionsRouterLinkCssClass: userOptionsRouterLinkCssClass
            };
        },
        methods: {
            onLoginClick() {
                window.open(this.loginUrl, "_blank");
            }
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
</style>