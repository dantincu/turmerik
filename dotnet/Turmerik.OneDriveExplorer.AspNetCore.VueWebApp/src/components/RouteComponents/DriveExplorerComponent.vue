<template>
    <div class="trmrk-app-component trmrk-drive-explorer-component">
        <div class="trmrk-drive-explorer" v-if="hasData">
            <h3>Folders</h3>
            <DriveItemsGridComponent @isDriveFoldersGrid="true" @driveItemsArr="driveFoldersArr"></DriveItemsGridComponent>
            <h3>Files</h3>
            <DriveItemsGridComponent @isDriveFoldersGrid="false" @driveItemsArr="driveFilesArr"></DriveItemsGridComponent>
        </div>

        <div v-if="isLoading" class="trmrk-component-loading">
            <h3>Loading...</h3>
        </div>

        <div v-id="errApiRespose" class="trmrk-component-error">
            <h3>{{ errorStatusStr ?? "Error" }}</h3>
            <p><span class="trmrk-err-msg">Oops! </span> {{ errorStatusText ?? errorText ?? "Something went wrong..." }}</p>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    import { TrmrkAxiosApiResult } from '../../common/axios/trmrkAxios';
    // import { DriveExplorerService } from '../../services/DriveExplorerService';
    import { DriveItem } from '../../services/Entities/Entities';
    import DriveItemsGridComponent from '../NestedComponents/DriveItemsGridComponent.vue';

    export default defineComponent({
        inject: [
            'trmrkBootStrapApp',
            "driveExplorerService"],
        data() {
            const isLoading = true;
            let errApiRespose: TrmrkAxiosApiResult<DriveItem> | null = null;
            const hasData = false;

            let errorStatusStr: string | null = null;
            let errorStatusText: string | null = null;
            let errorText: string | null = null;

            if (this.errApiRespose) {
                errApiRespose = this.errApiRespose as any as TrmrkAxiosApiResult<DriveItem>;
                errorStatusStr = errApiRespose.getStatusStr() as string;
                errorStatusText = errApiRespose.getStatusText() as string;

                if (errApiRespose.exc) {
                    errorText = JSON.stringify(errApiRespose.exc);
                }
            }

            const driveFilesArr: DriveItem[] = [];
            const driveFoldersArr: DriveItem[] = [];

            return {
                isLoading: isLoading,
                errApiRespose: errApiRespose,
                hasData: hasData,
                errorStatusStr: errorStatusStr,
                errorStatusText: errorStatusText,
                errorText: errorText,
                driveFoldersArr: driveFoldersArr as any,
                driveFilesArr: driveFilesArr as any
            };
        },
        created() {
        },
        components: {
            DriveItemsGridComponent
        }
    });
</script>

<style scoped>

</style>