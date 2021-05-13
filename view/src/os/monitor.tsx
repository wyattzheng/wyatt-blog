import React, { useState } from "react"

export interface IMonitor{
  display : JSX.Element,
  setDisplay : React.Dispatch<React.SetStateAction<JSX.Element>>
}

export function useMonitor() : IMonitor{
    const [display,setDisplay] = useState(<div></div>);

    return {
      display,
      setDisplay
    }
}
