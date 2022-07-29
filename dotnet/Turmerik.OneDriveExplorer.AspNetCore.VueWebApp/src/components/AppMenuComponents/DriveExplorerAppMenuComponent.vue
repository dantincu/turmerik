<template>
    <div class="trmrk-app-menu trmrk-drive-explorer-app-menu">
        <div class="trmrk-row">
            <span class="trmrk-drive-folder-name" ref="driveFolderNameEl" @click="driveFolderNameClicked()">{{ currentDriveFolder?.name ?? "" }}</span>
        </div>
        <div class="trmrk-row">
            <RouterLink class="nav-link trmrk-nav-link" to="."><i class="bi bi-house-fill"></i></RouterLink>
            <button type="button" class="btn btn-dark trmrk-btn-dark">
                <i class="bi bi-arrow-left-circle-fill" @click="btnGoBackClicked()"></i>
            </button>
            <router-link class="nav-link trmrk-nav-link" :to="getParentFolderId()"><i class="bi bi-arrow-up-circle-fill"></i></router-link>
            <button type="button" class="btn btn-dark trmrk-btn-dark">
                <i class="bi bi-arrow-right-circle-fill" @click="btnGoForwardClicked()"></i>
            </button>
            <button type="button" class="btn btn-dark trmrk-btn-dark">
                <i class="bi bi-arrow-clockwise" @click="btnReloadCurrentDirClicked()"></i>
            </button>
            <button type="button" class="btn btn-dark trmrk-btn-dark" data-bs-toggle="modal" data-bs-target="#goToFolderModal">
                <i class="bi bi-pencil-fill"></i>
            </button>
        </div>
        <div class="trmrk-row">
            <a class="nav-link trmrk-nav-link" href="#folders"><i class="bi bi-folder"></i></a>
            <a class="nav-link trmrk-nav-link" href="#files"><i class="bi bi-file"></i></a>
            <button type="button" class="btn btn-dark trmrk-btn-dark">
                <i class="bi bi-check-circle" @click="btnOpenCheckedItemsModalClicked()"></i>
            </button>
            <button type="button" class="btn btn-dark trmrk-btn-dark">
                <i class="bi bi-three-dots-vertical" @click="btnOpenOptionsModalClicked()"></i>
            </button>
            <button type="button" class="btn btn-dark trmrk-btn-dark">
                <i class="bi bi-command" @click="btnOpenCommandModalClicked()"></i>
            </button>
            <button type="button" class="btn btn-dark trmrk-btn-dark">
                <i class="bi bi-asterisk" @click="btnOpenExtraCommandModalClicked()"></i>
            </button>
        </div>
        <div class="modal fade" id="goToFolderModal" ref="goToFolderModalEl" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <p class="modal-title"><i class="bi bi-files"></i>Go to folder</p>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <GoToFolderComponent
                            :key="currentDriveFolder?.id"
                            :currentDriveFolderId="currentDriveFolder?.id"
                            @onNavigateTo="(url: string) => onNavigateToFolderIdFromModal(url)"></GoToFolderComponent>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject } from 'vue';
    import { Modal } from 'bootstrap';

    import { DriveExplorerService } from '../../services/DriveExplorerService';
    import GoToFolderComponent from '../NestedComponents/GoToFolderComponent.vue';

    interface DriveExplorerAppMenuComponentData {
        driveFolderNameCollapsed: boolean;
        goToFolderModal: Modal | null,
    }

    export default defineComponent({
        props: [ "currentDriveFolder" ],
        emits: [ "reloadCurrentDriveFolder" ],
        setup() {
            const driveExplorerService = inject<DriveExplorerService>("driveExplorerService") as DriveExplorerService;
            
            return {
                driveExplorerService
            }
        },
        data() {
            const data: DriveExplorerAppMenuComponentData = {
                driveFolderNameCollapsed: true,
                goToFolderModal: null,
            }

            return data;
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
            btnGoBackClicked() {
                this.$router.go(-1);
            },
            btnGoForwardClicked() {
                this.$router.go(1);
            },
            btnReloadCurrentDirClicked() {
                this.$emit("reloadCurrentDriveFolder");
            },
            btnOpenCheckedItemsModalClicked() {

            },
            btnOpenOptionsModalClicked() {

            },
            btnOpenCommandModalClicked() {

            },
            btnOpenExtraCommandModalClicked() {

            },
            onNavigateToFolderIdFromModal(url: string) {
                this.goToFolderModal?.hide();
                this.$router.push(url);
            },
            getParentFolderId() {
                const parentFolderId = "/explore-files/" + encodeURIComponent(this.currentDriveFolder?.parentFolderId ?? '');
                return parentFolderId;
            }
        },
        mounted() {
            const goToFolderModalEl = this.$refs.goToFolderModalEl as HTMLElement;
            this.goToFolderModal = Modal.getOrCreateInstance(goToFolderModalEl);
        },
        components: {
            GoToFolderComponent
        }
    });
</script>

<style scoped>
    .trmrk-app-menu {
        z-index: 1055;
    }
    
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

    .modal-title {
        font-weight: bold;
        width: 100%;
        margin: auto;
    }

    .modal-title > .bi.bi-files {
        margin-right: 0.5rem;
    }
</style>