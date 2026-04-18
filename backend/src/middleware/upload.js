import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'studentImage') cb(null, 'uploads/students/');
    else if (file.fieldname === 'fatherDeathCert' || file.fieldname === 'motherDeathCert')
      cb(null, 'uploads/death_certs/');
    // else cb(null, 'uploads/studentImage/');
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + unique + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'studentImage') {
    if (/jpeg|jpg|png|gif/.test(path.extname(file.originalname).toLowerCase()))
      cb(null, true);
    else cb(new Error('Only images allowed for student image'));
  } else if (file.fieldname.includes('DeathCert')) {
    if (path.extname(file.originalname).toLowerCase() === '.pdf')
      cb(null, true);
    else cb(new Error('Only PDF allowed for death certificate'));
  } else cb(null, true);
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });