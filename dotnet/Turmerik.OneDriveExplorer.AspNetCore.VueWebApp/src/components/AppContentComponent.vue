<template>
    <div class="trmrk-app-content container-xxl">
        <HomeComponent v-if="routes.isHomePage">
        </HomeComponent>

        <UserOptionsComponent v-if="routes.isUserOptionsPage">
        </UserOptionsComponent>

        <DriveExplorerComponent v-if="routes.isDriveExplorerPage" :key="driveFolderId" :driveFolderId="driveFolderId">
        </DriveExplorerComponent>

        <ImagesExplorerComponent v-if="routes.isImagesExplorerPage">
        </ImagesExplorerComponent>

        <ImageFileComponent v-if="routes.isImageFilePage">
        </ImageFileComponent>

        <VideoFileComponent v-if="routes.isVideoFilePage">
        </VideoFileComponent>

        <AudioFileComponent v-if="routes.isAudioFilePage">
        </AudioFileComponent>

        <TextFileComponent v-if="routes.isTextFilePage">
        </TextFileComponent>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    import { IPageRoutes } from '../services/Entities/PageRoutes';

    import HomeComponent from "./RouteComponents/HomeComponent.vue";
    import UserOptionsComponent from "./RouteComponents/UserOptionsComponent.vue";
    import DriveExplorerComponent from "./RouteComponents/DriveExplorerComponent.vue";
    import ImagesExplorerComponent from "./RouteComponents/ImagesExplorerComponent.vue";
    import ImageFileComponent from "./RouteComponents/ImageFileComponent.vue";
    import VideoFileComponent from "./RouteComponents/VideoFileComponent.vue";
    import AudioFileComponent from "./RouteComponents/AudioFileComponent.vue";
    import TextFileComponent from "./RouteComponents/TextFileComponent.vue";
import { RouteParams } from 'vue-router';

    export default defineComponent({
        props: [
            "props"
        ],
        data() {
            const pageRoutes = this.$props.props.pageRoutes as IPageRoutes;

            return ({
                routes: pageRoutes,
                driveFolderId: (this.$route.params["driveFolderId"] as string | null | undefined) ?? ""
            });
        },
        created() {
            this.$watch(() => this.$route.params,
                (params: RouteParams) => {
                     this.driveFolderId = (params["driveFolderId"] as string | null | undefined) ?? "";
                });
        },
        components: {
            HomeComponent,
            UserOptionsComponent,
            DriveExplorerComponent,
            ImagesExplorerComponent,
            ImageFileComponent,
            VideoFileComponent,
            AudioFileComponent,
            TextFileComponent,
        }
    });
</script>

<style>
    .trmrk-app-content {
        margin-top: 60px;
    }
</style>