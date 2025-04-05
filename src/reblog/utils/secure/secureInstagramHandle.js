const secureInstagramHandle = (url) => {
  return url.replaceAll("@", "").replaceAll("https://instagram.com/", "").replaceAll("https://www.instagram.com/").replaceAll("undefined", "").replaceAll("/", "")
}

export { secureInstagramHandle };