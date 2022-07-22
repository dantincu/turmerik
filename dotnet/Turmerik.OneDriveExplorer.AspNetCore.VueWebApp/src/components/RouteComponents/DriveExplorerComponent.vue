<template>
    <div class="trmrk-app-component trmrk-drive-explorer-component">
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    import { TrmrkBootstrapApp } from '../../common/browser/bootstrap/bootstrap';

    export default defineComponent({
        inject: [
            'trmrkBootStrapApp',
            "driveExplorerService"],
        data() {
            const trmrkBootStrapApp = this.trmrkBootStrapApp as any as TrmrkBootstrapApp;
            const javascriptVoid: string = trmrkBootStrapApp.browser.core.javascriptVoid;

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