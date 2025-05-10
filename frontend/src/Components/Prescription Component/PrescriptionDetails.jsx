import React, { useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Button,
} from "@mui/material";
import {
  MedicationOutlined,
  EventNote,
  Person,
  Assignment,
  LocalHospital,
  GetApp as DownloadIcon,
} from "@mui/icons-material";

function PrescriptionDetails({ prescription }) {
  const prescriptionRef = useRef(null);

  // Format date for display
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Generate and download PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    // Set document properties
    doc.setProperties({
      title: `Prescription-${prescription._id.substring(0, 8)}`,
      subject: "Medical Prescription",
      author: "MediFlow Healthcare System",
      keywords: "prescription, medical, healthcare",
      creator: "MediFlow",
    });

    // Add watermark - FIXED VERSION WITHOUT TRANSLATE/ROTATE
    const addWatermark = (doc) => {
      const totalPages = doc.internal.getNumberOfPages();

      // Watermark text
      doc.setFontSize(60);
      doc.setTextColor(230, 230, 230); // Light gray
      doc.setFont("helvetica", "bold");

      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);

        // Position watermark in center of page
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Set transparency
        doc.setGState(new doc.GState({ opacity: 0.2 }));

        // Add watermark with angle parameter
        doc.text("MEDIFLOW", pageWidth / 2, pageHeight / 2, {
          align: "center",
          angle: -45,
        });
      }
    };

    // --- HEADER SECTION ---

    // Create top border
    doc.setDrawColor(43, 44, 108); // #2b2c6c
    doc.setFillColor(43, 44, 108);
    doc.rect(0, 0, doc.internal.pageSize.width, 2, "F");

    // Add colored accent on left side
    doc.setFillColor(47, 178, 151); // #2fb297
    doc.rect(0, 2, 8, 40, "F");

    // Add header text directly without logo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(43, 44, 108); // #2b2c6c
    doc.text("MEDIFLOW", 15, 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text("HEALTHCARE MANAGEMENT SYSTEM", 15, 26);

    // Add contact information
    doc.setFontSize(8);
    doc.text("123 Medical Center Drive, Healthcare City", 15, 32);
    doc.text("Phone: (123) 456-7890 | Email: care@mediflow.com", 15, 36);
    doc.text("www.mediflow.com", 15, 40);

    // Add prescription title and box
    doc.setFillColor(47, 178, 151, 0.1); // Light green background
    doc.setDrawColor(47, 178, 151); // Green border
    doc.roundedRect(140, 10, 60, 30, 3, 3, "FD"); // Filled rectangle with rounded corners

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(43, 44, 108); // #2b2c6c
    doc.text("PRESCRIPTION", 170, 20, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`ID: ${prescription._id.substring(0, 8)}`, 170, 28, {
      align: "center",
    });

    doc.setFontSize(8);
    doc.text(`Issued: ${formatDate(prescription.dateIssued)}`, 170, 35, {
      align: "center",
    });

    // Add a divider below the header
    doc.setDrawColor(230, 230, 230); // Light gray
    doc.line(10, 50, 200, 50);

    // --- PATIENT AND DOCTOR INFO SECTION ---

    // Patient Information Section
    doc.setFillColor(240, 240, 250);
    doc.setDrawColor(220, 220, 240);
    doc.roundedRect(10, 60, 90, 40, 2, 2, "FD");

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(43, 44, 108); // #2b2c6c
    doc.text("PATIENT INFORMATION", 15, 70);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text(
      `Name: ${prescription.patientId?.name || prescription.patientId}`,
      15,
      78
    );
    doc.text(
      `ID: ${prescription.patientId?.id || prescription.patientId}`,
      15,
      86
    );
    doc.text(`Appointment: ${prescription.appointmentId || "N/A"}`, 15, 94);

    // Doctor Information Section
    doc.setFillColor(240, 250, 245);
    doc.setDrawColor(220, 240, 230);
    doc.roundedRect(105, 60, 90, 40, 2, 2, "FD");

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(43, 44, 108); // #2b2c6c
    doc.text("PRESCRIBER", 110, 70);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text(
      `Dr. ${prescription.doctorId?.name || prescription.doctorId}`,
      110,
      78
    );
    if (prescription.doctorId?.specialization) {
      doc.text(
        `Specialization: ${prescription.doctorId.specialization}`,
        110,
        86
      );
    }
    doc.text(
      `Medical License: ${
        prescription.doctorId?.license || "Licensed Practitioner"
      }`,
      110,
      94
    );

    // --- MEDICATION SECTION ---

    // Medications header
    doc.setFillColor(43, 44, 108); // #2b2c6c
    doc.rect(10, 110, 190, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text("PRESCRIBED MEDICATIONS", 15, 116);

    // Create medication table with better styling
    const medicineData = prescription.medicine.map((med) => [
      med.medicineName,
      med.dosage,
      med.description,
    ]);

    autoTable(doc, {
      startY: 120,
      head: [["Medication", "Dosage", "Instructions"]],
      body: medicineData,
      theme: "grid",
      headStyles: {
        fillColor: [230, 49, 125],
        textColor: 255,
        fontStyle: "bold",
        lineWidth: 0.1,
        lineColor: [210, 30, 105],
        halign: "left",
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 40 },
        2: { cellWidth: 80 },
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
    });

    // --- NOTES SECTION ---

    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFillColor(250, 250, 250);
    doc.setDrawColor(230, 230, 230);
    doc.roundedRect(10, finalY, 190, 40, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(43, 44, 108); // #2b2c6c
    doc.text("DOCTOR'S NOTES", 15, finalY + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    const splitNotes = doc.splitTextToSize(
      prescription.notes || "No additional notes provided.",
      180
    );
    doc.text(splitNotes, 15, finalY + 15);

    // --- VOIDED INFO (if applicable) ---

    if (prescription.isVoided) {
      const voidY = finalY + 50;

      // Red "VOIDED" watermark - FIXED VERSION
      doc.setFont("helvetica", "bold");
      doc.setTextColor(220, 50, 50);
      doc.setFontSize(40);
      doc.setGState(new doc.GState({ opacity: 0.6 }));

      // Use text with angle parameter instead of translate/rotate
      doc.text("VOIDED", 105, 150, {
        align: "center",
        angle: -30,
      });

      // Void reason box
      doc.setFillColor(255, 240, 240);
      doc.setDrawColor(255, 200, 200);
      doc.roundedRect(10, voidY, 190, 20, 2, 2, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(180, 30, 30);
      doc.text("VOID REASON:", 15, voidY + 8);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(prescription.voidReason || "No reason provided", 15, voidY + 16);
    }

    // --- FOOTER SECTION ---

    // Create bottom border
    doc.setDrawColor(43, 44, 108); // #2b2c6c
    doc.setFillColor(43, 44, 108);
    doc.rect(
      0,
      doc.internal.pageSize.height - 20,
      doc.internal.pageSize.width,
      2,
      "F"
    );

    // Footer text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      // Left side - security notice
      doc.text(
        "This document contains confidential medical information",
        10,
        doc.internal.pageSize.height - 12
      );

      // Center - website
      doc.text(
        "www.mediflow.com",
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.height - 12,
        {
          align: "center",
        }
      );

      // Right - page number and generation date
      doc.text(
        `Generated: ${new Date().toLocaleDateString()} | Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() - 10,
        doc.internal.pageSize.height - 12,
        { align: "right" }
      );

      // Add color accent at bottom
      doc.setFillColor(47, 178, 151); // #2fb297
      doc.rect(
        0,
        doc.internal.pageSize.height - 5,
        doc.internal.pageSize.width,
        5,
        "F"
      );
    }

    // Add the watermark after all pages are created
    addWatermark(doc);

    // Save the PDF
    doc.save(`Prescription-${prescription._id.substring(0, 8)}.pdf`);
  };

  // Rest of your component remains unchanged
  if (!prescription) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography>Loading prescription details...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }} ref={prescriptionRef}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "#2b2c6c", fontWeight: "bold", mb: 0 }}
        >
          Prescription Details
        </Typography>

        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={generatePDF}
          sx={{
            bgcolor: "#2b2c6c",
            "&:hover": { bgcolor: "#1e1f4b" },
          }}
        >
          Download PDF
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Status and basic info */}
        <Grid item xs={12}>
          <Paper elevation={1} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Assignment sx={{ color: "#2b2c6c", mr: 1 }} />
                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                  Prescription #{prescription._id.substring(0, 8)}
                </Typography>
              </Box>
              <Chip
                label={prescription.isVoided ? "Voided" : "Active"}
                color={prescription.isVoided ? "error" : "success"}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <EventNote sx={{ color: "#e6317d", mr: 1 }} />
                  <Typography variant="body2" color="textSecondary">
                    Date Issued:
                  </Typography>
                  <Typography variant="body1" sx={{ ml: 1 }}>
                    {formatDate(prescription.dateIssued)}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Person sx={{ color: "#2fb297", mr: 1 }} />
                  <Typography variant="body2" color="textSecondary">
                    Patient ID:
                  </Typography>
                  <Typography variant="body1" sx={{ ml: 1 }}>
                    {prescription.patientId}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <LocalHospital sx={{ color: "#2b2c6c", mr: 1 }} />
                  <Typography variant="body2" color="textSecondary">
                    Doctor:
                  </Typography>
                  <Box sx={{ ml: 1 }}>
                    <Typography variant="body1" fontWeight="medium">
                      {prescription.doctorId?.name || prescription.doctorId}
                    </Typography>
                    {prescription.doctorId?.specialization && (
                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                      >
                        {prescription.doctorId.specialization}
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Assignment sx={{ color: "#e6317d", mr: 1 }} />
                  <Typography variant="body2" color="textSecondary">
                    Appointment ID:
                  </Typography>
                  <Typography variant="body1" sx={{ ml: 1 }}>
                    {prescription.appointmentId}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Medicines */}
        <Grid item xs={12}>
          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <MedicationOutlined sx={{ color: "#2b2c6c", mr: 1 }} />
              <Typography variant="h6" sx={{ color: "#2b2c6c" }}>
                Prescribed Medicines
              </Typography>
            </Box>

            <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>
                      Medicine Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>
                      Dosage
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>
                      Description
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {prescription.medicine.map((med, index) => (
                    <TableRow key={index}>
                      <TableCell>{med.medicineName}</TableCell>
                      <TableCell>{med.dosage}</TableCell>
                      <TableCell>{med.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Notes */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "medium", mb: 1 }}
              >
                Doctor's Notes:
              </Typography>
              <Paper
                variant="outlined"
                sx={{ p: 2, bgcolor: "#f9f9f9", minHeight: 80 }}
              >
                <Typography variant="body1">
                  {prescription.notes || "No additional notes provided."}
                </Typography>
              </Paper>
            </Box>

            {/* Voided information if applicable */}
            {prescription.isVoided && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: "#fff4f4",
                  borderRadius: 1,
                  border: "1px solid #ffcdd2",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#d32f2f", fontWeight: "medium" }}
                >
                  This prescription has been voided
                </Typography>
                <Typography variant="body2">
                  Reason: {prescription.voidReason}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PrescriptionDetails;
