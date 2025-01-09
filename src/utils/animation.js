export const coinMove = (curId, targetId, imgurl, offset=0) => {
  const wallet = document.getElementById(curId);
  const targetDiv = document.getElementById(targetId);
  const coinCount = 24;

  const walletRect = wallet.getBoundingClientRect();
  const targetRect = targetDiv.getBoundingClientRect();

  const coins = [];
  for (let i = 0; i < coinCount; i++) {
    const coin = document.createElement("img");
    coin.className = "coin";

    coin.src = imgurl || "/img/booster/4ever-point-icon.png";
    coin.style.left = "50%";
    coin.style.top = "50%";
    coin.style.transform = "translate(-50%, -50%)";
    coin.style.width = "16px";
    coin.style.height = "16px";
    coin.style.position = "absolute";
    coin.style.zIndex = "9999";
    wallet.appendChild(coin);
    coins.push(coin);
  }

  window.gsap.to(coins, {
    duration: 0.5,
    x: (i) => {
      const angle = 360 / coinCount;
      // console.log(Math.sin(angle * i) * 30 + walletRect.left, i);
      return Math.sin(angle * i) * 30;
    },
    y: (i) => {
      const angle = 360 / coinCount;
      return Math.cos(angle * i) * 30;
    },
    stagger: 0.02,
  });

  window.gsap.to(coins, {
    duration: 1.5,
    x: function () {
      //function-based value
      return targetRect.left - targetRect.width * 0.5 - 16 - walletRect.left + offset*1;
    },
    y: function () {
      //function-based value
      return targetRect.top - targetRect.height * 0.5 - 16 - walletRect.top;
    },
    opacity: 0,
    stagger: 0.05,
    ease: "power3.in",
    onComplete: () => {
      // window.gsap.to(coins, { duration: 0.2, opacity: 0 });
      coins.forEach((it) => {
        wallet.removeChild(it);
      });
    },
  });
};

export const tonMove = (curId, targetId, imgurl) => {
  const wallet = document.getElementById(curId);
  const targetDiv = document.getElementById(targetId);
  const coinCount = 24;

  const walletRect = wallet.getBoundingClientRect();
  const targetRect = targetDiv.getBoundingClientRect();

  const coins = [];
  for (let i = 0; i < coinCount; i++) {
    const coin = document.createElement("img");
    coin.className = "coin";

    coin.src = imgurl || "/img/booster/ton-icon.png";
    coin.style.left = "50%";
    coin.style.top = "50%";
    coin.style.transform = "translate(-50%, -50%)";
    coin.style.width = "16px";
    coin.style.height = "16px";
    coin.style.position = "absolute";
    coin.style.zIndex = "9999";
    wallet.appendChild(coin);
    coins.push(coin);
  }

  window.gsap.to(coins, {
    duration: 0.5,
    x: (i) => {
      const angle = 360 / coinCount;
      // console.log(Math.sin(angle * i) * 30 + walletRect.left, i);
      return Math.sin(angle * i) * 30;
    },
    y: (i) => {
      const angle = 360 / coinCount;
      return Math.cos(angle * i) * 30;
    },
    stagger: 0.02,
  });

  window.gsap.to(coins, {
    duration: 1.5,
    x: function () {
      //function-based value
      return targetRect.left + targetRect.width * 0.5 - 32 - walletRect.left;
    },
    y: function () {
      //function-based value
      return targetRect.top - targetRect.height * 0.5 - 16 - walletRect.top;
    },
    opacity: 0,
    stagger: 0.05,
    ease: "power3.in",
    onComplete: () => {
      // window.gsap.to(coins, { duration: 0.2, opacity: 0 });
      coins.forEach((it) => {
        wallet.removeChild(it);
      });
    },
  });
};
