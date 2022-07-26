<template>
    <div :class="rootDomElCssClass">
        <table class="table">
            <thead>
                <th scope="col" class="trmrk-icon-grid-head-cell"></th>
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
                        <a class="trmrk-item-name" :href="driveItemEl.url" :click="(e: any) => itemNameClick(e, driveItemEl)">
                            {{ driveItemEl.data.name }}
                        </a>
                    </td>
                    <td class="trmrk-extn-grid-row-cell" v-if="!isDriveFoldersGrid"></td>
                    <td class="trmrk-icon-grid-row-cell"></td>
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
                driveItemElems: driveItemElems
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
                    url: "/files/" + encodeURIComponent(item.id ?? (this.$props.currentDriveFolder.id + "/" + item.name)),
                    isSelected: false,
                    isChecked: false,
                    iconCssClass: iconCssClass,
                    checkIconCssClass: "bi bi-square",
                    fileNameWithoutExtension: fileNameWithoutExtension,
                    fileNameExtension: fileNameExtension,
                } as DriveItemEl);

                return retItem;
            },
            itemCheckBoxClick(driveItem: DriveItemEl) {
                driveItem.isChecked = !driveItem.isChecked;

                if (driveItem.isChecked) {
                    driveItem.checkIconCssClass = "bi bi-check-square";
                } else {
                    driveItem.checkIconCssClass = "bi bi-square";
                }
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

    }

    .trmrk-extn-grid-row-cell > .trmrk-item-name-extn {
        
    }
</style>