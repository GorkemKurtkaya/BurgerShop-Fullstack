import reportService from '../services/reportService.js';

export const generateReport = async (req, res) => {
  try {
    const report = await reportService.generateReport();
    res.status(201).json({
      success: true,
      message: 'Rapor başarıyla oluşturuldu',
      data: report
    });
  } catch (error) {
    console.error('Rapor oluşturma hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Rapor oluşturulurken bir hata oluştu',
      error: error.message
    });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await reportService.getAllReports();
    res.status(200).json({
      success: true,
      data: reports
    });
  } catch (error) {
    console.error('Raporları getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Raporlar getirilirken bir hata oluştu',
      error: error.message
    });
  }
};

export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await reportService.getReportById(id);
    
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Rapor bulunamadı'
      });
    }
    
    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Rapor detayı getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Rapor detayı getirilirken bir hata oluştu',
      error: error.message
    });
  }
};
