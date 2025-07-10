
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      artist_info: {
        Row: {
          artist_name: string | null
          hero_image: string | null
          id: number
          logo_url: string | null
          soundcloud_embed_url: string | null
          socials: Json | null
        }
        Insert: {
          artist_name?: string | null
          hero_image?: string | null
          id?: number
          logo_url?: string | null
          soundcloud_embed_url?: string | null
          socials?: Json | null
        }
        Update: {
          artist_name?: string | null
          hero_image?: string | null
          id?: number
          logo_url?: string | null
          soundcloud_embed_url?: string | null
          socials?: Json | null
        }
        Relationships: []
      }
      release_links: {
        Row: {
          id: number
          platform: string | null
          release_id: number | null
          url: string | null
        }
        Insert: {
          id?: number
          platform?: string | null
          release_id?: number | null
          url?: string | null
        }
        Update: {
          id?: number
          platform?: string | null
          release_id?: number | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "release_links_release_id_fkey"
            columns: ["release_id"]
            isOneToOne: false
            referencedRelation: "releases"
            referencedColumns: ["id"]
          },
        ]
      }
      releases: {
        Row: {
          id: number
          image_url: string | null
          title: string | null
        }
        Insert: {
          id?: number
          image_url?: string | null
          title?: string | null
        }
        Update: {
          id?: number
          image_url?: string | null
          title?: string | null
        }
        Relationships: []
      }
      shows: {
        Row: {
          city: string | null
          date: string | null
          id: number
          ticket_url: string | null
          venue: string | null
          event_name: string | null
        }
        Insert: {
          city?: string | null
          date?: string | null
          id?: number
          ticket_url?: string | null
          venue?: string | null
        }
        Update: {
          city?: string | null
          date?: string | null
          id?: number
          ticket_url?: string | null
          venue?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Insert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Update<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// App-specific types for convenience
export type ArtistInfo = Tables<'artist_info'>;
export type Show = Tables<'shows'>;
export type ReleaseLink = Tables<'release_links'>;
export type Release = Tables<'releases'> & { release_links: ReleaseLink[] };

export type Socials = {
  instagram: string;
  twitter: string;
  facebook: string;
  spotify: string;
  soundcloud: string;
}
