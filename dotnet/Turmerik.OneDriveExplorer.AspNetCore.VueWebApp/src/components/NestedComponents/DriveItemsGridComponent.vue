<template>
    <div class="drive-items-grid">
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    import { TrmrkBootstrapApp } from '../../common/browser/bootstrap/bootstrap';

    export default defineComponent({
        inject: [
            'trmrkBootStrapApp'],
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