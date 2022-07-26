<template>
    <div v-if="isLoading" :class="loadingCssClass">
        <h3>Loading...</h3>
    </div>

    <ApiErrorComponent v-if="hasError"
        :css-class="errorCssClass"
        :api-response="apiResponse"
        :error-title="errorTitle"
        :error-label="errorLabel"
        :error-text="errorText"></ApiErrorComponent>

    <component v-if="hasData" :is="childComponent" :data="data" :props="childProps"></component>
</template>

<script lang="ts">
    import { Trmrk } from '@/common/core/core';
import { defineComponent } from 'vue';

    import { TrmrkAxiosApiResult } from '../common/axios/trmrkAxios';
    import ApiErrorComponent from './ApiErrorComponent.vue';

    interface ApiGetCallComponentData {
        loadingDomElCssClass: string;
        isLoading: boolean;
        hasError: boolean;
        hasData: boolean;
        apiResponse: TrmrkAxiosApiResult | null;
        data: any | null;
    }

    export default defineComponent({
        props: [
            "apiCallFunc", "apiSuccessCallback", "apiErrorCallback",
            "errorCssClass", "loadingCssClass",
            "errorTitle", "errorLabel", "errorText",
            "childComponent", "childProps" ],
        data() {
            const apiResponse: TrmrkAxiosApiResult | null = null;

            return {
                isLoading: false,
                hasError: false,
                hasData: false,
                apiResponse,
                data: null,
            } as ApiGetCallComponentData;
        },
        components: {
            ApiErrorComponent
        },
        mounted() {
            const apiCallFunc = this.$props.apiCallFunc as () => Promise<TrmrkAxiosApiResult>;
            this.isLoading = true;
            
            // eslint-disable-next-line no-unused-vars
            const apiSuccessCallback = this.$props.apiSuccessCallback as ((apiResponse: TrmrkAxiosApiResult) => void);
            // eslint-disable-next-line no-unused-vars
            const apiErrorCallback = this.$props.apiErrorCallback as ((apiResponse: TrmrkAxiosApiResult) => void);

            apiCallFunc().then((response: TrmrkAxiosApiResult) => {
                this.apiResponse = response;
                this.hasError = !response.isSuccess;
                this.hasData = response.isSuccess ?? false;
                this.data = response.data;
                this.isLoading = false;

                if (this.hasData) {
                    if (Trmrk.valIsOfTypeFunc(apiSuccessCallback)) {
                        apiSuccessCallback(response);
                    }
                } else {
                    if (Trmrk.valIsOfTypeFunc(apiErrorCallback)) {
                        apiErrorCallback(this.apiResponse);
                    }
                }
            }, reason => {
                this.apiResponse = new TrmrkAxiosApiResult({
                    exc: reason
                });

                this.hasError = true;
                this.isLoading = false;

                if (Trmrk.valIsOfTypeFunc(apiErrorCallback)) {
                    apiErrorCallback(this.apiResponse);
                }
            });
        }
    });
</script>