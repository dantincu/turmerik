import { Kvp } from "../trmrk/core";
import { IdxesFilter } from "../trmrk/TextParsing/IdxesFilter";

import {
  ContentSpecs,
  File,
  FilesGroup,
  Filter,
  Profile,
  ProfileSection,
  RawFilter,
  RelDirPaths,
} from "./core";

const srcFoldersArr: { [key: string]: string } = {
  trmrk: "libs\\trmrk\\src\\lib",
  "trmrk-angular": "libs\\trmrk-angular\\projects\\trmrk-angular\\src\\lib",
  "trmrk-axios": "libs\\trmrk-axios\\src\\lib",
  "trmrk-browser": "libs\\trmrk-browser\\src\\lib",
  "trmrk-svelte": "libs\\trmrk-svelte\\src\\lib",
  "trmrk-filemanager-nglib":
    "libs\\trmrk-filemanager-nglib\\projects\\trmrk-filemanager-nglib\\src\\lib",
  "trmrk-mailbox-nglib":
    "libs\\trmrk-mailbox-nglib\\projects\\trmrk-mailbox-nglib\\src\\lib",
  "trmrk-mkscripts-jsws-sync-behavior":
    "libs\\trmrk-mkscripts-jsws-sync-behavior\\src\\lib",
  "trmrk-notes-nglib":
    "libs\\trmrk-notes-nglib\\projects\\trmrk-notes-nglib\\src\\lib",
  "trmrk-notes-sveltelib": "libs\\trmrk-notes-sveltelib\\src\\lib",
  "trmrk-testing-nglib":
    "libs\\trmrk-testing-nglib\\projects\\trmrk-testing-nglib\\src\\lib",
  "trmrk-text-transform-behavior":
    "libs\\trmrk-text-transform-behavior\\src\\lib",
  "trmrk-text-transform-defaultbehavior":
    "libs\\trmrk-text-transform-defaultbehavior\\src\\lib",
  "trmrk-text-transform-mybehavior":
    "libs\\trmrk-text-transform-mybehavior\\src\\lib",
};

const destnLocationsArr: {
  [key: string]: { dirPath: string; syncedLibs: string[] };
} = {
  "trmrk-angular": {
    dirPath: "libs\\trmrk-angular\\projects\\trmrk-angular\\src",
    syncedLibs: ["trmrk", "trmrk-browser"],
  },
  "trmrk-angular-testapp": {
    dirPath: "libs\\trmrk-angular\\projects\\trmrk-angular-testapp\\src",
    syncedLibs: ["trmrk", "trmrk-browser"],
  },
  "trmrk-axios": {
    dirPath: "libs\\trmrk-axios\\src",
    syncedLibs: ["trmrk"],
  },
  "trmrk-browser": {
    dirPath: "libs\\trmrk-browser\\src",
    syncedLibs: ["trmrk", "trmrk-axios"],
  },
  "trmrk-svelte": {
    dirPath: "libs\\trmrk-svelte\\src",
    syncedLibs: ["trmrk", "trmrk-browser", "trmrk-axios"],
  },
  "trmrk-filemanager-nglib": {
    dirPath:
      "libs\\trmrk-filemanager-nglib\\projects\\trmrk-filemanager-nglib\\src",
    syncedLibs: [
      "trmrk",
      "trmrk-browser",
      "trmrk-angular",
      "trmrk-testing-nglib",
    ],
  },
  "trmrk-mailbox-nglib": {
    dirPath: "libs\\trmrk-mailbox-nglib\\projects\\trmrk-mailbox-nglib\\src",
    syncedLibs: [
      "trmrk",
      "trmrk-browser",
      "trmrk-angular",
      "trmrk-testing-nglib",
    ],
  },
  "trmrk-text-transform-behavior": {
    dirPath: "libs\\trmrk-text-transform-behavior\\src",
    syncedLibs: ["trmrk"],
  },
  "trmrk-text-transform-defaultbehavior": {
    dirPath: "libs\\trmrk-text-transform-defaultbehavior\\src",
    syncedLibs: ["trmrk", "trmrk-text-transform-behavior"],
  },
  "trmrk-text-transform-mybehavior": {
    dirPath: "libs\\trmrk-text-transform-mybehavior\\src",
    syncedLibs: ["trmrk", "trmrk-text-transform-behavior"],
  },
  "trmrk-text-transform-behavior-testapp": {
    dirPath: "libs\\trmrk-text-transform-behavior-testapp\\src",
    syncedLibs: [
      "trmrk",
      "trmrk-text-transform-behavior",
      "trmrk-text-transform-mybehavior",
    ],
  },
  "trmrk-notes-nglib": {
    dirPath: "libs\\trmrk-notes-nglib\\projects\\trmrk-notes-nglib\\src",
    syncedLibs: [
      "trmrk",
      "trmrk-browser",
      "trmrk-angular",
      "trmrk-testing-nglib",
      "trmrk-filemanager-nglib",
    ],
  },
  "trmrk-notes-sveltelib": {
    dirPath: "libs\\trmrk-notes-sveltelib\\src",
    syncedLibs: ["trmrk", "trmrk-axios", "trmrk-browser", "trmrk-svelte"],
  },
  "trmrk-testing-nglib": {
    dirPath: "libs\\trmrk-testing-nglib\\projects\\trmrk-testing-nglib\\src",
    syncedLibs: ["trmrk", "trmrk-browser", "trmrk-angular"],
  },
  "trmrk-mkscripts-jsws-sync-behavior": {
    dirPath: "libs\\trmrk-mkscripts-jsws-sync-behavior\\src",
    syncedLibs: ["trmrk"],
  },
  "trmrk-mkscripts-jsws-sync-behavior-testapp": {
    dirPath: "libs\\trmrk-mkscripts-jsws-sync-behavior-testapp\\src",
    syncedLibs: ["trmrk", "trmrk-mkscripts-jsws-sync-behavior"],
  },
  "trmrk-filemanager-ngapp": {
    dirPath: "apps\\trmrk-filemanager-ngapp\\src",
    syncedLibs: [
      "trmrk",
      "trmrk-browser",
      "trmrk-angular",
      "trmrk-filemanager-nglib",
      "trmrk-testing-nglib",
    ],
  },
  "trmrk-http-proxy-nodejsapp": {
    dirPath: "apps\\trmrk-http-proxy-nodejsapp\\src",
    syncedLibs: ["trmrk"],
  },
  "trmrk-mailbox-ngapp": {
    dirPath: "apps\\trmrk-mailbox-ngapp\\src",
    syncedLibs: [
      "trmrk",
      "trmrk-browser",
      "trmrk-angular",
      "trmrk-mailbox-nglib",
      "trmrk-testing-nglib",
    ],
  },
  "trmrk-notes-ngapp": {
    dirPath: "apps\\trmrk-notes-ngapp\\src",
    syncedLibs: [
      "trmrk",
      "trmrk-browser",
      "trmrk-angular",
      "trmrk-filemanager-nglib",
      "trmrk-notes-nglib",
      "trmrk-testing-nglib",
    ],
  },
  "trmrk-notes-svelteapp": {
    dirPath: "apps\\trmrk-notes-svelteapp\\src",
    syncedLibs: [
      "trmrk",
      "trmrk-axios",
      "trmrk-browser",
      "trmrk-svelte",
      "trmrk-notes-sveltelib",
    ],
  },
  "trmrk-svelte-testapp": {
    dirPath: "apps\\trmrk-svelte-testapp\\src",
    syncedLibs: ["trmrk", "trmrk-axios", "trmrk-browser", "trmrk-svelte"],
  },
};

const scr = {
  call_sync: "CALL _sync",
  fst_diff: ":fst:diff",
  fst_pull: ":fst:pull",
  fst_push: ":fst:push",
  alldff: ":alldff",
  ppgp: ":ppgp",
  pf: ":pf:turmerik-jsws",
  call_fst_diff: "",
  call_fst_pull: "",
  call_fst_push: "",
  call_fst_push_ppgp: "",
};

scr.call_fst_diff = [scr.call_sync, scr.fst_diff, scr.pf].join(" ");
scr.call_fst_pull = [scr.call_sync, scr.fst_pull, scr.pf].join(" ");
scr.call_fst_push = [scr.call_sync, scr.fst_push, scr.pf].join(" ");

scr.call_fst_push_ppgp = [scr.call_sync, scr.fst_push, scr.ppgp, scr.pf].join(
  " "
);

const getJsWsSyncSrcSections = () =>
  Object.keys(srcFoldersArr).map((srcFolderName) => {
    const srcFolder = srcFoldersArr[srcFolderName];

    return {
      SectionName: `sync_src_${srcFolderName}`,
      RelDirPaths: {
        DirPath: `${srcFolder}\\_`,
      },
      FileGroups: [
        {
          Files: [
            {
              FileRelPath: "diff_all.bat",
              TextContent: [scr.call_fst_diff, srcFolderName].join(" "),
            },
            {
              FileRelPath: "pull_all.bat",
              TextContent: [scr.call_fst_pull, srcFolderName].join(" "),
            },
            {
              FileRelPath: "pull_from_this.bat",
              TextContent: [scr.call_fst_pull, srcFolderName].join(" "),
            },
          ],
        },
      ],
    } as ProfileSection;
  });

const getJsWsSyncDestnSections = () =>
  Object.keys(destnLocationsArr).map((destnLocationName) => {
    var destnLocation = destnLocationsArr[destnLocationName];

    const fileGroups: FilesGroup[] = [
      {
        RelDirPaths: {
          DirPath: "_",
        },
        Files: [
          {
            FileRelPath: "diff_all.bat",
            TextContent: [
              scr.call_fst_diff,
              ["*", destnLocationName].join(":"),
            ].join(" "),
          },
          {
            FileRelPath: "pull_all.bat",
            TextContent: [
              scr.call_fst_pull,
              ["*", destnLocationName].join(":"),
            ].join(" "),
          },
          {
            FileRelPath: "push_all.bat",
            TextContent: [
              scr.call_fst_push,
              ["*", destnLocationName].join(":"),
            ].join(" "),
          },
          {
            FileRelPath: "push_all_ppgp.bat",
            TextContent: [
              scr.call_fst_push_ppgp,
              ["*", destnLocationName].join(":"),
            ].join(" "),
          },
        ],
      },
      ...destnLocation.syncedLibs.map((syncedLib) => ({
        RelDirPaths: {
          DirPath: `${syncedLib}\\_`,
        },
        Files: [
          {
            FileRelPath: `diff_from_${syncedLib}.bat`,
            TextContent: [
              scr.call_fst_diff,
              [syncedLib, destnLocationName].join(":"),
            ].join(" "),
          },
          {
            FileRelPath: `pull_from_${syncedLib}.bat`,
            TextContent: [
              scr.call_fst_pull,
              [syncedLib, destnLocationName].join(":"),
            ].join(" "),
          },
          {
            FileRelPath: `push_to_${syncedLib}.bat`,
            TextContent: [
              scr.call_fst_push,
              [syncedLib, destnLocationName].join(":"),
            ].join(" "),
          },
          {
            FileRelPath: `push_to_${syncedLib}_ppgp.bat`,
            TextContent: [
              scr.call_fst_push_ppgp,
              [syncedLib, destnLocationName].join(":"),
            ].join(" "),
          },
        ],
      })),
      {
        Files: [
          {
            FileRelPath: ".gitignore",
            TextContent: destnLocation.syncedLibs.join("\n"),
          },
        ],
      },
    ];

    return {
      SectionName: `sync_destn_${destnLocationName}`,
      RelDirPaths: {
        DirPath: destnLocation.dirPath,
      },
      FileGroups: fileGroups,
    } as ProfileSection;
  });

export const getJsWsSyncProfile = (): Profile => ({
  ProfileName: "trmrk-mkscripts-jsws-sync",
  RelDirPaths: {
    DirPath: "|$TURMERIK_REPO_DIR|\\JsWs",
  },
  Sections: [
    {
      SectionName: "sync",
      RelDirPaths: {
        DirPath: "scripts\\sync",
      },
      FileGroups: [
        {
          Files: [
            {
              FileRelPath: "diff_all.bat",
              TextContent: scr.call_fst_diff,
            },
            {
              FileRelPath: "pull_all.bat",
              TextContent: scr.call_fst_pull,
            },
          ],
        },
      ],
    },
    ...getJsWsSyncSrcSections(),
    ...getJsWsSyncDestnSections(),
  ],
});
