import React, { useState, useEffect } from 'react';
import { Product, ProductCategory, ProductCondition, ProductStatus } from '../../types';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Upload, 
  Trash2, 
  Plus, 
  Eye, 
  Image as ImageIcon, 
  ShieldCheck, 
  Tag, 
  DollarSign, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AdminProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}

export const AdminProductModal: React.FC<AdminProductModalProps> = ({
  product,
  onClose,
  onSaved
}) => {
  const { addProduct, updateProduct } = useStore();
  const isEditing = !!product;

  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState<ProductCategory>(product?.category || 'dresses');
  const [price, setPrice] = useState<number>(product?.price || 12000);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(product?.originalPrice || undefined);
  const [size, setSize] = useState(product?.size || 'UK 10 / M');
  const [colour, setColour] = useState(product?.colour || 'Champagne Gold');
  const [condition, setCondition] = useState<ProductCondition>(product?.condition || 'Grade A+ (Like New)');
  const [description, setDescription] = useState(product?.description || '');
  const [measurements, setMeasurements] = useState(product?.measurements || 'Bust: 34" | Waist: 28" | Length: 42"');
  const [coverImage, setCoverImage] = useState(product?.coverImage || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80');
  const [images, setImages] = useState<string[]>(product?.images || [coverImage]);
  const [status, setStatus] = useState<ProductStatus>(product?.status || 'available');
  const [featured, setFeatured] = useState<boolean>(product?.featured || false);
  const [newArrival, setNewArrival] = useState<boolean>(product?.newArrival ?? true);
  const [wholesaleAvailable, setWholesaleAvailable] = useState<boolean>(product?.wholesaleAvailable || false);
  const [wholesalePrice, setWholesalePrice] = useState<number | undefined>(product?.wholesalePrice || undefined);
  const [tagsInput, setTagsInput] = useState<string>(product?.tags?.join(', ') || 'Thrift, Vintage, Lagos');
  const [whatsappMessage, setWhatsappMessage] = useState(product?.whatsappMessage || '');
  const [displayOrder, setDisplayOrder] = useState<number>(product?.displayOrder || 1);

  const [newImageUrl, setNewImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Auto-fill template WhatsApp message when name/price changes
  useEffect(() => {
    if (!product && name) {
      setWhatsappMessage(`Hi Thrift With Miemie! I saw "${name}" (₦${price?.toLocaleString()}) on your website. Is it still available to claim?`);
    }
  }, [name, price, product]);

  // Handle local file upload with instant client-side image compression
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Please upload a valid image (JPG, PNG, WebP)');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          // Compress via canvas to 800px max dimension
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 800;
          if (width > height && width > maxDim) {
            height = (height * maxDim) / width;
            width = maxDim;
          } else if (height > maxDim) {
            width = (width * maxDim) / height;
            height = maxDim;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

          setImages((prev) => [...prev, compressedDataUrl]);
          if (!coverImage) {
            setCoverImage(compressedDataUrl);
          }
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setImages(prev => [...prev, newImageUrl.trim()]);
    if (!coverImage) setCoverImage(newImageUrl.trim());
    setNewImageUrl('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const target = images[indexToRemove];
    const newImgs = images.filter((_, idx) => idx !== indexToRemove);
    setImages(newImgs);
    if (coverImage === target) {
      setCoverImage(newImgs[0] || '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Product name is required.');
      return;
    }
    if (images.length === 0 && !coverImage) {
      setErrorMsg('At least one product image is required.');
      return;
    }

    setSaving(true);
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const activeCover = coverImage || images[0];

    const prodPayload = {
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: category === 'all' ? 'dresses' : category,
      price: Number(price),
      currency: 'NGN' as const,
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      size: size.trim(),
      colour: colour.trim(),
      condition,
      description: description.trim(),
      measurements: measurements.trim(),
      images: images.length > 0 ? images : [activeCover],
      coverImage: activeCover,
      status,
      featured,
      newArrival,
      wholesaleAvailable,
      wholesalePrice: wholesalePrice ? Number(wholesalePrice) : undefined,
      tags,
      whatsappMessage: whatsappMessage.trim(),
      displayOrder: Number(displayOrder),
    };

    try {
      if (isEditing && product) {
        await updateProduct(product.id, prodPayload);
      } else {
        await addProduct(prodPayload);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1E1611]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div className="relative bg-[#FBF9F5] w-full max-w-3xl rounded-3xl shadow-2xl border border-[#E7E2D8] overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-[#F4EFE6] border-b border-[#E7E2D8] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#1E1611] text-[#D95A2B] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-[#1E1611]">
                {isEditing ? `Edit Thrift Item: ${product.name}` : 'List New Curated Thrift Piece'}
              </h2>
              <span className="text-xs text-[#7A6E65]">
                {isEditing ? `Product ID: ${product.id}` : 'Fill in the piece details below'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-[#DCD5C9] text-xs font-semibold text-[#1E1611] hover:bg-[#EAE5DC] flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#D95A2B]" />
              <span>{previewMode ? 'Back to Editor' : 'Live Card Preview'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#EAE5DC] text-[#1E1611] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
          
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {previewMode ? (
            /* Live Preview Box */
            <div className="space-y-4">
              <div className="p-4 bg-[#FFEFEA] rounded-2xl border border-[#FCD5C8] text-xs text-[#D95A2B] font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Here is how your piece will appear on the public storefront:</span>
              </div>

              <div className="max-w-xs mx-auto bg-[#FBF9F5] rounded-2xl border border-[#E7E2D8] shadow-lg overflow-hidden p-4 space-y-3">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-stone-200">
                  <img
                    src={coverImage || images[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80'}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-[#0F823B] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                    {status}
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-between text-[11px] text-[#7A6E65]">
                    <span className="uppercase text-[#D95A2B] font-bold">{category}</span>
                    <span>Size: {size}</span>
                  </div>
                  <h4 className="font-display text-sm font-bold text-[#1E1611] mt-1">{name || 'Item Name'}</h4>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-display text-base font-black text-[#1E1611]">₦{Number(price).toLocaleString()}</span>
                    {originalPrice && <span className="text-xs text-stone-400 line-through">₦{Number(originalPrice).toLocaleString()}</span>}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Form Fields */
            <form id="product-form" onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
              
              {/* Row 1: Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#3E2F26]">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vintage Silk Drape Slip Maxi Dress"
                    className="w-full p-3 bg-white rounded-xl border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#3E2F26]">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-3 bg-white rounded-xl border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B]"
                  >
                    <option value="dresses">Statement Dresses</option>
                    <option value="denim">Denim & Shorts</option>
                    <option value="tops-everyday">Everyday Tops & Y2K Mesh</option>
                    <option value="babywear">Babywear & Infant Packs</option>
                    <option value="wholesale">Wholesale Bundles</option>
                    <option value="vintage-outerwear">Blazers & Outerwear</option>
                    <option value="accessories">Accessories & Bags</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Price (NGN), Original Price, Size, Colour */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#3E2F26]">Price (₦ NGN) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-3 bg-white rounded-xl border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#3E2F26]">Original Price (₦)</label>
                  <input
                    type="number"
                    min={0}
                    value={originalPrice || ''}
                    onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="e.g. 25000"
                    className="w-full p-3 bg-white rounded-xl border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#3E2F26]">Size / Fit *</label>
                  <input
                    type="text"
                    required
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="UK 10 / M / Waist 29"
                    className="w-full p-3 bg-white rounded-xl border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#3E2F26]">Color Tone</label>
                  <input
                    type="text"
                    value={colour}
                    onChange={(e) => setColour(e.target.value)}
                    placeholder="Champagne, Indigo..."
                    className="w-full p-3 bg-white rounded-xl border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B]"
                  />
                </div>
              </div>

              {/* Row 3: Condition & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#3E2F26]">Condition Grade *</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full p-3 bg-white rounded-xl border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B]"
                  >
                    <option value="Grade A+ (Like New)">Grade A+ (Like New)</option>
                    <option value="Grade A (Gently Worn)">Grade A (Gently Worn)</option>
                    <option value="Vintage Pristine">Vintage Pristine</option>
                    <option value="Brand Sample">Brand Sample</option>
                    <option value="Wholesale Bale">Wholesale Bale</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#3E2F26]">Availability Status *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full p-3 bg-white rounded-xl border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B]"
                  >
                    <option value="available">🟢 Available (Ready to claim)</option>
                    <option value="reserved">🟡 Reserved (Hold / Stockpile)</option>
                    <option value="sold">🔴 Sold Out</option>
                    <option value="hidden">⚪ Hidden (Draft)</option>
                  </select>
                </div>
              </div>

              {/* Image Manager */}
              <div className="p-4 bg-[#F4EFE6] rounded-2xl border border-[#E7E2D8] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#3E2F26] flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#D95A2B]" />
                    <span>Product Photography & Images ({images.length})</span>
                  </label>
                  <span className="text-[11px] text-[#7A6E65]">Click an image to set as Cover</span>
                </div>

                {/* Upload or Add URL */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="flex-1 px-4 py-2.5 bg-white rounded-xl border border-dashed border-[#D95A2B] hover:bg-[#FFEFEA] text-xs font-semibold text-[#D95A2B] flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Upload Image Files (JPG / PNG / WebP)</span>
                    <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>

                  <div className="flex gap-1.5 flex-1">
                    <input
                      type="url"
                      placeholder="Or paste Image URL..."
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="flex-1 p-2 bg-white rounded-xl border border-[#DCD5C9] text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3 bg-[#1E1611] text-white rounded-xl text-xs font-bold"
                    >
                      Add URL
                    </button>
                  </div>
                </div>

                {/* Thumbnails Gallery Preview */}
                {images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 pt-2">
                    {images.map((img, idx) => {
                      const isCover = coverImage === img || (idx === 0 && !coverImage);
                      return (
                        <div
                          key={idx}
                          className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 group cursor-pointer ${
                            isCover ? 'border-[#D95A2B] ring-2 ring-[#D95A2B]/30' : 'border-[#DCD5C9]'
                          }`}
                          onClick={() => setCoverImage(img)}
                        >
                          <img src={img} alt="img" className="w-full h-full object-cover" />
                          
                          {isCover && (
                            <span className="absolute bottom-1 left-1 right-1 bg-[#D95A2B] text-white text-[8px] font-black uppercase text-center py-0.5 rounded-sm">
                              Cover
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(idx);
                            }}
                            className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-red-600 text-white rounded-full transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Measurements & Fit Note */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#3E2F26]">Exact Measurements (Bust / Waist / Length / Hips)</label>
                <input
                  type="text"
                  value={measurements}
                  onChange={(e) => setMeasurements(e.target.value)}
                  placeholder="Bust: 34-36&quot; | Waist: 28-30&quot; | Length: 52&quot;"
                  className="w-full p-3 bg-white rounded-xl border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B]"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#3E2F26]">Fabric, Silhouette & Styling Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the fabric texture, vintage decade, styling tips, etc."
                  className="w-full p-3 bg-white rounded-xl border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B]"
                />
              </div>

              {/* Tags & WhatsApp Message */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#3E2F26]">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Silk, Vintage, Date Night, 90s"
                    className="w-full p-3 bg-white rounded-xl border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#3E2F26]">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full p-3 bg-white rounded-xl border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B]"
                  />
                </div>
              </div>

              {/* WhatsApp Message Preview */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#3E2F26]">Custom WhatsApp Pre-filled Inquiry Message</label>
                <input
                  type="text"
                  value={whatsappMessage}
                  onChange={(e) => setWhatsappMessage(e.target.value)}
                  placeholder="Hi Miemie! I saw [Product] on your website..."
                  className="w-full p-3 bg-white rounded-xl border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B]"
                />
              </div>

              {/* Toggles (Featured, New Arrival, Wholesale) */}
              <div className="p-4 bg-white rounded-2xl border border-[#E7E2D8] grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 accent-[#D95A2B] rounded"
                  />
                  <span className="font-bold text-[#1E1611]">⭐ Featured Pick</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newArrival}
                    onChange={(e) => setNewArrival(e.target.checked)}
                    className="w-4 h-4 accent-[#D95A2B] rounded"
                  />
                  <span className="font-bold text-[#1E1611]">✨ New Drop Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wholesaleAvailable}
                    onChange={(e) => setWholesaleAvailable(e.target.checked)}
                    className="w-4 h-4 accent-[#D95A2B] rounded"
                  />
                  <span className="font-bold text-[#1E1611]">📦 Wholesale Available</span>
                </label>
              </div>

            </form>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-[#F4EFE6] border-t border-[#E7E2D8] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#DCD5C9] text-[#5A4E45] font-bold text-xs hover:bg-[#EAE5DC] transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="product-form"
            disabled={saving}
            className="px-6 py-2.5 bg-[#1E1611] hover:bg-[#3E2F26] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <span>Saving piece...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#D95A2B]" />
                <span>{isEditing ? 'Save Changes' : 'Publish Curated Piece'}</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
