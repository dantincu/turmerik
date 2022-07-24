<template>
    <div class="trmrk-app-menu trmrk-drive-explorer-app-menu">
        {{driveFolderName}}
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject } from 'vue';

    import { DriveExplorerService } from '../../services/DriveExplorerService';
    import { DriveItem } from '../../services/Entities/Entities';

    interface DriveExplorerAppMenuComponentData {
        driveFolderName: string;
    }

    export default defineComponent({
        setup() {
            const driveExplorerService = inject<DriveExplorerService>("driveExplorerService");

            return {
                driveExplorerService,
            };
        },
        data() {
            const data: DriveExplorerAppMenuComponentData = {
                driveFolderName: "",
            };

            return data;
        },
        created() {
            const driveExplorerService = this.driveExplorerService as DriveExplorerService;
            
            this.$watch(
                () => driveExplorerService.currentDriveFolder,
                (currentDriveFolder: DriveItem) => {
                    this.driveFolderName = currentDriveFolder?.name ?? "";
                });
        }
    });
</script>

<style scoped>

</style>