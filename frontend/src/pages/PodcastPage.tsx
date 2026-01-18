import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

interface ScriptSection {
  step: number;
  title: string;
  content: string;
}

interface Podcast {
  id: number;
  title: string;
  slug: string;
  description: string;
  audio_url: string;
  thumbnail_url?: string;
  duration: string;
  category?: string;
  transcript?: string;
  play_count: number;
  published_at: string;
}

export default function PodcastPage() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    api.getPodcasts({ limit: 20 })
      .then((res: any) => setPodcasts(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const playPodcast = (podcast: Podcast) => {
    if (currentPodcast?.id === podcast.id) {
      togglePlay();
    } else {
      setCurrentPodcast(podcast);
      setIsPlaying(true);
      setShowTranscript(false);
      setTimeout(() => audioRef.current?.play(), 100);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const parseTranscript = (transcript?: string): ScriptSection[] => {
    if (!transcript) return [];
    try {
      return JSON.parse(transcript);
    } catch {
      return [];
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const scriptSections = currentPodcast ? parseTranscript(currentPodcast.transcript) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-b from-purple-50 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            VISTA Podcast
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chia sẻ kiến thức chăm sóc mắt từ đội ngũ chuyên gia - Nghe và đọc script chi tiết
          </p>
        </div>
      </section>

      {/* Episodes List */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Các tập podcast</h2>
          
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-32 animate-pulse" />
              ))}
            </div>
          ) : podcasts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl">
              <p className="text-gray-500">Chưa có podcast nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {podcasts.map((podcast, index) => (
                <motion.div
                  key={podcast.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-xl overflow-hidden shadow-sm border-2 transition-all
                    ${currentPodcast?.id === podcast.id ? 'border-purple-500' : 'border-transparent hover:border-gray-200'}`}
                >
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Thumbnail */}
                      {podcast.thumbnail_url && (
                        <img 
                          src={podcast.thumbnail_url}
                          alt={podcast.title}
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      
                      {/* Play Button (if no thumbnail) */}
                      {!podcast.thumbnail_url && (
                        <button 
                          onClick={() => playPodcast(podcast)}
                          className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-colors
                            ${currentPodcast?.id === podcast.id && isPlaying 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}`}
                        >
                          {currentPodcast?.id === podcast.id && isPlaying ? (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          )}
                        </button>
                      )}

                      {/* Info */}
                      <div className="flex-grow min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Tập {index + 1}: {podcast.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {podcast.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {podcast.duration}
                          </span>
                          {podcast.category && (
                            <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded">
                              {podcast.category}
                            </span>
                          )}
                          <span>{podcast.play_count} lượt nghe</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => playPodcast(podcast)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                            ${currentPodcast?.id === podcast.id && isPlaying 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}`}
                        >
                          {currentPodcast?.id === podcast.id && isPlaying ? 'Đang phát' : 'Nghe'}
                        </button>
                        <button 
                          onClick={() => {
                            setCurrentPodcast(podcast);
                            setShowTranscript(true);
                          }}
                          className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                          Xem script
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Transcript Modal */}
      <AnimatePresence>
        {showTranscript && currentPodcast && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowTranscript(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {currentPodcast.title}
                    </h3>
                    <p className="text-sm text-gray-500">Script chi tiết</p>
                  </div>
                  <button 
                    onClick={() => setShowTranscript(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content - Script Sections */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {scriptSections.length > 0 ? (
                  <div className="space-y-6">
                    {scriptSections.map((section, index) => (
                      <div key={index} className="relative pl-8">
                        {/* Step number */}
                        <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 
                          flex items-center justify-center text-sm font-medium">
                          {section.step}
                        </div>
                        {/* Content */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">{section.title}</h4>
                          <p className="text-gray-600 text-sm leading-relaxed">{section.content}</p>
                        </div>
                        {/* Connector line */}
                        {index < scriptSections.length - 1 && (
                          <div className="absolute left-[11px] top-8 w-0.5 h-[calc(100%+8px)] bg-purple-100" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Chưa có script cho tập này</p>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <button 
                  onClick={() => {
                    setShowTranscript(false);
                    playPodcast(currentPodcast);
                  }}
                  className="w-full py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Nghe podcast này
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Player (Fixed at bottom when playing) */}
      {currentPodcast && !showTranscript && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
          <div className="max-w-4xl mx-auto px-4 py-4">
            {/* Progress bar */}
            <div className="mb-3">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Thumbnail */}
              {currentPodcast.thumbnail_url && (
                <img 
                  src={currentPodcast.thumbnail_url}
                  alt={currentPodcast.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}

              {/* Play/Pause */}
              <button 
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0"
              >
                {isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>

              {/* Info */}
              <div className="flex-grow min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">
                  {currentPodcast.title}
                </p>
                <p className="text-gray-500 text-xs">VISTA Podcast</p>
              </div>

              {/* View Script Button */}
              <button 
                onClick={() => setShowTranscript(true)}
                className="px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Script
              </button>

              {/* Close */}
              <button 
                onClick={() => { setCurrentPodcast(null); setIsPlaying(false); }}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Audio Element */}
            <audio 
              ref={audioRef}
              src={currentPodcast.audio_url}
              onEnded={() => setIsPlaying(false)}
              onPause={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleTimeUpdate}
            />
          </div>
        </div>
      )}

      {/* Bottom padding when player is visible */}
      {currentPodcast && !showTranscript && <div className="h-32" />}
    </div>
  );
}
