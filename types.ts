
export interface Show {
  id: string;
  date: string;
  venue: string;
  city: string;
  ticketUrl: string;
}

export interface MusicLink {
  platform: 'spotify' | 'apple' | 'soundcloud' | 'youtube' | 'beatport';
  url: string;
}

export interface Release {
  id: string;
  title: string;
  imageUrl: string;
  links: MusicLink[];
}

export interface Socials {
  instagram: string;
  twitter: string;
  facebook: string;
  spotify: string;
  soundcloud: string;
}

export interface Content {
  artistName: string;
  logoUrl: string;
  heroImage: string;
  soundcloudEmbedUrl: string;
  socials: Socials;
  releases: Release[];
  shows: Show[];
}
