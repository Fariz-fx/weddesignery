import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import Papa from 'papaparse';
import JSZip from 'jszip';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import PDFPreview from './PDFPreview'; // Assuming PDFPreview can be reused
import { Link } from 'react-router-dom'; // Assuming react-router-dom is used for navigation

// Define the expected structure of a row in the CSV
interface CsvRowData {
    brideNames: string;
    groomNames: string;
    brideNameTamil?: string; // Optional fields based on requirements
    groomNameTamil?: string;
    date: string;
    time: string;
    brideQualification?: string;
    groomQualification?: string;
    venue: string;
    venueAddress?: string;
    mapUrl?: string;
    theme?: string; // Default or specific theme per invitee?
    inviteeName: string;
    personalMessage?: string;
    // Add other fields corresponding to InvitationForm state if needed
    // Ensure these match the sample CSV headers
}

// Define the props for PDFPreview based on CsvRowData
// Maps CSV row data to PDFPreview props with proper customization
const mapCsvRowToPreviewProps = (rowData: CsvRowData, defaultSettings: {
    theme: string;
    backgroundColor: string;
    textColor: string;
    backgroundTemplate: string;
    brideNameColor: string;
    groomNameColor: string;
}) => {
    // Determine if we should use the theme from CSV or default
    const theme = rowData.theme || defaultSettings.theme;
    
    // Create the props object with all necessary fields
    return {
        // Basic wedding information
        brideNames: rowData.brideNames || '',
        groomNames: rowData.groomNames || '',
        brideNameTamil: rowData.brideNameTamil || '',
        groomNameTamil: rowData.groomNameTamil || '',
        date: rowData.date || '',
        time: rowData.time || '',
        brideQualification: rowData.brideQualification || '',
        groomQualification: rowData.groomQualification || '',
        venue: rowData.venue || '',
        venueAddress: rowData.venueAddress || '',
        mapUrl: rowData.mapUrl || '',
        
        // Theme and personalization
        theme: theme, // Use theme from CSV or default
        personalizeInvitation: !!rowData.inviteeName, // Personalize if invitee name exists
        inviteeName: rowData.inviteeName || '',
        personalMessage: rowData.personalMessage || '',
        
        // Customization settings - always enabled for bulk invitations
        useCustomization: true, 
        
        // Visual customization properties - apply settings from the form UI
        backgroundColor: defaultSettings.backgroundColor,
        textColor: defaultSettings.textColor,
        backgroundTemplate: defaultSettings.backgroundTemplate, // Use the selected background template
        brideNameColor: defaultSettings.brideNameColor,
        groomNameColor: defaultSettings.groomNameColor,
        
        // Language settings
        useSecondaryLanguage: !!(rowData.brideNameTamil || rowData.groomNameTamil),
        language: 'tamil', // Default language for secondary text
        
        // Religious settings - defaults
        religion: '', 
        showReligiousText: false
    };
};

const BulkInvitation: React.FC = () => {
    const { toast } = useToast();
    const [csvData, setCsvData] = useState<CsvRowData[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [fileName, setFileName] = useState<string>('');
    const previewRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Default settings for customization
    const [defaultSettings, setDefaultSettings] = useState({
        theme: 'family',
        backgroundColor: '#ffffff',
        textColor: '#333333',
        backgroundTemplate: 'white',
        brideNameColor: '#FFC0CB',
        groomNameColor: '#FFC0CB'
    });

    const sampleCsvHeaders = [
        'brideNames', 'groomNames', 'brideNameTamil', 'groomNameTamil', 'date', 'time',
        'brideQualification', 'groomQualification', 'venue', 'venueAddress', 'mapUrl',
        'theme', 'inviteeName', 'personalMessage'
        // Add other headers corresponding to CsvRowData
    ];
    const sampleCsvContent = `${sampleCsvHeaders.join(',')}\n"Jane Doe","John Smith","ஜேன் டோ","ஜான் ஸ்மித்","2024-12-25","18:00","MBA","PhD","Grand Hall","123 Main St, Anytown","https://maps.google.com","family","Mr. & Mrs. Guest","Join us for our special day!"`;

    const handleDownloadSample = () => {
        const blob = new Blob([sampleCsvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'sample_invitation_data.csv');
        toast({ title: 'Sample CSV downloaded.' });
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            Papa.parse<CsvRowData>(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    // Basic validation: Check if essential headers exist
                    const requiredHeaders = ['brideNames', 'groomNames', 'date', 'time', 'venue', 'inviteeName'];
                    const actualHeaders = results.meta.fields || [];
                    const missingHeaders = requiredHeaders.filter(h => !actualHeaders.includes(h));

                    if (missingHeaders.length > 0) {
                        toast({
                            title: 'Invalid CSV Header',
                            description: `Missing required columns: ${missingHeaders.join(', ')}. Please use the sample file format.`,
                            variant: 'destructive',
                        });
                        setCsvData([]); // Clear data if headers are wrong
                        setFileName('');
                        if(fileInputRef.current) fileInputRef.current.value = ''; // Reset file input
                        return;
                    }

                    // Filter out rows that might be completely empty or lack essential data
                    const validData = results.data.filter(row => 
                        row.brideNames && row.groomNames && row.date && row.time && row.venue && row.inviteeName
                    );

                    if (validData.length === 0 && results.data.length > 0) {
                         toast({
                            title: 'No Valid Data Found',
                            description: 'The CSV file does not contain any rows with the minimum required data (bride/groom names, date, time, venue, invitee name).',
                            variant: 'warning',
                        });
                    } else if (validData.length < results.data.length) {
                         toast({
                            title: 'Some Rows Skipped',
                            description: `${results.data.length - validData.length} rows were skipped due to missing essential data.`,
                            variant: 'warning',
                        });
                    }

                    setCsvData(validData);
                    toast({ title: 'CSV file parsed successfully.', description: `${validData.length} invitations will be generated.` });
                },
                error: (error) => {
                    toast({
                        title: 'Error parsing CSV',
                        description: error.message,
                        variant: 'destructive',
                    });
                    setCsvData([]);
                    setFileName('');
                     if(fileInputRef.current) fileInputRef.current.value = ''; // Reset file input
                },
            });
        } else {
            setFileName('');
            setCsvData([]);
        }
    };

    const generateImagesAndZip = useCallback(async () => {
        if (csvData.length === 0) {
            toast({ title: 'No data', description: 'Please upload a valid CSV file first.', variant: 'warning' });
            return;
        }

        setIsProcessing(true);
        toast({ title: 'Processing...', description: 'Generating invitation images. This may take a moment.' });

        const zip = new JSZip();

        try {
            // First, ensure all preview elements are properly rendered with the correct props
            // This step is crucial for applying theme, colors, and background template
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for initial rendering

            for (let i = 0; i < csvData.length; i++) {
                const row = csvData[i];
                // Apply theme from CSV if available, otherwise use default settings
                const rowTheme = row.theme || defaultSettings.theme;
                
                // Create preview props with proper customization settings
                const previewProps = mapCsvRowToPreviewProps(row, {
                    ...defaultSettings,
                    theme: rowTheme // Ensure theme from CSV is used if available
                });
                
                const previewElement = previewRefs.current[`preview-${i}`];

                if (previewElement) {
                    // Ensure content is fully rendered before capturing
                    // Increased wait time for better rendering of complex elements
                    await new Promise(resolve => setTimeout(resolve, 800)); 

                    // Log for debugging
                    console.log(`Generating invitation ${i+1} with theme: ${previewProps.theme}, background: ${previewProps.backgroundTemplate}, brideColor: ${previewProps.brideNameColor}, groomColor: ${previewProps.groomNameColor}`);
                    
                    // Force style refresh on the preview element to ensure background and colors are applied
                    if (previewElement) {
                        const cardElement = previewElement.querySelector('.card');
                        if (cardElement && cardElement instanceof HTMLElement) {
                            // Explicitly set background template and colors
                            cardElement.style.backgroundColor = previewProps.backgroundColor;
                            
                            // Force a reflow to ensure styles are applied before capture
                            void previewElement.offsetHeight;
                        }
                    }
                    
                    try {
                        const canvas = await html2canvas(previewElement, {
                            scale: window.devicePixelRatio * 2, // Dynamic scale based on device for better quality
                            useCORS: true,
                            allowTaint: true,
                            letterRendering: true, // Improve text rendering
                            backgroundColor: previewProps.backgroundColor, // Use background color from props
                            logging: false, // Disable logging for better performance
                            onclone: (clonedDoc) => {
                                // Ensure fonts are properly loaded
                                Array.from(clonedDoc.getElementsByTagName('*')).forEach(el => {
                                    if (el instanceof HTMLElement) {
                                        el.style.fontDisplay = 'swap';
                                    }
                                });
                            }
                        });
                        
                        const imageDataUrl = canvas.toDataURL('image/png', 1.0);
                        const blob = await fetch(imageDataUrl).then(res => res.blob());
                        // Sanitize invitee name for filename
                        const safeInviteeName = (row.inviteeName || `invitation_${i + 1}`).replace(/[^a-z0-9]/gi, '_').toLowerCase();
                        zip.file(`invitation_${safeInviteeName}.png`, blob);
                        
                        // Update progress notification
                        if (i % 5 === 0 || i === csvData.length - 1) {
                            toast({ 
                                title: 'Progress', 
                                description: `Generated ${i+1} of ${csvData.length} invitations`, 
                                variant: 'default' 
                            });
                        }
                    } catch (error) {
                        console.error(`Error generating image for row ${i}:`, error);
                        toast({ 
                            title: 'Error', 
                            description: `Failed to generate image for ${row.inviteeName || `guest ${i+1}`}`, 
                            variant: 'destructive' 
                        });
                    }
                } else {
                     console.warn(`Preview element for row ${i} not found.`);
                     toast({ title: 'Warning', description: `Could not generate image for row ${i+1} (Invitee: ${row.inviteeName || 'N/A'}).`, variant: 'warning' });
                }

            if (Object.keys(zip.files).length === 0) {
                 toast({ title: 'Error', description: 'No images were generated. Please check the console for warnings.', variant: 'destructive' });
                 setIsProcessing(false);
                 return;
            }

            const zipBlob = await zip.generateAsync({ type: 'blob' });
            saveAs(zipBlob, 'wedding_invitations.zip');
            toast({ title: 'Success!', description: 'Invitations generated and zipped.' });

        } catch (error) {
            console.error('Error generating images or zip:', error);
            toast({ title: 'Error', description: `Failed to generate invitations: ${error instanceof Error ? error.message : 'Unknown error'}`, variant: 'destructive' });
        } finally {
            setIsProcessing(false);
        }
    }, [csvData, toast]);

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Bulk Invitation Generator</CardTitle>
                    <CardDescription>Upload a CSV file with guest details to generate personalized invitation images.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label>Step 1: Download Sample & Prepare Data</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                            Download the sample CSV file, fill in your guest details, and save it.
                            Ensure all required columns are present.
                        </p>
                        <Button onClick={handleDownloadSample} variant="outline">Download Sample CSV</Button>
                    </div>

                    <div>
                        <Label htmlFor="csv-upload">Step 2: Upload Your CSV File</Label>
                        <Input
                            id="csv-upload"
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            className="mt-1"
                        />
                        {fileName && <p className="text-sm text-muted-foreground mt-1">Selected file: {fileName}</p>}
                    </div>

                    {csvData.length > 0 && (
                        <div>
                            <Label>Step 3: Generate Invitations</Label>
                            <p className="text-sm text-muted-foreground mb-2">
                                Click the button below to generate a PNG image for each valid row in your CSV.
                                The images will be packaged into a downloadable ZIP file.
                            </p>
                            <Button onClick={generateImagesAndZip} disabled={isProcessing}>
                                {isProcessing ? 'Processing...' : `Generate ${csvData.length} Invitations`}
                            </Button>
                        </div>
                    )}
                </CardContent>
                 <CardFooter className="flex justify-between">
                     <Link to="/">
                        <Button variant="outline">Back to Main Invitation</Button>
                    </Link>
                </CardFooter>
            </Card>

            {/* Settings Card */}
            <Card className="max-w-2xl mx-auto mt-6">
                <CardHeader>
                    <CardTitle>Invitation Appearance Settings</CardTitle>
                    <CardDescription>Customize how your invitations will look</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="theme">Theme</Label>
                        <select 
                            id="theme"
                            className="w-full p-2 border rounded mt-1"
                            value={defaultSettings.theme}
                            onChange={(e) => setDefaultSettings(prev => ({ ...prev, theme: e.target.value }))}
                        >
                            <option value="family">Family</option>
                            <option value="friends">Friends</option>
                            <option value="formal">Formal</option>
                            <option value="casual">Casual</option>
                        </select>
                    </div>
                    
                    <div>
                        <Label htmlFor="backgroundTemplate">Background Template</Label>
                        <select
                            id="backgroundTemplate"
                            className="w-full p-2 border rounded mt-1"
                            value={defaultSettings.backgroundTemplate}
                            onChange={(e) => setDefaultSettings(prev => ({ ...prev, backgroundTemplate: e.target.value }))}
                        >
                            <option value="white">White</option>
                            <option value="floral">Floral</option>
                            <option value="elegant">Elegant</option>
                            <option value="modern">Modern</option>
                        </select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="brideNameColor">Bride Name Color</Label>
                            <Input
                                id="brideNameColor"
                                type="color"
                                value={defaultSettings.brideNameColor}
                                onChange={(e) => setDefaultSettings(prev => ({ ...prev, brideNameColor: e.target.value }))}
                                className="w-full h-10 mt-1"
                            />
                        </div>
                        
                        <div>
                            <Label htmlFor="groomNameColor">Groom Name Color</Label>
                            <Input
                                id="groomNameColor"
                                type="color"
                                value={defaultSettings.groomNameColor}
                                onChange={(e) => setDefaultSettings(prev => ({ ...prev, groomNameColor: e.target.value }))}
                                className="w-full h-10 mt-1"
                            />
                        </div>
                        
                        <div>
                            <Label htmlFor="textColor">Text Color</Label>
                            <Input
                                id="textColor"
                                type="color"
                                value={defaultSettings.textColor}
                                onChange={(e) => setDefaultSettings(prev => ({ ...prev, textColor: e.target.value }))}
                                className="w-full h-10 mt-1"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <Label htmlFor="backgroundColor">Background Color</Label>
                        <Input
                            id="backgroundColor"
                            type="color"
                            value={defaultSettings.backgroundColor}
                            onChange={(e) => setDefaultSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                            className="w-full h-10 mt-1"
                        />
                    </div>
                </CardContent>
            </Card>
            
            {/* Hidden preview area for rendering invitations before canvas capture */} 
            {/* We render all previews simultaneously to capture them */} 
            {isProcessing && csvData.length > 0 && (
                <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '800px', height: 'auto', overflow: 'hidden' }}> 
                    {csvData.map((row, index) => {
                        // Apply theme from CSV if available, otherwise use default settings
                        const rowTheme = row.theme || defaultSettings.theme;
                        
                        // Create preview props with proper customization settings
                        const previewProps = mapCsvRowToPreviewProps(row, {
                            ...defaultSettings,
                            theme: rowTheme // Ensure theme from CSV is used if available
                        });
                        
                        return (
                            <div 
                                key={`preview-container-${index}`} 
                                style={{ 
                                    marginBottom: '20px', 
                                    border: '1px solid #ccc',
                                    backgroundColor: previewProps.backgroundColor
                                }}
                            >
                                <PDFPreview
                                    ref={el => previewRefs.current[`preview-${index}`] = el}
                                    formData={previewProps} 
                                />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default BulkInvitation;