const PageHeader = ({ title, description, actions, children }) => {
  if (children) {
    // Legacy support for children-based usage
    return (
      <h4 className="mb-3 flex items-center" style={{ minHeight: 38 }}>
        {children}
      </h4>
    )
  }

  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && (
          <p className="mt-2 text-sm text-gray-600">{description}</p>
        )}
      </div>
      {actions && (
        <div className="ml-4 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}

export default PageHeader
