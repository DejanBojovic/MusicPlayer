import { loadingPlaylist, currentPlayingSong } from './func.js'

// setting playingFavorites variable that is responsible for playing/pausing video
localStorage.setItem('playingFavorites', JSON.stringify(false))
// setting loadingFavorites variable that is responsible for loading favorites playlist
localStorage.setItem('loadingFavorites', JSON.stringify(false))

const playBtnUserpage = document.querySelector('.play-user')
playBtnUserpage.addEventListener('click', () => {
    if(!JSON.parse(localStorage.getItem('playingFavorites'))) {
        // load playlist of favorites songs from userpage
        if(!JSON.parse(localStorage.getItem('loadingFavorites'))) {
            loadingPlaylist('user')
            localStorage.setItem('loadingFavorites', JSON.stringify(true))
        }

        localStorage.setItem('playingFavorites', JSON.stringify(true))
        player.playVideo()
        playBtnUserpage.children[0].classList.remove('fa-play')
        playBtnUserpage.children[0].classList.add('fa-pause')

        playBtnUserpage.children[0].style.left = '0'

        // adding color on first playing song
        document.querySelectorAll('.fav-item-left').forEach((el, index) => {
            if(index === 0) {
                el.style.color = '#fff'
            } else {
                el.style.color = ''
            }
        })
    } else {
        localStorage.setItem('playingFavorites', JSON.stringify(false))
        player.pauseVideo()
        playBtnUserpage.children[0].classList.remove('fa-pause')
        playBtnUserpage.children[0].classList.add('fa-play')

        playBtnUserpage.children[0].style.left = '1.5px'
    }
})

document.querySelector('.next-user').addEventListener('click', () => {
    // stoping user from switching songs if player is paused
    if(!JSON.parse(localStorage.getItem('playingFavorites'))) {
        return
    }
    player.nextVideo()
    playBtnUserpage.children[0].classList.remove('fa-play')
    playBtnUserpage.children[0].classList.add('fa-pause')
    playBtnUserpage.children[0].style.left = '0'

    currentPlayingSong('.fav-item-left')
})

document.querySelector('.prev-user').addEventListener('click', () => {
    // stoping user from switching songs if player is paused
    if(!JSON.parse(localStorage.getItem('playingFavorites'))) {
        return
    }
    player.previousVideo()
    playBtnUserpage.children[0].classList.remove('fa-play')
    playBtnUserpage.children[0].classList.add('fa-pause')
    playBtnUserpage.children[0].style.left = '0'

    currentPlayingSong('.fav-item-left')
})