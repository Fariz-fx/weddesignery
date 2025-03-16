import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface TamilKeyboardProps {
  onCharacterSelect: (character: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const TamilKeyboard: React.FC<TamilKeyboardProps> = ({ 
  onCharacterSelect, 
  isOpen, 
  onOpenChange 
}) => {
  // Tamil vowels (uyir)
  const tamilVowels = [
    'அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ', 'ஃ'
  ];

  // Tamil consonants (mei)
  const tamilConsonants = [
    'க்', 'ங்', 'ச்', 'ஞ்', 'ட்', 'ண்', 'த்', 'ந்', 'ப்', 'ம்', 
    'ய்', 'ர்', 'ல்', 'வ்', 'ழ்', 'ள்', 'ற்', 'ன்'
  ];
  
  // Special characters requested by user (sin, zin, zia, ha, fa)
  const specialTamilChars = [
    'ஸ்', 'ஸ', 'ஸா', 'ஸி', 'ஸீ', 'ஸு', 'ஸூ', 'ஸெ', 'ஸே', 'ஸை', 'ஸொ', 'ஸோ', 'ஸௌ',
    'ஜ்', 'ஜ', 'ஜா', 'ஜி', 'ஜீ', 'ஜு', 'ஜூ', 'ஜெ', 'ஜே', 'ஜை', 'ஜொ', 'ஜோ', 'ஜௌ',
    'ஷ்', 'ஷ', 'ஷா', 'ஷி', 'ஷீ', 'ஷு', 'ஷூ', 'ஷெ', 'ஷே', 'ஷை', 'ஷொ', 'ஷோ', 'ஷௌ',
    'ஹ்', 'ஹ', 'ஹா', 'ஹி', 'ஹீ', 'ஹு', 'ஹூ', 'ஹெ', 'ஹே', 'ஹை', 'ஹொ', 'ஹோ', 'ஹௌ',
    'ஃப', 'ஃபா', 'ஃபி', 'ஃபீ', 'ஃபு', 'ஃபூ', 'ஃபெ', 'ஃபே', 'ஃபை', 'ஃபொ', 'ஃபோ', 'ஃபௌ'
  ];
  
  // Organize characters by frequency of use for easier access
  const commonTamilChars = [
    'க', 'ங', 'ச', 'ஞ', 'ட', 'ண', 'த', 'ந', 'ப', 'ம', 
    'ய', 'ர', 'ல', 'வ', 'ழ', 'ள', 'ற', 'ன'
  ];

  // Tamil combined letters (uyirmei) - a subset for common usage
  const tamilCombined = [
    'க', 'கா', 'கி', 'கீ', 'கு', 'கூ', 'கெ', 'கே', 'கை', 'கொ', 'கோ', 'கௌ',
    'ச', 'சா', 'சி', 'சீ', 'சு', 'சூ', 'செ', 'சே', 'சை', 'சொ', 'சோ', 'சௌ',
    'ட', 'டா', 'டி', 'டீ', 'டு', 'டூ', 'டெ', 'டே', 'டை', 'டொ', 'டோ', 'டௌ',
    'த', 'தா', 'தி', 'தீ', 'து', 'தூ', 'தெ', 'தே', 'தை', 'தொ', 'தோ', 'தௌ',
    'ப', 'பா', 'பி', 'பீ', 'பு', 'பூ', 'பெ', 'பே', 'பை', 'பொ', 'போ', 'பௌ',
    'ம', 'மா', 'மி', 'மீ', 'மு', 'மூ', 'மெ', 'மே', 'மை', 'மொ', 'மோ', 'மௌ',
    'ய', 'யா', 'யி', 'யீ', 'யு', 'யூ', 'யெ', 'யே', 'யை', 'யொ', 'யோ', 'யௌ',
    'வ', 'வா', 'வி', 'வீ', 'வு', 'வூ', 'வெ', 'வே', 'வை', 'வொ', 'வோ', 'வௌ',
    'ர', 'ரா', 'ரி', 'ரீ', 'ரு', 'ரூ', 'ரெ', 'ரே', 'ரை', 'ரொ', 'ரோ', 'ரௌ',
    'ல', 'லா', 'லி', 'லீ', 'லு', 'லூ', 'லெ', 'லே', 'லை', 'லொ', 'லோ', 'லௌ',
    'ந', 'நா', 'நி', 'நீ', 'நு', 'நூ', 'நெ', 'நே', 'நை', 'நொ', 'நோ', 'நௌ'
  ];

  // Special characters and numbers
  const specialChars = ['௧', '௨', '௩', '௪', '௫', '௬', '௭', '௮', '௯', '௰', '௱', '௲', ' '];

  // Helper function to get tooltip text for special characters
  const getTooltipText = (char: string): string => {
    // Map for special characters
    const charMap: {[key: string]: string} = {
      'ஸ்': 'sin (s)',
      'ஜ்': 'zin (j/z)',
      'ஷ்': 'zia (sh)',
      'ஹ்': 'ha (h)',
      'ஃப': 'fa (f)',
      'ஃ': 'aytham'
    };
    
    return charMap[char] || '';
  };

  // Map Tamil characters to English transliterations for search
  const tamilToEnglishMap: {[key: string]: string[]} = {
    // Vowels with expanded transliterations
    'அ': ['a', 'ah'],
    'ஆ': ['aa', 'A', 'aah', 'ah'],
    'இ': ['i', 'e', 'ee', 'ih'],
    'ஈ': ['ee', 'E', 'ii', 'I', 'eeh', 'ea'],
    'உ': ['u', 'oo', 'uh'],
    'ஊ': ['oo', 'U', 'ooh', 'uu'],
    'எ': ['e', 'eh', 'ae'],
    'ஏ': ['ae', 'ea', 'aeh', 'e', 'ay'],
    'ஐ': ['ai', 'aai', 'eye', 'ei'],
    'ஒ': ['o', 'oh', 'oa'],
    'ஓ': ['oa', 'O', 'oh', 'oo'],
    'ஔ': ['au', 'ou', 'ow', 'aw'],
    'ஃ': ['ah', 'q', 'akh', 'akhu'],
    
    // Consonants with expanded transliterations
    'க': ['ka', 'ga', 'k', 'g', 'kha', 'ca'],
    'ங': ['nga', 'ng', 'nk', 'nka'],
    'ச': ['sa', 'cha', 'c', 's', 'ch', 'j'],
    'ஞ': ['nya', 'gna', 'nja', 'nj', 'gnya'],
    'ட': ['ta', 'da', 't', 'd', 'ta', 'tta'],
    'ண': ['Na', 'na', 'nna', 'N', 'nn'],
    'த': ['tha', 'dha', 'th', 'dh', 'tha', 'da'],
    'ந': ['na', 'n', 'nh', 'nth', 'nha'],
    'ப': ['pa', 'ba', 'p', 'b', 'bha', 'ph'],
    'ம': ['ma', 'm', 'mh', 'mha'],
    'ய': ['ya', 'y', 'yh', 'yha'],
    'ர': ['ra', 'r', 'rh', 'rha', 'ru'],
    'ல': ['la', 'l', 'lh', 'lha', 'lu'],
    'வ': ['va', 'wa', 'v', 'w', 'vh', 'wha'],
    'ழ': ['zha', 'zh', 'lh', 'rl', 'rla', 'rz'],
    'ள': ['La', 'la', 'lla', 'L', 'lha', 'lf'],
    'ற': ['Ra', 'ra', 'rra', 'R', 'tr', 'rh'],
    'ன': ['na', 'n', 'nn', 'nna', 'N'],
    
    // Special characters with expanded transliterations
    'ஜ': ['ja', 'za', 'j', 'z', 'jha', 'jh'],
    'ஷ': ['sha', 'sh', 'shh', 'cha', 'sa'],
    'ஸ': ['sa', 's', 'sh', 'si', 'se'],
    'ஹ': ['ha', 'h', 'hh', 'hu', 'hi'],
    
    // Combined characters (common ones)
    'கா': ['kaa', 'gaa', 'ka', 'ga'],
    'கி': ['ki', 'gi', 'kee', 'gee'],
    'கு': ['ku', 'gu', 'koo', 'goo'],
    'கே': ['ke', 'ge', 'kay', 'gay'],
    'கை': ['kai', 'gai', 'kaai', 'gaai'],
    'சா': ['saa', 'chaa', 'sa', 'cha'],
    'சி': ['si', 'chi', 'see', 'chee'],
    'சு': ['su', 'chu', 'soo', 'choo'],
    'சே': ['se', 'che', 'say', 'chay'],
    'தா': ['thaa', 'dhaa', 'tha', 'dha'],
    'தி': ['thi', 'dhi', 'thee', 'dhee'],
    'து': ['thu', 'dhu', 'thoo', 'dhoo'],
    'தே': ['the', 'dhe', 'thay', 'dhay'],
    'பா': ['paa', 'baa', 'pa', 'ba'],
    'பி': ['pi', 'bi', 'pee', 'bee'],
    'பு': ['pu', 'bu', 'poo', 'boo'],
    'பே': ['pe', 'be', 'pay', 'bay']
  };

  // State for search and compact mode
  const [searchQuery, setSearchQuery] = useState('');
  const [compactMode, setCompactMode] = useState(false);

  // Filter characters based on search query
  const filterCharacters = (characters: string[]) => {
    if (!searchQuery) return characters;
    
    return characters.filter(char => {
      // Direct match in Tamil
      if (char.toLowerCase().includes(searchQuery.toLowerCase())) {
        return true;
      }
      
      // Check if this character has English transliterations
      const transliterations = tamilToEnglishMap[char];
      if (transliterations) {
        // Check if any transliteration matches the search query
        return transliterations.some(trans => 
          trans.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      return false;
    });
  };

  // Get grid columns based on compact mode
  const getGridCols = () => compactMode ? 'grid-cols-8 gap-1.5' : 'grid-cols-6 gap-2';
  const getButtonSize = () => compactMode ? 'h-7 text-sm px-1.5 min-w-[2rem]' : 'h-8 text-base px-2 min-w-[2.5rem]';

  const renderKeyboardSection = (title: string, characters: string[]) => {
    const filteredChars = filterCharacters(characters);
    
    return (
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">{title}</h3>
        {filteredChars.length > 0 ? (
          <div className={`grid ${getGridCols()}`}>
            {filteredChars.map((char, index) => {
              const tooltipText = getTooltipText(char);
              
              return tooltipText ? (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        className={`${getButtonSize()} hover:bg-wedding-secondary hover:text-white transition-colors`}
                        onClick={() => onCharacterSelect(char)}
                      >
                        {char}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{tooltipText}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Button 
                  key={index} 
                  variant="outline" 
                  className={`${getButtonSize()} hover:bg-wedding-secondary hover:text-white transition-colors`}
                  onClick={() => onCharacterSelect(char)}
                >
                  {char}
                </Button>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No characters match your search</p>
        )}
      </div>
    );
  };

  // Render a character group with a distinct background
  const renderCharGroup = (title: string, characters: string[], bgColor: string = 'bg-gray-50') => {
    const filteredChars = filterCharacters(characters);
    
    return filteredChars.length > 0 ? (
      <div className={`p-3 rounded-md mb-3 ${bgColor}`}>
        <h3 className="text-sm font-medium mb-2">{title}</h3>
        <div className={`grid ${getGridCols()}`}>
          {filteredChars.map((char, index) => (
            <Button 
              key={index} 
              variant="outline" 
              className={`${getButtonSize()} bg-white hover:bg-wedding-secondary hover:text-white transition-colors`}
              onClick={() => onCharacterSelect(char)}
            >
              {char}
            </Button>
          ))}
        </div>
      </div>
    ) : null;
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs bg-wedding-light hover:bg-wedding-secondary"
        >
          Tamil Keyboard
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4" side="top">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold mb-3">Tamil Characters</h2>
          
          {/* Search and options */}
          <div className="mb-4 space-y-2">
            <Input
              type="text"
              placeholder="Search in Tamil or English (e.g., 'ka' or 'க')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-2"
            />
            
            <div className="flex items-center space-x-2">
              <Switch
                id="compact-mode"
                checked={compactMode}
                onCheckedChange={setCompactMode}
              />
              <Label htmlFor="compact-mode">Compact Mode</Label>
            </div>
          </div>
          
          <Tabs defaultValue="frequent">
            <TabsList className="grid grid-cols-6 mb-2">
              <TabsTrigger value="frequent">Frequent</TabsTrigger>
              <TabsTrigger value="common">Common</TabsTrigger>
              <TabsTrigger value="combined">Combined</TabsTrigger>
              <TabsTrigger value="special">Special</TabsTrigger>
              <TabsTrigger value="numbers">Numbers</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            
            <TabsContent value="frequent" className="space-y-2">
              {/* Most frequently used characters for quick access */}
              <div className="p-3 rounded-md mb-3 bg-blue-50">
                <h3 className="text-sm font-medium mb-2">Frequently Used Characters</h3>
                <div className={`grid ${getGridCols()}`}>
                  {filterCharacters([
                    'அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ',
                    'க', 'ச', 'ட', 'த', 'ப', 'ம', 'ய', 'ர', 'ல', 'வ', 'ழ', 'ள',
                    'கா', 'சா', 'டா', 'தா', 'பா', 'மா', 'யா', 'ரா', 'லா', 'வா',
                    'கி', 'சி', 'டி', 'தி', 'பி', 'மி', 'யி', 'ரி', 'லி', 'வி',
                    'கு', 'சு', 'டு', 'து', 'பு', 'மு', 'யு', 'ரு', 'லு', 'வு',
                    'கே', 'சே', 'டே', 'தே', 'பே', 'மே', 'யே', 'ரே', 'லே', 'வே',
                    'ஜ', 'ஷ', 'ஸ', 'ஹ', ' '
                  ]).map((char, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      className={`${getButtonSize()} bg-white hover:bg-wedding-secondary hover:text-white transition-colors`}
                      onClick={() => onCharacterSelect(char)}
                    >
                      {char}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="common" className="space-y-2">
              {renderCharGroup('Vowels (உயிர்)', tamilVowels, 'bg-green-50')}
              {renderCharGroup('Consonants (மெய்)', tamilConsonants, 'bg-yellow-50')}
              {renderCharGroup('Common Characters', commonTamilChars, 'bg-blue-50')}
            </TabsContent>
            
            <TabsContent value="combined" className="space-y-2">
              {renderCharGroup('Combined Letters (உயிர்மெய்)', tamilCombined, 'bg-pink-50')}
            </TabsContent>
            
            <TabsContent value="special" className="space-y-2">
              {renderCharGroup('Special Characters', specialTamilChars, 'bg-purple-50')}
            </TabsContent>
            
            <TabsContent value="numbers" className="space-y-2">
              {renderCharGroup('Numbers & Special Characters', specialChars, 'bg-gray-50')}
            </TabsContent>
            
            <TabsContent value="all" className="space-y-2">
              {renderKeyboardSection('Vowels (உயிர் எழுத்துக்கள்)', tamilVowels)}
              {renderKeyboardSection('Consonants (மெய் எழுத்துக்கள்)', tamilConsonants)}
              {renderKeyboardSection('Special Characters', specialTamilChars)}
              {renderKeyboardSection('Combined Letters', tamilCombined)}
              {renderKeyboardSection('Numbers & Special Characters', specialChars)}
            </TabsContent>
          </Tabs>
          
          <div className="mt-4 text-xs text-gray-500">
            Click on any character to add it to your text. Hover over special characters for pronunciation help.
            {searchQuery && <p className="mt-1">Showing results for: "{searchQuery}"</p>}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TamilKeyboard;