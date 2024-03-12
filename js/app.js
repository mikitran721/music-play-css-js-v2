//select all required tags or elements
const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicArtist = wrapper.querySelector(".song-details .artist"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  mainAudio = wrapper.querySelector("#main-audio");

let musicIndex = 2;

window.addEventListener("load", () => {
  loadMusic(musicIndex);
});

// load music function
function loadMusic(indexNum) {
  musicName.innerText = allMusic[indexNum - 1].name;
  musicArtist.innerText = allMusic[indexNum - 1].artist;
  musicImg.src = `images/${allMusic[indexNum - 1].img}.jpg`;
  mainAudio.src = `songs/${allMusic[indexNum - 1].src}.m4a`;
}

// play music function
function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

// pause music function
function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

// play or pause music button event
playPauseBtn.addEventListener("click", () => {
  const isMusicPaused = wrapper.classList.contains("paused");
  isMusicPaused ? pauseMusic() : playMusic();
});
