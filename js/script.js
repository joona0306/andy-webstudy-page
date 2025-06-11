const wrap = document.querySelector(".card-wrap");
// 초기 데이터 리스트
let dataList = [];

// 데이터 요청
fetch("data/data.json")
 // 요청에 성공하면
 .then((response) => {
  return response.json();
 })
 .then((data) => {
  // console.log(data);
  dataList = data;

  // 카드 목록 렌더링 함수 호출
  renderCardList();

  // isotope 인스턴스 객체 생성
  const cardWrapIso = new Isotope(wrap, {
   itemSelector: ".card",
   masonry: {
    // use element for option
    columnWidth: ".card",
   },
  });

  // imagesloaded를 활용하여 모든 이미지 로드 완료 후 레이아웃 재계산
  const cardImgLoad = imagesLoaded(wrap);
  // 모든 이미지 로드 완료 시 실행
  cardImgLoad.on("done", function (instance) {
   console.log("모든 이미지 로드 완료!");
   // 레이아웃 재계산
   cardWrapIso.layout();
  });
  // 이미지 로드 실패 시 실행
  cardImgLoad.on("fail", function (instance) {
   console.log("일부 이미지 로드 실패!");
   // 레이아웃 재계산
   cardWrapIso.layout();
  });

  // 필터 기능
  const filterBtnList = document.querySelectorAll(".filter li");
  // console.log(filterBtnList);

  filterBtnList.forEach((filterBtn) => {
   filterBtn.addEventListener("click", (e) => {
    e.preventDefault(); // a태그 기본동작 방지

    // 필터링 및 재정렬
    const filter = e.currentTarget.querySelector("a").getAttribute("href");

    cardWrapIso.arrange({
     filter: filter,
    });
   });
  });
 })
 // 요청에 실패하면
 .catch((error) => {
  console.log(error);
 });

// 카드 목록 렌더링 함수
function renderCardList() {
 const cardList = dataList
  .map((card, index) => {
   return `
    <div class="card ${card.oddToEven} ${card.kindOfWork}">
     <div class="inner">
      <img src="${card.imgSrc}" alt="${card.title}" />
      <h2>${card.title}</h2>
      <p>${card.desc}</p>
      <p>${card.createdAt}</p>
     </div>
    </div>`;
  })
  .join("");

 wrap.innerHTML = cardList;
 //  console.log(cardList);
}
