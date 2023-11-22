
var monthSelect = document.getElementById("month");
for (var i = 1; i <= 12; i++) {
    var option = document.createElement("option");
    option.value = i;
    option.text = i + "월";
    monthSelect.add(option);
}

// 일 동적으로 생성
var daySelect = document.getElementById("day");
for (var i = 1; i <= 31; i++) {
    var option = document.createElement("option");
    option.value = i;
    option.text = i + "일";
    daySelect.add(option);
}

// 월이 변경될 때 일의 옵션을 동적으로 변경
function updateDays() {
    var selectedMonth = document.getElementById("month").value;
    var daysInMonth = new Date(yearSelect.value, selectedMonth, 0).getDate();

    // 일의 옵션을 모두 제거하고 다시 추가
    daySelect.innerHTML = "";
    for (var i = 1; i <= daysInMonth; i++) {
        var option = document.createElement("option");
        option.value = i;
        option.text = i + "일";
        daySelect.add(option);
    }
}

document.addEventListener("DOMContentLoaded", function () {

// "앞으로 가기" 이미지 클릭 시 정보를 전달하고 다음 페이지로 이동
    const front_carrot = document.getElementById('carrot');
    front_carrot.addEventListener('click', function () {
        const name = document.getElementById("name").value;
        const month = document.getElementById("month").value;
        const day = document.getElementById("day").value;
        const hobbies = document.getElementById("hobbies").value;
        
        // 정보를 로컬 스토리지에 저장
        localStorage.setItem("name", name);
        localStorage.setItem("month", month);
        localStorage.setItem("day", day);
        localStorage.setItem("hobbies", hobbies);
        // URL 매개변수를 사용하여 정보를 다음 페이지로 전달
        // const nextPageURL = `custom.html?name=${name}&birthdate=${birthdate}&hobbies=${hobbies}`;
        const nextPageURL = '/html/custom.html'
        
        // document.cookie = `name=${name}`;
        // document.cookie = `birthdate=${birthdate}`;
        // document.cookie = `hobbies=${hobbies}`;
        
        window.location.href = nextPageURL;
            // URL 매개변수를 사용하여 정보를 다음 페이지로 전달
    });

    // "뒤로 가기" 이미지 클릭 시 이전 페이지로 이동
    const back_tokki = document.getElementById('tokki');
    back_tokki.addEventListener('click', function () {
        // window.history.back();

        window.location.href = '/';
    });
});
