// fetching song info from youtube data api
export default function fetchForSongs(songs) {
    const ytKey = ''

    // songs is an array of top songs from an artist - got from last.fm api
    songs.forEach(songName => {
        const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${songName.artist.name}+${songName.name}&key=${ytKey}`

        fetch(url)
        .then(res => res.json())
        .then(data => {
            if(data.error) {
                localStorage.setItem('error', JSON.stringify({type: 'limit', isActive: true}))
            } 
            const playlist = JSON.parse(localStorage.getItem('playlist'))

            // putting all needed song info into a playlist array which is then submited to localStorage
            playlist.push({
                id: data.items[0].id.videoId,
                title: songName.name,
                artist: songName.artist.name,
                img: data.items[0].snippet.thumbnails.medium.url
            })

            localStorage.setItem('playlist', JSON.stringify(playlist))
        })
        .catch(err => console.log(err))
    })
}

// fetching for top songs from an artist
export function fetchForArtistTopTracks(artistName) {
    const fmKey = ''
    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${artistName}&limit=15&api_key=${fmKey}&format=json`

    localStorage.setItem('playlist', JSON.stringify([]))

    fetch(url)
    .then(res => res.json())
    .then(data => {
        // if error is returned in answer message is shown to the user that search could not be done
        if(data.error) {
            localStorage.setItem('error', JSON.stringify({type: 'search', isActive: true}))
        } else {
            // if error is not returned, then array of top songs is passed as parameter to fetchForSongs function which gets all needed data from youtube and sets it in localStorage
            fetchForSongs(data.toptracks.track)
        }
    })
    .catch(err => {
        console.log(err)
    })

    // this function waits for 2s so that all the data is fetched properly and then displays it on musicpage
    setTimeout(displayTopTracks, 2000)
}

// fetching for similar artists
export function fetchForSimilarArtists(artistName) {
    const fmKey = ''
    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${artistName}&limit=15&&api_key=${fmKey}&format=json`

    fetch(url)
    .then(res => res.json())
    .then(data => {
        // this function displays similar artists
        displaySimilarArtists(data.similarartists.artist)
    })
}

// function that takes all the fetched info from localStorage and displays it on musicpage
function displayTopTracks() {
    // div that will contain top songs
    const songsContainer = document.querySelector('.recommend-songs')
    // setting it empty so that songs do not duplicate on search
    songsContainer.innerHTML = ''
    // getting playlist, info about top songs, from localStorage
    const playlist = JSON.parse(localStorage.getItem('playlist'))
    // getting favorite song IDs from localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites'))

    playlist.forEach(el => {
        let favStar = '<i class="song-fav far fa-star"></i>'
        // chceking if any of top songs have already been liked by the user
        // if yes - putting the liked star next to that song
        favorites.forEach(elFav => {
            if(el.id === elFav.id) {
                favStar = '<i class="song-fav fas fa-star"></i>'
            }
        })

        // displaying all the top songs on musicpage
        songsContainer.insertAdjacentHTML('beforeend', 
            `<div class="song" data-id=${el.id}>
                <p>${el.title}</p>
                ${favStar}
            </div>` 
        )
    })

    // giving event listener to every song
    document.querySelectorAll('.song').forEach((el, index) => {
        // setting the first playing song color to be white
        if(index === 0) {
            el.style.color = '#fff'
        }

        el.addEventListener('click', (e) => {
            // getting the id of clicked song
            const videoId = e.target.getAttribute('data-id')

            // getting playlist from localStorage
            const playlist = JSON.parse(localStorage.getItem('playlist')).map(el => {
                return el.id
            })

            // playing the clicked song
            const songIndex = playlist.indexOf(videoId)
            player.playVideoAt(songIndex)

            // showing info about playing song - img, title
            setTimeout(() => {
                showPlayingSongInfo()
            }, 200)

            // clicked song color will be white
            currentPlayingSong('.song')
        })
    })

    // adding event listeners to stars - user likes and dislikes 
    document.querySelectorAll('.song-fav').forEach(el => {
        el.addEventListener('click', () => {
            // if user did not like this song - star will have only border
            if(el.classList.contains('far')) {
                // replacing border star with full star after user likes the song
                el.classList.replace('far', 'fas')

                // getting the videoId of that liked song
                const id = el.parentNode.getAttribute('data-id')
                
                // finding clicked song info through videoId in the playlist
                const playlist = JSON.parse(localStorage.getItem('playlist'))
                let song
                playlist.forEach(el => {
                    if(el.id === id) {
                        song = el
                    }
                })

                // adding that song info to favorites in localStorage
                const favorites = JSON.parse(localStorage.getItem('favorites'))
                favorites.push({
                    id: song.id,
                    artist: song.artist,
                    title: song.title,
                    img: song.img
                })

                localStorage.setItem('favorites', JSON.stringify(favorites))

            } else {
                // replacing full star with border star if user disliked song
                el.classList.replace('fas', 'far')

                // removing song from favorites in localStorage through videoID search
                const id = el.parentNode.getAttribute('data-id')
                favorites.forEach((el, index) => {
                    if(el.id === id) {
                        favorites.splice(index, 1)
                    }
                })

                localStorage.setItem('favorites', JSON.stringify(favorites))
            }
        })
    })
}

// displaying similar artist on musicpage
function displaySimilarArtists(data) {
    // div that will contain all similar artists
    const similarArtistsContainer = document.querySelector('.similar-artists')
    // setting it empty so artists do not duplicate
    similarArtistsContainer.innerHTML = ''
    // displaying artists
    data.forEach(el => {
        similarArtistsContainer.insertAdjacentHTML('beforeend', `<div><p>${el.name}</p></div>`)
    })

    // adding event listeners to all similar artists
    document.querySelectorAll('.similar-artists div').forEach(el => {
        el.addEventListener('click', (e) => {
            // getting the name of clicked artist
            const artist = e.target.children[0].innerHTML

            // fetching for all the top songs from that artist
            fetchForArtistTopTracks(artist)

            // stop current playlist from playing
            player.stopVideo()

            // displaying loader for 2s until all the fetching is done
            const loader = document.querySelector('.loader')
            loader.style.display = 'block'
        
            // showing all the data on the page after 2s
            setTimeout(() => {
                // fetch for similar artists only after display has switched to recommended songs
                // cause user has already been on this page, and the first thing he needs to see is top songs
                fetchForSimilarArtists(artist)
                // load a new playlist with that artist's top songs
                loadingPlaylist()

                // show top songs div to user and hide similar artists div
                document.querySelector('.similar-artists').style.display = 'none'
                document.querySelector('.recommend-songs').style.display = 'block'
                // toggle circle to left - reset it
                document.querySelector('.circle').style.left = '0px'
        
                // remove loader from the page after all the fetching and displaying has beed completed
                loader.style.display = 'none'
        
                // setting music page for first song - img, title and author
                const firstSong = JSON.parse(localStorage.getItem('playlist'))[0]

                // song title
                document.querySelector('.song-playing').innerHTML = firstSong.title
        
                // song img
                document.querySelector('.song-img').src = firstSong.img

                // song suthor
                document.querySelector('.searched-artist').innerHTML = firstSong.artist
            }, 2000)
        })
    })
}

// loading userpage dinamicaly cause info on the page changes based on user's action
export function loadUserpage() {
    // displaying userpage
    userpage.style.display = 'block'
    // hiding homepage and musicpage
    homepage.style.display = 'none'
    musicpage.style.display = 'none'

    // div that will contain all the favorites songs
    const favoritesContainer = document.querySelector('.favorites')
    // setting it on empty
    favoritesContainer.innerHTML = ''
    // getting all the favortie songs info from localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites'))

    // displaying all the favortie songs on the page
    favorites.forEach(el => {
        favoritesContainer.insertAdjacentHTML('beforeend', 
        `   
            <div class="fav-item" data-id=${el.id}>
                <div class="fav-item-left">
                    <img src=${el.img}>
                    <p><span>${el.artist}</span><span> - ${el.title}</span></p>
                </div>
                <i class="userpage-fav fas fa-star"></i>
            </div>
        `
        )
    })

    // favorite songs search
    // all the song names
    const songNames = document.querySelectorAll('.fav-item p')
    // input on userpage
    const userInput = document.querySelector('.user-input')

    // input will react on every letter user types in search
    userInput.addEventListener('input', () => {
        // going through all favorite songs names on every letter that user types
        for(let i = 0; i < songNames.length; i++) {
            // if songName includes value from input then leave that song on the page
            if((songNames[i].innerText.toLowerCase()).includes(userInput.value.toLowerCase())) {
                songNames[i].parentNode.parentNode.style.display = ""
            } else {
                // if songName does not includes value from input then remove it from the page
                songNames[i].parentNode.parentNode.style.display = "none"
            }
        }

        // when user start deleting letters form input songs start returning to the page
    })

    // removing favorite songs from the userpage and from localStorage
    document.querySelectorAll('.userpage-fav').forEach(el => {
        el.addEventListener('click', (e) => {
            // replacing full star with border star
            e.target.classList.replace('fas', 'far')
                // getting the id of clicked song
                const id = el.parentNode.getAttribute('data-id')

                // remove favorite song with same id of clicked song from favorites in localStorage
                favorites.forEach((el, index) => {
                    if(el.id === id) {
                        favorites.splice(index, 1)
                    }
                })

                // put that updated favorites array back to localStorage
                localStorage.setItem('favorites', JSON.stringify(favorites))

                // remove unliked song from the page after 0.3s so user can see that they made a change to the page
                setTimeout(() => {
                    e.target.parentNode.remove()
                    // reset userpage and its playlist
                    removeFavoriteFromUserpage()
                }, 300)
        })
    })

    // adding event listeners to left part(img, song name) of every favorite song
    document.querySelectorAll('.fav-item-left').forEach((el, index) => {
        el.addEventListener('click', () => {
            // when you click on every left side of the song (right part is the star which has different click functionality) that song is played and its color changes to white
            player.playVideoAt(index)
            currentPlayingSong('.fav-item-left')
        })
    })
}

// this function adds white color to clicked song and gray color to all other songs so user knows which song is currently playing
export function currentPlayingSong(clickedSong) {
    // this functionality is being activated after 0.2s cause player needs to update currently playing song
    setTimeout(() => {
        // getting array id of currently playing song after player has been updated
        const songIndex = player.getPlaylistIndex()
        document.querySelectorAll(`${clickedSong}`).forEach((el, indexInner) => {
            // finding id of song divs that matches id of currenlty playing song in player and updating that div color to white
            if(songIndex === indexInner) {
                el.style.color = '#fff'
            } else {
                // other div color are set to gray
                el.style.color = ''
            }
        })
    }, 200)
}

// this function is only used on musicpage and it shows img and song title at the top of the page
function showPlayingSongInfo() {
    const songDiv = document.querySelector('.song-playing')
    const songImg = document.querySelector('.song-img')
    const songPlayingIndex = player.getPlaylistIndex()

    JSON.parse(localStorage.getItem('playlist')).forEach((el, index) => {
        if(index === songPlayingIndex) {
            songDiv.innerHTML = el.title
            songImg.src = el.img
        }
    });
}

export function loadingPlaylist(userpage) {
    // if userpage is displayed
    if(userpage) {
        // take videoId of every favorite song from localStorage
        let p = JSON.parse(localStorage.getItem('favorites')).map(el => el.id)

        // that array is passed to function that loads the playlist
        player.loadPlaylist({
            playlist: p
        })
        // playlist loop functionality
        player.setLoop(true)

        // stoping the playlist from starting at the userpage load
        player.stopVideo()
    } else {
        // in case that musicpage is being displayed
        // get videoId of every song from playlist
        let p = JSON.parse(localStorage.getItem('playlist')).map(el => el.id)
        // that array is passed to function that loads the playlist
        player.loadPlaylist({
            playlist: p
        })
        // playlist loop functionality
        player.setLoop(true)
    
        // playlist starts right away
        player.playVideo()
        
        // since playlist start righat away play button(default) is sett to pause
        document.querySelector('.play i').classList.replace('fa-play', 'fa-pause')
        document.querySelector('.play i').style.left = '0'
    }
}

function removeFavoriteFromUserpage() {
    player.stopVideo()

    document.querySelector('.play-user i').classList.replace('fa-pause', 'fa-play')
    document.querySelector('.play-user i').style.left = '1.5px'

    //loadingPlaylist('user')

    // setting playingFavorites variable that is responsible for playing/pausing video
    localStorage.setItem('playingFavorites', JSON.stringify(false))
    // setting loadingFavorites variable that is responsible for loading favorites playlist
    localStorage.setItem('loadingFavorites', JSON.stringify(false))

    // adding color on first playing song
    document.querySelectorAll('.fav-item-left').forEach(el => {
        el.style.color = ''
    })
}