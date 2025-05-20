import { checkAdmin } from "../services/authService.js";
import supabase from "../config/supabaseClient.js";

// Token kontrolü için middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const userId = req.cookies.userId;
    
    if (!token || !userId) {
      return res.status(401).json({ error: "Oturum bulunamadı" });
    }

    // Token'ı doğrula
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      // Cookie'leri temizle
      res.clearCookie('token');
      res.clearCookie('userId');
      return res.status(401).json({ error: "Geçersiz oturum" });
    }

    // User bilgisini request nesnesine ekle
    req.userId = userId;
    next();
  } catch (error) {
    // Hata durumunda cookie'leri temizle
    res.clearCookie('token');
    res.clearCookie('userId');
    res.status(401).json({ error: "Kimlik doğrulama hatası" });
  }
};

const adminGuard = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const userId = req.cookies.userId;
    
    if (!token || !userId) {
      return res.status(401).json({ 
        error: "Oturum açmanız gerekiyor",
        debug: { 
          token: !!token,
          userId: userId 
        }
      });
    }

    // Token'ı doğrula
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.clearCookie('token');
      res.clearCookie('userId');
      return res.status(401).json({ error: "Geçersiz oturum" });
    }

    // Admin kontrolü
    const isAdmin = await checkAdmin(userId);
    console.log('Admin Check - UserId:', userId, 'Is Admin:', isAdmin);
    
    if (!isAdmin) {
      return res.status(403).json({ error: "Bu işlem için admin yetkisi gerekiyor" });
    }

    // User bilgisini request nesnesine ekle
    req.userId = userId;
    next();
  } catch (error) {
    console.error('Admin Guard Error:', error);
    res.status(500).json({ error: error.message });
  }
};

export { authMiddleware, adminGuard }; 