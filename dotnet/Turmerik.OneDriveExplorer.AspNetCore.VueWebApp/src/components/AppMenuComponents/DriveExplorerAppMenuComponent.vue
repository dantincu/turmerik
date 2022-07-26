<template>
    <div class="trmrk-app-menu trmrk-drive-explorer-app-menu">
        <span>{{ currentDriveFolder?.name ?? "" }}</span>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        props: [ "currentDriveFolder" ],
    });
</script>

<style scoped>

</style>