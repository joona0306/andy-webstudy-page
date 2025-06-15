const wrap = document.querySelector(".card-wrap");
const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");
const modal = document.querySelector("#modal");
const modalCloseBtn = document.querySelector("#modal .text .close-btn");
// 초기 filterInput 데이터
let filterInput = "";
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
    renderCardList(dataList);

    // 검색어 입력
    searchInput.addEventListener("input", (e) => {
      filterInput = e.target.value;
    });
    // 검색 결과
    searchInput.addEventListener("keyup", (e) => {
      const filterCardList = dataList.filter((data) => {
        return searchMatch(filterInput, data.title);
      });

      // 엔터키일 때만 카드 렌더링
      if (e.keyCode === 13) {
        renderCardList(filterCardList);

        // 텍스트필드 초기화
        searchInput.value = "";
        filterInput = "";
      }
    });
    searchBtn.addEventListener("click", () => {
      const filterCardList = dataList.filter((data) => {
        return searchMatch(filterInput, data.title);
      });

      renderCardList(filterCardList);

      // 텍스트필드 초기화
      searchInput.value = "";
      filterInput = "";
    });
  })
  // 요청에 실패하면
  .catch((error) => {
    console.log(error);
  });

// 카드 목록 렌더링 함수
function renderCardList(dataList) {
  const cardList = dataList
    .map((card, index) => {
      return `
    <div class="card ${card.oddToEven} ${card.kindOfWork}">
     <div class="inner">
      <img src="${card.imgSrc}" alt="${card.title}" />
      <h2>${card.id}. ${card.title}</h2>
      <div class="desc">${marked.parse(card.desc)}</div>
      <div class="createdAt">${card.createdAt}</div>
     </div>
    </div>`;
    })
    .join("");

  wrap.innerHTML = cardList;
  //  console.log(cardList);

  // isotope 인스턴스 객체 생성
  const cardWrapIso = new Isotope(wrap, {
    itemSelector: ".card",
    transitionDuration: "0.4s",
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

  // 렌더링된 카드 목록 클릭 시 모달 창 띄우기
  const renderedCardList = document.querySelectorAll(".card");
  // fixed button wrap
  const fixedBtnWrap = document.querySelector(".fixed-btn-wrap");
  // modal fixed button wrap
  const modalFixedBtnWrap = document.querySelector(".modal-fixed-btn-wrap");
  renderedCardList.forEach((card) => {
    card.addEventListener("click", (e) => {
      // console.log("card click");
      const title = e.currentTarget.querySelector("h2").textContent;
      const desc = e.currentTarget.querySelector(".desc").innerHTML;
      const imgSrc = e.currentTarget.querySelector("img").getAttribute("src");

      modal.querySelector(".title").textContent = title;
      modal.querySelector(".desc").innerHTML = desc;
      modal.querySelector("img").setAttribute("src", imgSrc);

      modal.classList.add("active");

      fixedBtnWrap.style.display = "none";
      modalFixedBtnWrap.style.display = "flex";
    });
  });

  // modal close button (모달 창 닫기)
  modalCloseBtn.addEventListener("click", () => {
    modal.classList.remove("active");
    fixedBtnWrap.style.display = "flex";
    modalFixedBtnWrap.style.display = "none";
  });
}

// go top button (전체 페이지에서 스크롤 시 버튼 표시)
const goTopBtn = document.querySelector(".go-top-btn");
window.addEventListener("scroll", () => {
  if (!modal.classList.contains("active") && window.scrollY <= 50) {
    goTopBtn.style.visibility = "hidden";
  } else {
    goTopBtn.style.visibility = "visible";
  }
});
goTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0 });
  goTopBtn.style.visibility = "hidden";
});

// modal go top button (modal 내부에서 스크롤 시 버튼 표시)
const modalGoTopBtn = document.querySelector(
  ".modal-fixed-btn-wrap .go-top-btn"
);
modal.querySelector(".text").addEventListener("scroll", () => {
  // console.log(modal.scrollTop);
  if (
    modal.classList.contains("active") &&
    modal.querySelector(".text").scrollTop <= 50
  ) {
    modalGoTopBtn.style.visibility = "hidden";
  } else {
    modalGoTopBtn.style.visibility = "visible";
  }
});
modalGoTopBtn.addEventListener("click", () => {
  modal.querySelector(".text").scrollTo({ top: 0 });
  modalGoTopBtn.style.visibility = "hidden";
});

// 한글 초성 분해 함수
function getChosung(str) {
  const chosung = [
    "ㄱ",
    "ㄲ",
    "ㄴ",
    "ㄷ",
    "ㄸ",
    "ㄹ",
    "ㅁ",
    "ㅂ",
    "ㅃ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅉ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];
  let result = "";

  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i) - 44032;
    if (code > -1 && code < 11172) {
      result += chosung[Math.floor(code / 588)];
    } else {
      result += str.charAt(i);
    }
  }
  return result;
}
// 검색어 정규화 함수 (공백, 특수문자 제거)
function normalizeText(text) {
  return text.toLowerCase().replace(/[^ㄱ-ㅎ가-힣a-z0-9]+/g, "");
}
// 초성 검색인지 확인하는 함수
function isChosungSearch(text) {
  return /^[ㄱ-ㅎ]+$/.test(text);
}
// 검색 매칭 함수
function searchMatch(searchText, targetText) {
  const normalizedSearch = normalizeText(searchText);
  const normalizedTarget = normalizeText(targetText);

  // 빈 검색어는 모든 항목 매칭
  if (!normalizedSearch) return true;

  // 초성 검색인 경우
  if (isChosungSearch(normalizedSearch)) {
    const targetChosung = getChosung(normalizedTarget);
    return targetChosung.includes(normalizedSearch);
  }

  // 일반 검색 (부분 문자열 검색)
  return normalizedTarget.includes(normalizedSearch);
}
