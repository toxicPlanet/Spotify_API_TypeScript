/*
const clientIdCredential = 'YOUR CLIENT ID';
const clientSecretCredential = 'YOUR CLIENT SECRET';
*/


// GET TOKEN
document.getElementById('client-id-input').value = clientIdCredential
document.getElementById('client-secret-input').value = clientSecretCredential
var accessToken

var form = document.getElementById('login-form')
form.addEventListener('submit', function(e) {
    e.preventDefault()
    const clientId = document.getElementById('client-id-input').value
    const clientSecret = document.getElementById('client-secret-input').value
    var loginForm = document.getElementById('login')
    var displayTokenDiv = document.getElementById('display-token')
    var requestDiv = document.getElementById('requests')
    var tokenRequest = new XMLHttpRequest()
    tokenRequest.onreadystatechange = function() {
        if (tokenRequest.readyState == 4 && tokenRequest.status == 200) {
            var data = JSON.parse(tokenRequest.responseText)
            accessToken = data.access_token
            displayTokenDiv.innerHTML = 'Your access token is : ' + accessToken
            loginForm.classList = 'inactive'
                //displayTokenDiv.classList = 'active'
            requestDiv.classList = 'active'
        }
    }
    tokenRequest.open('POST', 'https://accounts.spotify.com/api/token', true)
    tokenRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    tokenRequest.setRequestHeader('Authorization', 'Basic ' + btoa(clientId + ':' + clientSecret))
    tokenRequest.send('grant_type=client_credentials')
})

// REQUESTS
var albumRequest = document.getElementById('request')
var searchResult
albumRequest.addEventListener('submit', function(e) {
    e.preventDefault()
    var requestResultsDiv = document.getElementById('requests-results')
    var trackRequestResultDiv = document.getElementById('track-requests-results')
    requestResultsDiv.innerHTML = ''
    trackRequestResultDiv.innerHTML = ''
    var searchRequest = new XMLHttpRequest()
    searchRequest.onreadystatechange = function() {
        if (searchRequest.readyState == 4 && searchRequest.status == 200) {
            var searchResult = JSON.parse(searchRequest.responseText)
            console.log(searchResult);
            //var searchedItem = searchResult[Object.keys(searchResult)[0]]['items'][0]['name']
            console.log(searchResult);
            var items = searchResult[Object.keys(searchResult)[0]]['items']
            if (type == 'album') {
                console.log('album search')
                albumSearch(items, requestResultsDiv)
            } else if (type == 'artist') {
                artistSearch(items, requestResultsDiv)
            } else {
                trackSearch(items, trackRequestResultDiv)
            }



        }
    }
    const query = document.getElementById("search").value
    const rbs = document.getElementsByClassName("search-type-radio")
    let selectedRadioButton
    for (let i = 0; i < rbs.length; i++) {
        const rb = rbs[i]
        if (rb.checked) {
            selectedRadioButton = rb
        }
    }
    const type = selectedRadioButton.id
    var searchUrl = "https://api.spotify.com/v1/search?q=" + query + "&type=" + type + "&limit=50"
    searchRequest.open('GET', searchUrl, true)
    searchRequest.setRequestHeader('Content-Type', 'application/json')
    searchRequest.setRequestHeader('Authorization', 'Bearer ' + accessToken)
    searchRequest.send()
})

const albumSearch = function(items, requestResultsDiv) {
    items.forEach(item => {
        var container = document.createElement('div')
        container.setAttribute('class', 'search-response-item')
        var picture = document.createElement('img')
        var title = document.createElement('div')
        var artist = document.createElement('div')
        title.setAttribute('class', 'album-title')
        artist.setAttribute('class', 'album-artist')
        picture.setAttribute('src', item['images'][1]['url'])
        title.innerHTML = item['name'] + '</br>-'
        artist.innerHTML = item['artists'][0]['name']
        console.log(item);
        console.log(item['images'][2]);
        container.appendChild(picture)
        container.appendChild(title)
        container.appendChild(artist)
        requestResultsDiv.appendChild(container)
    })
}

const artistSearch = function(items, requestResultsDiv) {
    items.forEach(item => {
        console.log(item)
        var container = document.createElement('div')
        container.setAttribute('class', 'search-response-item')
        var picture = document.createElement('img')
        var artist = document.createElement('div')
        artist.setAttribute('class', 'artist-name')
        picture.setAttribute('src', item['images'][1]['url'])
        artist.innerHTML = item['name']
        container.appendChild(picture)
        container.appendChild(artist)
        requestResultsDiv.appendChild(container)
    })
}

const trackSearch = function(items, requestResultsDiv) {
    items.forEach(item => {
        console.log(item)
        var container = document.createElement('div')
        container.setAttribute('class', 'track-request-response-item')
        var picture = document.createElement('img')
        picture.setAttribute('src', item['album']['images'][2]['url'])
        picture.setAttribute('class', 'track-album-picture')
        var textContent = document.createElement('span')

        var title = item['name']
        var artist = ''
        var artists = item['artists']
        for (let i = 0; i < artists.length; i++) {
            var newName = artists[i]['name']
            artist += newName
            if (i != artists.length - 1) {
                artist += ', '
            }
        }
        textContent.innerHTML = title + ' - ' + artist
        container.appendChild(picture)
        container.appendChild(textContent)
        requestResultsDiv.appendChild(container)
    })
}