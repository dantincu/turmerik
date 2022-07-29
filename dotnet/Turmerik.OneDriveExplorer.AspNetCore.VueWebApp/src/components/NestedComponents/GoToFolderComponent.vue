<template>
    <div class="trmrk-go-to-folder-component">
        <p>Type or paste folder id <button type="button" class="btn btn-primary trmrk-btn-decode" @click="btnFolderIdDecodeClick()">Decode</button></p>
        <p><input type="text" ref="folderIdTextBox" v-model="folderIdVal" @change="updateEncodedFolderIdVal()" /></p>
        <p><label class="folderIdEncodeCheckBoxLabel">Encode</label>
            <input type="checkbox" ref="folderIdEncodeCheckBox" v-model="encodeFolderId" @change="updateEncodedFolderIdVal()" />
            <button
                type="button"
                role="button"
                class="bi bi-clipboard-fill"
                data-bs-toggle="popover"
                data-bs-trigger="focus"
                title="Value copied to clipboard"
                @click="encodedFolderIdValCopyToClipboard()"
                data-bs-custom-class="trmrk-modal-popover"
                ref="btnEncodedFolderIdValCopyToClipboard">
                </button>
        </p>
        <code><pre ref="encodedFolderIdEl"> {{ encodedFolderIdVal }} </pre></code>
        <p><button type="button" class="btn btn-primary" @click="openFolderInSameTabClick()">Open in same tab</button></p>
        <p><button type="button" class="btn btn-primary" @click="openFolderInNewTabClick()">Open in new tab</button></p>
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject } from 'vue';
    import { Popover } from 'bootstrap';

    import { DriveExplorerService } from '../../services/DriveExplorerService';

    interface GoToFolderComponentData {
        folderIdVal: string;
        encodeFolderId: boolean;
        encodedFolderIdVal: string;
    }

    export default defineComponent({
        props: [ "currentDriveFolderId" ],
        emits: [ "onNavigateTo" ],
        setup() {
            const driveExplorerService = inject<DriveExplorerService>("driveExplorerService") as DriveExplorerService;
            
            return {
                driveExplorerService
            }
        },
        data() {
            const folderId = this.$props.currentDriveFolderId ?? "";
            const encodedFolderId = encodeURIComponent(folderId);

            return {
                folderIdVal: folderId,
                encodeFolderId: true,
                encodedFolderIdVal: encodedFolderId
            } as GoToFolderComponentData;
        },
        methods: {
            btnFolderIdDecodeClick() {
                this.folderIdVal = decodeURIComponent(this.folderIdVal);
                this.encodeFolderId = true;
                this.encodedFolderIdVal = encodeURIComponent(this.folderIdVal);
            },
            updateEncodedFolderIdVal() {
                if (this.encodeFolderId) {
                    this.encodedFolderIdVal = encodeURIComponent(this.folderIdVal);
                } else {
                    this.encodedFolderIdVal = this.folderIdVal;
                }
            },
            encodedFolderIdValCopyToClipboard() {
                navigator.clipboard.writeText(this.encodedFolderIdVal);
            },
            openFolderInSameTabClick() {
                const url = "/explore-files/" + this.encodedFolderIdVal;
                this.$emit("onNavigateTo", url);
            },
            openFolderInNewTabClick() {
                const url = "/explore-files/" + this.encodedFolderIdVal;
                window.open(url, "_blank");
            }
        },
        mounted() {
            const folderIdTextBox = this.$refs.folderIdTextBox as HTMLInputElement;
            const btnEncodedFolderIdValCopyToClipboard = this.$refs.btnEncodedFolderIdValCopyToClipboard as HTMLElement;

            folderIdTextBox.focus();
            folderIdTextBox.select();

            new Popover(btnEncodedFolderIdValCopyToClipboard, { content: "" })
        }
    });
</script>

<style scoped>
    input, code {
        font-family: 'Courier New', Courier, monospace;
        font-size: 16px;
    }

    input[type="text"] {
        width: 100%;
    }

    input[type="checkbox"] {
        width: 1.5em;
        height: 1.5em;
        cursor: pointer;
        padding-left: 0.5rem;
    }

    .folderIdEncodeCheckBoxLabel {
        height: 1.5em;
        line-height: 1.5em;
        vertical-align: top;
        margin-right: 0.5rem;
    }

    .bi-clipboard-fill {
        position: relative;
        top: -0.5rem;
        margin-left: 0.5rem;
    }

    .trmrk-btn-decode {
        margin-left: 0.5rem;
    }

    .trmrk-modal-popover {
        z-index: 2000;
    }
</style>