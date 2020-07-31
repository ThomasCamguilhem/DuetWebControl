<template>
	<v-layout row justify-center>
		<v-dialog v-model="shown" max-width="600px">
			<v-card>
				<v-form ref="form" @submit.prevent="apply">
					<v-card-title>
						<span class="headline">{{ $t('dialog.meshEdit.title') }}</span>
					</v-card-title>
					<v-card-text>
						<v-tabs v-model="active" grow>
							<v-tabs-slider color="primary"></v-tabs-slider>
							<v-tab key="cartesian">
								<div style="border: 2px solid white; width: 100px; height: 100px; margin: 0px auto ;overflow: hidden; margin-bottom: 10px;">
									<img src="/img/ressources/grid-icon.png" alt="" width="100px" height="100px" style="width: 120px; margin-left: -6px; height: 120px; margin-top: -6px; filter: invert(100%); background: #B0B0B0">
								</div>
								{{ $t('dialog.meshEdit.rectangle') }}
							</v-tab>
							<v-tab key="delta">
								<div style="border: 2px solid white; width: 100px; height: 100px; margin: 0px auto ;overflow: hidden; border-radius: 50%; margin-bottom: 10px;">
									<img src="/img/ressources/grid-icon.png" alt="" width="100px" height="100px" style="width: 120px; margin-left: -11px; height: 120px; margin-top: -11px; filter: invert(100%); background: #B0B0B0">
								</div>
								{{ $t('dialog.meshEdit.circle') }}
							</v-tab>
							<v-tab-item key="cartesian">
								<v-layout wrap>
									<v-flex xs12 sm6 md6>
										<v-text-field type="number" :label="$t('dialog.meshEdit.startCoordinate', ['X'])" v-model.number="minX" required></v-text-field>
									</v-flex>
									<v-flex xs12 sm6 md6>
										<v-text-field type="number" :label="$t('dialog.meshEdit.endCoordinate', ['X'])" v-model.number="maxX" required></v-text-field>
									</v-flex>
									<v-flex xs12 sm6 md6>
										<v-text-field type="number" :label="$t('dialog.meshEdit.startCoordinate', ['Y'])" v-model.number="minY" required></v-text-field>
									</v-flex>
									<v-flex xs12 sm6 md6>
										<v-text-field type="number" :label="$t('dialog.meshEdit.endCoordinate', ['Y'])" v-model.number="maxY" required></v-text-field>
									</v-flex>
									<v-flex xs12 sm6 md6>
										<v-text-field type="number" :label="$t('dialog.meshEdit.spacingDirection', ['X'])" v-model.number="spacingX" required></v-text-field>
									</v-flex>
									<v-flex xs12 sm6 md6>
										<v-text-field type="number" :label="$t('dialog.meshEdit.spacingDirection', ['Y'])" v-model.number="spacingY" required></v-text-field>
									</v-flex>
								</v-layout>
							</v-tab-item>
							<v-tab-item key="delta">
								<v-layout wrap>
									<v-flex xs12 sm6 md6>
										<v-text-field type="number" :label="$t('dialog.meshEdit.radius')" v-model.number="radius" required></v-text-field>
									</v-flex>
									<v-flex xs12 sm6 md6>
										<v-text-field type="number" :label="$t('dialog.meshEdit.spacing')" v-model.number="spacing" :rules="[isValid]" required></v-text-field>
									</v-flex>
								</v-layout>
							</v-tab-item>
						</v-tabs>
						<v-layout wrap>
							<v-flex xs12 sm6 md6>
								<v-text-field type="number" :label="$t('dialog.meshEdit.bed')" v-model.number="bedTemp" required></v-text-field>
							</v-flex>
							<v-flex xs12 sm6 md6>
								<v-text-field type="number" :label="$t('dialog.meshEdit.chamber')" v-model.number="chamberTemp" required></v-text-field>
							</v-flex>
						</v-layout>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary darken-1" flat @click="hide">{{ $t('generic.cancel') }}</v-btn>
						<v-btn color="primary darken-1" flat type="submit">{{ $t('generic.ok') }}</v-btn>
					</v-card-actions>
				</v-form>
			</v-card>
		</v-dialog>
	</v-layout>
</template>

<script>
'use strict'

import { mapState, mapActions } from 'vuex'

export default {
	computed: mapState('machine/model', {
		geometry: state => state.move.geometry.type
	}),
	data() {
		return {
			active: 0,

			radius: 150,
			spacing: 15,

			minX: 0,
			maxX: 200,
			minY: 0,
			maxY: 200,
			spacingX: 20,
			spacingY: 20,

			bedTemp: 0,
			chamberTemp: 0,
		}
	},
	props: {
		shown: {
			type: Boolean,
			required: true
		}
	},
	methods: {
		...mapActions('machine', ['sendCode']),
		apply() {
			if (this.$refs.form.validate()) {
				this.hide();

				this.sendCode(`M141 S${this.chamberTemp}\nM190 R${this.bedTemp}\nM191 S${this.chamberTemp}`);
				// foutre le BL touch maintenant
				if (this.geometry === 'delta') {
					this.sendCode(`M557 R${this.radius} S${this.spacing}`);
				} else {
					this.sendCode(`M557 X${this.minX}:${this.maxX} Y${this.minY}:${this.maxY} S${this.spacingX}:${this.spacingY}`);
				}
			}
		},
		isValid() {
			let radius = Math.floor( ( this.radius - 0.1 ) / this.spacing ) * this.spacing
			let x = {min: -radius, max: radius+0.1}
			let y = {min: -radius, max: radius+0.1}
			let nbX = (x.max - x.min > 1 && this.spacing > 0.1) ? Math.floor((x.max - x.min)/this.spacing) + 1 : 0
			let nbY = (y.max - y.min > 1 && this.spacing > 0.1) ? Math.floor((y.max - y.min)/this.spacing) + 1 : 0
			let nbPts = nbX * nbY
			return nbPts <= 441 ? nbPts <= 441 : 'Too many points'
		},
		hide() {
			this.$emit('update:shown', false);
		}
	}
}
</script>
