export function filterKeyArr(arr: [], isArr: [], conversationIDKey: string) {
  const conversationIDs = arr.map(
    item => item[conversationIDKey],
  )
  const filterIsArr = isArr.filter(
    v => !conversationIDs.includes(v[conversationIDKey]),
  )
  const conversationList = [...arr, ...filterIsArr]
  return conversationList
}
