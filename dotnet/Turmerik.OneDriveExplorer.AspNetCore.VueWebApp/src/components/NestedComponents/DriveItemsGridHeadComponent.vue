<template>
    <thead>
        <th scope="col" class="trmrk-icon-grid-head-cell">
            <i :class="headerCheckIconCssClass" @click="headerCheckBoxClick()"></i>
        </th>
        <th scope="col" class="trmrk-icon-grid-head-cell"></th>
        <th scope="col" class="trmrk-name-grid-head-cell">
            Name <span class="trmrk-checked-count" v-if="hasCheckedRows">{{ checkedRowsCount }} <i class="bi bi-check2"></i></span>
        </th>
        <th scope="col" class="trmrk-icon-grid-head-cell">
            <i class="bi bi-three-dots-vertical"></i>
        </th>
    </thead>
</template>

<script lang="ts">
/* eslint-disable */
    import { defineComponent } from 'vue';
    
    import { IRefValue } from '../../common/core/core';
    import DriveItemsGridEditComponent from './DriveItemsGridEditComponent.vue';

    interface DriveItemsGridRowComponentData {
        defaultIconCssClass: string;
        headerCheckIconIsChecked: boolean;
        headerCheckIconCssClass: string;
        hasCheckedRows: boolean;
        checkedRowsCount: number;
        editedNameValWrapper: IRefValue<string> | null | undefined;
    }

    export default defineComponent({
        props: [ "isDriveFoldersGrid", "isEditMode", "driveItemsCount" ],
        emits: [ "headerCheckBoxClicked" ],
        data() {
            return ({
                defaultIconCssClass: this.$props.isDriveFoldersGrid ? "bi bi-folder-fill" : "bi bi-file-text-fill",
                headerCheckIconIsChecked: false,
                headerCheckIconCssClass: "bi bi-square",
                hasCheckedRows: false,
                checkedRowsCount: 0,
            } as DriveItemsGridRowComponentData);
        },
        methods: {
            headerCheckBoxClick() {
                if (!this.isEditMode) {
                    this.headerCheckIconIsChecked = !this.headerCheckIconIsChecked;

                    if (this.headerCheckIconIsChecked) {
                        this.headerCheckIconCssClass = "bi bi-check-square";
                        this.hasCheckedRows = true;
                        this.checkedRowsCount = this.driveItemsCount;
                    } else {
                        this.headerCheckIconCssClass = "bi bi-square";
                        this.hasCheckedRows = false;
                        this.checkedRowsCount = 0;
                    }

                    this.$emit("headerCheckBoxClicked", this.headerCheckIconIsChecked);
                }
            }
        },
        components: {
            DriveItemsGridEditComponent
        }
    });
</script>

<style scoped>
</style>