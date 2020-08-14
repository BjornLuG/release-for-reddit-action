module.exports=function(t,e){"use strict";var r={};function __webpack_require__(e){if(r[e]){return r[e].exports}var s=r[e]={i:e,l:false,exports:{}};t[e].call(s.exports,s,s.exports,__webpack_require__);s.l=true;return s.exports}__webpack_require__.ab=__dirname+"/";function startup(){return __webpack_require__(104)}return startup()}({87:function(t){t.exports=require("os")},104:function(t,e,r){const s=r(211);const i=r(470);class Main{constructor(){this.username=i.getInput("username",{required:true});this.password=i.getInput("password",{required:true});this.appId=i.getInput("app-id",{required:true});this.appSecret=i.getInput("app-secret",{required:true});this.subreddit=i.getInput("subreddit",{required:true});this.title=i.getInput("title",{required:true});this.url=i.getInput("url",{required:true});this.flairId=i.getInput("flair-id");this.flairText=i.getInput("flair-text");this.comment=i.getInput("comment");this.notification=i.getInput("notification")==="true";this.retryRateLimit=+i.getInput("retry-rate-limit");this.userAgent=`Release for Reddit (by /u/${this.username})`;this.accessToken=""}async start(){await this.initAccessToken();const t=await this.submitPost();i.info(`View post at ${t.url}`);i.setOutput("postUrl",t.url);if(this.comment){const e=await this.commentPost(t.name);const r=`https://www.reddit.com${e.permalink}`;i.info(`View comment at ${r}`);i.setOutput("commentUrl",r);if(!this.notification){this.editSendReplies(e.name,false)}}}async initAccessToken(){const t=await this._post({host:"www.reddit.com",path:"/api/v1/access_token",auth:`${this.appId}:${this.appSecret}`},{grant_type:"password",username:this.username,password:this.password});this.accessToken=t["access_token"]}async submitPost(){const t=await this._retryIfRateLimit(async()=>{const t=await this._post({host:"oauth.reddit.com",path:`/api/submit`,headers:{Authorization:`Bearer ${this.accessToken}`}},{api_type:"json",resubmit:true,kind:"link",sr:this.subreddit,title:this.title,url:this.url,flair_id:this.flairId,flair_text:this.flairText,sendreplies:this.notification});if(t.json.errors.length){throw new Error(t.json.errors)}return t});return t.json.data}async commentPost(t){const e=await this._retryIfRateLimit(async()=>{const e=await this._post({host:"oauth.reddit.com",path:`/api/comment`,headers:{Authorization:`Bearer ${this.accessToken}`}},{api_type:"json",text:this.comment,thing_id:t});if(e.json.errors.length){throw new Error(e.json.errors)}return e});const r=e.json.data;if(r&&r.things&&r.things[0]){return r.things[0].data}return r}async editSendReplies(t,e){await this._retryIfRateLimit(async()=>{const r=await this._post({host:"oauth.reddit.com",path:`/api/sendreplies`,headers:{Authorization:`Bearer ${this.accessToken}`}},{id:t,state:e});if(r&&r.json&&r.json.errors&&r.json.errors.length){throw new Error(r.json.errors)}return r})}_post(t,e){const r=this._encodeForm(e);const i={...t,method:"POST",headers:{...t.headers,"User-Agent":this.userAgent,"Content-Type":"application/x-www-form-urlencoded","Content-Length":Buffer.byteLength(r)}};return new Promise((t,e)=>{const n=s.request(i,r=>{r.setEncoding("utf8");let s="";r.on("data",t=>{s+=t});r.on("error",t=>e(t));r.on("end",()=>t(JSON.parse(s)))});n.on("error",t=>e(t));n.write(r);n.end()})}async _retryIfRateLimit(t,e=this.retryRateLimit){try{return await t()}catch(r){const s=this._getRateLimitSeconds(r.message);if(s>0&&e>0){i.info(`Rate limit hit. Waiting ${s} seconds to retry...`);await this._wait(s*1e3);return await this._retryIfRateLimit(t,e-1)}throw r}}_getRateLimitSeconds(t){const e=t.match(/RATELIMIT.*try again in (\d*) (s|m)/);if(!e||e.length<3){return-1}let r=e[1];if(e[2]==="m"){r*=60}r+=60;return r}async _wait(t){return new Promise(e=>{setTimeout(()=>e(),t)})}_encodeForm(t){return Object.entries(t).map(t=>t.map(encodeURIComponent).join("=")).join("&")}}(new Main).start().catch(t=>i.setFailed(t.message))},211:function(t){t.exports=require("https")},431:function(t,e,r){"use strict";var s=this&&this.__importStar||function(t){if(t&&t.__esModule)return t;var e={};if(t!=null)for(var r in t)if(Object.hasOwnProperty.call(t,r))e[r]=t[r];e["default"]=t;return e};Object.defineProperty(e,"__esModule",{value:true});const i=s(r(87));function issueCommand(t,e,r){const s=new Command(t,e,r);process.stdout.write(s.toString()+i.EOL)}e.issueCommand=issueCommand;function issue(t,e=""){issueCommand(t,{},e)}e.issue=issue;const n="::";class Command{constructor(t,e,r){if(!t){t="missing.command"}this.command=t;this.properties=e;this.message=r}toString(){let t=n+this.command;if(this.properties&&Object.keys(this.properties).length>0){t+=" ";let e=true;for(const r in this.properties){if(this.properties.hasOwnProperty(r)){const s=this.properties[r];if(s){if(e){e=false}else{t+=","}t+=`${r}=${escapeProperty(s)}`}}}}t+=`${n}${escapeData(this.message)}`;return t}}function escapeData(t){return(t||"").replace(/%/g,"%25").replace(/\r/g,"%0D").replace(/\n/g,"%0A")}function escapeProperty(t){return(t||"").replace(/%/g,"%25").replace(/\r/g,"%0D").replace(/\n/g,"%0A").replace(/:/g,"%3A").replace(/,/g,"%2C")}},470:function(t,e,r){"use strict";var s=this&&this.__awaiter||function(t,e,r,s){function adopt(t){return t instanceof r?t:new r(function(e){e(t)})}return new(r||(r=Promise))(function(r,i){function fulfilled(t){try{step(s.next(t))}catch(t){i(t)}}function rejected(t){try{step(s["throw"](t))}catch(t){i(t)}}function step(t){t.done?r(t.value):adopt(t.value).then(fulfilled,rejected)}step((s=s.apply(t,e||[])).next())})};var i=this&&this.__importStar||function(t){if(t&&t.__esModule)return t;var e={};if(t!=null)for(var r in t)if(Object.hasOwnProperty.call(t,r))e[r]=t[r];e["default"]=t;return e};Object.defineProperty(e,"__esModule",{value:true});const n=r(431);const o=i(r(87));const a=i(r(622));var u;(function(t){t[t["Success"]=0]="Success";t[t["Failure"]=1]="Failure"})(u=e.ExitCode||(e.ExitCode={}));function exportVariable(t,e){process.env[t]=e;n.issueCommand("set-env",{name:t},e)}e.exportVariable=exportVariable;function setSecret(t){n.issueCommand("add-mask",{},t)}e.setSecret=setSecret;function addPath(t){n.issueCommand("add-path",{},t);process.env["PATH"]=`${t}${a.delimiter}${process.env["PATH"]}`}e.addPath=addPath;function getInput(t,e){const r=process.env[`INPUT_${t.replace(/ /g,"_").toUpperCase()}`]||"";if(e&&e.required&&!r){throw new Error(`Input required and not supplied: ${t}`)}return r.trim()}e.getInput=getInput;function setOutput(t,e){n.issueCommand("set-output",{name:t},e)}e.setOutput=setOutput;function setFailed(t){process.exitCode=u.Failure;error(t)}e.setFailed=setFailed;function isDebug(){return process.env["RUNNER_DEBUG"]==="1"}e.isDebug=isDebug;function debug(t){n.issueCommand("debug",{},t)}e.debug=debug;function error(t){n.issue("error",t)}e.error=error;function warning(t){n.issue("warning",t)}e.warning=warning;function info(t){process.stdout.write(t+o.EOL)}e.info=info;function startGroup(t){n.issue("group",t)}e.startGroup=startGroup;function endGroup(){n.issue("endgroup")}e.endGroup=endGroup;function group(t,e){return s(this,void 0,void 0,function*(){startGroup(t);let r;try{r=yield e()}finally{endGroup()}return r})}e.group=group;function saveState(t,e){n.issueCommand("save-state",{name:t},e)}e.saveState=saveState;function getState(t){return process.env[`STATE_${t}`]||""}e.getState=getState},622:function(t){t.exports=require("path")}});