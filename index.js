const playPauseBtn = document.querySelector('.play-pause-btn')
const theaterBtn = document.querySelector('.theater-btn')
const fullScreenBtn = document.querySelector('.full-screen-btn')
const miniPlayerBtn = document.querySelector('.mini-player-btn')
const muteBtn = document.querySelector('.mute-btn')
const speedBtn = document.querySelector('.speed-btn')
const currentTimeElem = document.querySelector('.current-time')
const totalTimeElem = document.querySelector('.total-time')
const volumeSlider = document.querySelector('.volume-slider')
const video = document.querySelector('video')
const videoContainer = document.querySelector('.video-container')
const lala = console.log('sasa')

playPauseBtn.addEventListener('click', togglePlay)
video.addEventListener('click', togglePlay)

document.addEventListener('keydown', e => {
    const tagName = document.activeElement.tagName.toLowerCase()

    if(tagName === 'input') return
    switch (e.key.toLowerCase()) {
        case " ": 
        if(tagName === 'button') return
        case "k":
            togglePlay()
            break
        case "f":
            fullScreenMode()
            break
        case "t":
            toggleTheaterMode()
            break
        case "i":
            miniPlayerMode()
            break
        case "m":
            toggleMute()
            break
        case "arrowleft":
        case "j":
            skip(-5)
            break
        case "arrowright":
        case "l":
            skip(5)
            break
    }
})

// playback speed
speedBtn.addEventListener('click', changePlaybackSpeed)

function changePlaybackSpeed(){
    let newPlaybackRate = video.playbackRate + 0.25
    if(newPlaybackRate > 2) newPlaybackRate = 0.25
    video.playbackRate = newPlaybackRate
    speedBtn.textContent = `${newPlaybackRate}x`
}

// view mode
theaterBtn.addEventListener('click', toggleTheaterMode)
fullScreenBtn.addEventListener('click', fullScreenMode)
miniPlayerBtn.addEventListener('click', miniPlayerMode)

function toggleTheaterMode() {
    videoContainer.classList.toggle('theater')
}

function fullScreenMode() {
    if(document.fullscreenElement == null){
        videoContainer.requestFullscreen()
    }else{
        document.exitFullscreen()
    }
}

function miniPlayerMode() {
   if(videoContainer.classList.contains('mini-player')){
    document.exitPictureInPicture()
   }else{
    video.requestPictureInPicture()
   }
}

document.addEventListener('fullscreenchange', () => {
    videoContainer.classList.toggle('full-screen', document.fullscreenElement)
})

video.addEventListener('enterpictureinpicture', () => {
    videoContainer.classList.add('mini-player')
})

video.addEventListener('leavepictureinpicture', () => {
    videoContainer.classList.remove('mini-player')
})

//duration
video.addEventListener('loadeddata', () => {
    totalTimeElem.textContent = formatDuration(video.duration)
})

video.addEventListener('timeupdate', () => {
    currentTimeElem.textContent = formatDuration(video.currentTime)
})

const leadingZeroFormatter = Intl.NumberFormat(undefined, {minimumIntegerDigits: 2,})
function formatDuration(time){
    const seconds = Math.floor( time % 60 )
    const minutes = Math.floor(time / 60) % 60
    const hours = Math.floor(time / 36000)
    if(hours === 0){
        return`${minutes}:${leadingZeroFormatter.format(seconds)}`
    }else{
        return`${hours}:${leadingZeroFormatter.format(minutes)}:${leadingZeroFormatter.format(seconds)}`
    }
}

function skip(duration){
    video.currentTime += duration
}

// volume
muteBtn.addEventListener('click', toggleMute)
volumeSlider.addEventListener('input', e =>{
    video.volume = e.target.value
    video.muted = e.target.value === 0
})

function toggleMute(){
    video.muted = !video.muted
}

video.addEventListener('volumechange', () => {
    volumeSlider.value = video.value
    let volumeLevel
    if(video.muted || video.value == 0){
        volumeSlider.value = 0
        volumeLevel = "muted"
    }else if(video.volume >= .5){
        volumeLevel = "high"
    }else{
        volumeLevel = "low"
    }

    videoContainer.dataset.volumeLevel = volumeLevel
})

// play pause
function togglePlay() {
    video.paused ? video.play() : video.pause()
}

video.addEventListener('play', () =>{
    videoContainer.classList.remove('paused')
})
video.addEventListener('pause', () => {
    videoContainer.classList.add('paused')
})