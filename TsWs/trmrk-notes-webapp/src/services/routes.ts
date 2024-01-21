const path = "path";
const relPath = "relPath";

const route = (
  routeName: string,
  hasPath: boolean = true,
  hasRelPath: boolean = false
) => {
  let route = `/${routeName}`;

  if (hasPath) {
    if (hasRelPath) {
      route = `${route}/:${path}/:${relPath}`;
    } else {
      route = `${route}/:${path}`;
    }
  }

  return route;
};

export const routes = Object.freeze({
  home: "home",
  files: "files",
  notes: "notes",
  noteFiles: "note-files",
  pics: "pics",
  textFile: "text-file",
  note: "note",
  viewPicture: "view-picture",
  viewVideo: "view-video",
  viewAudio: "view-audio",
  downloadFile: "download-file",
});

export const appRoutes = Object.freeze({
  home: route(routes.home, false),
  filesRoot: route(routes.files, false),
  notesRoot: route(routes.notes, false),
  files: route(routes.files),
  notes: route(routes.notes),
  noteFiles: route(routes.noteFiles),
  pics: route(routes.pics),
  editTextFile: route(routes.textFile),
  editNote: route(routes.note),
  viewPicture: route(routes.viewPicture),
  viewVideo: route(routes.viewVideo),
  viewAudio: route(routes.viewAudio),
  downloadFile: route(routes.downloadFile),
});
