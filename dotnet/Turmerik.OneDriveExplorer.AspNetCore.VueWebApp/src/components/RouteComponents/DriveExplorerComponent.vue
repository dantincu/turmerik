<template>
    <div class="trmrk-app-component trmrk-drive-explorer-component">
        <ApiGetCallComponent
            :childComponent="DriveExplorerContentComponent"
            :apiCallFunc="loadDriveFolderAsync"
            ></ApiGetCallComponent>
    </div>
</template>

<script lang="ts">
    import { inject, defineComponent } from 'vue';

    import { DriveExplorerService } from '../../services/DriveExplorerService';
    import ApiGetCallComponent from '../ApiGetCallComponent.vue';
    import DriveExplorerContentComponent from '../NestedComponents/DriveExplorerContentComponent.vue';

    export default defineComponent({
        props: [ "driveFolderId" ],
        setup() {
            const driveExplorerService = inject<DriveExplorerService>("driveExplorerService") as DriveExplorerService;
            
            return {
                driveExplorerService,
                DriveExplorerContentComponent,
            };
        },
        methods: {
            async loadDriveFolderAsync() {
                const driveFolderId = this.$props.driveFolderId as string;
                const apiResponse = await this.driveExplorerService.loadDriveFolderAsync(driveFolderId);

                return apiResponse;
            },
        },
        components: {
            ApiGetCallComponent,
            // eslint-disable-next-line vue/no-unused-components
            DriveExplorerContentComponent
        }
    });
</script>

<style scoped>

</style>