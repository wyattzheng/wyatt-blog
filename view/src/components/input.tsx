export interface WInputProps{
    onChange:(event:any)=>void;
    defaultValue:string;
}

export function WInput(props:WInputProps){

    return <input defaultValue={props.defaultValue} onChange={props.onChange} style={{
        "height":"40px",
        "border": 0,
        "outline": 0,
        "maxWidth": "500px",
        "color": "#FFF",
        "background": "#444",
        "padding": "5px",
        "fontSize": "26px",
        "borderRadius": "3px",
        "letterSpacing": "2px",
        "fontWeight": 900,
        "fontFamily": "Merriweather, Georgia, serif",
        "paddingLeft": "10px",
        "paddingRight": "10px",
    }} />
}