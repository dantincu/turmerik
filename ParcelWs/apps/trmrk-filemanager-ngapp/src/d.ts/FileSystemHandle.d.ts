interface FileSystemPermissionDescriptor {
  mode: 'read' | 'write' | readwrite;
}

interface FileSystemHandle {
  queryPermission: (options?: FileSystemPermissionDescriptor) => Promise<PermissionState>;
  requestPermission: (options?: FileSystemPermissionDescriptor) => Promise<PermissionState>;
}
