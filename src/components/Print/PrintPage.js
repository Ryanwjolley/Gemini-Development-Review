const PrintPage = ({ title = '', children }) => {
  return (
    <div className="w-full" style={{ pageBreakAfter: 'always' }}>
      {/* if you don't do row/col stuff then any follow PrintPages look very cockeyed, probably cuz of elements flowing outside boundary and causing wrapping oddities */}
      <div className="flex flex-wrap -mx-2">
        <div className="flex-1 px-0">
          {title && (
            <div>
              <h5 className="text-center">{title}</h5>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}

export default PrintPage
