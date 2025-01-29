import React from "react";
import { Card } from "@/components/ui/card";

interface PDFPreviewProps {
  formData: {
    brideNames: string;
    groomNames: string;
    date: string;
    time: string;
    venue: string;
    mapUrl: string;
    theme: string;
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

  return (
    <Card className="p-8 bg-white shadow-lg min-h-[600px] animate-fadeIn">
      <div className="text-center space-y-6">
        <div className="text-wedding-text">
          {formData.personalizeInvitation && formData.inviteeName && (
            <h2 className="text-xl mb-4">{themeMessage} {formData.inviteeName},</h2>
          )}
          
          <h1 className="text-3xl font-semibold mb-2">Wedding Invitation</h1>
          
          <div className="my-8">
            <p className="text-2xl text-wedding-primary">
              {formData.brideNames}
            </p>
            <p className="text-xl">&</p>
            <p className="text-2xl text-wedding-primary">
              {formData.groomNames}
            </p>
          </div>

          {formData.date && formData.time && (
            <div className="my-4">
              <p className="text-lg">
                Join us in celebration on
              </p>
              <p className="text-xl font-semibold">
                {new Date(formData.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-lg">at {formData.time}</p>
            </div>
          )}

          {formData.venue && (
            <div className="my-4">
              <p className="text-lg">Venue:</p>
              <p className="text-xl">{formData.venue}</p>
              {formData.mapUrl && (
                <a
                  href={formData.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 underline text-sm"
                >
                  View on Map
                </a>
              )}
            </div>
          )}

          {formData.personalizeInvitation && formData.personalMessage && (
            <div className="mt-8 text-lg italic">
              "{formData.personalMessage}"
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};