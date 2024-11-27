import { kobisBoxOffice, searchMoviePoster } from "./kobisCommons.js";

createMovieChartList(1);

/** 순차적으로 비동기식 호출을 위해 getPoster 함수 생성  */
async function getPoster(movieNm, openDt) {
  return await searchMoviePoster(movieNm, openDt);
} //getPoster

function createMovieChartList(page) {
  const date = new Date();
  let searchDt = date
    .getFullYear()
    .toString()
    .concat(date.getMonth() + 1, date.getDate() - 1);

  kobisBoxOffice("Daily", searchDt)
    .then((result) => {
      console.log(result);

      let rankList = result.boxOfficeResult.dailyBoxOfficeList;
      let posterList = [];

      rankList.forEach((element) => {
        //영화 포스터 가져오기 - KMDB
        let movieNm = element.movieNm;
        let openDt = element.openDt.replaceAll("-", "");

        posterList.push(getPoster(movieNm, openDt));
      });

      Promise.all(posterList) //비동기식 처리는 모두 종료가 되도록 실행
        .then((poster) => {
          let output = `<ul>
                <li class="arrow" id="arrow-left"><span class="content-moviechart-arrow arrow-left" id="left">&lt;</span></li>
          `;
          let idx = 0;
          page !== 1 ? (idx += 5) : (idx = 0);
          rankList.forEach((element, i) => {
            i += idx;
            if (i < page * 5) {
              output += `
                <li>
                <div>
                  <img
                    src="${poster[i]}"
                    alt="Movie-chart1"
                    width="200px"
                  />
                </div>
                <div><h3>${element.movieNm}</h3></div>
                <div><h5>${element.audiAcc}</h5></div>
              </li>
            `;
            }
          });

          output += `<li class="arrow" id="arrow-right"><span class="content-moviechart-arrow arrow-right" id="right">&gt;</span></li></ul>`;

          // 대상 컨테이너에 추가
          document.querySelector(".content-moviechart-list").innerHTML = output;

          let arrows = document.querySelectorAll(".content-moviechart-arrow");
          arrows.forEach((arrow) => {
            arrow.addEventListener("click", onArrowClick);
          });
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
}

function onArrowClick(event) {
  let position = event.target.id;
  alert(position);
  if (position === "right") {
    document.querySelector("#arrow-right").style.display = "block";
    document.querySelector("#arrow-left").style.display = "block";
    createMovieChartList(2);
  } else if (position === "left") {
    document.querySelector("#arrow-right").style.display = "block";
    document.querySelector("#arrow-left").style.display = "none";
    createMovieChartList(1);
  }
}
