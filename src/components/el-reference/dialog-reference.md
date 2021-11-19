# el-reference 引用数据(表单元素)

## 一.引用弹框(input)

```html
<el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="多选:">
    <el-reference
      v-model="item1"
      type="select-dialog-template"
      style="width: 600px"
    />
  </el-form-item>
    
  <el-form-item label="单选:">
    <el-reference
      v-model="item2"
      type="select-dialog-template"
      style="width: 400px"
    />
  </el-form-item>
</el-form>
```

```javascript
export default {
  data() {
    /** 
    	1.通过数据类型开启单选，多选
    */
    return {
      item1:[],
      item2:{}
    }
  }
}
```

## 二 .引用示例（select）

```html
<el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
  <!-- extra -->
  <el-form-item label="下拉单选 开启全部:" label-width="auto">
    <el-reference
      v-model="form.insurm"
      :extra="{whole:true,code:'29'}"
      type="select-type"
      style="width: 200px"
    />
  </el-form-item>
  <el-form-item label="下拉单选 默认没有全部:" label-width="auto">
    <el-reference
      v-model="form.insurm2"
      type="select-type"
      style="width: 200px"
    />
  </el-form-item>

  <el-form-item label="下拉多选：无法开启全部" label-width="auto">
    <el-reference
      v-model="form.insurm3"
      type="select-type"
      style="width: 200px"
    />
  </el-form-item>
</el-form>
```

```javascript
export default {
  data() {
    /** 
    	1.通过数据类型开启单选，多选
    	2.只有title用于自定义，其他参数全部传入extra
    	2.extra内的参数只要更改，里面的参数就都要传
    	3.select的value值已传入
    */
    return {
        form: {
            insurm: {},
            insurm2: {},
            insurm3: []
        }
    }
  }
}

```

## 三.引用示例（自定义button）

```html
<el-row>
  <el-reference
    v-if="true"
    v-model="item3"
    type="select-dialog-template"
    @before-open="(open) => open()"
    @change="i3"
  >
    <icon name="unsubmit" title="物品v-model" />
  </el-reference>

  <el-reference
    :value="item5"
    type="select-dialog-template"
    @before-open="(open) => open()"
    @change="i5"
  >
    <icon name="unsubmit" title="物品 :value" />
  </el-reference>

  <el-reference
    v-model="item4"
    type="select-dialog-template"
    @before-open="before_open"
  >
    <icon name="approval" title="自定义按钮 有验证" />
  </el-reference>
</el-row>
```

```javascript
export default {
  data() {
    /** 
		1.通过数据类型开启单选，多选
		2.弹框的出现改为 before-open事件函数操控，用于验证 (open) => open()
    */
    return {
        item3: [],
        item4: {},
        item5: [],
    }
  },
  methods: {
      before_open(open) {
          if (this.btn_show) {
              open()
              return
          }
          this.$message.warning('屏幕上的值为true时才能打开')
      },  
  }
}
```

## 四. tag栏内的tag内容（多选引用弹框自动开启）

![image-20210526130842094](../../../images/tag_title.gif)

### 4.1 在定义的弹框组件中的tag_content方法中拼接字符串，没有这个方法会显示选中行的doccode

![image-20210526130842094](../../../images/tab_content.png)

## 五.所有引用弹框的书写参考select-dialog-template.vue

### 按照步骤修改（弹框）

1. el-reference/index中的组件结构换成select-dialog-template,更改标签和type名
2. 复制自己的自定义弹框组件
3. select-dialog-template.vue中的内容覆盖
4. 原template内容保留
5. form数据字段更换
6. table字段更换
7. 更换服务名
8. 查询条件字段更换
9. tag_content中的字符串拼接

#### 六.所有引用弹框的书写参考select-factory.vue

1. el-reference/index中的组件结构换成select-dialog-template,更改标签和type名
2. 复制自己的自定义弹框组件
3. 更换服务名
4. 更换下拉列表的字段名
5. 在data中更换unique的字段名，select中value所需要的值
6. 更换el-option label的值（select中显示的内容）
7. （可选） 抛出的字段
