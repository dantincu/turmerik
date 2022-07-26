export const getFileNameAndExtension = (fileName: string) => {
  let fileNameWithoutExtension = fileName;
  let fileNameExtension = "";

  const lastIdxOf = fileName.lastIndexOf(".");

  if (lastIdxOf >= 0) {
    fileNameWithoutExtension = fileName.substring(0, lastIdxOf);
    fileNameExtension = fileName.substring(lastIdxOf);
  }

  return [fileNameWithoutExtension, fileNameExtension];
};

export const bsMiscFileTypes = Object.freeze([
  ".aac",
  ".ai",
  ".bmp",
  ".cs",
  ".css",
  ".csv",
  ".exe",
  ".gif",
  ".heic",
  ".html",
  ".java",
  ".jpg",
  ".js",
  ".json",
  ".jsx",
  ".key",
  ".m4p",
  ".md",
  ".mdx",
  ".mov",
  ".mp3",
  ".mp4",
  ".otf",
  ".php",
  ".png",
  ".ppt",
  ".pptx",
  ".psd",
  ".py",
  ".raw",
  ".rb",
  ".sass",
  ".scss",
  ".sh",
  ".sql",
  ".svg",
  ".tiff",
  ".tsx",
  ".ttf",
  ".wav",
  ".woff",
  ".xls",
  ".xlsx",
  ".xml",
  ".yml",
]);

export const getFileNameBsIconCssClass = (fileNameExtension: string) => {
  let iconCssClass: string;
  fileNameExtension = fileNameExtension.trim().toLocaleLowerCase();

  if (bsMiscFileTypes.indexOf(fileNameExtension) >= 0) {
    iconCssClass = ["bi bi", "filetype", fileNameExtension.substring(1)].join(
      "-"
    );
  } else {
    switch (fileNameExtension) {
      case ".txt":
        iconCssClass = "bi bi-file-text-fill";
        break;
      case ".doc":
        iconCssClass = "bi bi-file-word";
        break;
      case ".docx":
        iconCssClass = "bi bi-file-word-fill";
        break;
      case ".zip":
        iconCssClass = "bi bi-file-zip-fill";
        break;
      case ".pdf":
        iconCssClass = "bi bi-file-pdf-fill";
        break;
      case ".rar":
        iconCssClass = "bi bi-file-zip";
        break;
      case ".avi":
      case ".m4a":
      case ".mpg":
      case ".mpeg":
      case ".ogg":
        iconCssClass = "bi bi-film";
        break;
      case ".jpeg":
      case ".ico":
        iconCssClass = "bi bi-image";
        break;
      case ".flac":
        iconCssClass = "bi bi-file-music-fill";
        break;
      default:
        iconCssClass = "bi bi-file-earmark";
        break;
    }
  }

  return iconCssClass;
};
