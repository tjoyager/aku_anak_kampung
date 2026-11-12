export default function TodoList({ items }: { items: any[] | null }) {
  if (!items || items.length === 0) return <p>Tidak ada tugas.</p>;

  return (
    <ul>
      {items.map((item, index) => (
        // Sesuaikan item.title dengan nama kolom di tabel 'todos' Supabase Anda
        <li key={item.id || index}>{item.title || "Tugas tanpa judul"}</li> 
      ))}
    </ul>
  );
}