import React, { useState, useEffect, useRef } from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Trash2, 
  Copy, 
  Check, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Sliders, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  fetchStoredImages, 
  uploadImageFiles, 
  deleteStoredImage, 
  StoredImage, 
  DEFAULT_IMAGE_SLOTS, 
  getImageSlotOverrides, 
  setImageSlotOverride, 
  resetImageSlotOverride 
} from '../../services/imageService';

export const MediaManager: React.FC = () => {
  const [images, setImages] = useState<StoredImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error'; text: string; url?: string } | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [slotOverrides, setSlotOverrides] = useState<Record<string, string>>({});
  const [activeSubTab, setActiveSubTab] = useState<'upload' | 'slots'>('upload');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Load images and slot overrides on mount
  const loadData = async () => {
    setIsLoading(true);
    try {
      const stored = await fetchStoredImages();
      setImages(stored);
      setSlotOverrides(getImageSlotOverrides());
    } catch (err: any) {
      console.error('Error loading media data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle files selection
  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (fileArray.length === 0) {
      setUploadMessage({ type: 'error', text: 'Please select valid image files (JPG, PNG, WEBP, GIF, SVG).' });
      return;
    }

    setIsUploading(true);
    setUploadMessage(null);

    try {
      const res = await uploadImageFiles(fileArray);
      if (res.success) {
        setUploadMessage({ 
          type: 'success', 
          text: `Successfully uploaded ${fileArray.length} image(s) to website storage!`,
          url: res.primaryUrl
        });
        await loadData();
      } else {
        setUploadMessage({ type: 'error', text: res.error || 'Failed to upload images.' });
      }
    } catch (err: any) {
      setUploadMessage({ type: 'error', text: err.message || 'Upload error.' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Copy URL to clipboard
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => {
      setCopiedUrl(null);
    }, 2500);
  };

  // Delete image
  const handleDeleteImage = async (filename: string) => {
    if (!window.confirm(`Are you sure you want to delete "${filename}" from website storage?`)) {
      return;
    }

    const success = await deleteStoredImage(filename);
    if (success) {
      setImages(prev => prev.filter(img => img.filename !== filename));
      setUploadMessage({ type: 'success', text: `Deleted "${filename}" from website storage.` });
    } else {
      setUploadMessage({ type: 'error', text: `Could not delete "${filename}".` });
    }
  };

  // Assign image to a website slot
  const handleAssignToSlot = (slotId: string, url: string) => {
    setImageSlotOverride(slotId, url);
    setSlotOverrides(prev => ({ ...prev, [slotId]: url }));
    setUploadMessage({ 
      type: 'success', 
      text: `Updated "${DEFAULT_IMAGE_SLOTS[slotId]?.name || slotId}" with new photo!` 
    });
  };

  // Reset a slot to default
  const handleResetSlot = (slotId: string) => {
    resetImageSlotOverride(slotId);
    setSlotOverrides(prev => {
      const copy = { ...prev };
      delete copy[slotId];
      return copy;
    });
    setUploadMessage({ 
      type: 'success', 
      text: `Reset "${DEFAULT_IMAGE_SLOTS[slotId]?.name || slotId}" to hotel default image.` 
    });
  };

  // Filtered images
  const filteredImages = images.filter(img => 
    img.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header Info */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#C5A059]/10 rounded-lg text-[#C5A059] border border-[#C5A059]/30">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              Direct Website Image Storage & Media Manager
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Upload and store hotel photos directly on the Crystal Plaza Hotel web server (<code className="text-[#C5A059]">/public/uploads/</code>). 
            Images uploaded here will <strong>never expire, break, or get rate-limited</strong> like third-party image hosts.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab('upload')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'upload' 
                ? 'bg-[#C5A059] text-slate-950 shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload & Library ({images.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('slots')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'slots' 
                ? 'bg-[#C5A059] text-slate-950 shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Website Image Slots</span>
          </button>
        </div>
      </div>

      {/* Rooftop Pool & Facilities Clarification Banner */}
      <div className="p-4 bg-slate-950/80 rounded-xl border border-amber-900/40 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <div className="font-semibold text-amber-300">
            Hotel Amenities Reference (Sharjah Al Qasimia)
          </div>
          <p className="text-slate-400 leading-relaxed">
            Crystal Plaza Hotel provides an equipped <strong>Fitness Centre & Gym</strong>, <strong>24-Hour Front Desk</strong>, <strong>On-Site Restaurant & Café</strong>, and <strong>Banquet & Meeting Facilities</strong>. 
            Please note there is <em>no rooftop swimming pool</em> on the property, and none is advertised on the guest website.
          </p>
        </div>
      </div>

      {/* Feedback Alert */}
      {uploadMessage && (
        <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs ${
          uploadMessage.type === 'success' 
            ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' 
            : 'bg-red-950/60 border-red-800 text-red-300'
        }`}>
          <div className="flex items-center gap-2">
            {uploadMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            )}
            <span>{uploadMessage.text}</span>
          </div>

          {uploadMessage.url && (
            <button
              onClick={() => handleCopyUrl(uploadMessage.url!)}
              className="px-2.5 py-1 rounded bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span>Copy URL</span>
            </button>
          )}
        </div>
      )}

      {/* SUB-TAB 1: UPLOAD & LIBRARY */}
      {activeSubTab === 'upload' && (
        <div className="space-y-6">
          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files) {
                handleFiles(e.dataTransfer.files);
              }
            }}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all bg-slate-950/60 ${
              isDragging 
                ? 'border-[#C5A059] bg-[#C5A059]/5' 
                : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
              id="admin-image-upload"
            />

            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[#C5A059]">
                <UploadCloud className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">
                  Upload Hotel Photos Directly
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Drag and drop your images here, or click to browse files
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Supports JPG, PNG, WEBP, GIF, SVG up to 25MB each
                </p>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-5 py-2.5 rounded-lg bg-[#C5A059] hover:bg-[#B38E47] text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>Select Images from Device</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Stored Images Gallery */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Stored Website Images</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] text-slate-300">
                    {images.length} files
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  All images hosted permanently on your website server. Copy the URL or assign directly to any page.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search images..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#C5A059] w-40 sm:w-56"
                  />
                </div>

                <button
                  onClick={loadData}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer"
                  title="Reload images"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#C5A059]" />
                <span>Loading stored images...</span>
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs bg-slate-900/50 rounded-xl border border-dashed border-slate-800 space-y-2">
                <ImageIcon className="w-8 h-8 mx-auto text-slate-600" />
                <p>No uploaded images found {searchQuery ? 'matching your search' : 'yet'}.</p>
                <p className="text-[11px] text-slate-500">
                  Upload your room, banquet, dining, or hotel photos using the box above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
                {filteredImages.map((img) => (
                  <div
                    key={img.filename}
                    className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col group hover:border-slate-700 transition-colors shadow-sm"
                  >
                    {/* Image Preview */}
                    <div className="aspect-[4/3] bg-slate-950 relative overflow-hidden">
                      <img
                        src={img.url}
                        alt={img.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-slate-950/80 backdrop-blur-sm text-[10px] text-slate-300 font-mono">
                        {img.formattedSize}
                      </span>
                    </div>

                    {/* Content & Actions */}
                    <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-semibold text-white truncate" title={img.filename}>
                          {img.filename}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono truncate" title={img.url}>
                          {img.url}
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        {/* Copy URL Button */}
                        <button
                          type="button"
                          onClick={() => handleCopyUrl(img.url)}
                          className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                            copiedUrl === img.url
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                          }`}
                        >
                          {copiedUrl === img.url ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-white" />
                              <span>Copied URL!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-[#C5A059]" />
                              <span>Copy Image URL</span>
                            </>
                          )}
                        </button>

                        {/* Quick Assign Dropdown */}
                        <div className="relative">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                handleAssignToSlot(e.target.value, img.url);
                                e.target.value = '';
                              }
                            }}
                            defaultValue=""
                            className="w-full py-1.5 px-2.5 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-[#C5A059] font-medium focus:outline-none focus:ring-1 focus:ring-[#C5A059] cursor-pointer"
                          >
                            <option value="" disabled>Set As Website Photo...</option>
                            {Object.values(DEFAULT_IMAGE_SLOTS).map((slot) => (
                              <option key={slot.id} value={slot.id}>
                                {slot.section}: {slot.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Delete Button */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] text-slate-500">
                          <span>{new Date(img.uploadedAt).toLocaleDateString()}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(img.filename)}
                            className="text-slate-500 hover:text-red-400 transition-colors p-1 rounded hover:bg-red-950/30 cursor-pointer"
                            title="Delete image from server"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: WEBSITE IMAGE SLOTS */}
      {activeSubTab === 'slots' && (
        <div className="bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#C5A059]" />
              <span>Live Website Image Assignments</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Easily customize the primary photo displayed across any section of the website. Select from your uploaded images library or reset back to default anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(DEFAULT_IMAGE_SLOTS).map((slot) => {
              const activeUrl = slotOverrides[slot.id] || slot.defaultUrl;
              const isOverridden = Boolean(slotOverrides[slot.id]);

              return (
                <div
                  key={slot.id}
                  className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex gap-4 items-start"
                >
                  {/* Thumbnail */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0 relative">
                    <img
                      src={activeUrl}
                      alt={slot.name}
                      className="w-full h-full object-cover"
                    />
                    {isOverridden && (
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-[#C5A059] text-slate-950 text-[9px] font-bold">
                        CUSTOM
                      </span>
                    )}
                  </div>

                  {/* Slot Details & Controls */}
                  <div className="flex-1 space-y-2 min-w-0">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#C5A059]">
                          {slot.section}
                        </span>
                        {isOverridden && (
                          <button
                            type="button"
                            onClick={() => handleResetSlot(slot.id)}
                            className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center gap-1 cursor-pointer"
                            title="Reset to hotel original image"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reset</span>
                          </button>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-white truncate">
                        {slot.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">
                        {slot.description}
                      </p>
                    </div>

                    {/* Selector */}
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">
                        Active Image Source:
                      </label>
                      <select
                        value={isOverridden ? activeUrl : ''}
                        onChange={(e) => {
                          if (e.target.value === '') {
                            handleResetSlot(slot.id);
                          } else {
                            handleAssignToSlot(slot.id, e.target.value);
                          }
                        }}
                        className="w-full py-1.5 px-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#C5A059] cursor-pointer truncate"
                      >
                        <option value="">Default Hotel Photo</option>
                        {images.map((img) => (
                          <option key={img.filename} value={img.url}>
                            Uploaded: {img.filename} ({img.formattedSize})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
