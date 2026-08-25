import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, MessageCircle } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { siteContent, openWhatsApp } = useStore();

  if (!siteContent.showAnnouncement) return null;

  return (
    <div 
      id="announcement-banner" 
      className="bg-[#1E1611] text-[#FBF9F5] text-xs md:text-sm py-2 px-3 sm:px-4 tracking-wide font-medium relative z-50 border-b border-[#3E2F26] w-full max-w-full overflow-x-hidden box-border"
      style={{
        paddingLeft: 'max(12px, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(12px, env(safe-area-inset-right, 0px))'
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 mx-auto md:mx-0 text-center min-w-0 max-w-full">
          <span className="inline-flex items-center gap-1 bg-[#D95A2B] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Live Drop
          </span>
          <span className="truncate text-[11px] sm:text-xs md:text-sm text-stone-200">
            {siteContent.announcementText}
          </span>
        </div>

        <button
          onClick={() => openWhatsApp(undefined, 'Hi Miemie! I saw your announcement banner and want to know about the latest available drop.')}
          className="hidden md:inline-flex items-center gap-1.5 text-xs text-[#D95A2B] hover:text-[#e4764e] font-semibold transition-colors underline underline-offset-4 shrink-0"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Chat with Miemie
        </button>
      </div>
    </div>
  );
};

