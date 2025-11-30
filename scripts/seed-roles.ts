import { SeedRolesAction } from "@/Actions/User/SeedRolesAction";

async function main() {
  try {
    console.log("Iniciando seed de roles...");
    await SeedRolesAction.execute();
    console.log("Seed de roles concluído!");
  } catch (error) {
    console.error("Erro no seed:", error);
    process.exit(1);
  }
}

main();
