// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "../services/api"; // Adjust the path according to your project structure
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core"; // Import the core viewer
import "@react-pdf-viewer/core/lib/styles/index.css"; // Import core styles
import "../styles/DocumentReader.css";
import { PDFDocument } from "pdf-lib";

// Import the default layout plugin
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

// Custom toolbar buttons with Mongolian text
const customToolbarPlugin = (defaultLayoutPluginInstance) => {
  const renderToolbar = (Toolbar) => (
    <Toolbar>
      {(slots) => {
        const { ToolbarSlot, ToolbarButton } = slots;
        return (
          <ToolbarSlot>
            <ToolbarButton ariaLabel="Нээх" onClick={() => defaultLayoutPluginInstance.open()}>
              Нээх
            </ToolbarButton>
            <ToolbarButton ariaLabel="Татаж авах" onClick={() => defaultLayoutPluginInstance.download()}>
              Татаж авах
            </ToolbarButton>
            <ToolbarButton ariaLabel="Хэвлэх" onClick={() => defaultLayoutPluginInstance.print()}>
              Хэвлэх
            </ToolbarButton>
            <ToolbarButton ariaLabel="Томруулах" onClick={() => defaultLayoutPluginInstance.zoom(SpecialZoomLevel.PageWidth)}>
              Томруулах
            </ToolbarButton>
            <ToolbarButton ariaLabel="Жижигрүүлэх" onClick={() => defaultLayoutPluginInstance.zoom(SpecialZoomLevel.PageHeight)}>
              Жижигрүүлэх
            </ToolbarButton>
            <ToolbarButton ariaLabel="Бүтэн дэлгэц" onClick={() => defaultLayoutPluginInstance.enterFullScreen()}>
              Бүтэн дэлгэц
            </ToolbarButton>
          </ToolbarSlot>
        );
      }}
    </Toolbar>
  );

  return { renderToolbar };
};

const DocumentReader = () => {
  const { id } = useParams(); // Get document ID from the URL
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState(null); // To track any errors
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageRange = queryParams.get("pageRange");

  console.log(pageRange);

  // Create a default layout plugin instance
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  // Initialize the custom toolbar plugin with the instance
  const customToolbarInstance = customToolbarPlugin(defaultLayoutPluginInstance);

  useEffect(() => {
    const fetchDocumentFile = async () => {
      try {
        const response = await axios.get(`/api/documents/download/${id}`, {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const file = new Blob([response.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        setFileData(fileURL); // Store the file URL in state
      } catch (err) {
        console.error("Error fetching PDF file:", err);
        setError("PDF баримтыг ачааллахад алдаа гарлаа.");
      }
    };

    fetchDocumentFile();
  }, [id]);

  useEffect(() => {
    let isMounted = true;

    const renderPdfPages = async () => {
      if (!fileData) return;

      try {
        const existingPdfBytes = await fetch(fileData).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        const [startPage, endPage] = pageRange
          ? pageRange.split("-").map(Number)
          : [1, pdfDoc.getPageCount()];

        const newPdfDoc = await PDFDocument.create();
        for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
          const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNum - 1]);
          newPdfDoc.addPage(copiedPage);
        }

        const newPdfBytes = await newPdfDoc.save();
        const newFileURL = URL.createObjectURL(new Blob([newPdfBytes], { type: "application/pdf" }));

        if (isMounted) {
          setFileData(newFileURL);
        }
      } catch (error) {
        console.error("Error rendering PDF pages:", error);
        // setError("PDF хуудсыг дүрслэхэд алдаа гарлаа.");
      }
    };

    renderPdfPages();

    return () => {
      isMounted = false;
    };
  }, [fileData, pageRange]);

  return (
    <div style={{ height: "750px" }}>
      {error && <p>{error}</p>}
      {fileData ? (
        <Worker
          workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
        >
          <Viewer
            fileUrl={fileData}
            plugins={[defaultLayoutPluginInstance]}
            // renderPage={renderPage}
            renderToolbar={customToolbarInstance.renderToolbar}
          />
        </Worker>
      ) : (
        <p>PDF ачааллаж байна...</p>
      )}
    </div>
  );
};

export default DocumentReader;
