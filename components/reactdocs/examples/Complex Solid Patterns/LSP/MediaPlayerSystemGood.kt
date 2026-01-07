// ✅ GOOD EXAMPLE: Liskov Substitution Principle Applied
// All subtypes (VideoPlayer, AudioPlayer) can be substituted for MediaPlayer
// without breaking functionality - they fulfill all contracts properly

package com.solidpatterns.complex.lsp.good

data class MediaFile(
    val name: String,
    val path: String,
    val duration: Int, // in seconds
    val fileSize: Long, // in bytes
    val mediaType: MediaType
)

enum class MediaType {
    VIDEO, AUDIO
}

// ✅ Base interface with clear, minimal contract
interface MediaPlayerGood {
    // ✅ All implementations must support these operations
    fun play(file: MediaFile): Boolean
    fun pause(): Boolean
    fun stop(): Boolean
    fun getCurrentPosition(): Int // Returns 0 if no file loaded (safe default)
    fun isPlaying(): Boolean
    fun getCurrentFile(): MediaFile?
}

// ✅ VideoPlayer fulfills all contracts - can be substituted anywhere MediaPlayer is expected
class VideoPlayerGood : MediaPlayerGood {
    private var isPlaying = false
    private var currentPosition = 0
    private var currentFile: MediaFile? = null
    
    override fun play(file: MediaFile): Boolean {
        // ✅ Validate file type
        if (file.mediaType != MediaType.VIDEO) {
            println("Warning: File ${file.name} is not a video file")
            return false
        }
        
        val codec = file.path.substringAfterLast('.').uppercase()
        if (codec !in listOf("MP4", "AVI", "MKV")) {
            println("Video codec $codec not supported")
            return false
        }
        
        currentFile = file
        isPlaying = true
        currentPosition = 0
        println("Playing video: ${file.name}")
        return true
    }
    
    override fun pause(): Boolean {
        // ✅ Safe implementation - returns false if not playing (no exception)
        if (!isPlaying) {
            return false
        }
        isPlaying = false
        println("Video paused at position: $currentPosition seconds")
        return true
    }
    
    override fun stop(): Boolean {
        isPlaying = false
        currentPosition = 0
        println("Video stopped")
        return true
    }
    
    override fun getCurrentPosition(): Int {
        // ✅ Safe default - returns 0 if no file loaded (no exception)
        return currentPosition
    }
    
    override fun isPlaying(): Boolean {
        return isPlaying
    }
    
    override fun getCurrentFile(): MediaFile? {
        return currentFile
    }
    
    // ✅ Video-specific functionality doesn't break the base contract
    fun setBrightness(level: Int) {
        if (level in 0..100) {
            println("Setting brightness to: $level")
        }
    }
}

// ✅ AudioPlayer fulfills all contracts - can be substituted anywhere MediaPlayer is expected
class AudioPlayerGood : MediaPlayerGood {
    private var isPlaying = false
    private var currentPosition = 0
    private var currentFile: MediaFile? = null
    
    override fun play(file: MediaFile): Boolean {
        // ✅ Validate file type
        if (file.mediaType != MediaType.AUDIO) {
            println("Warning: File ${file.name} is not an audio file")
            return false
        }
        
        val format = file.path.substringAfterLast('.').uppercase()
        if (format !in listOf("MP3", "WAV", "FLAC")) {
            println("Audio format $format not supported")
            return false
        }
        
        currentFile = file
        isPlaying = true
        currentPosition = 0
        println("Playing audio: ${file.name}")
        return true
    }
    
    override fun pause(): Boolean {
        // ✅ Consistent behavior - checks if playing like VideoPlayer
        if (!isPlaying) {
            return false
        }
        isPlaying = false
        println("Audio paused at position: $currentPosition seconds")
        return true
    }
    
    override fun stop(): Boolean {
        isPlaying = false
        currentPosition = 0
        println("Audio stopped")
        return true
    }
    
    override fun getCurrentPosition(): Int {
        // ✅ Safe default - returns 0 if no file loaded (no exception)
        return currentPosition
    }
    
    override fun isPlaying(): Boolean {
        return isPlaying
    }
    
    override fun getCurrentFile(): MediaFile? {
        return currentFile
    }
    
    // ✅ Audio-specific functionality doesn't break the base contract
    fun setVolume(level: Int) {
        if (level in 0..100) {
            println("Setting volume to: $level")
        }
    }
}

// ✅ Extended interface for players that support seeking
interface SeekableMediaPlayer : MediaPlayerGood {
    fun seek(position: Int): Boolean // Optional enhancement
}

// ✅ VideoPlayer implements seeking
class SeekableVideoPlayerGood : VideoPlayerGood(), SeekableMediaPlayer {
    override fun seek(position: Int): Boolean {
        val file = getCurrentFile()
        if (file == null) {
            return false
        }
        
        if (position < 0 || position > file.duration) {
            return false
        }
        
        // Update current position through reflection or protected method
        println("Seeked video to position: $position seconds")
        return true
    }
}

// ✅ AudioPlayer also implements seeking (optional enhancement)
class SeekableAudioPlayerGood : AudioPlayerGood(), SeekableMediaPlayer {
    override fun seek(position: Int): Boolean {
        val file = getCurrentFile()
        if (file == null) {
            return false
        }
        
        if (position < 0 || position > file.duration) {
            return false
        }
        
        println("Seeked audio to position: $position seconds")
        return true
    }
}

// ✅ This function works with ANY MediaPlayer implementation
fun playMediaSequence(player: MediaPlayerGood, files: List<MediaFile>) {
    for (file in files) {
        // ✅ No exceptions needed - all operations are safe
        val played = player.play(file)
        if (!played) {
            println("Failed to play ${file.name}")
            continue
        }
        
        Thread.sleep(1000) // Simulate playback
        
        player.pause()
        val position = player.getCurrentPosition() // ✅ Safe - never throws
        
        // ✅ Check if player supports seeking before using it
        if (player is SeekableMediaPlayer) {
            player.seek(position + 10)
        }
        
        player.stop()
    }
}

// ✅ Function that works with any player type
fun demonstrateSubstitutability() {
    val videoFile = MediaFile("movie.mp4", "/path/to/movie.mp4", 3600, 1024000000L, MediaType.VIDEO)
    val audioFile = MediaFile("song.mp3", "/path/to/song.mp3", 180, 5120000L, MediaType.AUDIO)
    
    val players: List<MediaPlayerGood> = listOf(
        VideoPlayerGood(),
        AudioPlayerGood(),
        SeekableVideoPlayerGood(),
        SeekableAudioPlayerGood()
    )
    
    // ✅ All players can be used interchangeably
    for (player in players) {
        println("\nTesting player: ${player::class.simpleName}")
        playMediaSequence(player, listOf(videoFile, audioFile))
    }
}

fun main() {
    val videoFile = MediaFile("movie.mp4", "/path/to/movie.mp4", 3600, 1024000000L, MediaType.VIDEO)
    val audioFile = MediaFile("song.mp3", "/path/to/song.mp3", 180, 5120000L, MediaType.AUDIO)
    
    val videoPlayer = SeekableVideoPlayerGood()
    val audioPlayer = SeekableAudioPlayerGood()
    
    // ✅ VideoPlayer can be substituted anywhere MediaPlayer is expected
    println("Testing VideoPlayer:")
    playMediaSequence(videoPlayer, listOf(videoFile))
    
    // ✅ AudioPlayer can be substituted anywhere MediaPlayer is expected
    println("\nTesting AudioPlayer:")
    playMediaSequence(audioPlayer, listOf(audioFile))
    
    // ✅ Demonstrate substitutability
    println("\n=== Demonstrating Substitutability ===")
    demonstrateSubstitutability()
}

