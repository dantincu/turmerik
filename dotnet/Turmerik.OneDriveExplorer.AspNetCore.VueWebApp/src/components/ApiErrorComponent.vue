<template>
    <div :class="domElCssClass">
        <h3>{{ errorTitleStr }}</h3>
        <p><span class="trmrk-error-label">{{ errorLabelStr }} </span> {{ errorTextStr }}</p>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    import { TrmrkAxiosApiResult } from '../common/axios/trmrkAxios';

    export default defineComponent({
        props: [ "apiResponse", "cssClass", "errorTitle", "errorLabel", "errorText" ],
        data() {
            const domElCssClass = this.$props.cssClass ?? "trmrk-error";
            const apiReponse = this.$props.apiResponse as TrmrkAxiosApiResult;

            const errorTitleStr = this.$props.errorTitle ?? apiReponse.getStatusStr() ?? "Error";
            const errorLabelStr = this.$props.errorLabel ?? "Oops!";
            const errorTextStr = this.$props.errorText ?? apiReponse.getStatusText() ?? "Something went wrong...";

            return {
                domElCssClass,
                errorTitleStr,
                errorLabelStr,
                errorTextStr,
            };
        }
    });
</script>

<style scoped>
    .trmrk-error-label {
        color: red;
    }
</style>