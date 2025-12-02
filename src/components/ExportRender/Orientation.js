const pageWidth = 1440

const Orientation = ({ landscape, children }) => {
  if (!landscape) {
    return children
  }

  return (
    <div>
      <div>
        <div
          style={{
            width: pageWidth,
            transform: 'rotate(90deg) translateX(100%)',
            transformOrigin: 'top right',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default Orientation
