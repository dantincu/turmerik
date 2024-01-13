export class FsApiSvc {
  public rootDirHandle: FileSystemDirectoryHandle | null;

  constructor() {
    this.rootDirHandle = null;
  }
}

export const fsApiSvc = new FsApiSvc();
