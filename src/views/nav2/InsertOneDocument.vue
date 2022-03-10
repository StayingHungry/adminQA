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


    <el-button type="info" round v-if="collection_value!=''" @click="findOneDocument">给我一个文档</el-button>


    <br>
    <br>
    <br>

    <el-row >
      <el-col :span="12" class="editor_col">
        <vue-json-editor
          style="width:90%"
          v-if="Object.keys(json).length != 0"
          v-model="json" 
          :expandedOnStart="true" 
          lang="zh"
          size="large"
          :mode="'tree'"
          :show-btns="true"
          @json-change="onJsonChange" 
          @json-save="onJsonSave" 
          class="jsoneditor-vue1"
          @json-error="onJsonError">
        </vue-json-editor>
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
        actions:[
          'loop'
        ],
        name: '',
        num_min: 1,
        num_max: 10,
        items_random_content:'',
        fields: {},
        dbs: [],
        collections:[],
        db_value: '',
        collection_value: '',
        collection_disabled: true,
        value2: "",
        screenHeight: `${document.documentElement.clientHeight}` - 242,	// 屏幕高度
      }
    },
 
    components: {
      vueJsonEditor
    },
 
    methods: {
      onTimeChange(val){
        ;
      },
      onConfirmClick(){
        let postData = {}
        postData['timestamps'] = this.fields.ACCTgtObjAx.values
        postData['db'] = this.db_value
        postData['collection'] = this.collection_value
        postData['speedMax'] = this.fields.ACCTgtObjAy.maxNum
        postData['speedMin'] = this.fields.ACCTgtObjAy.minNum
        postData['rawJson'] = this.json
        console.log(postData)
        axios.post('http://127.0.0.1:5080/venusAuto/insertDocuments/',postData)
        .then(res=>{
          console.log('返回',res.data)
        })
      },
      handleChangeMin(value) {
        console.log(value);
      },
      onJsonChange (value) {
        console.log('onJsonChangevalue:', value)

        let menus = document.getElementsByClassName("jsoneditor-contextmenu")
        console.log("类型判断")
        Array.prototype.forEach.call(menus, function (item) {
            item.style.display = 'none';
        });

      },
      onJsonSave (value) {
        console.log("保存")
        let postData = {}
        postData['db'] = this.db_value
        postData['collection'] = this.collection_value
        postData['rawJson'] = this.json
        console.log(postData)
        axios.post('http://127.0.0.1:5000/venusAuto/insertOneDocument/',postData)
        .then(res=>{
          console.log('返回',res.data)
          this.$notify({
            title: '成功',
            message: '插入数据成功！',
            type: 'success',
            duration: 1000
          });
        })
      },
      onJsonError (value) {
        console.log('err',value)
      },
      findOneDocument(){
        axios.get(`http://127.0.0.1:5000/venusAuto/oneDocument/?db=${this.db_value}&collection=${this.collection_value}`)
        .then(res=>{
          let find_collection = (res.data.collections_json)
          this.json = find_collection
        }
        )
      },
      onDbChange(value) {
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
      console.log("tttt4")
      console.log(process.env.API_ROOT)
      sessionStorage.setItem('qa_fields',"{}")
      window.addEventListener('fields-sessionstorage-changed', (event) => {
        this.fields = JSON.parse(event.detail.storage);
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

  		window.onresize = function listen() {
        console.log("size 变了",this.screenHeight)
    	  this.screenHeight = `${document.documentElement.clientHeight}` - 242;
        console.log(this.screenHeight)
  		};



    },




  }
</script>

<style scoped>

  /* .jsoneditor-contextmenu{
    display: none;
  } */

  .jsoneditor-vue1{
    width:  90%;
    /* max-height: 90%; */
    /* height: 85vh; */
    float: left;
  }

  .el-row {
    margin: 10px;
    height: 85vh;
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