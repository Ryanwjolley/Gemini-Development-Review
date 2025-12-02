// thanks https://templates.mailchimp.com/development/css/reset-styles/
const _ = require('lodash')
const baseUrl = process.env.JDE_URL

const css = `
  <style type="text/css">
    body {
      margin:0;
      padding:0;
    }

    img {
      border:0 none;
      height:auto;
      line-height:100%;
      outline:none;
      text-decoration:none;
    }

    a img {
      border:0 none;
    }

    .imageFix {
      display:block;
    }

    table, td {
      border-collapse:collapse;
    }

    #body-table {
      height:100% !important;
      margin:0;
      margin-top: 1rem;
      padding:0;
      width:100% !important;
    }

    .text-right {
      text-align: right;
    }
    .border-none {
      border: none !important;
    }
    table.data-table {
      width:100%;
    }
    table.data-table td {
      border: solid black 1px;
      padding: 5px;
    }
    .w-100 {
      width:100%
    }
  </style>
`

const linkBtn = ({
  href = '',
  text = '',
  backgroundColor = 'rgb(60, 111, 159)',
  color = 'white',
}) => {
  // thanks guys: https://www.litmus.com/blog/a-guide-to-bulletproof-buttons-in-email-design/
  const style = _.map(
    {
      'font-size': '18px',
      'font-family': 'Lato, Arial, sans-serif',
      color,
      'text-decoration': 'none',
      'border-radius': '5px',
      padding: '12px 18px',
      border: `1px solid ${backgroundColor}`,
      display: 'inline-block',
    },
    (val, key) => `${key}:${val}`
  ).join(';')

  return `
    <table border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="background-color: ${backgroundColor}">
          <a href="${href}" style="${style}">${text}</a>
        </td>
      </tr>
    </table>
  `
}

// gotta use width & height attributes, cuz outlook seems to ignore css width/height
const footer = `
  <div><img src="${`${baseUrl}/img/jed-non-professional.png`}" style="width:100px;height:74px;" width="100" height="74"></div>
`

const emailBody = children => `
  <html>
    <head>${css}</head>
    <body>
    <table cellpadding="0" cellspacing="0" align="center" id="body-table">
      <tr>
        <td valign="top" style="vertical-align:top;">
          ${children}
          <br/>
          ${footer}
        </td>
      </tr>
    </table>
    </body>
  </html>
`
module.exports = {
  css,
  linkBtn,
  footer,
  emailBody,
}
