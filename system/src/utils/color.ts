import * as ColorThief from "colorthief";
import * as Color from "color";


export async function GetPictureColor(img_url:string,default_color:string = "#000000"){
    const palettes = await ColorThief.getPalette(img_url);
    for(const color_value of palettes){
        const color = Color.rgb(color_value);
        if(color.gray() >= 0.5)
            return color;
    }
    return Color(default_color);
}