<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="班级编号" prop="classNo">
        <el-input
          v-model="queryParams.classNo"
          placeholder="请输入班级编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="班级名称" prop="className">
        <el-input
          v-model="queryParams.className"
          placeholder="请输入班级名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属部分" prop="part">
        <el-select v-model="queryParams.part" placeholder="请选择班级所属部分" clearable>
          <el-option
              v-for="dict in sco_class_part"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="班级性质" prop="nature">
        <el-select v-model="queryParams.nature" placeholder="请选择班级性质" clearable>
          <el-option
              v-for="dict in sco_class_nature"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="所属层次" prop="level">
        <el-select v-model="queryParams.level" placeholder="请选择班级层次" clearable>
          <el-option
              v-for="dict in sco_class_level"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="班级状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择班级状态" clearable>
          <el-option
            v-for="dict in sys_common_enable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['score:class:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['score:class:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['score:class:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['score:class:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="classList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="班级自增ID" align="center" prop="classId" />
      <el-table-column label="班级编号" align="center" prop="classNo" />
      <el-table-column label="班级名称" align="center" prop="className" />
      <el-table-column label="部分" align="center" prop="part">
        <template #default="scope">
          <dict-tag :options="sco_class_part" :value="scope.row.part"/>
        </template>
      </el-table-column>
      <el-table-column label="班级性质" align="center" prop="nature">
        <template #default="scope">
          <dict-tag :options="sco_class_nature" :value="scope.row.nature"/>
        </template>
      </el-table-column>
      <el-table-column label="层次" align="center" prop="level">
        <template #default="scope">
          <dict-tag :options="sco_class_level" :value="scope.row.level"/>
        </template>
      </el-table-column>
      <el-table-column label="班级状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="sys_common_enable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['score:class:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['score:class:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改班级信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="classRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="编号" prop="classNo">
          <el-input v-model="form.classNo" placeholder="请输入班级编号" />
        </el-form-item>
        <el-form-item label="名称" prop="className">
          <el-input v-model="form.className" placeholder="请输入班级名称" />
        </el-form-item>
        <el-form-item label="所属部分" prop="part">
          <el-select v-model="form.part" placeholder="请选择班级所属部分">
            <el-option
                v-for="dict in sco_class_part"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级性质" prop="nature">
          <el-radio-group v-model="form.nature">
            <el-radio
                v-for="dict in sco_class_nature"
                :key="dict.value"
                :label="parseInt(dict.value)"
                @change="handleRatioChange"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.nature === 1" label="所属层次" prop="level">
          <el-select v-model="form.level" placeholder="请选择理科班级所属层次">
            <el-option
                v-for="dict in sco_class_level"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
                v-for="dict in sys_common_enable"
                :key="dict.value"
                :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Class">
import { listClass, getClass, delClass, addClass, updateClass } from "@/api/score/class";

const { proxy } = getCurrentInstance();
const { sco_class_level, sys_common_enable, sco_class_part, sco_class_nature } = proxy.useDict('sco_class_level', 'sys_common_enable', 'sco_class_part', 'sco_class_nature');

const classList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    classNo: null,
    className: null,
    part: null,
    nature: null,
    level: null,
    status: null,
  },
  rules: {
    classNo: [
      { required: true, message: "班级编号不能为空", trigger: "blur" }
    ],
    className: [
      { required: true, message: "班级名称不能为空", trigger: "blur" }
    ],
    part: [
      { required: true, message: "班级所属部分不能为空", trigger: "blur" }
    ],
    nature: [
      { required: true, message: "班级性质不能为空", trigger: "blur" }
    ],
    level: [
      { required: true, message: "理科班级所属层次不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "班级状态不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询班级信息列表 */
function getList() {
  loading.value = true;
  listClass(queryParams.value).then(response => {
    classList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    classId: null,
    classNo: null,
    className: null,
    part: null,
    nature: null,
    level: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  };
  proxy.resetForm("classRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.classId);
  single.value = selection.length !== 1;
  multiple.value = !selection.length;
}

function handleRatioChange(value) {
  if (value === 0) {
    form.value.level = 0;
  }
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加班级信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _classId = row.classId || ids.value
  getClass(_classId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改班级信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["classRef"].validate(valid => {
    if (valid) {
      if (form.value.classId != null) {
        updateClass(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addClass(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _classIds = row.classId || ids.value;
  proxy.$modal.confirm('是否确认删除班级信息编号为"' + _classIds + '"的数据项？').then(function() {
    return delClass(_classIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('score/class/export', {
    ...queryParams.value
  }, `class_${new Date().getTime()}.xlsx`)
}

getList();
</script>
