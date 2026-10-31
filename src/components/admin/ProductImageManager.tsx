import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Trash2, 
  Star, 
  MoveLeft, 
  MoveRight, 
  RefreshCw, 
  Check, 
  AlertCircle, 
  Image as ImageIcon, 
  Plus, 
  GripVertical,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { api } from '../../lib/api';

interface ProductImageManagerProps {
  productId?: string;
  images: string[];
  onChange: (images: string[]) => void;
  disabled?: boolean;
}

export const ProductImageManager: React.FC<ProductImageManagerProps> = ({
  productId,
  images,
  onChange,
  disabled = false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Manual URL input toggle
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);

  const showNotification = (msg: string, isError = false) => {
    if (isError) {
      setErrorMessage(msg);
      setSuccessMessage(null);
    } else {
      setSuccessMessage(msg);
      setErrorMessage(null);
    }
    setTimeout(() => {
      setErrorMessage(null);
      setSuccessMessage(null);
    }, 4000);
  };

  // Convert File object to Base64 data string
  const readFileAsBase64 = (file: File): Promise<{ name: string; type: string; base64: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          name: file.name,
          type: file.type || 'image/jpeg',
          base64: reader.result as string
        });
      };
      reader.onerror = () => reject(new Error(`Failed to read file ${file.name}`));
      reader.readAsDataURL(file);
    });
  };

  // Process files selected from file dialog or drag & drop
  const handleFiles = async (fileList: FileList | File[]) => {
    const rawFiles = Array.from(fileList);
    if (rawFiles.length === 0) return;

    // Client-side validations
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    const maxSizeBytes = 5 * 1024 * 1024; // 5 MB

    const validFiles: File[] = [];
    for (const file of rawFiles) {
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        showNotification(`'${file.name}' is not a supported format. Please use JPG, PNG, WEBP, or GIF.`, true);
        return;
      }
      if (file.size > maxSizeBytes) {
        showNotification(`'${file.name}' exceeds the 5MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`, true);
        return;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    try {
      setIsUploading(true);
      setUploadProgress(`Preparing ${validFiles.length} image${validFiles.length > 1 ? 's' : ''}...`);

      const base64Files = await Promise.all(validFiles.map(readFileAsBase64));

      setUploadProgress(`Uploading to Supabase Storage ('photos' bucket)...`);

      const response = await api.uploadProductImages({
        files: base64Files,
        productId: productId || 'new-product'
      });

      if (response.success && response.urls.length > 0) {
        const updated = [...images, ...response.urls];
        onChange(updated);
        showNotification(`Successfully uploaded ${response.urls.length} image${response.urls.length > 1 ? 's' : ''} to Supabase Storage!`);
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (err: any) {
      console.error('[Upload Error]', err);
      showNotification(err.message || 'Error uploading images. Please verify your connection.', true);
    } finally {
      setIsUploading(false);
      setUploadProgress('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Replace single image
  const handleReplaceFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (replacingIndex === null || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    try {
      setIsUploading(true);
      setUploadProgress(`Replacing image with '${file.name}'...`);

      const base64File = await readFileAsBase64(file);
      const response = await api.uploadProductImages({
        files: [base64File],
        productId: productId || 'new-product'
      });

      if (response.success && response.urls.length > 0) {
        const newUrl = response.urls[0];
        const oldUrl = images[replacingIndex];
        const newImages = [...images];
        newImages[replacingIndex] = newUrl;
        onChange(newImages);

        // Delete old image in background if it's from our storage bucket
        if (oldUrl.includes('/photos/')) {
          api.deleteProductImage(oldUrl, productId).catch(() => {});
        }

        showNotification('Image successfully replaced in Supabase Storage!');
      }
    } catch (err: any) {
      showNotification(err.message || 'Failed to replace image', true);
    } finally {
      setIsUploading(false);
      setUploadProgress('');
      setReplacingIndex(null);
      if (replaceInputRef.current) replaceInputRef.current.value = '';
    }
  };

  // Drag and drop zone events
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Card Reordering Drag & Drop
  const handleCardDragStart = (idx: number) => {
    setDraggedIndex(idx);
  };

  const handleCardDragOver = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIdx) return;
    
    const reordered = [...images];
    const [draggedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIdx, 0, draggedItem);
    setDraggedIndex(targetIdx);
    onChange(reordered);
  };

  const handleCardDragEnd = () => {
    setDraggedIndex(null);
  };

  // Reorder buttons (Move left / right)
  const moveImage = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= images.length) return;
    const reordered = [...images];
    const [item] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, item);
    onChange(reordered);
  };

  // Set as primary (Move to index 0)
  const setPrimary = (idx: number) => {
    if (idx === 0) return;
    const reordered = [...images];
    const [item] = reordered.splice(idx, 1);
    reordered.unshift(item);
    onChange(reordered);
    showNotification('Primary display image updated (Set to 1st image).');
  };

  // Delete image
  const deleteImage = async (idx: number) => {
    const urlToDelete = images[idx];
    const filtered = images.filter((_, i) => i !== idx);
    onChange(filtered);

    // If it's a Supabase storage image, remove it from the bucket
    if (urlToDelete.includes('/photos/')) {
      try {
        await api.deleteProductImage(urlToDelete, productId);
      } catch (err) {
        console.warn('Backend storage deletion notice:', err);
      }
    }
    showNotification('Image removed from gallery.');
  };

  // Manual URL Add
  const handleAddManualUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = manualUrl.trim();
    if (!clean) return;
    if (!clean.startsWith('http://') && !clean.startsWith('https://') && !clean.startsWith('/')) {
      showNotification('Please enter a valid image URL starting with https:// or /', true);
      return;
    }
    onChange([...images, clean]);
    setManualUrl('');
    setShowUrlInput(false);
    showNotification('Custom image URL added to gallery.');
  };

  return (
    <div className="space-y-4">
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        className="hidden"
        disabled={disabled || isUploading}
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        onChange={handleReplaceFile}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Notifications */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs animate-fadeIn">
          <Check className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Drop Zone & Upload CTA */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${
          isDragging
            ? 'border-brand-magenta bg-brand-cream/60 scale-101 shadow-md'
            : 'border-brand-gold/40 hover:border-brand-gold bg-stone-50/70 hover:bg-stone-50'
        } ${disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-4 space-y-2">
            <Loader2 className="w-8 h-8 text-brand-magenta animate-spin" />
            <p className="text-xs font-semibold text-brand-navy">{uploadProgress}</p>
            <p className="text-[10px] text-stone-500">Uploading directly to Supabase Storage 'photos' bucket...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-2 space-y-2">
            <div className="w-12 h-12 rounded-full bg-brand-magenta/10 flex items-center justify-center text-brand-magenta">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-brand-navy">
                Click to browse or drag & drop high-resolution images here
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Upload multiple images at once &bull; JPG, PNG, WEBP, GIF up to 5MB each
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand-gold-dark bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <ImageIcon className="w-3 h-3" /> Supabase Storage: 'photos'
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Alternate URL Input Button */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-stone-500 font-medium">
          {images.length} {images.length === 1 ? 'image' : 'images'} in gallery
        </span>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-brand-magenta hover:text-brand-magenta-dark font-semibold text-[11px] hover:underline flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          {showUrlInput ? 'Hide URL input' : 'Add image via direct URL'}
        </button>
      </div>

      {/* Manual URL Input Form */}
      {showUrlInput && (
        <form onSubmit={handleAddManualUrl} className="flex gap-2 p-3 bg-white border border-brand-gold/30 rounded-xl">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://images.unsplash.com/... or /path/to/image.jpg"
            className="flex-1 text-xs p-2 border rounded-lg bg-stone-50 focus:outline-none focus:ring-1 focus:ring-brand-magenta"
          />
          <button
            type="submit"
            className="bg-brand-navy hover:bg-brand-navy/90 text-white text-xs font-semibold px-4 py-2 rounded-lg"
          >
            Add URL
          </button>
        </form>
      )}

      {/* Images Grid with Drag-and-Drop, Reordering & Primary Tag */}
      {images.length > 0 ? (
        <div className="space-y-2">
          <p className="text-[11px] text-stone-500 italic">
            * Drag cards to reorder or use the arrow buttons. The first image is always the <strong>Primary Product Image</strong> displayed on cards and search.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((imgUrl, idx) => {
              const isPrimary = idx === 0;

              return (
                <div
                  key={`${imgUrl}-${idx}`}
                  draggable
                  onDragStart={() => handleCardDragStart(idx)}
                  onDragOver={(e) => handleCardDragOver(e, idx)}
                  onDragEnd={handleCardDragEnd}
                  className={`group relative bg-white rounded-xl overflow-hidden border-2 transition-all duration-200 shadow-xs flex flex-col justify-between ${
                    isPrimary
                      ? 'border-brand-magenta ring-2 ring-brand-magenta/20 shadow-md'
                      : 'border-stone-200 hover:border-brand-gold'
                  }`}
                >
                  {/* Primary Badge */}
                  {isPrimary && (
                    <div className="absolute top-2 left-2 z-10 bg-brand-magenta text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-white" /> Primary
                    </div>
                  )}

                  {/* Drag Handle Indicator */}
                  <div className="absolute top-2 right-2 z-10 bg-black/60 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-3.5 h-3.5" />
                  </div>

                  {/* Thumbnail */}
                  <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                    <img
                      src={imgUrl}
                      alt={`Product view ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/brijwasi-logo.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                      <a
                        href={imgUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 bg-white/90 hover:bg-white text-stone-800 rounded-full shadow-xs"
                        title="View Full Resolution"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setReplacingIndex(idx);
                          replaceInputRef.current?.click();
                        }}
                        className="p-1.5 bg-white/90 hover:bg-white text-stone-800 rounded-full shadow-xs"
                        title="Replace Image with new file"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteImage(idx);
                        }}
                        className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-xs"
                        title="Delete Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Controls Toolbar */}
                  <div className="p-2 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
                    {/* Make Primary Button */}
                    {!isPrimary ? (
                      <button
                        type="button"
                        onClick={() => setPrimary(idx)}
                        className="text-[10px] font-semibold text-brand-magenta hover:text-brand-magenta-dark flex items-center gap-1"
                        title="Set as the primary showcase image"
                      >
                        <Star className="w-3 h-3" /> Make Primary
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-brand-navy">Display #1</span>
                    )}

                    {/* Left/Right Reordering Controls */}
                    <div className="flex items-center gap-1 ml-auto">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveImage(idx, idx - 1)}
                        className="p-1 hover:bg-stone-200 disabled:opacity-30 rounded text-stone-600"
                        title="Move Left"
                      >
                        <MoveLeft className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === images.length - 1}
                        onClick={() => moveImage(idx, idx + 1)}
                        className="p-1 hover:bg-stone-200 disabled:opacity-30 rounded text-stone-600"
                        title="Move Right"
                      >
                        <MoveRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center text-xs text-amber-800">
          No images uploaded for this delicacy yet. The storefront will display the royal Brijwasi fallback logo.
        </div>
      )}
    </div>
  );
};
