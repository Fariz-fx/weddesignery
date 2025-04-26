interface Translations {
    [key: string]: {
        english: string;
        tamil: string;
    };
}

// Religious text translations
export interface ReligiousTranslations {
    [key: string]: {
        original: string;
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
        english: "Cordially invite your esteemed presence with family and friends on the auspicious occasion of the wedding ceremony of our beloved daughter:",
        tamil: "எங்கள் நிக்காஹ் (திருமண) விழாவில் கலந்து கொள்ளுமாறு அன்புடன் அழைக்கிறோம்:"
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
        english: "Cordially invite your esteemed presence with family and friends on the auspicious occasion of the wedding ceremony of our beloved daughter",
        tamil: "எங்கள் நிக்காஹ் (திருமண) விழாவில் கலந்து கொள்ளுமாறு அன்புடன் அழைக்கிறோம்"
    },
    friendsTheme: {
        english: "I am excited to share with you that I am getting married soon, and I would be honored to have you join me on this special day",
        tamil: "நான் விரைவில் திருமணம் செய்து கொள்ளப் போகிறேன் என்பதை உங்களுடன் பகிர்ந்து கொள்வதில் நான் மகிழ்ச்சியடைகிறேன், இந்த சிறப்பு நாளில் நீங்கள் என்னுடன் இணைந்தால் நான் பெருமைப்படுவேன்"
    },
    workTheme: {
        english: "I warmly welcome you to my marriage ceremony and ask that you bestow your blessings on us. I would be overjoyed to have your presence",
        tamil: "எனது திருமண விழாவிற்கு உங்களை அன்புடன் வரவேற்கிறேன், உங்கள் ஆசீர்வாதங்களை எங்களுக்கு வழங்குமாறு கேட்டுக்கொள்கிறேன். உங்கள் வருகை எனக்கு மிகுந்த மகிழ்ச்சியை அளிக்கும்"
    },
    neighborsTheme: {
        english: "To our wonderful neighbor",
        tamil: "எங்கள் அருமை அண்டை வீட்டாருக்கு"
    },
    bridesbrothersFriendTheme: {
        english: "Hey buddy! I'm thrilled to invite you to my sister's wedding. As my best friend, your presence would mean the world to me on this special day",
        tamil: "நண்பா! என் சகோதரியின் திருமணத்திற்கு உங்களை அழைக்க மகிழ்ச்சியடைகிறேன். என் சிறந்த நண்பராக, இந்த சிறப்பு நாளில் உங்கள் இருப்பு எனக்கு மிகவும் முக்கியமானது"
    },
    bridebrotherworkcolleagueTheme: {
        english: "I warmly welcome you to my sister's marriage ceremony and ask that you bestow your blessings on us. I would be overjoyed to have your presence",
        tamil: "எனது தங்கை திருமண விழாவிற்கு உங்களை அன்புடன் வரவேற்கிறேன், உங்கள் ஆசீர்வாதங்களை எங்களுக்கு வழங்குமாறு கேட்டுக்கொள்கிறேன். உங்கள் வருகை எனக்கு மிகுந்த மகிழ்ச்சியை அளிக்கும்"
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
    // and: {
    //     english: "and",
    //     tamil: "மற்றும்"
    // },
    // on: {
    //     english: "on",
    //     tamil: "அன்று"
    // },
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
    },
    madeByFarees: {
        english: "Made by Farees",
        // tamil: "Farees ஆல் உருவாக்கப்பட்டது"
        tamil: "Made by Farees",
    }
};

// Cache for translations to improve performance
const translationCache: Record<string, Record<string, string>> = {};

export const getTranslation = (key: string, language: string = 'english'): string => {
    // Check if we have this translation in cache
    if (translationCache[key]?.[language]) {
        return translationCache[key][language];
    }
    
    const translation = translations[key];
    if (!translation) return key;
    
    const result = translation[language] || translation.english;
    
    // Cache the result
    if (!translationCache[key]) {
        translationCache[key] = {};
    }
    translationCache[key][language] = result;
    
    return result;
};

// Helper function to translate user-provided text with common words
// Religious text translations for different religions
export const religiousTranslations: ReligiousTranslations = {
    islam: {
        original: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
        english: "In the name of Allah, the Most Gracious, the Most Merciful",
        tamil: "அல்லாஹ்வின் பெயரால், மிகவும் கருணை மிக்க, மிகவும் இரக்கமுள்ள"
    },
    hinduism: {
        original: "ॐ श्री गणेशाय नमः",
        english: "Om, Salutations to Lord Ganesha",
        tamil: "ஓம், ஸ்ரீ கணேசாய நம:"
    },
    christianity: {
        original: "In the name of the Father, the Son, and the Holy Spirit",
        english: "Blessed is the marriage that begins in God's name",
        tamil: "தந்தை, மகன், பரிசுத்த ஆவியின் பெயரால், கடவுளின் பெயரில் தொடங்கும் திருமணம் ஆசீர்வதிக்கப்பட்டது"
    },
    sikhism: {
        original: "ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ",
        english: "One Universal Creator God, The Name Is Truth",
        tamil: "ஒரே உலகளாவிய படைப்பாளர் கடவுள், பெயர் உண்மை"
    },
    buddhism: {
        original: "बुद्धं शरणं गच्छामि",
        english: "I take refuge in the Buddha",
        tamil: "நான் புத்தரை சரணடைகிறேன்"
    },
    jainism: {
        original: "णमो अरिहंताणं",
        english: "I bow to the Arihantas (Enlightened Souls)",
        tamil: "அரிஹந்தர்களுக்கு (ஞானம் பெற்ற ஆன்மாக்கள்) வணக்கம்"
    }
};

export const translateUserInput = (text: string, language: string = 'english'): string => {
    if (language === 'english' || !text) return text;
    
    // For simple implementation, we'll just replace known words
    // In a production app, you would use a proper translation API
    let translatedText = text;
    
    // Convert text to lowercase for matching
    const lowerText = text.toLowerCase();
    
    // First check if the entire text matches a translation key
    Object.keys(translations).forEach(key => {
        if (translations[key].english.toLowerCase() === lowerText) {
            translatedText = translations[key][language] || text;
        }
    });
    
    // If the text wasn't fully translated, try to translate parts of it
    if (translatedText === text) {
        // Special handling for dates
        if (/^\d{4}-\d{2}-\d{2}$/.exec(text) || text.includes('/')) {
            // This is likely a date, try to parse and format it
            try {
                const date = new Date(text);
                if (!isNaN(date.getTime())) {
                    // Get day of week
                    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
                    const month = date.toLocaleDateString('en-US', { month: 'long' }).toLowerCase();
                    
                    // Translate day and month
                    let tamilDay = dayOfWeek;
                    let tamilMonth = month;
                    
                    Object.keys(translations).forEach(key => {
                        if (translations[key].english.toLowerCase() === dayOfWeek) {
                            tamilDay = translations[key][language];
                        }
                        if (translations[key].english.toLowerCase() === month) {
                            tamilMonth = translations[key][language];
                        }
                    });
                    
                    // Format in Tamil style
                    return `${tamilDay}, ${tamilMonth} ${date.getDate()}, ${date.getFullYear()}`;
                }
            } catch (e) {
                // If date parsing fails, continue with word replacement
            }
        }
        
        // Replace individual words
        Object.keys(translations).forEach(key => {
            // Replace if the English word is found in the text
            const englishWord = translations[key].english.toLowerCase();
            if (lowerText.includes(englishWord)) {
                const tamilWord = translations[key][language];
                // Use case-insensitive replacement to preserve original casing
                // Limit the size of the input to prevent ReDoS attacks
                if (englishWord.length > 100 || translatedText.length > 10000) {
                    return; // Skip this iteration if input is too large
                }
                
                // Escape special regex characters to prevent injection
                const escapedWord = englishWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(escapedWord, 'gi');
                
                // Limit replacements to prevent excessive processing
                let count = 0;
                const maxReplacements = 100;
                translatedText = translatedText.replace(regex, (match) => {
                    if (count++ < maxReplacements) {
                        return tamilWord;
                    }
                    return match; // Stop replacing after max replacements
                });
            }
        });
    }
    
    return translatedText;
};