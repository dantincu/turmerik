<template>
    <div class="trmrk-app-menu trmrk-drive-explorer-app-menu">
        <div class="trmrk-row">
            <span class="trmrk-drive-folder-name" ref="driveFolderNameEl" @click="driveFolderNameClicked()">{{ currentDriveFolder?.name ?? "" }}</span>
        </div>
        <div class="trmrk-row">
            <button type="button" class="btn btn-dark trmrk-btn-dark">
                <i class="bi bi-house-fill" @click="btnGoToHomeDirClicked()"></i>
            </button>
            <button type="button" class="btn btn-dark trmrk-btn-dark">
                <i class="bi bi-three-dots" @click="btnGoToParentDirClicked()"></i>
            </button>
            <button type="button" class="btn btn-dark trmrk-btn-dark">
                <i class="bi bi-arrow-clockwise" @click="btnReloadCurrentDirClicked()"></i>
            </button>
            <button type="button" class="btn btn-dark trmrk-btn-dark">
                <i class="bi bi-three-dots-vertical" @click="btnOpenOptionsModalClicked()"></i>
            </button>
        </div>
        <div class="trmrk-row">
            <button type="button" class="btn btn-dark trmrk-btn-dark">
                <i class="bi bi-command" @click="btnOpenCommandModalClicked()"></i>
            </button>
            <button type="button" class="btn btn-dark trmrk-btn-dark">
                <i class="bi bi-three-dots-vertical" @click="btnOpenCheckedItemsModalClicked()"></i>
            </button>
            <a class="nav-link trmrk-nav-link" href="#folders"><i class="bi bi-folder"></i></a>
            <a class="nav-link trmrk-nav-link" href="#files"><i class="bi bi-file"></i></a>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        props: [ "currentDriveFolder" ],
        data() {
            return {
                driveFolderNameCollapsed: true
            };
        },
        methods: {
            driveFolderNameClicked() {
                const driveFolderNameEl = this.$refs.driveFolderNameEl as HTMLElement;
                this.driveFolderNameCollapsed = !this.driveFolderNameCollapsed;

                if (this.driveFolderNameCollapsed) {
                    driveFolderNameEl.classList.remove("trmrk-expanded");
                } else {
                    driveFolderNameEl.classList.add("trmrk-expanded");
                }
            },
            btnGoToHomeDirClicked() {

            },
            btnGoToParentDirClicked() {

            },
            btnReloadCurrentDirClicked() {

            },
            btnOpenOptionsModalClicked() {

            },
            btnOpenCommandModalClicked() {

            },
            btnOpenCheckedItemsModalClicked() {

            }
        }
    });
</script>

<style scoped>
    .trmrk-row {
        display: block;
    }

    .trmrk-drive-folder-name {
        overflow-x: hidden;
        cursor: pointer;
    }

    .trmrk-drive-folder-name.trmrk-expanded {
        word-wrap: break-word;
        word-break: break-all;
    }

    .trmrk-btn-dark {
        color: #DDF;
    }

    .trmrk-nav-link {
        display: inline-flex;
    }
</style>