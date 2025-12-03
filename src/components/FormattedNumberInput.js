import { numberFormats } from '@shared'
import _ from 'lodash'
import { NumericFormat } from 'react-number-format'

const FormattedNumberInput = ({
  numberFormat = numberFormats.number,
  onChange = _.noop,
  value,
  decimals = 0,
  fixedDecimalScale = true,
  disabled,
  ...props
}) => {
  const isPercent = numberFormat === numberFormats.percent
  const isCurrency = numberFormat === numberFormats.currency

  return (
    <NumericFormat
      {...props}
      disabled={disabled}
      {...{
        ...(isCurrency && { prefix: '$' }),
        ...(isPercent && { suffix: '%' }),
      }}
      thousandSeparator={numberFormat !== numberFormats.unformatted}
      decimalScale={decimals}
      fixedDecimalScale={fixedDecimalScale}
      value={
        isPercent
          ? _.isFinite(value)
            ? value * 100
            : ''
          : _.isFinite(value)
          ? value
          : ''
      }
      onValueChange={({ floatValue }) => {
        if (disabled) return
        // see https://s-yadav.github.io/react-number-format/docs/props/#onvaluechange-values-sourceinfo--
        onChange(
          isPercent
            ? _.isUndefined(floatValue)
              ? ''
              : floatValue / 100
            : _.isFinite(floatValue)
            ? floatValue
            : ''
        )
      }}
    />
  )
}

export default FormattedNumberInput
