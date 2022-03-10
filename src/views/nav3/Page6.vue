<template>
  <div>
    <p>vue-json-editor</p>
    <vue-json-editor v-model="json" :show-btns="true" :expandedOnStart="true" @json-change="onJsonChange"></vue-json-editor>
  </div>
</template>
 
<script>
  import vueJsonEditor from 'vue-json-editor'
 
  export default {
    data () {
      return {
        json: { 
				"programmers": [ 
					{ "firstName": "Brett", "lastName":"McLaughlin", "email": "aaaa" },
					{ "firstName": "Jason", "lastName":"Hunter", "email": "bbbb" },
					{ "firstName": "Elliotte", "lastName":"Harold", "email": "cccc" }
				],
				"authors": [
					{ "firstName": "Isaac", "lastName": "Asimov", "genre": "science fiction" },
					{ "firstName": "Tad", "lastName": "Williams", "genre": "fantasy" },
					{ "firstName": "Frank", "lastName": "Peretti", "genre": "christian fiction" }
				],
				"musicians": [
					{ "firstName": "Eric", "lastName": "Clapton", "instrument": "guitar" },
					{ "firstName": "Sergei", "lastName": "Rachmaninoff", "instrument": "piano" }
				] 
			}
      }
    },
 
    components: {
      vueJsonEditor
    },
 
    methods: {
      onJsonChange (value) {
        console.log('value:', value)
      }
    }
  }
</script>