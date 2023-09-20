type Item = {
  components?: Item[]
  name: string
  type: string
}

export function generateType (items: Item[], input: boolean, level: number = 1): string {
  const types = items.reduce((result, value) => {
    return `${result}${'  '.repeat(level)}${value.name}: ${generateParameterType(value.type, input, level, value.components)}\n`
  }, '\n')
  return `{${types}${'  '.repeat(level - 1)}}`
}

function generateParameterType (type: string, input: boolean, level: number, components?: Item[]): string {
  const isArray = type.substring(type.length - 2) === '[]'
  const text = generateParameterSingleType(type, input, level, components)
  return isArray ? `Array<${text}>` : text
}

function generateParameterSingleType (type: string, input: boolean, level: number, components?: Item[]): string {
  if (type.indexOf('bool') === 0)
    return input ? 'boolean' : 'string'

  if (
    type.indexOf('string') === 0 ||
    type.indexOf('bytes') === 0 ||
    type.indexOf('cell') === 0 ||
    type.indexOf('address') === 0
  )
    return 'string'

  if (
    type.indexOf('uint') === 0 ||
    type.indexOf('int') === 0 ||
    type.indexOf('varuint') === 0 ||
    type.indexOf('varint') === 0 ||
    type.indexOf('byte') === 0
  )
    return input ? 'string | number | bigint' : 'string'

  if (type.indexOf('tuple') === 0)
    return generateType(components ?? [], input, ++level)

  if (type.indexOf('map') === 0) {
    type.indexOf(',')
    const value = type.substring(type.indexOf(',') + 1, type.length - 1)
    return `{[key: string | number]: ${generateParameterSingleType(value, input, level, components)}}`
  }

  return 'any'
}