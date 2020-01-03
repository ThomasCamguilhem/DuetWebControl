<style scoped>
.v-card__title, .v-toolbar__title, .v-expansion-panel__header {
  font-family: GTAmericaExpandedRegular, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
}
* {
  transition-duration: 0.25s;
  transition-property: transform;
  transform-origin: 50% 25%
}
</style>
<template>
  <v-layout row wrap>
    <v-flex xs12 sm12 md6 lg6 xl3 order-sm1 order-md1 order-lg1 order-xl1 shrink style="padding: 10px">
      <z-probe-offset></z-probe-offset>
    </v-flex>
		<v-flex xs12 sm12 md12 lg12 xl9 order-sm2 order-md2 order-lg2 order-xl2 shrink style="padding: 10px">
		  <xy-tool-offset></xy-tool-offset>
		</v-flex>
    <v-flex xs12 sm12 md12 lg6 xl4 order-sm3 order-md3 order-lg3 order-xl3 shrink style="padding: 10px">
      <v-expansion-panel :value="isLocal?-1:0" class="z_probe_offset">
        <v-expansion-panel-content>
          <template v-slot:header>
            <div>	{{ $t('panel.webcam.caption') }}</div>
          </template>
          <v-card>
            <v-card-text class="panel-body">
              <div style="width: 480px; height: 480px; margin: 0 auto;">
                <div style="height: 480px; overflow: hidden;">
                  <div id="scaleableDiv" @click="mouseclick" @mouseleave="mouseleave" style="transform: scale(1)">
                    <img style="background: url(/img/ressources/noSignal.gif); background-position-x: center; overflow: hidden; margin-left: -187px" width="853" height="480" id="webcam">
                    <!--video id="video" style="margin-left: -187px; position: relative; bottom: 486px;" width="853" height="480" autoplay ></video-->
                  </div>
                  <svg @click="mouseclick" @mouseleave="mouseleave" @mousemove="mousemove" @mouseenter="mouseenter" v-if="showTarget" height="480" style="position: relative; left: 0px; bottom: 486px;" width="480">
                    <line x1="0" y1="0" x2="480" y2="480" stroke="black" stroke-width="2"></line>
                    <line x1="0" x2="480" y1="480" y2="0" stroke="black" stroke-width="2"></line>
                    <line x1="0" x2="480" y1="240" y2="240" stroke="black" stroke-width="2"></line>
                    <line x1="240" x2="240" y1="0" y2="480" stroke="black" stroke-width="2"></line>
                    <circle cy="240" fill="none" stroke="black" r="050" cx="240" stroke-width="2"></circle>
                    <circle cy="240" fill="none" stroke="black" r="100" cx="240" stroke-width="2"></circle>
                    <circle cy="240" fill="none" stroke="black" r="200" cx="240" stroke-width="4"></circle>
                    <line x1="0" y1="0" x2="480" y2="480" stroke="white"></line>
                    <line x1="0" x2="480" y1="480" y2="0" stroke="white"></line>
                    <line x1="0" x2="480" y1="240" y2="240" stroke="white"></line>
                    <line x1="240" x2="240" y1="0" y2="480" stroke="white"></line>
                    <circle cy="240" fill="none" stroke="white" r="025" cx="240" stroke-width="0.5"></circle>
                    <circle cy="240" fill="none" stroke="white" r="050" cx="240" stroke-width="1.0"></circle>
                    <circle cy="240" fill="none" stroke="white" r="100" cx="240" stroke-width="1.0"></circle>
                    <circle cy="240" fill="none" stroke="white" r="200" cx="240" stroke-width="2.0"></circle>
                  </svg>
                </div>
                <!--v-select v-model="selectR" id="fra" :items="resolutions" :rules="[]" required style="margin-right: 10px; width: 45%; display: inline-flex; bottom: 0; position: sticky;" @change="updateVideo">
	              </v-select>
	              <v-select v-model="selectF" id="res" :items="framerates" :rules="[]" required style="margin-left: 10px; width: 45%; display: inline-flex; bottom: 0; position: sticky;"	@change="updateVideo">
	            	</v-select-->
		          </div>
		        </v-card-text>
		      </v-card>
		    </v-expansion-panel-content>
		  </v-expansion-panel>
		</v-flex>
    <v-flex xs12 sm12 md12 lg12 xl8 order-sm4 order-md4 order-lg4 order-xl4 shrink style="padding: 10px">
      <tool-angle-calib></tool-angle-calib>
    </v-flex>
		<v-flex xs12 sm12 md6 lg6 xl3 order-sm5 order-md1 order-lg1 order-xl5 shrink style="padding: 10px">
		  <xy-tilt-panel></xy-tilt-panel>
		</v-flex>
		<v-flex xs12 sm12 md12 lg9 xl9 order-sm6 order-md6 order-lg6 order-xl6 shrink style="padding: 10px">
		  <tool-pid-panel></tool-pid-panel>
		</v-flex>
		<v-flex xs12 sm12 md12 lg12 xl8 order-sm7 order-md7 order-lg7 order-xl7 shrink>
		  <movement-panel></movement-panel>
		</v-flex>
</v-layout>
</template>
<script>
'use strict'

import { mapState } from 'vuex'
import axios from 'axios'

export default {
  data() {
    return {
			//Object.keys(table).forEach(index => !isNaN(index) ? console.log(index + ": " + table[index]): null)
      resolutions4_3: {0: "160x120", 1: "320x240", 2: "640x480", 3: "800x600", 4: "960x720", 5: "1024x576", 6: "1600x896",
			"240p": "320x240", "480p": "640x480", "720p": "960x720"},
      resolutions16_9: {0: "160x90", 1: "176x144", 2: "320x180", 3: "352x288", 4: "432x240", 5: "640x360", 6: "800x448", 7: "864x480", 8: "1280x720", 9: "1920x1080",
			'144p': "176x144", '240p': "432x240", '360p': "640x360", '480p': "864x480", '720p': "1280x720", '1080p': "1920x1080"},
      framerates: {'2fps': 2, '5fps': 5, '10fps': 10, '15fps': 15, '25fps': 25, '30fps': 30},
      selectF: undefined,
      selectR: undefined,
      timeoutVideo: undefined,
      axios: undefined,
      showTarget: false,
    }
  },
  computed: {
    ...mapState(['selectedMachine', 'isLocal']),
  },
  methods: {
    updateVideo: function() {
      if(this.selectF && this.selectR) {
        clearTimeout(this.timeoutVideo);
        //console.log(this.selectR+"@"+this.selectF)
        this.timeoutVideo = setTimeout(async function(that, res, fra){
          if (!that.axios){
            //let protocol = location.protocol;
            that.axios = await axios.create({
              baseURL:`http://`+that.selectedMachine+`/`,
              //cancelToken: BaseConnector.getCancelSource().token,
              timeout: 8000,	// default session timeout in RepRapFirmware
              withCredentials: true,
            });
          }

          that.axios.get('pc_webcam', {
            withCredentials: true,
            params: {fra: fra, res: res}
          });
        }, 1000, this, this.selectR, this.selectF)
      }
    },
    mouseclick: async function(e) {
      console.log(e)
      let event = document.getElementById('scaleableDiv')
      let scale = parseFloat(event.style.transform.substr(6,1));
      console.log('mouse clicked');
      console.log(scale*=2);
      console.log(e.layerX + (e.target.style.marginLeft?e.target.style.marginLeft:0), e.layerY)
      event.style.transformOrigin = e.layerX+parseInt(e.target.style.marginLeft?e.target.style.marginLeft:0) + "px " +  e.layerY + "px"
      console.log(event.style.transformOrigin)
      if (!this.axios){
        this.axios = await axios.create({
          baseURL:`http://`+this.selectedMachine+`/`,
          //cancelToken: BaseConnector.getCancelSource().token,
          timeout: 8000,	// default session timeout in RepRapFirmware
          withCredentials: true,
        });
      }
      if (scale == 2) {
        /*const response = */
        this.axios.get('pc_webcam', {
          withCredentials: true,
          //params: {fra: this.framerates['25fps'], res: this.resolutions16_9['480p']}
          params: {fra: this.framerates['15fps'], res: this.resolutions16_9['720p']}
        });
      } else if(scale == 4) {
        /*const response =*/
        this.axios.get('pc_webcam', {
          withCredentials: true,
          params: {fra: this.framerates['5fps'], res: this.resolutions16_9['1080p']}
        });
      } else if(scale == 8) {
        /*const response = */
        this.axios.get('pc_webcam', {
          withCredentials: true,
          params: {fra: this.framerates['30fps'], res: this.resolutions16_9['360p']}
        });
      }
      if (scale <= 4) {
        event.style.transform = "scale(" + scale + ")"
      } else {
        event.style.transform = "scale(1)"
      }
    },
    mouseenter: async function(e) {
      //console.log(e)
      console.log('mouse entered');

      if (document.getElementById('scaleableDiv').style.transform != "scale(1)") {
        if (!this.axios){
          //let protocol = location.protocol;
          this.axios = await axios.create({
            baseURL:`http://`+this.selectedMachine+`/`,
            //cancelToken: BaseConnector.getCancelSource().token,
            timeout: 8000,	// default session timeout in RepRapFirmware
            withCredentials: true,
          });
        }

        let event = document.getElementById('scaleableDiv')
        let scale = parseFloat(event.style.transform.substr(6,1));

        if (scale == 2) {
          /*const response = */
          this.axios.get('pc_webcam', {
            withCredentials: true,
            //params: {fra: this.framerates['25fps'], res: this.resolutions16_9['480p']}
            params: {fra: this.framerates['15fps'], res: this.resolutions16_9['720p']}
          });
        } else if(scale == 4) {
          /*const response =*/
          this.axios.get('pc_webcam', {
            withCredentials: true,
            params: {fra: this.framerates['5fps'], res: this.resolutions16_9['1080p']}
          });
        } else if(scale == 8) {
          /*const response = */
          this.axios.get('pc_webcam', {
            withCredentials: true,
            params: {fra: this.framerates['30fps'], res: this.resolutions16_9['360p']}
          });
        }
      }
    },
    mouseleave: async function(e) {
      //console.log(e)
      console.log('mouse left');
      //console.log(this.resolutions16_9['360p'], this.framerates['30fps'])
      if (document.getElementById('scaleableDiv').style.transform != "scale(1)") {
        //document.getElementById('scaleableDiv').style.transform = "scale(1)"
        if (!this.axios){
          //let protocol = location.protocol;
          this.axios = await axios.create({
            baseURL:`http://`+this.selectedMachine+`/`,
            //cancelToken: BaseConnector.getCancelSource().token,
            timeout: 8000,	// default session timeout in RepRapFirmware
            withCredentials: true,
          });
        }

        this.axios.get('pc_webcam', {
          withCredentials: true,
          params: {fra: this.framerates['30fps'], res: this.resolutions16_9['360p']}
        });
      }
    },
    mousemove: async function(e) {
      let event = document.getElementById('scaleableDiv')
      let scale = parseFloat(event.style.transform.substr(6,1));
      if (scale != 1) {
        //console.log(e)
        //console.log('mouse moved');
        //console.log(scale*=2);
        //console.log(e.layerX + (e.target.style.marginLeft?e.target.style.marginLeft:0), e.layerY)
        event.style.transformOrigin = e.layerX+parseInt(e.target.style.marginLeft?e.target.style.marginLeft:0) + "px " +  e.layerY + "px"
        //console.log(event.style.transformOrigin)
      }
    }
  },
  mounted: async function(){
    var img = new Image();
    let that = this;
    img.onload = function() {
      //console.log(that.resolutions.includes(this.width + 'x' + this.height))
      //if (that.resolutions16_9.includes(this.width + 'x' + this.height))
      //that.selectR = this.width + 'x' + this.height
      console.log(this.width + 'x' + this.height);
      clearTimeout(that.webcamInter);
        document.getElementById('webcam').src = 'http://'+that.selectedMachine+':8080/?action=stream&dummy='+Math.random()
      that.webcamInter = setInterval(async function(that) {
        if(document.getElementById('webcam')) {
          document.getElementById('webcam').src = 'http://'+that.selectedMachine+':8080/?action=stream&dummy='+Math.random()
        }
      }, 5000, that);

      that.showTarget = true;
      img.onload = undefined;
    }
    /*that.webcamInter = setTimeout(function () {
      console.log('on error')
      // Grab elements, create settings, etc.
      var video = document.getElementById('video');

      // Get access to the camera!
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Not adding `{ audio: true }` since we only want video now
        navigator.mediaDevices.getUserMedia({
          video: {width: {exact: 1280}, height: {exact: 720}}
        }).then(function(stream) {
          //video.src = window.URL.createObjectURL(stream);
          video.srcObject = stream;
          video.play();
          //setTimeout(snapPict, 50)
        }).catch(e => console.error(e.name + ":\n\t" + e.message));
      }
    }, 1000)*/
    img.src = 'http://'+this.selectedMachine+':8080/?action=snapshot'
    console.log(img)
  }
}
</script>
