const modal = document.querySelector("#modal");
const modalCloseBtn = document.querySelector("#modal .text span");

let cardDataList = [];

fetch("data/data.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    cardDataList = data;
    // console.log(cardDataList);

    const cardList = document.querySelectorAll(".card");

    cardList.forEach((card) => {
      card.addEventListener("click", (e) => {
        console.log("click");
        const title = e.currentTarget.querySelector("h2").textContent;
        const desc = e.currentTarget.querySelector("p").textContent;
        const imgSrc = e.currentTarget.querySelector("img").getAttribute("src");

        modal.querySelector("h2").textContent = title;
        modal.querySelector("p").textContent = desc;
        modal.querySelector("img").setAttribute("src", imgSrc);

        modal.classList.add("active");

        // go top button
        const goTopBtn = document.querySelector(".go-top-btn");
        // console.log(goTopBtn);
        goTopBtn.style.display = "none";
      });
    });

    modalCloseBtn.addEventListener("click", () => {
      modal.classList.remove("active");
      goTopBtn.style.display = "flex";
    });
  })
  .catch((err) => {
    console.log(err);
  });
