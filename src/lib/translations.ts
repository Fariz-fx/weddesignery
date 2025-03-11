interface Translations {
    [key: string]: {
        english: string;
        tamil: string;
    };
}

export const translations: Translations = {
    weddingInvitation: {
        english: "Wedding Invitation",
        tamil: "திருமண அழைப்பிதழ்"
    },
    joinCelebration: {
        english: "Join us in celebration on:",
        tamil: "எங்கள் திருமண விழாவில் கலந்து கொள்ளுமாறு அன்புடன் அழைக்கிறோம்:"
    },
    venue: {
        english: "Venue:",
        tamil: "இடம்:"
    },
    addToCalendar: {
        english: "Add to Calendar",
        tamil: "காலெண்டரில் சேர்க்கவும்"
    },
    viewOnMap: {
        english: "View on Map",
        tamil: "வரைபடத்தில் காண்க"
    },
    familyTheme: {
        english: "With joy in our hearts, we invite our beloved family member",
        tamil: "மகிழ்ச்சியுடன், எங்கள் அன்பான குடும்ப உறுப்பினரை அழைக்கிறோம்"
    },
    friendsTheme: {
        english: "To our dearest friend",
        tamil: "எங்கள் அன்பு நண்பருக்கு"
    },
    workTheme: {
        english: "We cordially invite our esteemed colleague",
        tamil: "எங்கள் மதிப்பிற்குரிய சகஊழியரை அன்புடன் அழைக்கிறோம்"
    },
    neighborsTheme: {
        english: "To our wonderful neighbor",
        tamil: "எங்கள் அருமை அண்டை வீட்டாருக்கு"
    },
    defaultTheme: {
        english: "We joyfully invite",
        tamil: "மகிழ்ச்சியுடன் அழைக்கிறோம்"
    },
    enableDualLanguage: {
        english: "Enable Dual Language",
        tamil: "இரு மொழிகளை இயக்கு"
    },
    enableDualLanguageTooltip: {
        english: "Show invitation in both English and Tamil",
        tamil: "அழைப்பிதழை ஆங்கிலம் மற்றும் தமிழில் காட்டு"
    },
    selectLanguage: {
        english: "Select Secondary Language",
        tamil: "இரண்டாம் மொழியைத் தேர்ந்தெடுக்கவும்"
    },
    error: {
        english: "Error!",
        tamil: "பிழை!"
    },
    previewNotFound: {
        english: "Could not locate the invitation preview.",
        tamil: "அழைப்பிதழ் முன்னோட்டத்தைக் கண்டறிய முடியவில்லை."
    },
    // Common words that might be in user inputs
    at: {
        english: "at",
        tamil: "இல்"
    },
    and: {
        english: "and",
        tamil: "மற்றும்"
    },
    on: {
        english: "on",
        tamil: "அன்று"
    },
    // Common time-related words
    am: {
        english: "AM",
        tamil: "காலை"
    },
    pm: {
        english: "PM",
        tamil: "மாலை"
    },
    // Days of the week
    monday: {
        english: "Monday",
        tamil: "திங்கட்கிழமை"
    },
    tuesday: {
        english: "Tuesday",
        tamil: "செவ்வாய்க்கிழமை"
    },
    wednesday: {
        english: "Wednesday",
        tamil: "புதன்கிழமை"
    },
    thursday: {
        english: "Thursday",
        tamil: "வியாழக்கிழமை"
    },
    friday: {
        english: "Friday",
        tamil: "வெள்ளிக்கிழமை"
    },
    saturday: {
        english: "Saturday",
        tamil: "சனிக்கிழமை"
    },
    sunday: {
        english: "Sunday",
        tamil: "ஞாயிற்றுக்கிழமை"
    },
    // Months
    january: {
        english: "January",
        tamil: "ஜனவரி"
    },
    february: {
        english: "February",
        tamil: "பிப்ரவரி"
    },
    march: {
        english: "March",
        tamil: "மார்ச்"
    },
    april: {
        english: "April",
        tamil: "ஏப்ரல்"
    },
    may: {
        english: "May",
        tamil: "மே"
    },
    june: {
        english: "June",
        tamil: "ஜூன்"
    },
    july: {
        english: "July",
        tamil: "ஜூலை"
    },
    august: {
        english: "August",
        tamil: "ஆகஸ்ட்"
    },
    september: {
        english: "September",
        tamil: "செப்டம்பர்"
    },
    october: {
        english: "October",
        tamil: "அக்டோபர்"
    },
    november: {
        english: "November",
        tamil: "நவம்பர்"
    },
    december: {
        english: "December",
        tamil: "டிசம்பர்"
    }
};

export const getTranslation = (key: string, language: string = 'english'): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation.english;
};

// Helper function to translate user-provided text with common words
export const translateUserInput = (text: string, language: string = 'english'): string => {
    if (language === 'english' || !text) return text;
    
    // For simple implementation, we'll just replace known words
    // In a production app, you would use a proper translation API
    let translatedText = text;
    
    // Convert text to lowercase for matching
    const lowerText = text.toLowerCase();
    
    // Replace days of week
    Object.keys(translations).forEach(key => {
        if (translations[key].english.toLowerCase() === lowerText) {
            translatedText = translations[key][language] || text;
            return;
        }
        
        // Replace if the English word is found in the text
        // This is a simple approach and might have limitations
        const englishWord = translations[key].english.toLowerCase();
        if (lowerText.includes(englishWord)) {
            const tamilWord = translations[key][language];
            // Use case-insensitive replacement to preserve original casing
            const regex = new RegExp(englishWord, 'gi');
            translatedText = translatedText.replace(regex, tamilWord);
        }
    });
    
    return translatedText;
};