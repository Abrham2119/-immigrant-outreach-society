export const getFileName = (url: string): string => {
  const filename = url?.split("/").pop() || "";
  return filename.length > 20 ? filename.substring(0, 20) + "..." : filename;
};

export const getFileNameWithOutTruncate = (url: string): string => {
  return url?.split("/").pop() || "";
};
