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

const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  ({ value, onValueChange,id, className, ...props }, ref) => {
     const handleChangeComplete = (color:any)=>{
         onValueChange(color.hex);
     }
    return (
    <Popover>
      <PopoverTrigger asChild>
        <div ref={ref}
          className={cn(
              "relative h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
            )}
           {...props}
          >
            <span style={{ backgroundColor: value, width: '15px',height: '15px', display:"inline-block", border:"1px solid gray", borderRadius:"4px", marginRight:'10px'}}></span>
           {value}
         </div>
      </PopoverTrigger>
        <PopoverContent className="p-2" >
         <SketchPicker color={value} onChangeComplete={handleChangeComplete}/>
        </PopoverContent>
    </Popover>
    )
  }
)
ColorPicker.displayName = "ColorPicker"

export { ColorPicker }