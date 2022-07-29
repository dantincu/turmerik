<template>
    <tr :class="rowCssClass">
        <td class="trmrk-icon-grid-row-cell">
            <i :class="driveItemEl.checkIconCssClass" @click="itemCheckBoxClick()"></i>
        </td>
        <td class="trmrk-icon-grid-row-cell">
            <i :class="driveItemEl.iconCssClass"></i>
        </td>
        <td class="trmrk-name-grid-row-cell" v-if="!driveItemEl.isEditing">
            <RouterLink :to="driveItemEl.url">
                <span class="trmrk-item-name">{{ driveItemEl.fileNameWithoutExtension }}</span>
                <span class="trmrk-item-name-extn">{{ driveItemEl.fileNameExtension }}</span>
            </RouterLink>
        </td>
        <DriveItemsGridEditComponent v-if="driveItemEl.isEditing"
            :isNewItem="false"
            :rowCssClass="'trmrk-edit-name-grid-row-cell'"
            :valueWrapper="editedNameValWrapper"
            @editItemCancelled="(item: any) => cancelEditItem(item)"
            @editedItemSaved="(item: any, newValue: string) => saveEditedItem(item, newValue)"
            @editedItemRemoved="(item: any) => removeEditedItem(item)">
        </DriveItemsGridEditComponent>
        <td class="trmrk-icon-grid-row-cell">
            <i class="bi bi-three-dots-vertical"></i>
        </td>
    </tr>
</template>

<script lang="ts">
/* eslint-disable */
    import { defineComponent } from 'vue';

    import { IRefValue } from '../../common/core/core';
    import { DriveItemEl } from './DriveItemEl';
    import DriveItemsGridEditComponent from './DriveItemsGridEditComponent.vue';

    interface DriveItemsGridRowComponentData {
        editedNameValWrapper: IRefValue<string> | null | undefined;
        rowCssClass: string
    }

    export default defineComponent({
        props: [ "isDriveFoldersGrid", "isNewItem", "driveItemEl" ],
        emits: [ "itemCheckBoxClicked", "itemEditingStarted", "itemEditingCancelled", "editedItemSaved", "editedItemRemoved" ],
        data() {
            let rowCssClass: string;

            if (this.driveItemEl.isEditing) {
                if (this.isNewItem) {
                    rowCssClass = "trmrk-grid-row-new";
                } else {
                    rowCssClass = "trmrk-grid-row-edit";
                }
            } else {
                rowCssClass = "trmrk-grid-row";
            }

            return ({
                rowCssClass
            } as DriveItemsGridRowComponentData);
        },
        methods: {
            itemCheckBoxClick() {
                if (!this.driveItemEl.isEditing) {
                    const driveItemEl = this.driveItemEl as DriveItemEl;
                    driveItemEl.isChecked = !driveItemEl.isChecked;

                    if (driveItemEl.isChecked) {
                        driveItemEl.checkIconCssClass = "bi bi-check-square";
                    } else {
                        driveItemEl.checkIconCssClass = "bi bi-square";
                    }

                    this.$emit("itemCheckBoxClicked", driveItemEl.isChecked);
                }
            },
            itemIconClick() {
                if (!this.driveItemEl.isEditing) {
                    const driveItemEl = this.driveItemEl as DriveItemEl;
                    driveItemEl.isEditing = true;
                    
                    this.editedNameValWrapper = {
                        value: ""
                    };

                    this.$emit("itemEditingStarted", this.driveItemEl);
                }
            },
            cancelEditItem(item: DriveItemEl) {
                this.$emit("itemEditingCancelled", this.driveItemEl);
            },
            saveEditedItem(item: DriveItemEl, newValue: string) {
                this.$emit("editedItemSaved", this.driveItemEl, newValue);
            },
            removeEditedItem(item: DriveItemEl) {
                this.$emit("editedItemRemoved", this.driveItemEl);
            }
        },
        components: {
            DriveItemsGridEditComponent
        }
    });
</script>

<style scoped>
</style>