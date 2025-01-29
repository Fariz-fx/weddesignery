import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { PDFPreview } from "./PDFPreview";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { AddToCalendarButton } from 'add-to-calendar-button-react';
import { pdfThemes } from "@/utils/pdfThemes";

interface FormData {
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
}

export const InvitationForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    brideNames: "",
    groomNames: "",
    date: "",
    time: "",
    venue: "",
    mapUrl: "",
    theme: "family",
    designTheme: "default",
    personalizeInvitation: false,
    inviteeName: "",
    personalMessage: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThemeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, theme: value }));
  };

  const handleDesignThemeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, designTheme: value }));
  };

  const handlePersonalizationToggle = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, personalizeInvitation: checked }));
  };

  const formatTimeWithAMPM = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8 animate-fadeIn">
      <h1 className="text-3xl font-semibold text-wedding-text text-center mb-8">
        Create Your Wedding Invitation
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="brideNames">Bride's Name</Label>
            <Input
              id="brideNames"
              name="brideNames"
              value={formData.brideNames}
              onChange={handleInputChange}
              className="border-wedding-secondary"
            />
          </div>

          <div>
            <Label htmlFor="groomNames">Groom's Name</Label>
            <Input
              id="groomNames"
              name="groomNames"
              value={formData.groomNames}
              onChange={handleInputChange}
              className="border-wedding-secondary"
            />
          </div>

          <div>
            <Label htmlFor="date">Wedding Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              className="border-wedding-secondary"
            />
            {formData.date && (
              <div className="mt-2">
                <AddToCalendarButton
                  name={`Wedding of ${formData.brideNames} & ${formData.groomNames}`}
                  description={`You are cordially invited to the wedding of ${formData.brideNames} & ${formData.groomNames}`}
                  startDate={formData.date}
                  startTime={formData.time}
                  endTime={formData.time}
                  location={formData.venue}
                  options={['Google']}
                  buttonStyle="default"
                  lightMode="light"
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="time">Wedding Time</Label>
            <Input
              id="time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleInputChange}
              className="border-wedding-secondary"
            />
            {formData.time && (
              <p className="text-sm text-gray-600 mt-1">
                {formatTimeWithAMPM(formData.time)}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="venue">Venue</Label>
            <Input
              id="venue"
              name="venue"
              value={formData.venue}
              onChange={handleInputChange}
              className="border-wedding-secondary"
            />
          </div>

          <div>
            <Label htmlFor="mapUrl">Map URL</Label>
            <Input
              id="mapUrl"
              name="mapUrl"
              type="url"
              value={formData.mapUrl}
              onChange={handleInputChange}
              className="border-wedding-secondary"
              placeholder="https://maps.google.com/..."
            />
          </div>

          <div>
            <Label htmlFor="theme">Invitation Theme</Label>
            <Select
              value={formData.theme}
              onValueChange={handleThemeChange}
            >
              <SelectTrigger className="border-wedding-secondary">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="family">Close Family</SelectItem>
                <SelectItem value="friends">Best Friends</SelectItem>
                <SelectItem value="work">Work Colleagues</SelectItem>
                <SelectItem value="neighbors">Neighbors</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="designTheme">Design Theme</Label>
            <Select
              value={formData.designTheme}
              onValueChange={handleDesignThemeChange}
            >
              <SelectTrigger className="border-wedding-secondary">
                <SelectValue placeholder="Select design" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="elegant">Elegant</SelectItem>
                <SelectItem value="romantic">Romantic</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="personalize"
              checked={formData.personalizeInvitation}
              onCheckedChange={handlePersonalizationToggle}
            />
            <Label htmlFor="personalize">Personalize Invitation</Label>
          </div>

          {formData.personalizeInvitation && (
            <>
              <div>
                <Label htmlFor="inviteeName">Invitee's Name</Label>
                <Input
                  id="inviteeName"
                  name="inviteeName"
                  value={formData.inviteeName}
                  onChange={handleInputChange}
                  className="border-wedding-secondary"
                />
              </div>
              <div>
                <Label htmlFor="personalMessage">Personal Message</Label>
                <Input
                  id="personalMessage"
                  name="personalMessage"
                  value={formData.personalMessage}
                  onChange={handleInputChange}
                  className="border-wedding-secondary"
                  placeholder="Add a personal message..."
                />
              </div>
            </>
          )}
        </div>

        <div className="bg-wedding-light p-4 rounded-lg">
          <PDFPreview formData={formData} />
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <PDFDownloadLink
          document={<PDFPreview formData={formData} />}
          fileName={`wedding-invitation-${formData.brideNames}-${formData.groomNames}.pdf`}
        >
          {({ loading }) => (
            <Button
              disabled={loading}
              className="bg-wedding-primary hover:bg-wedding-secondary text-wedding-text px-8 py-2"
            >
              {loading ? "Generating PDF..." : "Download PDF"}
            </Button>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
};