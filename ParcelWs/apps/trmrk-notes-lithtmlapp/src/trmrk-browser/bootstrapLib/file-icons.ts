export const boostrapKnownFileTypeIcons = Object.freeze([
  "aac",
  "ai",
  "bmp",
  "cs",
  "css",
  "csv",
  "doc",
  "docx",
  "exe",
  "gif",
  "heic",
  "html",
  "java",
  "jpg",
  "js",
  "json",
  "jsx",
  "key",
  "m4p",
  "md",
  "mdx",
  "mov",
  "mp3",
  "mp4",
  "otf",
  "pdf",
  "php",
  "png",
  "ppt",
  "pptx",
  "psd",
  "py",
  "raw",
  "rb",
  "sass",
  "scss",
  "sh",
  "sql",
  "svg",
  "tiff",
  "tsx",
  "ttf",
  "txt",
  "wav",
  "woff",
  "xls",
  "xlsx",
  "xml",
  "yml",
]);

export const codeFileExtensions = Object.freeze([
  "config",
  "csx",
  "htm",
  "toml",
  "ts",
  "tsx",
  "xaml",
  "yaml",
]);

export const getBootstrapFileIcon = (extn: string) => {
  let bsIconCssClass: string | null = null;

  if ((extn ?? "") !== "") {
    if (boostrapKnownFileTypeIcons.indexOf(extn) >= 0) {
      bsIconCssClass = `bi-filetype-${extn}`;
    } else if (codeFileExtensions.indexOf(extn) >= 0) {
      bsIconCssClass = "bi-code";
    }
  }

  bsIconCssClass ??= "bi-file-fill";
  return bsIconCssClass;
};
