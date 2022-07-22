<template>
    <div class="drive-items-grid">
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    import { Trmrk } from '../../common/core/core';

    export default defineComponent({
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