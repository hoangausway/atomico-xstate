import { h, useEffect, useState, useMemo } from 'atomico'
import { interpret } from 'xstate'
/*
  A quick and dirty hook
*/
export const useMachine = machine => {
  const [state, setState] = useState(machine.initialState)
  const service = useMemo(() => interpret(machine).onTransition(setState), [
    machine
  ])
  useEffect(() => {
    service.start()
    return () => service.stop()
  }, [])
  return [state, service.send]
}
