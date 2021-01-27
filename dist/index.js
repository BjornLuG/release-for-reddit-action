module.exports=function(t,e){"use strict";var r={};function __webpack_require__(e){if(r[e]){return r[e].exports}var n=r[e]={i:e,l:false,exports:{}};t[e].call(n.exports,n,n.exports,__webpack_require__);n.l=true;return n.exports}__webpack_require__.ab=__dirname+"/";function startup(){return __webpack_require__(104)}return startup()}({82:function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:true});function toCommandValue(t){if(t===null||t===undefined){return""}else if(typeof t==="string"||t instanceof String){return t}return JSON.stringify(t)}e.toCommandValue=toCommandValue},87:function(t){t.exports=require("os")},102:function(t,e,r){"use strict";var n=this&&this.__importStar||function(t){if(t&&t.__esModule)return t;var e={};if(t!=null)for(var r in t)if(Object.hasOwnProperty.call(t,r))e[r]=t[r];e["default"]=t;return e};Object.defineProperty(e,"__esModule",{value:true});const s=n(r(747));const i=n(r(87));const o=r(82);function issueCommand(t,e){const r=process.env[`GITHUB_${t}`];if(!r){throw new Error(`Unable to find environment variable for file command ${t}`)}if(!s.existsSync(r)){throw new Error(`Missing file at path: ${r}`)}s.appendFileSync(r,`${o.toCommandValue(e)}${i.EOL}`,{encoding:"utf8"})}e.issueCommand=issueCommand},104:function(t,e,r){const n=r(211);const s=r(470);const i=r(554);class Main{constructor(){this.username=s.getInput("username",{required:true});this.password=s.getInput("password",{required:true});this.appId=s.getInput("app-id",{required:true});this.appSecret=s.getInput("app-secret",{required:true});this.subreddit=s.getInput("subreddit",{required:true});this.title=s.getInput("title",{required:true});this.flairId=s.getInput("flair-id");this.flairText=s.getInput("flair-text");this.comment=s.getInput("comment");this.notification=s.getInput("notification")==="true";this.retryRateLimit=+s.getInput("retry-rate-limit");this.userAgent=`Release for Reddit (by /u/${this.username})`;this.accessToken=""}async start(){await this.initAccessToken();const t=await i(state);if(t.length===0){toolkit.info("No new posts");return}this.text=t;const e=await this.submitPost();s.info(`View post at ${e.url}`);s.setOutput("postUrl",e.url);if(this.comment){const t=await this.commentPost(e.name);const r=`https://www.reddit.com${t.permalink}`;s.info(`View comment at ${r}`);s.setOutput("commentUrl",r);if(!this.notification){this.editSendReplies(t.name,false)}}}async initAccessToken(){const t=await this._post({host:"www.reddit.com",path:"/api/v1/access_token",auth:`${this.appId}:${this.appSecret}`},{grant_type:"password",username:this.username,password:this.password});this.accessToken=t["access_token"]}async submitPost(){const t=await this._retryIfRateLimit(async()=>{const t=await this._post({host:"oauth.reddit.com",path:`/api/submit`,headers:{Authorization:`Bearer ${this.accessToken}`}},{api_type:"json",resubmit:true,kind:"link",sr:this.subreddit,title:this.title,text:this.text,flair_id:this.flairId,flair_text:this.flairText,sendreplies:this.notification});if(t.json.errors.length){throw new Error(t.json.errors)}return t});return t.json.data}async commentPost(t){const e=await this._retryIfRateLimit(async()=>{const e=await this._post({host:"oauth.reddit.com",path:`/api/comment`,headers:{Authorization:`Bearer ${this.accessToken}`}},{api_type:"json",text:this.comment,thing_id:t});if(e.json.errors.length){throw new Error(e.json.errors)}return e});const r=e.json.data;if(r&&r.things&&r.things[0]){return r.things[0].data}return r}async editSendReplies(t,e){await this._retryIfRateLimit(async()=>{const r=await this._post({host:"oauth.reddit.com",path:`/api/sendreplies`,headers:{Authorization:`Bearer ${this.accessToken}`}},{id:t,state:e});if(r&&r.json&&r.json.errors&&r.json.errors.length){throw new Error(r.json.errors)}return r})}_post(t,e){const r=this._encodeForm(e);const s={...t,method:"POST",headers:{...t.headers,"User-Agent":this.userAgent,"Content-Type":"application/x-www-form-urlencoded","Content-Length":Buffer.byteLength(r)}};return new Promise((t,e)=>{const i=n.request(s,r=>{r.setEncoding("utf8");let n="";r.on("data",t=>{n+=t});r.on("error",t=>e(t));r.on("end",()=>t(JSON.parse(n)))});i.on("error",t=>e(t));i.write(r);i.end()})}async _retryIfRateLimit(t,e=this.retryRateLimit){try{return await t()}catch(r){const n=this._getRateLimitSeconds(r.message);if(n>0&&e>0){s.info(`Rate limit hit. Waiting ${n} seconds to retry...`);await this._wait(n*1e3);return await this._retryIfRateLimit(t,e-1)}throw r}}_getRateLimitSeconds(t){const e=t.match(/RATELIMIT.*try again in (\d*) (s|m)/);if(!e||e.length<3){return-1}let r=e[1];if(e[2]==="m"){r*=60}r+=60;return r}async _wait(t){return new Promise(e=>{setTimeout(()=>e(),t)})}_encodeForm(t){return Object.entries(t).map(t=>t.map(encodeURIComponent).join("=")).join("&")}}(new Main).start().catch(t=>s.setFailed(t.message))},211:function(t){t.exports=require("https")},431:function(t,e,r){"use strict";var n=this&&this.__importStar||function(t){if(t&&t.__esModule)return t;var e={};if(t!=null)for(var r in t)if(Object.hasOwnProperty.call(t,r))e[r]=t[r];e["default"]=t;return e};Object.defineProperty(e,"__esModule",{value:true});const s=n(r(87));const i=r(82);function issueCommand(t,e,r){const n=new Command(t,e,r);process.stdout.write(n.toString()+s.EOL)}e.issueCommand=issueCommand;function issue(t,e=""){issueCommand(t,{},e)}e.issue=issue;const o="::";class Command{constructor(t,e,r){if(!t){t="missing.command"}this.command=t;this.properties=e;this.message=r}toString(){let t=o+this.command;if(this.properties&&Object.keys(this.properties).length>0){t+=" ";let e=true;for(const r in this.properties){if(this.properties.hasOwnProperty(r)){const n=this.properties[r];if(n){if(e){e=false}else{t+=","}t+=`${r}=${escapeProperty(n)}`}}}}t+=`${o}${escapeData(this.message)}`;return t}}function escapeData(t){return i.toCommandValue(t).replace(/%/g,"%25").replace(/\r/g,"%0D").replace(/\n/g,"%0A")}function escapeProperty(t){return i.toCommandValue(t).replace(/%/g,"%25").replace(/\r/g,"%0D").replace(/\n/g,"%0A").replace(/:/g,"%3A").replace(/,/g,"%2C")}},470:function(t,e,r){"use strict";var n=this&&this.__awaiter||function(t,e,r,n){function adopt(t){return t instanceof r?t:new r(function(e){e(t)})}return new(r||(r=Promise))(function(r,s){function fulfilled(t){try{step(n.next(t))}catch(t){s(t)}}function rejected(t){try{step(n["throw"](t))}catch(t){s(t)}}function step(t){t.done?r(t.value):adopt(t.value).then(fulfilled,rejected)}step((n=n.apply(t,e||[])).next())})};var s=this&&this.__importStar||function(t){if(t&&t.__esModule)return t;var e={};if(t!=null)for(var r in t)if(Object.hasOwnProperty.call(t,r))e[r]=t[r];e["default"]=t;return e};Object.defineProperty(e,"__esModule",{value:true});const i=r(431);const o=r(102);const a=r(82);const u=s(r(87));const c=s(r(622));var p;(function(t){t[t["Success"]=0]="Success";t[t["Failure"]=1]="Failure"})(p=e.ExitCode||(e.ExitCode={}));function exportVariable(t,e){const r=a.toCommandValue(e);process.env[t]=r;const n=process.env["GITHUB_ENV"]||"";if(n){const e="_GitHubActionsFileCommandDelimeter_";const n=`${t}<<${e}${u.EOL}${r}${u.EOL}${e}`;o.issueCommand("ENV",n)}else{i.issueCommand("set-env",{name:t},r)}}e.exportVariable=exportVariable;function setSecret(t){i.issueCommand("add-mask",{},t)}e.setSecret=setSecret;function addPath(t){const e=process.env["GITHUB_PATH"]||"";if(e){o.issueCommand("PATH",t)}else{i.issueCommand("add-path",{},t)}process.env["PATH"]=`${t}${c.delimiter}${process.env["PATH"]}`}e.addPath=addPath;function getInput(t,e){const r=process.env[`INPUT_${t.replace(/ /g,"_").toUpperCase()}`]||"";if(e&&e.required&&!r){throw new Error(`Input required and not supplied: ${t}`)}return r.trim()}e.getInput=getInput;function setOutput(t,e){i.issueCommand("set-output",{name:t},e)}e.setOutput=setOutput;function setCommandEcho(t){i.issue("echo",t?"on":"off")}e.setCommandEcho=setCommandEcho;function setFailed(t){process.exitCode=p.Failure;error(t)}e.setFailed=setFailed;function isDebug(){return process.env["RUNNER_DEBUG"]==="1"}e.isDebug=isDebug;function debug(t){i.issueCommand("debug",{},t)}e.debug=debug;function error(t){i.issue("error",t instanceof Error?t.toString():t)}e.error=error;function warning(t){i.issue("warning",t instanceof Error?t.toString():t)}e.warning=warning;function info(t){process.stdout.write(t+u.EOL)}e.info=info;function startGroup(t){i.issue("group",t)}e.startGroup=startGroup;function endGroup(){i.issue("endgroup")}e.endGroup=endGroup;function group(t,e){return n(this,void 0,void 0,function*(){startGroup(t);let r;try{r=yield e()}finally{endGroup()}return r})}e.group=group;function saveState(t,e){i.issueCommand("save-state",{name:t},e)}e.saveState=saveState;function getState(t){return process.env[`STATE_${t}`]||""}e.getState=getState},554:function(t,e,r){t.exports=parseText;const{resolve:n}=r(622);const{readFileSync:s}=r(747);async function parseText({payload:t,octokit:e}){const{data:{files:r}}=await e.request("GET /repos/:owner/:repo/compare/:base...:head",{owner:t.repository.owner.login,repo:t.repository.name,base:t.before,head:t.after});return r.filter(t=>t.status==="added"&&/^posts\/.*\.post/.test(t.filename)).map(t=>{const e=s(n(process.env.GITHUB_WORKSPACE,t.filename),"utf8").trim();return{text:e,filename:t.filename}})}},622:function(t){t.exports=require("path")},747:function(t){t.exports=require("fs")}});