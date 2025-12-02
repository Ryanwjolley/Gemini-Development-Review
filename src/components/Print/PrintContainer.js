import Footer from './Footer'

const logoWidth = '100px'

const Border = () => (
  <>
    <div className="bg-print-header" style={{ height: '3px', width: '100%' }} />
    <div style={{ height: '6px' }} />
    <div className="bg-print-header" style={{ height: '8px', width: '100%' }} />
  </>
)

const PrintContainer = ({
  title,
  logoSrc = '',
  children,
  showHeader,
  showFooter = true,
}) => {
  return (
    <div id="print-container">
      {showHeader && (
        <header>
          {/* <Border /> */}
          <h4 className="flex items-center py-1">
            {/* for later when want to add client's logo */}
            {logoSrc ? (
              <img
                alt="logo"
                className="mt-2 ml-1"
                style={{ width: logoWidth }}
                src={logoSrc}
              />
            ) : (
              <div style={{ width: logoWidth }} />
            )}
            <div className="flex-1 flex justify-center">{title}</div>
            <img
              alt="logo"
              className="ml-auto mt-2 mr-2"
              style={{ width: logoWidth }}
              src="/img/logo192.png"
            />
          </h4>
          <Border />
        </header>
      )}
      <table className="paging">
        <thead>
          <tr>
            <td className={showHeader ? '' : 'hide-header'}>&nbsp;</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{children}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>&nbsp;</td>
          </tr>
        </tfoot>
      </table>

      {showFooter && <Footer />}
    </div>
  )
}

export default PrintContainer
