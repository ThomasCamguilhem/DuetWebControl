<style>
.v-tabs__item {
	display: block !important;
}
.material_btn {
	height: fit-content;
	padding: 1%;
	border-radius: 10px;
	width: 30%;
}
.material_btn .v-btn__content {
	display: inline-grid;
	font-size: large;
}
.material_btn .v-btn__content img{
	margin: 0 auto;
}
.v-tabs__wrapper, .v-tabs__container{
	height: auto !important;
}
</style>
<template>
	<v-layout column>
		<v-layout row>
			<v-btn v-if="isLocal && selectedMachine !== '[default]'" color="" @click="confirmShutdownDialog.shown = !confirmShutdownDialog.shown">
				<v-icon mr-1 >
					power_settings_new
				</v-icon>
				Shutdown printer
			</v-btn>
			<v-spacer></v-spacer>
			<emergency-btn class="hidden-xs-only"></emergency-btn>
		</v-layout>
		<img src="/img/ressources/logoLynxter-dark.png" width="200px" style="margin: 100px auto 0px auto">
		<h2 class="display-1" style="text-align: center; background: #616161; font-family:'GTAmericaExpandedRegular', sans-serif !important; text-transform: uppercase;letter-spacing: 0.1rem !important; margin: 50px 0 100px;">
			{{ selectedMachine === '[default]' ? $t('dialog.connect.title') : (waited ? 'Select a toolhead' : '')}}
		</h2>
		<v-card v-if="selectedMachine === '[default]' && waited">
			<v-form ref="form" @submit.prevent="submit">
				<v-card-title>
					{{ $t('dialog.connect.prompt') }}
				</v-card-title>
				<v-card-text>
					<v-text-field v-if="!mustConnect" ref="hostname" v-model="hostname" :placeholder="$t('dialog.connect.hostPlaceholder')" :rules="[v => !!v || $t('dialog.connect.hostRequired')]" required></v-text-field>
					<v-text-field ref="password" type="password" :placeholder="$t(passwordRequired ? 'dialog.connect.passwordPlaceholder' : 'dialog.connect.passwordPlaceholderOptional')" v-model="password" :rules="[v => !!v || !passwordRequired || $t('dialog.connect.passwordRequired')]" :required="passwordRequired"></v-text-field>
				</v-card-text>

				<v-card-actions>
					<v-spacer></v-spacer>
					<!--v-btn v-show="!mustConnect" color="primary darken-1" flat @click="hideConnectDialog">{{ $t('generic.cancel') }}</v-btn-->
					<v-btn color="primary darken-1" flat type="submit">{{ $t('dialog.connect.connect') }}</v-btn>
				</v-card-actions>
			</v-form>
		</v-card>
		<v-tabs v-if="selectedMachine !== '[default]' && waited" fixed-tabs>
			<v-tab style="width: 0 !important; display: none"></v-tab>
			<v-tab v-for="(material, key) in tools" :key="key" v-if="material.length > 0">
				<img :src="'/img/ressources/Medium_universe_'+key.substr(0,3).toUpperCase()+'.svg'" :alt="key" width="100px" height="100px">
				<br/>{{ key }}
			</v-tab>
			<v-tab-item></v-tab-item>
			<v-tab-item v-for="(material, key) in tools" :key="key" v-if="material.length > 0">
				{{key}}:
				<v-progress-linear indeterminate v-if="loading"></v-progress-linear>
				<v-list v-if="!loading">
					<v-list-tile v-for="(tool, index) in material" :key="index" @click="toolClick(tool)">
						<img :src="tool.ico" style="width: 40px; margin-right:15px"> {{ tool.name }}
					</v-list-tile>
				</v-list>
			</v-tab-item>
		</v-tabs>
		<v-layout column>
			<v-btn v-if="selectedMachine !== '[default]' && calibrationTool != undefined && calibrationTool != {} && waited" color="grey darken-3" :loading="loading" @click="toolClick(calibrationTool)">
				<v-icon class="mr-1">build</v-icon> Load Calibration tool
			</v-btn>
		</v-layout>
		<v-layout column style="position: absolute; bottom: 8px; width: 100%">
			<v-btn v-if="selectedMachine === '[default]'" onclick="location.href = 'http://' + location.host"><v-icon>refresh</v-icon> Refresh the interface</v-btn>
			<v-btn v-if="selectedMachine !== '[default]'" color="grey darken-3" :loading="loading" @click="sendCode('M550 PS600D - Debug')">
				<v-icon class="mr-1">launch</v-icon> Access DWC (No tool)
			</v-btn>
			<v-btn v-if="selectedMachine !== '[default]'" color="grey darken-3" :loading="loading" @click="loadTools">
				<v-icon class="mr-1">refresh</v-icon> Refresh tools List
			</v-btn>
		</v-layout>
		<v-spacer></v-spacer>
		<confirm-dialog :shown.sync="confirmShutdownDialog.shown" :question="confirmShutdownDialog.question" :prompt="confirmShutdownDialog.prompt" @confirmed="shutdown"></confirm-dialog>
	</v-layout>
</template>
<script>
'use strict'

import { mapState, mapGetters, mapActions } from 'vuex'

import { DisconnectedError } from '../../utils/errors.js'
import Path from '../../utils/path.js'
import axios from 'axios'

export default {
	data() {
		return {
			shown: false,
			hostname: '',
			password: '',
			buffer: 0,
			bufferValue: 0,
			curVideo: 0,
			load: true,
			loading: false,
			playIcon: 'pause',
			playing: false,
			noTool: undefined,
			tools: {
				Filament: [],
				Liquid: [],
			},
			videoPlaylist: [{
				src: "/img/ressources/Lynxter - Impression 3D hautes performances.mp4",
				poster: "/img/ressources/Lynxter_wallpaper_1920_1080_detail_grey.png"
			}],
			confirmShutdownDialog: {
				question: 'Shutdown the Printer',
				prompt: "Are you sure you want to shutdown the Printer (this operation will need a restart of the printer after)",
				shown: false
			},
			waited: false,
			timeout: undefined,
			exName: "",
			calibrationTool: {},
		}
	},
	computed: {
		...mapState(['isConnecting', 'isDisconnecting', 'isLoggingIn', 'isLoggingOut']),
		...mapState('machine', ['isReconnecting']),
		...mapState(['isLocal', 'connectDialogShown', 'passwordRequired', 'selectedMachine', 'isConnecting']),
		...mapState('settings', ['lastHostname']),
		...mapGetters(['isConnected']),
		...mapState({
			name: state => state.machine.model.network.name,
		}),
		mustConnect() { return !this.isLocal && !this.isConnected; }
	},
	methods: {
		...mapActions(['connect','shutdown']),
		...mapActions('machine', ['sendCode', 'getFileList']),
		async loadTools() {
			if (this.loading) {
				return;
			}

			this.loading = true;
			try {
				const response = await this.getFileList(Path.macros+"/_Tools");
				let tools = response.filter(item => item.isDirectory).map(item => item.name);
				//console.log(tools);
				let len = tools.length;
				let that = this;
				for (var i = 0; i < len; i++){
					if (!tools[i].includes("Calibration")) {
						let response = await this.getFileList(Path.macros+"/_Tools/"+tools[i]);
						response.forEach(
							function (tool) {
								if (tool.name.includes("Filament")) {
									tool.ico = "/img/ressources/Medium_universe_FIL.svg"
								} else if (tool.name.includes("Liquid")) {
									tool.ico = "/img/ressources/Medium_universe_LIQ.svg"
								}	else if (tool.name.includes("Paste")) {
									tool.ico = "/img/ressources/Medium_universe_PAS.svg"
								} else {
									tool.ico = "/img/ressources/file.png"
								}
								var material = (tools[i].substring(0,tools[i].indexOf('_')));
								if (that.tools[material] === undefined)
								that.tools[material] = [];
								var name = tools[i].substring(0,3).toUpperCase();
								name += tools[i].substr(tools[i].indexOf("in-")-1,1);
								name += tools[i].substr(tools[i].indexOf("out_")-1,1);
								name += (name.includes("FIL") ||  (name.includes("LIQ") && tool.name.lastIndexOf("-") > tool.name.indexOf("-")) ? tool.name.substr(-5,3) : "")
								if (tool.name.includes("_Load") && that.tools[material].filter(item => item.name == name).length == 0) {
									//console.log(name);
									that.tools[material].push({
										'path': Path.macros+"/_Tools/"+tools[i]+"/"+tool.name,
										'name': name,//tool.name,
										'ico' : tool.ico,
									});
								}
							});
						} else {
							let response = await this.getFileList(Path.macros+"/_Tools/"+tools[i]);
							response.forEach(
								function (tool) {
									var material = (tools[i].substring(0,tools[i].indexOf('_')));
									if (tool.name.includes("_Load_C")) {
										//console.log(tool.name);
										tool.ico = "/img/ressources/Medium_universe_CAL.svg"
										var name = tools[i].substring(0,3).toUpperCase();
										that.calibrationTool = {
											'path': Path.macros+"/_Tools/"+tools[i]+"/"+tool.name,
											'name': name,//tool.name,
											'ico' : tool.ico,
										}
										//console.log(that.calibrationTool)
									}
								});
						}
					}

					this.waited = true;
				} catch (e) {
					if (!(e instanceof DisconnectedError)) {
						console.warn(e);
						//this.$log('error', this.$t('error.toolsLoadFailed'), e.message);
					}
					this.hide();
				}
				//console.log(this.tools);

				this.loading = false;
			},
			async submit() {
				if (this.shown && this.$refs.form.validate()) {
					//this.hideConnectDialog();

					await this.connect({ hostname: this.hostname, password: this.password });
					this.password = '';
				}
			},
			toolClick(tool) {
				this.hide();
				//console.log(tool);
				let code = 'M98 P"' + tool.path + '"';
				//console.log(code);
				this.sendCode(code);
				let myTool = tool.path.substring(tool.path.lastIndexOf("/")+1);
				if (myTool.lastIndexOf(".") > 0){
					myTool = myTool.substring(this.load?6:8,myTool.lastIndexOf("."));
					//console.log(myTool);
				} else {
					myTool = myTool.substring(this.load?6:8);
					//console.log(myTool)
				}
			},
			hide() {
				this.$emit('update:shown', false);
			},
		},
		mounted() {
			this.hostname = this.lastHostname;
			this.shown = this.connectDialogShown;
			this.timeout = setTimeout(() => {this.waited = true}, 5000);
			console.log(this.exName);
			console.log(this.name);
			if (this.name != this.exName) {
				this.tools = {
					Filament: [],
					Liquid: [],
				},
				this.loadTools();
				//console.log(this.waited);
				this.waited = false;
				this.exName = this.name;
			}

		},
		watch: {
			name(as) {
				clearTimeout(this.timeout);
				this.waited = false;
				this.tools = {
					Filament: [],
					Liquid: [],
				},
				this.loadTools();
				//console.log(this.waited);
			},
			selectedMachine(to){
				console.log(this.selectedMachine)
			},
			isReconnecting(to){
				console.log(to?'reconnecting':'reconnected');
			}
		}
	}
	</script>
