import type { SpaceType } from '../types/models';
import spaceDefaultIcon from '../images/Space_default.ico';
import modelDefaultIcon from '../images/Model_default.ico';
import datasetDefaultIcon from '../images/Dataset_default.ico';

const DEFAULT_ICONS: Record<SpaceType, string> = {
  space: spaceDefaultIcon,
  model: modelDefaultIcon,
  dataset: datasetDefaultIcon
};

export function getDefaultThumbnail(type: SpaceType): string {
  return DEFAULT_ICONS[type] || DEFAULT_ICONS.space;
}

export function getThumbnailUrl(url: string | null | undefined, type: SpaceType): string {
  if (!url || url.includes('unsplash.com')) {
    return getDefaultThumbnail(type);
  }
  return url;
}