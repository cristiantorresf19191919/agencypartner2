// ❌ BAD EXAMPLE: Liskov Substitution Principle Violation
// Subtypes (VideoPlayer, AudioPlayer) cannot be substituted for MediaPlayer
// without breaking functionality - they throw exceptions or behave unexpectedly

package com.solidpatterns.complex.lsp.bad

data class MediaFile(
    val name: String,
    val path: String,
    val duration: Int, // in seconds
    val fileSize: Long // in bytes
)

// Base class with contract
abstract class MediaPlayerBad {
    // ❌ Contract: play() should work for all media types
    abstract fun play(file: MediaFile): Boolean
    
    // ❌ Contract: pause() should work for all media types
    abstract fun pause(): Boolean
    
    // ❌ Contract: stop() should work for all media types
    abstract fun stop(): Boolean
    
    // ❌ Contract: getCurrentPosition() should return position in seconds
    abstract fun getCurrentPosition(): Int
    
    // ❌ Contract: seek() should allow seeking to any position
    abstract fun seek(position: Int): Boolean
}

// ❌ VideoPlayer violates LSP - it cannot fulfill all contracts
class VideoPlayerBad : MediaPlayerBad() {
    private var isPlaying = false
    private var currentPosition = 0
    private var currentFile: MediaFile? = null
    
    override fun play(file: MediaFile): Boolean {
        // ❌ VideoPlayer requires video codec information that MediaFile doesn't have
        val codec = file.path.substringAfterLast('.').uppercase()
        if (codec !in listOf("MP4", "AVI", "MKV")) {
            throw UnsupportedOperationException("Video codec $codec not supported")
        }
        
        currentFile = file
        isPlaying = true
        currentPosition = 0
        println("Playing video: ${file.name}")
        return true
    }
    
    override fun pause(): Boolean {
        if (!isPlaying) {
            // ❌ Violates LSP: base class doesn't specify that pause can fail
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
        // ❌ VideoPlayer can only work if a video is loaded
        if (currentFile == null) {
            throw IllegalStateException("No video file loaded")
        }
        return currentPosition
    }
    
    override fun seek(position: Int): Boolean {
        if (currentFile == null) {
            throw IllegalStateException("No video file loaded")
        }
        
        // ❌ VideoPlayer has restrictions on seeking
        if (position < 0 || position > currentFile!!.duration) {
            return false
        }
        
        currentPosition = position
        println("Seeked to position: $position seconds")
        return true
    }
    
    // VideoPlayer has video-specific methods
    fun setBrightness(level: Int) {
        println("Setting brightness to: $level")
    }
}

// ❌ AudioPlayer violates LSP - it cannot fulfill all contracts
class AudioPlayerBad : MediaPlayerBad() {
    private var isPlaying = false
    private var currentPosition = 0
    private var currentFile: MediaFile? = null
    
    override fun play(file: MediaFile): Boolean {
        // ❌ AudioPlayer requires audio format information
        val format = file.path.substringAfterLast('.').uppercase()
        if (format !in listOf("MP3", "WAV", "FLAC")) {
            throw UnsupportedOperationException("Audio format $format not supported")
        }
        
        currentFile = file
        isPlaying = true
        currentPosition = 0
        println("Playing audio: ${file.name}")
        return true
    }
    
    override fun pause(): Boolean {
        // ❌ AudioPlayer's pause behaves differently - it doesn't check if playing
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
        // ❌ AudioPlayer can only work if audio is loaded
        if (currentFile == null) {
            throw IllegalStateException("No audio file loaded")
        }
        return currentPosition
    }
    
    override fun seek(position: Int): Boolean {
        // ❌ AudioPlayer doesn't support seeking - violates contract
        throw UnsupportedOperationException("AudioPlayer does not support seeking")
    }
    
    // AudioPlayer has audio-specific methods
    fun setVolume(level: Int) {
        println("Setting volume to: $level")
    }
}

// ❌ This function expects any MediaPlayer, but subtypes break the contract
fun playMediaSequence(player: MediaPlayerBad, files: List<MediaFile>) {
    for (file in files) {
        try {
            player.play(file)
            Thread.sleep(1000) // Simulate playback
            player.pause()
            val position = player.getCurrentPosition() // ❌ Can throw exception for AudioPlayer
            player.seek(position + 10) // ❌ Can throw exception for AudioPlayer
            player.stop()
        } catch (e: Exception) {
            // ❌ We need exception handling because subtypes break the contract
            println("Error: ${e.message}")
        }
    }
}

fun main() {
    val videoFile = MediaFile("movie.mp4", "/path/to/movie.mp4", 3600, 1024000000L)
    val audioFile = MediaFile("song.mp3", "/path/to/song.mp3", 180, 5120000L)
    
    val videoPlayer = VideoPlayerBad()
    val audioPlayer = AudioPlayerBad()
    
    // ❌ This will work for VideoPlayer but fail for AudioPlayer
    try {
        playMediaSequence(videoPlayer, listOf(videoFile))
    } catch (e: Exception) {
        println("VideoPlayer failed: ${e.message}")
    }
    
    // ❌ This will fail because AudioPlayer doesn't support seek()
    try {
        playMediaSequence(audioPlayer, listOf(audioFile))
    } catch (e: Exception) {
        println("AudioPlayer failed: ${e.message}") // Expected to fail!
    }
    
    // ❌ Cannot substitute AudioPlayer for MediaPlayer without breaking functionality
}

