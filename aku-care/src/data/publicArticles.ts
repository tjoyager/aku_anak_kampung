export type PublicArticleTheme = "mental" | "firstaid" | "nutrition";

export type PublicArticle = {
  type: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  theme: PublicArticleTheme;
};

export const publicArticles: PublicArticle[] = [
  {
    type: "Edukasi Kesehatan",
    title: "Langkah sederhana menjaga kesehatan mental setiap hari",
    summary:
      "Kenali kebiasaan yang membantu menjaga kesehatan emosi dan kapan perlu menghubungi tenaga profesional.",
    source: "Sumber: Kementerian Kesehatan RI",
    date: "8 Nov 2026",
    theme: "mental",
  },
  {
    type: "Pertolongan Pertama",
    title: "Panduan awal menghadapi kondisi pingsan",
    summary:
      "Pelajari langkah aman yang dapat dilakukan sembari menunggu bantuan tenaga kesehatan.",
    source: "Sumber: Kementerian Kesehatan RI",
    date: "6 Nov 2026",
    theme: "firstaid",
  },
  {
    type: "Gizi",
    title: "Memahami pola gizi seimbang untuk keluarga",
    summary:
      "Ringkasan praktis mengenai variasi makanan, porsi, dan kebiasaan makan sehat.",
    source: "Sumber: Kementerian Kesehatan RI",
    date: "4 Nov 2026",
    theme: "nutrition",
  },
];