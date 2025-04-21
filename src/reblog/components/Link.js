import Link from 'next/link'

const CustomLink = ({ href, ...rest }) => {
  const isInternalLink = href && href.startsWith('/')
  const isInternalLink_v2 = href && href.includes(process.env.WEBSITE_URL)
  const isAnchorLink = href && href.startsWith('#')

  if (isInternalLink) {
    return (
      <Link href={href} prefetch={false} {...rest} />
    )
  }

  if (isInternalLink_v2) {
    return (
      <Link href={href.replace(process.env.WEBSITE_URL, '/')} prefetch={false} {...rest} />
    )
  }

  if (isAnchorLink) {
    return <a href={href} {...rest} />
  }

  return <a target="_blank" rel="noopener noreferrer" href={href} {...rest} />
}

export default CustomLink
