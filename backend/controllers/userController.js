import { getAllUsers, getUserById, updateUserinfo, deleteUserById } from "../services/userService.js";
import logger from "../utils/logger.js";

const getUsers = async (req, res) => {
  try {
    logger.info("Tüm Kullanıcıları Getirme İşlemi Başladı");
    const users = await getAllUsers();
    logger.info("Tüm Kullanıcılar Başarıyla Getirildi");
    res.json(users);
  } catch (error) {
    logger.error("Kullanıcıları Getirirken Hata:", error);
    res.status(400).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    logger.info("Kullanıcı Detayı Getirme İşlemi Başladı");
    const user = await getUserById(req.params.id);
    logger.info("Kullanıcı Detayı Başarıyla Getirildi");
    res.json(user);
  } catch (error) {
    logger.error("Kullanıcı Detayı Getirilirken Hata:", error);
    res.status(400).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
    try {
        logger.info("Kullanıcı Güncelleme İşlemi Başladı");
        const { name, email, role } = req.body;
        const user = await updateUserinfo(req.params.id, name, email, role);
        const updatedUser = await getUserById(req.params.id);
        logger.info("Kullanıcı Başarıyla Güncellendi");
        res.status(200).json({ message: "User updated", updatedUser });
    } catch (error) {
        logger.error("Kullanıcı Güncellenirken Hata:", error);
        res.status(400).json({ error: error.message });
    }
};


const deleteUser = async (req, res) => {
  try {
    logger.info("Kullanıcı Silme İşlemi Başladı");
    const deletedUser = await deleteUserById(req.params.id);
    logger.info("Kullanıcı Başarıyla Silindi");
    res.json({ message: "Kullanıcı başarıyla silindi", deletedUser });
  } catch (error) {
    logger.error("Kullanıcı Silinirken Hata:", error);
    res.status(400).json({ error: error.message });
  }
};

export { getUsers, getUser, updateUser, deleteUser };
