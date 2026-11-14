import type { IconName } from "../components/ui/Icons";

/* -------------------------------------------------------------------------- */
/*  Layanan untuk pengunjung (guest)                                          */
/* -------------------------------------------------------------------------- */
export const guestServices: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "hospital",
    title: "Lokasi Layanan Kesehatan",
    text: "Temukan rumah sakit dan ambulans terdekat dalam peta dan daftar aksesibel.",
  },
  {
    icon: "brain",
    title: "Tes Kesehatan Mental",
    text: "Skrining awal PHQ-9, GAD-7, DASS-21, dan tes kepribadian Big Five.",
  },
  {
    icon: "doctor",
    title: "Konsultasi Dokter",
    text: "Pesan langsung dengan dokter atau spesialis terverifikasi.",
  },
  {
    icon: "bot",
    title: "Chatbot Pendamping",
    text: "Informasi kesehatan umum dan panduan menggunakan layanan Aku Care.",
  },
  {
    icon: "ambulance",
    title: "Layanan Darurat",
    text: "Akses 119/112, rumah sakit, kontak darurat, dan ambulans simulasi.",
  },
  {
    icon: "user",
    title: "Profil Medis Pribadi",
    text: "Simpan golongan darah, alergi, obat rutin, dan kontak darurat.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Artikel publik — dipakai di NewsAndAnnouncements                          */
/* -------------------------------------------------------------------------- */
export type PublicArticleTheme = "mental" | "firstaid" | "nutrition";

export type PublicArticle = {
  /** Kategori artikel (mis. "Edukasi Kesehatan") */
  type: string;
  /** Judul artikel */
  title: string;
  /** Ringkasan singkat (1–2 kalimat) */
  summary: string;
  /** Sumber/instansi penerbit */
  source: string;
  /** Tanggal tampil (format manusiawi) */
  date: string;
  /** Tema — menentukan warna fallback thumb */
  theme: PublicArticleTheme;
  /** URL gambar utama artikel (Unsplash / aset lokal) */
  image: string;
  /** Alt text gambar untuk aksesibilitas */
  imageAlt: string;
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
    image:
      "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=400&q=80",
    imageAlt:
      "Ilustrasi ketenangan pikiran dan kesehatan mental",
  },
  {
    type: "Pertolongan Pertama",
    title: "Panduan awal menghadapi kondisi pingsan",
    summary:
      "Pelajari langkah aman yang dapat dilakukan sembari menunggu bantuan tenaga kesehatan.",
    source: "Sumber: Kementerian Kesehatan RI",
    date: "6 Nov 2026",
    theme: "firstaid",
    image:
      "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=400&q=80",
    imageAlt:
      "Ilustrasi pertolongan pertama pada kondisi darurat",
  },
  {
    type: "Gizi",
    title: "Memahami pola gizi seimbang untuk keluarga",
    summary:
      "Ringkasan praktis mengenai variasi makanan, porsi, dan kebiasaan makan sehat.",
    source: "Sumber: Kementerian Kesehatan RI",
    date: "4 Nov 2026",
    theme: "nutrition",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80",
    imageAlt:
      "Ilustrasi makanan sehat dengan gizi seimbang",
  },
];