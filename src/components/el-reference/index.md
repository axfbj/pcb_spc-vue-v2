# el-reference 引用数据(表单元素)

![el-reference使用示例](../../../images/el-reference.gif)

## 属性

参数|说明|是否必填|类型|可选值|默认值
--|:--|--|--|--|--
type | 引用类型 | 是 | String | `IType` | -
value | 选中的数据,通过数据Object或Array来决定是否开启多选 | 是 | Object\|\|Array | -       | -
disabled | 是否禁用。自动和外层的el-form标签的disabled状态保持一致 | 否 | Boolan | - | -
title | 用于弹框的title名称 | 否 | String | - | -
extra | 其他所需要的定制参数 | 否 | Object | - | -

IType 类型

type| 说明 | extra特殊参参数说明 | 返回值类型
--|--|--|--
select-factory | 选择工厂 |  | { doccode: '工厂id', factory_no: '工厂编号', factory_name: '工厂名称'}
select-insurm | 选择保险 | {code：'用于接口的标识符'，whole：'是否开启下拉全部选项' } | { doccode: '保险id', para_code: '保险编号', para_desc: '保险名称'}
select-warehouse | 选择仓库 | | { doccode: '仓库id', warehouse_no: '仓库编号', warehouse_name: '仓库名称'}
select-audited-goods | 选择已审核物品 | | {doccode: '物品id', goods_no: '物品编号', goods_name: '物品名称', goods_unit: '物品单位', goods_description: '物品规格',  stores_code: '仓库编号', stores_name: '仓库名称'}
select-goods | 选择物品 | | { doccode: '物品id', goods_no: '物品编号', goods_name: '物品名称', goods_unit: '物品单位', goods_description: '物品规格'}
select-staff | 选择经办人 \|\|选择员工 | | { doccode: '员工id', staff_no: '员工编号', staff_name: '员工名称',dept_name: '部门名称',position: '职位',position_level: '职位等级',station_name:'职务',group_name:'工厂',factoryno:'工厂doccode'}
select-dormitory-building-no | 选择宿舍楼号 | | { doccode: '宿舍楼id', build_code: '宿舍楼编号', build_name: '宿舍楼名称'}
select-dormitory-floor | 选择宿舍楼层 | | { doccode: '宿舍楼层id', para_code: '宿舍楼层编号', para_desc: '宿舍楼层'}
select-dormitory-type | 选择宿舍类型 | | { doccode: '宿舍类型id', room_roomcode: '宿舍类型编号', room_roomtype: '宿舍类型'}
select-category | 选择宿舍楼层 | | { doccode: '宿舍楼层id', para_code: '编码', para_desc: '名称'}
select-salsry | 薪资等级 | | { doccode: '宿舍楼层id', sagra_code: '编码', sagra_desc: '名称'}

## 事件

事件名称 |说明|回调参数
--|--|--
change | 选中项发生改变后触发 | 选中的数据
open-dialog | 自定义按钮点击事件，触发弹框应用于验证等操作 | 无

## 输入框选择使用示例

```html
<el-form ref="form" :model="form" :rules="rules" :disabled="form.flag === 'view'">
    <el-form-item label="审核流工厂：" prop="factory_data.doccode">
        <el-reference
            v-model="form.factory_data"
            type="select-factory"
            style="width: 90%"
        />
    </el-form-item>
</el-form>
```

```js
export default {
  data() {
    return {
      flag: 'add',
      form: {
        factory_data: {
          doccode: '',
          factory_no: '',
          factory_name: ''
        }
      },
      // 校验
      rules: {
        'factory_data.doccode': [{ required: true, message: '请选择工厂', trigger: 'change' }]
      },
    }
  }
}
```

## 自定义按钮使用示例

```html
<el-table-column v-if="flag !== 'view'" width="50px">
    <template slot="header">
        <el-reference
            <!--多选使用 :value="vlaue" 来绑定值-->
            :value="worknumber"
            type="select-staff"
            title="员工"
            @open-dialog="(open) => open()">
            <!-- 按钮 -->
           <i class="el-icon-plus" style="font-size: 25px;" />
        </el-reference>
    </template>
</el-table-column>
```

```javascript
export default {
  data() {
    return {
      flag: 'add',
      	//使用索引赋值，或者直接[]赋空，会导致watch函数不生效
      	//清理数组，this.worknumber.splice(0, this.worknumber.length)
      	//添加数据 this.worknumber.push() 
      worknumber:[]
    }
  }
}
```

## changelog

1. 点开弹框点击确定当前页面的选中的数据会覆盖之前所有数据的问题
   + 修复单行点击高亮只会删除一条数据的问题
   + 修复单选翻页数据不保存的问题
   + 完成弹框的tab栏联动
2. 单选弹框input添加删除
3. 多选弹框input中tag显示 ，可在input框进行单个删除
4. input框内有内容时点击不到触发弹框区域的问题

## TODO

1. 把demo移动到弹框demo里 （完成）
2. select下拉控件通过数组开启多选（完成）
3. select 通过参数可以不要 全部 选项（完成）
4. 把弹框小tab渲染的内容放入组件内部     ( 完成  待合并mixins)  => （完成）
5. 弹框文档（待完成）
