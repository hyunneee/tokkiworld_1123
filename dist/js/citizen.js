var boolValue;
  
document.addEventListener("DOMContentLoaded", function () {
    const name = localStorage.getItem("name");
    const month = localStorage.getItem("month");
    const day = localStorage.getItem("day");
    const hobbies = localStorage.getItem("hobbies");
    const realworld = localStorage.getItem("realworld");
    const like = localStorage.getItem("like");
    const color = localStorage.getItem("color");
    
    const likeElement = document.getElementById("like");
    
    if (likeElement !== null) {
        likeElement.textContent = like;
    } else {
        console.log("Element with id 'like' not found.");
    }
    console.log(`name: ${name}, birthdate: ${month, day}, hobbies: ${hobbies},realworld: ${realworld},like : ${like},color:${color}`);
    
    const currentDate = new Date();
     // Create a new Date object

    // Get the year, month, day, hours, minutes, and seconds
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

     
    // 날짜와 시간 정보 추출
    const current_month = currentDate.getMonth() + 1; // 월 (0부터 시작하므로 +1 해줍니다.)
    const current_day = currentDate.getDate(); // 일
// Display the date and time
console.log(`Current Date and Time: ${year}-${current_month}-${current_day} ${hours}:${minutes}:${seconds}`);
const randomThreeDigits = Math.floor(Math.random() * 900) + 100;
const citizen_number = `${year}${current_month}${current_day}${hours}${randomThreeDigits}`;
document.getElementById('numbering').textContent = 'no.'+citizen_number;
    let world_year = 2020;
    let world;
    boolValue = realworld === "true"; // true
    console.log({boolValue});
    if(boolValue){
        world = "Realworld";
        if(current_month-month >0){
            // 생일 빠름 23년
            world_year = 2023;
            console.log("current>month")
        }else if(current_month-month<0){
            // 생일 느림 22년
            world_year = 2022;
            console.log("current<month")
        }else{
            if(current_day-day>=0){
                // 생일 빠름 23년
                world_year = 2023;

            console.log("current==month")
            console.log("current>=day")
            }else{
                // 생일 느림 22년
                world_year = 2022;
                console.log("current==month")
                console.log("current<day")
            }
        }
    }else{
        world = "Cyberworld";
        const randomNumber = Math.random();
        if(randomNumber<0.5){
            world_year = 2020;
        }else{
            world_year = 2021;
        }
    }
    console.log({like});
    var updated_year = world_year + "-" + month + "-" + day;
    
   // 정보를 HTML 요소에 표시
    document.getElementById("name").textContent = name;
    document.getElementById("birthdate").textContent = updated_year;
    document.getElementById("Livingin").textContent = world;
    document.getElementById("hobbies").textContent = hobbies;
    document.getElementById("like").textContent = like;
    
    });

const entrance = document.getElementById('Entrance');

    // Entrance 요소를 클릭했을 때 다음 페이지로 이동하는 이벤트 리스너를 추가합니다.
    entrance.addEventListener('click', function () {
        // 다음 페이지로 이동할 URL을 설정합니다.
        let nextPageURL;
        if(boolValue){
            nextPageURL = '/html/realworld.html'
        }
        else{
            nextPageURL = '/html/cyberworld.html';
        }
        // window.location.href를 사용하여 페이지를 이동합니다.
        console.log(nextPageURL);
        window.location.href = nextPageURL;
    
    });