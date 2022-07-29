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
            :isNewItem="isNewItem"
            :rowCssClass="'trmrk-edit-name-grid-row-cell'"
            :valueWrapper="editedNameValWrapper"
            :isReadonly="isReadonly"
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
        rowCssClass: string
        editedNameValWrapper: IRefValue<string> | null | undefined;
        isReadonly: boolean
    }
    
    const getRowCssClass = (isReadonly: boolean, isEditing: boolean, isNewItem: boolean) => {
        let rowCssClass: string;

        if (isEditing) {
            if (isNewItem) {
                rowCssClass = "trmrk-grid-row-new";
            } else {
                rowCssClass = "trmrk-grid-row-edit";
            }

            if (isReadonly) {
                rowCssClass += " trmrk-readonly";
            }
        } else {
            rowCssClass = "trmrk-grid-row";
        }

        return rowCssClass;
    };

    export default defineComponent({
        props: [ "isDriveFoldersGrid", "isEditMode", "isNewItem", "driveItemEl" ],
        emits: [ "itemCheckBoxClicked", "itemEditingStarted", "itemEditingCancelled", "editedItemSaved", "editedItemRemoved" ],
        data() {
            return ({
                rowCssClass: getRowCssClass(false, this.driveItemEl.isEditing, this.isNewItem),
                editedNameValWrapper: {
                    value: this.driveItemEl.data?.name ?? ""
                },
                isReadonly: false
            } as DriveItemsGridRowComponentData);
        },
        methods: {
            itemCheckBoxClick() {
                if (!this.isEditMode) {
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
                this.isReadonly = true;
                this.rowCssClass = getRowCssClass(true, this.driveItemEl.isEditing, this.isNewItem);
                // this.$emit("editedItemSaved", this.driveItemEl, newValue);
            },
            removeEditedItem(item: DriveItemEl) {
                this.isReadonly = true;
                this.rowCssClass = getRowCssClass(true, this.driveItemEl.isEditing, this.isNewItem);
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