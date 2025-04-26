import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { getTranslation } from "@/lib/translations";

export interface Theme {
    id: string;
    name: string;
    value: string;
    englishText: string;
    tamilText: string;
    isCustom?: boolean;
}

interface ThemeEditorProps {
    onThemeAdded: (theme: Theme) => void;
    onThemeEdited: (theme: Theme) => void;
    existingThemes: Theme[];
    selectedTheme?: string;
    language?: string;
}

const ThemeEditor: React.FC<ThemeEditorProps> = ({
    onThemeAdded,
    onThemeEdited,
    existingThemes,
    selectedTheme,
    language = 'english'
}) => {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [themeToEdit, setThemeToEdit] = useState<string | null>(null);
    
    const [themeData, setThemeData] = useState<{
        name: string;
        value: string;
        englishText: string;
        tamilText: string;
    }>({
        name: '',
        value: '',
        englishText: '',
        tamilText: ''
    });

    // Reset form when dialog closes
    useEffect(() => {
        if (!isOpen) {
            setThemeData({
                name: '',
                value: '',
                englishText: '',
                tamilText: ''
            });
            setIsEditMode(false);
            setThemeToEdit(null);
        }
    }, [isOpen]);

    // Load theme data when editing
    useEffect(() => {
        if (isEditMode && themeToEdit) {
            const theme = existingThemes.find(t => t.value === themeToEdit);
            if (theme) {
                setThemeData({
                    name: theme.name,
                    value: theme.value,
                    englishText: theme.englishText,
                    tamilText: theme.tamilText
                });
            }
        }
    }, [isEditMode, themeToEdit, existingThemes]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setThemeData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        // Validate inputs
        if (!themeData.name || !themeData.englishText || !themeData.tamilText) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields",
                variant: "destructive"
            });
            return;
        }

        // Generate a value if not in edit mode
        const value = isEditMode ? themeData.value : themeData.name.toLowerCase().replace(/\s+/g, '');
        
        // Check for duplicate value in non-edit mode
        if (!isEditMode && existingThemes.some(t => t.value === value)) {
            toast({
                title: "Duplicate Theme",
                description: "A theme with this name already exists",
                variant: "destructive"
            });
            return;
        }

        const newTheme: Theme = {
            id: isEditMode ? themeToEdit || value : value,
            name: themeData.name,
            value: value,
            englishText: themeData.englishText,
            tamilText: themeData.tamilText,
            isCustom: true
        };

        if (isEditMode) {
            onThemeEdited(newTheme);
            toast({
                title: "Success",
                description: "Theme updated successfully"
            });
        } else {
            onThemeAdded(newTheme);
            toast({
                title: "Success",
                description: "New theme added successfully"
            });
        }

        setIsOpen(false);
    };

    const handleEditTheme = (themeValue: string) => {
        setThemeToEdit(themeValue);
        setIsEditMode(true);
        setIsOpen(true);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Invitation Themes</h3>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setIsEditMode(false);
                                setThemeToEdit(null);
                            }}
                        >
                            Add New Theme
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{isEditMode ? "Edit Theme" : "Add New Theme"}</DialogTitle>
                            <DialogDescription>
                                {isEditMode 
                                    ? "Update the theme details below." 
                                    : "Create a custom theme for your invitations."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Theme Name
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={themeData.name}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    placeholder="e.g., Close Friends"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="englishText" className="text-right">
                                    English Text
                                </Label>
                                <Textarea
                                    id="englishText"
                                    name="englishText"
                                    value={themeData.englishText}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    placeholder="The text that will appear in English invitations"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="tamilText" className="text-right">
                                    Tamil Text
                                </Label>
                                <Textarea
                                    id="tamilText"
                                    name="tamilText"
                                    value={themeData.tamilText}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    placeholder="The text that will appear in Tamil invitations"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={handleSubmit}>
                                {isEditMode ? "Save Changes" : "Add Theme"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Theme Management Section */}
            {existingThemes.filter(theme => theme.isCustom).length > 0 && (
                <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">Your Custom Themes</h4>
                    <div className="space-y-2">
                        {existingThemes
                            .filter(theme => theme.isCustom)
                            .map(theme => (
                                <div key={theme.value} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <div>
                                        <p className="font-medium">{theme.name}</p>
                                        <p className="text-sm text-gray-500 truncate">{theme.englishText}</p>
                                    </div>
                                    <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => handleEditTheme(theme.value)}
                                    >
                                        Edit
                                    </Button>
                                </div>
                            ))
                        }
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemeEditor;