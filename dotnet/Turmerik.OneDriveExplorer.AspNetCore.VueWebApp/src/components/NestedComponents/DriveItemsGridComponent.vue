<template>
    <div :class="rootDomElCssClass">
        <p class="trmrk-checked-count" v-if="hasCheckedRows">{{ checkedRowsCount }} checked</p>
        <table :class="tableCssClass">
            <thead>
                <th scope="col" class="trmrk-icon-grid-head-cell">
                    <i :class="headerCheckIconCssClass" @click="headerCheckBoxClick()"></i>
                </th>
                <th scope="col" class="trmrk-icon-grid-head-cell"></th>
                <th scope="col" class="trmrk-name-grid-head-cell">Name</th>
                <th scope="col" class="trmrk-extn-grid-head-cell" v-if="!isDriveFoldersGrid"></th>
                <th scope="col" class="trmrk-icon-grid-head-cell"></th>
            </thead>
            <tbody>
                <tr v-for="driveItemEl in driveItemElems" :key="(driveItemEl.data.id as string)">
                    <td class="trmrk-icon-grid-row-cell">
                        <i :class="driveItemEl.checkIconCssClass" @click="itemCheckBoxClick(driveItemEl)"></i>
                    </td>
                    <td class="trmrk-icon-grid-row-cell">
                        <i :class="driveItemEl.iconCssClass"></i>
                    </td>
                    <td class="trmrk-name-grid-row-cell">
                        <RouterLink class="trmrk-item-name" :to="driveItemEl.url">
                            {{ driveItemEl.fileNameWithoutExtension }}
                        </RouterLink>
                    </td>
                    <td class="trmrk-extn-grid-row-cell" v-if="!isDriveFoldersGrid">
                        <span class="trmrk-item-name-extn">{{ driveItemEl.fileNameExtension }}</span></td>
                    <td class="trmrk-icon-grid-row-cell">
                        <i class="bi bi-three-dots-vertical"></i>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
/* eslint-disable */
    import { defineComponent } from 'vue';

    import { DriveItem } from '../../services/Entities/Entities';
    import { getFileNameAndExtension, getFileNameBsIconCssClass } from '../../services/DriveFileNameService';
    import { DriveItemEl } from './DriveItemEl';

    export default defineComponent({
        name: 'Counter',
        props: [ "isDriveFoldersGrid", "driveItemEls", "driveItems", "currentDriveFolder" ],
        data() {
            const rootDomElCssClass = this.$props.isDriveFoldersGrid ? "trmrk-drive-folders-grid" : "trmrk-drive-files-grid";

            let driveItemElems: DriveItemEl[] = this.getDriveItemElsArr(
                this.$props.driveItems, this.$props.driveItemEls
            );

            return ({
                rootDomElCssClass: [ "trmrk-drive-items-grid", rootDomElCssClass ].join(" "),
                driveItemElems: driveItemElems,
                headerCheckIconIsChecked: false,
                headerCheckIconCssClass: "bi bi-square",
                hasCheckedRows: false,
                checkedRowsCount: 0,
                tableCssClass: "table",
            });
        },
        methods: {
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
                const iconCssClass = this.$props.isDriveFoldersGrid ? "bi bi-folder" : getFileNameBsIconCssClass(fileNameExtension);

                const retItem = ({
                    data: item,
                    url: this.getDriveItemUrl(item, this.$props.isDriveFoldersGrid),
                    isSelected: false,
                    isChecked: false,
                    iconCssClass: iconCssClass,
                    checkIconCssClass: "bi bi-square",
                    fileNameWithoutExtension: fileNameWithoutExtension,
                    fileNameExtension: fileNameExtension,
                } as DriveItemEl);

                return retItem;
            },
            getDriveItemUrl(item: DriveItem, isDriveFoldersGrid: boolean): string {
                const id = this.getDriveItemId(item);
                const encodedId = encodeURIComponent(id);

                let url: string;

                if (isDriveFoldersGrid) {
                    url = "/explore-files/" + encodedId;
                } else if (item.isTextFile) {
                    url = "/text-file/" + encodedId;
                } else if (item.isTextFile) {
                    url = "/image-file/" + encodedId;
                } else if (item.isTextFile) {
                    url = "/video-file/" + encodedId;
                } else if (item.isTextFile) {
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
            itemCheckBoxClick(driveItem: DriveItemEl) {
                driveItem.isChecked = !driveItem.isChecked;

                if (driveItem.isChecked) {
                    driveItem.checkIconCssClass = "bi bi-check-square";
                    this.checkedRowsCount++;

                    if (!this.hasCheckedRows) {
                        this.hasCheckedRows = true;
                        this.updateTableCssClass();
                    }
                } else {
                    driveItem.checkIconCssClass = "bi bi-square";
                    this.checkedRowsCount--;

                    if (this.hasCheckedRows) {
                        if (!this.driveItemElems.find(
                            itemEl => itemEl.isChecked
                        )) {
                            this.hasCheckedRows = false;
                            this.updateTableCssClass();
                        }
                    }
                }
            },
            headerCheckBoxClick() {
                this.headerCheckIconIsChecked = !this.headerCheckIconIsChecked;

                if (this.headerCheckIconIsChecked) {
                    this.headerCheckIconCssClass = "bi bi-check-square";
                    this.hasCheckedRows = true;
                    this.checkedRowsCount = this.driveItemElems.length;
                } else {
                    this.headerCheckIconCssClass = "bi bi-square";
                    this.hasCheckedRows = false;
                    this.checkedRowsCount = 0;
                }

                for (let itemEl of this.driveItemElems) {
                    itemEl.isChecked = this.headerCheckIconIsChecked;

                    if (this.headerCheckIconIsChecked) {
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
            itemNameClick(e: any, driveItem: DriveItemEl) {
                e.preventDefault();
                return false;
            }
        }
    });
</script>

<style scoped>
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

    .trmrk-table-has-checked-rows .trmrk-icon-grid-head-cell > .bi.bi-square,
    .trmrk-table-has-checked-rows .trmrk-icon-grid-row-cell > .bi.bi-square {
        color: #BDF;
    }

    .trmrk-name-grid-head-cell {

    }

    .trmrk-name-grid-row-cell {

    }

    .trmrk-extn-grid-head-cell {
        width: 2em;
    }

    .trmrk-extn-grid-row-cell {
        width: 2em;
    }

    .trmrk-name-grid-row-cell > .trmrk-item-name {
        text-transform: none;
        text-decoration: none;
        color: black;
        font-weight: bold;
    }

    .trmrk-extn-grid-row-cell > .trmrk-item-name-extn {
        color: black;
        font-weight: bold;
    }

    .trmrk-checked-count {
        color: #88F;
    }
</style>