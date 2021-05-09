import "./container.css";


export function WContainer(props : any){
    return (<div className={`middlecontainer ${props.className || ""}`}>
        {props.children}
    </div>);
}