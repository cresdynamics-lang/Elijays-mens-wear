const express = require('express');
const blogController = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/multer');
const { generateBlogArticle } = require('../services/geminiAi');

const router = express.Router();

// AI blog writer — given a topic/scenario, returns SEO-ready draft fields
router.post('/ai-generate', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'Gemini AI is not configured. Set GEMINI_API_KEY on the server.' });
    }
    const { topic, scenario } = req.body || {};
    if (!topic || !String(topic).trim()) {
      return res.status(400).json({ error: 'A topic is required' });
    }
    const draft = await generateBlogArticle({ topic: String(topic).trim(), scenario: String(scenario || '').trim() });
    res.json(draft);
  } catch (error) {
    console.error('AI blog generate error:', error?.message || error);
    if (error?.code === 'GEMINI_NOT_CONFIGURED') {
      return res.status(503).json({ error: 'Gemini AI is not configured on the server.' });
    }
    res.status(502).json({ error: error?.message || 'AI could not write this article' });
  }
});

// Admin endpoints (authentication required, admin/staff role required)
router.get('/', protect, authorize('admin', 'staff'), blogController.getAllBlogPosts);
router.get('/:id', protect, authorize('admin', 'staff'), blogController.getBlogPostById);
router.post('/', protect, authorize('admin', 'staff'), blogController.createBlogPost);
router.post('/upload-image', protect, authorize('admin', 'staff'), upload.single('image'), blogController.uploadBlogImage);
router.put('/:id', protect, authorize('admin', 'staff'), blogController.updateBlogPost);
router.delete('/:id', protect, authorize('admin', 'staff'), blogController.deleteBlogPost);

module.exports = router;

