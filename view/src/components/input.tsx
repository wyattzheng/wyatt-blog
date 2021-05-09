export interface WInputProps{
    onChange:(event:any)=>void;
    defaultValue:string;
    placeholder:string;
    className:string;
}

export function WInput(props:WInputProps){

    return <input className={props.className} placeholder={props.placeholder} defaultValue={props.defaultValue} onChange={props.onChange} style={{
        "border": 0,
        "outline": 0,
        "color": "#FFF",
        "background": "#444",
        "fontSize": "26px",
        "borderRadius": "3px",
        "letterSpacing": "2px",
        "fontWeight": 900,
        "fontFamily": "Merriweather, Georgia, serif",
    }} />
}