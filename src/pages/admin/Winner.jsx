import { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminWinner() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [setCurrentId, setSetCurrentId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    try {
      const { data, error } = await supabase
        .from("winner_images")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setImages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  }

  function handleRemovePreview() {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleUpload(setAsCurrent) {
    if (!preview) return;
    setUploading(true);
    setError(null);
    try {
      const matches = preview.match(/^data:image\/(\w+);base64,(.+)$/);
      if (!matches) throw new Error("Invalid image");

      const ext = matches[1];
      const base64 = matches[2];
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const filename = `winner-${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("winner-images")
        .upload(filename, bytes.buffer, {
          contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
        });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("winner-images")
        .getPublicUrl(filename);

      if (setAsCurrent) {
        await supabase
          .from("winner_images")
          .update({ is_current: false })
          .eq("is_current", true);
      }

      const { error: insertError } = await supabase
        .from("winner_images")
        .insert({ image_url: urlData.publicUrl, is_current: !!setAsCurrent });
      if (insertError) throw insertError;

      handleRemovePreview();
      await fetchImages();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSetCurrent(id) {
    setSetCurrentId(id);
    setError(null);
    try {
      const { error } = await supabase
        .from("winner_images")
        .update({ is_current: false })
        .eq("is_current", true);
      if (error) throw error;

      const { error: updateError } = await supabase
        .from("winner_images")
        .update({ is_current: true })
        .eq("id", id);
      if (updateError) throw updateError;

      await fetchImages();
    } catch (err) {
      setError(err.message);
    } finally {
      setSetCurrentId(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this winner image?")) return;
    setDeleteId(id);
    setError(null);
    try {
      const { data: row, error: fetchError } = await supabase
        .from("winner_images")
        .select("image_url")
        .eq("id", id)
        .single();
      if (fetchError) throw fetchError;

      const urlParts = row.image_url.split("/");
      const filename = urlParts[urlParts.length - 1];
      await supabase.storage.from("winner-images").remove([filename]);

      const { error: deleteError } = await supabase
        .from("winner_images")
        .delete()
        .eq("id", id);
      if (deleteError) throw deleteError;

      await fetchImages();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteId(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1120] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#f9bb1a] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentImage = images.find((img) => img.is_current);

  return (
    <div className="min-h-screen bg-[#0a1120] pt-28 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-8">
          Winner Image
        </h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6">
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-[#121c31]/90 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-4">
              Upload New Image
            </h2>

            <div
              onClick={() => !preview && fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl overflow-hidden transition-all ${
                preview
                  ? "border-[#f9bb1a]/40"
                  : "border-white/10 hover:border-[#f9bb1a]/30 cursor-pointer"
              }`}
            >
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full aspect-[4/5] object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePreview();
                    }}
                    className="absolute top-3 right-3 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-red-500/80 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="w-full aspect-[4/5] flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-white/40 text-sm font-medium">Click to select an image</p>
                  <p className="text-white/20 text-xs">JPG, PNG, WebP</p>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {preview && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleUpload(false)}
                  disabled={uploading}
                  className="flex-1 bg-white/10 hover:bg-white/15 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 text-sm"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
                <button
                  onClick={() => handleUpload(true)}
                  disabled={uploading}
                  className="flex-1 bg-[#f9bb1a] hover:bg-[#e5a817] text-black font-bold py-3 rounded-xl transition-colors disabled:opacity-50 text-sm"
                >
                  {uploading ? "Uploading..." : "Upload & Set Current"}
                </button>
              </div>
            )}
          </div>

          {/* Current Winner */}
          <div className="bg-[#121c31]/90 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-4">
              Current Winner
            </h2>
            {currentImage ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#f9bb1a]/30">
                <img
                  src={currentImage.image_url}
                  alt="Current winner"
                  className="w-full aspect-[4/5] object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#f9bb1a] text-black text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                  Current
                </div>
              </div>
            ) : (
              <div className="w-full aspect-[4/5] rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center gap-3">
                <svg className="w-12 h-12 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-white/30 text-sm font-medium">No winner set yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Image History */}
        <div className="mt-10">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-5">
            All Images ({images.length})
          </h2>
          {images.length === 0 ? (
            <p className="text-white/40 text-sm">No images uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  className={`relative rounded-2xl overflow-hidden border-2 transition-all ${
                    img.is_current
                      ? "border-[#f9bb1a] shadow-[0_0_20px_rgba(249,187,26,0.15)]"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <img
                    src={img.image_url}
                    alt="Winner"
                    className="w-full aspect-square object-cover"
                  />
                  {img.is_current && (
                    <div className="absolute top-2 left-2 bg-[#f9bb1a] text-black text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full">
                      Current
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center p-3 gap-2">
                    {!img.is_current && (
                      <button
                        onClick={() => handleSetCurrent(img.id)}
                        disabled={setCurrentId === img.id}
                        className="bg-[#f9bb1a] hover:bg-[#e5a817] text-black text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                      >
                        {setCurrentId === img.id ? "..." : "Set Current"}
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(img.id)}
                      disabled={deleteId === img.id}
                      className="bg-red-500/80 hover:bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                    >
                      {deleteId === img.id ? "..." : "Delete"}
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50">
                    <p className="text-white/50 text-[10px] font-mono">
                      {new Date(img.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
