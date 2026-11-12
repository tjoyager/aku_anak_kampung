import { supabase  } from "@/lib/supabase";
import TodoList from "@/components/TodoList";

export default async function Page(){
  const { data } = await supabase.from('todos').select('*')
  return <TodoList items={data}/>
}