import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import PDFPreview from "@/components/PDFPreview"; // Corrected import
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const BulkInvitation = () => {
    const { toast } = useToast();
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentRecord, setCurrentRecord] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [activeTab, setActiveTab] = useState("download");
    const pdfPreviewRef = useRef<HTMLDivElement>(null);

    // Sample CSV template data
    const csvTemplate = `brideNames,groomNames,brideNameTamil,groomNameTamil,date,time,brideQualification,groomQualification,venue,venueAddress,mapUrl,inviteeName,personalMessage,language\nJane Doe,John Smith,ஜேன் டோ,ஜான் ஸ்மித்,2024-12-31,14:00,MBA,PhD,Grand Hotel,123 Wedding Lane,https://maps.google.com,Guest Name,We would be honored by your presence,tamil`;

    const handleDownloadTemplate = () => {
        const blob = new Blob([csvTemplate], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, "wedding_invitation_template.csv");
        toast({
            title: "Template Downloaded",
            description: "Fill in the CSV with your guests' information and upload it back.",
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCsvFile(e.target.files[0]);
            setActiveTab("upload");
        }
    };

    const processCSV = async () => {
        if (!csvFile) {
            toast({
                title: "No File Selected",
                description: "Please select a CSV file to upload.",
                variant: "destructive",
            });
            return;
        }

        setIsProcessing(true);
        setProgress(0);
        
        const zip = new JSZip();
        
        Papa.parse(csvFile, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const data = results.data as Record<string, string>[];
                setTotalRecords(data.length);
                
                for (let i = 0; i < data.length; i++) {
                    setCurrentRecord(i + 1);
                    const row = data[i];
                    
                    // Create form data for each row
                    const formData = {
                        brideNames: row.brideNames || "",
                        groomNames: row.groomNames || "",
                        brideNameTamil: row.brideNameTamil || "",
                        groomNameTamil: row.groomNameTamil || "",
                        date: row.date || "",
                        time: row.time || "",
                        brideQualification: row.brideQualification || "",
                        groomQualification: row.groomQualification || "",
                        venue: row.venue || "",
                        venueAddress: row.venueAddress || "",
                        mapUrl: row.mapUrl || "",
                        theme: "family",
                        personalizeInvitation: !!row.inviteeName,
                        inviteeName: row.inviteeName || "",
                        personalMessage: row.personalMessage || "",
                        useCustomization: false,
                        backgroundColor: "#ffffff",
                        textColor: "#333333",
                        backgroundTemplate: "white",
                        brideNameColor: "#FFC0CB",
                        groomNameColor: "#FFC0CB",
                        useSecondaryLanguage: !!row.brideNameTamil || !!row.groomNameTamil,
                        language: row.language || "tamil",
                        religion: "",
                        showReligiousText: false
                    };
                    
                    // Render the invitation
                    if (pdfPreviewRef.current) {
                        // Update the preview with current data
                        // This is a hack - in a real app we'd use a more elegant approach
                        // but for this demo we'll just update the ref's props
                        const previewComponent = <PDFPreview formData={formData} ref={pdfPreviewRef} />;
                        
                        // Wait a bit for the DOM to update
                        await new Promise(resolve => setTimeout(resolve, 100));
                        
                        try {
                            // Generate image
                            const canvas = await html2canvas(pdfPreviewRef.current, {
                                scale: window.devicePixelRatio * 2,
                                backgroundColor: formData.backgroundColor,
                                useCORS: true,
                                allowTaint: true,
                                letterRendering: true,
                            });
                            
                            const imgData = canvas.toDataURL('image/png');
                            const imgBlob = await (await fetch(imgData)).blob();
                            
                            // Add to zip file
                            const fileName = `invitation_${row.inviteeName || `guest_${i+1}`}.png`;
                            zip.file(fileName, imgBlob);
                            
                            // Update progress
                            setProgress(Math.round(((i + 1) / data.length) * 100));
                        } catch (error) {
                            console.error('Failed to generate image:', error);
                        }
                    }
                }
                
                // Generate and download the zip file
                const zipBlob = await zip.generateAsync({ type: 'blob' });
                saveAs(zipBlob, 'wedding_invitations.zip');
                
                setIsProcessing(false);
                toast({
                    title: "Success",
                    description: `Generated ${data.length} invitation images and packaged them into a zip file.`,
                });
            },
            error: (error) => {
                console.error('Error parsing CSV:', error);
                setIsProcessing(false);
                toast({
                    title: "Error",
                    description: `Failed to parse CSV file: ${error.message}`,
                    variant: "destructive",
                });
            }
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-wedding-light to-white py-8">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Bulk Wedding Invitations</h1>
                    <Link to="/">
                        <Button variant="outline">Back to Single Invitation</Button>
                    </Link>
                </div>
                
                <Card className="p-6 shadow-lg">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="download">Download Template</TabsTrigger>
                            <TabsTrigger value="upload">Upload & Generate</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="download" className="space-y-4 py-4">
                            <div className="text-center space-y-6">
                                <h2 className="text-2xl font-semibold">Step 1: Download CSV Template</h2>
                                <p className="text-gray-600">
                                    Download our CSV template and fill it with your guests' information.
                                    Each row will generate a personalized invitation image.
                                </p>
                                <div className="bg-gray-100 p-4 rounded-md">
                                    <h3 className="font-medium mb-2">CSV Template Format:</h3>
                                    <p className="text-sm text-gray-700 mb-2">The CSV file should contain the following columns:</p>
                                    <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                                        <li>brideNames - Bride's name in English</li>
                                        <li>groomNames - Groom's name in English</li>
                                        <li>brideNameTamil - Bride's name in Tamil (optional)</li>
                                        <li>groomNameTamil - Groom's name in Tamil (optional)</li>
                                        <li>date - Wedding date (YYYY-MM-DD format)</li>
                                        <li>time - Wedding time (HH:MM format)</li>
                                        <li>brideQualification - Bride's qualification (optional)</li>
                                        <li>groomQualification - Groom's qualification (optional)</li>
                                        <li>venue - Wedding venue name</li>
                                        <li>venueAddress - Venue address</li>
                                        <li>mapUrl - Google Maps URL (optional)</li>
                                        <li>inviteeName - Name of the guest (optional)</li>
                                        <li>personalMessage - Custom message for the guest (optional)</li>
                                        <li>language - Secondary language (default: tamil)</li>
                                    </ul>
                                </div>
                                <Button onClick={handleDownloadTemplate} className="mt-4">
                                    Download CSV Template
                                </Button>
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="upload" className="space-y-4 py-4">
                            <div className="text-center space-y-6">
                                <h2 className="text-2xl font-semibold">Step 2: Upload Filled CSV & Generate Invitations</h2>
                                <p className="text-gray-600">
                                    Upload your filled CSV file to generate personalized invitation images for each guest.
                                    The images will be packaged into a zip file for easy download.
                                </p>
                                
                                {isProcessing ? (
                                    <div className="space-y-4">
                                        <p>Processing {currentRecord} of {totalRecords} invitations...</p>
                                        <Progress value={progress} className="w-full" />
                                        <p className="text-sm text-gray-500">Please wait while we generate your invitations. This may take a few minutes.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-center w-full">
                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                                    </svg>
                                                    <p className="mb-2 text-sm text-gray-500">
                                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                                    </p>
                                                    <p className="text-xs text-gray-500">CSV file only</p>
                                                </div>
                                                <input 
                                                    id="dropzone-file" 
                                                    type="file" 
                                                    className="hidden" 
                                                    accept=".csv" 
                                                    onChange={handleFileChange}
                                                />
                                            </label>
                                        </div>
                                        
                                        {csvFile && (
                                            <div className="text-left p-4 bg-gray-50 rounded-md">
                                                <p className="font-medium">Selected file:</p>
                                                <p className="text-sm text-gray-600">{csvFile.name}</p>
                                            </div>
                                        )}
                                        
                                        <Button 
                                            onClick={processCSV} 
                                            disabled={!csvFile}
                                            className="mt-4"
                                        >
                                            Generate Invitations
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </Card>
                
                {/* Hidden PDF Preview component for generating images */}
                <div className="hidden">
                    <PDFPreview 
                        formData={{
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
                        }} 
                        ref={pdfPreviewRef} 
                    />
                </div>
            </div>
        </div>
    );
};

export default BulkInvitation;