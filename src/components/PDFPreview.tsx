import { Card } from "@/components/ui/card";
import React, { forwardRef } from 'react';
import { backgroundTemplates } from "@/lib/background-templates";
import { getTranslation, translateUserInput, religiousTranslations } from "@/lib/translations";

// Helper function to transliterate names to Tamil
const transliterateName = (name: string, language: string = 'english'): string => {
    if (language === 'english' || !name) return name;
    
    // For names, we'll use a simple transliteration approach
    // In a production app, you would use a proper transliteration API
    return translateUserInput(name, language);
};

interface PDFPreviewProps {
    formData: {
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
        backgroundColor:string;
        textColor:string;
        backgroundTemplate:string;
        brideNameColor:string,
        groomNameColor:string,
        useSecondaryLanguage: boolean,
        language: string,
        tamilOnlyMode?: boolean, // Add optional tamilOnlyMode flag
        religion: string,
        showReligiousText: boolean
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

// Helper function to get religious text based on religion and language
const getReligiousText = (religion: string, language: string = 'english'): { original: string; translation: string } => {
    const religiousText = religiousTranslations[religion];
    if (!religiousText) {
        return {
            original: "",
            translation: ""
        };
    }
    
    return {
        original: religiousText.original,
        translation: language === 'english' ? religiousText.english : religiousText.tamil
    };
};

const PDFPreview = forwardRef<HTMLDivElement, PDFPreviewProps>(({ formData }, ref) => {
    const themeMessage = getThemeMessage(formData.theme, 'english');
    const themeMessageTamil = formData.useSecondaryLanguage ? getThemeMessage(formData.theme, formData.language) : '';
    const religiousText = formData.showReligiousText && formData.religion ? getReligiousText(formData.religion, 'english') : undefined;
    const religiousTextTamil = formData.showReligiousText && formData.religion ? getReligiousText(formData.religion, formData.language) : undefined;
    
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
        // Format the date in English first
        const formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        // Then translate it to Tamil using our enhanced translateUserInput function
        return translateUserInput(formattedDate, formData.language);
    };
    
    // Helper function to format time in Tamil
    const formatTimeInTamil = (timeStr: string) => {
        if (!timeStr) return '';
        // Format the time in English first
        const formattedTime = new Date(`2024-01-01T${timeStr}`).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
        });
        // Then translate it to Tamil using our enhanced translateUserInput function
        // This will handle AM/PM translation properly
        return translateUserInput(formattedTime, formData.language);
    };

   const selectedTemplate = backgroundTemplates.find(template => template.value === formData.backgroundTemplate);
   const backgroundImageStyle = selectedTemplate?.image ? { backgroundImage: `url(${selectedTemplate.image})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat' ,
       } : {};
    return (
        <div className="animate-fadeIn">
          <Card className="p-8 shadow-lg min-h-[600px] relative" ref={ref} style={{ backgroundColor: formData.backgroundColor ||'#f8f8f8',  ...backgroundImageStyle }}>
            <div className="text-center space-y-6">
                <div style={{color: formData.textColor || '#333333' }}>
                    {/* English Content Section - Hide when in Tamil-only mode */}
                    {!formData.tamilOnlyMode && (
                        <div className="mb-8">
                            {/* Religious Text Section - Only shown when showReligiousText is enabled */}
                            {formData.showReligiousText && formData.religion && religiousText && (
                                <div className="mb-6 text-center">
                                    <p className="text-xl font-semibold" style={{color: formData.textColor || '#333333'}}>
                                        {religiousText.original}
                                    </p>
                                    <p className="text-sm italic" style={{color: formData.textColor || '#333333'}}>
                                        {religiousText.translation}
                                    </p>
                                </div>
                            )}

                            <h1 className="text-3xl font-semibold mb-2" style={{color: formData.textColor || '#333333'}}>
                                {getTranslation("weddingInvitation", 'english')}
                            </h1>
                            
                            {formData.personalizeInvitation && formData.inviteeName && (
                                <h2 className="text-xl my-4" style={{color: formData.textColor || '#333333'}}>
                                    {themeMessage} {formData.inviteeName},
                                </h2>
                            )}

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
                                    {!formData.personalizeInvitation && (
                                        <p className="text-lg" style={{color: formData.textColor || '#333333'}}>
                                            {themeMessage}
                                        </p>
                                    )}
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
                                    {formData.venueAddress && (
                                        <p className="text-md" style={{color: formData.textColor || '#333333'}}>{formData.venueAddress}</p>
                                    )}
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
                    )}
                    
                    {/* Tamil Content Section - Only shown when secondary language is enabled */}
                    {formData.useSecondaryLanguage && (
                        <div className={!formData.tamilOnlyMode ? "mt-10 pt-10 border-t border-gray-300" : ""}>
                            {/* Religious Text Section - Only shown when showReligiousText is enabled */}
                            {formData.showReligiousText && formData.religion && religiousTextTamil && (
                                <div className="mb-6 text-center">
                                    <p className="text-xl font-semibold" style={{color: formData.textColor || '#333333'}}>
                                        {religiousTextTamil.original}
                                    </p>
                                    <p className="text-sm italic" style={{color: formData.textColor || '#333333'}}>
                                        {religiousTextTamil.translation}
                                    </p>
                                </div>
                            )}

                            <h1 className="text-3xl font-semibold mb-2" style={{color: formData.textColor || '#333333'}}>
                                {getTranslation("weddingInvitation", formData.language)}
                            </h1>
                            
                            {formData.personalizeInvitation && formData.inviteeName && (
                                <h2 className="text-xl my-4" style={{color: formData.textColor || '#333333'}}>
                                    {themeMessageTamil} {formData.inviteeName},
                                </h2>
                            )}

                            <div className="my-8">
                                <p className="text-2xl" style={{color: formData.brideNameColor || '#FFC0CB'}}>
                                    {formData.brideNameTamil || transliterateName(formData.brideNames, formData.language)}
                                </p>
                                {formData.brideQualification && <p className="text-sm italic" style={{color: formData.textColor || '#333333'}}>{translateUserInput(formData.brideQualification, formData.language)}</p>}

                                <p className="text-xl" style={{color: formData.textColor || '#333333'}}>&</p>
                                <p className="text-2xl" style={{color: formData.groomNameColor || '#FFC0CB'}}>
                                    {formData.groomNameTamil || transliterateName(formData.groomNames, formData.language)}
                                </p>
                                {formData.groomQualification && <p className="text-sm italic" style={{color: formData.textColor || '#333333'}}>{translateUserInput(formData.groomQualification, formData.language)}</p>}
                            </div>

                            {formData.date && formData.time && (
                                <div className="my-4">
                                    {!formData.personalizeInvitation && (
                                        <p className="text-lg" style={{color: formData.textColor || '#333333'}}>
                                            {themeMessageTamil}
                                        </p>
                                    )}
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
                                    {formData.venueAddress && (
                                        <p className="text-md" style={{color: formData.textColor || '#333333'}}>{translateUserInput(formData.venueAddress, formData.language)}</p>
                                    )}
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
            {/* Watermark */}
            <div className="absolute bottom-2 right-3" style={{color: formData.textColor || '#333333', opacity: 0.7, fontSize: '0.7rem'}}>
              {!formData.tamilOnlyMode && (
                <p>{getTranslation("madeByFarees", "english")}</p>
              )}
              {formData.useSecondaryLanguage && formData.tamilOnlyMode && (
                <p>{getTranslation("madeByFarees", formData.language)}</p>
              )}
            </div>
          </Card>
        </div>
    );
});
export default PDFPreview;