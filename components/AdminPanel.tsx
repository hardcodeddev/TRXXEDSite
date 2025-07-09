import React, { useState } from 'react';
import { Content, Show, Release, MusicLink } from '../types';
import { Modal } from './common/Modal';

interface AdminPanelProps {
  content: Content;
  onContentChange: (newContent: Content) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ content, onContentChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Show | Release | null>(null);
  const [modalType, setModalType] = useState<'show' | 'release' | null>(null);

  const handleDownloadJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(content, null, 2)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'content.json';
    link.click();
  };

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

  const handleSave = (item: Show | Release) => {
    if (modalType === 'show') {
      const shows = editingItem
        ? content.shows.map(s => (s.id === item.id ? (item as Show) : s))
        : [...content.shows, { ...item, id: `show${Date.now()}` } as Show];
      onContentChange({ ...content, shows });
    } else if (modalType === 'release') {
      const releases = editingItem
        ? content.releases.map(r => (r.id === item.id ? (item as Release) : r))
        : [...content.releases, { ...item, id: `rel${Date.now()}` } as Release];
      onContentChange({ ...content, releases });
    }
    closeModal();
  };

  const handleDelete = (type: 'show' | 'release', id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      if (type === 'show') {
        onContentChange({ ...content, shows: content.shows.filter(s => s.id !== id) });
      } else if (type === 'release') {
        onContentChange({ ...content, releases: content.releases.filter(r => r.id !== id) });
      }
    }
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary/90 backdrop-blur-md p-4 border-t-2 border-accent z-40">
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
                    {content.shows.map(show => (
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
                    {content.releases.map(release => (
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

        <div className="text-center mt-6">
            <button onClick={handleDownloadJson} className="bg-hotpink text-white font-bold px-6 py-2 rounded-lg shadow-lg hover:bg-hotpink-hover transition-all transform hover:scale-105">
                Download Updated content.json
            </button>
            <p className="text-sm text-gray-400 mt-2">After downloading, replace the existing 'content.json' in the project's 'data' folder and redeploy.</p>
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
    const [formData, setFormData] = useState<Omit<Show, 'id'>>({ date: '', venue: '', city: '', ticketUrl: '', ...show });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: show?.id || '' });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input name="date" value={formData.date} onChange={handleChange} placeholder="Date (YYYY-MM-DD)" type="date" className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent" />
            <input name="venue" value={formData.venue} onChange={handleChange} placeholder="Venue" className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent" />
            <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent" />
            <input name="ticketUrl" value={formData.ticketUrl} onChange={handleChange} placeholder="Ticket URL" className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent" />
            
            <div className="flex justify-end items-center pt-2 gap-4">
                <button type="button" onClick={onClose} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors">Cancel</button>
                <button type="submit" className="bg-hotpink text-white px-4 py-2 rounded hover:bg-hotpink-hover transition-colors">Save</button>
            </div>
        </form>
    );
};

// Form for Releases
const ReleaseForm: React.FC<{release: Release | null, onSave: (release: Release) => void, onClose: () => void}> = ({ release, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<Release, 'id'>>({ title: '', imageUrl: '', links: [], ...release });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLinkChange = (index: number, field: keyof MusicLink, value: string) => {
        const newLinks = [...formData.links];
        (newLinks[index] as any)[field] = value;
        setFormData({ ...formData, links: newLinks });
    };

    const addLink = () => {
        setFormData({ ...formData, links: [...formData.links, { platform: 'spotify', url: '' }] });
    };

    const removeLink = (index: number) => {
        setFormData({ ...formData, links: formData.links.filter((_, i) => i !== index) });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: release?.id || '' });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent" />
            <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL" className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent" />
            
            <div>
                <h4 className="font-semibold mb-2 text-accent">Music Links</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {formData.links.map((link, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <select
                            value={link.platform}
                            onChange={(e) => handleLinkChange(index, 'platform', e.target.value)}
                            className="bg-gray-700 p-2 rounded border border-gray-600"
                        >
                            <option value="spotify">Spotify</option>
                            <option value="apple">Apple Music</option>
                            <option value="soundcloud">SoundCloud</option>
                            <option value="youtube">YouTube</option>
                            <option value="beatport">Beatport</option>
                        </select>
                        <input
                            value={link.url}
                            onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                            placeholder="URL"
                            className="flex-grow bg-gray-700 p-2 rounded border border-gray-600"
                        />
                        <button type="button" onClick={() => removeLink(index)} className="text-red-500 hover:text-red-400 p-1">Remove</button>
                    </div>
                ))}
                </div>
                <button type="button" onClick={addLink} className="text-accent hover:text-accent-hover mt-2 text-sm font-semibold">Add Link</button>
            </div>

            <div className="flex justify-end space-x-4 pt-2">
                <button type="button" onClick={onClose} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors">Cancel</button>
                <button type="submit" className="bg-hotpink text-white px-4 py-2 rounded hover:bg-hotpink-hover transition-colors">Save</button>
            </div>
        </form>
    );
};