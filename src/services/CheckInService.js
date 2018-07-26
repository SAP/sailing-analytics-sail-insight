import querystring from 'querystring'

const extractData = (url) => {
  if (!url) {
    return undefined
  }
  console.log(querystring)
}

export default {
  extractData,
}
