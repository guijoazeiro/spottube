export interface YoutubeTracksInterface {
  kind: string;
  etag: string;
  items: Item[];
  nextPageToken?: string;
  pageInfo: PageInfo;
}
export interface PageInfo {
  totalResults: number;
  resultsPerPage: number;
}
export interface Item {
  kind: string;
  etag: string;
  id: string;
  snippet: Snippet;
  contentDetails: ContentDetails;
}
export interface ContentDetails {
  videoId: string;
  videoPublishedAt?: string;
}
export interface Snippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: Thumbnails;
  channelTitle: string;
  playlistId: string;
  position: number;
  resourceId: ResourceId;
  videoOwnerChannelTitle?: string;
  videoOwnerChannelId?: string;
}
export interface ResourceId {
  kind: string;
  videoId: string;
}
export interface Thumbnails {
  default?: Default;
  medium?: Default;
  high?: Default;
  standard?: Default;
}
export interface Default {
  url: string;
  width: number;
  height: number;
}
