export interface WSelectorProps{
    onChange:(event:any)=>void;
    className:string,
    list:{key:string,value:string}[];
    defaultValue:string;
}

export function WSelector(props:WSelectorProps){

    const options = []

    for(const {key,value} of props.list){
        options.push(<option key={key} value={key}>{value}</option>)
    }
    return <select className={props.className} onChange={props.onChange} style={{
        "display":"block",
        "border": 0,
        "outline": 0,
        "color": "#FFF",
        "background": "#444",
        "fontSize": "26px",
        "borderRadius": "3px",
        "letterSpacing": "2px",
        "fontWeight": 900,
        "fontFamily": "Merriweather, Georgia, serif",
    }} defaultValue={props.defaultValue}>{options}</select>
}