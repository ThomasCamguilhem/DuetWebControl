<style scoped>
.toff {
  padding: 0 10px;
  text-align: center;
  border-right: 1px solid darkgray;
  display: inline-block;
  min-width: 200px;
}
.toff input, .tool_offset {
  width: 50px;
  height: 20px;
  text-align: center;
  border: 1px solid black;
  border-radius: 4px;
}

.layout.row {
  margin: 0 auto;
}

.v-divider {
  margin: 5px 0px 10px;
}
</style>

<template class="panel panel-default">
  <v-expansion-panel :value="isLocal?-1:0" class="z_probe_offset">
    <v-expansion-panel-content>
      <template v-slot:header>
        <div>
          {{ $t('panel.toolOffset.captionXY') }}
        </div>
      </template>
      <v-card>
        <v-card-text class="panel-body">
          <v-flex style="display: inline-flex; width: 100%;">
            <span class="input-group-text" id="basic-addon1" style="font-size: 18px; margin-top: 16px; margin-right: 20px;"> {{ $t('panel.toolOffset.tool') }} : </span>
            <v-select v-model="select" id="hname" :items="tools" :rules="[]" required style="width: 80%" @change="loadToolMatrix">
            </v-select>
          </v-flex>
          <br/>
          <v-layout row wrap>
            <v-flex v-for="(tool, index) in toolHeads" :key="tool.t" xl4 lg4 md4 sm6 xs12>
              <v-layout column style="border-right: 1px solid #333; border-bottom: 1px solid #222; margin: 5px; text-align: center; background: #505050;" v-if="!tool.hide">
                <v-layout style="font-size: larger;" row>
                  <span v-html="$t('panel.toolOffset.offset', [''])"></span>&nbsp;<strong @click="targetTool" :id="tool.t"> T{{tool.t}}</strong>
                  <span style="color: darkgray;" v-for="sec in tool.sec" :key="sec">
                    , T{{toolHeads[sec].t}}
                  </span>
                </v-layout>
                <v-divider></v-divider>
                <v-layout column>
                  <v-layout row>
                      <span v-html="$t('panel.toolOffset.offset', ['X'])"></span>&nbsp; <input v-if="!isLocal" class="tool_offset" autocomplete="off" type="number" :value="(relative?(tool.x-toolHeads[0].x):tool.x)" step="0.01" off="x" :tnum="index" v-bind:class="{disabled: (index == 0)}" @blur="handleToolOffsetBlurEvent" @keyup.enter="handleToolOffsetBlurEvent"/>&nbsp;{{ isLocal? '' : 'mm' }}
                  </v-layout>
                  <number-control v-if="isLocal" v-model.number="tool.x" ref="input" :min="-100" :max="100" :step="0.05" @keydown.native="onkeydown" @keyup.enter="toolOffsetEvent($event, index, tool)" @change="toolOffsetEvent($event, index, tool, 'x')" @blur="toolOffsetEvent($event, index, tool)" :title="'Tool ' + tool.t + ' X offset'" prompt="Please enter target tool offset" :loading="false" :disabled="false" :precision="2" ></number-control>
                  <v-layout row v-if="!isLocal">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn class="btn_tilt" off="x" :tnum="index" dir="d" v-on="on" @click="handleBtnOffsetEvent" v-bind:class="{'v-btn--disabled': (index == 0 && relative)}">
                          <span class="content">-0.01mm</span>
                          <v-icon> arrow_left </v-icon>
                        </v-btn>
                      </template>
                      <span> Offsets the tool head by a tiny amount in the X direction (G10 Px Xyy) </span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn class="btn_tilt" off="x" :tnum="index" dir="u" v-on="on" @click="handleBtnOffsetEvent" v-bind:class="{'v-btn--disabled': (index == 0 && relative)}">
                          <span class="content">+0.01mm</span>
                          <v-icon> arrow_right </v-icon>
                        </v-btn>
                      </template>
                      <span> Offsets the tool head by a tiny amount in the X direction (G10 Px Xyy) </span>
                    </v-tooltip><br/>
                  </v-layout>
                </v-layout>
                <v-layout column>
                  <v-layout row>
                      <span v-html="$t('panel.toolOffset.offset', ['Y'])"></span>&nbsp; <input v-if="!isLocal" class="tool_offset" autocomplete="off" type="number" :value="(relative?(tool.y-toolHeads[0].y):tool.y)" step="0.01" off="y" :tnum="index" tsec="{2}" @blur="handleToolOffsetBlurEvent" @keyup.enter="handleToolOffsetBlurEvent"/>&nbsp;{{ isLocal? '' : 'mm' }}
                  </v-layout>
                  <number-control v-if="isLocal" v-model.number="tool.y" ref="input" :min="-100" :max="100" :step="0.05" @keydown.native="onkeydown" @keyup.enter="toolOffsetEvent($event, index, tool)" @change="toolOffsetEvent($event, index, tool, 'y')" @blur="toolOffsetEvent($event, index, tool)" :title="'Tool '+tool.t+' Y offset'" prompt="Please enter target tool offset" :loading="false" :disabled="false" :precision="2"></number-control>
                  <v-layout v-if="!isLocal" row>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn class="btn_tilt" off="y" :tnum="index" dir="d" v-on="on" @click="handleBtnOffsetEvent" v-bind:class="{'v-btn--disabled': (index == 0 && relative)}">
                          <span class="content">-0.01mm</span>
                          <v-icon> arrow_left </v-icon>
                        </v-btn>
                      </template>
                      <span> Offsets the tool head by a tiny amount in the Y direction (G10 Px Yyy) </span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn class="btn_tilt" off="y" :tnum="index" dir="u" v-on="on" @click="handleBtnOffsetEvent" v-bind:class="{'v-btn--disabled': (index == 0 && relative)}">
                          <span class="content">+0.01mm</span>
                          <v-icon> arrow_right </v-icon>
                        </v-btn>
                      </template>
                      <span> Offsets the tool head by a tiny amount in the Y direction (G10 Px Xyy) </span>
                    </v-tooltip>
                  </v-layout>
                </v-layout>
              </v-layout>
            </v-flex>
          </v-layout>
          <!--div style=" display: flex; width: max-content; margin: 0 auto;" v-if="toolHeads.length>0">
          <span style="margin-top: 20px"><b> Absolute </b> tools offsets</span>
          <v-switch hide-details class="ml-1" v-model="relative"></v-switch>
          <span style="margin-top: 20px"><b> Relative </b> to <b> T{{toolHeads[0].t}} </b> tools offsets</span>
        </div-->
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
      select: undefined,
      relative: false,
      b4: "",
      tools: [],
      toolHeads: [],
      backTool: [],
      toolPath: {},
      xyToolOffset: undefined,
      currTool: undefined,
    }
  },
  computed: {
    ...mapState(['isLocal']),
    ...mapState({
      name: state => state.machine.model.network.name,
    }),
  },
  methods: {
    ...mapActions('machine', ['getFileList', 'sendCode', 'download', 'upload']),
    targetTool:async function(e) {
      let that = e.target;
      if (that.id != this.curTool) {
        await this.sendCode("G10 P" + that.id + " X" + this.toolHeads[that.id].x + " Y" + this.toolHeads[that.id].y);
        await this.sendCode("G1 X0 Y0 Z150 F600");
        await this.sendCode("T" + that.id);
        await this.sendCode("G1 X0 Y0 Z130 F600");
        this.curTool = that.id;
      } else {
        await this.sendCode("G1 X0 Y0 Z150 F600");
        await this.sendCode("T-1")
        await this.sendCode("G1 X0 Y0 Z150 F600");
        this.curTool = -1;
      }
    },
    preloadToolMatrices: async function() {
			console.log('load the cfg file');
      try {
        this.tools = [];
        // Load file list and create missing props
        const files = await this.getFileList("0:/macros/_Toolheads");
        //let name = this.name.substr(8, 5);
        //console.log(tools)
        let that = this;
        let inter = setInterval(function(files){
          if (files.length == 1) {
            clearInterval(inter);
          }
          let item = files.shift();
          if (item.isDirectory)
          {
            //console.log(item);
            that.preloadToolMatrix(item.directory + "/" + item.name)
          }
        }, 500, files);

      } catch(e) {
        console.error(e);
      }
    },
    preloadToolMatrix: async function(path){
      try {
        let files = await this.getFileList(path);
        files = files.filter(file => file.name.includes("Toolmatrix"))
        //console.log(files);
        let that = this;
        var toolName;
        let inter = setInterval(function(files) {
          if (files == undefined || files.length <= 1) {
            clearInterval(inter);
          }
          let file = files.shift();
          //console.log(file);
          if(file != undefined){
            //console.log(file);
            toolName = file.name.substring(11);
            if (toolName.includes("."))
            toolName = toolName.substring(0, toolName.lastIndexOf("."));
            if(that.toolPath[toolName] === undefined)
            that.toolPath[toolName] = {};
            if(that.toolPath[toolName].matrix === undefined) {
              that.tools.push(toolName);
            }
            that.toolPath[toolName].matrix = path.substring(path.lastIndexOf("/")+1)+"/"+file.name;

            that.tools = that.tools.sort();
            //console.log(that.tools.toSource())
            if(that.name.includes(toolName)){
              that.select = toolName
              that.loadToolMatrix(toolName);
            }
          }
        }, 125, files);
        //this.loadToolMatrix(toolName);
        //$("#hname").prop("value", toolName);
        //$("#hname").data("tool" , toolName);
      } catch(e) {
        console.error(e);
      }
    },
    loadToolMatrix: async function() {
      //isHF = false;
      let targetMatrix = this.select.toString();
      //console.log(this.toolPath[targetMatrix])
      this.b4 = [];
      let toolHeads = [];
      let filename = ("0:/macros/_Toolheads/"+this.toolPath[targetMatrix].matrix);
      let result = await this.download({ filename, type: 'text', showSuccess: false });
      let data = result.split("\n");
      this.b4[0] = "";
      let indexB4 = 0;
      var lines = [];
      let toolNum = -1;
      for( var i = 0; i < data.length; i++)
      {
        if (data[i].includes("G10") || data[i].includes("M563")) {
          lines.push(data[i]);
          if (this.b4[indexB4] != "") {
            indexB4 ++ ;
            this.b4[indexB4] = "";
          }
        } else if (data[i] !== "" && data[i] !== "\n"){
          this.b4[indexB4] += data[i] + "\n";
        }
      }
      for (i = 0; i < lines.length; i++)
      {
        var line = lines[i].substring(0, lines[i].indexOf(";")).split(" ");
        for( var j = 0; j < line.length; j++)
        {
          if (line[0] === "G10"){
            if (line[j].includes("P")) { //Tool number
              if ((toolHeads[toolNum] == undefined) || (toolHeads[toolNum+1] == undefined && toolHeads[toolNum].t !== parseInt(line[j].substring(1)))) {
                toolNum++;
                //console.log("G10: tool " + parseInt(line[j].substring(1)) +" found");
                toolHeads[toolNum] = {};
                toolHeads[toolNum].t = parseInt(line[j].substring(1))
              }
            } else if(line[j].includes("U")) { // axis U-W
              //console.log("offset X of tool " + toolHeads[toolNum].t + " = "+ parseFloat(line[j].substring(1)));
              toolHeads[toolNum].u = parseFloat(line[j].substring(1));
            } else if(line[j].includes("V")) {
              //console.log("offset Y of tool " + toolHeads[toolNum].t + " = "+ parseFloat(line[j].substring(1)));
              toolHeads[toolNum].v = parseFloat(line[j].substring(1));
            } else if(line[j].includes("W")) {
              //console.log("offset Z of tool " + toolHeads[toolNum].t + " = "+ parseFloat(line[j].substring(1)));
              toolHeads[toolNum].w = parseFloat(line[j].substring(1));
            } else if(line[j].includes("X")) { // axis X-Z
              //console.log("offset X of tool " + toolHeads[toolNum].t + " = "+ parseFloat(line[j].substring(1)));
              toolHeads[toolNum].x = parseFloat(line[j].substring(1)).toFixed(2);
            } else if(line[j].includes("Y")) {
              //console.log("offset Y of tool " + toolHeads[toolNum].t + " = "+ parseFloat(line[j].substring(1)));
              toolHeads[toolNum].y = parseFloat(line[j].substring(1)).toFixed(2);
            } else if(line[j].includes("Z")) {
              //console.log("offset Z of tool " + toolHeads[toolNum].t + " = "+ parseFloat(line[j].substring(1)));
              toolHeads[toolNum].z = parseFloat(line[j].substring(1));
            } else if(line[j].includes("S")) {
              //console.log("default active temp of tool " + toolHeads[toolNum].t + " = " + parseFloat(line[j].substring(1)));
              toolHeads[toolNum].s = parseFloat(line[j].substring(1));
            } else if(line[j].includes("R")) {
              //console.log("default stanby temp of tool " + toolHeads[toolNum].t + " = " + parseFloat(line[j].substring(1)));
              toolHeads[toolNum].r = parseFloat(line[j].substring(1));
            }
          } else if (line[0] === "M563") {
            if (line[j].includes("P")) {
              if ((toolHeads[toolNum] == undefined) || (toolHeads[toolNum+1] == undefined && toolHeads[toolNum].t !== parseInt(line[j].substring(1)))) {
                toolNum++;
                //console.log("M563: tool " + parseInt(line[j].substring(1)) +" found");
                toolHeads[toolNum] = {};
                toolHeads[toolNum].t = parseInt(line[j].substring(1))
              }
            } else if ( line[j].includes("S")) {
              var open = -1;
              var close = -1;
              do {
                if (open < 0) {
                  open = line[j].indexOf("\"");
                  if (open < line[j].lastIndexOf("\"")){ // IE there is a second " after the first one ex( "A+B")
                    close = line[j].lastIndexOf("\"");
                    toolHeads[toolNum].e = line[j].substring(open+1, close)
                  } else {
                    toolHeads[toolNum].e = line[j].substring(open+1);
                  }
                } else if (line[j].indexOf("\"") >= 0){ // we found the closing "
                  close  = line[j].indexOf("\"");
                  toolHeads[toolNum].e += " " + line[j].substring(0,close)
                } else {
                  toolHeads[toolNum].e += " " + line[j]
                }
                j++;
              } while (close < 0);
              j--;
              //console.log("tool " + toolHeads[toolNum].t +" named: " + toolHeads[toolNum].e);
            } else if (line[j].includes("D")) {
              //console.log("tool " + toolHeads[toolNum].t + " drive " + parseFloat(line[j].substring(1)));
              var drives = line[j].substring(1).split(":")
              for(var k = 0; k < drives.length; k++)
              drives[k] = parseFloat(drives[k]);
              toolHeads[toolNum].d = drives;
            } else if (line[j].includes("H")) {
              //console.log("tool " + toolHeads[toolNum].t + " heater " + parseFloat(line[j].substring(1)));
              var heaters = line[j].substring(1).split(":")
              for(k = 0; k < heaters.length; k++)
              heaters[k] = parseFloat(heaters[k]);
              toolHeads[toolNum].h = heaters;
            } else if (line[j].includes("F")) {
              //console.log("fan " + parseFloat(line[j].substring(1)) + "maped to tool " + toolHeads[toolNum].t);
              toolHeads[toolNum].f = parseFloat(line[j].substring(1));
            } else if (line[j].includes("L")) {
              toolHeads[toolNum].l = parseFloat(line[j].substring(1));
            }
          }
        }
      }
      this.makeTools(toolHeads);
      //console.log("done")
      //console.log(toolHeads);
    },
    handleBtnOffsetEvent: async function(e) {
      let that = e.target;
      console.log("btnOffset clicked")
      while (that.nodeName.toLowerCase() !== "button") {
        that = that.parentElement;
      }
      e.preventDefault();
      if(!that.classList.contains("v-btn--disabled") && this.tools.length > 0)
      {
        that.classList.add("v-btn--disabled")
        let attr = that.attributes;
        var first = 0;
        while (this.tools[first] === undefined && this.tools.length > 0)
        {
          first++;
        }
        var offset = (parseFloat(that.innerText) + parseFloat(this.toolHeads[attr.tnum.value][attr.off.value]))
        clearTimeout(this.xyToolOffset);
        //console.log(offset);
        this.toolHeads[attr.tnum.value][attr.off.value] = offset.toFixed(2);
        await this.sendCode("G10 P" + attr.tnum.value + " X" + this.toolHeads[attr.tnum.value].x + " Y" + this.toolHeads[attr.tnum.value].y +" S0 R0");
        //await this.sendCode("G1 X0 Y0 Z150 F1200");
        if (this.curTool !== attr.tnum.value){
          await this.sendCode("T" + attr.tnum.value);
          this.curTool = attr.tnum.value;
        }
        //await this.sendCode("G1 X0 Y0 Z130 F1200");
        this.xyToolOffset = setTimeout(this.sendToolMatrix, 1000, attr.tnum.value)
        that.classList.remove("v-btn--disabled")
      }
    },
    handleToolOffsetBlurEvent: async function(e) {
      e.preventDefault();
      let that = e.target;
      //console.log("inputField blured")
      //console.log(e.target)
      while (that.nodeName.toLowerCase() !== "input") {
        that = that.parentElement;
      }
      let attr = that.attributes;
      var first = 0;
      while (this.tools[first] === undefined && this.tools.length > 0)
      {
        first++;
      }
      var offset = parseFloat(that.value);
      clearTimeout(this.xyToolOffset);
      this.toolHeads[attr.tnum.value][attr.off.value] = (offset + (this.relative? this.toolHeads[first][attr.off.value] : 0)).toFixed(2)
      await this.sendCode("G10 P" + attr.tnum.value + " X" + this.toolHeads[attr.tnum.value].x + " Y" + this.toolHeads[attr.tnum.value].y +" S0 R0");

      if (this.curTool !== attr.tnum.value){
        await this.sendCode("T" + attr.tnum.value);
        this.curTool = attr.tnum.value;
      }
      //await this.sendCode("G1 X0 Y0 Z130 F100");
      this.xyToolOffset = setTimeout(this.sendToolMatrix, 1000, attr.tnum.value)

    },
    makeTools: function(tools) {
      var isSec = [];
      var first = 0;
      while (tools[first] === undefined && tools.length > 0)
      {
        first++;
      }
      for(var i = 0; i < tools.length; i++) {
        if (tools[i] !== undefined && isSec[i] === undefined) {
          var heaters = tools[i].h;
          var drives = tools[i].d;
          var tsec = [];
          for (var j = i+1; j < tools.length; j++) {
            if (tools[j] === undefined)
            break;
            var wasSec = false;
            if (tools[j].h !== undefined) {
              for( var a = 0; a < tools[j].h.length; a++) {
                if (heaters.includes(tools[j].h[a])) {
                  tsec.push(j);
                  isSec[j] = true;
                  wasSec = true;
                }
              }
            }
            if (wasSec)
            break;
            if (tools[j].d !== undefined) {
              for( a = 0; a < tools[j].d.length; a++) {
                if (drives.includes(tools[j].d[a])) {
                  tsec.push(j);
                  isSec[j] = true;
                }
              }
            }
          }
          if(tsec.length)
          tools[i].sec = tsec;
        }
      }
      tools.forEach((tool, index) => tool.hide = isSec[index])
      //console.log(tools);
      this.toolHeads = tools;
      this.backTools = tools;
    },
    sendToolMatrix: function(/*targetMatrix*/) {
      //console.log("sending new tool matrix");
      var out = "";
      //console.trace();
      console.log(this.toolHeads)
      console.log(this.backTools)
      for (var i = 0; i < this.toolHeads.length; i++)
      {
        out += (this.b4[i] == undefined?"":this.b4[i]);
        out += "M563 P"+ i + " S\"" + this.toolHeads[i].e + "\" D" + this.toolHeads[i].d + " H" + this.toolHeads[i].h + "\t\t\t; Define tool " + i + "\n";
        out += "G10 P" + i + " X" + parseFloat(this.toolHeads[i].x).toFixed(2) + " Y" + parseFloat(this.toolHeads[i].y).toFixed(2) + " Z" + parseFloat(this.toolHeads[i].z).toFixed(2) + "\t\t; Set tool " + i + " axis offsets\n"
        out += "G10 P" + i + " R" + this.toolHeads[i].r + " S" + this.toolHeads[i].s + "\t\t\t\t; Set initial tool " + i + " active and standby temperatures to " + this.toolHeads[i].s + "/" + this.toolHeads[i].r + "°C\n";
      }
      out += (this.b4[this.toolHeads.length] == undefined? "" : this.b4[this.toolHeads.length] );
      //console.log(this.tools);
      let filename = "0:/macros/_Toolheads/" + this.toolPath[this.select].matrix;
      let data =  out;
      //console.log(data);
      const content = new Blob([data]);
      try {
        this.upload({ filename: filename, content });
        //console.log("file saved");
      } catch (e) {
        console.log("Error: " + (e.err == 1 ? "no such file" : "not mounted"));
        console.error(e);// TODO Optionally ask user to save file somewhere else
      }
    },
    toolOffsetEvent: function(off, index, tool, axis) {
    console.log(off, index, tool, axis)
      clearTimeout(this.xyToolOffset);
      console.log(off,tool)
      this.toolHeads[index][axis] = off
      console.log(this.toolHeads)
      this.xyToolOffset = setTimeout(this.sendToolMatrix, 1000, index)
    }
  },
  mounted() {
    setTimeout(this.preloadToolMatrices, 1000*Math.random());
  },
  watch: {
    toolHeads: {
      deep: true,
			handler: function(/*newVal*/){
        //console.trace();
        //console.log(newVal);
      }
    }
  }
}
</script>
