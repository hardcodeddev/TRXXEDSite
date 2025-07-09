import React, { useState, useEffect } from 'react';
import { Content, Show, Release } from './types';
import { AdminPanel } from './components/AdminPanel';
import { PlatformIcon } from './components/icons/PlatformIcons';
import initialContent from './data/content.json' with { type: 'json' };

const App: React.FC = () => {
  const [content, setContent] = useState<Content>(initialContent as Content);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminMode = () => {
        setIsAdmin(window.location.hash === '#admin');
    };
    checkAdminMode();
    window.addEventListener('hashchange', checkAdminMode);
    return () => {
        window.removeEventListener('hashchange', checkAdminMode);
    };
  }, []);

  if (!content) {
    return <div className="min-h-screen flex items-center justify-center bg-primary text-hotpink font-heading text-2xl">Error: Content could not be loaded.</div>;
  }
  
  const handleContentChange = (newContent: Content) => {
    setContent(newContent);
  };

  return (
    <div className={`bg-primary text-gray-200 min-h-screen ${isAdmin ? 'pb-80' : ''}`}>
      <Header content={content} />
      <main>
        <HeroSection content={content} />
        <MusicSection content={content} />
        <ShowsSection content={content} />
      </main>
      <Footer content={content} />
      {isAdmin && <AdminPanel content={content} onContentChange={handleContentChange} />}
    </div>
  );
};

const Header: React.FC<{ content: Content }> = ({ content }) => (
  <header className="sticky top-0 left-0 right-0 z-30 p-4 bg-primary/80 backdrop-blur-md border-b border-secondary/50">
    <div className="container mx-auto flex justify-between items-center">
      <a href="#"><img src={content.logoUrl} alt={`${content.artistName} Logo`} className="h-10 md:h-12" /></a>
      <nav className="hidden md:flex items-center space-x-6">
          <a href="#music" className="font-semibold hover:text-accent transition-colors">Music</a>
          <a href="#tour" className="font-semibold hover:text-accent transition-colors">Tour</a>
      </nav>
      <div className="flex items-center space-x-4">
        {Object.entries(content.socials).map(([platform, url]) => (
          <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent transition-colors">
            <PlatformIcon platform={platform as any} className="w-6 h-6"/>
          </a>
        ))}
      </div>
    </div>
  </header>
);

const HeroSection: React.FC<{ content: Content }> = ({ content }) => (
  <section 
    className="relative min-h-screen flex items-center justify-center text-center bg-cover bg-center bg-fixed" 
    style={{ backgroundImage: `url(${content.heroImage})` }}>
    <div className="absolute inset-0 bg-black/70"></div>
    <div className="relative z-10 p-4 flex flex-col items-center">
    <h1
  className="text-[100px] font-bold uppercase text-[#c62828] relative z-10 pulsating-black"
  style={{
    fontFamily: "'Creepster', cursive",
  }}
>
  TRXXED
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

       <a href="#music" className="mt-8 bg-accent text-primary font-bold font-heading px-8 py-3 rounded-full shadow-lg hover:bg-accent-hover transition-all transform hover:scale-105 uppercase tracking-widest">
        Explore Music
      </a>
    </div>
  </section>
);

const MusicSection: React.FC<{ content: Content }> = ({ content }) => (
    <section id="music" className="py-20 bg-primary">
        <div className="container mx-auto px-4">
            <h2 className="text-5xl font-heading font-bold text-center mb-12 text-accent uppercase tracking-wider">Latest Releases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                {content.releases.map(release => <ReleaseCard key={release.id} release={release} />)}
            </div>
            <h2 className="text-5xl font-heading font-bold text-center mb-8 text-accent uppercase tracking-wider">SoundCloud</h2>
            <div className="w-full max-w-4xl mx-auto rounded-lg overflow-hidden border-2 border-secondary">
              <iframe 
                width="100%" 
                height="450" 
                scrolling="no" 
                frameBorder="no" 
                allow="autoplay" 
                src={content.soundcloudEmbedUrl}>
              </iframe>
            </div>
        </div>
    </section>
);

const ReleaseCard: React.FC<{ release: Release }> = ({ release }) => (
    <div className="bg-secondary rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300 group border border-transparent hover:border-accent">
        <div className="overflow-hidden">
          <img src={release.imageUrl} alt={release.title} className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="p-6">
            <h3 className="text-2xl font-bold font-heading mb-4 truncate">{release.title}</h3>
            <div className="flex space-x-4">
                {release.links.map(link => (
                    <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" 
                       className="text-gray-400 hover:text-accent transition-colors transform hover:scale-110">
                        <PlatformIcon platform={link.platform} className="w-8 h-8"/>
                    </a>
                ))}
            </div>
        </div>
    </div>
);

const ShowsSection: React.FC<{ content: Content }> = ({ content }) => (
  <section id="tour" className="py-20 bg-secondary">
    <div className="container mx-auto px-4">
      <h2 className="text-5xl font-heading font-bold text-center mb-12 text-accent uppercase tracking-wider">Upcoming Shows</h2>
      <div className="max-w-4xl mx-auto">
        <ul className="space-y-4">
          {content.shows.map((show, index) => <ShowItem key={show.id} show={show} index={index}/>)}
        </ul>
      </div>
    </div>
  </section>
);

const ShowItem: React.FC<{ show: Show; index: number }> = ({ show, index }) => {
  const date = new Date(show.date + 'T00:00:00'); // Treat date as local
  const day = date.toLocaleDateString('en-US', { day: '2-digit' });
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();

  return (
    <li 
        className="flex flex-col md:flex-row items-center justify-between bg-primary p-4 rounded-lg shadow-md hover:bg-gray-900 transition-all duration-300 opacity-0 animate-fade-in-up"
        style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-center mb-4 md:mb-0 text-center md:text-left">
        <div className="text-center w-20 mr-6 border-r-2 border-accent/30 pr-6">
          <p className="text-4xl font-bold text-accent">{day}</p>
          <p className="text-md font-semibold tracking-widest">{month}</p>
        </div>
        <div>
          <h3 className="text-xl font-bold font-heading">{show.venue}</h3>
          <p className="text-gray-400">{show.city}</p>
        </div>
      </div>
      <a href={show.ticketUrl} target="_blank" rel="noopener noreferrer" className="bg-hotpink text-white font-bold px-8 py-2 rounded-full shadow-lg hover:bg-hotpink-hover transition-all transform hover:scale-105">
        Tickets
      </a>
    </li>
  );
};

const Footer: React.FC<{ content: Content }> = ({ content }) => {
    const toggleAdmin = () => {
        if (window.location.hash === '#admin') {
            window.location.hash = '';
        } else {
            window.location.hash = '#admin';
        }
    }
    return (
        <footer className="bg-primary border-t border-secondary/50 py-8 text-center text-gray-500">
            <div className="container mx-auto">
                <div className="flex justify-center space-x-6 mb-4">
                     {Object.entries(content.socials).map(([platform, url]) => (
                      <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent transition-colors">
                        <PlatformIcon platform={platform as any} className="w-7 h-7"/>
                      </a>
                    ))}
                </div>
                <p>&copy; {new Date().getFullYear()} {content.artistName}. All Rights Reserved.</p>
                <button onClick={toggleAdmin} title="Toggle Admin Panel" className="mt-4 text-gray-600 hover:text-accent transition-colors">
                     <svg className="w-5 h-5 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                    </svg>
                    <span className="text-xs ml-1">Admin</span>
                </button>
            </div>
        </footer>
    );
}


export default App;