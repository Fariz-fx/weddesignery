import { Card } from "@/components/ui/card";
import React, { forwardRef } from 'react';
import { backgroundTemplates } from "@/lib/background-templates";
import { getTranslation, translateUserInput } from "@/lib/translations";

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
         brideNameColor:string,
          groomNameColor:string,
        useSecondaryLanguage: boolean,
        language: string
    };
}

const getThemeMessage = (theme: string, language: string = 'english') => {
    switch (theme) {
        case "family":
            return getTranslation("familyTheme", language);
        case "friends":
            return getTranslation("friendsTheme", language);
         case "work":
            return getTranslation("workTheme", language);
         case "neighbors":
            return getTranslation("neighborsTheme", language);
        default:
            return getTranslation("defaultTheme", language);
    }
};

const PDFPreview = forwardRef<HTMLDivElement, PDFPreviewProps>(({ formData }, ref) => {
    const themeMessage = getThemeMessage(formData.theme, 'english');
    const themeMessageTamil = formData.useSecondaryLanguage ? getThemeMessage(formData.theme, formData.language) : '';
    
    const getCalendarLink = () => {
        if (!formData.date || !formData.time) return null;

        const dateTime = new Date(`${formData.date}T${formData.time}`);
        const startTime = dateTime.toISOString().replace(/-|:|\.\d\d\d/g, '');
        const endTime = new Date(dateTime.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, ''); // Add 1 hour for end time
        const text = `Wedding of ${formData.brideNames} and ${formData.groomNames}`
        const details = `Join us in celebration of ${formData.brideNames} and ${formData.groomNames} at ${formData.venue}. `;
        return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(text)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(formData.venue)}`
    };
    
    // Helper function to format date in Tamil
    const formatDateInTamil = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        // This is a simplified approach - in a production app, you might want to use a proper Tamil date formatter
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    
    // Helper function to format time in Tamil
    const formatTimeInTamil = (timeStr: string) => {
        if (!timeStr) return '';
        return new Date(`2024-01-01T${timeStr}`).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
        });
    };

   const selectedTemplate = backgroundTemplates.find(template => template.value === formData.backgroundTemplate);
   const backgroundImageStyle = selectedTemplate?.image ? { backgroundImage: `url(${selectedTemplate.image})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat' ,
       } : {};
    return (
        <div className="animate-fadeIn">
          <Card className="p-8 shadow-lg min-h-[600px]" ref={ref} style={{ backgroundColor: formData.backgroundColor ||'#f8f8f8',  ...backgroundImageStyle }}>
            <div className="text-center space-y-6">
                <div style={{color: formData.textColor || '#333333' }}>
                    {/* English Content Section */}
                    <div className="mb-8">
                        {formData.personalizeInvitation && formData.inviteeName && (
                            <h2 className="text-xl mb-4" style={{color: formData.textColor || '#333333'}}>
                                {themeMessage} {formData.inviteeName},
                            </h2>
                        )}

                        <h1 className="text-3xl font-semibold mb-2" style={{color: formData.textColor || '#333333'}}>
                            {getTranslation("weddingInvitation", 'english')}
                        </h1>

                        <div className="my-8">
                            <p className="text-2xl" style={{color: formData.brideNameColor || '#FFC0CB'}}>
                                {formData.brideNames}
                            </p>
                            {formData.brideQualification && <p className="text-sm italic" style={{color: formData.textColor || '#333333'}}>{formData.brideQualification}</p>}

                            <p className="text-xl" style={{color: formData.textColor || '#333333'}}>&</p>
                            <p className="text-2xl" style={{color: formData.groomNameColor || '#FFC0CB'}}>
                                {formData.groomNames}
                            </p>
                            {formData.groomQualification && <p className="text-sm italic" style={{color: formData.textColor || '#333333'}}>{formData.groomQualification}</p>}
                        </div>

                        {formData.date && formData.time && (
                            <div className="my-4">
                                <p className="text-lg" style={{color: formData.textColor || '#333333'}}>
                                    {getTranslation("joinCelebration", 'english')}
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
                                    {getTranslation("addToCalendar", 'english')}
                                </a>
                            </div>
                        )}
                        {formData.venue && (
                            <div className="my-4">
                                <p className="text-lg" style={{color: formData.textColor || '#333333'}}>
                                    {getTranslation("venue", 'english')}
                                </p>
                                <p className="text-xl" style={{color: formData.textColor || '#333333'}}>{formData.venue}</p>
                                {formData.mapUrl && (
                                    <a
                                        href={formData.mapUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:text-blue-700 underline text-sm"
                                        style={{color: formData.textColor || '#333333'}}
                                    >
                                        {getTranslation("viewOnMap", 'english')}
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
                    
                    {/* Tamil Content Section - Only shown when secondary language is enabled */}
                    {formData.useSecondaryLanguage && (
                        <div className="mt-10 pt-10 border-t border-gray-300">
                            {formData.personalizeInvitation && formData.inviteeName && (
                                <h2 className="text-xl mb-4" style={{color: formData.textColor || '#333333'}}>
                                    {themeMessageTamil} {formData.inviteeName},
                                </h2>
                            )}

                            <h1 className="text-3xl font-semibold mb-2" style={{color: formData.textColor || '#333333'}}>
                                {getTranslation("weddingInvitation", formData.language)}
                            </h1>

                            <div className="my-8">
                                <p className="text-2xl" style={{color: formData.brideNameColor || '#FFC0CB'}}>
                                    {formData.brideNames}
                                </p>
                                {formData.brideQualification && <p className="text-sm italic" style={{color: formData.textColor || '#333333'}}>{translateUserInput(formData.brideQualification, formData.language)}</p>}

                                <p className="text-xl" style={{color: formData.textColor || '#333333'}}>&</p>
                                <p className="text-2xl" style={{color: formData.groomNameColor || '#FFC0CB'}}>
                                    {formData.groomNames}
                                </p>
                                {formData.groomQualification && <p className="text-sm italic" style={{color: formData.textColor || '#333333'}}>{translateUserInput(formData.groomQualification, formData.language)}</p>}
                            </div>

                            {formData.date && formData.time && (
                                <div className="my-4">
                                    <p className="text-lg" style={{color: formData.textColor || '#333333'}}>
                                        {getTranslation("joinCelebration", formData.language)}
                                    </p>
                                    {formData.date && (
                                        <p className="text-xl font-semibold" style={{color: formData.textColor || '#333333'}}>
                                            {formatDateInTamil(formData.date)}
                                        </p>
                                    )}
                                    {formData.time && (
                                        <p className="text-lg" style={{color: formData.textColor || '#333333'}}>
                                            {formatTimeInTamil(formData.time)}
                                        </p>
                                    )}
                                    <a
                                        href={getCalendarLink()}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:text-blue-700 underline text-sm"
                                        style={{color: formData.textColor || '#333333'}}
                                    >
                                        {getTranslation("addToCalendar", formData.language)}
                                    </a>
                                </div>
                            )}
                            {formData.venue && (
                                <div className="my-4">
                                    <p className="text-lg" style={{color: formData.textColor || '#333333'}}>
                                        {getTranslation("venue", formData.language)}
                                    </p>
                                    <p className="text-xl" style={{color: formData.textColor || '#333333'}}>{translateUserInput(formData.venue, formData.language)}</p>
                                    {formData.mapUrl && (
                                        <a
                                            href={formData.mapUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:text-blue-700 underline text-sm"
                                            style={{color: formData.textColor || '#333333'}}
                                        >
                                            {getTranslation("viewOnMap", formData.language)}
                                        </a>
                                    )}
                                </div>
                            )}

                            {formData.personalizeInvitation && formData.personalMessage && (
                                <div className="mt-8 text-lg italic" style={{color: formData.textColor || '#333333'}}>
                                    "{translateUserInput(formData.personalMessage, formData.language)}"
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
          </Card>
        </div>
    );
});
export default PDFPreview;