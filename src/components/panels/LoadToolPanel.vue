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
				{{$t('dialog.confirmShutdown.title')}}
			</v-btn>
			<v-spacer></v-spacer>
			<div v-if="ifaces && ifaces.length > 0" style="font-size: large">
				<div style="border-radius: 50%; display: inline-flex; margin-left: 0; vertical-align: middle; width: 15px; height: 15px" id="state"
				v-bind:style="stateColor"></div>&nbsp;
				{{ ifaces.ip /*(ifaces.filter( iface => iface.ifname == "enp2s0" ).length > 0 ? (ifaces.filter( iface => iface.ifname == "enp1s0" ).length > 0 ? ifaces.filter( iface => iface.ifname == "enp1s0" )[0].addr_info.filter( addr => addr.family == 'inet' )[0].local : 'Disconected') : 'Booting')*/ }}
			</div>
			<v-spacer></v-spacer>
			<emergency-btn class="hidden-xs-only"></emergency-btn>
		</v-layout>
		<img src="/img/ressources/logoLynxter-dark.png" width="200px" style="margin: 50px 50% 0px; left: -100px; position: relative;">
		<h2 class="display-1" style="text-align: center; background: #616161; font-family:'GTAmericaExpandedRegular', sans-serif !important; text-transform: uppercase;letter-spacing: 0.1rem !important; margin: 50px 0 50px;">
			{{ selectedMachine === '[default]' ? $t('dialog.connect.title') : (waited || true ? $t('loadTool.toolhead') : '')}}
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
		<v-tabs v-if="selectedMachine !== '[default]' && waited && tools.length > 0" grow>
			<v-tabs-slider color="primary"></v-tabs-slider>
			<!--v-tab style="width: 0 !important; display: none"></v-tab-->
			<v-tab v-for="(material, key) in tools.filter(mater => mater.tech != 'CAL'  && mater.selected)" :key="key">
				<img :src="material.ico" :alt="key" width="100px" height="100px">
				<br/>{{ material.tech }}
			</v-tab>
			<v-tab-item v-for="(material, key) in tools.filter(mater => mater.tech != 'CAL' && mater.selected)" :key="key">
				<v-list v-if="!loading">
					<v-list-tile v-for="(tool, index) in material.tools.filter(tool => tool.selected)" :key="index" @click="toolClick(tool)" :class="{'toolLocal': isLocal}">
						{{ tool.name }}{{ tool.appro ? '_' + tool.appro : '' }}{{ tool.model ? '_' + tool.model : '' }}{{ tool.opt ? ('~' + tool.opt) : '' }}{{ tool.version ? '_' + tool.version : '' }}
					</v-list-tile>
				</v-list>
			</v-tab-item>
		</v-tabs>
		<v-layout column>
			<v-btn v-if="selectedMachine !== '[default]' && calibrationTool != undefined && calibrationTool != {} && waited && calibrationTool.selected" color="grey darken-3" :loading="loading" @click="toolClick(calibrationTool)">
				<v-icon class="mr-1">build</v-icon> {{ $t('loadTool.calibrationTool') }}
			</v-btn>
		</v-layout>
		<v-btn @click="sheet = !sheet" style="position: fixed; margin: 0 50%; z-index: 1; border-top-left-radius: 88px; border-top-right-radius: 88px; width:88px; heigth:44px; left: -44px" :style="{bottom: (sheet ? '120px' : '0px')}">
			<v-icon style="transition: 0.4s" :style="{transform: sheet ? 'rotate(180deg)' : 'rotate(0deg)'}">keyboard_arrow_up</v-icon>
		</v-btn>
		<div class="text-center">
			<v-bottom-sheet v-model="sheet" :inset="inset" :hide-overlay="hideOverlay" persistent>
				<v-sheet class="text-center" height="120px" style="background-color: #212121;">
					<v-layout column style="position: absolute; bottom: 8px; width: 100%">
						<v-layout row>
							<v-layout column>
								<v-btn v-if="selectedMachine !== '[default]' && DEBUG" color="grey darken-3" :loading="loading" @click="sendCode('M550 PS600D - Debug')">
									<v-icon class="mr-1">launch</v-icon> {{ $t('loadTool.debug') }}
								</v-btn>
								<v-btn v-if="selectedMachine === '[default]' || true" color="grey darken-3"  onclick="location.href = 'http://' + location.host" >
									<v-icon>refresh</v-icon> {{ $t('loadTool.refreshIface') }}
								</v-btn>
							</v-layout>
							<v-layout column>
								<v-btn v-if="selectedMachine !== '[default]' && waited" color="grey darken-3" :loading="loading" @click="enableTool" @confirmed="loadTools">
									<v-icon class="mr-1">visibility</v-icon> {{ $t('loadTool.enableTool') }}
								</v-btn>
								<v-btn v-if="selectedMachine !== '[default]'" color="grey darken-3" :loading="loading" @click="loadTools">
									<v-icon class="mr-1">refresh</v-icon> {{ $t('loadTool.refreshTools') }}
								</v-btn>
							</v-layout>
						</v-layout>
					</v-layout>
				</v-sheet>
			</v-bottom-sheet>
		</div>
		<v-spacer></v-spacer>
		<confirm-dialog :shown.sync="confirmShutdownDialog.shown" :question="confirmShutdownDialog.title" :prompt="confirmShutdownDialog.prompt" @confirmed="shutdown"></confirm-dialog>
		<connection-dialog></connection-dialog>
		<tool-load-dialog :shown.sync="showToolDialog" @confirmed="loadTools"></tool-load-dialog>
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
			confirmShutdownDialog: {
				title: this.$t('dialog.confirmShutdown.title'),
				prompt: this.$t('dialog.confirmShutdown.prompt'),
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
			showToolDialog: false,
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
		stateColor() {
			console.log(this.ifaces);

			function GetNavigatorInfo() {
				var ua= navigator.userAgent, tem,
				M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
				if(/trident/i.test(M[1])){
					tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
					return 'IE '+(tem[1] || '');
				}
				if(M[1]=== 'Chrome'){
					tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
					if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
				}
				M = M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
				if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
				return M.join(' ');
			}
			function CanonicalGradientSupported() {
				var navInfo = GetNavigatorInfo().split(' ')
				switch (navInfo[0]) {
					case 'Edge':
					return navInfo[1] >= 79;
					case 'Chrome':
					return navInfo[1] >= 69;
					default:
					return false;
				}
			}


			if(this.ifaces.filter(iface => iface.ifname == 'enp1s0')[0] &&
			this.ifaces.filter(iface => iface.ifname == 'enp1s0')[0].operstate == 'UP' &&
			this.ifaces.filter(iface => iface.ifname == 'enp2s0')[0] &&
			this.ifaces.filter(iface => iface.ifname == 'enp2s0')[0].operstate == 'UP' ) {
				console.log('green');
				return 'background: green;'
			} else if( this.ifaces.filter(iface => iface.ifname == 'enp1s0')[0] &&
			this.ifaces.filter(iface => iface.ifname == 'enp1s0')[0].operstate == 'UP' ||
			this.ifaces.filter(iface => iface.ifname == 'enp2s0')[0] &&
			this.ifaces.filter(iface => iface.ifname == 'enp2s0')[0].operstate == 'UP' ) {
				console.log('orange')
				return CanonicalGradientSupported() ? 'background: conic-gradient(yellow, orange 10% 90%, yellow);':'background: orange;'
			} else if (this.ifaces.filter(iface => iface.ifname == 'enp1s0')[0] &&
			this.ifaces.filter(iface => iface.ifname == 'enp1s0')[0].operstate == 'DOWN' ||
			this.ifaces.filter(iface => iface.ifname == 'enp2s0')[0] &&
			this.ifaces.filter(iface => iface.ifname == 'enp2s0')[0].operstate == 'DOWN' ) {
				console.log('red')
				return CanonicalGradientSupported() ? 'background: conic-gradient(red, darkred 10% 40%, red, darkred 60% 90%, red);animation-duration: 2s' : 'background: red;'
			} else {
				return 'background: GRAY'
			}
		}
	},
	methods: {
		...mapActions(['connect','shutdown','setToolLoading','loadAddresses']),
		...mapActions('machine', ['sendCode', 'getFileList', 'download']),
		enableTool: function() {
			this.showToolDialog = true;
		},
		async loadTools() {
			if (this.loading) {
				return;
			}
			//console.log(this.tools)
			//Object.keys(this.tools).forEach(material => this.tools[material] = [])
			this.tools = {};
			this.loading = true;
			try {
				this.tools = [];
				this.download({filename: Path.macros+"/selectedTools.json", showSuccess: false, showProgress: false}).then((result) => {
					//const json = JSON.parse(result)
					this.tools = result
					if (this.tools.length > 0) {
						this.calibrationTool = this.tools.filter(tool => tool.tech == "CAL")[0].tools[0];
					}
					//this.$forceUpdate();
				})
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
