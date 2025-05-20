import { registerUser, loginUser, logoutUser, checkAuth } from "../services/authService.js";
import logger from "../utils/logger.js";

const register = async (req, res) => {
  try {
    logger.info("Kullanıcı Kayıt İşlemi Başladı");
    const { name,email, password, role } = req.body;
    const user = await registerUser(name,email, password, role);
    logger.info("Kullanıcı Başarıyla Kaydedildi");
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    logger.error("Kullanıcı Kaydı Sırasında Hata:", error);
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
    try {
      logger.info("Kullanıcı Giriş İşlemi Başladı");
      const { email, password } = req.body;
      const { user, session, role } = await loginUser(email, password);
      
      // Token'ı güvenli bir cookie olarak ayarla
      res.cookie('token', session.access_token, {
        httpOnly: true, // JavaScript ile erişimi engelle
        sameSite: 'None', // CSRF koruması için
        maxAge: 24 * 60 * 60 * 1000,
        secure: true // HTTPS üzerinden gönderilecek
      });

      res.cookie('userId', user.id, {
        sameSite: 'None', // CSRF koruması için
        maxAge: 24 * 60 * 60 * 1000,
        secure: true // HTTPS üzerinden gönderilecek
      });

      logger.info("Kullanıcı Başarıyla Giriş Yaptı");
      res.status(200).json({ 
        message: "Giriş başarılı",
        user: {
          id: user.id,
          email: user.email,
          role: role
        }
      });
    } catch (error) {
      logger.error("Kullanıcı Girişi Sırasında Hata:", error);
      res.status(400).json({ error: error.message });
    }
};

const logout = async (req, res) => {
  try {
    logger.info("Kullanıcı Çıkış İşlemi Başladı");
    await logoutUser();
    
    // Cookie'yi temizle
    res.clearCookie('token');
    res.clearCookie('userId');
    logger.info("Kullanıcı Başarıyla Çıkış Yaptı");
    res.status(200).json({ message: "Çıkış başarılı" });
  } catch (error) {
    logger.error("Kullanıcı Çıkışı Sırasında Hata:", error);
    res.status(400).json({ error: error.message });
  }
};

const checkAdmin = async (req, res) => {
  try {
    logger.info("Admin Kontrol İşlemi Başladı");
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ error: "Oturum bulunamadı" });
    }

    const user = await checkAuth(token);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ isAdmin: false });
    }

    res.status(200).json({ isAdmin: true });
  } catch (error) {
    logger.error("Admin Kontrolü Sırasında Hata:", error);
    res.status(401).json({ error: error.message });
  }
};

// Oturum kontrolü
const checkUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ error: "Oturum bulunamadı" });
    }

    const user = await checkAuth(token);
    res.status(200).json({ user });
  } catch (error) {
    console.error('Check user error:', error);
    // Token hatası varsa cookie'leri temizle
    if (error.message.includes("token") || error.message.includes("session")) {
      res.clearCookie('token');
      res.clearCookie('userId');
    }
    res.status(401).json({ error: error.message });
  }
};

export { register, login, logout, checkAdmin, checkUser };
