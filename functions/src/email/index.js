const sgMail = require('@sendgrid/mail')
// const templates = {}

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const textOnly = html => html.replace(/<[^>]*>?/gm, '') // good idea, simple. thanks https://stackoverflow.com/questions/822452/strip-html-from-text-javascript
// TEMPLATE_TODO - update email address - maybe could put in config
const defaultFromAddress = 'Notification <notification@example.org>'
const sendEmail = ({
  to,
  from = defaultFromAddress,
  subject,
  html,
  attachments = undefined,
}) => {
  const msg = {
    to,
    from,
    subject,
    text: textOnly(html),
    html,
    attachments,
  }

  // console.log('sendEmail', msg)
  // require('fs').writeFileSync(`test-email-to-${subject}.html`, msg.html)
  if (process.env.JDE_ENV === 'dev') {
    console.log('skipping dev sendEmail', subject)
    return Promise.resolve()
  }
  return sgMail.send(msg).catch(err => {
    const respErrors = err?.response?.body?.errors
    if (respErrors) {
      console.error('sgMail send error', respErrors)
      throw new Error('sgMail send error')
    }
    throw err
  })
}

// const sendMultipleEmailsFromTemplate = ({
//   from = defaultFromAddress,
//   template,
//   props,
//   recipients, // [{ name: 'Bob', email: 'bob@jonesanddemille.com' }]
// }) => {
//   if (!recipients.length) return Promise.resolve()

//   const messages = recipients.map(recip => {
//     const { email } = recip
//     const combinedProps = { ...props, ...recip }
//     const { subject, html } = templates[template](combinedProps)

//     return {
//       to: email,
//       from,
//       subject,
//       text: textOnly(html),
//       html,
//     }
//   })

//   // for testing
//   // messages = messages.filter(m => m.to === 'chevadams@gmail.com')
//   // messages.forEach((m, i) => {
//   //   require('fs').writeFileSync(`test-email-${i}.html`, m.html)
//   // })
//   return sgMail.send(messages)
// }

module.exports = {
  sendEmail,
}
