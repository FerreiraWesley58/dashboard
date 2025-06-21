import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate } from '../middleware/auth';
import { User } from '../models/User';

const router = express.Router();

// Garantir que o diretório de uploads exista
const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const userId = (req as any).user.id;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `user-${userId}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

// Rota para upload da foto de perfil
router.post('/upload-picture', authenticate, upload.single('profilePicture'), async (req, res) => {
  try {
    const userId = (req as any).user.id;
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    // Salvar o caminho relativo no banco
    const relativePath = `/public/uploads/${req.file.filename}`;
    user.profilePictureUrl = relativePath;
    await user.save();
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao fazer upload da imagem.' });
  }
});

export default router; 