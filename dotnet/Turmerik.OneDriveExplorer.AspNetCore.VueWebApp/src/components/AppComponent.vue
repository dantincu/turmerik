<style scoped>
    .trmrk-app-error .trmrk-err-msg {
        color: red;
    }
</style>

<template>
    <main class="container trmrk-app-container">
        <div v-if="loading" class="trmrk-app-loading">
            <h3>Loading...</h3>
        </div>

        <div v-if="email" class="trmrk-app-content">
            
        </div>

        <div v-else class="trmrk-app-error">
            <h3>{{ status ?? "Error" }}</h3>
            <p><span class="trmrk-err-msg">Oops! </span> {{ statusText ?? error ?? "Something went wrong..." }}</p>
        </div>

        <div class="trmrk-app-login-link-wrapper" v-html="loginLinkHtml"></div>
    </main>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    // eslint-disable-next-line no-unused-vars
    import * as bootstrap from 'bootstrap';
    import 'bootstrap/dist/css/bootstrap.min.css';

    interface Data {
        loginUrl: string,
        loginLinkHtml: string,
        loading: boolean,
        email: null | string
        status: null | number;
        statusText: null | string;
        error: null | any;
    }

    export default defineComponent({
        data(): Data {
            const loginUrl = process.env.VUE_APP_API_BASE_URL + "/api/mvc/account/loggedIn";

            return {
                loginUrl: loginUrl,
                loginLinkHtml: "<a href=\"" + loginUrl + "\">Login</a>",
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
        watch: {
            // call again the method if the route changes
            '$route': 'fetchData'
        },
        methods: {
            async fetchData() {
                this.email = null;
                this.loading = true;

                try {
                    const response = await fetch('api/mvc/account/getEmail');

                    if (response.ok) {
                        const text = await response.text();
                        this.email = text;
                        this.loading = false;
                    } else {
                        this.status = response.status;
                        this.statusText = response.statusText;
                    }
                } catch (reason) {
                    this.error = reason;
                    this.loading = false;
                }
            }
        },
    });
</script>