import React from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { UploadFile, InsertDriveFile } from "@mui/icons-material";

interface CompanyDocumentCardProps {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
}

export default function CompanyDocumentCard({ label, file, onChange }: CompanyDocumentCardProps) {
  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: 3,
        boxShadow: "0 3px 10px rgba(0,0,0,0.06)",
        transition: "0.2s",
        "&:hover": { boxShadow: "0 6px 16px rgba(0,0,0,0.1)" },
      }}
    >
      <CardContent sx={{ textAlign: "center", py: 2 }}>
        <Box
          sx={{
            fontSize: 55,
            color: file ? "success.main" : "text.disabled",
            mb: 1,
          }}
        >
          {file ? (
            <InsertDriveFile color="success" sx={{ fontSize: 55 }} />
          ) : (
            <UploadFile sx={{ fontSize: 55 }} />
          )}
        </Box>

        <Typography fontWeight={500} variant="subtitle1" sx={{ mb: 1 }}>
          {label}
        </Typography>

        <Typography
          variant="body2"
          color={file ? "text.secondary" : "text.disabled"}
          sx={{ minHeight: 20 }}
        >
          {file ? file.name : "فایلی انتخاب نشده"}
        </Typography>

        <Button
          variant={file ? "outlined" : "contained"}
          component="label"
          sx={{ mt: 2, borderRadius: 2, height: "34px", width: "102px" }}
        >
          {file ? "تغییر فایل" : "انتخاب فایل"}
          <input
            hidden
            type="file"
            onChange={(e) => onChange(e.target.files?.[0] ?? null)}
          />
        </Button>
      </CardContent>
    </Card>
  );
}
