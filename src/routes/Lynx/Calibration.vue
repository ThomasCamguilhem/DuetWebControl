<template>
	<v-layout row wrap>
		<v-flex xs12 sm12 md6 lg4 shrink>
		<xy-tilt-panel></xy-tilt-panel>
		</v-flex>
		<v-flex xs12 sm12 md6 lg4 shrink>
		<z-probe-offset></z-probe-offset>
		</v-flex>
	<v-flex xs12 sm12 md12 lg12 shrink>
		<xy-tool-offset></xy-tool-offset>
	</v-flex>
	<!--div style="width: 480px;overflow: hidden;">
		<img style="margin-left: -80px;" :src="'http://'+selectedMachine+':8080/?action=stream'" width="640" height="480">
		<svg height="480" style="position: absolute; left: 4px; bottom: 10px" width="480">
		<line x1="0" y1="0" x2="480" y2="480" stroke="black"></line>
		<line x1="0" x2="480" y1="480" y2="0" stroke="black"></line>
		<line x1="0" x2="480" y1="240" y2="240" stroke="black"></line>
		<line x1="240" x2="240" y1="0" y2="480" stroke="black"></line>
		<circle cy="240" r="50" fill="none" stroke="black" cx="240">
		</circle><circle cy="240" fill="none" stroke="black" r="25" cx="240">
		</circle><circle cy="240" fill="none" stroke="black" r="100" cx="240">
		</circle><circle cy="240" fill="none" stroke="black" r="200" cx="240">
		</circle></svg>
	</div-->
	</v-layout>
</template>
<script>
'use strict'

import { mapState } from 'vuex'
export default {
	computed: {
			...mapState(['selectedMachine']),
	}
}
</script>
