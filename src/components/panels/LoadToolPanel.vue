<style>
.v-tab {
	display: block !important;
	height: fit-content;
	padding: 1%;
	border-radius: 10px;
	width: 30%;
}

.v-tabs__div {
	font-size: 19px;
}

.v-tabs__item {
	display: block !important;
}

.toolLocal>.v-list__tile {
	font-size: 18px;
}

.toolLocal>.v-list__tile:hover {
	font-size: 19px;
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

.toolLocal{
	padding: 10px 0;
	border-bottom: 1px solid black;
}
</style>
<template>
	<v-layout column>
		<v-layout row>
			<v-btn v-if="isLocal" color="" @click="confirmShutdownDialog.shown = !confirmShutdownDialog.shown">
				<v-icon mr-1 >
					power_settings_new
				</v-icon>
				Shutdown printer
			</v-btn>
			<v-spacer></v-spacer>
			<div v-if="ifaces && ifaces.length > 0" style="font-size: large">
				<div style="border-radius: 50%; width: 25px; height: 25px; display: inline-flex; margin-left: 0; vertical-align: middle;"
				id="state"
				v-bind:style="{
					background: ((ifaces.filter(iface => iface.ifname == 'enp1s0')[0] && ifaces.filter(iface => iface.ifname == 'enp1s0')[0].operstate == 'UP' && ifaces.filter(iface => iface.ifname == 'enp2s0')[0] && ifaces.filter(iface => iface.ifname == 'enp2s0')[0].operstate == 'UP' ) ? /* LAN externe et LAN interne sont connectés */
					'GREEN' :
					(( ifaces.filter(iface => iface.ifname == 'enp1s0')[0] && ifaces.filter(iface => iface.ifname == 'enp1s0')[0].operstate == 'UP' || ifaces.filter(iface => iface.ifname == 'enp2s0')[0] && ifaces.filter(iface => iface.ifname == 'enp2s0')[0].operstate == 'UP' ) ?
					/* LAN externe ou LAN interne est connecté */
					'ORANGE' :
					((!ifaces.filter(iface => iface.ifname == 'enp1s0')[0] && !ifaces.filter(iface => iface.ifname == 'enp2s0')[0]) ?
					'RED' : /* LAN externe et LAN interne sont déconnectés */
					'GRAY'))) }">
				</div>
				{{ (ifaces.filter( iface => iface.ifname == "enp2s0" ).length > 0 ? (ifaces.filter( iface => iface.ifname == "enp1s0" ).length > 0 ? ifaces.filter( iface => iface.ifname == "enp1s0" )[0].addr_info.filter( addr => addr.family == 'inet' )[0].local : 'Network disconected') : 'Booting') }}
				<br/>
			</div>
			<v-spacer></v-spacer>
			<emergency-btn class="hidden-xs-only"></emergency-btn>
		</v-layout>
		<img src="/img/ressources/logoLynxter-dark.png" width="200px" style="margin: 50px 50% 0px; left: -100px; position: relative;">
		<h2 class="display-1" style="text-align: center; background: #616161; font-family:'GTAmericaExpandedRegular', sans-serif !important; text-transform: uppercase;letter-spacing: 0.1rem !important; margin: 50px 0 50px;">
			{{ selectedMachine === '[default]' ? $t('dialog.connect.title') : (waited || true ? 'Select a toolhead' : '')}}
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
		<template v-if="!waited">
			<v-progress-linear indeterminate></v-progress-linear>
		</template>
		<v-tabs v-if="selectedMachine !== '[default]' && waited" grow>
			<v-tabs-slider color="primary"></v-tabs-slider>
			<!--v-tab style="width: 0 !important; display: none"></v-tab-->
			<v-tab v-for="(material, key) in tools" :key="key">
				<img :src="'/img/ressources/Medium_universe_'+key.substr(0,3).toUpperCase()+'.svg'" :alt="key" width="100px" height="100px">
				<br/>{{ key }}
			</v-tab>
			<v-tab-item v-for="(material, key) in tools" :key="key">
				<v-list v-if="!loading">
					<v-list-tile v-for="(tool, index) in material" :key="index" @click="toolClick(tool)" :class="{'toolLocal': isLocal}">
						{{ tool.name }}
					</v-list-tile>
				</v-list>
			</v-tab-item>
		</v-tabs>
		<v-layout column>
			<v-btn v-if="selectedMachine !== '[default]' && calibrationTool != undefined && calibrationTool != {} && waited" color="grey darken-3" :loading="loading" @click="toolClick(calibrationTool)">
				<v-icon class="mr-1">build</v-icon> Load Calibration tool
			</v-btn>
		</v-layout>
		<v-btn @click="sheet = !sheet" style="position: fixed; margin: 0 50%; z-index: 1; border-top-left-radius: 88px; border-top-right-radius: 88px; width:88px; heigth:44px; left: -44px" :style="{bottom: (sheet ? '120px' : '0px')}">
			<v-icon style="transition: 0.4s" :style="{transform: sheet ? 'rotate(180deg)' : 'rotate(0deg)'}">keyboard_arrow_up</v-icon>
		</v-btn>
		<div class="text-center">
			<v-bottom-sheet v-model="sheet" :inset="inset" :hide-overlay="hideOverlay" persistent>
				<v-sheet class="text-center" height="120px" style="background-color: #212121;">
		<v-layout column style="position: absolute; bottom: 8px; width: 100%">
			<v-btn v-if="selectedMachine !== '[default]' && DEBUG" color="grey darken-3" :loading="loading" @click="sendCode('M550 PS600D - Debug')">
				<v-icon class="mr-1">launch</v-icon> Access DWC (No tool)
			</v-btn>
			<v-layout row>
				<v-btn v-if="selectedMachine === '[default]' || true" color="grey darken-3"  onclick="location.href = 'http://' + location.host" style="margin: 5px 10px;" block>
					<v-icon>refresh</v-icon> Refresh the interface
				</v-btn>
			<v-btn v-if="selectedMachine !== '[default]'" color="grey darken-3" :loading="loading" @click="loadTools" style="margin: 5px 10px;" block>
				<v-icon class="mr-1">refresh</v-icon> Refresh tools List
			</v-btn>
			</v-layout>
		</v-layout>
				</v-sheet>
			</v-bottom-sheet>
		</div>
		<v-spacer></v-spacer>
		<confirm-dialog :shown.sync="confirmShutdownDialog.shown" :question="confirmShutdownDialog.question" :prompt="confirmShutdownDialog.prompt" @confirmed="shutdown"></confirm-dialog>
		<connection-dialog></connection-dialog>

	</v-layout>
</template>
<script>
'use strict'

import { mapState, mapGetters, mapActions } from 'vuex'

import { DisconnectedError } from '../../utils/errors.js'
import Path from '../../utils/path.js'
//import axios from 'axios'

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
			ifaces:[],
			DEBUG: true,
			sheet: false,
			inset: false,
			hideOverlay: true,
		}
	},
	computed: {
		...mapState(['isConnecting', 'isDisconnecting', 'isLoggingIn', 'isLoggingOut', 'isLoadingTool', 'isUnloadingTool', 'user']),
		...mapState('machine', ['isReconnecting']),
		...mapState(['isLocal', 'connectDialogShown', 'passwordRequired', 'selectedMachine', 'isConnecting']),
		...mapState('settings', ['lastHostname']),
		...mapGetters(['isConnected']),
		...mapState({
			name: state => state.machine.model.network.name,
		}),
		mustConnect() { return !this.isLocal && !this.isConnected; },
	},
	methods: {
		...mapActions(['connect','shutdown','setToolLoading','loadAddresses']),
		...mapActions('machine', ['sendCode', 'getFileList']),
		async loadTools() {
			if (this.loading) {
				return;
			}
			//console.log(this.tools)
			//Object.keys(this.tools).forEach(material => this.tools[material] = [])
			this.tools = {};
			this.loading = true;
			try {
				const response = await this.getFileList(Path.macros+"/_Toolheads");
				if (response){
					let tools = response.filter(item => item.isDirectory).map(item => item.name);
					//console.log(tools);
					let len = tools.length;
					let that = this;
					for (var i = 0; i < len; i++){
						if (!tools[i].includes("CAL")) {
							let response = await this.getFileList(Path.macros+"/_Toolheads/"+tools[i]);
							response.forEach(
								function (tool) {
									if (tool.name.includes("FIL")) {
										tool.ico = "/img/ressources/Medium_universe_FIL.svg"
									}
									if (tool.name.includes("LIQ")) {
										tool.ico = "/img/ressources/Medium_universe_LIQ.svg"
									}
									if (tool.name.includes("PAS")) {
										tool.ico = "/img/ressources/Medium_universe_PAS.svg"
									}
									var material = (tools[i].substring(0,3));
									if (that.tools[material] === undefined){
										that.tools[material] = [];
										//console.log("new material : " + material);
									}
									if (tool.name.startsWith("_Load") && that.tools[material].filter(item => item.name == name).length == 0) {
										var name = tool.name.substring(6, tool.name.lastIndexOf("_"))
										//console.log(name.split("~")[0].split("_"));
										//console.log(name.split("~")[1].split("_"))
										that.tools[material].push({
											'path': Path.macros+"/_Toolheads/"+tools[i]+"/"+tool.name,
											'name': name,
											'ico' : tool.ico,
										});
									}
								});
							} else {
								let response = await this.getFileList(Path.macros+"/_Toolheads/"+tools[i]);
								response.forEach(
									function (tool) {
										//var material = (tools[i].substring(0,tools[i].indexOf('_')));
										if (tool.name.includes("_Load_C")) {
											//console.log(tool.name);
											tool.ico = "/img/ressources/Medium_universe_CAL.svg"
											var name = tools[i].substring(0,3).toUpperCase();
											that.calibrationTool = {
												'path': Path.macros+"/_Toolheads/"+tools[i]+"/"+tool.name,
												'name': name,//tool.name,
												'ico' : tool.ico,
											}
											//console.log(that.calibrationTool)
										}
									});
								}
							}
						}
						//clearTimeout(this.timeout);
						this.timeout = setTimeout(() => {this.waited = true}, 1000);
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
					setTimeout(function(that){that.setToolLoading(true);},0,this)

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
				//console.log(this.exName);
				//console.log(this.name);
				setTimeout(function(that){
					if (that.name != that.exName) {
						that.tools = {};
						that.loadTools();
						setInterval(that.loadAddresses, 5000, that)
						//console.log(that.waited);
						that.waited = false;
						that.exName = that.name;
					}
				}, 1000, this)
			},
			watch: {
				name() {
					//console.log("renamed " + from + " to " + to)
					//clearTimeout(this.timeout);
					if (this.waited) {
						this.waited = false;
						this.tools = {},
						this.loadTools();
					}
					//this.loadAddresses();
					//console.log(this.waited);
				},
				user(as){
					//console.log(as.ifaces);
					this.ifaces = as.ifaces;
				},
				selectedMachine(){
					//console.log(to)
					//this.loadAddresses();
				},
				isReconnecting(){
					//console.log(to?'reconnecting':'reconnected');
				}
			}
		}
		</script>
