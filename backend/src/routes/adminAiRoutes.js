const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, adminOnly } = require('../middleware/auth');
const { analyzeProductImage } = require('../services/geminiAi');
const { formatResponse } = require('../utils/responseFormatter');
const { isCloudinaryConfigured } = require('../utils/cloudinaryUpload');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images are allowed'), false);
  },
});

/**
 * @desc    Analyze a product image with Gemini AI
 * @route   POST /api/admin/upload/analyze
 * @access  Private/Admin
 * @body    multipart image file ("image")
 */
router.post('/analyze', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return formatResponse(res, 400, false, 'Please attach an image file');
    }
    if (!process.env.GEMINI_API_KEY) {
      return formatResponse(res, 503, false, 'Gemini AI is not configured. Set GEMINI_API_KEY on the server.');
    }

    const base64 = req.file.buffer.toString('base64');
    const { mimeType } = req.file;
    const analysis = await analyzeProductImage(base64, { mimeType });

    return formatResponse(res, 200, true, 'AI analysis complete', analysis);
  } catch (error) {
    console.error('Gemini AI analyze error:', error?.message || error);
    if (error?.code === 'GEMINI_NOT_CONFIGURED') {
      return formatResponse(res, 503, false, 'Gemini AI is not configured on the server.');
    }
    const msg = (error?.message || '').toLowerCase();
    if (msg.includes('pem') || msg.includes('quota') || msg.includes('candidate') || msg.includes('candidate') || msg.includes('safety')) {
      return formatResponse(res, 502, false, `AI could not process this image: ${error.message}`);
    }
    return formatResponse(res, 502, false, error?.message || 'AI analysis failed');
  }
});

module.exports = router;