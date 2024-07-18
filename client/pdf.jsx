import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { saveAs } from 'file-saver';

// PDF 파일 경로
const pdfUrl = '/test.pdf';

// PDF 파일 페이지 수를 얻는 함수
async function getPdfNumPages(url) {
  const pdf = await pdfjs.getDocument(url);
  return pdf.numPages;
}

function PdfViewer() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfWidth, setPdfWidth] = useState(window.innerWidth); // 초기값 설정
  const [pdfHeight, setPdfHeight] = useState(window.innerHeight); // 초기값 설정

  useEffect(() => {
    async function fetchNumPages() {
      const pages = await getPdfNumPages(pdfUrl);
      setNumPages(pages);
    }
    fetchNumPages();
  }, []);

  useEffect(() => {
    function resizeHandler() {
      setPdfWidth(window.innerWidth);
      setPdfHeight(window.innerHeight);
    }
    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  // 이전 페이지로 이동하는 함수
  function goToPrevPage() {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
  }

  // 다음 페이지로 이동하는 함수
  function goToNextPage() {
    setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages));
  }

  // PDF 파일 다운로드 함수
  async function handleDownloadPdf() {
    const pdfBlob = await fetch(pdfUrl).then((res) => res.blob());
    saveAs(pdfBlob, 'document.pdf');
  }

  return (
    <div className="pdf-container" style={{ width: pdfWidth, height: pdfHeight }}>
      <div className="pdf-toolbar">
        <button className="pdf-btn" onClick={goToPrevPage} disabled={pageNumber <= 1}>
          이전 페이지
        </button>
        <span className="pdf-page-info">페이지 {pageNumber} / {numPages}</span>
        <button className="pdf-btn" onClick={goToNextPage} disabled={pageNumber >= numPages}>
          다음 페이지
        </button>
        <button className="pdf-btn" onClick={handleDownloadPdf}>
          다운로드
        </button>
      </div>
      <div className="pdf-viewer">
        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading="로딩 중..."
        >
          <Page pageNumber={pageNumber} width={pdfWidth} />
        </Document>
      </div>
    </div>
  );
}

export default PdfViewer;
