# 组件文档

## container-layout

> 自动占满页面剩余空间

| 参数             | 类型             | 默认值 | 描述                                                         |
| ---------------- | ---------------- | ------ | ------------------------------------------------------------ |
| footerHeight     | String \| Number | auto   | 手动设置剩余空间底部盒子高度                                 |
| adjustableHeight | Boolean          | false  | 开启调整剩余空间上下两个盒子高度的功能                       |
| fixedHeight      | String \| Number | 0      | 关闭自适应剩余空间，为下方盒手动赋值<br /> 例：fixed-height=“50%”  :fixed-height=“300” |



## dynamic-table

>  二次封装el-table，动态生成表格

| 参数                  | 类型             | 默认值   | 描述                                                         |
| --------------------- | ---------------- | -------- | ------------------------------------------------------------ |
| autoInit              | Boolean          | true     | 初始化完成是否自动请求数据                                   |
| headerList            | Array            | []       | 例：[{prop:'id'，label：'编号'}]，其他参数查看文档           |
| rowClickNoSelect      | Boolean          | false    | 点击非checkbox的列，只高亮，不选中<br />点击checkbox不触发row-click事件 |
| fixedHeight           | String \| Number | 0        | 关闭自适应剩余空间，变为固定高度, <br />fixedHeight为 300px ，表格高度固定为300px<br />若为300，设置最大高度为300px |
| hideColumn            | Array            | []       | 添加headerList的prop值，隐藏那一列                           |
| showSummary           | Boolean          | false    | 是否开启合计                                                 |
| summaryOptions        | Array            | []       | {property:  prop值,precision:'精度 小数位数',unit：’单位‘}   |
| sortType              | String           | server   | server后端排序，client前端排序，headerList中的参数优先级更高 |
| v-model               | Array \| Object  |          | Array 开启checkbox多选，Object 单选                          |
| onePageShowPagination | Boolean          | true     | 页面数据小于一页是否显示页码                                 |
| unique                | String           | decode   | 设置表格唯一标识符字段                                       |
| request               | Function         | () => {} | 请求数据的方法<br />{page_no,page_size,data,field,sort,total} |



## el-reference 

> 引用组件，用于引用封装的弹框和下拉框

| 参数    | 类型             | 默认值 | 描述                                |
| ------- | ---------------- | ------ | ----------------------------------- |
| type    | String           |        | 设置引用的标识                      |
| v-model | Array  \| Object |        | Array 开启checkbox多选，Object 单选 |



## dialog-layout

> el-reference 组件引用的弹框



