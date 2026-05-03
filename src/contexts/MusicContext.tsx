import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Song, songs } from '../data/songs';

interface MusicContextType {
  currentSong: Song;
  isPlaying: boolean;
  progress: number;
  duration: number;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  seek: (percent: number) => void;
  setVolume: (val: number) => void;
  setIsMuted: (val: boolean) => void;
  playSong: (index: number) => void;
}

const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [isMuted, setIsMutedState] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSong = songs[currentSongIndex];

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio(currentSong.url);
    audioRef.current.volume = isMuted ? 0 : volume;

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      nextSong();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentSong.url;
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentSongIndex]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
  };

  const prevSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
  };

  const playSong = (index: number) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  const seek = (percent: number) => {
    if (audioRef.current) {
      const time = (percent / 100) * duration;
      audioRef.current.currentTime = time;
    }
  };

  const setVolume = (val: number) => {
    setVolumeState(val);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : val;
    }
  };

  const setIsMuted = (val: boolean) => {
    setIsMutedState(val);
    if (audioRef.current) {
      audioRef.current.volume = val ? 0 : volume;
    }
  };

  return (
    <MusicContext.Provider value={{
      currentSong,
      isPlaying,
      progress,
      duration,
      currentTime,
      volume,
      isMuted,
      togglePlay,
      nextSong,
      prevSong,
      seek,
      setVolume,
      setIsMuted,
      playSong
    }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) throw new Error('useMusic must be used within MusicProvider');
  return context;
}
