import express from 'express';
import { generateReport, getAllReports, getReportById } from '../controllers/reportController.js';

const router = express.Router();

// Yeni rapor oluştur
router.post('/generate', generateReport);

// Tüm raporları getir
router.get('/', getAllReports);

// Belirli bir raporu getir
router.get('/:id', getReportById);

export default router;
