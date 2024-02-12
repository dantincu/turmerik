(()=>{function e(e,t,r,i){Object.defineProperty(e,t,{get:r,set:i,enumerable:!0,configurable:!0})}var t,r,i,s,a,l,o,n,d,h,u,c,f,m,g={};e(g,"allWsRegex",()=>y),e(g,"jsonBool",()=>p),e(g,"getJsonBool",()=>F),e(g,"isNotNullObj",()=>w),e(g,"isNonEmptyStr",()=>N),e(g,"findKvp",()=>v),e(g,"forEach",()=>b),e(g,"contains",()=>P),e(g,"any",()=>S),e(g,"containsAnyOfArr",()=>I),e(g,"containsAnyOfMx",()=>C),e(g,"forEachProp",()=>O),e(g,"merge",()=>V),e(g,"filterAsync",()=>x),e(g,"mapAsync",()=>k),e(g,"findIdxAsync",()=>A),e(g,"findAsync",()=>R),e(g,"withVal",()=>_),e(g,"subStr",()=>E),e(g,"trimStr",()=>W),e(g,"capitalizeFirstLetter",()=>z);let y=/^\s+$/g,p=Object.freeze({false:JSON.stringify(!1),true:JSON.stringify(!0)}),F=e=>e?p.true:p.false,w=e=>"object"==typeof e&&null!==e,N=(e,t=!1)=>{let r="string"==typeof e;return(r=r&&""!==e)&&t&&(r=!y.test(e)),r},v=(e,t)=>{let r=-1,i=null;for(let s=0;s<e.length;s++){let a=e[s];if(t(a,s,e)){r=s,i=a;break}}return{key:r,value:i}},b=(e,t)=>{for(let r=0;r<e.length&&!1!==t(e[r],r,e);r++);},P=(e,t)=>e.indexOf(t)>=0,S=(e,t)=>e.filter(t).length>=0,I=(e,t,r)=>{r??={value:{key:-1,value:null}};let i=v(t,t=>e.indexOf(t)>=0),s=i.key>=0;return s&&(r.value=i),s},C=(e,t,r)=>{r??={value:{key:-1,value:{key:-1,value:null}}};let i={},s=v(t,t=>I(e,t,i)),a=s.key>=0;return a&&(r.value={key:s.key,value:i.value}),a},O=(e,t)=>{let r=Object.getOwnPropertyNames(e);for(let i of r)t(e[i],i,e,r,e)},V=(e,t,r=0)=>{for(let i of t)for(let t of Object.getOwnPropertyNames(i)){let s=i[t];s&&(e[t]?r>0&&V(e,[i],r-1):e[t]=s)}return e},x=async(e,t)=>{let r=[],i=new Uint32Array(new SharedArrayBuffer(32));for(let s=0;s<e.length;s++){let a=s;await t(e[a],a,e)&&(r[Atomics.add(i,0,1)]=e[a])}},k=async(e,t)=>{let r=[];for(let i=0;i<e.length;i++)r[i]=await t(e[i],i,e);return r},A=async(e,t)=>{let r=-1;for(let i=0;i<e.length;i++){let s=i;if(await t(e[s],s,e)){r=s;break}}return r},R=async(e,t)=>{let r=await A(e,t),i=null;return r>=0&&(i=e[r]),i},_=(e,t)=>t(e),E=(e,t)=>{let r=(t??={}).stIdx??0,i=t.endIdx??-1;return i<0&&(i=e.length+i+1-r),e.substring(r,i)},W=(e,t)=>{let r=(t??={trimStr:" "}).trimStr;if(N(r)||(r=" "),r.length,t.fullTrim||t.trimStart)for(;e.startsWith(r);)e=e.substring(r.length);if(t.fullTrim||t.trimEnd)for(;e.endsWith(r);)e=e.substring(0,e.length-r.length);return e},z=e=>{let t=e[0];if(t){let r=t.toUpperCase();t!==r&&(e=r+e.substring(1))}return e};var D={};e(D,"FileType",()=>n),e(D,"OfficeFileType",()=>d),(t=n||(n={}))[t.plainText=1]="plainText",t[t.document=2]="document",t[t.image=3]="image",t[t.audio=4]="audio",t[t.video=5]="video",t[t.code=6]="code",t[t.binary=7]="binary",t[t.zippedFolder=8]="zippedFolder",(r=d||(d={}))[r.word=1]="word",r[r.excel=2]="excel",r[r.powerPoint=3]="powerPoint";var j={};e(j,"CmdCommand",()=>h),e(j,"getCommand",()=>M),e(j,"getCmd",()=>T),(i=h||(h={}))[i.Help=1]="Help",i[i.ListNotes=2]="ListNotes",i[i.CreateNoteBook=3]="CreateNoteBook",i[i.CreateNoteBookInternal=4]="CreateNoteBookInternal",i[i.CreateNote=5]="CreateNote",i[i.CreateNoteInternal=6]="CreateNoteInternal",i[i.CopyNotes=7]="CopyNotes",i[i.DeleteNotes=8]="DeleteNotes",i[i.MoveNotes=9]="MoveNotes",i[i.RenameNote=10]="RenameNote",i[i.UpdateNote=11]="UpdateNote",i[i.ReorderNotes=12]="ReorderNotes",i[i.NormalizeNote=13]="NormalizeNote",i[i.NormalizeNoteIdxes=14]="NormalizeNoteIdxes",i[i.NormalizeNotesHcy=15]="NormalizeNotesHcy";let M=(e,t)=>e[h[t]],T=(e,t)=>M(e.argOpts.commandsMap,t);var B={};e(B,"DirType",()=>u),e(B,"DirCategory",()=>c),e(B,"InternalDir",()=>f),(s=u||(u={}))[s.shortName=0]="shortName",s[s.fullName=1]="fullName",(a=c||(c={}))[a.item=0]="item",a[a.internals=1]="internals",(l=f||(f={}))[l.root=1]="root",l[l.internals=2]="internals",l[l.files=3]="files";var H={};e(H,"trmrkPathSep",()=>G),e(H,"trmrkPathStartTkn",()=>U),e(H,"trmrkHomePathTkn",()=>q),e(H,"trmrkHomePathStr",()=>L),e(H,"trmrkHomePathStartStr",()=>J),e(H,"getPath",()=>K),e(H,"PathValidationErrCode",()=>m),e(H,"dfPathValidationResult",()=>Z),e(H,"createInvalidSeqncs",()=>$),e(H,"baseInvalidSeqncs",()=>Q),e(H,"winInvalidSeqncs",()=>X),e(H,"unixInvalidSeqncs",()=>Y),e(H,"getInvalidSeqncs",()=>ee),e(H,"normalizeIfNetworkPath",()=>et),e(H,"normalizeIfRelPath",()=>er),e(H,"checkPathNotContainsInvalidChars",()=>ei),e(H,"isValidRootedPathCore",()=>es),e(H,"isValidRootedPath",()=>ea),e(H,"isValidRootedFsPath",()=>el),e(H,"isValidPath",()=>eo),e(H,"isValidFsPath",()=>en);let G="/",U="<",q="~",L=[U,q].join(""),J=[L,G].join(""),K=(e,t=null)=>{let r=[...e];return"boolean"==typeof t&&(N(r[0])&&r.splice(0,0,""),!0===t&&(r[0]=L)),r.join(G)};(o=m||(m={}))[o.None=0]="None",o[o.NullOrEmpty=1]="NullOrEmpty",o[o.InvalidPathChars=2]="InvalidPathChars",o[o.IsNotRooted=3]="IsNotRooted";let Z=()=>({isValid:!1,errCode:0,invalidChar:{key:-1,value:null}}),$=(e,t)=>[t,e+e,e+" "," "+e,e+".","."+e],Q=Object.freeze(["  "," .","..",". "]),X=Object.freeze($("\\","/")),Y=Object.freeze($("/","\\")),ee=e=>e?X:Y,et=(e,t,r)=>(r&&e.startsWith(t+t)&&(e=e.substring(1)),e),er=(e,t)=>(e.startsWith(".."+t)?e=e.substring(2):e.startsWith("."+t)&&(e=e.substring(1)),e),ei=(e,t,r)=>{let i={};return(t.isValid=!C(e,r,i))||(t.errCode=2,t.invalidChar=i.value.value),t.isValid},es=(e,t,r)=>((r.isValid=N(t,!0))?ei(t,r,[e.invalidFileNameChars,Q]):r.errCode=1,r.isValid),ea=(e,t,r=null,i=!0)=>((r??=Z()).isValid=es(e,t,r),!r.isValid||(t=et(t,e.pathSep,i),(r.isValid=t.startsWith("/")||t.startsWith(J))||(r.errCode=3)),r.isValid&&ei(t,r,[Y]),r.isValid),el=(e,t,r=null,i=!0)=>(r??=Z(),e.isWinOS?(r.isValid=/^[a-zA-Z]\:/.test(t))?t=t.substring(2):r.isValid=t.startsWith("\\"):r.isValid=t.startsWith("/"),r.isValid?(t=et(t,e.pathSep,i),r.isValid=ei(t,r,[e.invalidFileNameChars,Q])):r.errCode=3,r.isValid=r.isValid&&ei(t,r,[ee(e.isWinOS)]),r.isValid),eo=(e,t,r=null,i=!0)=>(r??=Z(),t=er(t,e.pathSep),r.isValid=ea(e,t,r,i),r.isValid),en=(e,t,r=null,i=!0)=>(r??=Z(),t=er(t,e.pathSep),r.isValid=el(e,t,r,i),r.isValid);var ed={};e(ed,"getBaseLocation",()=>eh);let eh=()=>[window.location.protocol,window.location.host].join("//");var eu={};e(eu,"SyncLock",()=>ec);class ec{static dfVal=BigInt(0);static incVal=BigInt(1);dfTimeout;syncRoot=new BigInt64Array(1);constructor(e){this.dfTimeout=e??void 0}run(e,t){return new Promise((r,i)=>{Atomics.add(this.syncRoot,0,ec.incVal)===ec.dfVal||"timed-out"!==Atomics.wait(this.syncRoot,0,ec.dfVal,t??this.dfTimeout)?e().then(()=>{Atomics.sub(this.syncRoot,0,ec.incVal),r()},e=>{Atomics.sub(this.syncRoot,0,ec.incVal),i(e)}):i(Error("While waiting for previously enqueued actions to finish their execution, more than the specified timeout has elapsed"))})}get(e){return new Promise((t,r)=>{let i=null;this.run(()=>new Promise((t,r)=>{e().then(e=>{i=e,t()},r)})).then(()=>{t(i)},r)})}}var ef={};e(ef,"ArrayAdapterBase",()=>em),e(ef,"ArrayAdapter",()=>eg),e(ef,"ReadonlyArrayAdapter",()=>ey);class em{array;constructor(e){this.array=e}contains(e){return this.array.indexOf(e)>=0}containsAny(e){return!!this.array.findIndex(e)}containsAnyOf(e){return!!e.findIndex(e=>this.contains(e))}except(e){return this.array.filter(t=>0>e.indexOf(t))}exceptAll(e){let t=this.except(e[0]);for(let r=1;r<e.length;r++){let i=e[r];t=t.filter(e=>0>i.indexOf(e))}return t}}class eg extends em{}class ey extends em{constructor(e){super(Object.isFrozen(e)?e:Object.freeze(e))}}var ep={};e(ep,"FactoryRef",()=>eF),e(ep,"ValueRetriever",()=>ew);class eF{_factory;constructor(){this._factory=null}get factory(){if(!this._factory)throw Error("There is no factory registered");return this._factory}get isRegistered(){return!!this.factory}register(e){this._factory=e}unregister(){this._factory=null}}class ew{inputVal;factoryRef;constructor(e){this.inputVal=e,this.factoryRef=new eF}get value(){return this.factoryRef.factory()}}var eN={};Object.defineProperty(eN,"__esModule",{value:!0,configurable:!0}),e(eN,"default",()=>eC);var ev={};e(ev,"DriveItemNodeCore",()=>eb),e(ev,"DriveExplorerApiBase",()=>eP),e(ev,"getRootedPathSegments",()=>eI),e(ev,"dirPointers",()=>eS);class eb{_item;_name;_isFolder;_subFolders;_folderFiles;constructor(e){this._item=e,this._name=this._item.name,this._isFolder=this._item.isFolder??!1}get item(){return this._item}get name(){return this._name}get isFolder(){return this._isFolder}get subFolders(){return this._subFolders}set subFolders(e){this._subFolders=e}get folderFiles(){return this._folderFiles}set folderFiles(e){this._folderFiles=e}}class eP{async GetItem(e,t){let r=this.getPathSegments(e),i=await this.getNode(r,null,t);return i?.item??null}async GetFolder(e,t,r){let i=this.getPathSegments(e),s=await this.getNode(i,!0,r),a=s?.subFolders;if((t??=-1)>0&&a){let e=[...a];for(let r=0;r<e.length;r++){let s=e[r];if(s=await this.getNode([...i,s.name],!0,t-1))e[r]=s;else throw Error("One of the sub folders could not be refreshed")}for(let t=0;t<a.length;t++)a[t]=e[t]}return s?.item??null}async ItemExists(e){return!!await this.GetItem(e)}async FolderExists(e){return!!await this.GetFolder(e)}async FileExists(e){let t=await this.GetItem(e);return!!t&&!0!==t.isFolder}async GetDriveFolderWebUrl(e){throw Error("Method GetDriveFolderWebUrl is not supported")}async GetDriveFileWebUrl(e){throw Error("Method GetDriveFileWebUrl is not supported")}async RenameFolder(e,t){let r=this.getPathSegments(e);return await this.copyOrMoveFolder(r,!0,null,t)}async CopyFolder(e,t,r=null){let i=this.getPathSegments(e),s=this.getPathSegments(t);return await this.copyOrMoveFolder(i,!1,s,r)}async MoveFolder(e,t,r=null){let i=this.getPathSegments(e),s=this.getPathSegments(t);return await this.copyOrMoveFolder(i,!0,s,r)}async CreateOfficeLikeFile(e,t,r){return await this.CreateTextFile(e,t,"")}async RenameFile(e,t){let r=this.getPathSegments(e);return await this.copyOrMoveFile(r,!1,null,t)}async CopyFile(e,t,r=null){let i=this.getPathSegments(e),s=this.getPathSegments(t);return await this.copyOrMoveFile(i,!1,s,r)}async MoveFile(e,t,r=null){let i=this.getPathSegments(e),s=this.getPathSegments(t);return await this.copyOrMoveFile(i,!0,s,r)}async getNode(e,t=null,r=null){let i=null;if(e.length>0){let s=await this.getParentFolder(e,null,null,r);if(s){let r=e.slice(-1)[0];i=t?this.getSubFolder(s,r)??null:!1===t?this.getFolderFile(s,r)??null:this.getSubFolder(s,r)??this.getFolderFile(s,r)??null}}else t&&(i=this.rootDirNode,await this.assureFolderHasDescendants(i));return i??null}async getParentFolder(e,t=null,r=null,i=null){let s=null;if(r??=-1,i??=-1,t){if(await this.assureFolderHasDescendants(t),e.length-r>1){let a=e[r],l=t.subFolders.find(e=>e.name===a);l&&(s=await this.getParentFolder(e,l,r+1,i))}else s=t}else e.length>1?(t=this.rootDirNode,s=await this.getParentFolder(e,t,r+1,i)):s=this.rootDirNode;return s&&await this.assureFolderHasDescendants(s,r+i-e.length>=0),s}getSubFolder(e,t){return e.subFolders.find(e=>e.name===t)}async assureFolderHasDescendants(e,t=null){!t&&e.subFolders&&e.folderFiles||(await this.fillFolderDescendants(e),e.item.subFolders=e.subFolders.map(e=>e.item),e.item.folderFiles=e.folderFiles.map(e=>e.item))}getFolderFile(e,t){return e.folderFiles.find(e=>e.name===t)}sortItems(e){e.sort((e,t)=>e.name.localeCompare(t.name))}throwIfFolderAlreadyContainsItemName(e,t){e.subFolders&&this.throwIfContainsItemName(e.subFolders,t),e.folderFiles&&this.throwIfContainsItemName(e.folderFiles,t)}addItem(e,t){let r=t.name,i=e.findIndex(e=>e.name.localeCompare(r)>0);return i>=0?(i++,e.splice(i,0,t)):(e.push(t),i=e.length),i}throwIfContainsItemName(e,t,r=null){if(this.containsItemName(e,t))throw Error(r??="An item with the same name already exists at this location")}containsItemName(e,t){return e.findIndex(e=>e.name==t)>=0}getPathSegments(e){return eI(e)}}let eS=Object.freeze([".",".."]),eI=e=>{let t=e.path.split("/").filter(e=>eO.isNonEmptyStr(e,!0));if(e.path.startsWith(".")){if(e.basePathSegs){let r=0,i=t[0],s=e.basePathSegs.length-1,a=s>=0;for(;a;){switch(i){case".":break;case"..":s--;break;default:a=!1}i=t[++r]}let l=e.basePathSegs.slice(0,s);t.splice(0,r,...l)}else throw Error("Relative paths are only allowed if base path segments are also provided")}else if(e.homePathSegs&&e.path.startsWith("~/")){let r=e.homePathSegs.length,i=1;for(;i<=r&&".."===t[i];)i++;let s=e.homePathSegs.slice(r-i,r);t.splice(0,i,...s)}for(let e of t){if(e.trim()!=e||e.endsWith("."))throw Error("Rooted path segments are not allowed to end with the dot symbol or start or end with whitespace");if([...e].filter(e=>/\s/.test(e)&&" "!=e))throw Error("Paths are not allowed to contain any other type of whitespace than the space char");if(e.indexOf("  ")>=0)throw Error("Paths are not allowed to contain 2 or more spaces one after the other")}return t};var eC={...ev},eO={...g,...D,...B,...eu,notesAppConfig:j,notesPath:H,url:ed,...ef,...ep,...eN};window.trmrk=eO;let eV=new class{data=null;init(e){"string"==typeof e&&(e=JSON.parse(e)),this.data=e}};window.trmrkApp=eV})();
//# sourceMappingURL=index.js.map