# 算法基础-排序

## 冒泡排序

时间复杂度 `O(N2)`，空间复杂度 `O(1)`，稳定排序

```ts
function bubbleSort(arr: number[]) {
  const n = arr.length
  for (let i = 0; i < n; i++) {
    let exchange = false
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        exchange = true
      }
    }
    if (exchange === false) {
      break
    }
  }
  return arr
}
```

## 插入排序

时间复杂度 `O(N2)`，空间复杂度 `O(1)`，稳定排序

```ts
function insertSort(arr: number[]) {
  const n = arr.length
  for (let i = 1; i < n; i++) {
    const temp = arr[i]
    let j = i - 1
    while (j >= 0 && arr[j] > temp) {
      arr[j + 1] = arr[j]
      j -= 1
    }
    arr[j + 1] = temp
  }
  return arr
}
```

## 二分插入排序

时间复杂度 `O(N2)`，空间复杂度 `O(1)`，稳定排序

```ts
function binaryInsertSort(arr: number[]) {
  const binarySearch = (end: number, value: number) => {
    let l = 0
    let r = end - 1
    while (l <= r) {
      const m = l + Math.floor((r - l) / 2)
      if (arr[m] <= value) {
        // ✨为了保持稳定性，如果值相等，则返回m右边界
        l = m + 1
      } else {
        r = m - 1
      }
    }
    return l < end ? l : -1
  }

  const n = arr.length
  for (let i = 1; i < n; i++) {
    const value = arr[i]
    const insertIndex = binarySearch(i, value)
    if (insertIndex === -1) {
      continue
    }
    let j = i
    while (j > insertIndex) {
      arr[j] = arr[j - 1]
      j -= 1
    }
    arr[insertIndex] = value
  }
  return arr
}
```

## 希尔排序

时间复杂度 `O(NlogN)`，空间复杂度 `O(1)`，不稳定排序

```ts
function shellSort(arr: number[]) {
  const n = arr.length
  let gap = Math.floor(n / 2)

  while (gap > 0) {
    for (let i = gap; i < n; i++) {
      const temp = arr[i]
      let j = i

      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap]
        j -= gap
      }
      arr[j] = temp
    }
    gap = Math.floor(gap / 2)
  }

  return arr
}
```

## 选择排序

时间复杂度 `O(N2)`，空间复杂度 `O(1)`，不稳定排序

```ts
function selectSort(arr: number[]) {
  const n = arr.length
  for (let i = 0; i < n; i++) {
    let minIndex = i
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j
      }
    }
    if (minIndex !== i) {
      ;[arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
    }
  }
  return arr
}
```

## 快速排序

时间复杂度 `O(NlogN)`，空间复杂度 `O(logN)`，不稳定排序

```ts
function quickSort(arr: number[]) {
  const division = (left: number, right: number) => {
    const base = arr[left]
    while (left < right) {
      while (left < right && arr[right] >= base) {
        right -= 1
      }
      arr[left] = arr[right]
      while (left < right && arr[left] <= base) {
        left += 1
      }
      arr[right] = arr[left]
    }
    arr[left] = base
    return left
  }

  const core = (left: number, right: number) => {
    if (left < right) {
      const baseIndex = division(left, right)
      core(left, baseIndex - 1)
      core(baseIndex + 1, right)
    }
  }

  core(0, arr.length - 1)
  return arr
}
```

## 归并排序

时间复杂度 `O(Nlog2N)`，空间复杂度 `O(Nlog2N)`，稳定排序

```ts
function mergeSort(arr: number[]) {
  const n = arr.length
  const temp = new Array(n).fill(0)

  function merge(left: number, mid: number, right: number) {
    let i = left
    let j = mid
    let k = 0

    while (i < mid && j < right) {
      if (arr[i] <= arr[j]) {
        temp[k] = arr[i++]
      } else {
        temp[k] = arr[j++]
      }
      k += 1
    }
    while (i < mid) {
      temp[k++] = arr[i++]
    }
    while (j < right) {
      temp[k++] = arr[j++]
    }

    k = 0
    while (left < right) {
      arr[left++] = temp[k++]
    }
  }

  function core(left: number, right: number) {
    if (left >= right - 1) return
    const mid = left + Math.floor((right - left) / 2)
    core(left, mid)
    core(mid, right)
    merge(left, mid, right)
  }

  core(0, n)
  return arr
}
```

## 测试

```ts
function test() {
  const arr1 = [64, 34, 25, 12, 22, 11, 90]
  console.log('随机排序-排序前:', arr1)
  console.log('冒泡排序:', bubbleSort(arr1))
  console.log('插入排序:', insertSort(arr1))
  console.log('二分插入排序:', binaryInsertSort(arr1))
  console.log('选择排序:', selectSort(arr1))
  console.log('快速排序:', quickSort(arr1))
  console.log('归并排序:', mergeSort(arr1))
  console.log('-------------------- 分 割 线 --------------------')

  const arr2 = [11, 22, 25, 34, 64, 90]
  console.log('正序排序-排序前:', arr2)
  console.log('冒泡排序:', bubbleSort(arr2))
  console.log('插入排序:', insertSort(arr2))
  console.log('二分插入排序:', binaryInsertSort(arr2))
  console.log('选择排序:', selectSort(arr2))
  console.log('快速排序:', quickSort(arr2))
  console.log('归并排序:', mergeSort(arr2))
  console.log('-------------------- 分 割 线 --------------------')

  const arr3 = [90, 64, 34, 25, 22, 11]
  console.log('逆序排序-排序前:', arr3)
  console.log('冒泡排序:', bubbleSort(arr3))
  console.log('插入排序:', insertSort(arr3))
  console.log('二分插入排序:', binaryInsertSort(arr3))
  console.log('选择排序:', selectSort(arr3))
  console.log('快速排序:', quickSort(arr3))
  console.log('归并排序:', mergeSort(arr3))
}

// 随机排序-排序前: [64, 34, 25, 12, 22, 11, 90]
// 冒泡排序: [11, 12, 22, 25, 34, 64, 90]
// 插入排序: [11, 12, 22, 25, 34, 64, 90]
// 二分插入排序: [11, 12, 22, 25, 34, 64, 90]
// 选择排序: [11, 12, 22, 25, 34, 64, 90]
// 快速排序: [11, 12, 22, 25, 34, 64, 90]
// 归并排序: [11, 12, 22, 25, 34, 64, 90]
// ---------------- 分 割 线 --------------------
// 正序排序-排序前: [11, 22, 25, 34, 64, 90]
// 冒泡排序: [11, 22, 25, 34, 64, 90]
// 插入排序: [11, 22, 25, 34, 64, 90]
// 二分插入排序: [11, 22, 25, 34, 64, 90]
// 选择排序: [11, 22, 25, 34, 64, 90]
// 快速排序: [11, 22, 25, 34, 64, 90]
// 归并排序: [11, 22, 25, 34, 64, 90]
// ---------------- 分 割 线 --------------------
// 逆序排前: [90, 64, 34, 25, 22, 11]
// 冒泡排序: [11, 22, 25, 34, 64, 90]
// 插入排序: [11, 22, 25, 34, 64, 90]
// 二分插入排序: [11, 22, 25, 34, 64, 90]
// 选择排序: [11, 22, 25, 34, 64, 90]
// 快速排序: [11, 22, 25, 34, 64, 90]
// 归并排序: [11, 22, 25, 34, 64, 90]
```
