export type FormatOptions = Intl.DateTimeFormatOptions

export function formatDateTime(
  date: Date | number,
  options: FormatOptions = {}
) {
  const {
    dateStyle = 'short',
    timeStyle = 'medium',
    timeZone = 'Asia/ShangHai',
    ...restOpts
  } = options

  const formater = new Intl.DateTimeFormat('zh-CN', {
    dateStyle,
    timeStyle,
    timeZone,
    ...restOpts
  })

  return formater.format(date)
}
