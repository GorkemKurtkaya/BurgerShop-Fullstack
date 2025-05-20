import supabase from "../config/supabaseClient.js";

const registerUser = async (name,email, password, role = "user") => {
    const { data, error } = await supabase.auth.signUp({ email, password });
  
    if (error) throw new Error(error.message);
  
    const user = data.user; 
  
    if (!user) throw new Error("User registration failed");
  
    // Kullanıcıyı 'users' tablosuna ekle
    const { error: insertError } = await supabase.from("users").insert([
      { id: user.id, email,name, role },
    ]);
  
    if (insertError) throw new Error(insertError.message);
  
    return user;
  };

const loginUser = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
    if (error) throw new Error(error.message);
  
    if (!data.user) throw new Error("Authentication failed");
  
    // Kullanıcı rolünü getir
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (userError) throw new Error(userError.message);
  
    return {
      user: data.user,
      session: data.session, // Token bilgisi session içinde
      role: userData.role
    };
};

const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};

const checkAdmin = async (userId) => {
  try {
    console.log('Checking admin for userId:', userId); // Debug için

    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) {
      console.error('Admin check error:', error); // Debug için
      throw new Error(error.message);
    }

    console.log('Admin check result:', data); // Debug için
    return data?.role === "admin";
  } catch (error) {
    console.error('Admin check caught error:', error); // Debug için
    throw error;
  }
};


const checkAuth = async (token) => {
  if (!token) throw new Error("Token bulunamadı");
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error) throw new Error(error.message);
  
  // Kullanıcı rolünü getir
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userError) throw new Error(userError.message);

  return {
    ...user,
    role: userData.role
  };
};

export { registerUser, loginUser, logoutUser, checkAdmin, checkAuth };