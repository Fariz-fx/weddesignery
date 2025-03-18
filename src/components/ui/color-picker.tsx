import * as React from "react"
import { SketchPicker } from "react-color"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


interface ColorPickerProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
    onValueChange: (value:string)=>void;
    id:string
}

// Helper function to validate color values
const isValidColor = (color: string): boolean => {
    // Check if it's a valid hex color
    if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
        return true;
    }
    // Check if it's a valid rgb/rgba color
    if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i.test(color) ||
        /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[0-1](\.\d+)?\s*\)$/i.test(color)) {
        return true;
    }
    // Check if it's a valid hsl/hsla color
    if (/^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/i.test(color) ||
        /^hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[0-1](\.\d+)?\s*\)$/i.test(color)) {
        return true;
    }
    // Check if it's a valid named color (simple check)
    if (/^[a-z]+$/i.test(color)) {
        return true;
    }
    return false;
}

const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  ({ value, onValueChange,id, className, ...props }, ref) => {
     // Sanitize id to prevent XSS
     const sanitizedId = id.replace(/[^\w-]/g, '');
     
     const handleChangeComplete = (color: { hex: string })=>{
         // Validate color before applying
         if (isValidColor(color.hex)) {
             onValueChange(color.hex);
         } else {
             // If invalid color, use a safe default
             onValueChange('#000000');
         }
     }
    return (
    <Popover>
      <PopoverTrigger asChild>
        <div ref={ref}
          className={cn(
              "relative h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
            )}
           id={sanitizedId}
           {...props}
          >
            <span style={{ 
              backgroundColor: isValidColor(value) ? value : '#000000', 
              width: '15px',
              height: '15px', 
              display:"inline-block", 
              border:"1px solid gray", 
              borderRadius:"4px", 
              marginRight:'10px'
            }}></span>
           {isValidColor(value) ? value : '#000000'}
         </div>
      </PopoverTrigger>
        <PopoverContent className="p-2" >
         <SketchPicker color={isValidColor(value) ? value : '#000000'} onChangeComplete={handleChangeComplete}/>
        </PopoverContent>
    </Popover>
    )
  }
)
ColorPicker.displayName = "ColorPicker"

export { ColorPicker }