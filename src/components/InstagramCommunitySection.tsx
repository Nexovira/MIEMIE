import React from 'react';
import { useStore } from '../context/StoreContext';
import { Instagram, Heart, MessageCircle, Sparkles, ExternalLink } from 'lucide-react';

export const InstagramCommunitySection: React.FC = () => {
  const { siteContent, openWhatsApp } = useStore();

  const posts = [
    {
      img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
      caption: 'Sunday Lagos Brunch look in our Grade A silk slip dress ✨ #ThriftWithMiemie #LagosFashion',
      likes: 342,
    },
    {
      img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
      caption: 'Unboxing 90s vintage rigid denim straight from the bale 👖 #EgbedaThrift',
      likes: 418,
    },
    {
      img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
      caption: 'Corporate baddie in our structured cocoa blazer. Sold in 4 minutes! 🔥',
      likes: 289,
    },
    {
      img: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=600&q=80',
      caption: 'Restocked organic cotton babywear sets! Super soft for gentle newborn skin 👶',
      likes: 512,
    }
  ];

  const handleInstagramClick = () => {
    const handle = siteContent.instagramHandle || 'thriftwithmiemie';
    window.open(`https://instagram.com/${handle.replace('@', '')}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-16 md:py-24 bg-[#F4EFE6] border-b border-[#E7E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#FFEFEA] text-[#D95A2B] text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-2">
              <Instagram className="w-3.5 h-3.5" />
              <span>COMMUNITY & STYLING</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#1E1611] tracking-tight uppercase">
              JOIN THE THRIFT GANG
            </h2>
          </div>

          <button
            onClick={handleInstagramClick}
            className="inline-flex items-center gap-2 bg-[#1E1611] hover:bg-[#3E2F26] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full transition-all cursor-pointer"
          >
            <Instagram className="w-4 h-4 text-[#D95A2B]" />
            <span>Follow @{siteContent.instagramHandle || 'thriftwithmiemie'}</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
          </button>
        </div>

        {/* 4 Instagram Feed Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {posts.map((post, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl overflow-hidden bg-[#FBF9F5] border border-[#E7E2D8] shadow-2xs hover:shadow-md transition-all"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-stone-200">
                <img
                  src={post.img}
                  alt="Thrift community post"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Hover overlay with likes and comment */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3.5 text-white">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                      {post.likes}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-[#D95A2B]">Instagram</span>
                  </div>

                  <p className="text-[11px] line-clamp-3 text-stone-200 leading-snug">
                    {post.caption}
                  </p>

                  <button
                    onClick={() => openWhatsApp(undefined, `Hi Miemie! I saw your styling post on Instagram (#${idx + 1}) and want to know if similar pieces are available.`)}
                    className="bg-[#25D366] text-[#0A2E14] text-[10px] font-bold py-1.5 px-2.5 rounded-lg flex items-center justify-center gap-1"
                  >
                    <MessageCircle className="w-3 h-3" />
                    Ask Miemie
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
