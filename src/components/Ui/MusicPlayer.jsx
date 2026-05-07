import React, { useState, useRef, useEffect } from 'react';

// NEOM-inspired default colors
const DEFAULT_MUSIC_BG = "#0B2B40";   // Dark teal/navy (music state – not playing)
const DEFAULT_SOUND_BG = "#00B4D8";   // Bright cyan (sound state – playing)
const DEFAULT_ICON_COLOR = "#FFFFFF"; // White icons

const MusicSoundToggle = ({
  audioUrl,
  size = "w-12 h-12",                 // Button size (circle)
  musicBgColor: customMusicBg,        // Background when showing music icon (not playing)
  soundBgColor: customSoundBg,        // Background when showing sound icon (playing)
  iconColor: customIconColor,         // Color for both icons
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const hasAutoPlayed = useRef(false);   // 👈 Track if autoplay has been attempted

  // Determine final colors: custom props take precedence, else use NEOM defaults
  const musicBg = customMusicBg || DEFAULT_MUSIC_BG;
  const soundBg = customSoundBg || DEFAULT_SOUND_BG;
  const finalIconColor = customIconColor || DEFAULT_ICON_COLOR;

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.warn("Playback error:", err));
    }
    setIsPlaying(!isPlaying);
  };

  // Update audio source when URL changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const wasPlaying = isPlaying;
    if (wasPlaying) {
      audio.pause();
      setIsPlaying(false);
    }
    audio.src = audioUrl;
    audio.load();
  }, [audioUrl]);

  // 👇 NEW: Autoplay when component mounts and audio is ready
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl || hasAutoPlayed.current) return;

    const attemptAutoplay = () => {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          hasAutoPlayed.current = true;
        })
        .catch((err) => {
          console.info("Autoplay was prevented by browser. User can click to play.", err);
        });
    };

    // Wait for the audio to load enough before trying to play
    if (audio.readyState >= 2) { // HAVE_CURRENT_DATA or more
      attemptAutoplay();
    } else {
      audio.addEventListener('canplay', attemptAutoplay, { once: true });
    }
  }, [audioUrl]); // Re-run only when audioUrl changes (but hasAutoPlayed prevents second attempt)

  // Cleanup on unmount
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (audio) {
        audio.pause();
        audio.src = "";
        audio.load();
      }
    };
  }, []);

  // Reset playing state when audio ends
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, []);

  // Choose background based on state
  const currentBackground = isPlaying ? soundBg : musicBg;

  return (
    <>
      <button
        onClick={togglePlayPause}
        className={`${size} rounded-full flex items-center justify-center shadow-lg transition-all duration-200 active:scale-95 hover:scale-105 focus:outline-none`}
        style={{ backgroundColor: currentBackground }}
        aria-label={isPlaying ? "Stop sound" : "Play music"}
      >
        {isPlaying ? (
          // 🔊 SOUND ICON (when playing)
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={finalIconColor}
            className="w-2/3 h-2/3"
          >
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z" />
          </svg>
        ) : (
          // 🎵 MUSIC ICON (when not playing / initial)
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={finalIconColor}
            className="w-2/3 h-2/3"
          >
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        )}
      </button>
      <audio ref={audioRef} preload="metadata" />
    </>
  );
};

export default MusicSoundToggle;