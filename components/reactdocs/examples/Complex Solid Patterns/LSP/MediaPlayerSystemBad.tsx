// ❌ BAD EXAMPLE: Liskov Substitution Principle Violation
// Subtypes (VideoPlayer, AudioPlayer) cannot be substituted for MediaPlayer
// without breaking functionality - they throw exceptions or behave unexpectedly

interface MediaFile {
  name: string;
  path: string;
  duration: number; // in seconds
  fileSize: number; // in bytes
}

// Base class with contract
abstract class MediaPlayerBad {
  // ❌ Contract: play() should work for all media types
  abstract play(file: MediaFile): boolean;

  // ❌ Contract: pause() should work for all media types
  abstract pause(): boolean;

  // ❌ Contract: stop() should work for all media types
  abstract stop(): boolean;

  // ❌ Contract: getCurrentPosition() should return position in seconds
  abstract getCurrentPosition(): number;

  // ❌ Contract: seek() should allow seeking to any position
  abstract seek(position: number): boolean;
}

// ❌ VideoPlayer violates LSP - it cannot fulfill all contracts
class VideoPlayerBad extends MediaPlayerBad {
  private isPlaying = false;
  private currentPosition = 0;
  private currentFile: MediaFile | null = null;

  play(file: MediaFile): boolean {
    // ❌ VideoPlayer requires video codec information that MediaFile doesn't have
    const codec = file.path.split(".").pop()?.toUpperCase() || "";
    if (!["MP4", "AVI", "MKV"].includes(codec)) {
      throw new Error(`Video codec ${codec} not supported`);
    }

    this.currentFile = file;
    this.isPlaying = true;
    this.currentPosition = 0;
    console.log(`Playing video: ${file.name}`);
    return true;
  }

  pause(): boolean {
    if (!this.isPlaying) {
      // ❌ Violates LSP: base class doesn't specify that pause can fail
      return false;
    }
    this.isPlaying = false;
    console.log(`Video paused at position: ${this.currentPosition} seconds`);
    return true;
  }

  stop(): boolean {
    this.isPlaying = false;
    this.currentPosition = 0;
    console.log("Video stopped");
    return true;
  }

  getCurrentPosition(): number {
    // ❌ VideoPlayer can only work if a video is loaded
    if (this.currentFile === null) {
      throw new Error("No video file loaded");
    }
    return this.currentPosition;
  }

  seek(position: number): boolean {
    if (this.currentFile === null) {
      throw new Error("No video file loaded");
    }

    // ❌ VideoPlayer has restrictions on seeking
    if (position < 0 || position > this.currentFile.duration) {
      return false;
    }

    this.currentPosition = position;
    console.log(`Seeked to position: ${position} seconds`);
    return true;
  }

  // VideoPlayer has video-specific methods
  setBrightness(level: number): void {
    console.log(`Setting brightness to: ${level}`);
  }
}

// ❌ AudioPlayer violates LSP - it cannot fulfill all contracts
class AudioPlayerBad extends MediaPlayerBad {
  private isPlaying = false;
  private currentPosition = 0;
  private currentFile: MediaFile | null = null;

  play(file: MediaFile): boolean {
    // ❌ AudioPlayer requires audio format information
    const format = file.path.split(".").pop()?.toUpperCase() || "";
    if (!["MP3", "WAV", "FLAC"].includes(format)) {
      throw new Error(`Audio format ${format} not supported`);
    }

    this.currentFile = file;
    this.isPlaying = true;
    this.currentPosition = 0;
    console.log(`Playing audio: ${file.name}`);
    return true;
  }

  pause(): boolean {
    // ❌ AudioPlayer's pause behaves differently - it doesn't check if playing
    this.isPlaying = false;
    console.log(`Audio paused at position: ${this.currentPosition} seconds`);
    return true;
  }

  stop(): boolean {
    this.isPlaying = false;
    this.currentPosition = 0;
    console.log("Audio stopped");
    return true;
  }

  getCurrentPosition(): number {
    // ❌ AudioPlayer can only work if audio is loaded
    if (this.currentFile === null) {
      throw new Error("No audio file loaded");
    }
    return this.currentPosition;
  }

  seek(position: number): boolean {
    // ❌ AudioPlayer doesn't support seeking - violates contract
    throw new Error("AudioPlayer does not support seeking");
  }

  // AudioPlayer has audio-specific methods
  setVolume(level: number): void {
    console.log(`Setting volume to: ${level}`);
  }
}

// ❌ This function expects any MediaPlayer, but subtypes break the contract
function playMediaSequence(player: MediaPlayerBad, files: MediaFile[]): void {
  for (const file of files) {
    try {
      player.play(file);
      // Simulate playback
      setTimeout(() => {}, 1000);
      player.pause();
      const position = player.getCurrentPosition(); // ❌ Can throw exception for AudioPlayer
      player.seek(position + 10); // ❌ Can throw exception for AudioPlayer
      player.stop();
    } catch (e) {
      // ❌ We need exception handling because subtypes break the contract
      console.log(`Error: ${e instanceof Error ? e.message : "Unknown error"}`);
    }
  }
}

export function MediaPlayerSystemBad() {
  const videoFile: MediaFile = {
    name: "movie.mp4",
    path: "/path/to/movie.mp4",
    duration: 3600,
    fileSize: 1024000000,
  };

  const audioFile: MediaFile = {
    name: "song.mp3",
    path: "/path/to/song.mp3",
    duration: 180,
    fileSize: 5120000,
  };

  const handleVideoPlayer = () => {
    const videoPlayer = new VideoPlayerBad();
    try {
      playMediaSequence(videoPlayer, [videoFile]);
    } catch (e) {
      console.log(
        `VideoPlayer failed: ${e instanceof Error ? e.message : "Unknown error"}`
      );
    }
  };

  const handleAudioPlayer = () => {
    const audioPlayer = new AudioPlayerBad();
    try {
      // ❌ This will fail because AudioPlayer doesn't support seek()
      playMediaSequence(audioPlayer, [audioFile]);
    } catch (e) {
      console.log(
        `AudioPlayer failed: ${e instanceof Error ? e.message : "Unknown error"}` // Expected to fail!
      );
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Bad: Violating LSP</h2>
      <p className="mb-4 text-gray-600">
        AudioPlayer and VideoPlayer cannot be substituted for MediaPlayer
        without breaking functionality. AudioPlayer throws exceptions when
        seeking, and both players throw exceptions when no file is loaded.
      </p>
      <div className="space-x-2">
        <button
          onClick={handleVideoPlayer}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Test Video Player (Check Console)
        </button>
        <button
          onClick={handleAudioPlayer}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Test Audio Player (Check Console)
        </button>
      </div>
    </div>
  );
}

