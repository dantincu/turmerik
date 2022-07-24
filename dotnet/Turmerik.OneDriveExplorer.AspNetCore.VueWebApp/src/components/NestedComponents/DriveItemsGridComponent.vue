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
                <tr v-for="driveItemEl in driveItemElemsArr" :key="driveItemEl.id">
                    <td class="trmrk-icon-grid-row-cell">
                        <i :class="driveItemEl.checkIconCssClass" @click="itemCheckBoxClick(driveItemEl)"></i>
                    </td>
                    <td class="trmrk-icon-grid-row-cell">
                        <i :class="driveItemEl.iconCssClass"></i>
                    </td>
                    <td class="trmrk-name-grid-row-cell">
                        <span class="trmrk-item-name"
                            @mouseup="itemNameMouseUp(driveItemEl)">
                            {{ driveItemEl.data.name }}
                        </span>
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
        props: [ "isDriveFoldersGrid", "driveItemElsArr", "driveItemsArr" ],
        data() {
            const rootDomElCssClass = this.$props.isDriveFoldersGrid ? "trmrk-drive-folders-grid" : "trmrk-drive-files-grid";

            return ({
                rootDomElCssClass: [ "trmrk-drive-items-grid", rootDomElCssClass ].join(" "),
                driveItemElemsArr: this.$props.driveItemElsArr ?? this.$props.driveItemsArr?.map(
                    (item: DriveItem) => {
                        const [ fileNameWithoutExtension, fileNameExtension ] = getFileNameAndExtension(item.name as string);
                        const iconCssClass = this.$props.isDriveFoldersGrid ? "bi bi-folder" : getFileNameBsIconCssClass(fileNameExtension);

                        return ({
                            data: item,
                            isSelected: false,
                            isChecked: false,
                            iconCssClass: iconCssClass,
                            checkIconCssClass: "bi bi-square",
                            fileNameWithoutExtension: fileNameWithoutExtension,
                            fileNameExtension: fileNameExtension,
                        } as DriveItemEl);
                    }
                ) ?? []
            });
        },
        methods: {
            itemCheckBoxClick(driveItem: DriveItemEl) {
                driveItem.isChecked = !driveItem.isChecked;

                if (driveItem.isChecked) {
                    driveItem.checkIconCssClass = "bi bi-check-square";
                } else {
                    driveItem.checkIconCssClass = "bi bi-square";
                }
            },
            itemNameLongClick(driveItem: DriveItemEl) {
            },
            itemNameMouseUp(driveItem: DriveItemEl) {
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