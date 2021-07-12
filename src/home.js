import {fetchForArtistTopTracks, fetchForSimilarArtists, loadUserpage, loadingPlaylist} from "./func.js"

// if there are no favorite songs in localStorage create favorites array
if(localStorage.getItem('favorites') === null) {
    // creating array to store favorite meals
    localStorage.setItem('favorites', JSON.stringify([]))
}

// always create empty playlist
localStorage.setItem('playlist', JSON.stringify([]))

// controlling page visibility
const homepage = document.querySelector('#homepage')
//homepage.style.display = 'none'

const musicpage = document.querySelector('#musicpage')
musicpage.style.display = 'none'

const userpage = document.querySelector('#userpage')
userpage.style.display = 'none'

// menu
const menu = document.querySelector('.menu')
// bottom screen red line
const line = document.querySelector('.line')

// adding click functionality to menu button
const menuBtn = document.querySelector('.menu-btn')
menuBtn.addEventListener('click', () => {
    // if menu is shown - hide it
    if(menu.style.height === '40%') {
        menu.style.height = '0%'
        setTimeout(() => {
            line.style.visibility = 'visible'
        }, 200)
    } else {
        // in other case - show it
        menu.style.height = '40%'
        line.style.visibility = 'hidden'
    }
})

// menu buttons
// home button
const homeBtn = document.querySelector('.menu-home')
homeBtn.addEventListener('click', () => {
    // displaying homepage
    homepage.style.display = 'flex'
    // hidding userpage and musicpage
    userpage.style.display = 'none'
    musicpage.style.display = 'none'

    // stopgin the playlist from playing after page has been changed
    player.stopVideo()

    // setting userpage buttons as they were before accessing userpage
    const playBtnUserpage = document.querySelector('.play-user')
    playBtnUserpage.children[0].classList.remove('fa-pause')
    playBtnUserpage.children[0].classList.add('fa-play')

    playBtnUserpage.children[0].style.left = '1.5px'

    // fixing the glitch on userpage play button
    localStorage.setItem('playingFavorites', JSON.stringify(false))
})

// user button
const userBtn = document.querySelector('.menu-user')
userBtn.addEventListener('click', () => {
    // load userpage
    loadUserpage()
    // if user goes to homepage and then again to userpage playlist needs to reset
    player.playVideoAt(0)
    // stop any song from playing after user goes to userpage
    player.stopVideo()
    // if playlist is updated this needs to set to false
    // on userpage when clicking on play button playlist is updated
    localStorage.setItem('loadingFavorites', JSON.stringify(false))
})

// closes menu - arrow down
const closeMenu = document.querySelector('.close-menu')
closeMenu.addEventListener('click', () => {
    menu.style.height = '0%'
    setTimeout(() => {
        line.style.visibility = 'visible'
    }, 200)
})

// searching for artists
// homepage input
const searchInput = document.querySelector('.homepage-search')
// search button - magnifying glass
const searchBtn = document.querySelector('.homepage-search-btn')
searchBtn.addEventListener('click', () => {
    // fetching for 15 top tracks of the artist
    fetchForArtistTopTracks(searchInput.value)
    // fetching for 15 similar artists
    fetchForSimilarArtists(searchInput.value)

    // showing loader for 2s so fetching can be done properly  
    const loader = document.querySelector('.loader')
    loader.style.display = 'block'

    // after 2s this function activates
    setTimeout(() => {
        // checking if the searched artist exists
        // if not, music page wont load and error will be shown to the user
        if(JSON.parse(localStorage.getItem('error'))) {
            // set error from true to false
            localStorage.setItem('error', JSON.stringify(false))

            // remove loader from the page
            loader.style.display = 'none'

            // show error message to the user, and hide it after 5s
            const errorMessage = document.querySelector('.search-error')
            errorMessage.style.display = 'block'
            setTimeout(() => {
                errorMessage.style.display = 'none'
            }, 5000)

            // end this function and stop musicpage from loading
            return
        }

        // if the artist existst, musicpage will be loaded and shown
        homepage.style.display = 'none'
        userpage.style.display = 'none'
        musicpage.style.display = 'block'

        // removing searched input value
        searchInput.value = ''

        // removing loader after all the fetching and displaying is done
        loader.style.display = 'none'

        // setting music page for first song - img, title and author
        const firstSong = JSON.parse(localStorage.getItem('playlist'))[0]
                
        // song title
        document.querySelector('.song-playing').innerHTML = firstSong.title

        // song img
        document.querySelector('.song-img').src = firstSong.img

        // song suthor
        document.querySelector('.searched-artist').innerHTML = firstSong.artist

        // start playing
        loadingPlaylist()
    }, 2000)
})