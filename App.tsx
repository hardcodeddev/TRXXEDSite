

import React, { useState, useEffect } from 'react';
import { ArtistInfo, Show, Release, Socials } from './types';
import { AdminPanel } from './components/AdminPanel';
import { PlatformIcon } from './components/icons/PlatformIcons';
import { Modal } from './components/common/Modal';
import { supabase } from './supabase/supabase';
import { Session } from '@supabase/supabase-js';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [artistInfo, setArtistInfo] = useState<ArtistInfo | null>(null);
  const [releases, setReleases] = useState<Release[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: artistInfoData, error: artistInfoError } = await supabase
          .from('artist_info')
          .select('*')
          .single();
        if (artistInfoError) throw artistInfoError;
        setArtistInfo(artistInfoData);

        const { data: showsData, error: showsError } = await supabase
          .from('shows')
          .select('*')
          .order('date', { ascending: true });
        if (showsError) throw showsError;
        setShows(showsData);

        const { data: releasesData, error: releasesError } = await supabase
          .from('releases')
          .select(`
                *,
                release_links (
                    *
                )
            `)
          .order('id', { ascending: false });
        if (releasesError) throw releasesError;
        setReleases(releasesData as Release[]);

      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError("Could not load artist data. Please check the connection and configuration.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up auth listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Set up admin panel visibility listener
    const handleHashChange = () => {
      setIsAdmin(window.location.hash === '#admin');
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  }

  const refreshData = async () => {
    // This is a simplified refresh, a more robust solution might involve re-fetching specific data
    const { data: showsData, error: showsError } = await supabase
      .from('shows')
      .select('*')
      .order('date', { ascending: true });
    if (showsData) setShows(showsData);

    const { data: releasesData, error: releasesError } = await supabase
      .from('releases')
      .select(`*, release_links(*)`)
      .order('id', { ascending: false });
    if (releasesData) setReleases(releasesData as Release[]);
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-primary text-hotpink font-heading text-2xl animate-pulse">Loading...</div>;
  }

  if (error || !artistInfo) {
    return <div className="min-h-screen flex items-center justify-center bg-primary text-hotpink font-heading text-2xl p-8 text-center">{error}</div>;
  }
  console.log(artistInfo.logo_url);

  return (
    <div className={`bg-primary text-gray-200 min-h-screen ${isAdmin && session ? 'pb-96' : ''}`}>
      <Header artistInfo={artistInfo} />
      <main>
        <HeroSection artistInfo={artistInfo} />
        <MusicSection releases={releases} artistInfo={artistInfo} />
        <ShowsSection shows={shows} />
      </main>
      <Footer artistInfo={artistInfo} onLogout={handleLogout} isLoggedIn={!!session} />
      {isAdmin && !session && <Auth />}
      {isAdmin && session && <AdminPanel shows={shows} releases={releases} onDataChange={refreshData} />}
    </div>
  );
};

// Authentication Component
const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccessMessage("Sign up successful! You can now sign in using the 'Sign In' tab.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.error_description || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={() => { window.location.hash = '' }} title={isSignUp ? 'Admin Sign Up' : 'Admin Login'}>
      <div className="p-4">
        <div className="flex border-b border-gray-700 mb-4">
          <button onClick={() => setIsSignUp(false)} className={`py-2 px-4 font-semibold ${!isSignUp ? 'text-accent border-b-2 border-accent' : 'text-gray-400'}`}>Sign In</button>
          <button onClick={() => setIsSignUp(true)} className={`py-2 px-4 font-semibold ${isSignUp ? 'text-accent border-b-2 border-accent' : 'text-gray-400'}`}>Sign Up</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-gray-400">
            {isSignUp ? 'Create the admin account. This should only be done once.' : 'Sign in to manage content.'}
          </p>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent" />
          {successMessage && !error && <p className="text-green-400 text-sm">{successMessage}</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-hotpink text-white font-bold px-4 py-2 rounded hover:bg-hotpink-hover transition-colors disabled:bg-gray-500">
            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>
      </div>
    </Modal>
  );
};


// UI Components
const Header: React.FC<{ artistInfo: ArtistInfo }> = ({ artistInfo }) => (
  <header className="absolute top-0 left-0 right-0 z-10 p-4">
    <div className="container mx-auto flex justify-center md:justify-start">
      <img src={artistInfo.logo_url || ''} alt={`${artistInfo.artist_name} Logo`} className="h-10 md:h-12" />
    </div>
  </header>
);

const HeroSection: React.FC<{ artistInfo: ArtistInfo }> = ({ artistInfo }) => (
  <section id="home" className="relative h-[80vh] min-h-[500px] flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: `url(${artistInfo.hero_image})` }}>
    <div className="absolute inset-0 bg-primary bg-opacity-60"></div>
    <div className="relative z-10 px-4">
      <h1
        className="text-[100px] font-bold uppercase text-[#c62828] relative z-10 pulsating-black"
        style={{
          fontFamily: "'Creepster', cursive",
        }}
      >
        {artistInfo.artist_name}
      </h1>
      <style jsx global>{`
  @keyframes black-pulse {
    0%, 100% {
      text-shadow: 0 0 5px black;
    }
    50% {
      text-shadow: 0 0 15px black, 0 0 25px black, 0 0 35px black;
    }
  }

  .pulsating-black {
    animation: black-pulse 2.5s ease-in-out infinite;
  }
`}</style>

      <a href="#music" className="mt-8 inline-block bg-accent text-primary font-bold uppercase px-8 py-3 rounded-full hover:bg-accent-hover transition-transform transform hover:scale-105">
        Listen Now
      </a>
    </div>
  </section>
);

const MusicSection: React.FC<{ releases: Release[], artistInfo: ArtistInfo }> = ({ releases, artistInfo }) => (
  <section id="music" className="py-20 bg-secondary">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-heading text-center mb-12">Music</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {releases.map((release, index) => (
          <div key={release.id} className="bg-primary p-4 rounded-lg shadow-lg group opacity-0 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
            <img src={release.image_url || ''} alt={release.title || ''} className="w-full h-auto object-cover rounded-md mb-4" />
            <h3 className="text-xl font-bold mb-2">{release.title}</h3>
            <div className="flex space-x-4">
              {(release.release_links || []).map(link => (
                <a key={link.id} href={link.url || '#'} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent transition-colors">
                  <PlatformIcon platform={link.platform} />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-16">
        {artistInfo.soundcloud_embed_url && (
          <iframe
            width="100%"
            height="166"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src={artistInfo.soundcloud_embed_url}>
          </iframe>
        )}
      </div>
    </div>
  </section>
);

const ShowsSection: React.FC<{ shows: Show[] }> = ({ shows }) => (
  <section id="shows" className="py-20">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-heading text-center mb-12">Tour Dates</h2>
      <div className="max-w-4xl mx-auto">
        {shows.map(show => (
          <div key={show.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center mb-4 p-4 bg-secondary rounded-lg">
            <div className="text-gray-400">{new Date(show.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div className="font-bold text-accent">{show.event_name}</div>
            <div>{show.venue}</div>
            <div className="text-gray-400">{show.city}</div>
            <a href={show.ticket_url || '#'} target="_blank" rel="noopener noreferrer" className="bg-hotpink text-white font-bold text-center px-4 py-2 rounded hover:bg-hotpink-hover transition-colors md:ml-auto">
              Tickets
            </a>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Footer: React.FC<{ artistInfo: ArtistInfo, onLogout: () => void, isLoggedIn: boolean }> = ({ artistInfo, onLogout, isLoggedIn }) => {
  const socials = artistInfo.socials as Socials | null;
  return (
    <footer className="bg-secondary py-12">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center space-x-6 mb-6">
          {socials?.instagram && <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Instagram</a>}
          {socials?.twitter && <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Twitter</a>}
          {socials?.facebook && <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Facebook</a>}
          {socials?.spotify && <a href={socials.spotify} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Spotify</a>}
          {socials?.soundcloud && <a href={socials.soundcloud} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">SoundCloud</a>}
        </div>
        <p className="text-gray-500">&copy; {new Date().getFullYear()} {artistInfo.artist_name || 'Artist Name'}. All Rights Reserved.</p>
        {isLoggedIn && (
          <button onClick={onLogout} className="mt-4 text-sm text-gray-600 hover:text-hotpink">Logout Admin</button>
        )}
      </div>
    </footer>
  )
};

export default App;