export interface WButtonProps{
    onClick:(event:any)=>void;
    title:string;
    className:string;
}

export function WButton(props:WButtonProps){

    return <input type="button" className={props.className} value={props.title} onClick={props.onClick} style={{
        "border": 0,
        "outline": 0,
        "color": "#FFF",
        "background": "#555",
        "borderRadius": "3px",
        "letterSpacing": "2px",
        "fontWeight": 900,
        "fontFamily": "Merriweather, Georgia, serif",
    }}></input>
}