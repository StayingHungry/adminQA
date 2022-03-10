<template>
  <div>
    <p>请选择：</p>
    <el-select v-model="db_value" placeholder="选择db" @change="onDbChange" style="margin-left:15px">
      <el-option
        v-for="item in dbs"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>

    <el-select v-model="collection_value" placeholder="选择集合" :disabled="collection_disabled" @change="onCollectionChange">
      <el-option
        v-for="item in collections"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>


    <el-button type="info" round v-if="collection_value!=''" @click="finOneDocument">给我一个文档</el-button>


    <br>
    <br>
    <br>

    <el-row>
      <el-col :span="12" class="editor_col">
        <vue-json-editor
          
          v-if="Object.keys(json).length != 0"
          v-model="json" 
          :expandedOnStart="true" 
          lang="zh"
          size="large"
          :mode="'tree'"
          @json-change="onJsonChange" 
          @json-save="onJsonSave" 
          class="jsoneditor-vue1"
          @json-error="onJsonError"
          @dblclick="onDbclick">
        </vue-json-editor>
      </el-col>
      <el-col :span="12" style="text-align: center" class="editor_col">
        <el-card class="box-card"
          v-for="itemFiled in fields "
          :key="itemFiled.fieldKey"
        >
          <div slot="header" class="clearfix">
            <span v-if="itemFiled.actionType=='time_select'">时间选择</span>
            <span v-if="itemFiled.actionType=='items_random'">指定随机</span>
            <span v-if="itemFiled.actionType=='range_random'">范围随机</span>
            <el-button style="float: right; padding: 3px 0" @click="onCancelClick(itemFiled.fieldKey)" type="text">取消</el-button>
          </div>

          <!-- 时间选择 -->
          <div class="block" v-if="itemFiled.actionType=='time_select'" >
            <span class="demonstration">{{ itemFiled.fieldKey}}</span>
            <el-date-picker
              v-model="itemFiled.values"
              @change="onTimeChange"
              type="datetimerange"
              align="left"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="timestamp"
              :default-time="['08:00:00', '08:10:00']">
            </el-date-picker>
          </div>





          <!-- 指定随机 -->
          <div class="block items_input" v-if="itemFiled.actionType=='items_random'" >
            <span class="demonstration">{{ itemFiled.fieldKey}}</span>
            <el-input v-model="itemFiled.content" placeholder="请输入内容" style="max-width:60%" ></el-input>
          </div>


          <!-- 范围随机 -->
          <div class="block" v-if="itemFiled.actionType=='range_random'">
            <span class="demonstration">{{ itemFiled.fieldKey}}</span>
              <el-input-number 
              v-model="itemFiled.minNum" 
              @change="handleChangeMin" 
              :min="0" 
              :max="100" 
              label="描述文字" >
              </el-input-number>
              <span class="el-range-separator">{{ "<-->" }}</span>
              <el-input-number 
              v-model="itemFiled.maxNum" 
              @change="handleChangeMax" 
              :min="1" 
              :max="10" 
              label="描述文字" >
              </el-input-number>
          </div>
        </el-card>

          <el-card class="box-card" v-if="data_ready">
            <div class="block items_input"  >
              <span class="demonstration">新表</span>
              <el-input v-model="newcol_name" placeholder="请输入表名" v-if="data_ready" ></el-input>
            </div>
          </el-card>
        
        <el-button type="primary" round v-show="Object.keys(fields).length!=0" @click="onConfirmClick" class="confirmBtn">
          {{ data_ready? "提交":"选好了" }}
        </el-button>
      </el-col>
    </el-row>



  </div>
</template>
 
<script>
  import vueJsonEditor from 'vue-json-editor'
  import axios from 'axios'
 
  export default {
    data () {
      return {
        json: {},
        fields: {},
        dbs: [],
        collections:[],
        db_value: '',
        data_ready:false,
        collection_value: '',
        collection_disabled: true,
        newcol_name:"", // 新表名称
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }
    },
 
    components: {
      vueJsonEditor
    },
 
    methods: {
      onTimeChange(val){
        console.log("时间变了",val);
        console.log(this.fields)
        sessionStorage.setItem('qa_fields',JSON.stringify(this.fields))
      },
      onConfirmClick(){
        let postData = {}
        for(let key in this.fields){
          if (this.fields[key]["actionType"] == "time_select"){
            postData['timestamps'] = this.fields[key]["values"]
          }else if(key == "VehSpd"){
            postData['speedMax'] = this.fields.VehSpd.maxNum
            postData['speedMin'] = this.fields.VehSpd.minNum
          }
        }
        if (postData['timestamps'].length<2 || !postData['speedMax']){
          this.$notify.error({
            title: '数据异常！',
            message: `未按照要求设置数据！`,
            duration: 2000
          });
          return
        }
        console.log("tttttt")
        postData['db'] = this.db_value
        postData['collection'] = this.newcol_name
        postData['rawJson'] = this.json
        console.log(postData)
        this.data_ready = true


        if(this.newcol_name==""){
          this.$notify.info({
            title: '提醒',
            message: '请输入表明。',
            duration: 2500
          });
          return
        }else if(!this.newcol_name.startsWith("data.")){
          this.$notify.error({
            title: '提醒',
            message: '表名不符合需求,请确认。',
            duration: 2500
          });
          return
        }

        axios.post('http://127.0.0.1:5000/venusAuto/newCol/',postData)
        .then(res=>{
          console.log('返回',res.data)
          this.$notify({
            title: '插入成功！',
            message: `本次插入数据一共${res.data.inserted_ids.length}条。`,
            type: 'success',
            duration: 2000
          });
        })

      },
      onCancelClick(key){
        let fields_tem = this.fields
        delete fields_tem[key]
        console.log('after del', JSON.stringify(this.fields))
        this.fields = JSON.parse( JSON.stringify(this.fields))
        sessionStorage.setItem('qa_fields',JSON.stringify(this.fields))


        let postData = {}
        for(let key in this.fields){
          if (this.fields[key]["actionType"] == "time_select"){
            console.log("时间选择了",this.fields[key]["values"])
            postData['timestamps'] = this.fields[key]["values"]
          }else if(key == "VehSpd"){
            postData['speedMax'] = this.fields.VehSpd.maxNum
            postData['speedMin'] = this.fields.VehSpd.minNum
          }
        }
        if (postData['timestamps'].length<2 || !postData['speedMax']){ // 隐藏新表名输入
          this.data_ready = false
        }

      },
      handleChangeMin(value) {
        console.log(value);
      },
      handleChangeMax(value) {
        console.log(value);
      },
      onJsonChange (value) {
        console.log('onJsonChangevalue:', value)
      },
      onJsonSave (value) {
        console.log(value)
        console.log("tetetete")
      },
      onJsonError (value) {
        console.log('err',value)
      },
      onDbclick () {
        console.log("双击")
      },
      onclickdb(){
        console.log("双击2")
      },
      finOneDocument(){
        axios.get(`http://127.0.0.1:5000/venusAuto/oneDocument/?db=${this.db_value}&collection=${this.collection_value}`)
        .then(res=>{
          let find_collection = (res.data.collections_json)
          this.json = find_collection
        })
      },
      onDbChange(value) {
        // console.log("onDbChange")
        this.collections = []
        this.collection_value = ''
        axios.get('http://127.0.0.1:5000/venusAuto/tables/?db=' + value)
        .then(res=>{
          console.log(res.data.collections)
          let res_collections = res.data.collections
          res_collections.forEach(val=>{
            this.collections.push({
              "value": val,
              "label": val
            })
            this.collection_disabled = false
          })
        })
      },
      onCollectionChange(value) {
        console.log(value)
      }
    },
    mounted(){
      sessionStorage.setItem('qa_fields',"{}")
      window.addEventListener('fields-sessionstorage-changed', (event) => {
        this.fields = JSON.parse(event.detail.storage);
        console.log('出发listen',JSON.stringify(this.fields))
      });

      axios.get('http://127.0.0.1:5000/venusAuto/dbs/')
      .then(res=>{
        let res_dbs = res.data.dbs
        let db_black = ['admin','local','config']
        res_dbs.forEach((val)=>{
            if(db_black.indexOf(val)>-1){
              ;
            }
            else{
              this.dbs.push({"value":val,"label":val})
            } 
        });
      })




    },




  }
</script>

<style scoped>
  .jsoneditor-vue1{
    width:  90%;
    /* max-height: 90%; */
    /* height: 98%; */
    float: left;
  }

  .el-row {
    margin: 10px;
  }
  .el-col {
    border-radius: 4px;
    /* margin: 5px; */
    padding: 5px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 500px;
  }
  .row-bg {
    padding: 5px 0;
    background-color: #f9fafc;
  }


  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    width: 80%;
    margin: 10px;
  }
.editor_col{
  /* max-height: 300px;*/
  /* height: 544px; */
  height: 75vh;
  overflow:auto; 
}
.block {
  padding: 10px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color-base);
  flex: 1;
}
.block:last-child {
  border-right: none;
}
.block .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 10px;
}
.items_input{
  text-align: center;
}
.confirmBtn{
  margin-left: 150px;
  margin-top: 30px;
  position:absolute;
  right:5px;
  bottom:5px;
}

/* .clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
} */

</style>