<script>
const httpUrl = 'http://127.0.0.1:8081/api/wisdom'
const formatTimer = function (value) {
  if (value === null) {
    return ''
  }
  let date = new Date(value)
  let y = date.getFullYear()
  let MM = date.getMonth() + 1
  MM = MM < 10 ? '0' + MM : MM
  let d = date.getDate()
  d = d < 10 ? '0' + d : d
  let h = date.getHours()
  h = h < 10 ? 0 + h : h
  let m = date.getMinutes()
  m = m < 10 ? 0 + m : m
  return y + '-' + MM + '-' + d + ' ' + h + ':' + m
}

export default {
  httpUrl,
  formatTimer
}
</script>
