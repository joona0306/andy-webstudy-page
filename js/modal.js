const modal = document.querySelector("#modal");
const modalCloseBtn = document.querySelector("#modal .text span");
const cardList = document.querySelectorAll(".card");
let cardDataList = [];

fetch("data/data.json")
 .then((response) => {
  return response.json();
 })
 .then((data) => {
  cardDataList = data;
  console.log(cardDataList);

  cardDataList.forEach((card) => {
   card.addEventListener("click", (e) => {
    console.log("click");
    const title = e.currentTarget.querySelector("h2").textContent;
    const desc = e.currentTarget.querySelector("p").textContent;
    const imgSrc = e.currentTarget.querySelector("img").getAttribute("src");

    modal.querySelector("h2").textContent = title;
    modal.querySelector("p").textContent = desc;
    modal.querySelector("img").setAttribute("src", imgSrc);

    modal.classList.add("active");
    // document.body.style.overflow = "hidden";
   });
  });

  modalCloseBtn.addEventListener("click", () => {
   modal.classList.remove("active");
   //  document.body.style.overflow = "none";
   //  document.body.style.overflowX = "hidden";
  });
 })
 .catch((err) => {
  console.log(err);
 });
