import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, MessageCircle } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { siteContent, openWhatsApp } = useStore();

  if (!siteContent.showAnnouncement) return null;

  return (
    <div id="announcement-banner" className="bg-[#1E1611] text-[#FBF9F5] text-xs md:text-sm py-2.5 px-4 tracking-wide font-medium relative z-50 border-b border-[#3E2F26]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 mx-auto md:mx-0 text-center">
          <span className="inline-flex items-center gap-1 bg-[#D95A2B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> Live Drop
          </span>
          <span className="truncate max-w-[280px] sm:max-w-md md:max-w-xl">
            {siteContent.announcementText}
          </span>
        </div>

        <button
          onClick={() => openWhatsApp(undefined, 'Hi Miemie! I saw your announcement banner and want to know about the latest available drop.')}
          className="hidden md:inline-flex items-center gap-1.5 text-xs text-[#D95A2B] hover:text-[#e4764e] font-semibold transition-colors underline underline-offset-4"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Chat with Miemie
        </button>
      </div>
    </div>
  );
};
