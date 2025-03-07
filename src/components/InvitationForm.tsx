import React, { useState, useRef } from "react";
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
import { saveAs } from 'file-saver';
import  html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';
import PDFPreview from "./PDFPreview";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";
import { ColorPicker } from "@/components/ui/color-picker";
import { backgroundTemplates } from "@/lib/background-templates";
interface FormData {
    brideNames: string;
    groomNames: string;
    date: string;
    time: string;
    brideQualification: string;
    groomQualification: string;
    venue: string;
    mapUrl: string;
    theme: string;
    personalizeInvitation: boolean;
    inviteeName: string;
    personalMessage: string;
    useCustomization: boolean;
    backgroundColor: string;
    textColor:string;
    backgroundTemplate:string;
    brideNameColor:string,
    groomNameColor:string
}

export const InvitationForm = () => {
    const { toast } = useToast();
    const [formData, setFormData] = useState<FormData>({
        brideNames: "",
        groomNames: "",
        date: "",
        time: "",
        brideQualification: "",
        groomQualification: "",
        venue: "",
        mapUrl: "",
         theme: "family",
        personalizeInvitation: false,
        inviteeName: "",
        personalMessage: "",
        useCustomization: false,
        backgroundColor: "#ffffff",
        textColor: "#333333",
        backgroundTemplate: "white",
        brideNameColor: "#FFC0CB",
         groomNameColor: "#FFC0CB",

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
    const handleBackgroundChange = (value: string) => {
        setFormData((prev) => ({ ...prev, backgroundTemplate: value }));
    };

    const handlePersonalizationToggle = (checked: boolean) => {
        setFormData((prev) => ({ ...prev, personalizeInvitation: checked }));
    };
    const handleCustomizationToggle = (checked: boolean) => {
        setFormData((prev) => ({ ...prev, useCustomization: checked }));
    };
      const handleTextColorChange = (color: string) => {
        setFormData((prev) => ({ ...prev, textColor: color }));
    };
    const handleBackgroundColorChange = (color: string) => {
        setFormData((prev) => ({ ...prev, backgroundColor: color }));
    };
    const handleBrideNameColorChange = (color: string) => {
        setFormData((prev) => ({ ...prev, brideNameColor: color }));
    };
    const handleGroomNameColorChange = (color: string) => {
         setFormData((prev) => ({ ...prev, groomNameColor: color }));
    };


    const pdfPreviewRef = useRef<HTMLDivElement>(null);

    const handleGeneratePDF = async () => {
        if (!pdfPreviewRef.current) {
            toast({
                title: "Error!",
                description: "Could not locate the invitation preview.",
                variant: "destructive",
            });
            return;
        }
        try {
            const element = pdfPreviewRef.current;

            const opt = {
                margin: 10,
                filename: 'invitation.pdf',
                image: { type: 'jpeg', quality: 1.0 },  // Maximum quality
                html2canvas: {
                    scale: window.devicePixelRatio * 2,  // Dynamic scale based on device
                    useCORS: true,
                    allowTaint: true,
                    letterRendering: true,
                    backgroundColor: formData.backgroundColor
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait',
                    compress: false,
                    precision: 16
                }
            };
             
            html2pdf().from(element).set(opt).save();

            toast({
                title: "Success",
                description: "Your invitation PDF has been generated.",
            });

        } catch (error) {
            console.error('Failed to generate PDF:', error);
            toast({ 
                title: "Failed", 
                description: `Failed to generate the PDF: ${error.message}`,
                variant: "destructive" 
            });
        }
    };

     const handleGenerateImage = async () => {
        if (!pdfPreviewRef.current) {
            toast({
                title: "Error!",
                description: "Could not locate the invitation preview.",
                variant: "destructive",
            });
            return;
        }
        try {
            const canvas = await html2canvas(pdfPreviewRef.current, {
                scale: window.devicePixelRatio * 2,
                backgroundColor: formData.backgroundColor,
                useCORS: true,
                allowTaint: true,
                letterRendering: true,
                onclone: (clonedDoc) => {
                    Array.from(clonedDoc.getElementsByTagName('*')).forEach(el => {
                        if (el instanceof HTMLElement) {
                            el.style.fontDisplay = 'swap';
                        }
                    });
                }
            });
            
            const dataUrl = canvas.toDataURL('image/png', 1.0);  // Use maximum quality
            saveAs(dataUrl, "invitation.png");

            toast({
                title: "Success",
                description: "Your invitation image has been generated.",
            });

        } catch (error) {
            console.error('Failed to generate image:', error);
            toast({ 
                title: "Failed", 
                description: `Failed to generate the image: ${error.message}`,
                variant: "destructive" 
            });
        }
    };

    return (
        <TooltipProvider>
        <div className="w-full max-w-4xl mx-auto p-6 space-y-8 animate-fadeIn">
            <h1 className="text-3xl font-semibold text-wedding-text text-center mb-8">
                Create Your Wedding Invitation
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                            id="useCustomization"
                            checked={formData.useCustomization}
                            onCheckedChange={handleCustomizationToggle}
                        />
                            <Tooltip>
                                <TooltipTrigger asChild>
                                   <Label htmlFor="useCustomization">Use Customization</Label>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Choose more customization if required
                                </TooltipContent>
                            </Tooltip>

                      </div>
                     { formData.useCustomization && (
                        <>
                          <div>
                                <Label htmlFor="backgroundTemplate">Background Template</Label>
                                  <Select
                                        value={formData.backgroundTemplate}
                                        onValueChange={handleBackgroundChange}
                                    >
                                        <SelectTrigger className="border-wedding-secondary">
                                          <SelectValue placeholder="Select background" />
                                         </SelectTrigger>
                                         <SelectContent>
                                            {backgroundTemplates.map((template)=> (
                                                 <SelectItem key={template.value} value={template.value}>{template.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                  </Select>
                           </div>
                            <div>
                                 <Label htmlFor="textColor">Text Color</Label>
                                <ColorPicker
                                        id="textColor"
                                         value={formData.textColor}
                                         onValueChange={handleTextColorChange}
                                      />
                            </div>
                              <div>
                                 <Label htmlFor="brideNameColor">Bride Name Color</Label>
                                <ColorPicker
                                        id="brideNameColor"
                                         value={formData.brideNameColor}
                                         onValueChange={handleBrideNameColorChange}
                                      />
                            </div>
                             <div>
                                 <Label htmlFor="groomNameColor">Groom Name Color</Label>
                                <ColorPicker
                                        id="groomNameColor"
                                         value={formData.groomNameColor}
                                         onValueChange={handleGroomNameColorChange}
                                      />
                            </div>
                               <div>
                                <Label htmlFor="backgroundColor">Background Color</Label>
                                 <ColorPicker
                                         id="backgroundColor"
                                         value={formData.backgroundColor}
                                          onValueChange={handleBackgroundColorChange}
                                     />
                             </div>
                        </>
                     )}


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
                        <Label htmlFor="brideQualification">Bride's Qualification</Label>
                        <Input
                            id="brideQualification"
                            name="brideQualification"
                            value={formData.brideQualification}
                            onChange={handleInputChange}
                            className="border-wedding-secondary"
                            placeholder="e.g., Software Engineer"
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
                    </div>

                    <div>
                        <Label htmlFor="groomQualification">Groom's Qualification</Label>
                        <Input
                            id="groomQualification"
                            name="groomQualification"
                            value={formData.groomQualification}
                            onChange={handleInputChange}
                            className="border-wedding-secondary"
                            placeholder="e.g., Doctor"
                        />
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
                                 <SelectItem value="elegant">Elegant</SelectItem>
                                <SelectItem value="modern">Modern</SelectItem>
                                <SelectItem value="rustic">Rustic</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="personalize"
                            checked={formData.personalizeInvitation}
                            onCheckedChange={handlePersonalizationToggle}
                        />
                           <Tooltip>
                                <TooltipTrigger asChild>
                                      <Label htmlFor="personalize">Personalize Invitation</Label>
                                </TooltipTrigger>
                                <TooltipContent>
                                   Add invitee's name and personal message.
                                </TooltipContent>
                            </Tooltip>

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
                    <PDFPreview formData={formData} ref={pdfPreviewRef} />
                </div>
            </div>

             <div className="flex justify-center pt-6 gap-4">
                 <Button
                    onClick={handleGeneratePDF}
                    className="bg-wedding-primary hover:bg-wedding-secondary text-wedding-text px-8 py-2"
                 >
                  Generate PDF
                </Button>
                 {/* Optional image generation button */}
                <Button
                    onClick={handleGenerateImage}
                     className="bg-wedding-primary hover:bg-wedding-secondary text-wedding-text px-8 py-2"
                 >
                  Generate Image
                </Button>
            </div>
        </div>
        </TooltipProvider>
    );
};