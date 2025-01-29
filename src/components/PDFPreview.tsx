import { Card } from "@/components/ui/card";
import React, { forwardRef } from 'react';

interface PDFPreviewProps {
    formData: {
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
        backgroundColor:string;
         textColor:string;
         backgroundTemplate:string;
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

const PDFPreview = forwardRef<HTMLDivElement, PDFPreviewProps>(({ formData }, ref) => {
    const themeMessage = getThemeMessage(formData.theme);
     const getCalendarLink = () => {
        if (!formData.date || !formData.time) return null;

        const dateTime = new Date(`${formData.date}T${formData.time}`);
         const startTime = dateTime.toISOString().replace(/-|:|\.\d\d\d/g, '');
          const endTime = new Date(dateTime.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, ''); // Add 1 hour for end time
        const text = `Wedding of ${formData.brideNames} and ${formData.groomNames}`
         const details = `Join us in celebration of ${formData.brideNames} and ${formData.groomNames} at ${formData.venue}. `;
        return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(text)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(formData.venue)}`
    };


    return (
        <Card className="p-8 shadow-lg min-h-[600px] animate-fadeIn" ref={ref} style={{ backgroundColor: formData.backgroundColor ||'#f8f8f8' }}>
            <div className="text-center space-y-6">
                <div  style={{color: formData.textColor || '#333333' }}>
                    {formData.personalizeInvitation && formData.inviteeName && (
                        <h2 className="text-xl mb-4" style={{color: formData.textColor || '#333333'}}>{themeMessage} {formData.inviteeName},</h2>
                    )}

                    <h1 className="text-3xl font-semibold mb-2" style={{color: formData.textColor || '#333333'}}>Wedding Invitation</h1>

                    <div className="my-8">
                        <p className="text-2xl text-wedding-primary"  style={{color:'#FFC0CB'}}>
                            {formData.brideNames}
                        </p>
                         {formData.brideQualification && <p className="text-sm italic"  style={{color: formData.textColor || '#333333'}}>{formData.brideQualification}</p>}

                        <p className="text-xl" style={{color: formData.textColor || '#333333'}}>&</p>
                        <p className="text-2xl text-wedding-primary"  style={{color:'#FFC0CB'}}>
                            {formData.groomNames}
                        </p>
                        {formData.groomQualification && <p className="text-sm italic" style={{color: formData.textColor || '#333333'}}>{formData.groomQualification}</p>}

                    </div>

                    {formData.date && formData.time && (
                        <div className="my-4">
                            <p className="text-lg" style={{color: formData.textColor || '#333333'}}>
                                Join us in celebration on:
                            </p>
                            {formData.date && (


                                 <p className="text-xl font-semibold" style={{color: formData.textColor || '#333333'}}>
                                    {new Date(formData.date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            )}
                            {formData.time && (
                                 <p className="text-lg" style={{color: formData.textColor || '#333333'}}>
                                    at {new Date(`2024-01-01T${formData.time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                </p>
                            )}
                            <a
                                 href={getCalendarLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700 underline text-sm"
                                style={{color: formData.textColor || '#333333'}}
                            >
                                Add to Calendar
                            </a>
                        </div>
                    )}
                    {formData.venue && (
                        <div className="my-4">
                            <p className="text-lg" style={{color: formData.textColor || '#333333'}}>Venue:</p>
                            <p className="text-xl" style={{color: formData.textColor || '#333333'}}>{formData.venue}</p>
                            {formData.mapUrl && (
                                <a
                                    href={formData.mapUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700 underline text-sm"
                                   style={{color: formData.textColor || '#333333'}}
                                >
                                    View on Map
                                </a>
                            )}
                        </div>
                    )}

                    {formData.personalizeInvitation && formData.personalMessage && (
                        <div className="mt-8 text-lg italic" style={{color: formData.textColor || '#333333'}}>
                            "{formData.personalMessage}"
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
});
export default PDFPreview;