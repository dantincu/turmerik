const idnf = "idnf";

const route = (routeName: string, hasIdnf: boolean = true) => {
  let route = `/${routeName}`;

  if (hasIdnf) {
    route = `${route}/:${idnf}`;
  }

  return route;
};

export const routes = Object.freeze({
  home: "home",
  files: "files",
  notes: "notes",
  pics: "pics",
  viewTextFile: "view-text-file",
  editTextFile: "edit-text-file",
  viewNote: "view-note",
  editNote: "edit-note",
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
  pics: route(routes.pics),
  viewTextFile: route(routes.viewTextFile),
  editTextFile: route(routes.editTextFile),
  viewNote: route(routes.viewNote),
  editNote: route(routes.editNote),
  viewPicture: route(routes.viewPicture),
  viewVideo: route(routes.viewVideo),
  viewAudio: route(routes.viewAudio),
  downloadFile: route(routes.downloadFile),
});
