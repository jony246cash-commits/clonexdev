class MusicPlayer {
    constructor() {
        this.playlist = [
            {
                file: 'musicas/California%20Dreamin%27%20%28Remastered%29.MP3',
                title: 'California Dreamin\'',
                artist: 'The Mamas & The Papas'
            },
            {
                file: 'musicas/Eagles%20-%20Hotel%20California%20%28Official%20Audio%29.MP3',
                title: 'Hotel California',
                artist: 'Eagles'
            },
            {
                file: 'musicas/Losing%20My%20Religion.MP3',
                title: 'Losing My Religion',
                artist: 'R.E.M.'
            },
            {
                file: 'musicas/Pink%20Floyd%20%E2%80%93%20Time%20%28Official%20Audio%29.MP3',
                title: 'Time',
                artist: 'Pink Floyd'
            }
        ];
        
        this.currentTrack = 0;
        this.isPlaying = false;
        this.audio = document.getElementById('audio-player');
        this.playPauseBtn = document.getElementById('play-pause-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.volumeSlider = document.getElementById('volume-slider');
        this.volumeDisplay = document.getElementById('volume-display');
        this.currentSong = document.getElementById('current-song');
        this.currentArtist = document.getElementById('current-artist');
        
        this.init();
    }
    
    init() {
        // Configurar volume inicial (40%)
        this.audio.volume = 0.4;
        
        // Carregar primeira música
        this.loadTrack(this.currentTrack);
        
        // Event listeners
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        this.volumeSlider.addEventListener('input', (e) => this.changeVolume(e.target.value));
        
        // Auto-play quando a música estiver carregada
        this.audio.addEventListener('canplaythrough', () => {
            if (!this.isPlaying) {
                this.play();
            }
        });
        
        // Próxima música quando terminar
        this.audio.addEventListener('ended', () => this.nextTrack());
        
        // Atualizar display quando metadados carregarem
        this.audio.addEventListener('loadedmetadata', () => {
            this.updateDisplay();
        });
    }
    
    loadTrack(index) {
        if (index >= 0 && index < this.playlist.length) {
            const track = this.playlist[index];
            this.audio.src = track.file;
            this.currentTrack = index;
            this.updateDisplay();
        }
    }
    
    updateDisplay() {
        const track = this.playlist[this.currentTrack];
        this.currentSong.textContent = track.title;
        this.currentArtist.textContent = track.artist;
    }
    
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.playPauseBtn.querySelector('.play-icon').style.display = 'none';
            this.playPauseBtn.querySelector('.pause-icon').style.display = 'inline';
        }).catch(error => {
            console.log('Erro ao reproduzir:', error);
            // Tentar próxima música se houver erro
            this.nextTrack();
        });
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.playPauseBtn.querySelector('.play-icon').style.display = 'inline';
        this.playPauseBtn.querySelector('.pause-icon').style.display = 'none';
    }
    
    nextTrack() {
        this.currentTrack = (this.currentTrack + 1) % this.playlist.length;
        this.loadTrack(this.currentTrack);
        
        if (this.isPlaying) {
            // Pequeno delay para garantir que a música carregue
            setTimeout(() => this.play(), 100);
        }
    }
    
    changeVolume(value) {
        this.audio.volume = value / 100;
        this.volumeDisplay.textContent = value + '%';
    }
}

// Inicializar player quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new MusicPlayer();
});