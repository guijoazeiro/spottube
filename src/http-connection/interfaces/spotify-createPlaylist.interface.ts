export interface CreatePlaylistInterface {
  collaborative: boolean;
  description?: any;
  external_urls: Externalurls;
  followers: Followers;
  href: string;
  id: string;
  images: any[];
  primary_color?: any;
  name: string;
  type: string;
  uri: string;
  owner: Owner;
  public: boolean;
  snapshot_id: string;
  tracks: Tracks;
}
interface Tracks {
  limit: number;
  next?: any;
  offset: number;
  previous?: any;
  href: string;
  total: number;
  items: any[];
}
interface Owner {
  href: string;
  id: string;
  type: string;
  uri: string;
  display_name?: any;
  external_urls: Externalurls;
}
interface Followers {
  href?: any;
  total: number;
}
interface Externalurls {
  spotify: string;
}
