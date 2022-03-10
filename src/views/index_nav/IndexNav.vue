<template>
    <div>
        <h1></h1>
        <el-popover class="block_href"
            placement="top-start"
            title="云效"
            width="200"
            trigger="hover"
            content="阿里。">
            <el-button slot="reference">云效平台</el-button>
        </el-popover>

        <el-popover class="block_href"
            placement="top-start"
            title="云效"
            width="200"
            trigger="hover"
            content="阿里。">
            <el-button slot="reference">云效平台</el-button>
        </el-popover>

        <el-popover class="block_href"
            placement="top-start"
            title="云效"
            width="200"
            trigger="hover"
            content="阿里。">
            <el-button slot="reference">云效平台</el-button>
        </el-popover>

        <el-popover class="block_href"
            placement="top-start"
            title="云效"
            width="200"
            trigger="hover"
            content="阿里。">
            <el-button slot="reference">云效平台</el-button>
        </el-popover>
    <!-- <el-popover
        placement="bottom"
        title="流水线"
        width="200"
        trigger="click"
        content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
        <el-button slot="reference">click 激活</el-button>
    </el-popover>

    <el-popover
        ref="popover"
        placement="right"
        title="标题"
        width="200"
        trigger="focus"
        content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
    </el-popover>
    <el-button v-popover:popover>focus 激活</el-button>

    <el-popover
        placement="bottom"
        title="标题"
        width="200"
        trigger="manual"
        content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
        v-model="visible">
        <el-button slot="reference" @click="visible = !visible">手动激活</el-button>
    </el-popover> -->
    </div>
</template>

<script>
  export default {
    data() {
      return {
        visible: false
      };
    }
  };
</script>
<style scoped>
.block_href {
    margin: 15px;
}
</style>