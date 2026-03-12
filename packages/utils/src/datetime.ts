export type FormatOptions = Intl.DateTimeFormatOptions

export function formatDateTime(
  datetime: Date | number,
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

  return formater.format(datetime)
}

export function formatDate(
  date: Date | number,
  options: Omit<FormatOptions, 'timeStyle'> = {}
) {
  const {
    dateStyle = 'short',
    timeZone = 'Asia/ShangHai',
    ...restOpts
  } = options

  const formater = new Intl.DateTimeFormat('zh-CN', {
    dateStyle,
    timeZone,
    ...restOpts
  })

  return formater.format(date)
}
