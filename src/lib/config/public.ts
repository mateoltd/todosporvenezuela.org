import { z } from "zod";
import { envString, getEnvSource, type EnvSource } from "./env";

const organizerVideoConfigSchema = z.object({
  PUBLIC_ORGANIZER_VIDEO_SRC: envString(
    "https://media.mateo.ltd/proj/AQOjGu8elxJIMIT21rU3HW79VS3vEg36BXl1x19_ewzoNvDxVhmaYJl2yWMxY1Vdvc0pwnyg75qRn3ej1DwzRFqtK06kXueZ.mp4",
  ),
  PUBLIC_ORGANIZER_VIDEO_TITLE: envString(
    "Video de los organizadores de Todos por Venezuela",
  ),
  PUBLIC_ORGANIZER_VIDEO_URL: envString("https://www.instagram.com/p/DaD7tL_vjyc/"),
});

export const getOrganizerVideoConfig = (env?: EnvSource) => {
  const config = organizerVideoConfigSchema.parse(getEnvSource(env));

  return {
    sourceUrl: config.PUBLIC_ORGANIZER_VIDEO_URL,
    src: config.PUBLIC_ORGANIZER_VIDEO_SRC,
    title: config.PUBLIC_ORGANIZER_VIDEO_TITLE,
  };
};
