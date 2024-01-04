import { core as trmrk } from "trmrk";

export const readFileBytes = (file: File) => {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    try {
      const fileName = file.name;
      var reader = new FileReader();

      const listener = (event: ProgressEvent<FileReader>) => {
        reader.removeEventListener("loadend", listener);

        if (event.target && event.target.result) {
          const buffer = event.target.result as ArrayBuffer;
          resolve(buffer);
        } else {
          reject(
            new Error(`Could not not read contents from file ${fileName}`)
          );
        }
      };

      reader.addEventListener("loadend", listener);
      reader.readAsArrayBuffer(file);
    } catch (err) {
      reject(err);
    }
  });
};

export const writeToFile = async (
  fileStream: FileSystemWritableFileStream,
  data: ArrayBuffer | DataView | Blob | string
) => {
  const streamWriter = fileStream.getWriter();
  await streamWriter.write(data);

  await streamWriter.close();
};

export const copyFile = async (
  file: File,
  newPrFolderHandle: FileSystemDirectoryHandle,
  newFileName: string | null = null
) => {
  newFileName ??= file.name;
  const arrayBuffer = await readFileBytes(file);

  const newFileHandle = await newPrFolderHandle.getFileHandle(newFileName, {
    create: true,
  });

  const newFile = await newFileHandle.createWritable({
    keepExistingData: false,
  });

  await writeToFile(newFile, arrayBuffer);
  return newFileHandle;
};

export const moveFile = async (
  prFolderHandle: FileSystemDirectoryHandle,
  file: File,
  newPrFolderHandle: FileSystemDirectoryHandle,
  newFileName: string | null = null
) => {
  const fileName = file.name;
  const newFileHandle = await copyFile(file, newPrFolderHandle, newFileName);

  await prFolderHandle.removeEntry(fileName);
  return newFileHandle;
};
