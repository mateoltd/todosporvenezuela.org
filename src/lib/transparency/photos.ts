export type TransparencyPhotoFormat = "avif" | "webp" | "jpg";

const transparencyPhotoCdnBase =
  "https://cdn.todosporvenezuela.org/photos/transparency/optimized";

const transparencyPhotoFolders = {
  avif: "avif",
  webp: "webp",
  jpg: "jpeg",
} as const satisfies Record<TransparencyPhotoFormat, string>;

const transparencyPhotoExtensions = {
  avif: "avif",
  webp: "webp",
  jpg: "jpg",
} as const satisfies Record<TransparencyPhotoFormat, string>;

export const transparencyPhotoDimensions = {
  width: 1500,
  height: 2000,
} as const;

export const transparencyPhotoUrl = (
  name: string,
  format: TransparencyPhotoFormat,
) => {
  const folder = transparencyPhotoFolders[format];
  const extension = transparencyPhotoExtensions[format];

  return `${transparencyPhotoCdnBase}/${folder}/${name}.${extension}`;
};

export const getTransparencyPhotoSources = (name: string) => ({
  avif: transparencyPhotoUrl(name, "avif"),
  webp: transparencyPhotoUrl(name, "webp"),
  jpg: transparencyPhotoUrl(name, "jpg"),
});
