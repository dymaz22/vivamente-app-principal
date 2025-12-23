// functions/kirvano-webhook.cjs
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  // 1. Apenas aceita POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    // 2. Configura o Supabase
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("❌ Configuração do Supabase ausente.");
      return { statusCode: 500, body: JSON.stringify({ error: "Server Configuration Error" }) };
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 3. Lê os dados
    const payload = JSON.parse(event.body);
    console.log("💰 Webhook recebido:", payload);

    // Pega o email e FORÇA MINÚSCULO para evitar erro de digitação
    let customerEmail = payload.customer?.email || payload.email;
    
    if (!customerEmail) {
      console.error("❌ Email não encontrado no payload.");
      return { statusCode: 400, body: JSON.stringify({ error: "Email missing" }) };
    }

    customerEmail = customerEmail.toLowerCase().trim();
    console.log(`🔍 Buscando usuário: ${customerEmail}`);

    // 4. Busca usuário no Auth
    const { data: { users }, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (userError) throw userError;

    // Compara emails em minúsculo
    const user = users.find(u => u.email?.toLowerCase() === customerEmail);

    if (!user) {
      console.error("❌ Usuário não encontrado no banco.");
      // Retorna 200 JSON para a Kirvano não ficar tentando de novo
      return { 
        statusCode: 200, 
        body: JSON.stringify({ message: "User not found, but webhook received" }) 
      };
    }

    // 5. Atualiza para PRO
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ is_pro: true })
      .eq('id', user.id);

    if (updateError) {
      console.error("❌ Erro ao atualizar perfil:", updateError);
      throw updateError;
    }

    console.log(`✅ SUCESSO! Usuário ${customerEmail} agora é PRO.`);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success", email: customerEmail }),
    };

  } catch (error) {
    console.error("🔥 Erro no Webhook:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};