-- Aktifkan RLS
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policy untuk Tes Mental (Hanya bisa dibaca & ditulis pemiliknya)
CREATE POLICY "User can view own results" ON public.assessment_results 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "User can insert own results" ON public.assessment_results 
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy untuk Chat (Hanya pengirim dan penerima yang bisa melihat/mengirim)
-- Catatan: Asumsi tabel messages memiliki kolom sender_id
CREATE POLICY "User can view own messages" ON public.messages 
FOR SELECT USING (auth.uid() = sender_id);

CREATE POLICY "User can send messages" ON public.messages 
FOR INSERT WITH CHECK (auth.uid() = sender_id);
