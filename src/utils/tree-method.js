export function getTreePath(currentNodeData, tree) {
  // const tree = this.$refs.checkbox_tree2
  // const currentNode = this.getCurrentNode()
  const arr = [currentNodeData.groupName]
  const arr2 = [currentNodeData.id]
  const getName = (key) => {
    if (key === '0') return arr.reverse().join('/')
    const node = tree.getNode(key)
    arr.push(node.data.groupName)
    return getName(node.data.parentId)
  }
  const getId = (key) => {
    if (key === '0') return arr2.reverse().join('/')
    const node = tree.getNode(key)
    arr2.push(node.data.id)
    return getId(node.data.parentId)
  }
  // console.log('getId', getId(currentNode.parentId))
  const path = `${getId(currentNodeData.parentId)}`
  const pathStr = `/${getName(currentNodeData.parentId)}`
  return { pathStr, path }
}

/**
 *
 * @param {Array} arrs 树形数据
 * @param {string} childs 树形数据子数据的属性名,常用'children'
 * @param {Array} attrArr 需要提取的公共属性数组(默认是除了childs的全部属性)
 * @returns
 */
export function extractTree(arrs, childs, attrArr) {
  let attrList = []
  if (!Array.isArray(arrs) && !arrs.length) return []
  if (typeof childs !== 'string') return []
  if (!Array.isArray(attrArr) || Array.isArray(attrArr) && !attrArr.length) {
    attrList = Object.keys(arrs[0])
    attrList.splice(attrList.indexOf(childs), 1)
  } else {
    attrList = attrArr
  }
  const list = []
  const getObj = (arr) => {
    arr.forEach(function(row) {
      const obj = {}
      attrList.forEach(item => {
        obj[item] = row[item]
      })
      list.push(obj)
      if (row[childs]) {
        getObj(row[childs])
      }
    })
    return list
  }
  return getObj(arrs)
}

