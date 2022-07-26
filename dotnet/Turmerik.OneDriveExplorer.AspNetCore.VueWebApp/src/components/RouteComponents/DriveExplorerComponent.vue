<template>
    <div class="trmrk-app-component trmrk-drive-explorer-component">
        <ApiGetCallComponent
            :childComponent="DriveExplorerContentComponent"
            :apiCallFunc="loadDriveFolderAsync"
            :apiSuccessCallback="driveFolderLoaded"
            ></ApiGetCallComponent>
    </div>
</template>

<script lang="ts">
    import { inject, defineComponent } from 'vue';

    import { DriveItem } from '@/services/Entities/Entities';
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
            driveFolderLoaded(currentDriveFolder: DriveItem) {
                this.$emit("loaded", currentDriveFolder);
            }
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