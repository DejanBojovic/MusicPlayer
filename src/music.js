// div that holds top songs 
const recommendSongs = document.querySelector('.recommend-songs')

// div that holds similar artists
const similarArtists = document.querySelector('.similar-artists')
// since on page oad only top songs are shown, this div is not displayed
similarArtists.style.display = 'none'

// toggle recommendSongs and similarSrtists
const toggle = document.querySelector('.recommend-toggle')
toggle.addEventListener('click', () => {
    const toggleCircle = document.querySelector('.circle')

	// if toggle circle is positioned at 0px - recommendSongs div is shown
	// if its at 16px - similarArtists is shown
    if(toggleCircle.style.left === '0px') {
        toggleCircle.style.left = '16px'

        setTimeout(() => {
            recommendSongs.style.display = 'none'
            similarArtists.style.display = 'block'
        }, 150)
    } else {
        toggleCircle.style.left = '0px'

        setTimeout(() => {
            recommendSongs.style.display = 'block'
            similarArtists.style.display = 'none'
        }, 150)
    }
})

// ====================================================
// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: '',
    playerVars: {
      'playsinline': 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
	event.target.playVideo();

	// after player has loaded we add functionality for next song
	const nextSong = document.querySelector('.next')
	nextSong.addEventListener('click', () => {
		// next video in playlist is played
		player.nextVideo()

		// this function wait for 0.2s for player to update itself
		setTimeout(() => {
			// after that current playing song img and title are shown on musicpage
			const songDiv = document.querySelector('.song-playing')
			const songImg = document.querySelector('.song-img')
			const songPlayingIndex = player.getPlaylistIndex()

			JSON.parse(localStorage.getItem('playlist')).forEach((el, index) => {
				if(index === songPlayingIndex) {
					songDiv.innerHTML = el.title
					songImg.src = el.img
				}
			});

			// and song title is colored white
			currentPlayingSong('.song')
		}, 200)
	})

	// after player has loaded we add functionality for previous song
	const prevSong = document.querySelector('.prev')
	prevSong.addEventListener('click', () => {
		// previous video in playlist is played
		player.previousVideo()

		// this function wait for 0.2s for player to update itself
		setTimeout(() => {
			// after that current playing song img and title are shown on musicpage
			const songDiv = document.querySelector('.song-playing')
			const songImg = document.querySelector('.song-img')
			const songPlayingIndex = player.getPlaylistIndex()

			JSON.parse(localStorage.getItem('playlist')).forEach((el, index) => {
				if(index === songPlayingIndex) {
					songDiv.innerHTML = el.title
					songImg.src = el.img
				}
			});

			// and song title is colored white
			currentPlayingSong('.song')
		}, 200)
	})
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
var done = false;
function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.PLAYING && !done) {
		done = true;
	}

	// if event.data === 0 that means that song has finished and a new one is about to start
	if(event.data === 0) {
		const songDiv = document.querySelector('.song-playing')
		const songImg = document.querySelector('.song-img')
		const songPlayingIndex = player.getPlaylistIndex()

		// after one song has finished get info from next song and display it
		JSON.parse(localStorage.getItem('playlist')).forEach((el, index) => {
			if(index === songPlayingIndex) {
				// title
				songDiv.innerHTML = el.title
				// img
				songImg.src = el.img
			}
		});

		// make color of currently playing song white
		currentPlayingSong('.song')

		// checking for song changing on userpage
		if(document.querySelector('#userpage').style.display === 'block') {
			currentPlayingSong('.fav-item-left p')
		}
  	}
}

function stopVideo() {
  	player.stopVideo();
}

// set playing variable to toggle on play/pause
let playing = true
const playBtn = document.querySelector('.play')

// toggling play/pause icons, pausing/playing video
playBtn.addEventListener('click', () => {
    if(!playing) {
        playing = true
        player.playVideo()
        playBtn.children[0].classList.remove('fa-play')
        playBtn.children[0].classList.add('fa-pause')

        playBtn.children[0].style.left = '0'
    } else {
        playing = false
        player.pauseVideo()
        playBtn.children[0].classList.remove('fa-pause')
        playBtn.children[0].classList.add('fa-play')

        playBtn.children[0].style.left = '1.5px'
    }
})

// this function adds white color to clicked song and gray color to all other songs so user knows which song is currently playing
function currentPlayingSong(clickedSong) {
	// getting array id of currently playing song after player has been updated
	const songIndex = player.getPlaylistIndex()
	document.querySelectorAll(`${clickedSong}`).forEach((el, indexInner) => {
		// finding id of song divs that matches id of currenlty playing song in player and updating that div color to white
		if(songIndex === indexInner) {
			el.style.color = '#fff'
		} else {
			// other div color are set to gray
			el.style.color = '#ccc'
		}
	})
}