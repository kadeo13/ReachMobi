$(document).ready(function() {
  var country="US";
  var resultClicks=0;
  var iTunesClicks=0;
  var clicksPer = iTunesClicks / resultClicks;

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getCountry)
    }
    else {
      alert("Geolocation is not supported by this browser. Defaulting to United States.")
    }
  }

  function getCountry(position) {
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    var urlStart = "http://ws.geonames.org/countryCodeJSON?";
    var urlLat = "lat=" + lat;
    var urlLong = "lng=" + long;
    var urlUsr = "username=kadeo13";
    var url = urlStart + urlLat + "&" + urlLong + "&" + urlUsr;
    $.ajax({
      url: url,
      success: function(result) {
        country = result.countryCode;
      },
      error: function(xhr, status, error) {
        console.log(xhr, status, error);
      }
    })
  }

  function saveHistory(input) {
    $("#none").hide();
    var resultDiv = document.getElementById("historyResults");
    var historyDiv = document.createElement("div");
    historyDiv.className = "result";
    var resultElm = document.createElement("h1");
    resultElm.innerHTML = input;
    resultElm.className = "history";
    historyDiv.appendChild(resultElm);
    resultDiv.prepend(historyDiv);
  }

  function showResults(results) {
    var results = JSON.parse(results);
    var resultCount = results.resultCount;
    var searchResults = results.results;
    var resultDiv = document.getElementById("results");
    for (var i = 0; i < resultCount; i++) {
      var currentResult = searchResults[i];
      var currentResultDiv = document.createElement('div');
      currentResultDiv.className = "result";
      resultDiv.appendChild(currentResultDiv);
      var leftDiv = document.createElement("div");
      leftDiv.className = "left";
      currentResultDiv.appendChild(leftDiv);
      var centerDiv = document.createElement("div");
      centerDiv.className = "center";
      currentResultDiv.appendChild(centerDiv);
      var rightDiv = document.createElement("div");
      rightDiv.className = "right";
      currentResultDiv.appendChild(rightDiv);
      var artURL = currentResult.artworkUrl100;
      var artImg = document.createElement("img");
      artImg.src = artURL;
      artImg.alt = "Album Art"
      leftDiv.appendChild(artImg);
      var artist = currentResult.artistName;
      var song = currentResult.trackName;
      var album = currentResult.collectionName;
      var songElm = document.createElement("h1");
      var albumElm = document.createElement("h1");
      var artistElm = document.createElement("h1");
      artistElm.innerHTML = "Artist: " + artist;
      songElm.innerHTML = "Song: " + song;
      albumElm.innerHTML = "Album: " + album;
      centerDiv.appendChild(songElm);
      centerDiv.appendChild(artistElm);
      centerDiv.appendChild(albumElm);
      var songURL = currentResult.trackViewUrl;
      var linkElm = document.createElement("a");
      linkElm.href = songURL;
      linkElm.target = "_blank";
      var button = document.createElement("button");
      button.className = "resultButton btn btn-secondary";
      button.innerHTML = "Look on iTunes";
      linkElm.appendChild(button);
      rightDiv.appendChild(linkElm);
    }
  }

  getLocation();

  $("#searchButton").click(function() {
    var myNode = document.getElementById("results");
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
    iTunesClicks += 1;
    document.getElementById("searchAmount").innerHTML = iTunesClicks;
    var searchInput = $("#searchBox").val();
    saveHistory(searchInput);
    var linkStart = "https://itunes.apple.com/search?";
    var encodedInput = encodeURI(searchInput);
    var url = linkStart + "term=" + encodedInput + "&country=" + country;
    $.ajax({
      url: url,
      success: function(results) {
        showResults(results);
      },
      error: function(xhr, status, error) {
        console.log(xhr, status, error);
      }
    })
  })

  $("#home").click(function() {
    $("#home").addClass("selected");
    $("#history").removeClass("selected");
    $("#settings").removeClass("selected");
    $("#historyScreen").hide();
    $("#settingsScreen").hide();
    $("#homeScreen").show();
  })

  $("#history").click(function() {
    $("#history").addClass("selected");
    $("#home").removeClass("selected");
    $("#settings").removeClass("selected");
    $("#homeScreen").hide();
    $("#settingsScreen").hide();
    $("#historyScreen").show();
  })

  $("#settings").click(function() {
    $("#settings").addClass("selected");
    $("#home").removeClass("selected");
    $("#history").removeClass("selected");
    $("#historyScreen").hide();
    $("#homeScreen").hide();
    $("#settingsScreen").show();
  })

  $("body").on('click', '.right', function() {
    resultClicks += 1;
    clicksPer = iTunesClicks / resultClicks;
    document.getElementById("resultAmount").innerHTML = resultClicks;
    document.getElementById("clicksPer").innerHTML = clicksPer;
  })

  $("body").on('click', '.history', function(e) {
    var myNode = document.getElementById("results");
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
    var searchInput = $(e.target).text()
    $("#home").addClass("selected");
    $("#history").removeClass("selected");
    $("#settings").removeClass("selected");
    $("#historyScreen").hide();
    $("#settingsScreen").hide();
    $("#homeScreen").show();
    document.getElementById("searchBox").value = searchInput;
    iTunesClicks += 1;
    document.getElementById("searchAmount").innerHTML = iTunesClicks;
    var searchInput = $("#searchBox").val();
    saveHistory(searchInput);var linkStart = "https://itunes.apple.com/search?";
    var encodedInput = encodeURI(searchInput);
    var url = linkStart + "term=" + encodedInput + "&country=" + country;
    $.ajax({
      url: url,
      success: function(results) {
        showResults(results);
      },
      error: function(xhr, status, error) {
        console.log(xhr, status, error);
      }
    })
  })
})
