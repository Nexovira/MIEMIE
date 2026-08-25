import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Save, 
  CheckCircle2, 
  MessageCircle, 
  Instagram, 
  MapPin, 
  Truck, 
  RefreshCw, 
  CreditCard, 
  Sparkles, 
  Megaphone,
  User
} from 'lucide-react';

export const AdminSiteContent: React.FC = () => {
  const { siteContent, updateSiteContent } = useStore();

  const [formData, setFormData] = useState(siteContent);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: keyof typeof siteContent, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await updateSiteContent(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-[#1E1611] tracking-tight">
            Website Content & Store Configuration
          </h2>
          <p className="text-xs text-[#7A6E65]">
            Edit all public copy, WhatsApp contact number, Egbeda pickup address, and delivery rates.
          </p>
        </div>

        <button
          type="submit"
          form="site-content-form"
          disabled={saving}
          className="bg-[#D95A2B] hover:bg-[#b84218] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Updating...' : 'Save All Changes'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Website content updated successfully! Public storefront is now in sync.</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form id="site-content-form" onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm">
        
        {/* Announcement Bar */}
        <div className="bg-[#FBF9F5] p-5 sm:p-7 rounded-3xl border border-[#E7E2D8] shadow-2xs space-y-4">
          <div className="flex items-center gap-2 font-display text-base font-bold text-[#1E1611]">
            <Megaphone className="w-5 h-5 text-[#D95A2B]" />
            <span>Top Announcement Banner</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
            <div className="sm:col-span-3 space-y-1.5">
              <label className="font-bold text-[#3E2F26]">Announcement Text</label>
              <input
                type="text"
                value={formData.announcementText}
                onChange={(e) => handleChange('announcementText', e.target.value)}
                placeholder="🔥 NEW WEEKEND DROP JUST LANDED! Claim items fast on WhatsApp."
                className="w-full p-3 bg-white rounded-xl border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B]"
              />
            </div>

            <div className="sm:col-span-1 pt-6">
              <label className="flex items-center gap-2 font-bold text-[#1E1611] cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showAnnouncement}
                  onChange={(e) => handleChange('showAnnouncement', e.target.checked)}
                  className="w-4 h-4 accent-[#D95A2B] rounded"
                />
                <span>Show Banner</span>
              </label>
            </div>
          </div>
        </div>

        {/* Hero Section Copy */}
        <div className="bg-[#FBF9F5] p-5 sm:p-7 rounded-3xl border border-[#E7E2D8] shadow-2xs space-y-4">
          <div className="flex items-center gap-2 font-display text-base font-bold text-[#1E1611]">
            <Sparkles className="w-5 h-5 text-[#D95A2B]" />
            <span>Hero Headline & Tagline</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-bold text-[#3E2F26]">Main Hero Headline</label>
              <input
                type="text"
                value={formData.heroHeadline}
                onChange={(e) => handleChange('heroHeadline', e.target.value)}
                placeholder="THE BEST FINDS ARE NEVER ON THE FRONT RACK."
                className="w-full p-3 bg-white rounded-xl border border-[#DCD5C9] font-display font-bold text-sm focus:outline-hidden focus:border-[#D95A2B]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#3E2F26]">Supporting Subtext</label>
              <textarea
                rows={2}
                value={formData.heroSubtext}
                onChange={(e) => handleChange('heroSubtext', e.target.value)}
                placeholder="Discover affordable thrift fashion, babywear, and wholesale gems..."
                className="w-full p-3 bg-white rounded-xl border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B]"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp & Social Media */}
        <div className="bg-[#FBF9F5] p-5 sm:p-7 rounded-3xl border border-[#E7E2D8] shadow-2xs space-y-4">
          <div className="flex items-center gap-2 font-display text-base font-bold text-[#1E1611]">
            <MessageCircle className="w-5 h-5 text-[#25D366]" />
            <span>WhatsApp Business & Social Channels</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-[#3E2F26]">WhatsApp Number (with country code, no +)</label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                placeholder="2348148809211"
                className="w-full p-3 bg-white rounded-xl border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B]"
              />
              <span className="text-[11px] text-[#7A6E65]">Used automatically for all product claim buttons</span>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#3E2F26]">Instagram Username</label>
              <input
                type="text"
                value={formData.instagramHandle}
                onChange={(e) => handleChange('instagramHandle', e.target.value)}
                placeholder="thriftwithmiemie"
                className="w-full p-3 bg-white rounded-xl border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B]"
              />
            </div>
          </div>
        </div>

        {/* Delivery, Pickup, Stockpiling & Policies */}
        <div className="bg-[#FBF9F5] p-5 sm:p-7 rounded-3xl border border-[#E7E2D8] shadow-2xs space-y-4">
          <div className="flex items-center gap-2 font-display text-base font-bold text-[#1E1611]">
            <Truck className="w-5 h-5 text-[#D95A2B]" />
            <span>Delivery, Egbeda Pickup & Stockpiling Policies</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-bold text-[#3E2F26]">Lagos Delivery Details & Rates</label>
              <textarea
                rows={2}
                value={formData.deliveryLagos}
                onChange={(e) => handleChange('deliveryLagos', e.target.value)}
                className="w-full p-3 bg-white rounded-xl border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#3E2F26]">Interstate Nationwide Waybill Details</label>
              <textarea
                rows={2}
                value={formData.deliveryInterstate}
                onChange={(e) => handleChange('deliveryInterstate', e.target.value)}
                className="w-full p-3 bg-white rounded-xl border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#3E2F26]">Physical Pickup Address (Egbeda, Lagos)</label>
              <input
                type="text"
                value={formData.pickupAddress}
                onChange={(e) => handleChange('pickupAddress', e.target.value)}
                className="w-full p-3 bg-white rounded-xl border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#3E2F26]">Stockpiling & Hold Terms</label>
              <textarea
                rows={2}
                value={formData.stockpilingPolicy}
                onChange={(e) => handleChange('stockpilingPolicy', e.target.value)}
                className="w-full p-3 bg-white rounded-xl border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#3E2F26]">Bank Transfer & Payment Instructions</label>
              <textarea
                rows={2}
                value={formData.paymentInstructions}
                onChange={(e) => handleChange('paymentInstructions', e.target.value)}
                className="w-full p-3 bg-white rounded-xl border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B]"
              />
            </div>
          </div>
        </div>

        {/* Owner Story ("The Eye Behind The Find") */}
        <div className="bg-[#FBF9F5] p-5 sm:p-7 rounded-3xl border border-[#E7E2D8] shadow-2xs space-y-4">
          <div className="flex items-center gap-2 font-display text-base font-bold text-[#1E1611]">
            <User className="w-5 h-5 text-[#D95A2B]" />
            <span>Owner Bio & Story ("The Eye Behind The Find")</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-bold text-[#3E2F26]">Story Title</label>
              <input
                type="text"
                value={formData.ownerStoryTitle}
                onChange={(e) => handleChange('ownerStoryTitle', e.target.value)}
                className="w-full p-3 bg-white rounded-xl border border-[#DCD5C9] font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#3E2F26]">Story Narrative</label>
              <textarea
                rows={4}
                value={formData.ownerStoryText}
                onChange={(e) => handleChange('ownerStoryText', e.target.value)}
                className="w-full p-3 bg-white rounded-xl border border-[#DCD5C9]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#3E2F26]">Owner Photo URL</label>
              <input
                type="url"
                value={formData.ownerImageUrl}
                onChange={(e) => handleChange('ownerImageUrl', e.target.value)}
                className="w-full p-3 bg-white rounded-xl border border-[#DCD5C9]"
              />
            </div>
          </div>
        </div>

      </form>

    </div>
  );
};
