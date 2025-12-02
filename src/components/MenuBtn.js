import Sidebar from './Sidebar'
import Button from './Button'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

const MenuBtn = () => {
  const [showSidebar, setShowSidebar] = useState(false)
  const toggleSidebar = () => setShowSidebar(!showSidebar)
  return (
    <>
      <div
        style={{
          position: 'fixed',
          bottom: '25px',
          right: '25px',
          zIndex: 1000,
        }}
      >
        <Button
          variant="success"
          size="lg"
          className="rounded-full shadow-lg"
          onClick={toggleSidebar}
        >
          {showSidebar ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>
      {showSidebar && (
        <>
          <Sidebar sidebarWidth={300} />
          <div
            className="fixed top-0 left-0 w-screen h-screen"
            style={{ backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 999 }}
            onClick={() => setShowSidebar(false)}
          ></div>
        </>
      )}
    </>
  )
}
export default MenuBtn
