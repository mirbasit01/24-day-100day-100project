const playPauseBtn = document.querySelector(".play-pause-btn");
const theaterBtn = document.querySelector(".theater-btn");
const fullscreenBtn = document.querySelector(".full-screen-btn");
const miniplayerBtn = document.querySelector(".mini-player-btn");
const muteBtn = document.querySelector(".mute-btn")
const captionsBtn = document.querySelector(".captions-btn")
const speedBtn = document.querySelector(".speed-btn")
const volumeSlider = document.querySelector(".volume-slider")
const currentTime = document.querySelector(".current-time")
const totalTime = document.querySelector(".total-time")
const thumbnailImg = document.querySelector(".thumbnail-img")
const timelineContainer = document.querySelector(".timeline-container")
const previewImg = document.querySelector(".preview-img")
 const videoContainer = document.querySelector(".video-container");
const video = document.querySelector("video");

document.addEventListener("keydown", (e) => {
  const tagName = document.activeElement.tagName.toLowerCase();

  if (tagName === "input") return;
  switch (e.key.toLowerCase()) {
    case " ":
      if (tagName === "button") return;
    case "k":
      togglePlay();
      break;
    case "f":
      toggleFullscreenMode();
      break;
    case "t":
      toggleTheaterMode();
      break;
    case "i":
      toggleMiniplayMode();
      break;
      case "m":
        toggleMute()
        break
        case "arrowleft" :
            case "j" :
                skip(-5)
                break
                case "arrowright" :
            case "i" :
                skip(5)
                break
                case "c":
                    toggleCaptions()
                    break
                
  }
});
// timeline

 timelineContainer.addEventListener("mousemove", handleTimelineUpdate)
 timelineContainer.addEventListener("mousedown", togglEScrubbing)
 document.addEventListener("mouseup", e => {
    if(isScrubbing) togglEScrubbing(e)
 })
 document.addEventListener("mousemove", e => {
    if(isScrubbing) handleTimelineUpdate(e)
 })

 let isScrubbing =  false
 let wasPaused
 function togglEScrubbing(e){
    const rect = timelineContainer.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) /
    rect.width
    isScrubbing = (e.buttons & 1 ) === 1
    videoContainer.classList.toggle("scrubbing", isScrubbing)
    if(isScrubbing){
        wasPaused = video.paused
    video.pause()
    }
    else{
        video.currentTime = percent * video.duration
       if(!wasPaused) video.play()
    }
handleTimelineUpdate(e)
 }

function handleTimelineUpdate(e){
    const rect = timelineContainer.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) /
    rect.width
    const previewImgNumber = Math.max(1,
         Math.floor((percent *
     video.duration) / 10 ))
      const previewImgSrc = `assets/previewImgs/preview${previewImgNumber}.jpg`
      previewImg.src = previewImgSrc
      timelineContainer.style.setProperty("--preview-position", percent)

      if(isScrubbing){
        e.preventDefault()
        thumbnailImg.src = previewImgSrc
        timelineContainer.style.setProperty("--progress-position", percent)

      }

}
// playback speed
speedBtn.addEventListener("click", changePlaybackspeed)
function changePlaybackspeed(){
    let newPLaybackrate = video.playbackRate + .25
    if(newPLaybackrate >2) newPLaybackrate = .25
    video.playbackRate = newPLaybackrate 
    speedBtn.textContent = `${newPLaybackrate}x`
}


// Captions
const captions = video.textTracks[0]
captions.mode = "hidden"

captionsBtn.addEventListener("click", toggleCaptions)

function toggleCaptions() {
  const isHidden = captions.mode === "hidden"
  captions.mode = isHidden ? "showing" : "hidden"
  videoContainer.classList.toggle("captions", isHidden)
}

// Duration
video.addEventListener("loadeddata", ()=>{
    totalTime.textContent = formatDuration (video.duration)
} )
video.addEventListener("timeupdate", ()=>{
    currentTime.textContent = formatDuration (video.currentTime)
    // chenging red line
    const percent = video.currentTime / video.duration
    timelineContainer.style.setProperty("--progress-position", percent)

    
})
const leadingZeroFormatter = new Intl.NumberFormat(undefined,{
    minimumIntegerDigits: 2
})
function formatDuration(time){
    const seconds = Math.floor(time % 60 )
    const minutes = Math.floor(time / 60) % 60 
    const hours = Math.floor(time / 3600)
     if(hours === 0){
        return `${minutes}: ${leadingZeroFormatter.format(seconds)}`
     } else{
        return `${hours}:${leadingZeroFormatter.format
            (minutes)}: ${leadingZeroFormatter.format(seconds)}`

     }
}

function skip(duration){
    video.currentTime += duration

}

//  volumes

muteBtn.addEventListener("click", toggleMute)
volumeSlider.addEventListener("input", e => {
    video.volume = e.target.value
    video.muted = e.targe.value === 0
})

function toggleMute(){
    video.muted =  !video.muted
}

video.addEventListener("volumechange", ()=>{
    volumeSlider.volume = video.volume
    let volumeLevel
    if(video.muted || video.volume === 0){
        volumeSlider.volume = 0
        volumeLevel = "muted"
    } else if(video.volume >= .5){
        volumeLevel = "high"
    } else{
        volumeLevel = "low"
    }
      videoContainer.dataset.volumeLevel = volumeLevel

})
// video.volume
// video.muted
// view modes
theaterBtn.addEventListener("click", toggleTheaterMode);
fullscreenBtn.addEventListener("click", toggleFullscreenMode);
miniplayerBtn.addEventListener("click", toggleMiniplayMode);

function toggleTheaterMode() {
  videoContainer.classList.toggle("theater");
}

function toggleFullscreenMode() {
  if (document.fullscreenElement == null) {
    videoContainer.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

function toggleMiniplayMode() {
  if (videoContainer.classList.contains("mini-player")) {
    document.exitPictureInPicture();
  } else {
    video.requestPictureInPicture();
  }
}

document.addEventListener("fullscreenchange", () => {
  videoContainer.classList.toggle("full-screen", document.fullscreenElement);
});

video.addEventListener("enterpictureinpicture", () => {
  videoContainer.classList.add("mini-player");
});
video.addEventListener("leavepictureinpicture", () => {
  videoContainer.classList.remove("mini-player");
});

//   play & paused
playPauseBtn.addEventListener("click", togglePlay);
video.addEventListener("click", togglePlay);

function togglePlay() {
  video.paused ? video.play() : video.pause();
}
video.addEventListener("play", () => {
  videoContainer.classList.remove("paused");
});
video.addEventListener("pause", () => {
  videoContainer.classList.add("paused");
});
