import "./navigator.css";

export interface NavItem{
    title:string;
    url:string;
}

export interface NavigatorProps{
    list:NavItem[];
    className?:string;
}

export function Navigator(props: NavigatorProps){

    const nodes = [];
    for(const [key,item] of props.list.entries()){
        nodes.unshift(
            <a href={item.url} key={key} className="navigator_item">
                {item.title}
            </a>
        );
    }

    return (
        <div className={`navigator_container ${props.className || ""}`}>
            <div className="navigator_middlearea">
                {nodes}
            </div>
        </div>
    );
}