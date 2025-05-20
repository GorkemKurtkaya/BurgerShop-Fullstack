import supabase from "../config/supabaseClient.js";

const getAllUsers = async () => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) throw new Error(error.message);
  return data;
};

const getUserById = async (id) => {
  const { data, error } = await supabase.from("users").select("*").eq("id", id).single();
  if (error) throw new Error(error.message);
  return data;
};

const updateUserinfo = async (id, name, email ,role) => {
  const { data, error } = await supabase.from("users").update({ name, email, role }).eq("id", id);
  if (error) throw new Error(error.message);
  return data;
}


const deleteUserById = async (id) => {
  const { data, error } = await supabase.from("users").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return data;
}

export { getAllUsers, getUserById, updateUserinfo, deleteUserById};