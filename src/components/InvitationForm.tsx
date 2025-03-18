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
import TamilKeyboard from "./TamilKeyboard";
interface FormData {
    brideNames: string;
    groomNames: string;
    brideNameTamil: string;
    groomNameTamil: string;
    date: string;
    time: string;
    brideQualification: string;
    groomQualification: string;
    venue: string;
    venueAddress: string;
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
    groomNameColor:string,
    useSecondaryLanguage: boolean,
    language: string,
    religion: string,
    showReligiousText: boolean
}

import { getTranslation, religiousTranslations } from "@/lib/translations";

export const InvitationForm = () => {
    const { toast } = useToast();
    const [formData, setFormData] = useState<FormData>({
        brideNames: "",
        groomNames: "",
        brideNameTamil: "",
        groomNameTamil: "",
        date: "",
        time: "",
        brideQualification: "",
        groomQualification: "",
        venue: "",
        venueAddress: "",
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
        useSecondaryLanguage: false,
        language: "tamil",
        religion: "",
        showReligiousText: false
    });
    
    // State for Tamil keyboard
    const [isBrideKeyboardOpen, setIsBrideKeyboardOpen] = useState(false);
    const [isGroomKeyboardOpen, setIsGroomKeyboardOpen] = useState(false);

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

    const handleLanguageToggle = (checked: boolean) => {
        setFormData((prev) => ({ ...prev, useSecondaryLanguage: checked }));
    };

    const handleLanguageChange = (value: string) => {
        setFormData((prev) => ({ ...prev, language: value }));
    };

    const pdfPreviewRef = useRef<HTMLDivElement>(null);

    const handleGeneratePDF = async () => {
        if (!pdfPreviewRef.current) {
            toast({
                title: getTranslation("error", formData.language),
                description: getTranslation("previewNotFound", formData.language),
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
                description: `Failed to generate the PDF: ${error instanceof Error ? error.message : 'Unknown error'}`,
                variant: "destructive" 
            });
        }
    };

     const handleGenerateImage = async () => {
        if (!pdfPreviewRef.current) {
            toast({
                title: getTranslation("error", formData.language),
                description: getTranslation("previewNotFound", formData.language),
                variant: "destructive",
            });
            return;
        }
        try {
            // Store the original useSecondaryLanguage value
            const originalUseSecondaryLanguage = formData.useSecondaryLanguage;
            
            // Generate English version first
            if (originalUseSecondaryLanguage) {
                // Temporarily disable secondary language to generate English-only version
                setFormData(prev => ({ 
                    ...prev, 
                    useSecondaryLanguage: false 
                }));
                
                // Wait a bit for the UI to update
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            // Generate English version
            const englishCanvas = await html2canvas(pdfPreviewRef.current, {
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
            
            const englishDataUrl = englishCanvas.toDataURL('image/png', 1.0);
            saveAs(englishDataUrl, "invitation_english.png");
            
            // If secondary language is enabled, generate Tamil version
            if (originalUseSecondaryLanguage) {
                // Create a special Tamil-only mode for the image generation
                setFormData(prev => ({ 
                    ...prev, 
                    useSecondaryLanguage: true,
                    tamilOnlyMode: true, // Add a special flag for Tamil-only rendering
                    // Make sure to preserve the Tamil name fields
                    brideNameTamil: prev.brideNameTamil,
                    groomNameTamil: prev.groomNameTamil
                }));
                
                // Wait a bit for the UI to update
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Generate Tamil version
                const tamilCanvas = await html2canvas(pdfPreviewRef.current, {
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
                
                const tamilDataUrl = tamilCanvas.toDataURL('image/png', 1.0);
                saveAs(tamilDataUrl, "invitation_tamil.png");
                
                // Restore original state without the special flag
                setFormData(prev => ({ 
                    ...prev, 
                    useSecondaryLanguage: originalUseSecondaryLanguage,
                    tamilOnlyMode: false
                }));
            }

            toast({
                title: "Success",
                description: originalUseSecondaryLanguage ? 
                    "Your invitation images have been generated in both English and Tamil." : 
                    "Your invitation image has been generated.",
            });

        } catch (error) {
            console.error('Failed to generate image:', error);
            toast({ 
                title: "Failed", 
                description: `Failed to generate the image: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
                            id="useSecondaryLanguage"
                            checked={formData.useSecondaryLanguage}
                            onCheckedChange={handleLanguageToggle}
                        />
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Label htmlFor="useSecondaryLanguage">{getTranslation("enableDualLanguage", formData.language)}</Label>
                            </TooltipTrigger>
                            <TooltipContent>
                                {getTranslation("enableDualLanguageTooltip", formData.language)}
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    
                    {formData.useSecondaryLanguage && (
                        <>
                            <div>
                                <Label htmlFor="language">{getTranslation("selectLanguage", formData.language)}</Label>
                                <Select
                                    value={formData.language}
                                    onValueChange={handleLanguageChange}
                                >
                                    <SelectTrigger className="border-wedding-secondary">
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tamil">Tamil</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div>
                                <Label htmlFor="brideNameTamil">Bride's Name (Tamil)</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="brideNameTamil"
                                        name="brideNameTamil"
                                        value={formData.brideNameTamil}
                                        onChange={handleInputChange}
                                        className="border-wedding-secondary flex-1"
                                    />
                                    <TamilKeyboard 
                                        isOpen={isBrideKeyboardOpen}
                                        onOpenChange={setIsBrideKeyboardOpen}
                                        onCharacterSelect={(char) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                brideNameTamil: prev.brideNameTamil + char
                                            }));
                                        }}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <Label htmlFor="groomNameTamil">Groom's Name (Tamil)</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="groomNameTamil"
                                        name="groomNameTamil"
                                        value={formData.groomNameTamil}
                                        onChange={handleInputChange}
                                        className="border-wedding-secondary flex-1"
                                    />
                                    <TamilKeyboard 
                                        isOpen={isGroomKeyboardOpen}
                                        onOpenChange={setIsGroomKeyboardOpen}
                                        onCharacterSelect={(char) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                groomNameTamil: prev.groomNameTamil + char
                                            }));
                                        }}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    
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
                        <Label htmlFor="venue">Venue Name</Label>
                        <Input
                            id="venue"
                            name="venue"
                            value={formData.venue}
                            onChange={handleInputChange}
                            className="border-wedding-secondary"
                        />
                    </div>
                    <div>
                        <Label htmlFor="venueAddress">Venue Address</Label>
                        <Input
                            id="venueAddress"
                            name="venueAddress"
                            value={formData.venueAddress}
                            onChange={handleInputChange}
                            className="border-wedding-secondary"
                        />
                    </div>
                    <div>
                        <Label htmlFor="mapUrl">Google Maps URL (optional)</Label>
                        <Input
                            id="mapUrl"
                            name="mapUrl"
                            type="url"
                            value={formData.mapUrl}
                            onChange={(e) => {
                                // Validate URL format before setting state
                                const url = e.target.value;
                                const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;
                                const mapsPattern = /^https?:\/\/(www\.)?google\.com\/maps\/.*$/;
                                if (url === '' || urlPattern.test(url) || mapsPattern.test(url)) {
                                    handleInputChange(e);
                                } else {
                                    // If invalid URL, show toast or handle accordingly
                                    toast({
                                        title: "Invalid URL",
                                        description: "Please enter a valid URL starting with http:// or https://",
                                        variant: "destructive"
                                    });
                                }
                            }}
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
                    
                    {formData.theme === "family" && (
                        <>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="showReligiousText"
                                    checked={formData.showReligiousText}
                                    onCheckedChange={(checked) => {
                                        // If turning off religious text, no changes needed
                                        // If turning on, ensure a religion is selected
                                        if (checked && !formData.religion) {
                                            // Default to first religion if none selected
                                            setFormData((prev) => ({ 
                                                ...prev, 
                                                showReligiousText: checked,
                                                religion: "islam" // Default selection
                                            }));
                                        } else {
                                            setFormData((prev) => ({ ...prev, showReligiousText: checked }));
                                        }
                                    }}
                                />
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Label htmlFor="showReligiousText">Include Religious Text</Label>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Add religious text to your invitation
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            
                            {formData.showReligiousText && (
                                <div>
                                    <Label htmlFor="religion">Religion</Label>
                                    <Select
                                        value={formData.religion}
                                        onValueChange={(value) => {
                                            setFormData((prev) => ({ ...prev, religion: value }));
                                        }}
                                    >
                                        <SelectTrigger className="border-wedding-secondary">
                                            <SelectValue placeholder="Select religion" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.keys(religiousTranslations).map((religion) => (
                                                <SelectItem key={religion} value={religion}>
                                                    {religion.charAt(0).toUpperCase() + religion.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </>
                    )}

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