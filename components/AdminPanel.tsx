
import React, { useState } from 'react';
import { Show, Release, ReleaseLink, Insert, Update } from '../types';
import { Modal } from './common/Modal';
import { supabase } from '../supabase/supabase';

interface AdminPanelProps {
  shows: Show[];
  releases: Release[];
  onDataChange: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ shows, releases, onDataChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Show | Release | null>(null);
  const [modalType, setModalType] = useState<'show' | 'release' | null>(null);

  const openModal = (type: 'show' | 'release', item: Show | Release | null) => {
    setModalType(type);
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setModalType(null);
  };

  const handleSave = async (item: Show | Release) => {
    closeModal();
    // Refresh data after save
    onDataChange();
  };

  const handleDelete = async (type: 'show' | 'release', id: number) => {
    if (window.confirm('Are you sure you want to delete this item? This is permanent.')) {
        if (type === 'show') {
            await supabase.from('shows').delete().eq('id', id);
        } else if (type === 'release') {
            await supabase.from('releases').delete().eq('id', id);
        }
        onDataChange();
    }
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary/95 backdrop-blur-md p-4 border-t-2 border-accent z-40">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold font-heading text-center mb-4">Admin Panel</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Shows Management */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold font-heading">Shows</h3>
                    <button onClick={() => openModal('show', null)} className="bg-accent text-primary font-bold px-3 py-1 rounded hover:bg-accent-hover transition-colors text-sm">Add Show</button>
                </div>
                <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {shows.map(show => (
                        <li key={show.id} className="bg-secondary p-2 rounded flex justify-between items-center">
                            <span className="text-sm">{show.date} - {show.venue}, {show.city}</span>
                            <div>
                                <button onClick={() => openModal('show', show)} className="text-yellow-400 hover:text-yellow-300 mr-2 text-sm">Edit</button>
                                <button onClick={() => handleDelete('show', show.id)} className="text-red-500 hover:text-red-400 text-sm">Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            
            {/* Releases Management */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold font-heading">Releases</h3>
                    <button onClick={() => openModal('release', null)} className="bg-accent text-primary font-bold px-3 py-1 rounded hover:bg-accent-hover transition-colors text-sm">Add Release</button>
                </div>
                 <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {releases.map(release => (
                        <li key={release.id} className="bg-secondary p-2 rounded flex justify-between items-center">
                            <span className="text-sm">{release.title}</span>
                            <div>
                                <button onClick={() => openModal('release', release)} className="text-yellow-400 hover:text-yellow-300 mr-2 text-sm">Edit</button>
                                <button onClick={() => handleDelete('release', release.id)} className="text-red-500 hover:text-red-400 text-sm">Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </div>
      
      {modalType && (
        <Modal isOpen={isModalOpen} onClose={closeModal} title={`${editingItem ? 'Edit' : 'Add'} ${modalType}`}>
            {modalType === 'show' ? (
                <ShowForm 
                    show={editingItem as Show | null} 
                    onSave={handleSave} 
                    onClose={closeModal} 
                />
            ) : (
                <ReleaseForm release={editingItem as Release | null} onSave={handleSave} onClose={closeModal} />
            )}
        </Modal>
      )}
    </div>
  );
};


// Form for Shows
const ShowForm: React.FC<{show: Show | null, onSave: (show: Show) => void, onClose: () => void}> = ({ show, onSave, onClose }) => {
    const [formData, setFormData] = useState({ date: '', venue: '', city: '', ticket_url: '', ...show });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { id, ...showData } = formData;
        if(show?.id){
            // Update
            const { data, error } = await supabase.from('shows').update(showData as Update<'shows'>).eq('id', show.id).select().single();
            if(data) onSave(data as Show);
        } else {
            // Insert
            const { data, error } = await supabase.from('shows').insert(showData as Insert<'shows'>).select().single();
            if(data) onSave(data as Show);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input name="date" value={formData.date || ''} onChange={handleChange} placeholder="Date (YYYY-MM-DD)" type="date" required className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent" />
            <input name="venue" value={formData.venue || ''} onChange={handleChange} placeholder="Venue" required className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent" />
            <input name="city" value={formData.city || ''} onChange={handleChange} placeholder="City" required className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent" />
            <input name="ticket_url" value={formData.ticket_url || ''} onChange={handleChange} placeholder="Ticket URL" className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent" />
            
            <div className="flex justify-end items-center pt-2 gap-4">
                <button type="button" onClick={onClose} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="bg-hotpink text-white px-4 py-2 rounded hover:bg-hotpink-hover transition-colors disabled:bg-gray-500">
                    {loading ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    );
};

// Form for Releases
const ReleaseForm: React.FC<{release: Release | null, onSave: (release: Release) => void, onClose: () => void}> = ({ release, onSave, onClose }) => {
    const [formData, setFormData] = useState({ title: '', image_url: '', ...release });
    const [links, setLinks] = useState<Partial<ReleaseLink>[]>(release?.release_links || []);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLinkChange = (index: number, field: keyof ReleaseLink, value: string) => {
        const newLinks = [...links];
        (newLinks[index] as any)[field] = value;
        setLinks(newLinks);
    };

    const addLink = () => {
        setLinks([...links, { platform: 'spotify', url: '' }]);
    };

    const removeLink = (index: number) => {
        setLinks(links.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { release_links, ...releaseData } = formData;

        try {
            let savedRelease: Release;
            if (release?.id) {
                // Update existing release
                const { data, error } = await supabase
                    .from('releases')
                    .update({ title: releaseData.title, image_url: releaseData.image_url })
                    .eq('id', release.id)
                    .select()
                    .single();
                if (error) throw error;
                savedRelease = data as Release;
            } else {
                // Insert new release
                const { data, error } = await supabase
                    .from('releases')
                    .insert({ title: releaseData.title, image_url: releaseData.image_url })
                    .select()
                    .single();
                if (error) throw error;
                savedRelease = data as Release;
            }

            // Upsert links
            const linksToUpsert = links.map(link => ({
                id: link.id, // Will be undefined for new links, which is what upsert wants
                release_id: savedRelease.id,
                platform: link.platform,
                url: link.url
            }));
            
            const { error: linksError } = await supabase.from('release_links').upsert(linksToUpsert);
            if(linksError) throw linksError;

            // Delete links that were removed in the UI
            const linkIdsInUI = links.map(l => l.id).filter(Boolean);
            const originalLinkIds = release?.release_links.map(l => l.id) || [];
            const linksToDelete = originalLinkIds.filter(id => !linkIdsInUI.includes(id));

            if (linksToDelete.length > 0) {
                 await supabase.from('release_links').delete().in('id', linksToDelete);
            }

            onSave(savedRelease);
        } catch (error) {
            console.error("Error saving release:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input name="title" value={formData.title || ''} onChange={handleChange} placeholder="Title" required className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent" />
            <input name="image_url" value={formData.image_url || ''} onChange={handleChange} placeholder="Image URL" required className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent" />
            
            <div>
                <h4 className="font-semibold mb-2 text-accent">Music Links</h4>
                <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                {links.map((link, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <select
                            value={link.platform || 'spotify'}
                            onChange={(e) => handleLinkChange(index, 'platform', e.target.value)}
                            className="bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                            <option value="spotify">Spotify</option>
                            <option value="apple">Apple Music</option>
                            <option value="soundcloud">SoundCloud</option>
                            <option value="youtube">YouTube</option>
                            <option value="beatport">Beatport</option>
                        </select>
                        <input
                            value={link.url || ''}
                            onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                            placeholder="URL"
                            required
                            className="flex-grow bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <button 
                            type="button" 
                            onClick={() => removeLink(index)}
                            aria-label="Remove link"
                            className="flex-shrink-0 text-gray-500 hover:text-red-400 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary focus:ring-red-400 transition-colors"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
                </div>
                <button type="button" onClick={addLink} className="text-accent hover:text-accent-hover mt-3 text-sm font-semibold">Add Link</button>
            </div>

            <div className="flex justify-end space-x-4 pt-2">
                <button type="button" onClick={onClose} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="bg-hotpink text-white px-4 py-2 rounded hover:bg-hotpink-hover transition-colors disabled:bg-gray-500">
                    {loading ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    );
};
