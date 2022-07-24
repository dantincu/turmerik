<template>
    <div class="trmrk-app-nav">
        <nav class="nav">
            <router-link to="/" class="nav-link trmrk-nav-link"><i class="bi bi-house-door-fill"></i></router-link>
            <router-link to="/files" class="nav-link trmrk-nav-link"><i class="bi bi-files"></i></router-link>
            <router-link to="/options" class="nav-link trmrk-nav-link"><i class="bi bi-gear-fill"></i></router-link>
            
            <a class="nav-link trmrk-nav-no-link" :href="javascriptVoid" v-if="routes.isHomePage"><i class="bi bi-house-door-fill"></i></a>
            <a class="nav-link trmrk-nav-no-link" :href="javascriptVoid" v-if="routes.isUserOptionsPage"><i class="bi bi-gear-fill"></i></a>
            <a class="nav-link trmrk-nav-no-link" :href="javascriptVoid" v-if="routes.isDriveExplorerPage"><i class="bi bi-files"></i></a>
            <a class="nav-link trmrk-nav-no-link" :href="javascriptVoid" v-if="routes.isImagesExplorerPage"><i class="bi bi-images"></i></a>
            <a class="nav-link trmrk-nav-no-link" :href="javascriptVoid" v-if="routes.isTextFilePage"><i class="bi bi-cursor-text"></i></a>
            <a class="nav-link trmrk-nav-no-link" :href="javascriptVoid" v-if="routes.isImageFilePage"><i class="bi bi-image"></i></a>
            <a class="nav-link trmrk-nav-no-link" :href="javascriptVoid" v-if="routes.isVideoFilePage"><i class="bi bi-film"></i></a>
            <a class="nav-link trmrk-nav-no-link" :href="javascriptVoid" v-if="routes.isAudioFilePage"><i class="bi bi-file-music-fill"></i></a>

            <a class="nav-link trmrk-nav-link" :href="javascriptVoid" v-on:click="onLoginClick"><i class="bi bi-person-fill"></i></a>
            <button type="button" class="btn btn-dark" data-bs-toggle="collapse" data-bs-target="#appMenu"><i class="bi bi-arrow-down-up"></i></button>
        </nav>
        <div class="collapse" id="appMenu">
            <HomeAppMenuComponent v-if="routes.isUserOptionsPage">
            </HomeAppMenuComponent>

            <UserOptionsAppMenuComponent v-if="routes.isUserOptionsPage">
            </UserOptionsAppMenuComponent>

            <DriveExplorerAppMenuComponent v-if="routes.isDriveExplorerPage">
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
    
    const loginUrl = process.env.VUE_APP_API_BASE_URL + "/api/mvc/account/loggedIn";

    export default defineComponent({
        props: [
            "pageRoutes"
        ],
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

    .nav-link.trmrk-nav-no-link, .nav-link.trmrk-nav-no-link:active, .nav-link.trmrk-nav-no-link:hover {
        color: #FB8;
    }
</style>