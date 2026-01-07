// ✅ GOOD EXAMPLE: Liskov Substitution Principle Applied
// All subtypes (VideoPlayer, AudioPlayer) can be substituted for MediaPlayer
// without breaking functionality - they fulfill all contracts properly

interface MediaFile {
  name: string;
  path: string;
  duration: number; // in seconds
  fileSize: number; // in bytes
  mediaType: "VIDEO" | "AUDIO";
}

// ✅ Base interface with clear, minimal contract
interface MediaPlayerGood {
  // ✅ All implementations must support these operations
  play(file: MediaFile): boolean;
  pause(): boolean;
  stop(): boolean;
  getCurrentPosition(): number; // Returns 0 if no file loaded (safe default)
  isPlaying(): boolean;
  getCurrentFile(): MediaFile | null;
}

// ✅ Extended interface for players that support seeking
interface SeekableMediaPlayer extends MediaPlayerGood {
  seek(position: number): boolean; // Optional enhancement
}

// ✅ VideoPlayer fulfills all contracts - can be substituted anywhere MediaPlayer is expected
class VideoPlayerGood implements MediaPlayerGood {
  private _isPlaying = false;
  private currentPosition = 0;
  private currentFile: MediaFile | null = null;

  play(file: MediaFile): boolean {
    // ✅ Validate file type
    if (file.mediaType !== "VIDEO") {
      console.log(`Warning: File ${file.name} is not a video file`);
      return false;
    }

    const codec = file.path.split(".").pop()?.toUpperCase() || "";
    if (!["MP4", "AVI", "MKV"].includes(codec)) {
      console.log(`Video codec ${codec} not supported`);
      return false;
    }

    this.currentFile = file;
    this._isPlaying = true;
    this.currentPosition = 0;
    console.log(`Playing video: ${file.name}`);
    return true;
  }

  pause(): boolean {
    // ✅ Safe implementation - returns false if not playing (no exception)
    if (!this._isPlaying) {
      return false;
    }
    this._isPlaying = false;
    console.log(`Video paused at position: ${this.currentPosition} seconds`);
    return true;
  }

  stop(): boolean {
    this._isPlaying = false;
    this.currentPosition = 0;
    console.log("Video stopped");
    return true;
  }

  getCurrentPosition(): number {
    // ✅ Safe default - returns 0 if no file loaded (no exception)
    return this.currentPosition;
  }

  isPlaying(): boolean {
    return this._isPlaying;
  }

  getCurrentFile(): MediaFile | null {
    return this.currentFile;
  }

  // ✅ Video-specific functionality doesn't break the base contract
  setBrightness(level: number): void {
    if (level >= 0 && level <= 100) {
      console.log(`Setting brightness to: ${level}`);
    }
  }
}

// ✅ AudioPlayer fulfills all contracts - can be substituted anywhere MediaPlayer is expected
class AudioPlayerGood implements MediaPlayerGood {
  private _isPlaying = false;
  private currentPosition = 0;
  private currentFile: MediaFile | null = null;

  play(file: MediaFile): boolean {
    // ✅ Validate file type
    if (file.mediaType !== "AUDIO") {
      console.log(`Warning: File ${file.name} is not an audio file`);
      return false;
    }

    const format = file.path.split(".").pop()?.toUpperCase() || "";
    if (!["MP3", "WAV", "FLAC"].includes(format)) {
      console.log(`Audio format ${format} not supported`);
      return false;
    }

    this.currentFile = file;
    this._isPlaying = true;
    this.currentPosition = 0;
    console.log(`Playing audio: ${file.name}`);
    return true;
  }

  pause(): boolean {
    // ✅ Consistent behavior - checks if playing like VideoPlayer
    if (!this._isPlaying) {
      return false;
    }
    this._isPlaying = false;
    console.log(`Audio paused at position: ${this.currentPosition} seconds`);
    return true;
  }

  stop(): boolean {
    this._isPlaying = false;
    this.currentPosition = 0;
    console.log("Audio stopped");
    return true;
  }

  getCurrentPosition(): number {
    // ✅ Safe default - returns 0 if no file loaded (no exception)
    return this.currentPosition;
  }

  isPlaying(): boolean {
    return this._isPlaying;
  }

  getCurrentFile(): MediaFile | null {
    return this.currentFile;
  }

  // ✅ Audio-specific functionality doesn't break the base contract
  setVolume(level: number): void {
    if (level >= 0 && level <= 100) {
      console.log(`Setting volume to: ${level}`);
    }
  }
}

// ✅ VideoPlayer implements seeking
class SeekableVideoPlayerGood extends VideoPlayerGood implements SeekableMediaPlayer {
  seek(position: number): boolean {
    const file = this.getCurrentFile();
    if (file === null) {
      return false;
    }

    if (position < 0 || position > file.duration) {
      return false;
    }

    console.log(`Seeked video to position: ${position} seconds`);
    return true;
  }
}

// ✅ AudioPlayer also implements seeking (optional enhancement)
class SeekableAudioPlayerGood extends AudioPlayerGood implements SeekableMediaPlayer {
  seek(position: number): boolean {
    const file = this.getCurrentFile();
    if (file === null) {
      return false;
    }

    if (position < 0 || position > file.duration) {
      return false;
    }

    console.log(`Seeked audio to position: ${position} seconds`);
    return true;
  }
}

// ✅ This function works with ANY MediaPlayer implementation
function playMediaSequence(player: MediaPlayerGood, files: MediaFile[]): void {
  for (const file of files) {
    // ✅ No exceptions needed - all operations are safe
    const played = player.play(file);
    if (!played) {
      console.log(`Failed to play ${file.name}`);
      continue;
    }

    // Simulate playback
    setTimeout(() => {}, 1000);

    player.pause();
    const position = player.getCurrentPosition(); // ✅ Safe - never throws

    // ✅ Check if player supports seeking before using it
    if ("seek" in player && typeof player.seek === "function") {
      (player as SeekableMediaPlayer).seek(position + 10);
    }

    player.stop();
  }
}

export function MediaPlayerSystemGood() {
  const videoFile: MediaFile = {
    name: "movie.mp4",
    path: "/path/to/movie.mp4",
    duration: 3600,
    fileSize: 1024000000,
    mediaType: "VIDEO",
  };

  const audioFile: MediaFile = {
    name: "song.mp3",
    path: "/path/to/song.mp3",
    duration: 180,
    fileSize: 5120000,
    mediaType: "AUDIO",
  };

  const handleVideoPlayer = () => {
    const videoPlayer = new SeekableVideoPlayerGood();
    console.log("Testing VideoPlayer:");
    playMediaSequence(videoPlayer, [videoFile]);
  };

  const handleAudioPlayer = () => {
    const audioPlayer = new SeekableAudioPlayerGood();
    console.log("Testing AudioPlayer:");
    playMediaSequence(audioPlayer, [audioFile]);
  };

  const handleBothPlayers = () => {
    // ✅ All players can be used interchangeably
    const players: MediaPlayerGood[] = [
      new SeekableVideoPlayerGood(),
      new SeekableAudioPlayerGood(),
    ];

    for (const player of players) {
      console.log(`\nTesting player: ${player.constructor.name}`);
      playMediaSequence(player, [videoFile, audioFile]);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Good: Following LSP</h2>
      <p className="mb-4 text-gray-600">
        AudioPlayer and VideoPlayer can be substituted for MediaPlayer without
        breaking functionality. All operations are safe and never throw
        exceptions. Seeking is an optional enhancement via the
        SeekableMediaPlayer interface.
      </p>
      <div className="space-x-2 space-y-2">
        <button
          onClick={handleVideoPlayer}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Video Player (Check Console)
        </button>
        <button
          onClick={handleAudioPlayer}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Audio Player (Check Console)
        </button>
        <button
          onClick={handleBothPlayers}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Both Players (Check Console)
        </button>
      </div>
    </div>
  );
}

