<style>
#title:not(:hover) {
	color: inherit;
}
#title {
	margin-right: 20px;
}

.container {
	padding: 4px;
}
.container div.component,
.container div.v-card {
	margin: 8px;
}

.empty-table-fix td {
	padding-left: 0px !important;
	padding-right: 0px !important;
}

.global-control.theme--light {
	background-color: #F5F5F5 !important;
}
#global-container .v-card.theme--light {
	background-color: #F5F5F5 !important;
}
.global-control.theme--dark {
	background-color: #515151 !important;
}
#global-container .v-card.theme--dark {
	background-color: #515151 !important;
}

input[type='number'] {
    -moz-appearance: textfield;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}

a:not(:hover) {
	text-decoration: none;
}

a:hover {
	color: white;
}

.theme--dark textarea {
	caret-color: #FFF;
}

.v-item-group.theme--dark .v-btn__content {
	color: #FFF !important;
}

.v-card__title {
	font-size: 1rem;
}

#clock {
	animation-duration: 10s;
	animation-direction: normal;
	animation-iteration-count: infinite;
	animation-name: addLife;
}

@keyframes addLife {
	0% {
		margin-top: 0px;
	}

	10% {
		margin-top: -21px;
	}

	50% {
		margin-top: -21px;
	}

	60% {
		margin-top: 0px;
	}

	100% {
		margin-top: 0px;
	}
}
</style>

<template>
	<v-app :dark="darkTheme">
		<template v-if="!getTool">
			<load-tool-panel></load-tool-panel>
		</template>
		<template v-if="getTool">
			<v-navigation-drawer persistent clipped v-model="drawer" enable-resize-watcher fixed app>
				<v-list class="pt-0" :expand="$vuetify.breakpoint.mdAndUp || isLocal">
					<v-list-group v-for="(category, index) in routing.filter((category, index) => checkLynxCatCondition(category.showLocal, category.minLevel))" :key="index" :prepend-icon="category.icon" no-action :value="isExpanded(category)">
						<v-list-tile slot="activator">
							<v-list-tile-title>{{ $t(category.caption) }}</v-list-tile-title>
						</v-list-tile>

						<template v-for="(page, pageIndex) in category.pages">
							<v-list-tile v-if="checkMenuCondition(page.condition) && checkLynxCondition(page.showLocal, page.minLevel)" :key="`${index}-${pageIndex}`" v-ripple :to="page.path" @click.prevent>
								<v-list-tile-action>
									<img  v-if="page.img" :src="page.img" width="24" height="24">
									<v-icon v-else>{{ page.icon }}</v-icon>
								</v-list-tile-action>
								<v-list-tile-title>{{ $t(page.caption) }}</v-list-tile-title>
							</v-list-tile>
						</template>
					</v-list-group>
					<v-list-group prepend-icon="power_settings_new" no-action :value="isExpanded(/* category */)" class="hidden-md-and-up">
						<v-list-tile slot="activator">
							<v-list-tile-title>{{ /*$t(category.caption)*/ 'power_settings' }}</v-list-tile-title>
						</v-list-tile>
						<v-list-tile v-if="isLocal">
							<connect-btn class="mb-3" block></connect-btn>
						</v-list-tile>
						<v-list-tile v-if="!isLocal && isLocal">
							<login-btn class="mb-3" block></login-btn>
						</v-list-tile>
						<v-list-tile class="hidden-sm-and-up">
							<emergency-btn block></emergency-btn>
						</v-list-tile>
						<v-list-tile>
							<v-btn block v-if="isLocal" color="" @click="confirmShutdownDialog.shown = !confirmShutdownDialog.shown">
								<v-icon mr-1 >
									power_settings_new
								</v-icon>
								Shutdown printer
							</v-btn>
						</v-list-tile>
						<v-list-tile class="pa-2 hidden-md-and-up" v-if="isLocal" >
							<div style="width: max-content; margin: auto" :style="isLocal?'font-size: large':''">
								<v-btn icon onclick="window.history.back()"><v-icon>arrow_back</v-icon></v-btn>
								<v-btn icon onclick="location.href = 'http://' + location.host"><v-icon>refresh</v-icon></v-btn>
								<v-btn icon onclick="window.history.forward()"><v-icon>arrow_forward</v-icon></v-btn>
							</div>
						</v-list-tile>
					</v-list-group>
				</v-list>

			<div class=" hidden-md-and-up" v-if="true == false">
				<connect-btn v-if="isLocal" class="mb-3" block></connect-btn>
				<emergency-btn class="hidden-sm-and-up" block></emergency-btn>
			</div>
		</v-navigation-drawer>

		<v-toolbar ref="appToolbar" app clipped-left>
			<v-toolbar-side-icon @click.stop="drawer = !drawer" v-tab-control :style="{transform: (isLocal? 'scale(1.75)':'')}"></v-toolbar-side-icon>
			<v-toolbar-title :style="isLocal ? 'margin-left: 10px' : ''">
					<!-- TODO: Optional OEM branding -->
					<a id="title" v-tab-control @click="$router.push('/');" style="font-size: large;">{{ (isLocal?name.substring(8):name) }}</a>
					<!--img src="/img/ressources/logoLynxter-dark.png" style="width:35px;"-->
					<a id="user" v-tab-control style="color: inherit" v-if="!isLocal && isLocal">{{ username }} ({{ type }})</a>
			</v-toolbar-title>
				<status-label v-if="state.status && isLocal" style="font-size: large; letter-spacing: 0.1rem;"></status-label>
				<connect-btn v-if="isLocal" class="hidden-sm-and-down"></connect-btn>
				<!--login-btn v-if="!isLocal || isLocal" class="hidden-sm-and-down"></login-btn-->

				<v-spacer></v-spacer>

				<code-input class="mx-3 hidden-sm-and-down" v-if="!isLocal"></code-input>

				<v-spacer></v-spacer>

				<upload-btn target="start" class="mr-3 hidden-sm-and-down" v-if="!isLocal"></upload-btn>
				<emergency-btn class="hidden-xs-only"></emergency-btn>

				<v-btn icon class="hidden-md-and-up ml-3" :class="toggleGlobalContainerColor" @click="hideGlobalContainer = !hideGlobalContainer" v-if="!isLocal">
					<v-icon>aspect_ratio</v-icon>
				</v-btn>
				<!-- TODO: Add quick actions and UI designer here -->
				<!--<v-btn icon class="hidden-sm-and-down" @click="rightDrawer = !rightDrawer">
					<v-icon>menu</v-icon>
				</v-btn>-->
			</v-toolbar>

			<v-content id="content">
				<v-scroll-y-transition>
					<v-container fluid id="global-container" class="container" v-show="!hideGlobalContainer || $vuetify.breakpoint.mdAndUp" v-if="!isLocal">
						<v-layout row wrap v-if="!isLocal">
							<v-flex xs12 sm3 md4 lg4>
								<status-panel></status-panel>
							</v-flex>

							<v-flex xs12 sm9 md5 lg4>
								<tools-panel></tools-panel>
							</v-flex>

							<v-flex v-if="$vuetify.breakpoint.mdAndUp" d-flex md3 lg4>
								<temperature-chart></temperature-chart>
							</v-flex>
						</v-layout>
					</v-container>
				</v-scroll-y-transition>

				<v-divider v-show="!hideGlobalContainer || $vuetify.breakpoint.mdAndUp"></v-divider>

				<v-container fluid id="page-container" class="container">
					<keep-alive>
						<router-view></router-view>
					</keep-alive>
				</v-container>
			</v-content>
			<template v-if="showDebug">
				{{$route.path}}
			</template>
			<div :style="{'bottom': ((this.$route.path=='/Console'||this.$route.path=='/Settings/Machine') && isLocal?'40px':'10px')}" style="position: fixed;left: -75px; color: white; margin-left: 50%; padding:0 15px; height: 20px; overflow: hidden; width: 150px">
				<div id="clock" style="height: 20px; margin: 0 auto; width: max-content; background: #323232; border-radius: 2px; padding: 0 10px">12:00</div>
				<div v-if="ifaces && ifaces.length > 0" style="width: max-content; margin: 0px auto 10px auto;	background: #323232; border-radius: 2px; padding: 0 10px">
					<div style="border-radius: 50%; display: inline-flex; margin-left: 0; vertical-align: middle; width: 15px; height: 15px" id="state"
					v-bind:style="{ background: ((ifaces.filter(iface => iface.ifname == 'enp1s0')[0] && ifaces.filter(iface => iface.ifname == 'enp1s0')[0].operstate == 'UP' && ifaces.filter(iface => iface.ifname == 'enp2s0')[0] && ifaces.filter(iface => iface.ifname == 'enp2s0')[0].operstate == 'UP' ) ? 'GREEN' : (( ifaces.filter(iface => iface.ifname == 'enp1s0')[0] && ifaces.filter(iface => iface.ifname == 'enp1s0')[0].operstate == 'UP' || ifaces.filter(iface => iface.ifname == 'enp2s0')[0] && ifaces.filter(iface => iface.ifname == 'enp2s0')[0].operstate == 'UP' ) ? 'ORANGE' : ((ifaces.filter(iface => iface.ifname == 'enp1s0')[0] && ifaces.filter(iface => iface.ifname == 'enp1s0')[0].operstate == 'DOWN' || ifaces.filter(iface => iface.ifname == 'enp2s0')[0] && ifaces.filter(iface => iface.ifname == 'enp2s0')[0].operstate == 'DOWN' ) ? 'RED' : 'GRAY'))) }"></div>&nbsp;
					{{ (ifaces.filter( iface => iface.ifname == "enp2s0" ).length > 0 ? (ifaces.filter( iface => iface.ifname == "enp1s0" ).length > 0 ? ifaces.filter( iface => iface.ifname == "enp1s0" )[0].addr_info.filter( addr => addr.family == 'inet' )[0].local : 'Disconected') : 'Booting') }}
				</div>
			</div>

			<!--<v-navigation-drawer temporary right v-model="rightDrawer" fixed app>
				TODO Add quick access / component list here in design mode
			</v-navigation-drawer>-->

			<connect-dialog v-if="selectedMachine === '[default]'"></connect-dialog>
			<connection-dialog></connection-dialog>
			<messagebox-dialog></messagebox-dialog>
			<!--login-dialog></login-dialog-->
			<confirm-dialog :shown.sync="confirmShutdownDialog.shown" :question="confirmShutdownDialog.question" :prompt="confirmShutdownDialog.prompt" @confirmed="shutdown"></confirm-dialog>
		</template>
	</v-app>
</template>

<script>
'use strict'

import Piecon from 'piecon'
import { mapState, mapGetters, mapActions } from 'vuex'

import { Routing } from './routes'

export default {
	computed: {
		...mapState({
			isLocal: state => state.isLocal,
			selectedMachine: state => state.selectedMachine,
			getTool: state => state.user.loadedTool,

			globalShowConnectDialog: state => state.showConnectDialog,
			globalShowLoginDialog: state => state.showLoginDialog,

			isPrinting: state => state.machine.model.state.isPrinting,
			name: state => state.machine.model.network.name,
			level: state => state.user.level,
			type: state => state.user.type,
			username: state => state.user.username,
			darkTheme: state => state.settings.darkTheme,
			webcam: state => state.settings.webcam
		}),
		...mapState(['user']),
		...mapGetters('machine', ['hasTemperaturesToDisplay']),
		...mapGetters('machine/model', ['board', 'isPrinting', 'jobProgress']),
		...mapState('machine/model', ['state']),
		toggleGlobalContainerColor() {
			if (this.hideGlobalContainer) {
				return this.darkTheme ? 'red darken-5' : 'red lighten-4';
			}
			return this.darkTheme ? 'green darken-5' : 'green lighten-4';
		},
		showDebug() {
			return this.isLocal && ((location.port === "8080") || (location.port === "8081"))
		}
	},
	data() {
		return {
			drawer: this.$vuetify.breakpoint.lgAndUp,
			hideGlobalContainer: false,
			rightDrawer: false,
			routing: Routing,
			wasXs: this.$vuetify.breakpoint.xsOnly,
			confirmShutdownDialog: {
				question: 'Shutdown the Printer',
				prompt: "Are you sure you want to shutdown the Printer (this operation will need a restart of the printer after)",
				shown: false
			},
			timeout: -1,
			times: [],
			fps: 0,
			framerate: undefined,
		}
	},
	methods: {
		...mapActions(['connect', 'disconnectAll']),
		...mapActions('machine', ['getFileList']),
		...mapActions('settings', ['load']),
		...mapActions(['loadTool', 'shutdown','loadAddresses']),
		checkMenuCondition(condition) {
			if (condition === 'webcam') {
				return (this.webcam.url !== '');
			}
			if (condition === 'display') {
				return this.board.hasDisplay;
			}
			return true;
		},
		checkLynxCondition(show, level) {
			return !(this.isLocal && !show) && (level === undefined || level <= this.level);
		},
		checkLynxCatCondition(show, level) {
			return !(this.isLocal && !show) && (level === undefined || level <= this.level);
		},
		isExpanded(category) {
			if (this.$vuetify.breakpoint.xsOnly && category) {
				const route = this.$route;
				return category.pages.some(page => page.path === route.path);
			}
			return true;
		},
		updateTitle() {
			const jobProgress = this.jobProgress;
			const title = ((jobProgress > 0 && this.isPrinting) ? `(${(jobProgress * 100).toFixed(1)}%) ` : '') + this.name;
			if (document.title !== title) {
				document.title = title;
			}
		},
		updateClock: function()
		{
			var now = new Date()
			if(document.getElementById("clock"))
			{
				document.getElementById("clock").innerHTML = (now.getHours()<10?"0":"") + now.getHours() + (now.getSeconds()%2?":":" ") + (now.getMinutes()<10?"0":"") + now.getMinutes() /* + (now.getSeconds()%2?":":" ") + (now.getSeconds()<10?"0":"") + now.getSeconds() + "." + now.getMilliseconds(); */
			}
			setTimeout(this.updateClock, (1000 - now.getMilliseconds()))
		},
		refreshLoop: function() {
			window.requestAnimationFrame(() => {
				const now = performance.now();
				while (this.times.length > 0 && this.times[0] <= now - 1000) {
					this.times.shift();
				}
				this.times.push(now);
				this.fps = this.times.length;
				this.refreshLoop();
				this.framerate.innerText = this.fps + ' fps';
			});
		}
	},
	mounted() {
		// Attempt to disconnect from every machine when the page is being unloaded
		window.addEventListener('unload', this.disconnectAll);

		// Connect if running on a board
		if(((location.port === "8080") || (location.port === "8081"))){
			this.connect({hostname: "192.168.1.72"});
		} else if (!this.isLocal || (location.port === "80") || (location.port === "")) {
			this.connect();
		}

		// Attempt to load the settings
		this.load();

		// Validate navigation
		const that = this;
		this.$router.beforeEach((to, from, next) => {
			if (Routing.some(group => group.pages.some(page => page.path === to.path && !that.checkMenuCondition(page.condition)))) {
				next('/');
			} else {
				next();
			}
		});

		const route = this.$route;
		const router = this.$router;
		if (Routing.some(group => group.pages.some(page => page.path === route.path && !this.checkMenuCondition(page.condition)))) {
			this.$router.push('/');
		}
		window.onclick = function() {
			clearTimeout(that.timeout);
			//console.log("click")
			that.timeout = setTimeout(function(){
				if (document.getElementsByClassName("v-dialog--active").length == 0 || document.getElementsByClassName("v-dialog--active")[0].childNodes[0].id != "fileEditDialog")
				{
					if(['pausing', 'paused', 'resuming', 'processing', 'simulating'].indexOf(that.state.status) !== -1)
					router.push('/Job/Status');
					else
					router.push('/');
				} else {
					//console.log(document.getElementsByClassName("v-dialog--active").length == 0)
					//console.log(document.getElementsByClassName("v-dialog--active").length == 0 || document.getElementsByClassName("v-dialog--active")[0].childNodes[0].id != "fileEditDialog");
				}
			}, 1000*60*10);
		}
		//this.$router.push('/');

		// Set up Piecon
		Piecon.setOptions({
			color: '#FDB913',				// Pie chart color
			background: '#403E3D',		// Empty pie chart color
			shadow: '#2D4EA2',				// Outer ring color
			fallback: false				// Toggles displaying percentage in the title bar (possible values - true, false, 'force')
		});
		this.updateClock();


		if(this.showDebug){
			this.framerate = document.createElement('span')
			document.body.append(this.framerate)
			this.framerate.style="position: fixed; color: white; z-index: 5; bottom: 5px; right: 5px; background: #424039; padding: 2px; border-radius: 5px;"
			this.refreshLoop();
		}
	},
	watch: {
		darkTheme(to) {
			this.$vuetify.theme.dark = to;
		},
		isPrinting(to) {
			if (to) {
				// Go to Job Status when a print starts
				this.$router.push('/Job/Status');
			} else {
				Piecon.reset();
			}
		},
		name() {
			this.updateTitle();
			if ((this.name).substring(0,8).includes("S600D")){
				//console.log("new name: " + this.name.substring(8))
				this.loadTool((this.name).substring(8));
			} else {
				this.loadTool();
			}
			this.loadAddresses();
		},
		jobProgress(to) {
			if (to === undefined || to == 1) {
				Piecon.reset();
			} else if (this.isPrinting) {
				Piecon.setProgress(to * 100);
			}
			this.updateTitle();
		},
		user(as){
			//console.log(as);
			this.ifaces = as.ifaces;
		},
	}
}
</script>
