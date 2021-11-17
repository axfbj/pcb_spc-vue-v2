export function debounce(func, wait) {
  let timeout = ''
  return (v) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      func(v)
    }, wait)
  }
}

export function unique_obj(arr, key) {
  const res = new Map()
  return arr.filter((item) => !res.has(item[key]) && res.set(item[key], 1))
}
