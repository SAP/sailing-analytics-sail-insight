
export const ApiBodyKeys = {
  Id: 'id',
  Name: 'name',
  BoatClass: 'boatClass',
  SailId: 'sailId',
  Color: 'color',
}

export const mapResToBoat = (map: any) => map && ({
  id: map[ApiBodyKeys.Id],
  name: map[ApiBodyKeys.Name],
  sailId: map[ApiBodyKeys.SailId],
  color: map[ApiBodyKeys.Color],
  boatClass: map[ApiBodyKeys.BoatClass],
} as Boat)


export default interface Boat {
  id: string
  name: string
  sailId: string
  color?: string
  boatClass: {
    name: string
    typicallyStartsUpwind: boolean
    hullLengthInMeters: number
    hullBeamInMeters: number
    displayName: string
    iconUrl: string
    aliasNames: string[],
  }
}
