import { CHECK_IN_REDUCER_NAME } from 'reducers'


export const getCheckInData = state => state?.[CHECK_IN_REDUCER_NAME]?.data
