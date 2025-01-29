export interface PDFTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  backgroundPattern?: string;
}

export const pdfThemes = {
  default: {
    primaryColor: "#FFC0CB",
    secondaryColor: "#9DB5B2",
    accentColor: "#FFD700",
    fontFamily: "Times-Roman",
  },
  elegant: {
    primaryColor: "#4A4A4A",
    secondaryColor: "#8E8E8E",
    accentColor: "#D4AF37",
    fontFamily: "Helvetica",
  },
  romantic: {
    primaryColor: "#FF69B4",
    secondaryColor: "#FFA07A",
    accentColor: "#FFB6C1",
    fontFamily: "Times-Roman",
  },
  modern: {
    primaryColor: "#2C3E50",
    secondaryColor: "#34495E",
    accentColor: "#3498DB",
    fontFamily: "Helvetica-Bold",
  }
};