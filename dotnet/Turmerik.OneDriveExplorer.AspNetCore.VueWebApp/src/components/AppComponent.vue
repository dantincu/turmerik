<template>
    <AppNavComponent />

    <main class="trmrk-app-container">
        <div v-if="loading" class="trmrk-app-loading">
            <h3>Loading...</h3>
        </div>

        <AppContentComponent v-if="email" />

        <div v-else class="trmrk-app-error container-xxl">
            <h3>{{ status ?? "Error" }}</h3>
            <p><span class="trmrk-err-msg">Oops! </span> {{ statusText ?? error ?? "Something went wrong..." }}</p>
        </div>
    </main>
</template>

<style scoped>
    .trmrk-app-container {
        margin-top: 60px;
    }

    .trmrk-app-error .trmrk-err-msg {
        color: red;
    }
</style>

<script lang="ts">
    import { defineComponent } from 'vue';

    import AppContentComponent from './AppContentComponent.vue';
    import AppNavComponent from './AppNavComponent.vue';

    interface Data {
        loading: boolean,
        email: null | string
        status: null | number;
        statusText: null | string;
        error: null | any;
    }

    export default defineComponent({
    data(): Data {
        return {
            loading: false,
            email: null,
            status: null,
            statusText: null,
            error: null
        };
    },
    created() {
        // fetch the data when the view is created and the data is
        // already being observed
        this.fetchData();
    },
    methods: {
        async fetchData() {
            this.email = null;
            this.loading = true;
            try {
                const response = await fetch("api/mvc/account/getEmail");
                if (response.ok) {
                    const text = await response.text();
                    this.email = text;
                    this.loading = false;
                }
                else {
                    this.status = response.status;
                    this.statusText = response.statusText;
                }
            }
            catch (reason) {
                this.error = reason;
                this.loading = false;
            }
        }
    },
    components: {
        AppContentComponent,
        AppNavComponent
    }
});
</script>