import { ValueFrom } from "../types/ValueFrom";
import { range } from "../rand/rand";

let globalInnovation = 0

const innovationMap = new Map<string, number>()

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
      weight: connection.weight + range(-0.3, 0.3)
    }
  }

  throw TypeError(`Unsuported connection mutation: ${mutation}`)
}

export function Connection (from: number, to: number, enabled: boolean) : Connection {
  const tag = `${from}->${to}`
  let innovation
  if (innovationMap.has(tag)) {
    innovation = innovationMap.get(tag) as number
  } else {
    innovation = globalInnovation++
    innovationMap.set(tag, innovation)
  }
  return {
    enabled,
    from,
    to,
    innovation,
    weight: range(-1, 1),
  }
}