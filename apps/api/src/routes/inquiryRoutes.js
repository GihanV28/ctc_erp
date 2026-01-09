const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');

/**
 * @swagger
 * /api/inquiries:
 *   post:
 *     summary: Submit inquiry/support message
 *     tags: [Inquiries]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - subject
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               subject:
 *                 type: string
 *               category:
 *                 type: string
 *               message:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Inquiry submitted successfully
 *       400:
 *         description: Validation error
 */
router.post(
  '/',
  inquiryController.upload.single('file'),
  inquiryController.submitInquiry
);

module.exports = router;
