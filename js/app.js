//select all required tags or elements
const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicArtist = wrapper.querySelector(".song-details .artist"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  progressArea = wrapper.querySelector(".progress-area"),
  progressBar = wrapper.querySelector(".progress-bar"),
  musicList = wrapper.querySelector(".music-list"),
  showMoreBtn = wrapper.querySelector("#more-music"),
  hideMusicBtn = musicList.querySelector("#close"),
  mainAudio = wrapper.querySelector("#main-audio");

let musicIndex = Math.floor(Math.random() * allMusic.length + 1);

window.addEventListener("load", () => {
  loadMusic(musicIndex);
  playingNow();
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

//next music function
function nextMusic() {
  musicIndex++;
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
}

//prev music function
function prevMusic() {
  musicIndex--;
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

// play or pause music button event
playPauseBtn.addEventListener("click", () => {
  const isMusicPaused = wrapper.classList.contains("paused");
  isMusicPaused ? pauseMusic() : playMusic();
  playingNow();
});

// next music btn event
nextBtn.addEventListener("click", () => {
  nextMusic(); //calling next music function
});

// prev music btn event
prevBtn.addEventListener("click", () => {
  prevMusic();
});

// update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");

  mainAudio.addEventListener("loadeddata", () => {
    //update song total duration
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });

  //update playing song current time
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// update playing song current time according to the progress bar width
progressArea.addEventListener("click", (e) => {
  let progressWidthVal = progressArea.clientWidth;
  let clickedOffsetX = e.offsetX; //getting offset x value
  let songDuration = mainAudio.duration;

  mainAudio.currentTime = (clickedOffsetX / progressWidthVal) * songDuration;
  playMusic();
});

// Work with: repeat, shuffle song according to the icon
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerText;
  //do different changes on different icon click using switch
  switch (getText) {
    case "repeat": //if this icon is repeat
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffle");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

//start loop status after the song ended
mainAudio.addEventListener("ended", () => {
  //according to the icon
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat": //if this icon is repeat
      nextMusic();
      break;
    case "repeat_one":
      //change the current playing song current time to 0, it'll play again
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;
    case "shuffle":
      // generating random index between the max range of array length
      let ranIndex = Math.floor(Math.random() * (allMusic.length + 1));
      do {
        ranIndex = Math.floor(Math.random() * (allMusic.length + 1));
      } while (musicIndex == ranIndex);
      musicIndex = ranIndex;
      loadMusic(musicIndex);
      playMusic();
      playingNow();
      break;
  }
});

showMoreBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", () => {
  showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

//create li according to the array length
for (let i = 0; i < allMusic.length; i++) {
  //pass the song name, artist from the array to li
  let liTag = `
  <li li-index="${i + 1}">
    <div class="row">
      <span>${allMusic[i].name}</span>
      <p>${allMusic[i].artist}</p>
    </div>
    <audio src="songs/${allMusic[i].src}.m4a" class="${
    allMusic[i].src
  }"></audio>
    <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
  </li>
  `;
  ulTag.insertAdjacentHTML("beforeend", liTag);

  let liAudioTagDuration = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

  //loadeddata event used to get audio total duration without playing it
  liAudioTag.addEventListener("loadeddata", () => {
    //update song total duration
    let audioDuration = liAudioTag.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    liAudioTagDuration.innerText = `${totalMin}:${totalSec}`;
    //store song duration in t-duration attribute so we can easily get it again
    liAudioTagDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
  });
}

//hight light current song in the play list
const allLiTag = ulTag.querySelectorAll("li");

function playingNow() {
  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector(".audio-duration");
    // let's remove playing class from all other li expect the last one which is clicked
    if (allLiTag[j].classList.contains("playing")) {
      allLiTag[j].classList.remove("playing");
      //get t-duration value and pass to .audio-duration innerText
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }
    /**
     * if there is an li tag which li-index is equal to musicIndex
     * then this music is playing now and we'll style it
     */
    if (allLiTag[j].getAttribute("li-index") == musicIndex) {
      allLiTag[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }
    // adding onclick attribute in all li tags
    allLiTag[j].setAttribute("onclick", "clicked(this)");
  }
}

//work on play particular song on click
function clicked(e) {
  // getting li index of particular clicked li tag
  let getLiIndex = e.getAttribute("li-index");
  console.log(getLiIndex);
  musicIndex = Number(getLiIndex); //passing that liIndex to musicIndex
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}
