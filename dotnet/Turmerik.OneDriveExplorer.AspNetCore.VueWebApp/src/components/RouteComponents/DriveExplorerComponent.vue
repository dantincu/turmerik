<template>
    <div class="trmrk-app-component trmrk-drive-explorer-component">
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    import { Trmrk } from '../../common/core/core';

    export default defineComponent({
        inject: [
            "driveExplorerService"],
        data() {
            const javascriptVoid: string = Trmrk.javascriptVoid;

            return {
                javascriptVoid: javascriptVoid,
            };
        },
        created() {
        }
    });
</script>

<style scoped>

</style>