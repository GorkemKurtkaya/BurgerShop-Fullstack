import supabase from "../config/supabaseClient.js";


const getAllInvoices = async () => {
    const { data, error } = await supabase.from("invoices").select("*");
    if (error) throw new Error(error.message);
    return data;
}
const getInvoiceById = async (id) => {
    const { data, error } = await supabase.from("invoices").select("*").eq("id", id).single();
    if (error) throw new Error(error.message);
    return data;
}
const getUserInvoices = async (user_id) => {
    const { data, error } = await supabase.from("invoices").select("*").eq("user_id", user_id);
    if (error) throw new Error(error.message);
    return data;
}
const getOrderInvoices = async (order_id) => {
    const { data, error } = await supabase.from("invoices").select("*").eq("order_id", order_id);
    if (error) throw new Error(error.message);
    return data;
}

export { getAllInvoices, getInvoiceById, getUserInvoices, getOrderInvoices };
