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
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

export interface Theme {
    id: string;
    name: string;
    value: string;
    englishText: string;
    tamilText: string;
    isCustom?: boolean;
    isDefault?: boolean;
}

interface ThemeEditorProps {
    onThemeAdded: (theme: Theme) => void;
    onThemeEdited: (theme: Theme) => void;
    onThemeDeleted?: (themeValue: string) => void;
    existingThemes: Theme[];
    selectedTheme?: string;
    language?: string;
}

const ThemeEditor: React.FC<ThemeEditorProps> = ({
    onThemeAdded,
    onThemeEdited,
    onThemeDeleted,
    existingThemes,
    selectedTheme,
    language = 'english'
}) => {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [themeToEdit, setThemeToEdit] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [themeToDelete, setThemeToDelete] = useState<string | null>(null);
    
    // State for collapsible sections
    const [isDefaultThemesOpen, setIsDefaultThemesOpen] = useState(true);
    const [isCustomThemesOpen, setIsCustomThemesOpen] = useState(true);
    
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

        // Get the original theme to preserve isDefault if it exists
        const originalTheme = isEditMode ? existingThemes.find(t => t.value === themeToEdit) : null;
        
        const newTheme: Theme = {
            id: isEditMode ? themeToEdit || value : value,
            name: themeData.name,
            value: value,
            englishText: themeData.englishText,
            tamilText: themeData.tamilText,
            isCustom: originalTheme?.isDefault ? false : true,
            isDefault: originalTheme?.isDefault || false
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

    const handleDeleteTheme = (themeValue: string) => {
        setThemeToDelete(themeValue);
        setIsDeleteDialogOpen(true);
    };

    const confirmDeleteTheme = () => {
        if (themeToDelete && onThemeDeleted) {
            onThemeDeleted(themeToDelete);
            toast({
                title: "Success",
                description: "Theme deleted successfully"
            });
        }
        setIsDeleteDialogOpen(false);
        setThemeToDelete(null);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <h3 className="text-xl font-semibold">Invitation Themes</h3>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button 
                            variant="default" 
                            className="w-full sm:w-auto"
                            onClick={() => {
                                setIsEditMode(false);
                                setThemeToEdit(null);
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
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

            {/* Default Themes Section */}
            <Collapsible 
                open={isDefaultThemesOpen} 
                onOpenChange={setIsDefaultThemesOpen}
                className="border rounded-md p-4 bg-slate-50/50 mb-6 transition-all duration-200"
            >
                <div className="flex justify-between items-center">
                    <CollapsibleTrigger className="flex items-center w-full text-left">
                        <h4 className="font-medium text-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313-12.454z"></path></svg>
                            Default Themes
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="16" 
                                height="16" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className={`ml-2 transition-transform duration-200 ${isDefaultThemesOpen ? 'rotate-180' : 'rotate-0'}`}
                            >
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </h4>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="mt-3">
                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {existingThemes
                        .filter(theme => !theme.isCustom)
                        .map(theme => (
                            <div key={theme.value} className="flex flex-col p-4 bg-white rounded-md border hover:shadow-md transition-shadow relative group">
                                <div className="absolute top-2 right-2">
                                    <Button 
                                        className="h-8 w-8 p-0"
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => handleEditTheme(theme.value)}
                                        title="Edit Theme"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                        <span className="sr-only">Edit Theme</span>
                                    </Button>
                                </div>
                                <div className="mb-3">
                                    <p className="font-medium text-lg mb-1">{theme.name}</p>
                                    <div className="bg-slate-50 p-2 rounded-md mb-2">
                                        <p className="text-sm text-gray-600 line-clamp-2 italic">"{theme.englishText}"</p>
                                    </div>
                                </div>
                                <Button 
                                    className="mt-auto w-full justify-center"
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleEditTheme(theme.value)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                    Edit Theme
                                </Button>
                            </div>
                        ))
                    }
                    </div>
                </CollapsibleContent>
            </Collapsible>

            {/* Custom Themes Section */}
            <Collapsible 
                open={isCustomThemesOpen} 
                onOpenChange={setIsCustomThemesOpen}
                className="border rounded-md p-4 bg-slate-50/50 transition-all duration-200"
            >
                <div className="flex justify-between items-center">
                    <CollapsibleTrigger className="flex items-center w-full text-left">
                        <h4 className="font-medium text-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            Your Custom Themes
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="16" 
                                height="16" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className={`ml-2 transition-transform duration-200 ${isCustomThemesOpen ? 'rotate-180' : 'rotate-0'}`}
                            >
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </h4>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="mt-3">
                {existingThemes.filter(theme => theme.isCustom).length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {existingThemes
                            .filter(theme => theme.isCustom)
                            .map(theme => (
                                <div key={theme.value} className="flex flex-col p-4 bg-white rounded-md border hover:shadow-md transition-shadow relative group">
                                    <div className="absolute top-2 right-2 flex">
                                        <Button 
                                            className="h-8 w-8 p-0 mr-1"
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => handleEditTheme(theme.value)}
                                            title="Edit Theme"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            <span className="sr-only">Edit Theme</span>
                                        </Button>
                                        <Button 
                                            className="h-8 w-8 p-0"
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => handleDeleteTheme(theme.value)}
                                            title="Delete Theme"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                            <span className="sr-only">Delete Theme</span>
                                        </Button>
                                    </div>
                                    <div className="mb-3">
                                        <p className="font-medium text-lg mb-1">{theme.name}</p>
                                        <div className="bg-slate-50 p-2 rounded-md mb-2">
                                            <p className="text-sm text-gray-600 line-clamp-2 italic">"{theme.englishText}"</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-auto">
                                        <Button 
                                            className="flex-1 justify-center"
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => handleEditTheme(theme.value)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            Edit
                                        </Button>
                                        <Button 
                                            className="flex-1 justify-center"
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => handleDeleteTheme(theme.value)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                ) : (
                    <div className="text-center py-6 bg-white rounded-md border">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 text-gray-400"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                        <p className="text-gray-600 mb-2">You haven't created any custom themes yet</p>
                        <p className="text-sm text-gray-500 mb-4">Click the "Add New Theme" button to create your first custom theme</p>
                    </div>
                )}
                </CollapsibleContent>
            </Collapsible>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete Theme</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this theme? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-between sm:justify-between">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmDeleteTheme}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ThemeEditor;