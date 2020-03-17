<style>
.move-btn {
	padding-left: 0;
	padding-right: 0;
	min-width: 0;
}

.center-menu-item > div {
	justify-content: center;
}

.local {
	font-size: large;
}
</style>

<template>
	<v-card>
		<v-card-title class="pt-2 pb-0" :class="{local: isLocal}">
			<code-btn color="primary darken-1" small code="G28" :title="$t('button.home.titleAll')" class="ml-0 hidden-sm-and-down" :disabled="disabled">
				{{ $t('button.home.captionAll') }}
			</code-btn>
			<code-btn color="primary darken-1" small code="M98 P0:/macros/_Machine/_Park position" :title="'Move the toolhead into it\'s parking position'" class="ml-0 hidden-sm-and-down" :disabled="disabled">
				{{ $t('button.parkHead.caption') }}
			</code-btn>

			<v-spacer class="hidden-sm-and-down"></v-spacer>

			<v-icon small class="mr-1">swap_horiz</v-icon>
			{{ $t('panel.movement.caption') }}

			<v-spacer></v-spacer>

			<v-menu offset-y left :disabled="uiFrozen || disabled" v-tab-control :close-on-content-click="false">
				<template slot="activator">
					<v-btn color="primary darken-1" small class="mx-0" :disabled="uiFrozen">
						{{ $t('panel.movement.compensation') }} <v-icon>arrow_drop_down</v-icon>
					</v-btn>
				</template>

				<v-card>
					<v-list>
						<template v-if="move.compensation">
							<v-list-tile class="center-menu-item">
								{{ $t('panel.movement.compensationInUse', [move.compensation]) }}
							</v-list-tile>

							<v-divider></v-divider>
						</template>

						<v-list-tile @click="sendCode('G32')">
							<v-icon class="mr-1">view_module</v-icon> {{ $t(move.geometry.type === 'delta' ? 'panel.movement.runDelta' : 'panel.movement.runBed') }}
						</v-list-tile>
						<v-list-tile :disabled="false" @click="nozzleHeightCalib">
							<v-icon class="mr-1">vertical_align_bottom</v-icon> {{ $t('panel.movement.runNozzleHeight') }}
						</v-list-tile>
						<v-expansion-panel :value="-1" style="margin-bottom: 15px">
							<v-expansion-panel-content style="background: #ffffff0f">
								<template v-slot:header style="padding: 0">
									<span style="font-size: normal;">
										{{ $t('panel.settingsNetwork.advanced' )}}
									</span>
								</template>
								<v-card style="background: #4d4d4d; padding: 0 20px">
									<v-list-tile :disabled="!move.compensation || move.compensation.indexOf('Point') === -1" @click="sendCode('M561')">
										<v-icon class="mr-1">clear</v-icon> {{ $t('panel.movement.disableBedCompensation') }}
									</v-list-tile>
									<v-divider></v-divider>
									<v-list style="background: #4d4d4d;">
										<v-list-tile @click="sendCode('G29')">
											<v-icon class="mr-1">grid_on</v-icon> {{ $t('panel.movement.runMesh') }}
										</v-list-tile>
										<v-list-tile @click="showMeshEditDialog = true">
											<v-icon class="mr-1">edit</v-icon> {{ $t('panel.movement.editMesh') }}
										</v-list-tile>
										<v-list-tile @click="sendCode('G29 S1')">
											<v-icon class="mr-1">save</v-icon> {{ $t('panel.movement.loadMesh') }}
										</v-list-tile>
										<v-list-tile @click="$router.push('/Heightmap')">
											<v-icon class="mr-1">grid_on</v-icon> {{ $t('panel.movement.showHeightmap') }}
										</v-list-tile>
										<v-list-tile :disabled="move.compensation !== 'Mesh'" @click="sendCode('G29 S2')">
											<v-icon class="mr-1">grid_off</v-icon> {{ $t('panel.movement.disableMeshCompensation') }}
										</v-list-tile>
									</v-list>
								</v-card>
							</v-expansion-panel-content>
						</v-expansion-panel>
					</v-list>
				</v-card>
			</v-menu>
		</v-card-title>

		<v-card-text class="pt-0 pb-2">
			<!-- Mobile home buttons -->
			<v-layout justify-center row wrap class="hidden-md-and-up">
				<v-flex>
					<v-layout row>
						<code-btn color="primary darken-1" code="G28" :title="$t('button.home.titleAll')" v-bind:class="{local: isLocal}" block :disabled="disabled">
							{{ $t('button.home.captionAll') }}
						</code-btn>
						<code-btn color="primary darken-1"  code="M98 P0:/macros/_Machine/_Park position" :title="'Move the toolhead into it\'s parking position'" v-bind:class="{local: isLocal}" block style="margin: 6px" :disabled="disabled">
							{{ $t('button.parkHead.caption') }}
						</code-btn>
					</v-layout>
				</v-flex>
				<v-flex v-if="false" v-for="axis in displayedAxes" :key="axis.letter">
					<code-btn :color="axis.homed ? 'primary darken-1' : 'warning'" :disabled="uiFrozen" :title="$t('button.home.title', [axis.letter])" :code="`G28 ${axis.letter}`" block>

						{{ $t('button.home.caption', [axis.letter]) }}
					</code-btn>
				</v-flex>
			</v-layout>

			<v-layout row>
				<!-- Regular home buttons -->
				<v-flex shrink class="hidden-sm-and-down" v-if="move.geometry.type !== 'delta'">
					<v-layout column>
						<v-flex v-for="axis in displayedAxes" :key="axis.letter">
							<code-btn :color="axis.homed ? 'primary darken-1' : 'warning'" :disabled="uiFrozen || disabled" :title="$t('button.home.title', [axis.letter])" :code="`G28 ${axis.letter}`" class="ml-0">
								{{ $t('button.home.caption', [axis.letter]) }}
							</code-btn>
						</v-flex>
					</v-layout>
				</v-flex>

				<!-- Jog control -->
				<v-flex>
					<v-layout row wrap>
						<!-- Decreasing movements -->
						<v-flex>
							<v-layout row>
								<!-- Decreasing movements -->
								<v-flex v-for="index in numMoveSteps" :key="-index" :class="getMoveCellClass(index - 1)">
									<v-layout column>
										<v-flex v-for="axis in displayedAxes" :key="axis.letter">
											<code-btn :code="`G91\nG1 ${axis.letter}${-moveSteps(axis.letter)[index - 1]} F${Math.round(moveFeedrate * 60)}\nG90`" no-wait @contextmenu.prevent="showMoveStepDialog(axis.letter, index - 1)" block class="move-btn"  v-bind:class="{local: isLocal}" :disabled="disabled">
												<v-icon>keyboard_arrow_left</v-icon> {{ axis.letter + -moveSteps(axis.letter)[index - 1] }}
											</code-btn>
										</v-flex>
									</v-layout>
								</v-flex>
							</v-layout>
						</v-flex>

						<v-flex shrink class="hidden-sm-and-down px-1"></v-flex>

						<!-- Increasing movements -->
						<v-flex>
							<v-layout row>
								<v-flex v-for="index in numMoveSteps" :key="index" :class="getMoveCellClass(numMoveSteps - index)">
									<v-layout column>
										<v-flex v-for="axis in displayedAxes" :key="axis.letter">
											<code-btn :code="`G91\nG1 ${axis.letter}${moveSteps(axis.letter)[numMoveSteps - index]} F${Math.round(moveFeedrate * 60)}\nG90`" no-wait @contextmenu.prevent="showMoveStepDialog(axis.letter, numMoveSteps - index)" block class="move-btn"  v-bind:class="{local: isLocal}" :disabled="disabled">
												{{ axis.letter + '+' + moveSteps(axis.letter)[numMoveSteps - index] }} <v-icon>keyboard_arrow_right</v-icon>
											</code-btn>
										</v-flex>
									</v-layout>
								</v-flex>
							</v-layout>
						</v-flex>
					</v-layout>
				</v-flex>
			</v-layout>
		</v-card-text>

		<mesh-edit-dialog :shown.sync="showMeshEditDialog"></mesh-edit-dialog>
		<input-dialog :shown.sync="moveStepDialog.shown" :title="$t('dialog.changeMoveStep.title')" :prompt="$t('dialog.changeMoveStep.prompt')" :preset="moveStepDialog.preset" is-numeric-value @confirmed="moveStepDialogConfirmed"></input-dialog>

		<v-alert v-if="unhomedAxes.length" :value="true" type="warning">
			{{ $tc('panel.movement.axesNotHomed', unhomedAxes.length) }}
			<strong>
				{{ unhomedAxes.map(axis => axis.letter).reduce((a, b) => `${a}, ${b}`) }}
			</strong>
		</v-alert>

		<v-alert :value="!move.axes.length" type="info">
			{{ $t('panel.movement.noAxes') }}
		</v-alert>
	</v-card>
</template>

<script>
'use strict'

import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export default {
	computed: {
		...mapGetters(['isConnected', 'uiFrozen']),
		...mapState('machine/model', ['move']),
		...mapState('machine/settings', ['moveFeedrate']),
		...mapState(['isLocal']),
		...mapGetters('machine/settings', ['moveSteps', 'numMoveSteps']),
		displayedAxes() { return this.move.axes.filter(axis => axis.visible); },
		unhomedAxes() { return this.move.axes.filter(axis => axis.visible && !axis.homed); },
		...mapState({
			name: state => state.machine.model.network.name,
		}),
		...mapState('machine/model', {
			disabled: (state) => {state = state.state; return ['updating', 'off', 'halted', 'pausing', 'resuming', 'processing', 'simulating', 'busy', 'changingTool'].indexOf(state.status) >= 0}
		}),
		//['updating', 'off', 'halted', 'pausing', 'paused', 'resuming', 'processing', 'simulating', 'busy', 'changingTool', 'idle']
	},
	data() {
		return {
			dropdownShown: false,
			showMeshEditDialog: false,
			moveStepDialog: {
				shown: false,
				axis: 'X',
				index: 0,
				preset: 0
			}
		}
	},
	methods: {
		...mapActions('machine', ['getFileList', 'sendCode']),
		...mapMutations('machine/settings', ['setMoveStep']),
		getMoveCellClass(index) {
			let classes = '';
			if (index === 0 || index === 5) {
				classes += 'hidden-lg-and-down';
			}
			if (index > 1 && index < 4 && index % 2 === 1) {
				classes += 'hidden-md-and-down';
			}
			return classes;
		},
		showMoveStepDialog(axis, index) {
			this.moveStepDialog.axis = axis;
			this.moveStepDialog.index = index;
			this.moveStepDialog.preset = this.moveSteps(this.moveStepDialog.axis)[this.moveStepDialog.index];
			this.moveStepDialog.shown = true;
		},
		moveStepDialogConfirmed(value) {
			this.setMoveStep({ axis: this.moveStepDialog.axis, index: this.moveStepDialog.index, value });
		},
		nozzleHeightCalib: async function() {
			console.log("Running Nozzle Height");
			const files = await this.getFileList("0:/macros/_Toolheads");
			let name = this.name.substr(8, 5);
			let vers = this.name.substr(this.name.lastIndexOf('v')+1);
			let tools = files.filter(tool => tool.name.includes(name) && tool.name.includes(vers))
			console.log(name)
			console.log(vers)
			console.log(tools.length ? tools : "");
			let that = this;
			tools.forEach(function(item) {
				if (item.isDirectory)
				{
					console.log(item);
					that.preloadToolMatrix(item.directory + "/" + item.name)
				}
			});
		},
		preloadToolMatrix: async function(path){
			try {
				let files = await this.getFileList(path);
				let name = (this.name.lastIndexOf("~")>0?this.name.substr(this.name.lastIndexOf("~")+1, 2):"");
				console.log(name)
				files = files.filter(file => file.name.includes("Nozzle") && file.name.includes(name))
				console.log(files);
				let that = this;
				files.forEach(function (file) {
					if(file != undefined && file.name.includes("Nozzle")) {
						that.sendCode('M98 P' + files[0].directory + "/" + files[0].name)
					}
				});
			} catch(e) {
				console.error(e);
			}
		},
	},
	watch: {
		isConnected() {
			// Hide dialogs when the connection is interrupted
			this.showMeshEditDialog = false;
			this.moveStepDialog.shown = false;
		}
	}
}
</script>
