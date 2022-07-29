<template>
    <td class="trmrk-edit-name-grid-row-cell">
        <i class="bi bi-escape" @click="cancelEditItem(driveItemEl)"></i>
        <span class="bi trmrk-utf-icon" @click="clearEditedItemName()">&times;</span>
        <input type="text" ref="editedItemNameTextBox" v-model="valWrapper.value" />
        <i class="bi bi-save-fill" @click="saveEditedItem(driveItemEl)"></i>
        <i class="bi bi-file-x-fill" @click="removeEditedItem(driveItemEl)" v-if="!isNewItem"></i>
    </td>
</template>

<script lang="ts">
/* eslint-disable */
    import { defineComponent } from 'vue';

    import { IRefValue } from '../../common/core/core';
    import { DriveItemEl } from './DriveItemEl';

    export default defineComponent({
        props: [ "isDriveFoldersGrid", "isNewItem", "rowCssClass", "driveItemEl", "valueWrapper" ],
        emits: [ "editItemCancelled", "editedItemSaved", "editedItemRemoved" ],
        data() {
            const valWrapper = this.$props.valueWrapper as IRefValue<string>;

            return ({
                valWrapper: valWrapper
            });
        },
        methods: {
            cancelEditItem(driveItemEl: DriveItemEl) {
                this.$emit("editItemCancelled", driveItemEl);
            },
            saveEditedItem(driveItemEl: DriveItemEl) {
                this.$emit("editedItemSaved", driveItemEl, this.valWrapper.value);
            },
            removeEditedItem(driveItemEl: DriveItemEl) {
                this.$emit("editedItemRemoved", driveItemEl);
            },
            clearEditedItemName() {
                this.valWrapper.value = "";
            },
        }
    });
</script>

<style scoped>
</style>