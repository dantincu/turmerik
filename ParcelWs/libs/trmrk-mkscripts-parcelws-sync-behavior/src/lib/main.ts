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
  "trmrk-axios": "libs\\trmrk-axios\\src\\lib",
  "trmrk-browser": "libs\\trmrk-browser\\src\\lib",
  "trmrk-blazor": "libs\\trmrk-blazor\\src\\lib",
  "trmrk-react": "libs\\trmrk-react\\src\\lib",
  "trmrk-text-transform-behavior":
    "libs\\trmrk-text-transform-behavior\\src\\lib",
  "trmrk-text-transform-defaultbehavior":
    "libs\\trmrk-text-transform-defaultbehavior\\src\\lib",
  "trmrk-text-transform-mybehavior":
    "libs\\trmrk-text-transform-mybehavior\\src\\lib",
  "trmrk-mkscripts-parcelws-sync-behavior":
    "libs\\trmrk-mkscripts-parcelws-sync-behavior\\src\\lib",
};

const destnLocationsArr: {
  [key: string]: { dirPath: string; syncedLibs: string[] };
} = {
  "trmrk-axios": {
    dirPath: "libs\\trmrk-axios\\src",
    syncedLibs: ["trmrk"],
  },
  "trmrk-browser": {
    dirPath: "libs\\trmrk-browser\\src",
    syncedLibs: ["trmrk", "trmrk-axios"],
  },
  "trmrk-blazor": {
    dirPath: "libs\\trmrk-blazor\\src",
    syncedLibs: ["trmrk", "trmrk-axios", "trmrk-browser"],
  },
  "trmrk-react": {
    dirPath: "libs\\trmrk-react\\src",
    syncedLibs: ["trmrk", "trmrk-axios", "trmrk-browser"],
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
  "trmrk-notes-blazorapp": {
    dirPath: "apps\\trmrk-notes-blazorapp\\src",
    syncedLibs: ["trmrk", "trmrk-axios", "trmrk-browser", "trmrk-blazor"],
  },
  "trmrk-react-testapp": {
    dirPath: "apps\\trmrk-react-testapp\\src",
    syncedLibs: ["trmrk", "trmrk-axios", "trmrk-browser", "trmrk-react"],
  },
  "trmrk-mkscripts-parcelws-sync-behavior": {
    dirPath: "libs\\trmrk-mkscripts-parcelws-sync-behavior\\src",
    syncedLibs: ["trmrk"],
  },
  "trmrk-mkscripts-parcelws-sync-behavior-testapp": {
    dirPath: "libs\\trmrk-mkscripts-parcelws-sync-behavior-testapp\\src",
    syncedLibs: ["trmrk", "trmrk-mkscripts-parcelws-sync-behavior"],
  },
};

const scr = {
  call_sync: "CALL _sync",
  fst_diff: ":fst:diff",
  fst_pull: ":fst:pull",
  fst_push: ":fst:push",
  alldff: ":alldff",
  ppgp: ":ppgp",
  pf: ":pf:turmerik-parcelws",
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

const getParcelWsSyncSrcSections = () =>
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
              FileRelPath: "push_this.bat",
              TextContent: [scr.call_fst_push, srcFolderName].join(" "),
            },
          ],
        },
      ],
    } as ProfileSection;
  });

const getParcelWsSyncDestnSections = () =>
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
    ];

    return {
      SectionName: `sync_destn_${destnLocationName}`,
      RelDirPaths: {
        DirPath: destnLocation.dirPath,
      },
      FileGroups: fileGroups,
    } as ProfileSection;
  });

export const getParcelWsSyncProfile = (): Profile => ({
  ProfileName: "trmrk-mkscripts-parcelws-sync",
  RelDirPaths: {
    DirPath: "|$TURMERIK_REPO_DIR|\\ParcelWs",
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
    ...getParcelWsSyncSrcSections(),
    ...getParcelWsSyncDestnSections(),
  ],
});
