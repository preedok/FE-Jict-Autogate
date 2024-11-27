
const translations = {
  ocr_inprogress: 'OCR in Progress',
  ocr_inprogess: 'OCR in Progress',
  ocr_completed: 'OCR Capture Completed',
};

export const translateStatus = (status) => {
  return translations[status] || status.toUpperCase();
};
