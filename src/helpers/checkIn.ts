export const doesCheckInContainBinding = (checkIn: any) =>
  checkIn.competitorId || checkIn.markId || checkIn.boatId
