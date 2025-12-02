import { Component } from 'react'

export default class ExportErrorHandler extends Component {
  constructor() {
    super()

    this.state = {
      error: null,
      errorInfo: null,
    }
  }

  componentDidCatch(error, errorInfo) {
    console.log({ error, errorInfo })
    this.setState({ error, errorInfo })
  }

  render() {
    const { error, errorInfo } = this.state
    if (error) {
      return (
        <div id="export-ready-for-print">
          <div id="export-error-container">
            {JSON.stringify({
              message: error.message,
              stack: error.stack,
              errorInfo,
            })}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
