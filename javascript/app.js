   new Vue({
         el: '#app',
         data: {
            mySongs: [
               { Singer: "By Cho Tokimeki♡Sendenbu", Poster: "images/1pic.jpg", songTitle: "Kawaii Memorial", Song: "songs/song1.mp3" },
               { Singer: "By HoneyWorks", Poster: "images/2pic.jpg", songTitle: "Kawaii Gomain", Song: "songs/song2.mp3" },
               { Singer: "By Fifty Fifty", Poster: "images/3pic.jpg", songTitle: "Cupid", Song: "songs/song3.mp3" },
               { Singer: "By Melanie Martinez", Poster: "images/4pic.jpg", songTitle: "Play Date", Song: "songs/song4.mp3" },
               { Singer: "by Doja Cat", Poster: "images/5pic.jpg", songTitle: "Agora Hills", Song: "songs/song5.mp3" }
            ],
            currentSongIndex: 0,
            audioPlayer: null,
            isPlaying: false,
            currentTime: 0,
            alertMessage: '',
            duration: 0
         },
         computed: {
            currentSong() {
               return this.mySongs[this.currentSongIndex];
            },
            formattedCurrentTime() {
               return this.formatTime(this.currentTime);
            },
            formattedDuration() {
               return this.formatTime(this.duration);
            }
         },
         methods: {
            togglePlay() {
               if (this.isPlaying) {
                  this.pauseAudio();
               } else {
                  this.playAudio();
               }
            },
            playAudio() {
               this.audioPlayer.play().catch(error => {
                  console.error('Playback failed:', error);
               });
               this.isPlaying = true;
            },
            pauseAudio() {
               this.audioPlayer.pause();
               this.isPlaying = false;
            },
            nextSong() {
               if (this.currentSongIndex < this.mySongs.length - 1) {
                  this.currentSongIndex++;
                  this.changeSong(true); // Autoplay on next song
               } else {
                  this.showAlert("No next song available");
               }
            },
            previousSong() {
               if (this.currentSongIndex > 0) {
                  this.currentSongIndex--;
                  this.changeSong(true); // Autoplay on previous song
               } else {
                  this.showAlert("No previous song available");
               }
            },
            changeSong(autoPlay = false) {
               this.audioPlayer.src = this.currentSong.Song;
               this.audioPlayer.load();
               this.duration = 0; 
               this.currentTime = 0; // Reset current time when changing songs

               this.audioPlayer.addEventListener('loadedmetadata', () => {
                  this.duration = this.audioPlayer.duration;
                  if (autoPlay) {
                     this.playAudio(); // Play the song if autoPlay is true
                  }
               });

               this.audioPlayer.addEventListener('timeupdate', () => {
                  this.currentTime = this.audioPlayer.currentTime; // Update current time
               });

               this.audioPlayer.addEventListener('ended', () => {
                  this.isPlaying = false;
                  this.currentTime = 0; // Reset time when song ends
               });
               this.updateSongInfo(); // Update song info immediately
            },
            seek() {
               this.audioPlayer.currentTime = this.currentTime;
            },
            formatTime(seconds) {
               const minutes = Math.floor(seconds / 60) || 0;
               const sec = Math.floor(seconds % 60) || 0;
               return `${minutes}:${sec < 10 ? '0' : ''}${sec}`;
            },
            showAlert(message) {
               this.alertMessage = message;
               setTimeout(() => {
                  this.alertMessage = '';
               }, 2000);
            },
            updateSongInfo() {
               const currentSong = this.currentSong;
               document.getElementById('poster').src = currentSong.Poster;
               document.getElementById('songTitle').textContent = currentSong.songTitle;
               document.getElementById('singer').textContent = currentSong.Singer;
            }
         },
         mounted() {
            this.audioPlayer = new Audio(); 
            this.changeSong(); // Load first song
         }
      });