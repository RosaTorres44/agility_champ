import bcrypt from "bcryptjs";

async function run() {
  const passwordPlano = "123456";
  const hash = await bcrypt.hash(passwordPlano, 10);
  console.log("🔐 Hash generado:", hash);
}

run();



//          npx tsx scripts/hashear-password.ts
// 🔐 Hash generado: $2b$10$7VzyGl.KvsgalVhoIjK.WOnqwnQcjgiRFCiNFnLQnQE85njxVcZT.