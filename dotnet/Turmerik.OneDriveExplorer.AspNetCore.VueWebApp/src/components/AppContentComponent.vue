<template>
    <div class="container-xxl trmrk-app-content">
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    /* import DriveExplorerComponent from "./RouteComponents/DriveExplorerComponent.vue";
    import UserOptionsComponent from "./RouteComponents/UserOptionsComponent.vue";
    import ImagesExplorerComponent from "./RouteComponents/ImagesExplorerComponent.vue";
    import ImageFileComponent from "./RouteComponents/ImageFileComponent.vue";
    import VideoFileComponent from "./RouteComponents/VideoFileComponent.vue";
    import AudioFileComponent from "./RouteComponents/AudioFileComponent.vue";
    import TextFileComponent from "./RouteComponents/TextFileComponent.vue"; */

    export default defineComponent({
        data() {
            return ({
            });
        },
        created() {
        },
        components: {
            /* DriveExplorerComponent,
            UserOptionsComponent,
            ImagesExplorerComponent,
            ImageFileComponent,
            VideoFileComponent,
            AudioFileComponent,
            TextFileComponent, */
        }
    });
</script>

<style scoped>
</style>