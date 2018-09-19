export const ApiBodyKeys = {
  Races: 'races',
  BoatClass: 'boatclass',
}

export const mapResToRegatta = (map: any) => map && ({
  races: map[ApiBodyKeys.Races],
  boatClass: map[ApiBodyKeys.BoatClass],
} as Regatta)


export default interface Regatta {
  races?: string[],
  boatClass?: string,
}

