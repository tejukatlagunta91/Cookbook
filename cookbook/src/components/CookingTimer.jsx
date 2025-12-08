import { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaStop, FaClock } from 'react-icons/fa';

const CookingTimer = ({ initialMinutes = 0, label = 'Timer' }) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playNotificationSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const playNotificationSound = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (timeLeft > 0) {
      setIsRunning(true);
      setIsPaused(false);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
    setIsPaused(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(initialMinutes * 60);
  };

  const handleSetTime = (minutes) => {
    if (!isRunning) {
      setTimeLeft(minutes * 60);
    }
  };

  return (
    <div className="soft-card rounded-3xl p-6 border border-white/10">
      <div className="flex items-center space-x-3 mb-4">
        <FaClock className="text-amber-200" />
        <h3 className="text-lg font-semibold text-white">{label}</h3>
      </div>

      <div className="text-center mb-6">
        <p className="text-5xl font-bold text-white tracking-widest">{formatTime(timeLeft)}</p>
        {timeLeft === 0 && !isRunning && <p className="text-rose-300 font-semibold mt-2">Time&apos;s up! ⏰</p>}
      </div>

      <div className="flex justify-center gap-3 mb-4">
        {!isRunning && (
          <button
            onClick={handleStart}
            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/15 text-white hover:bg-white/25 transition"
          >
            <FaPlay />
            <span>{isPaused ? 'Resume' : 'Start'}</span>
          </button>
        )}
        {isRunning && (
          <button
            onClick={handlePause}
            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/15 text-white hover:bg-white/25 transition"
          >
            <FaPause />
            <span>Pause</span>
          </button>
        )}
        {(isRunning || isPaused) && (
          <button
            onClick={handleStop}
            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/15 text-white hover:bg-white/25 transition"
          >
            <FaStop />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CookingTimer;

