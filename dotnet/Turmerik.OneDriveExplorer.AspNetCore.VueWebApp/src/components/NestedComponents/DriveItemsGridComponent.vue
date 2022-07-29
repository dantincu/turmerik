<template>
    <div :class="getRootDomElCssClass()">
        <table :class="tableCssClass">
            <DriveItemsGridHeadComponent
                :isDriveFoldersGrid="isDriveFoldersGrid"
                :isEditMode="isEditMode"
                :isAddMode="isAddMode"
                :driveItemsCount="driveItemElems.length"
                @headerCheckBoxClicked="(checked: boolean) => headerCheckBoxClicked(checked)">
            </DriveItemsGridHeadComponent>
            <tbody>
                <DriveItemsGridRowComponent v-if="isAddMode"
                    :isDriveFoldersGrid="isDriveFoldersGrid"
                    :isNewItem="true"
                    :driveItemEl="newItemEl"
                    :isEditMode="isEditMode || isAddMode"
                    @itemEditingCancelled="(newItem: any) => itemAddingCancelled(newItem)"
                    @editedItemSaved="(newItem: any, newValue: string) => addedItemSaved(newItem, newValue)">
                </DriveItemsGridRowComponent>

                <DriveItemsGridRowComponent
                    v-for="driveItemEl in driveItemElems"
                    :key="(driveItemEl.data.id as string)"
                    :isDriveFoldersGrid="isDriveFoldersGrid"
                    :isNewItem="false"
                    :driveItemEl="driveItemEl"
                    :isEditMode="isEditMode || isAddMode"
                    @itemCheckBoxClicked="(isChecked: boolean) => itemCheckBoxClicked(driveItemEl, isChecked)"
                    @itemEditingStarted="(item: any) => itemEditingStarted(item)"
                    @itemEditingCancelled="(item: any) => itemEditingCancelled(item)"
                    @editedItemSaved="(item: any, newValue: string) => editedItemSaved(item, newValue)"
                    @editedItemRemoved="(item: any) => editedItemRemoved(item)">
                </DriveItemsGridRowComponent>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    import { IRefValue } from '../../common/core/core';
    import { DriveItem } from '../../services/Entities/Entities';
    import { getFileNameAndExtension, getFileNameBsIconCssClass } from '../../services/DriveFileNameService';
    import { DriveItemEl } from './DriveItemEl';
    import DriveItemsGridHeadComponent from './DriveItemsGridHeadComponent.vue';
    import DriveItemsGridRowComponent from './DriveItemsGridRowComponent.vue';

    export default defineComponent({
        props: [ "isDriveFoldersGrid", "driveItemEls", "driveItems", "currentDriveFolder", "isEditMode", "isAddMode" ],
        emits: [ "itemEditingStarted", "itemEditingCancelled", "itemAddingCancelled", "editedItemSaved", "addedItemSaved", "editedItemRemoved" ],
        data() {
            let driveItemElems: DriveItemEl[] = this.getDriveItemElsArr(
                this.$props.driveItems, this.$props.driveItemEls
            );

            const defaultIconCssClass = this.$props.isDriveFoldersGrid ? "bi bi-folder-fill" : "bi bi-file-text-fill";

            return ({
                defaultIconCssClass,
                driveItemElems: driveItemElems,
                headerCheckIconIsChecked: false,
                headerCheckIconCssClass: "bi bi-square",
                hasCheckedRows: false,
                checkedRowsCount: 0,
                tableCssClass: "table",
                newEntryValWrapper: {
                    value: ""
                } as IRefValue<string>,
                newItemEl: {
                    iconCssClass: defaultIconCssClass,
                    checkIconCssClass: "bi bi-square",
                    isEditing: true,
                    parentFolderId: this.$props.currentDriveFolder.id
                } as DriveItemEl,
                isReadonly: false
            });
        },
        methods: {
            getRootDomElCssClass() {
                const cssClassArr = [ "trmrk-drive-items-grid",
                    this.$props.isDriveFoldersGrid ? "trmrk-drive-folders-grid" : "trmrk-drive-files-grid" ];
                
                if (this.isEditMode || this.isAddMode) {
                    cssClassArr.push("trmrk-edit-mode");
                }

                const cssClassStr = cssClassArr.join(" ");
                return cssClassStr;
            },
            getDriveItemElsArr(driveItems: DriveItem[] | null, driveItemEls: DriveItemEl[] | null) {
                let driveItemElems = driveItemEls as DriveItemEl[];

                if (!driveItemElems) {
                    if (driveItems) {
                        driveItemElems = driveItems.map(this.getDriveItemEl);
                    } else {
                        driveItemElems = []
                    }
                }

                return driveItemElems;
            },
            getDriveItemEl(item: DriveItem) {
                const [ fileNameWithoutExtension, fileNameExtension ] = getFileNameAndExtension(item.name as string);
                const iconCssClass = this.$props.isDriveFoldersGrid ? "bi bi-folder-fill" : getFileNameBsIconCssClass(fileNameExtension);

                const driveItemId = this.getDriveItemId(item);

                const retItem = ({
                    data: item,
                    id: driveItemId,
                    url: this.getDriveItemUrl(item, driveItemId, this.$props.isDriveFoldersGrid),
                    isSelected: false,
                    isChecked: false,
                    iconCssClass: iconCssClass,
                    checkIconCssClass: "bi bi-square",
                    fileNameWithoutExtension,
                    fileNameExtension,
                    isEditing: false,
                    rowCssClass: "trmrk-grid-row"
                } as DriveItemEl);

                return retItem;
            },
            getDriveItemUrl(item: DriveItem, id: string, isDriveFoldersGrid: boolean): string {
                const encodedId = encodeURIComponent(id);
                let url: string;

                if (isDriveFoldersGrid) {
                    url = "/explore-files/" + encodedId;
                } else if (item.isTextFile) {
                    url = "/text-file/" + encodedId;
                } else if (item.isImageFile) {
                    url = "/image-file/" + encodedId;
                } else if (item.isVideoFile) {
                    url = "/video-file/" + encodedId;
                } else if (item.isAudioFile) {
                    url = "/audio-file/" + encodedId;
                } else {
                    url = "/download-file/" + encodedId;
                }

                return url;
            },
            getDriveItemId(item: DriveItem) {
                const id = item.id ?? (this.$props.currentDriveFolder.id + "/" + item.name);
                return id;
            },
            itemCheckBoxClicked(driveItem: DriveItemEl, isChecked: boolean) {
                if (isChecked) {
                    this.checkedRowsCount++;

                    if (!this.hasCheckedRows) {
                        this.hasCheckedRows = true;
                        this.updateTableCssClass();
                    }
                } else {
                    this.checkedRowsCount--;

                    if (this.hasCheckedRows) {
                        if (this.checkedRowsCount === 0) {
                            this.hasCheckedRows = false;
                            this.updateTableCssClass();
                        }
                    }
                }
            },
            headerCheckBoxClicked(checked: boolean) {
                for (let itemEl of this.driveItemElems) {
                    itemEl.isChecked = checked;

                    if (checked) {
                        itemEl.checkIconCssClass = "bi bi-check-square";
                    } else {
                        itemEl.checkIconCssClass = "bi bi-square";
                    }
                }

                this.updateTableCssClass();
            },
            updateTableCssClass() {
                let tableCssClass = "table";

                if (this.hasCheckedRows) {
                    tableCssClass += " trmrk-table-has-checked-rows";
                }

                this.tableCssClass = tableCssClass;
            },
            itemEditingStarted(driveItemEl: DriveItemEl) {
                driveItemEl.isEditing = true;
                this.$emit("itemEditingStarted", driveItemEl);
            },
            itemEditingCancelled(driveItemEl: DriveItemEl) {
                driveItemEl.isEditing = false;
                this.$emit("itemEditingCancelled", driveItemEl);
            },
            // eslint-disable-next-line no-unused-vars
            itemAddingCancelled(newItem: DriveItemEl) {
                this.$emit("itemAddingCancelled", newItem);
            },
            // eslint-disable-next-line no-unused-vars
            editedItemSaved(driveItemEl: DriveItemEl, newValue: string) {
                driveItemEl.isEditing = false;
                this.$emit("editedItemSaved", driveItemEl, newValue);
            },
            // eslint-disable-next-line no-unused-vars
            addedItemSaved(newItem: DriveItemEl, newValue: string) {
                this.$emit("addedItemSaved", newItem, newValue);
            },
            editedItemRemoved(driveItemEl: DriveItemEl) {
                driveItemEl.isEditing = false;
                this.$emit("editedItemRemoved", driveItemEl);
            },
        },
        components: {
            DriveItemsGridHeadComponent,
            DriveItemsGridRowComponent,
        }
    });
</script>

<style>
    .trmrk-icon-grid-head-cell > .bi.bi-square,
    .trmrk-icon-grid-row-cell > .bi.bi-square {
        color: #DDD;
    }

    .trmrk-drive-items-grid.trmrk-edit-mode .trmrk-icon-grid-head-cell > .bi.bi-square,
    .trmrk-drive-items-grid.trmrk-edit-mode .trmrk-icon-grid-row-cell > .bi.bi-square {
        color: #CCC;
    }

    .trmrk-table-has-checked-rows .trmrk-icon-grid-head-cell > .bi.bi-square,
    .trmrk-table-has-checked-rows .trmrk-icon-grid-row-cell > .bi.bi-square {
        color: #BDF;
    }

    .trmrk-drive-items-grid.trmrk-edit-mode .trmrk-table-has-checked-rows .trmrk-icon-grid-head-cell > .bi.bi-square,
    .trmrk-drive-items-grid.trmrk-edit-mode .trmrk-table-has-checked-rows .trmrk-icon-grid-row-cell > .bi.bi-square {
        color: #ACE;
    }

    .trmrk-name-grid-row-cell {
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-all;
    }

    .trmrk-name-grid-row-cell a {
        text-transform: none;
        text-decoration: none;
        font-weight: bold;
    }

    .trmrk-name-grid-row-cell .trmrk-item-name {
        color: black;
    }

    .trmrk-name-grid-row-cell .trmrk-item-name-extn {
        color: #00C;
    }

    .trmrk-drive-items-grid.trmrk-edit-mode .trmrk-icon-grid-head-cell > .bi.bi-square,
    .trmrk-drive-items-grid.trmrk-edit-mode .trmrk-icon-grid-row-cell > .bi.bi-square {
        color: #CCC;
    }

    .trmrk-table-has-checked-rows .trmrk-icon-grid-head-cell > .bi.bi-square,
    .trmrk-table-has-checked-rows .trmrk-icon-grid-row-cell > .bi.bi-square {
        color: #BDF;
    }

    .trmrk-drive-items-grid.trmrk-edit-mode .trmrk-table-has-checked-rows .trmrk-icon-grid-head-cell > .bi.bi-square,
    .trmrk-drive-items-grid.trmrk-edit-mode .trmrk-table-has-checked-rows .trmrk-icon-grid-row-cell > .bi.bi-square {
        color: #ACE;
    }

    .trmrk-drive-items-grid.trmrk-edit-mode .trmrk-grid-row,
    .trmrk-drive-items-grid.trmrk-edit-mode thead {
        background-color: #EEE;
    }

    .trmrk-checked-count {
        color: #88F;
        font-weight: normal;
    }
    
    .trmrk-icon-grid-head-cell {
        width: 1em;
    }

    .trmrk-icon-grid-row-cell {
        width: 1em;
    }

    .trmrk-icon-grid-head-cell > .bi.bi-square,
    .trmrk-icon-grid-row-cell > .bi.bi-square {
        color: #DDD;
    }

    .trmrk-name-grid-row-cell {
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-all;
    }

    .trmrk-name-grid-row-cell a {
        text-transform: none;
        text-decoration: none;
        font-weight: bold;
    }

    .trmrk-name-grid-row-cell .trmrk-item-name {
        color: black;
    }

    .trmrk-name-grid-row-cell .trmrk-item-name-extn {
        color: #00C;
    }

    .trmrk-checked-count {
        color: #88F;
        font-weight: normal;
    }
</style>