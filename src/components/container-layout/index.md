# container-layout 主列表布局组件

![container-layout使用示例](../../../images/container-layout.gif)

## 属性

参数|说明|类型|可选值|默认值
--|--|--|--|--
request | 渲染列表数据的方法。接收页码、查询条数、已有数据三个参数；要求返回 { data: Array, total?: Number}。 | Function | - | -
value | 选中的数据。可以使用v-model代替 | Object\|Array | - | -

## 方法

方法名|说明|参数
--|--|--
refresh | 触发重新渲染。参数默认不传，如果需要保持当前分页条件，需要传参{keep: Boolean}  | {keep?: Boolean}

## 事件

事件名称 |说明|回调参数
--|--|--
select | 选中项发生改变后触发 | 选中的数据，类型和value属性的类型一致

## 插槽

name|说明
--|--
btns | 按钮组
form | 表单元素 el-form-item 
table | 表格列 el-table-column

## 使用示例

```html
<template>
  <container-layout v-model="select" :request="request_data">
    <!-- 按钮组 -->
    <template v-slot:btns>
      <el-button-group>
        <icon name="add" title="新增" />
      </el-button-group>
    </template>
    <!-- 筛选表单 -->
    <template v-slot:form>
      <el-form-item label="单据编号:">
        <el-input v-model="form.name" style="width:150px" />
      </el-form-item>
    </template>
    <!-- 表格 -->
    <template v-slot:table>
      <el-table-column
        prop="doccode"
        label="doccode"
        width="180"
      >
        <template slot-scope="scope">
          <el-link type="primary" @click="click_link">{{ scope.row.doccode }}</el-link>
        </template>
      </el-table-column>
    </template>
  </container-layout>
</template>
```

```js
export default {
  data() {
    return {
      form: {
        name: ''
      },
      select: []
    }
  },
  methods: {
    request_data(page_no, page_size, data) {
      // TO request data
      return {
        data: [{
          name: '张三',
          doccode: 1
        }, {
          name: '李四',
          doccode: 2
        }],
        total: 2
      }
    },
    click_link(data) {
      console.log(data)
    }
  }
}
```
