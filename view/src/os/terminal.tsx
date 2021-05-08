import React, { useState } from "react"

export interface ITerminal{
    visible:boolean;
    setVisible : React.Dispatch<React.SetStateAction<boolean>>;
}

export function useTerminal() : ITerminal{
    const [termVisible,setTermVisible] = useState(true);

    return {
        visible:termVisible,
        setVisible:setTermVisible
    }
}
