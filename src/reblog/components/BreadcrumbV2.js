import Link from 'next/link'

const BreadcrumbV2 = ({
  items_breadcrumb
}) => {
  return (
    <nav className="flex py-3" aria-label="Breadcrumb">
      <ol className="inline-flex items-center">
        {
          items_breadcrumb.map((element, index) => {
            if (!element) return;
            
            if (element.link) {
              return (
                <li key={`breadcrumb-item-${index}`} className="flex items-center">
                  {element.sep && (
                    <span className="mx-2 text-gray-400">/</span>
                  )}
                  <Link href={element.link} prefetch={false}>
                    <a className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                      {element.title}
                    </a>
                  </Link>
                </li>
              )
            }

            if (element.final) {
              return (
                <li aria-current="page" key={`breadcrumb-item-${index}`} className="flex items-center">
                  {element.sep && (
                    <span className="mx-2 text-gray-400">/</span>
                  )}
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {element.title}
                  </span>
                </li>
              )
            }

            return (
              <li key={`breadcrumb-item-${index}`} className="flex items-center">
                {element.sep && (
                  <span className="mx-2 text-gray-400">/</span>
                )}
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {element.title}
                </span>
              </li>
            )
          })
        }
      </ol>
    </nav>
  )
}

BreadcrumbV2.defaultProps = {
  items_breadcrumb: []
}

export default BreadcrumbV2