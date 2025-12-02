import _ from 'lodash'
import { createRoot } from 'react-dom/client'
import { AlertCircle } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'

const alertContainer = document.createElement('div')
document.body.appendChild(alertContainer)

// Create persistent root instance for React 19 compatibility
const root = createRoot(alertContainer)

const update = () => {
  alerts = alerts.filter(a => !_.includes(hiddenAlerts, a.id))

  root.render(
    alerts.map(alertProps => {
      const {
        body,
        type,
        title,
        okBtnText,
        cancelBtnText,
        id,
        onClose,
        onCancel,
        maxWidth,
        minContentHeight,
        containerStyle,
        darkerBackground,
      } = alertProps
      const isConfirm = type === 'confirm'
      const hide = () => {
        hideAlert(id)
        onClose()
      }
      const onConfirm = () => {
        alertProps.onConfirm()
        hide()
      }

      let renderedBody

      if (_.isString(body)) {
        renderedBody = body.split('\n').map((t, i) => <div key={i}>{t}</div>)
      } else if (_.isFunction(body)) {
        renderedBody = body(hide)
      } else {
        renderedBody = body
      }

      return (
        <Modal
          key={id}
          isOpen
          title={title || <AlertCircle size={20} />}
          onClose={hide}
          maxWidth={maxWidth}
          minContentHeight={minContentHeight}
          containerStyle={containerStyle}
          body={<div>{renderedBody}</div>}
          darkerBackground={darkerBackground}
          footer={
            <div>
              {isConfirm && (
                <Button
                  variant="danger"
                  onClick={() => {
                    hide()
                    if (onCancel) {
                      onCancel()
                    }
                  }}
                >
                  {cancelBtnText}
                </Button>
              )}
              <Button
                variant="success"
                className="ml-2"
                onClick={isConfirm ? onConfirm : hide}
              >
                {okBtnText}
              </Button>
            </div>
          }
        />
      )
    })
  )

  hiddenAlerts = []
}

let alerts = []
let hiddenAlerts = []
const addAlert = alertProps => {
  alerts = alerts.concat({ id: _.uniqueId(), ...alertProps })
  update()
}
const hideAlert = id => {
  hiddenAlerts.push(id)
  update()
}
const defaultProps = {
  body: '',
  type: 'alert',
  title: null, // Will be set in the component
  okBtnText: 'OK',
  cancelBtnText: 'Cancel',
  onConfirm: () => null,
  onClose: () => null,
  onCancel: () => {},
  maxWidth: '450px',
  containerStyle: {},
  darkerBackground: false,
}

export const alert = p =>
  addAlert({
    ...defaultProps,
    ...p,
  })
export const confirm = p =>
  addAlert({
    ...defaultProps,
    type: 'confirm',
    ...p,
  })

export const hide = hideAlert

window.alerty = alert
