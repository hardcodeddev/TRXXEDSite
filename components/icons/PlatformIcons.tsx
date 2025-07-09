
import React from 'react';
import { MusicLink } from '../../types';

interface PlatformIconProps {
  platform: MusicLink['platform'];
  className?: string;
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({ platform, className = 'w-6 h-6' }) => {
  switch (platform) {
    case 'spotify':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.49 13.987c-.24.36-.69.48-1.05.24-2.85-1.74-6.42-2.13-10.68-1.17-.42.09-.75-.21-.84-.63s.21-.75.63-.84c4.65-1.05 8.58-.6 11.7 1.29.36.24.48.69.24 1.05v-.06zm.9-2.52c-.3.45-.87.6-1.32.3-3.24-1.98-8.04-2.52-11.64-1.38-.51.15-.99-.18-1.14-.69s.18-.99.69-1.14c4.14-1.26 9.48-.66 13.14 1.56.45.3.6.87.3 1.32v-.03zm.12-2.7c-.36.54-1.05.72-1.59.36-3.72-2.28-9.96-2.46-13.68-1.35-.6.18-1.2-.21-1.38-.81s.21-1.2.81-1.38c4.26-1.26 11.16-1.02 15.42 1.56.54.36.72 1.05.36 1.59v-.03z"/>
        </svg>
      );
    case 'apple':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.26 13.737c-.022.011-.473.235-.473.235s-.462-.235-.495-.246c-1.562-.835-2.618-2.34-2.882-4.053h-2.2c.264 1.702 1.298 3.206 2.84 4.042-.022.011-.473.235-.473.235s-.462-.235-.495-.246c-1.562-.835-2.618-2.34-2.882-4.053h-2.2c.308 2.373 1.848 4.39 3.861 5.346v2.925h2.2v-2.925c2.013-.956 3.553-3.004 3.861-5.346h-2.2c-.264 1.702-1.298 3.206-2.84 4.042zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/>
        </svg>
      );
    case 'soundcloud':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 17h1.4v-3.333h.133s.467 2.133 1.8 2.133c1.2 0 1.8-.8 1.8-2.2V9H10v5.133C10 15.467 9.4 16 8.733 16c-.4 0-.667-.2-.8-.6L7.6 15.133V9H6v8h1zm6.933-8H15v1.467h-1.067V9zm0 2.8h1.067v1.4h-1.067v-1.4zm0 2.8h1.067v1.4h-1.067v-1.4zM21 9h-2.2v8h2.2V9zM0 9v8h4.533c1.2 0 1.933-.4 2.267-1.4h.067c.2.867.867 1.4 1.867 1.4h.667v-1.2c-.467.2-.933.267-1.2.267-.8 0-1.2-.4-1.4-1.2V9H4.6v5.2c0 1.067-.533 1.467-1.333 1.467-.8 0-1.333-.4-1.333-1.4V9H0z"/>
        </svg>
      );
    case 'youtube':
       return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.52 11.53c0 .5-.45 1.13-1.04 1.4l-5.48 2.94c-.59.26-1.04-.03-1.04-.62V8.75c0-.6.45-.88 1.04-.62l5.48 2.94c.59.28 1.04.8 1.04 1.46z"/>
        </svg>
      );
    case 'beatport':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
           <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM9.919 7.42l5.297 3.018-2.65 1.51-2.647-1.51V7.42zm-1.5 5.543l4.148 2.36-4.148 2.36V12.962zm5.648-1.51L9.919 8.94v5.105l4.148-2.36z"/>
        </svg>
      );
    default:
      return null;
  }
};
