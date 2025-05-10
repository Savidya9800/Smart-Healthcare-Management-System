import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Tooltip,
  Fade,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  InsertDriveFile as FileIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { deleteMedicalReport } from "../../../services/reportService";
import Swal from "sweetalert2";

function ReportItem({ report, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [hover, setHover] = useState(false);
  const open = Boolean(anchorEl);
  
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleMenuClose();
    Swal.fire({
      title: "Delete Report?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e03131",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteMedicalReport(report._id);
          onDelete(report._id);
          Swal.fire("Deleted!", "Your report has been deleted.", "success");
        } catch (err) {
          console.error("Delete error:", err);
          Swal.fire("Error", "Failed to delete report.", "error");
        }
      }
    });
  };

  const fileName = report.fileName?.split("-").slice(1).join("-") || "report";
  const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";
  
  // Determine file type icon
  const getFileIcon = () => {
    if (fileExtension === "pdf") {
      return <PdfIcon sx={{ color: "#e03131" }} />;
    } else if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
      return <ImageIcon sx={{ color: "#2fb297" }} />;
    } else {
      return <FileIcon sx={{ color: "#2b2c6c" }} />;
    }
  };
  
  // Format uploaded date
  const formattedDate = new Date(report.uploadedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
  
  // Format file size if available
  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <Paper
      elevation={hover ? 2 : 1}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{
        p: 2,
        mb: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 2,
        transition: "all 0.3s ease",
        border: hover ? "1px solid #2fb297" : "1px solid #eaeaea",
        backgroundColor: hover ? "rgba(47, 178, 151, 0.03)" : "#ffffff",
        overflow: "hidden",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
        <Box 
          sx={{ 
            mr: 2, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            width: 40, 
            height: 40, 
            borderRadius: 1, 
            backgroundColor: "rgba(43, 44, 108, 0.05)" 
          }}
        >
          {getFileIcon()}
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Typography fontWeight="medium" noWrap sx={{ maxWidth: "90%" }}>
            {fileName}
          </Typography>
          
          <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              {formattedDate}
            </Typography>
            
            <Fade in={hover}>
              <Chip
                size="small"
                label={fileExtension.toUpperCase()}
                sx={{
                  ml: 1,
                  fontSize: '0.65rem',
                  height: 20,
                  backgroundColor: fileExtension === "pdf" ? "rgba(224, 49, 49, 0.1)" : 
                                   ["jpg", "jpeg", "png", "gif"].includes(fileExtension) ? "rgba(47, 178, 151, 0.1)" : 
                                   "rgba(43, 44, 108, 0.1)",
                  color: fileExtension === "pdf" ? "#e03131" : 
                         ["jpg", "jpeg", "png", "gif"].includes(fileExtension) ? "#2fb297" : 
                         "#2b2c6c"
                }}
              />
            </Fade>
            
            {report.fileSize && (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                {formatFileSize(report.fileSize)}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
      
      <Box>
        <Fade in={hover}>
          <Box sx={{ display: "flex" }}>
            <Tooltip title="Download">
              <IconButton
                href={`http://localhost:5000/${report.filePath}`}
                target="_blank"
                download
                size="small"
                sx={{ 
                  color: "#2fb297",
                  "&:hover": {
                    backgroundColor: "rgba(47, 178, 151, 0.1)",
                  }
                }}
              >
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Fade>
        
        <IconButton 
          onClick={handleMenuClick}
          size="small"
          sx={{ 
            color: hover ? "#2b2c6c" : "#71717a", 
            "&:hover": { backgroundColor: "rgba(43, 44, 108, 0.1)" }
          }}
        >
          <MoreIcon fontSize="small" />
        </IconButton>
        
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 3,
            sx: { borderRadius: 2, minWidth: 175 }
          }}
        >
          <MenuItem 
            component="a" 
            href={`http://localhost:5000/${report.filePath}`}
            target="_blank"
            download
          >
            <ListItemIcon>
              <DownloadIcon fontSize="small" sx={{ color: "#2fb297" }} />
            </ListItemIcon>
            <ListItemText>Download</ListItemText>
          </MenuItem>
          
          <MenuItem 
            component="a" 
            href={`http://localhost:5000/${report.filePath}`}
            target="_blank"
          >
            <ListItemIcon>
              <ViewIcon fontSize="small" sx={{ color: "#2b2c6c" }} />
            </ListItemIcon>
            <ListItemText>View</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={handleDelete}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" sx={{ color: "#e03131" }} />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </Paper>
  );
}

export default ReportItem;