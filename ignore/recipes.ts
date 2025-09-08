// Exemplo: restrições 1 = Vegano, 2 = Celíaco, 3 = Vegetariano, 4 = Sem Lactose
export const Recipes = [
  {
    id: 1,
    title: "Bolo Vegano de Chocolate",
    description: "Bolo de chocolate sem ingredientes de origem animal.",
    restrictions: [1],
  },
  {
    id: 2,
    title: "Pão sem Glúten",
    description: "Pão caseiro feito sem glúten, ideal para celíacos.",
    restrictions: [2],
  },
  {
    id: 3,
    title: "Quibe Vegetariano",
    description: "Quibe feito com proteína de soja, sem carne animal.",
    restrictions: [3],
  },
  {
    id: 4,
    title: "Torta de Legumes",
    description: "Torta recheada com legumes frescos, sem ovos.",
    restrictions: [1, 3],
  },
  {
    id: 5,
    title: "Pizza sem Lactose",
    description: "Pizza com queijo vegetal, sem lactose.",
    restrictions: [1, 4],
  },
  {
    id: 6,
    title: "Salada de Grão-de-Bico",
    description: "Salada nutritiva e rica em proteínas vegetais.",
    restrictions: [1, 3],
  },
  {
    id: 7,
    title: "Panqueca de Aveia",
    description: "Panqueca feita com aveia, sem glúten e sem leite.",
    restrictions: [2, 4],
  },
  {
    id: 8,
    title: "Hambúrguer de Lentilha",
    description: "Hambúrguer vegetal feito com lentilha e especiarias.",
    restrictions: [1, 3],
  },
  {
    id: 9,
    title: "Mousse de Maracujá Vegano",
    description: "Sobremesa cremosa sem ingredientes de origem animal.",
    restrictions: [1],
  },
  {
    id: 10,
    title: "Coxinha de Jaca",
    description: "Coxinha feita com jaca desfiada, sem carne animal.",
    restrictions: [1, 3],
  },
];
