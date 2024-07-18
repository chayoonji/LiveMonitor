import { pdfjs } from 'react-pdf';
import pdfWorker from '../client/pdf.worker.js';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;
