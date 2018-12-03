import axios from 'axios'

let _jsonrpcID = 1;
let _requests = [];

let ubusMsgStatus = [
  'Success',
  'Invalid command',
  'Invalid argument',
  'Method not found',
  'Not found',
  'No response',
  'Permission denied',
  'Request timed out',
  'Operation not supported',
  'Unknown error',
  'Connection failed'
];

function _callCB(msgs, resolve, reject) {
  if (!Array.isArray(msgs))
    msgs = [ msgs ];

  let data = [ ];

  for (let i = 0; i < msgs.length; i++) {
    let msg = msgs[i];
    if (typeof (msg) !== 'object' || msg.jsonrpc !== '2.0')
      throw 'ubus call error: Invalid msg';

    if (typeof (_requests[msg.id]) !== 'object')
      throw 'No related request for JSON response';
    delete _requests[msg.id];

    let result = msg.result;
    if (!result || !Array.isArray(result) || result.length < 1) {
      /* Access denied */
      if (msg.error && msg.error.code === -32002) {
        sessionStorage.removeItem('_ubus_rpc_session');
        reject(msg.error);
        return;
      }

      throw `ubus call error: ${JSON.stringify(msg.error) || 'unknown'}`
    }

    if (result[0] === 0) {
      data.push((result.length > 1) ? result[1] : result[0]);
    } else {
      let error = {code: result[0], message: ubusMsgStatus[result[0]] || ''};
      if (result[0] === 6) {
        sessionStorage.removeItem('_ubus_rpc_session');
        reject(error);
      } else {
        throw `ubus call error: ${JSON.stringify(error)}`
      }
      return;
    }
  }

  resolve((data.length > 1) ? data : data[0]);
}

function _call(batchs) {
  if (!Array.isArray(batchs))
    throw 'The parameter must be an array';

  let msgs = [];

  batchs.forEach((b) => {
    /* store request info */
    _requests[_jsonrpcID] = {};

    /* build message object */
    let msg = {
      jsonrpc: '2.0',
      id: _jsonrpcID++,
      method: 'call',
      params: [
        sessionStorage.getItem('_ubus_rpc_session') || '00000000000000000000000000000000',
        b.object,
        b.method,
        b.params || {}
      ]
    };

    msgs.push(msg);
  });

  return new Promise(function(resolve, reject) {
    axios.post('/ubus', msgs).then((r) => {
      _callCB(r.data, resolve, reject);
    });
    //   method标志位
    //   let data=[]
    //   for(let i=0;i<msgs.length;i++){
    //     if(msgs[i].params[2]=="login"){
    //       data.push({id:msgs[i].id,jsonrpc:msgs[i].jsonrpc,result:[0,{ubus_rpc_session:'00000000000000000000000000000000',data:{}}]})
    //     }else if(msgs[i].params[2]=="info"){
    //         data.push({id:msgs[i].id,jsonrpc:msgs[i].jsonrpc,result:[0,{ubus_rpc_session:'00000000000000000000000000000000',model:'UUWIFI',system:'MediaTek MT7620A ver.2 eco:6',release:{revision:'wq34354-43r'},kernel:'3.1.12',uptime:113600,memory:{free:11000000,total:22000000},load:[40000],root:{free:102400000,total:202400000}}]})
    //       }else if(msgs[i].params[2]=="board"){
    //         data.push({id:msgs[i].id,jsonrpc:msgs[i].jsonrpc,result:[0,{ubus_rpc_session:'00000000000000000000000000000000',data:{username:'zhangsan'}}]})
    //     }else if(msgs[i].params[2]=="diskfree"){
    //         data.push({id:msgs[i].id,jsonrpc:msgs[i].jsonrpc,result:[0,{ubus_rpc_session:'00000000000000000000000000000000',data:{username:'zhangsan'}}]})
    //     }else if(msgs[i].params[2]=="status"){
    //         data.push({id:msgs[i].id,jsonrpc:msgs[i].jsonrpc,result:[0,{up:true,'ipv4-address':[{address:"192.158.10.111"}],route:[{nexthop:'192.158.10.111'}],'dns-server':['192.158.10.111'],}]})
    //     }else if(msgs[i].params[2]=="menu"){
    //         data.push({id:msgs[i].id,jsonrpc:msgs[i].jsonrpc,result:[0,{ubus_rpc_session:'00000000000000000000000000000000',
    //             menu:{
    //                 "status": {
    //                     "title": "Status",
    //                     "index": 10
    //                 },
    //                 "status/overview": {
    //                     "title": "Overview",
    //                     "acls": [ "status" ],
    //                     "view": "status/overview",
    //                     "index": 10
    //                 },
    //                 "status/routes": {
    //                     "title": "Routes",
    //                     "acls": [ "status" ],
    //                     "view": "status/routes",
    //                     "index": 20
    //                 },
    //                 "status/syslog": {
    //                     "title": "System Log",
    //                     "acls": [ "status" ],
    //                     "view": "status/syslog",
    //                     "index": 30
    //                 },
    //                 "status/dmesg": {
    //                     "title": "Kernel Log",
    //                     "acls": [ "status" ],
    //                     "view": "status/dmesg",
    //                     "index": 40
    //                 },
    //                 "status/processes": {
    //                     "title": "Processes",
    //                     "acls": [ "status" ],
    //                     "view": "status/processes",
    //                     "index": 50
    //                 },
    //                 "status/realtime": {
    //                     "title": "Realtime Graphs",
    //                     "acls": [ "status" ],
    //                     "view": "status/realtime",
    //                     "index": 50
    //                 },
    //                 "network": {
    //                     "title": "Network",
    //                     "index": 30
    //                 },
    //                 "network/interfaces": {
    //                     "title": "Interfaces",
    //                     "acls": [ "network" ],
    //                     "view": "network/interfaces",
    //                     "index": 10
    //                 },
    //                 "network/wireless": {
    //                     "title": "Wireless",
    //                     "acls": [ "network" ],
    //                     "view": "network/wireless",
    //                     "index": 20
    //                 },
    //                 "network/switch": {
    //                     "title": "Switch",
    //                     "acls": [ "network" ],
    //                     "files": [ "/sbin/swconfig" ],
    //                     "view": "network/switch",
    //                     "index": 30
    //                 },
    //                 "network/hosts": {
    //                     "title": "Hostnames",
    //                     "acls": [ "hostnames" ],
    //                     "files": [ "/etc/config/dhcp" ],
    //                     "view": "network/hosts",
    //                     "index": 50
    //                 },
    //                 "network/routes": {
    //                     "title": "Routes",
    //                     "acls": [ "routes" ],
    //                     "view": "network/routes",
    //                     "index": 70
    //                 },
    //                 "network/diagnostics": {
    //                     "title": "Diagnostics",
    //                     "acls": [ "diagnostics" ],
    //                     "view": "network/diagnostics",
    //                     "index": 80
    //                 },
    //                 "system": {
    //                     "title": "System",
    //                     "index": 20
    //                 },
    //                 "system/system": {
    //                     "title": "System",
    //                     "acls": [ "system" ],
    //                     "view": "system/system",
    //                     "index": 10
    //                 },
    //                 "system/admin": {
    //                     "title": "Administration",
    //                     "acls": [ "admin" ],
    //                     "view": "system/admin",
    //                     "index": 20
    //                 },
    //                 "system/users": {
    //                     "title": "Guest Logins",
    //                     "acls": [ "users" ],
    //                     "view": "system/users",
    //                     "index": 30
    //                 },
    //                 "system/software": {
    //                     "title": "Software",
    //                     "acls": [ "software" ],
    //                     "files": [ "/bin/opkg" ],
    //                     "view": "system/software",
    //                     "index": 40
    //                 },
    //                 "system/backup": {
    //                     "title": "Backup",
    //                     "acls": [ "backup" ],
    //                     "view": "system/backup",
    //                     "index": 50
    //                 },
    //                 "system/upgrade": {
    //                     "title": "Upgrade",
    //                     "acls": [ "upgrade" ],
    //                     "view": "system/upgrade",
    //                     "index": 55
    //                 },
    //                 "system/startup": {
    //                     "title": "Startup",
    //                     "acls": [ "startup" ],
    //                     "view": "system/startup",
    //                     "index": 60
    //                 },
    //                 "system/cron": {
    //                     "title": "Scheduled Tasks",
    //                     "acls": [ "cron" ],
    //                     "view": "system/cron",
    //                     "index": 70
    //                 },
    //                 "system/leds": {
    //                     "title": "LED Configuration",
    //                     "acls": [ "leds" ],
    //                     "files": [ "/etc/init.d/led" ],
    //                     "view": "system/leds",
    //                     "index": 80
    //                 }
    //             }}]})
    //     }else if(msgs[i].params[2]=="arp_table"){
    //         data.push({id:msgs[i].id,jsonrpc:msgs[i].jsonrpc,result:[0,{ubus_rpc_session:'00000000000000000000000000000000',
    //             entries:[{ipaddr:'11111',macaddr:'3243',device:'343'}]}]})
    //     }else if(msgs[i].params[2]=="routes"){
    //         data.push({id:msgs[i].id,jsonrpc:msgs[i].jsonrpc,result:[0,{ubus_rpc_session:'00000000000000000000000000000000',
    //             routes:[{target:'11111',nexthop:'3243',metric:'343',device:'343'}]}]})
    //     }else if(msgs[i].params[2]=="routes6"){
    //         data.push({id:msgs[i].id,jsonrpc:msgs[i].jsonrpc,result:[0,{ubus_rpc_session:'00000000000000000000000000000000',
    //             routes:[{target:'11111',source:'3243',nexthop:'343',metric:'343',Interface:'343'}]}]})
    //     }else if(msgs[i].params[2]=="syslog"){
    //         data.push({id:msgs[i].id,jsonrpc:msgs[i].jsonrpc,result:[0,{ubus_rpc_session:'00000000000000000000000000000000',
    //             log:'aiwewiqf\nHDIWHDDQW\nHCihqw\njoajjddes\n'}]})
    //     }else if(msgs[i].params[2]=="dmesg"){
    //         data.push({id:msgs[i].id,jsonrpc:msgs[i].jsonrpc,result:[0,{ubus_rpc_session:'00000000000000000000000000000000',
    //             log:'aiwewiqf\nHDIWHDDQW\nHCihqw\njoajjddes\n'}]})
    //     }else if(msgs[i].params[2]=="process_list"){
    //         data.push({id:msgs[i].id,jsonrpc:msgs[i].jsonrpc,result:[0,{ubus_rpc_session:'00000000000000000000000000000000',
    //             processes:[{pid:'1',user:'user12',cpu_percent:'43',vsize_percent:'43',command:'shutdown'}]}]})
    //     }
    //   }
    //   _callCB(data,resolve,reject)
  });
}

export function call(object, method, params) {
  return _call([{object, method, params}]);
}

export function callBatch(batchs) {
  return _call(batchs);
}

const ubus = {}

ubus.install = function(Vue) {
  Vue.prototype.$ubus = {
    call: call,
    callBatch: callBatch
  }
}

export default ubus
