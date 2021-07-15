<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 会员信息
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button
          type="primary"
          icon="el-icon-delete"
          class="handle-del mr10"
          @click="addAllSelection"
          >添加</el-button
        >
        <el-input
          v-model="serchPhone"
          placeholder="手机号码"
          class="handle-input mr10"
          clearable
          @clear="clearserchPhone"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch"
          >搜索</el-button
        >
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
        fit
      >
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="name" label="用户名"></el-table-column>
        <el-table-column prop="sex" label="性别"></el-table-column>
        <el-table-column
          prop="thismoney"
          label="本次消费金额"
        ></el-table-column>
        <el-table-column prop="allmoney" label="总消费金额"></el-table-column>
        <el-table-column prop="comenum" label="消费次数"></el-table-column>
        <el-table-column prop="birthday" label="生日"></el-table-column>
        <el-table-column label="账户余额">
          <template #default="scope">￥{{ scope.row.money }}</template>
        </el-table-column>
        <el-table-column prop="phonenumber" label="手机号码"></el-table-column>
        <el-table-column prop="date" label="注册时间"></el-table-column>
        <el-table-column prop="mvp" label="mvp次数"></el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="250">
          <template #default="scope">
            <el-button
              type="text"
              icon="el-icon-s-goods"
              @click="consumption(scope.row)"
              >消费</el-button
            >
            <el-button
              type="text"
              icon="el-icon-user-solid"
              @click="Recharge(scope.row)"
              >充值</el-button
            >
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="query.pageIndex"
          :page-size="query.pageSize"
          :total="pageTotal"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        ></el-pagination>

        <!--  -->
      </div>
    </div>
    <!-- 添加弹出框 -->
    <el-dialog title="添加客户信息" v-model="addVisible" width="30%">
      <el-form ref="addform" :rules="rules" :model="addform" label-width="90px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="addform.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio v-model="addform.sex" label="男">男</el-radio>
          <el-radio v-model="addform.sex" label="女">女</el-radio>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-input v-model="addform.birthday"></el-input>
        </el-form-item>
        <el-form-item label="账户余额" prop="money">
          <el-input v-model="addform.money"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phonenumber">
          <el-input v-model="addform.phonenumber"></el-input>
        </el-form-item>
        <el-form-item label="mvp次数" prop="mvp">
          <el-input-number
            v-model="addform.mvp"
            :min="0"
            label="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveAdd('addform')"
            >确 定</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editRechargeEditVisible" width="30%">
      <el-form
        ref="RechargeEditform"
        :model="RechargeEditform"
        label-width="70px"
      >
        <el-form-item label="充值金额">
          <el-input v-model="Rechargemoney"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editRechargeEditVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRechargeEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form ref="form" :rules="rules" :model="form" label-width="90px">
        <div v-if="consumptionflag">
          <el-form-item label="用户名" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="生日">
            <el-input v-model.number="form.birthday"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input v-model="form.phonenumber"></el-input>
          </el-form-item>
          <el-form-item label="mvp次数">
            <el-input-number
              v-model="form.mvp"
              :min="0"
              label="0"
            ></el-input-number>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item label="消费金额">
            <el-input v-model.number="money"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            @click="
              editVisible = false;
              consumptionflag = false;
            "
            >取 消</el-button
          >
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { fetchData, submitData, delData, editData } from "../api/index";

export default {
  name: "basetable",
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        console.log(reg.test(value));
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };

    return {
      rules: {
        name: [
          { required: true, message: "请输入名字", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        money: [{ required: true, message: "请输入余额", trigger: "blur" }],
        phonenumber: [
          { required: true, validator: checkPhone, trigger: "blur" },
        ],
      },
      editRechargeEditVisible: false,
      Rechargemoney: "",
      RechargeEditform: {
        name: "",
        sex: "",
        thismoney: "",
        allmoney: "",
        comenum: "",
        phonenumber: "",
        date: "",
        mvp: 0,
        birthday: "",
        money: "",
      },
      query: {
        pageIndex: 1,
        pageSize: 10,
      },
      tableData: [],
      multipleSelection: [],
      addVisible: false,
      editVisible: false,
      pageTotal: 0,
      form: {
        name: "",
        sex: "",
        thismoney: "",
        allmoney: "",
        comenum: "",
        phonenumber: "",
        date: "",
        mvp: 0,
        birthday: "",
        money: "",
      },
      idx: -1,
      id: -1,
      addform: {
        name: "",
        sex: "",
        thismoney: "",
        allmoney: "",
        comenum: "",
        phonenumber: "",
        date: "",
        mvp: 0,
        birthday: "",
        money: "",
      },
      money: "",
      consumptionflag: false,
      serchPhone: "",
    };
  },

  created() {
    this.getData();
  },
  methods: {
    clearserchPhone() {
      this.getData();
    },
    // 获取 easy-mock 的模拟数据
    getData() {
      fetchData().then((res) => {
        this.tableData = res;
        let pageTotal = Object.keys(res);
        this.pageTotal = pageTotal.length || 50;
      });
    },
    addAllSelection() {
      this.addVisible = true;
      this.$nextTick(() => {
        this.$refs["addform"].resetFields();
      });
      // this.addform = {};
    },
    // 触发搜索按钮
    handleSearch() {
      // this.$set(this.query, "pageIndex", 1);
      let resultData = this.tableData.filter((data) => {
        //日期假设date,人名 name
        if (
          data.phonenumber == this.serchPhone ||
          data.phonenumber.indexOf(this.serchPhone) != -1
        ) {
          //此处根据具体需求判断
          return true;
        }
      });
      this.tableData = resultData;
    },
    // 删除操作
    handleDelete(row) {
      // 二次确认删除
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          delData(row.id).then((res) => {
            console.log(res);
            this.getData();
            let pageTotal = Object.keys(res);
            this.pageTotal = pageTotal.length || 50;
          });
          this.$message.success("删除成功");
        })
        .catch(() => {});
    },
    //消费
    consumption(row) {
      this.money = "";
      this.form = Object.assign({}, row);
      this.editVisible = true;
    },
    //充值
    Recharge(row) {
      this.Rechargemoney = "";
      this.form = Object.assign({}, row);
      this.editRechargeEditVisible = true;
    },
    // 多选操作
    // handleSelectionChange(val) {
    //   this.multipleSelection = val;
    // },
    // 编辑操作
    handleEdit(row) {
      this.form = Object.assign({}, row);
      this.consumptionflag = true;
      this.editVisible = true;
    },
    saveRechargeEdit() {
      this.form.money += this.Rechargemoney - 0;
      editData(this.form, this.form.id).then(() => {
        this.editRechargeEditVisible = false;
        this.getData();
      });
    },

    // 保存新增
    saveAdd(addform) {
      this.$refs[addform].validate((valid) => {
        if (valid) {
          this.addform.comenum = 1;
          this.gettime();
          this.addform.allmoney = 0;
          for (let i in this.tableData) {
            if (this.tableData[i].phonenumber == this.addform.phonenumber) {
              this.$message.error("该用户已存在");
              return false;
            }
          }
          submitData(this.addform).then(() => {
            this.addVisible = false;
            this.getData();
          });
        }
      });
    },
    //保存编辑
    saveEdit() {
      if (this.form.money - this.money < 0) {
        this.$message.error("该余额不足，请提醒客户充值");
      } else {
        this.form.thismoney = this.money;
        this.form.allmoney += this.form.thismoney;
        this.form.money = this.form.money - this.money;
        if (this.consumptionflag == false) {
          this.form.comenum += 1;
        }
        editData(this.form, this.form.id).then(() => {
          this.getData();
          this.$message({
            message: "操作成功",
            type: "success",
          });
          this.consumptionflag = false;
          this.editVisible = false;
        });
      }

      // this.$message.success(`修改第 ${this.idx + 1} 行成功`);
      // this.$set(this.tableData, this.idx, this.form);
    },
    handleSizeChange(val) {
      console.log(val);
    },
    // 分页导航
    handlePageChange(val) {
      console.log(val);
      // this.$set(this.query, "pageIndex", val);
      // this.getData();
    },
    //年月日
    gettime() {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      this.addform.date = year + "-" + month + "-" + day;
    },
  },
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 200px;
  display: inline-block;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
