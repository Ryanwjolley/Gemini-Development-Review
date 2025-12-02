import React from 'react'
import ReactDOM from 'react-dom/client'
import _ from 'lodash'
import { AlertTriangle, Frown, RefreshCw } from 'lucide-react'
import App from './App'
import './index.scss'
import { getState } from './globalState'
import api from './api'
import { watchForAutoReload } from './utils'
import Button from './components/Button'
import ExportRender from './components/ExportRender'

watchForAutoReload({ hours: 12 })

class ErrorHandler extends React.Component {
  constructor() {
    super()

    this.state = {
      hasErrors: false,
    }
  }

  componentDidCatch(e, info) {
    this.setState({ hasErrors: true })

    if (!import.meta.env.VITE_IS_LOCAL) {
      api('/error/send', {
        userId: _.get(getState(), 'user.id'),
        info,
        stack: e.stack,
        location: window.location.href,
      })
    }
  }

  render() {
    if (this.state.hasErrors) {
      return (
        <div className="container mx-auto px-4">
          <div className="mt-3 rounded-lg border border-[var(--danger)] bg-white overflow-hidden">
            <div className="bg-[var(--danger)] text-white px-4 py-3 flex items-center gap-2">
              <AlertTriangle size={20} /> Error
            </div>
            <div className="px-4 py-3">
              <p className="mb-2 flex items-center gap-2">
                Something went wrong. <Frown size={20} />
              </p>
              <p className="mb-3">Please refresh the page and try again.</p>
              <Button
                variant="secondary"
                onClick={() => window.location.reload()}
                className="flex items-center gap-2"
              >
                <RefreshCw size={16} /> Refresh
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

const AppWrapper = () => {
  if (window.location.pathname.startsWith('/export-render')) {
    return <ExportRender />
  }

  return <App />
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <ErrorHandler>
      <AppWrapper />
    </ErrorHandler>
  </React.StrictMode>
)
