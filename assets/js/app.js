const nodeList = [].slice.call(document.querySelectorAll('ul#shortcuts li'));
window.addEventListener('load', () => {
    getImage();
    getLocation();
    let currentTime = getTime();
    document.querySelector('.hours').innerHTML = currentTime;
    setInterval(() => {
        let currentTime = getTime();
        document.querySelector('.hours').innerHTML = currentTime;
    }, 60000);

    document.querySelector('img.settings').addEventListener("click", (event) => {
        document.querySelector('body').classList.toggle('settingsActive');
        event.target.classList.toggle("active");
        settings(event.target, nodeList);
        console.log(document.querySelectorAll('ul#shortcuts li'));
    });
});


function getTime() {
    let date = new Date();
    let heures = date.getHours();
    let minutes = date.getMinutes();
    let secondes = date.getSeconds();
    if(minutes < 10) {
        minutes = `0${minutes}`;
    } else if(heures < 10) {
        heures = `0${heures}`;
    }
    return `${heures}:${minutes}`;
} 

async function getImage() {
    try {
        fetch(`../assets/json/images.json`)
        .then(datasRaw => datasRaw.json())
        .then(datas => {
            let number = (Math.floor(Math.random() * Object.keys(datas).length));
            document.querySelector('.container').style.backgroundImage = `url(${datas[number]})`
        })
    } catch(error) {
        console.log(`Error when getting datas ${error}`)
    }
}

async function getWeather(position) {
    try {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=32bf1dca2e190181290728e796b1ab6c&units=metric&lang=fr`)
        .then(datasRaw => datasRaw.json())
        .then(datas => {
            let city = datas.name;
            let weather = datas.weather[0].description.charAt(0).toUpperCase() + datas.weather[0].description.slice(1);
            let temp = `${datas.main.temp} °C`;
            let weatherIcon = `https://openweathermap.org/img/wn/${datas.weather[0].icon}.png`
            document.querySelector('.weather').innerHTML = `
                <h2> ${city} </h2>
                <div class="weatherContent">
                    <img src="${weatherIcon}" alt="Weather Icon ${city}" class="weatherIcon">
                    <div class="weatherText">
                        <p> ${weather} </p>
                        <p> ${temp} </p>
                    </div>
                </div>
            `
        })
    } catch(error) {
        console.log(`Error when getting datas ${error}`)
    }
}

function getLocation() {
    if(navigator.geolocation) {
        try {
            navigator.geolocation.getCurrentPosition(getWeather);
        } catch(error) {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                  document.querySelector('.weather').innerHTML = "User denied the request for Geolocation."
                  break;
                case error.POSITION_UNAVAILABLE:
                  document.querySelector('.weather').innerHTML = "Location information is unavailable."
                  break;
                case error.TIMEOUT:
                  document.querySelector('.weather').innerHTML = "The request to get user location timed out."
                  break;
                case error.UNKNOWN_ERROR:
                  document.querySelector('.weather').innerHTML = "An unknown error occurred."
                  break;
              }
        }
    } else  {
        document.querySelector('.weather').innerHTML = "Geolocation is not supported by this browser.";
    }
}

function settings(img, nodeList) {
    const cross = "../assets/images/cross.png";
    if(img.classList.contains('active')) {
        img.setAttribute('src','../assets/images/done.png');
        document.querySelectorAll('ul#shortcuts li > a').forEach(element => {
            element.innerHTML += `<span class='cross'> <img src='${cross}' alt='Cross - Delete Shortcuts'> </span>`;
        });
        document.querySelectorAll('ul#shortcuts li > a > span').forEach(element => {
            element.addEventListener('click', (event) => {
                event.preventDefault();
                event.target.parentNode.parentNode.parentNode.setAttribute('class','new');
                event.target.parentNode.parentNode.parentNode.innerHTML = `
                    <a href="#" title="Add new shortcut">
                        <img src="../assets/images/add.png" alt="Ajouter un nouveau raccourci">
                    </a>
                `
            });
        });
    } else {
        img.setAttribute('src','../assets/images/dots.png');
        document.querySelectorAll('ul#shortcuts li a > span').forEach(element => {
            element.remove();
        })
    //    localStorage.setItem('shortcutsList', JSON.stringify(document.querySelector('ul#shortcuts li')));
    }
}