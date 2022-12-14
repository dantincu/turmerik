<template>
    <div class="trmrk-app-nav">
        <nav class="nav">
            <router-link to="/" class="nav-link trmrk-nav-link"><i class="bi bi-house-door-fill"></i></router-link>
            <router-link to="/explore-files" class="nav-link trmrk-nav-link"><i class="bi bi-files"></i></router-link>
            <router-link to="/options" class="nav-link trmrk-nav-link"><i class="bi bi-gear-fill"></i></router-link>
            
            <a class="nav-link trmrk-nav-no-link" :href="javascriptVoid" v-if="routes.isHomePage"><i class="bi bi-house-door-fill"></i></a>
            <a class="nav-link trmrk-nav-no-link" :href="javascriptVoid" v-if="routes.isUserOptionsPage"><i class="bi bi-gear-fill"></i></a>
            <a class="nav-link trmrk-nav-no-link" :href="javascriptVoid" v-if="routes.isDriveExplorerPage"><i class="bi bi-files"></i></a>
            <a class="nav-link trmrk-nav-no-link" :href="javascriptVoid" v-if="routes.isImagesExplorerPage"><i class="bi bi-images"></i></a>
            <a class="nav-link trmrk-nav-no-link" :href="javascriptVoid" v-if="routes.isTextFilePage"><i class="bi bi-cursor-text"></i></a>
            <a class="nav-link trmrk-nav-no-link" :href="javascriptVoid" v-if="routes.isImageFilePage"><i class="bi bi-image"></i></a>
            <a class="nav-link trmrk-nav-no-link" :href="javascriptVoid" v-if="routes.isVideoFilePage"><i class="bi bi-film"></i></a>
            <a class="nav-link trmrk-nav-no-link" :href="javascriptVoid" v-if="routes.isAudioFilePage"><i class="bi bi-file-music-fill"></i></a>
            <a class="nav-link trmrk-nav-no-link" :href="javascriptVoid" v-if="routes.isDownloadFilePage"><i class="bi bi-download"></i></a>

            <a class="nav-link trmrk-nav-link" :href="javascriptVoid" v-on:click="onLoginClick"><i class="bi bi-person-fill"></i></a>
            <button type="button" class="btn btn-dark trmrk-btn-dark" data-bs-toggle="collapse" data-bs-target="#appMenu"><i class="bi bi-arrow-down-up"></i></button>
        </nav>
        <div class="collapse" id="appMenu">
            <HomeAppMenuComponent v-if="routes.isUserOptionsPage">
            </HomeAppMenuComponent>

            <UserOptionsAppMenuComponent v-if="routes.isUserOptionsPage">
            </UserOptionsAppMenuComponent>

            <DriveExplorerAppMenuComponent v-if="routes.isDriveExplorerPage"
                :currentDriveFolder="currentDriveFolder"
                @reloadCurrentDriveFolder="onReloadCurrentDriveFolder()">
            </DriveExplorerAppMenuComponent>

            <ImagesExplorerAppMenuComponent v-if="routes.isImagesExplorerPage">
            </ImagesExplorerAppMenuComponent>

            <ImageFileAppMenuComponent v-if="routes.isImageFilePage">
            </ImageFileAppMenuComponent>

            <VideoFileAppMenuComponent v-if="routes.isVideoFilePage">
            </VideoFileAppMenuComponent>

            <AudioFileAppMenuComponent v-if="routes.isAudioFilePage">
            </AudioFileAppMenuComponent>

            <TextFileAppMenuComponent v-if="routes.isTextFilePage">
            </TextFileAppMenuComponent>

            <DownloadFileAppMenuComponent v-if="routes.isDownloadFilePage">
            </DownloadFileAppMenuComponent>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    import { Trmrk } from '../common/core/core';
    import { IPageRoutes } from '../services/Entities/PageRoutes';

    import HomeAppMenuComponent from "./AppMenuComponents/HomeAppMenuComponent.vue";
    import UserOptionsAppMenuComponent from "./AppMenuComponents/UserOptionsAppMenuComponent.vue";
    import DriveExplorerAppMenuComponent from "./AppMenuComponents/DriveExplorerAppMenuComponent.vue";
    import ImagesExplorerAppMenuComponent from "./AppMenuComponents/ImagesExplorerAppMenuComponent.vue";
    import ImageFileAppMenuComponent from "./AppMenuComponents/ImageFileAppMenuComponent.vue";
    import VideoFileAppMenuComponent from "./AppMenuComponents/VideoFileAppMenuComponent.vue";
    import AudioFileAppMenuComponent from "./AppMenuComponents/AudioFileAppMenuComponent.vue";
    import TextFileAppMenuComponent from "./AppMenuComponents/TextFileAppMenuComponent.vue";
    import DownloadFileAppMenuComponent from "./AppMenuComponents/DownloadFileAppMenuComponent.vue";
    
    const loginUrl = process.env.VUE_APP_API_BASE_URL + "/api/mvc/account/loggedIn";

    export default defineComponent({
        props: [
            "pageRoutes",
            "currentDriveFolder"
        ],
        emits: [ "appMenuExpanded", "appMenuCollapsed", "reloadCurrentDriveFolder" ],
        data() {
            const javascriptVoid: string = Trmrk.javascriptVoid;
            const pageRoutes = this.$props.pageRoutes as IPageRoutes;

            return {
                javascriptVoid: javascriptVoid,
                loginUrl: loginUrl,
                routes: pageRoutes
            };
        },
        methods: {
            onLoginClick() {
                window.open(this.loginUrl, "_blank");
            },
            onReloadCurrentDriveFolder() {
                this.$emit("reloadCurrentDriveFolder");
            },
        },
        mounted() {
            const appMenuDomEl = document.getElementById("appMenu") as HTMLElement;
            
            appMenuDomEl.addEventListener("shown.bs.collapse", () => {
                this.$emit("appMenuExpanded");
            });

            appMenuDomEl.addEventListener("hidden.bs.collapse", () => {
                this.$emit("appMenuCollapsed");
            });
        },
        components: {
            HomeAppMenuComponent,
            UserOptionsAppMenuComponent,
            DriveExplorerAppMenuComponent,
            ImagesExplorerAppMenuComponent,
            ImageFileAppMenuComponent,
            VideoFileAppMenuComponent,
            AudioFileAppMenuComponent,
            TextFileAppMenuComponent,
            DownloadFileAppMenuComponent
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
        z-index: 1055;
    }

    #appMenu {
        width: 100%;
        align-items: center;
        text-align: center;
        z-index: 1055;
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

    .nav-link.trmrk-nav-no-link, .nav-link.trmrk-nav-no-link:active, .nav-link.trmrk-nav-no-link:hover {
        color: #FB8;
    }

    .trmrk-btn-dark {
        color: #CCC;
    }
</style>

<style>
    .trmrk-app-nav .modal {
        color: #000;
    }
</style>