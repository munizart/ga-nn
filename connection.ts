import { ValueFrom } from "../types/ValueFrom";
import { range } from "../rand/rand";

let innovation = 0

export interface Connection {
  from: number
  to: number

  innovation: number
  enabled: boolean
  weight: number
}

export const connectionMutations : ['MOD_WEIGHT'] = ['MOD_WEIGHT']

export type ConnectionMutation = ValueFrom<typeof connectionMutations>
export function mutateConnection (mutation: ConnectionMutation, connection: Connection) {

  if (mutation === 'MOD_WEIGHT') {
    return {
      ...connection,
      weight: connection.weight + range(-1, 1)
    }
  }

  throw TypeError(`Unsuported connection mutation: ${mutation}`)
}

export function Connection (from: number, to: number, enabled: boolean) : Connection {
  return {
    enabled,
    from,
    to,
    innovation: innovation++,
    weight: range(-1, 1),
  }
}