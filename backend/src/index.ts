import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import multer from 'multer';
import { body, validationResult } from 'express-validator';
import path from 'path';
import fs from 'fs';

dotenv.config();
const prisma = new PrismaClient();

export const app = express();
export default prisma;

const port = 3010;

// Set up uploads directory
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer config for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and DOCX files are allowed'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter
});

app.get('/', (req, res) => {
  res.send('Hola LTI!');
});

// POST /api/candidates
app.post(
  '/api/candidates',
  upload.single('resume'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('surname').notEmpty().withMessage('Surname is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('jobTitle').notEmpty().withMessage('Job Title is required'),
    body('phone').notEmpty().withMessage('Phone is required').matches(/^[\d\-\+\s\(\)]+$/).withMessage('Valid phone is required'),
    body('educationLevel').isIn(['HIGH_SCHOOL', 'BACHELORS', 'MASTERS', 'PHD', 'OTHER']).withMessage('Valid education level is required'),
    body('salaryExpectations').isDecimal().withMessage('Salary Expectations must be a number'),
    body('age').optional().isInt({ min: 0 }).withMessage('Age must be a positive integer'),
    body('address').optional().isString(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) fs.unlinkSync(req.file.path); // Clean up uploaded file
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const {
        name, surname, email, jobTitle, address, age, phone, educationLevel, salaryExpectations
      } = req.body;
      const candidate = await prisma.candidate.create({
        data: {
          name,
          surname,
          email,
          jobTitle,
          address,
          age: age ? parseInt(age) : undefined,
          phone,
          educationLevel,
          salaryExpectations: salaryExpectations ? parseFloat(salaryExpectations) : undefined,
          resumeUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
        }
      });
      res.status(201).json({ message: 'Candidate created successfully', candidate });
    } catch (err: any) {
      console.error(err);
      if (req.file) fs.unlinkSync(req.file.path); // Clean up uploaded file
      res.status(500).json({ error: 'Failed to create candidate', details: err.message });
    }
  }
);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.type('text/plain'); 
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
