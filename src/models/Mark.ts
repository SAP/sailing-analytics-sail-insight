
export const ApiBodyKeys = {
  Name: 'name',
  Id: 'id',
  Class: '@class',
  Position: 'position',
}

export const mapResToMark = (map: any) => map && ({
  id: map[ApiBodyKeys.Id],
  name: map[ApiBodyKeys.Name],
  class: map[ApiBodyKeys.Class],
  position: map[ApiBodyKeys.Position],
} as Mark)


export default interface Mark {
  id: string
  name: string
  class: string
  position?: string
}
