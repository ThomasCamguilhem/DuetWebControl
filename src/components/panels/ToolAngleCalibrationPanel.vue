<style scoped>
/* This container is needed to position the front and back side */
.v-card__text{
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.5s;
  transform-style: preserve-3d;
  padding: 5px;
}

.v-icon {
  font-size: 18px;
}

p {
  margin-top:15px;
  margin-bottom: auto;
}

.v-input--switch, .v-btn {
  margin: 6px 5px;
  text-transform: none !important;
}

.toff {
  padding: 0 10px;
  text-align: center;
  border-right: 1px solid darkgray;
  display: inline-block;
  min-width: 200px;
}
.toff input, .tool_angle {
  width: 50px;
  height: 20px;
  text-align: center;
  border: 1px solid black;
  border-radius: 4px;
}

.layout.row {
  margin: 0 auto;
}

</style>
<template>
  <v-expansion-panel :value="isLocal?-1:0" class="z_probe_offset">
    <v-expansion-panel-content>
      <template v-slot:header>
        <div>
            {{ $t('panel.toolAngle.caption') }}
        </div>
      </template>
      <v-card>
        <v-card-text v-if="filePath.length > 0">
          <v-layout row wrap>
            <v-flex v-for="(tool, index) in filePath" v-bind:key="index" :tool="tool" xl4 lg4 md4 sm6 xs12>
              <v-layout column style=" border-right: 1px solid #333; border-bottom: 1px solid #222; margin: 5px; text-align: center; background: #505050;">
                <v-layout row>
                  <span :id="tool.id" v-html="$t('panel.toolAngle.angle', [tool.id])" @click="moveIntoPosition" style="background-color:#757575;padding:1px 5px;border-radius:5px;margin:10px 0;cursor:pointer"></span>
                </v-layout>
                <v-layout column>
                  <v-layout row>
                    {{$t('panel.toolAngle.active')}}&nbsp;<input v-if="!isLocal" class="tool_angle" autocomplete="off" type="number" :value="tool.data.active.s" step="1" off="active" :tnum="index" @blur="handleToolOffsetBlurEvent" @keyup.enter="handleToolOffsetBlurEvent" @focus="sendCode('M280 P7 S'+tool.data.active.s)" />&nbsp;{{ isLocal ? '' : '°' }}
                  </v-layout>
                  <number-control v-if="isLocal" v-model.number="tool.data.active.s" ref="input" :min="0" :max="180" :step="1" @keydown.native="onkeydown" @keyup.enter="toolAngleEvent($event, index, 'active')" @change="toolAngleEvent($event, index, 'active')" @blur="toolAngleEvent($event, index, 'active')" title="Tool n angle" prompt="Please enter target tool angle" :loading="false" :disabled="false" @focus="sendCode('M280 P7 S'+tool.data.active.s)"></number-control>
                  <v-layout row v-if="!isLocal">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn class="btn_tilt" off="active" :tnum="index" dir="d" v-on="on" @click="handleBtnOffsetEvent">
                          <v-icon> arrow_back </v-icon>
                          <span class="content">-1.00°</span>
                        </v-btn>
                      </template>
                      <span> Offsets the tool head by a tiny amount in the X direction (G10 Px Xyy) </span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn class="btn_tilt" off="active" :tnum="index" dir="u" v-on="on" @click="handleBtnOffsetEvent">
                          <span class="content">+1.00°</span>
                          <v-icon> arrow_forward </v-icon>
                        </v-btn>
                      </template>
                      <span> Offsets the tool head by a tiny amount in the X direction (G10 Px Xyy) </span>
                    </v-tooltip><br/>
                  </v-layout>
                </v-layout>
                <v-layout column>
                  <v-layout row>
                    {{$t('panel.toolAngle.standby')}}&nbsp;<input v-if="!isLocal" class="tool_angle" autocomplete="off" type="number" :value="tool.data.unactive.s" step="1" off="unactive" :tnum="index" @blur="handleToolOffsetBlurEvent" @keyup.enter="handleToolOffsetBlurEvent" @focus="sendCode('M280 P7 S'+tool.data.active.s)" />&nbsp;{{ isLocal ? '' : '°' }}
                  </v-layout>
                  <number-control v-if="isLocal" v-model.number="tool.data.unactive.s" ref="input" :min="0" :max="180" :step="1" @keydown.native="onkeydown" @keyup.enter="toolAngleEvent($event, index, 'unactive')" @change="toolAngleEvent($event, index, 'unactive')" @blur="toolAngleEvent($event, index, 'unactive')" title="Tool n angle" prompt="Please enter target tool angle" :loading="false" :disabled="false"></number-control>
                  <v-layout v-if="!isLocal" row>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn class="btn_tilt" off="unactive" :tnum="index" dir="d" v-on="on" @click="handleBtnOffsetEvent">
                          <v-icon> arrow_back </v-icon>
                          <span class="content">-1.00°</span>
                        </v-btn>
                      </template>
                      <span> Offsets the tool head by a tiny amount in the X direction (G10 Px Xyy) </span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn class="btn_tilt" off="unactive" :tnum="index" dir="u" v-on="on" @click="handleBtnOffsetEvent">
                          <span class="content">+1.00°</span>
                          <v-icon> arrow_forward </v-icon>
                        </v-btn>
                      </template>
                      <span> Offsets the tool head by a tiny amount in the X direction (G10 Px Xyy) </span>
                    </v-tooltip><br/>
                  </v-layout>
                </v-layout>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>
<script>
'use strict'

import { mapActions, mapState } from 'vuex'
export default {
  data () {
    return {
      tAngle: undefined,
      filePath:  [{id: "E0" , data: {active: { m: 280, p: 7, s: 0 }, unactive: { m: 280, p: 7, s: 1 }}},
      {id: "E1" , data: {active: { m: 280, p: 7, s: 2 }, unactive: { m: 280, p: 7, s: 3 }}},
      {id: "E2" , data: {active: { m: 280, p: 7, s: 4 }, unactive: { m: 280, p: 7, s: 5 }}}]
    }
  },
  computed: {
    ...mapState(['isLocal', 'connectDialogShown', 'passwordRequired', 'selectedMachine', 'isConnecting']),
    ...mapState({
      name: state => state.machine.model.network.name,
    }),
  },
  methods: {
    ...mapActions('machine', ['getFileList', 'sendCode', 'download', 'upload']),
    preloadToolMatrices: async function() {
      //console.log('load the cfg file');
      try {
        // Load file list and create missing props
        const files = await this.getFileList("0:/macros/_Toolheads/FIL33_175_BD_v1.2.0");
        let tools = files.filter(tool => tool.name.includes("active"))
        //console.log(tools.length ? tools : "");
        let that = this;
        this.filePath = [{id: "E0" , data: {active: { m: 280, p: 7, s: 0 }, unactive: { m: 280, p: 7, s: 0 }}},
        {id: "E1" , data: {active: { m: 280, p: 7, s: 0 }, unactive: { m: 280, p: 7, s: 0 }}},
        {id: "E2" , data: {active: { m: 280, p: 7, s: 0 }, unactive: { m: 280, p: 7, s: 0 }}}]
        await tools.forEach(function(item, index) {
          //console.log(item)
          if (!item.isDirectory)
          {
            //console.log(index);
            setTimeout(that.preloadServoAngle, 500*index, item);
          }
        });
      } catch(e) {
        console.error(e);
      }
    },
    preloadServoAngle: async function(path){
      try {
        let servoPath = path.directory + "/" + path.name;
        const result = await this.download({ filename: servoPath, type: 'text', showSuccess: false });
        let name = path.name.split(" ");
        let data = result.split(" ");
        //console.log(servoPath)
        //console.log(result)
        let item = {};
        item.id = name[0]
        item.data = {}
        item.data[name[1]] = {}
        for( var i = 0; i < data.length; i++) {
          if (data[i].startsWith("P"))
          item.data[name[1]].p = parseInt(data[i].substring(1));
          else if (data[i].startsWith("S"))
          item.data[name[1]].s = parseInt(data[i].substring(1));
          else if (data[i].startsWith("M"))
          item.data[name[1]].m = parseInt(data[i].substring(1));
        }
        let tool = this.filePath.filter(tool => tool.id == item.id)[0]
        this.filePath = this.filePath.filter(tool => tool.id != item.id)
        if (tool != undefined)
        tool.data[name[1]] = item.data[name[1]]
        else
        tool = item
        //console.log(tool)
        this.filePath.push(tool)
        this.filePath.sort((a, b) => (a.id < b.id ? -1 : (a.id > b.id ? 1 : 0)))
        //console.log(this.filePath)
      } catch(e) {
        console.error(e);
      }
    },
    moveIntoPosition: async function(){
      this.sendCode("G1 X0 Y-150 Z300 F3000")
    },
    handleBtnOffsetEvent: async function(e) {
      let that = e.target;
      //console.log("btnOffset clicked")
      while (that.nodeName.toLowerCase() !== "button") {
        that = that.parentElement;
      }
      e.preventDefault();
      if(!that.classList.contains("v-btn--disabled"))
      {
        that.classList.add("v-btn--disabled")
        let attr = that.attributes;
        //console.log(attr)
        var first = attr.tnum.nodeValue
        var act = attr.off.nodeValue
        var angle = (attr.dir.nodeValue == "d" ? -1 : 1)+ this.filePath[first].data[act].s
        console.log(angle)
        clearTimeout(this.toolAngle);
        this.filePath[first].data[act].s = angle
        //that.innerText = this.filePath[first].data[act].s;
        await this.sendCode("M280 P7 S" + this.filePath[first].data[act].s);

        var input = Array.from(document.getElementsByClassName("tool_angle")).filter(input => input.attributes.off.nodeValue === act && input.attributes.tnum.nodeValue === first)[0]
        //console.log(input)
        input.value = angle

        this.toolAngle = setTimeout(this.sendToolAngle, 1000, first, act)
        that.classList.remove("v-btn--disabled")
      }
    },
    handleToolOffsetBlurEvent: async function(e) {
      let that = e.target;
      //console.log("inputOffset blured")
      while (that.nodeName.toLowerCase() !== "input") {
        that = that.parentElement;
      }
      e.preventDefault();
      let attr = that.attributes;
      //console.log(attr)
      var first = attr.tnum.nodeValue
      var act = attr.off.nodeValue
      var angle = parseInt(that.value)
      console.log(angle)
      clearTimeout(this.toolAngle);
      this.filePath[first].data[act].s = angle

      await this.sendCode("M280 P7 S" + this.filePath[first].data[act].s);

      //console.log(first, act)
      this.toolAngle = setTimeout(this.sendToolAngle, 1000, first, act)
    },
    sendToolAngle: async function(first, act) {
      var filename = ("E" + first + " " + act +" servo")
      var filepath = "0:/macros/_Toolheads/FIL33_175_BD_v1.2.0/" + filename
      var out = "M" + this.filePath[first].data[act].m + " P" + this.filePath[first].data[act].p + " S" + this.filePath[first].data[act].s
      //console.log(out)
      const content = new Blob([out]);
      try {
        this.upload({ filename: filepath, content });
        console.log("file saved");
      } catch (e) {
        console.log("Error: " + (e.err == 1 ? "no such file" : "not mounted"));
        console.error(e);// TODO Optionally ask user to save file somewhere else
      }
    },
    toolAngleEvent: async function(temp, index, active) {
      console.log(temp, index, active)

      clearTimeout(this.toolAngle);
      this.filePath[index].data[active].s = temp;
      this.sendCode("M280 P7 S" + this.filePath[index].data[active].s);
      this.toolAngle = setTimeout(this.sendToolAngle, 1000, index, active)

    }
  },
  mounted() {
    setTimeout(this.preloadToolMatrices, 1000*Math.random());
  },
}
</script>
