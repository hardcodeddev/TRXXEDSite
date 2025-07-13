
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
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.49 13.987c-.24.36-.69.48-1.05.24-2.85-1.74-6.42-2.13-10.68-1.17-.42.09-.75-.21-.84-.63s.21-.75.63-.84c4.65-1.05 8.58-.6 11.7 1.29.36.24.48.69.24 1.05v-.06zm.9-2.52c-.3.45-.87.6-1.32.3-3.24-1.98-8.04-2.52-11.64-1.38-.51.15-.99-.18-1.14-.69s.18-.99.69-1.14c4.14-1.26 9.48-.66 13.14 1.56.45.3.6.87.3 1.32v-.03zm.12-2.7c-.36.54-1.05.72-1.59.36-3.72-2.28-9.96-2.46-13.68-1.35-.6.18-1.2-.21-1.38-.81s.21-1.2.81-1.38c4.26-1.26 11.16-1.02 15.42 1.56.54.36.72 1.05.36 1.59v-.03z" />
        </svg>
      );
    case 'apple':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.26 13.737c-.022.011-.473.235-.473.235s-.462-.235-.495-.246c-1.562-.835-2.618-2.34-2.882-4.053h-2.2c.264 1.702 1.298 3.206 2.84 4.042-.022.011-.473.235-.473.235s-.462-.235-.495-.246c-1.562-.835-2.618-2.34-2.882-4.053h-2.2c.308 2.373 1.848 4.39 3.861 5.346v2.925h2.2v-2.925c2.013-.956 3.553-3.004 3.861-5.346h-2.2c-.264 1.702-1.298 3.206-2.84 4.042zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
        </svg>
      );
    case 'soundcloud':
      return (
        <svg className={className} viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
          <path d="M38.2 18.5c-1.2 0-2.3.2-3.4.5-1-6.2-6.5-11-13-11-7.3 0-13.3 6-13.3 13.3 0 .5 0 1 .1 1.4C3.7 24.5 0 29.7 0 35.6 0 43 6.3 49.3 13.7 49.3h24.4c9 0 16.4-7.4 16.4-16.4S47.2 18.5 38.2 18.5z" />
        </svg>

      );
    case 'youtube':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.52 11.53c0 .5-.45 1.13-1.04 1.4l-5.48 2.94c-.59.26-1.04-.03-1.04-.62V8.75c0-.6.45-.88 1.04-.62l5.48 2.94c.59.28 1.04.8 1.04 1.46z" />
        </svg>
      );
    case 'beatport':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM9.919 7.42l5.297 3.018-2.65 1.51-2.647-1.51V7.42zm-1.5 5.543l4.148 2.36-4.148 2.36V12.962zm5.648-1.51L9.919 8.94v5.105l4.148-2.36z" />
        </svg>
      );
    default:
      return null;
  }
};
