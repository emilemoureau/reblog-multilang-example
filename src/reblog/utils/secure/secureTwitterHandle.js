const secureTwitterHandle = (url) => {
  return url.replaceAll("@", "").replaceAll("https://twitter.com/", "").replaceAll("https://www.twitter.com/").replaceAll("undefined", "").replaceAll("/", "")
}

export { secureTwitterHandle };