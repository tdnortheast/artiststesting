import { useState } from 'react';
import { Upload, X, Plus, Trash2, Save } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

interface NewTrack {
  tempId: string;
  title: string;
  duration: string;
  explicit: boolean;
  audioFile?: File;
}

interface UploadReleaseProps {
  artistId: string;
  artistName: string;
  onBack: () => void;
}

export default function UploadRelease({ artistId, artistName, onBack }: UploadReleaseProps) {
  const [releaseTitle, setReleaseTitle] = useState('');
  const [releaseType, setReleaseType] = useState<'album' | 'single'>('single');
  const [releaseDate, setReleaseDate] = useState('');
  const [coverArtFile, setCoverArtFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [tracks, setTracks] = useState<NewTrack[]>([
    { tempId: '1', title: '', duration: '0:00', explicit: false },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleCoverArtChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setCoverPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setCoverArtFile(file);
  };

  const handleTrackChange = (tempId: string, field: string, value: any) => {
    setTracks(prev =>
      prev.map(t =>
        t.tempId === tempId ? { ...t, [field]: value } : t
      )
    );
  };

  const handleTrackAudioChange = (tempId: string, file: File) => {
    setTracks(prev =>
      prev.map(t =>
        t.tempId === tempId ? { ...t, audioFile: file } : t
      )
    );
  };

  const addTrack = () => {
    const newId = String(Math.max(...tracks.map(t => parseInt(t.tempId) || 0)) + 1);
    setTracks(prev => [
      ...prev,
      { tempId: newId, title: '', duration: '0:00', explicit: false },
    ]);
  };

  const removeTrack = (tempId: string) => {
    if (tracks.length > 1) {
      setTracks(prev => prev.filter(t => t.tempId !== tempId));
    }
  };

  const canSubmit = () => {
    return (
      releaseTitle.trim() &&
      releaseDate &&
      coverArtFile &&
      tracks.length > 0 &&
      tracks.every(t => t.title.trim() && t.duration && t.audioFile)
    );
  };

  const submitRelease = async () => {
    if (!canSubmit()) return;

    setSubmitStatus('loading');
    try {
      const uploadedCoverUrl = await (async () => {
        const coverPath = `releases/${Date.now()}-cover`;
        const coverRef = ref(storage, coverPath);
        await uploadBytes(coverRef, coverArtFile!);
        return await getDownloadURL(coverRef);
      })();

      const uploadedTracks = await Promise.all(
        tracks.map(async (track, index) => {
          const audioPath = `releases/${Date.now()}/track-${index}`;
          const audioRef = ref(storage, audioPath);
          await uploadBytes(audioRef, track.audioFile!);
          return {
            id: String(index + 1),
            title: track.title,
            duration: track.duration,
            explicit: track.explicit,
          };
        })
      );

      const releaseId = `release-${Date.now()}`;
      const newRelease = {
        id: releaseId,
        title: releaseTitle,
        type: releaseType,
        releaseDate,
        coverArt: uploadedCoverUrl,
        tracks: uploadedTracks,
      };

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/save-release`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            artistId,
            release: newRelease,
            webhookUrl: 'https://discord.com/api/webhooks/1460807133355311116/YCO_LwLdacJvaA4Fj09hZm_QUiqjEAkXqgpbY1r2WXbaRKODzXN6jqSce39zth2pZbDV',
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload release');
      }

      setSubmitStatus('success');
      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (error) {
      console.error('Error uploading release:', error);
      setSubmitStatus('error');
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    }
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold mb-8 transition"
      >
        <X className="w-4 h-4" />
        Cancel
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div>
              <label className="block text-white font-semibold mb-3">Cover Art</label>
              {coverPreview ? (
                <div className="aspect-square rounded-lg overflow-hidden bg-slate-700 mb-3">
                  <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-square rounded-lg bg-slate-700 mb-3 flex items-center justify-center">
                  <span className="text-slate-500 text-sm">No cover selected</span>
                </div>
              )}
              <label className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition cursor-pointer">
                <Upload className="w-4 h-4" />
                Upload Cover
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleCoverArtChange(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div>
            <label className="block text-white font-semibold mb-2">Release Title</label>
            <input
              type="text"
              value={releaseTitle}
              onChange={(e) => setReleaseTitle(e.target.value)}
              placeholder="Enter release title"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-semibold mb-2">Release Type</label>
              <select
                value={releaseType}
                onChange={(e) => setReleaseType(e.target.value as 'album' | 'single')}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-400 transition"
              >
                <option value="single">Single</option>
                <option value="album">Album</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Release Date</label>
              <input
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-400 transition"
              />
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-400" />
                Tracks
              </h2>
              <button
                onClick={addTrack}
                className="flex items-center gap-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded transition"
              >
                <Plus className="w-4 h-4" />
                Add Track
              </button>
            </div>

            <div className="space-y-4">
              {tracks.map((track, index) => (
                <div key={track.tempId} className="space-y-2 pb-4 border-b border-slate-700 last:border-b-0">
                  <label className="block text-slate-300 text-sm font-semibold">
                    Track {index + 1} - Title
                  </label>
                  <input
                    type="text"
                    value={track.title}
                    onChange={(e) => handleTrackChange(track.tempId, 'title', e.target.value)}
                    placeholder="Track title"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-amber-400 transition"
                  />

                  <label className="block text-slate-300 text-sm font-semibold mt-2">
                    Duration (mm:ss)
                  </label>
                  <input
                    type="text"
                    value={track.duration}
                    onChange={(e) => handleTrackChange(track.tempId, 'duration', e.target.value)}
                    placeholder="0:00"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-amber-400 transition"
                  />

                  <div className="flex items-center gap-3 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={track.explicit}
                        onChange={(e) => handleTrackChange(track.tempId, 'explicit', e.target.checked)}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-700 cursor-pointer"
                      />
                      <span className="text-slate-300 text-sm font-semibold">Explicit</span>
                    </label>
                  </div>

                  <label className="block text-slate-300 text-sm font-semibold mt-2">
                    Audio File
                  </label>
                  <label className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Upload Audio
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => e.target.files?.[0] && handleTrackAudioChange(track.tempId, e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                  {track.audioFile && (
                    <p className="text-xs text-amber-400">File: {track.audioFile.name}</p>
                  )}

                  {tracks.length > 1 && (
                    <button
                      onClick={() => removeTrack(track.tempId)}
                      className="flex items-center gap-2 px-3 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-300 text-sm rounded transition mt-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={submitRelease}
              disabled={!canSubmit() || isSubmitting || submitStatus === 'loading'}
              className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-slate-950 font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {submitStatus === 'loading' ? 'Uploading...' : 'Upload Release'}
            </button>
            <button
              onClick={onBack}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
          </div>

          {submitStatus === 'success' && (
            <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
              <p className="text-green-300 font-semibold">Release uploaded successfully!</p>
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg">
              <p className="text-red-300 font-semibold">Failed to upload release. Please try again.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
