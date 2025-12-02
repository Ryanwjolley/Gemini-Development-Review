import { useGlobalState } from '../globalState'
import { useWindowDimensions } from '../utils'
import { Menu } from 'lucide-react'

const AppHeader = ({ toggleSidebar, title }) => {
  const { sidebarWidth } = useGlobalState()
  const { smallScreen } = useWindowDimensions()

  return (
    <div
      className="bg-white border-b border-gray-200 p-2 flex items-center justify-between"
      style={{
        position: 'fixed',
        top: 0,
        left: smallScreen ? 0 : sidebarWidth,
        right: 0,
        zIndex: 100,
        transition: 'left 0.3s ease',
      }}
    >
      <div className="flex items-center gap-2">
        {toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors outline-none"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
        )}
        <h1 className="text-xl font-semibold text-gray-900 m-0">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        {/* Actions slot for future use */}
      </div>
    </div>
  )
}

export default AppHeader
