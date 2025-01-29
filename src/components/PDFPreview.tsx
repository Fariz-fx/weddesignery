import React from "react";
import { Document, Page, Text, View, StyleSheet, Link, PDFViewer } from "@react-pdf/renderer";
import { pdfThemes } from "@/utils/pdfThemes";

interface PDFPreviewProps {
  formData: {
    brideNames: string;
    groomNames: string;
    date: string;
    time: string;
    venue: string;
    mapUrl: string;
    theme: string;
    designTheme: string;
    personalizeInvitation: boolean;
    inviteeName: string;
    personalMessage: string;
  };
}

const getThemeMessage = (theme: string) => {
  switch (theme) {
    case "family":
      return "With joy in our hearts, we invite our beloved family member";
    case "friends":
      return "To our dearest friend";
    case "work":
      return "We cordially invite our esteemed colleague";
    case "neighbors":
      return "To our wonderful neighbor";
    default:
      return "We joyfully invite";
  }
};

export const PDFPreview: React.FC<PDFPreviewProps> = ({ formData }) => {
  const themeMessage = getThemeMessage(formData.theme);
  const designTheme = pdfThemes[formData.designTheme as keyof typeof pdfThemes] || pdfThemes.default;

  const styles = StyleSheet.create({
    page: {
      padding: 40,
      backgroundColor: '#ffffff',
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      color: designTheme.primaryColor,
      fontFamily: designTheme.fontFamily,
    },
    names: {
      fontSize: 20,
      marginVertical: 10,
      color: designTheme.secondaryColor,
      fontFamily: designTheme.fontFamily,
    },
    details: {
      fontSize: 14,
      marginVertical: 5,
      color: designTheme.primaryColor,
      textAlign: 'center',
    },
    link: {
      color: 'blue',
      textDecoration: 'underline',
    },
    message: {
      fontSize: 12,
      marginTop: 20,
      fontStyle: 'italic',
      color: designTheme.accentColor,
    },
  });

  const formatTimeWithAMPM = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  return (
    <PDFViewer style={{ width: '100%', height: '600px' }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.container}>
            {formData.personalizeInvitation && formData.inviteeName && (
              <Text style={styles.details}>
                {themeMessage} {formData.inviteeName},
              </Text>
            )}
            
            <Text style={styles.title}>Wedding Invitation</Text>
            
            <Text style={styles.names}>{formData.brideNames}</Text>
            <Text style={styles.details}>&</Text>
            <Text style={styles.names}>{formData.groomNames}</Text>

            {formData.date && formData.time && (
              <View>
                <Text style={styles.details}>
                  Join us in celebration on
                </Text>
                <Text style={styles.details}>
                  {new Date(formData.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
                <Text style={styles.details}>
                  at {formatTimeWithAMPM(formData.time)}
                </Text>
              </View>
            )}

            {formData.venue && (
              <View>
                <Text style={styles.details}>Venue:</Text>
                <Text style={styles.details}>{formData.venue}</Text>
                {formData.mapUrl && (
                  <Link src={formData.mapUrl} style={styles.link}>
                    View on Map
                  </Link>
                )}
              </View>
            )}

            {formData.personalizeInvitation && formData.personalMessage && (
              <Text style={styles.message}>
                "{formData.personalMessage}"
              </Text>
            )}
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};