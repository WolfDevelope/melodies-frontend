import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Slider } from 'antd';
import {
  CaretRightOutlined,
  PauseOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  RetweetOutlined,
  SwapOutlined,
  SoundOutlined,
  HeartOutlined,
  HeartFilled,
  PlusCircleOutlined,
  ExpandOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';

/**
 * MusicPlayer - Fixed music player bar at bottom of screen
 * @param {object} currentTrack - Current playing track { id, title, artist, image, audioUrl }
 * @param {function} onNext - Next track handler
 * @param {function} onPrevious - Previous track handler
 */
const MusicPlayer = ({ currentTrack, onNext, onPrevious }) => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const audioRef = useRef(null);

  const trackTitle = currentTrack?.title || '';
  const trackArtist = currentTrack?.artist?.name || currentTrack?.artist || '';
  const trackImage =
    currentTrack?.thumbnail ||
    currentTrack?.image ||
    currentTrack?.coverImage ||
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100';
  const trackAudioUrl = currentTrack?.audioUrl || currentTrack?.src || '';
  const trackId = currentTrack?._id || currentTrack?.id || '';

  const handleAudioError = (e) => {
    const mediaError = e?.currentTarget?.error;
    console.error('Audio element error:', {
      src: e?.currentTarget?.src,
      code: mediaError?.code,
      message: mediaError?.message,
      error: mediaError,
    });
  };

  // Format time to MM:SS
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        if (!audioRef.current.src) {
          console.warn('Audio play requested but audio src is empty', {
            trackAudioUrl,
            currentTrack,
          });
          return;
        }
        const playPromise = audioRef.current.play();
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise
            .then(() => setIsPlaying(true))
            .catch((err) => {
              console.error('Audio play error:', err);
              setIsPlaying(false);
            });
        } else {
          setIsPlaying(true);
        }
      }
    }
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Handle loaded metadata
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Handle seek
  const handleSeek = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  // Handle volume change
  const handleVolumeChange = (value) => {
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
    }
    if (value === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume / 100;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  // Handle track end
  const handleEnded = () => {
    if (isRepeat) {
      audioRef.current.currentTime = 0;
      const playPromise = audioRef.current.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch((err) => console.error('Audio replay error:', err));
      }
    } else {
      onNext && onNext();
    }
  };

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current && trackAudioUrl) {
      const audioEl = audioRef.current;
      audioEl.src = trackAudioUrl;
      audioEl.load();
      setCurrentTime(0);
      setDuration(0);

      // Do not auto-play here; keep playback controlled by user gesture (togglePlay)
    }
  }, [trackAudioUrl]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = (isMuted ? 0 : volume) / 100;
  }, [volume, isMuted]);

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-white/10 z-[100]">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Track Info */}
          <div className="flex items-center gap-4 w-1/4 min-w-[180px]">
            <img
              src={trackImage}
              alt={trackTitle}
              className="w-14 h-14 rounded object-cover"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-white text-sm font-medium truncate hover:underline cursor-pointer">
                {trackTitle}
              </h4>
              <p className="text-gray-400 text-xs truncate hover:underline cursor-pointer">
                {trackArtist}
              </p>
            </div>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isLiked ? (
                <HeartFilled className="text-pink-500 text-lg" />
              ) : (
                <HeartOutlined className="text-lg" />
              )}
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <PlusCircleOutlined className="text-lg" />
            </button>
          </div>

          {/* Center: Player Controls */}
          <div className="flex flex-col items-center gap-2 w-2/4 max-w-[722px]">
            {/* Control Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsShuffle(!isShuffle)}
                className={`transition-colors ${
                  isShuffle ? 'text-pink-500' : 'text-gray-400 hover:text-white'
                }`}
                title="Phát ngẫu nhiên"
              >
                <SwapOutlined className="text-base" />
              </button>
              <button
                onClick={onPrevious}
                className="text-gray-400 hover:text-white transition-colors"
                title="Bài trước"
              >
                <StepBackwardOutlined className="text-xl" />
              </button>
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-white hover:scale-105 transition-transform flex items-center justify-center"
                title={isPlaying ? 'Tạm dừng' : 'Phát'}
              >
                {isPlaying ? (
                  <PauseOutlined className="text-black text-xl" />
                ) : (
                  <CaretRightOutlined className="text-black text-xl ml-0.5" />
                )}
              </button>
              <button
                onClick={onNext}
                className="text-gray-400 hover:text-white transition-colors"
                title="Bài tiếp theo"
              >
                <StepForwardOutlined className="text-xl" />
              </button>
              <button
                onClick={() => setIsRepeat(!isRepeat)}
                className={`transition-colors ${
                  isRepeat ? 'text-pink-500' : 'text-gray-400 hover:text-white'
                }`}
                title="Lặp lại"
              >
                <RetweetOutlined className="text-base" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-2 w-full">
              <span className="text-gray-400 text-xs min-w-[40px] text-right">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={currentTime}
                max={duration || 100}
                onChange={handleSeek}
                tooltip={{ formatter: null }}
                className="flex-1 music-player-slider"
                trackStyle={{ backgroundColor: '#ec4899' }}
                handleStyle={{ 
                  backgroundColor: '#ec4899',
                  border: 'none',
                  boxShadow: 'none'
                }}
              />
              <span className="text-gray-400 text-xs min-w-[40px]">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Right: Volume & Other Controls */}
          <div className="flex items-center gap-3 w-1/4 justify-end">
            <button
              onClick={() => {
                if (!trackId) return;
                navigate(`/song/${trackId}`);
              }}
              className="text-gray-400 hover:text-white transition-colors"
              title="Mở trang bài hát"
            >
              <ExpandOutlined className="text-base" />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <FullscreenOutlined className="text-base" />
            </button>
            <button
              onClick={toggleMute}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <SoundOutlined className="text-base" />
            </button>
            <Slider
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              tooltip={{ formatter: null }}
              className="w-24 volume-slider"
              trackStyle={{ backgroundColor: '#ec4899' }}
              handleStyle={{ 
                backgroundColor: '#ec4899',
                border: 'none',
                boxShadow: 'none'
              }}
            />
          </div>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleAudioError}
      />
    </div>
  );
};

export default MusicPlayer;
