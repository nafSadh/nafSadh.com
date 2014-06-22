var modules = {};

var defs = {};

defs["src/web.js"] = function (module, exports) {
// Check if a new cache is available on page load.
window.addEventListener('load', function(e) {
  window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      // Browser downloaded a new app cache.
      // if (confirm('A new version of this site is available. Load it?')) {
        window.location.reload();
      // }
    } else {
      // Manifest didn't changed. Nothing new to server.
    }
  }, false);
}, false);

// Configure the platform
var platform = {
  bops: require('node_modules/bops/index.js'),
  // inflate: require('git-zlib/inflate.js'),
  // deflate: require('git-zlib/deflate.js'),
  tcp: require('node_modules/websocket-tcp-client/web-tcp.js').tcp,
  tls: require('node_modules/websocket-tcp-client/web-tcp.js').tls,
};
platform.http = require('node_modules/git-http/pure-http.js')(platform);
if (/\btrace\b/.test(document.location.search)) {
  platform.trace = require('src/lib/trace.js');
}

// Polyfill setImmediate
if (!window.setImmediate) window.setImmediate = require('src/lib/defer.js');

// Configure the backend
var backend = require('src/app/backend.js')({
  repo: require('node_modules/js-git/js-git.js'),
  remote: require('node_modules/git-net/remote.js')(platform),
  db: require('node_modules/git-indexeddb/indexeddb.js')(platform),
  // db: require('git-memdb'),
  settings: { get: get, set: set },
});

function get(key) {
  return JSON.parse(window.localStorage.getItem(key));
}

function set(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

// Launch the GUI
require('src/app/phone-ui.js')(backend);
};

defs["node_modules/bops/index.js"] = function (module, exports) {
var proto = {}
module.exports = proto

proto.from = require('node_modules/bops/typedarray/from.js')
proto.to = require('node_modules/bops/typedarray/to.js')
proto.is = require('node_modules/bops/typedarray/is.js')
proto.subarray = require('node_modules/bops/typedarray/subarray.js')
proto.join = require('node_modules/bops/typedarray/join.js')
proto.copy = require('node_modules/bops/typedarray/copy.js')
proto.create = require('node_modules/bops/typedarray/create.js')

mix(require('node_modules/bops/typedarray/read.js'), proto)
mix(require('node_modules/bops/typedarray/write.js'), proto)

function mix(from, into) {
  for(var key in from) {
    into[key] = from[key]
  }
}
};

defs["node_modules/bops/typedarray/from.js"] = function (module, exports) {
module.exports = from

var base64 = require('node_modules/bops/node_modules/base64-js/lib/b64.js')

var decoders = {
    hex: from_hex
  , utf8: from_utf
  , base64: from_base64
}

function from(source, encoding) {
  if(Array.isArray(source)) {
    return new Uint8Array(source)
  }

  return decoders[encoding || 'utf8'](source)
}

function from_hex(str) {
  var size = str.length / 2
    , buf = new Uint8Array(size)
    , character = ''

  for(var i = 0, len = str.length; i < len; ++i) {
    character += str.charAt(i)

    if(i > 0 && (i % 2) === 1) {
      buf[i>>>1] = parseInt(character, 16)
      character = '' 
    }
  }

  return buf 
}

function from_utf(str) {
  var arr = []
    , code

  for(var i = 0, len = str.length; i < len; ++i) {
    code = fixed_cca(str, i)

    if(code === false) {
      continue
    }

    if(code < 0x80) {
      arr[arr.length] = code

      continue
    }

    codepoint_to_bytes(arr, code)
  }

  return new Uint8Array(arr)
}

function codepoint_to_bytes(arr, code) {
  // find MSB, use that to determine byte count
  var copy_code = code
    , bit_count = 0
    , byte_count
    , prefix
    , _byte
    , pos

  do {
    ++bit_count
  } while(copy_code >>>= 1)

  byte_count = Math.ceil((bit_count - 1) / 5) | 0
  prefix = [0, 0, 0xc0, 0xe0, 0xf0, 0xf8, 0xfc][byte_count]
  pos = [0, 0, 3, 4, 5, 6, 7][byte_count]

  _byte |= prefix

  bit_count = (7 - pos) + 6 * (byte_count - 1)

  while(bit_count) {
    _byte |= +!!(code & (1 << bit_count)) << (7 - pos)
    ++pos

    if(pos % 8 === 0) {
      arr[arr.length] = _byte
      _byte = 0x80
      pos = 2
    }

    --bit_count
  }

  if(pos) {
    _byte |= +!!(code & 1) << (7 - pos)
    arr[arr.length] = _byte
  }
}

function pad(str) {
  while(str.length < 8) {
    str = '0' + str
  }

  return str
}

function fixed_cca(str, idx) {
  idx = idx || 0

  var code = str.charCodeAt(idx)
    , lo
    , hi

  if(0xD800 <= code && code <= 0xDBFF) {
    lo = str.charCodeAt(idx + 1)
    hi = code

    if(isNaN(lo)) {
      throw new Error('High surrogate not followed by low surrogate')
    }

    return ((hi - 0xD800) * 0x400) + (lo - 0xDC00) + 0x10000
  }

  if(0xDC00 <= code && code <= 0xDFFF) {
    return false
  }

  return code
}

function from_base64(str) {
  return new Uint8Array(base64.toByteArray(str)) 
}
};

defs["node_modules/bops/node_modules/base64-js/lib/b64.js"] = function (module, exports) {
(function (exports) {
	'use strict';

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	function b64ToByteArray(b64) {
		var i, j, l, tmp, placeHolders, arr;
	
		if (b64.length % 4 > 0) {
			throw 'Invalid string. Length must be a multiple of 4';
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		placeHolders = b64.indexOf('=');
		placeHolders = placeHolders > 0 ? b64.length - placeHolders : 0;

		// base64 is 4/3 + up to two characters of the original data
		arr = [];//new Uint8Array(b64.length * 3 / 4 - placeHolders);

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length;

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (lookup.indexOf(b64[i]) << 18) | (lookup.indexOf(b64[i + 1]) << 12) | (lookup.indexOf(b64[i + 2]) << 6) | lookup.indexOf(b64[i + 3]);
			arr.push((tmp & 0xFF0000) >> 16);
			arr.push((tmp & 0xFF00) >> 8);
			arr.push(tmp & 0xFF);
		}

		if (placeHolders === 2) {
			tmp = (lookup.indexOf(b64[i]) << 2) | (lookup.indexOf(b64[i + 1]) >> 4);
			arr.push(tmp & 0xFF);
		} else if (placeHolders === 1) {
			tmp = (lookup.indexOf(b64[i]) << 10) | (lookup.indexOf(b64[i + 1]) << 4) | (lookup.indexOf(b64[i + 2]) >> 2);
			arr.push((tmp >> 8) & 0xFF);
			arr.push(tmp & 0xFF);
		}

		return arr;
	}

	function uint8ToBase64(uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length;

		function tripletToBase64 (num) {
			return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
		};

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
			output += tripletToBase64(temp);
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1];
				output += lookup[temp >> 2];
				output += lookup[(temp << 4) & 0x3F];
				output += '==';
				break;
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1]);
				output += lookup[temp >> 10];
				output += lookup[(temp >> 4) & 0x3F];
				output += lookup[(temp << 2) & 0x3F];
				output += '=';
				break;
		}

		return output;
	}

	module.exports.toByteArray = b64ToByteArray;
	module.exports.fromByteArray = uint8ToBase64;
}());
};

defs["node_modules/bops/typedarray/to.js"] = function (module, exports) {
module.exports = to

var base64 = require('node_modules/bops/node_modules/base64-js/lib/b64.js')
  , toutf8 = require('node_modules/bops/node_modules/to-utf8/index.js')

var encoders = {
    hex: to_hex
  , utf8: to_utf
  , base64: to_base64
}

function to(buf, encoding) {
  return encoders[encoding || 'utf8'](buf)
}

function to_hex(buf) {
  var str = ''
    , byt

  for(var i = 0, len = buf.length; i < len; ++i) {
    byt = buf[i]
    str += ((byt & 0xF0) >>> 4).toString(16)
    str += (byt & 0x0F).toString(16)
  }

  return str
}

function to_utf(buf) {
  return toutf8(buf)
}

function to_base64(buf) {
  return base64.fromByteArray(buf)
}
};

defs["node_modules/bops/node_modules/to-utf8/index.js"] = function (module, exports) {
module.exports = to_utf8

var out = []
  , col = []
  , fcc = String.fromCharCode
  , mask = [0x40, 0x20, 0x10, 0x08, 0x04, 0x02, 0x01]
  , unmask = [
      0x00
    , 0x01
    , 0x02 | 0x01
    , 0x04 | 0x02 | 0x01
    , 0x08 | 0x04 | 0x02 | 0x01
    , 0x10 | 0x08 | 0x04 | 0x02 | 0x01
    , 0x20 | 0x10 | 0x08 | 0x04 | 0x02 | 0x01
    , 0x40 | 0x20 | 0x10 | 0x08 | 0x04 | 0x02 | 0x01
  ]

function to_utf8(bytes, start, end) {
  start = start === undefined ? 0 : start
  end = end === undefined ? bytes.length : end

  var idx = 0
    , hi = 0x80
    , collecting = 0
    , pos
    , by

  col.length =
  out.length = 0

  while(idx < bytes.length) {
    by = bytes[idx]
    if(!collecting && by & hi) {
      pos = find_pad_position(by)
      collecting += pos
      if(pos < 8) {
        col[col.length] = by & unmask[6 - pos]
      }
    } else if(collecting) {
      col[col.length] = by & unmask[6]
      --collecting
      if(!collecting && col.length) {
        out[out.length] = fcc(reduced(col, pos))
        col.length = 0
      }
    } else { 
      out[out.length] = fcc(by)
    }
    ++idx
  }
  if(col.length && !collecting) {
    out[out.length] = fcc(reduced(col, pos))
    col.length = 0
  }
  return out.join('')
}

function find_pad_position(byt) {
  for(var i = 0; i < 7; ++i) {
    if(!(byt & mask[i])) {
      break
    }
  }
  return i
}

function reduced(list) {
  var out = 0
  for(var i = 0, len = list.length; i < len; ++i) {
    out |= list[i] << ((len - i - 1) * 6)
  }
  return out
}
};

defs["node_modules/bops/typedarray/is.js"] = function (module, exports) {
module.exports = function(buffer) {
  return buffer instanceof Uint8Array;
}
};

defs["node_modules/bops/typedarray/subarray.js"] = function (module, exports) {
module.exports = subarray

function subarray(buf, from, to) {
  return buf.subarray(from || 0, to || buf.length)
}
};

defs["node_modules/bops/typedarray/join.js"] = function (module, exports) {
module.exports = join

function join(targets, hint) {
  if(!targets.length) {
    return new Uint8Array(0)
  }

  var len = hint !== undefined ? hint : get_length(targets)
    , out = new Uint8Array(len)
    , cur = targets[0]
    , curlen = cur.length
    , curidx = 0
    , curoff = 0
    , i = 0

  while(i < len) {
    if(curoff === curlen) {
      curoff = 0
      ++curidx
      cur = targets[curidx]
      curlen = cur && cur.length
      continue
    }
    out[i++] = cur[curoff++] 
  }

  return out
}

function get_length(targets) {
  var size = 0
  for(var i = 0, len = targets.length; i < len; ++i) {
    size += targets[i].byteLength
  }
  return size
}
};

defs["node_modules/bops/typedarray/copy.js"] = function (module, exports) {
module.exports = copy

var slice = [].slice

function copy(source, target, target_start, source_start, source_end) {
  target_start = arguments.length < 3 ? 0 : target_start
  source_start = arguments.length < 4 ? 0 : source_start
  source_end = arguments.length < 5 ? source.length : source_end

  if(source_end === source_start) {
    return
  }

  if(target.length === 0 || source.length === 0) {
    return
  }

  if(source_end > source.length) {
    source_end = source.length
  }

  if(target.length - target_start < source_end - source_start) {
    source_end = target.length - target_start + source_start
  }

  if(source.buffer !== target.buffer) {
    return fast_copy(source, target, target_start, source_start, source_end)
  }
  return slow_copy(source, target, target_start, source_start, source_end)
}

function fast_copy(source, target, target_start, source_start, source_end) {
  var len = (source_end - source_start) + target_start

  for(var i = target_start, j = source_start;
      i < len;
      ++i,
      ++j) {
    target[i] = source[j]
  }
}

function slow_copy(from, to, j, i, jend) {
  // the buffers could overlap.
  var iend = jend + i
    , tmp = new Uint8Array(slice.call(from, i, iend))
    , x = 0

  for(; i < iend; ++i, ++x) {
    to[j++] = tmp[x]
  }
}
};

defs["node_modules/bops/typedarray/create.js"] = function (module, exports) {
module.exports = function(size) {
  return new Uint8Array(size)
}
};

defs["node_modules/bops/typedarray/read.js"] = function (module, exports) {
module.exports = {
    readUInt8:      read_uint8
  , readInt8:       read_int8
  , readUInt16LE:   read_uint16_le
  , readUInt32LE:   read_uint32_le
  , readInt16LE:    read_int16_le
  , readInt32LE:    read_int32_le
  , readFloatLE:    read_float_le
  , readDoubleLE:   read_double_le
  , readUInt16BE:   read_uint16_be
  , readUInt32BE:   read_uint32_be
  , readInt16BE:    read_int16_be
  , readInt32BE:    read_int32_be
  , readFloatBE:    read_float_be
  , readDoubleBE:   read_double_be
}

var map = require('node_modules/bops/typedarray/mapped.js')

function read_uint8(target, at) {
  return target[at]
}

function read_int8(target, at) {
  var v = target[at];
  return v < 0x80 ? v : v - 0x100
}

function read_uint16_le(target, at) {
  var dv = map.get(target);
  return dv.getUint16(at + target.byteOffset, true)
}

function read_uint32_le(target, at) {
  var dv = map.get(target);
  return dv.getUint32(at + target.byteOffset, true)
}

function read_int16_le(target, at) {
  var dv = map.get(target);
  return dv.getInt16(at + target.byteOffset, true)
}

function read_int32_le(target, at) {
  var dv = map.get(target);
  return dv.getInt32(at + target.byteOffset, true)
}

function read_float_le(target, at) {
  var dv = map.get(target);
  return dv.getFloat32(at + target.byteOffset, true)
}

function read_double_le(target, at) {
  var dv = map.get(target);
  return dv.getFloat64(at + target.byteOffset, true)
}

function read_uint16_be(target, at) {
  var dv = map.get(target);
  return dv.getUint16(at + target.byteOffset, false)
}

function read_uint32_be(target, at) {
  var dv = map.get(target);
  return dv.getUint32(at + target.byteOffset, false)
}

function read_int16_be(target, at) {
  var dv = map.get(target);
  return dv.getInt16(at + target.byteOffset, false)
}

function read_int32_be(target, at) {
  var dv = map.get(target);
  return dv.getInt32(at + target.byteOffset, false)
}

function read_float_be(target, at) {
  var dv = map.get(target);
  return dv.getFloat32(at + target.byteOffset, false)
}

function read_double_be(target, at) {
  var dv = map.get(target);
  return dv.getFloat64(at + target.byteOffset, false)
}
};

defs["node_modules/bops/typedarray/mapped.js"] = function (module, exports) {
var proto
  , map

module.exports = proto = {}

map = typeof WeakMap === 'undefined' ? null : new WeakMap

proto.get = !map ? no_weakmap_get : get

function no_weakmap_get(target) {
  return new DataView(target.buffer, 0)
}

function get(target) {
  var out = map.get(target.buffer)
  if(!out) {
    map.set(target.buffer, out = new DataView(target.buffer, 0))
  }
  return out
}
};

defs["node_modules/bops/typedarray/write.js"] = function (module, exports) {
module.exports = {
    writeUInt8:      write_uint8
  , writeInt8:       write_int8
  , writeUInt16LE:   write_uint16_le
  , writeUInt32LE:   write_uint32_le
  , writeInt16LE:    write_int16_le
  , writeInt32LE:    write_int32_le
  , writeFloatLE:    write_float_le
  , writeDoubleLE:   write_double_le
  , writeUInt16BE:   write_uint16_be
  , writeUInt32BE:   write_uint32_be
  , writeInt16BE:    write_int16_be
  , writeInt32BE:    write_int32_be
  , writeFloatBE:    write_float_be
  , writeDoubleBE:   write_double_be
}

var map = require('node_modules/bops/typedarray/mapped.js')

function write_uint8(target, value, at) {
  return target[at] = value
}

function write_int8(target, value, at) {
  return target[at] = value < 0 ? value + 0x100 : value
}

function write_uint16_le(target, value, at) {
  var dv = map.get(target);
  return dv.setUint16(at + target.byteOffset, value, true)
}

function write_uint32_le(target, value, at) {
  var dv = map.get(target);
  return dv.setUint32(at + target.byteOffset, value, true)
}

function write_int16_le(target, value, at) {
  var dv = map.get(target);
  return dv.setInt16(at + target.byteOffset, value, true)
}

function write_int32_le(target, value, at) {
  var dv = map.get(target);
  return dv.setInt32(at + target.byteOffset, value, true)
}

function write_float_le(target, value, at) {
  var dv = map.get(target);
  return dv.setFloat32(at + target.byteOffset, value, true)
}

function write_double_le(target, value, at) {
  var dv = map.get(target);
  return dv.setFloat64(at + target.byteOffset, value, true)
}

function write_uint16_be(target, value, at) {
  var dv = map.get(target);
  return dv.setUint16(at + target.byteOffset, value, false)
}

function write_uint32_be(target, value, at) {
  var dv = map.get(target);
  return dv.setUint32(at + target.byteOffset, value, false)
}

function write_int16_be(target, value, at) {
  var dv = map.get(target);
  return dv.setInt16(at + target.byteOffset, value, false)
}

function write_int32_be(target, value, at) {
  var dv = map.get(target);
  return dv.setInt32(at + target.byteOffset, value, false)
}

function write_float_be(target, value, at) {
  var dv = map.get(target);
  return dv.setFloat32(at + target.byteOffset, value, false)
}

function write_double_be(target, value, at) {
  var dv = map.get(target);
  return dv.setFloat64(at + target.byteOffset, value, false)
}
};

defs["node_modules/websocket-tcp-client/web-tcp.js"] = function (module, exports) {
exports.connect = connect;
exports.tcp = { connect: connect.bind(null, "tcp") };
exports.tls = { connect: connect.bind(null, "tls") };

function connect(protocol, port, host, callback) {
  if (typeof host === "function" && typeof callback === "undefined") {
    callback = host;
    host = "127.0.0.1";
  }
  if (!callback) return connect.bind(this, port, host);
  if (typeof port !== "number") throw new TypeError("port must be number");
  if (typeof host !== "string") throw new TypeError("host must be string");
  if (typeof callback !== "function") throw new TypeError("callback must be function");
  var url = (document.location.protocol + "//" + document.location.host + "/").replace(/^http/, "ws") + protocol + "/" + host + "/" + port;
  var ws = new WebSocket(url, "tcp");
  ws.binaryType = 'arraybuffer';
  ws.onopen = function (evt) {
    ws.onmessage = function (evt) {
      if (evt.data === "connect") return callback(null, wrapSocket(ws));
      callback(new Error(evt.data));
    };
  };
}

function wrapSocket(ws) {
  var queue = [];
  var done, cb;
  var source, finish;

  ws.onmessage = function (evt) {
    var data = evt.data;
    if (!data) return;
    if (typeof data === "string") {
      queue.push([new Error(data)]);
    }
    else {
      var str = "";
      data = new Uint8Array(data);
      for (var i = 0, l = data.length; i < l; i++) {
        str += String.fromCharCode(data[i]);
      }
      queue.push([null, data]);
    }
    return check();
  };

  ws.onclose = function (evt) {
    queue.push([]);
    return check();
  };

  ws.onerror = function (evt) {
    queue.push([new Error("Websocket connection closed")]);
    return check();
  };

  return { read: read, abort: abort, sink: sink };

  function read(callback) {
    if (done) return callback();
    if (cb) return callback(new Error("Only one read at a time allowed"));
    cb = callback;
    return check();
  }

  function check() {
    if (cb && queue.length) {
      var callback = cb;
      cb = null;
      callback.apply(null, queue.shift());
    }
  }

  function abort(callback) {
    if (done) return callback();
    done = true;
    ws.onmessage = null;
    ws.onclose = null;
    ws.onerror = null;
    try { ws.close(); } catch (err) {}
    callback();
  }

  function sink(stream, callback) {
    if (!callback) return sink.bind(this, stream);
    if (source) throw new Error("Already has source");
    source = stream;
    finish = callback;
    source.read(onRead);
  }

  function onRead(err, chunk) {
    if (chunk === undefined) {
      try {
        ws.close();
      } catch (err) {}
      return finish(err);
    }
    ws.send(chunk);
    source.read(onRead);
  }

}
};

defs["node_modules/git-http/pure-http.js"] = function (module, exports) {
var bops, tls, tcp, http, decoder, encoder, trace;
var pushToPull = require('node_modules/push-to-pull/transform.js');
var writable = require('node_modules/git-net/writable.js');
module.exports = function (platform) {
  bops = platform.bops;
  tcp = platform.tcp;
  tls = platform.tls;
  trace = platform.trace;
  http = require('node_modules/git-http/node_modules/http-codec/http-codec.js')(platform);
  decoder = pushToPull(http.client.decoder);
  encoder = http.client.encoder;
  return { request: request };
};

function request(opts, callback) {
  if (opts.tls && !tls) return callback(new Error("secure https not supported"));
  if (!opts.tls && !tcp) return callback(new Error("plain http not supported"));

  if (trace) trace("request", null, {
    method: opts.method,
    host: opts.hostname,
    port: opts.port,
    path: opts.path,
    headers: opts.headers
  });

  var read, abort, write;

  return (opts.tls ? tls : tcp).connect(opts.port, opts.hostname, onConnect);

  function onConnect(err, socket) {
    if (err) return callback(err);
    var input = decoder(socket);
    read = input.read;
    abort = input.abort;
    var output = writable(socket.abort);
    socket.sink(output, onEnd);
    write = encoder(output);
    write({
      method: opts.method,
      path: opts.path,
      headers: objToPairs(opts.headers)
    });
    read(onResponse);
    if (opts.body) {
      var body = opts.body;
      if (typeof body === "string") body = bops.from(body);
      if (bops.is(body)) {
        return write(body);
      }
      throw "TODO: streaming request body";
    }
  }

  function onResponse(err, res) {
    if (err) return callback(err);
    var headers = pairsToObj(res.headers);

    if (trace) trace("response", null, {
      code: res.code,
      headers: headers
    });

    callback(null, res.code, headers, {read:read,abort:abort});

  }

  function onEnd(err) {
    if (err) throw err;
  }

}

function objToPairs(obj) {
  return Object.keys(obj).map(function (key) {
    return [key, obj[key]];
  });
}

function pairsToObj(pairs) {
  var obj = {};
  pairs.forEach(function (pair) {
    obj[pair[0].toLowerCase()] = pair[1];
  });
  return obj;
}
};

defs["node_modules/push-to-pull/transform.js"] = function (module, exports) {
// input push-filter: (emit) -> emit
// output is simple-stream pull-filter: (stream) -> stream
module.exports = pushToPull;
function pushToPull(parser) {
  return function (stream) {
  
    var write = parser(onData);
    var cb = null;
    var queue = [];
      
    return { read: read, abort: stream.abort };
    
    function read(callback) {
      if (queue.length) return callback(null, queue.shift());
      if (cb) return callback(new Error("Only one read at a time."));
      cb = callback;
      stream.read(onRead);
      
    }

    function onRead(err, item) {
      var callback = cb;
      cb = null;
      if (err) return callback(err);
      try {
        write(item);
      }
      catch (err) {
        return callback(err);
      }
      return read(callback);
    }

    function onData(item) {
      queue.push(item);
    }

  };
}
};

defs["node_modules/git-net/writable.js"] = function (module, exports) {
module.exports = writable;

function writable(abort) {
  var queue = [];
  var emit = null;
  
  write.read = read;
  write.abort = abort;
  write.error = error;
  return write;
  
  function write(item) {
    queue.push([null, item]);
    check();
  }
  
  function error(err) {
    queue.push([err]);
    check();
  }
  
  function read(callback) {
    if (queue.length) {
      return callback.apply(null, queue.shift());
    }
    if (emit) return callback(new Error("Only one read at a time"));
    emit = callback;
    check();
  }
  
  function check() {
    if (emit && queue.length) {
      var callback = emit;
      emit = null;
      callback.apply(null, queue.shift());
    }
  }
}
};

defs["node_modules/git-http/node_modules/http-codec/http-codec.js"] = function (module, exports) {
var bops, HTTP1_1;
module.exports = function (platform) {
  bops = platform.bops;
  HTTP1_1 = bops.from("HTTP/1.1");
  return {
    server: {
      encoder: serverEncoder,
      decoder: serverDecoder,
    },
    client: {
      encoder: clientEncoder,
      decoder: clientDecoder,
    },
  };
};

function serverEncoder(write) {
  return function (res) {
    throw "TODO: Implement serverEncoder";
  };
}

function clientEncoder(write) {
  return function (req) {
    if (req === undefined) return write(undefined);
    if (bops.is(req)) return write(req);
    var head = req.method + " " + req.path + " HTTP/1.1\r\n";
    req.headers.forEach(function (pair) {
      head += pair[0] + ": " + pair[1] + "\r\n";
    });
    head += "\r\n";
    write(bops.from(head));
  };
}

function clientDecoder(emit) {
  return parser(true, emit);
}

function serverDecoder(emit) {
  return parser(false, emit);
}

function parser(client, emit) {
  var position = 0, code = 0;
  var key = "", value = "";
  var chunked = false, length;
  var headers = [];
  var $start = client ? $client : $server;
  var state = $start;
  return function (chunk) {
    if (chunk === undefined) return emit();
    if (!state) return emit(chunk);
    var i = 0, length = chunk.length;
    while (i < length) {
      state = state(chunk[i++]);
      if (state) continue;
      emit(bops.subarray(chunk, i));
      break;
    }
  };

  function $client(byte) {
    if (byte === HTTP1_1[position++]) return $client;
    if (byte === 0x20 && position === 9) {
      position = 0;
      return $code;
    }
    throw new SyntaxError("Must be HTTP/1.1 response");
  }

  function $code(byte) {
    if (byte === 0x20) return $message;
    if (position++ < 3) {
      code = (code * 10) + byte - 0x30;
      position = 0;
      return $code;
    }
    throw new SyntaxError("Invalid status code");
  }

  function $message(byte) {
    if (byte === 0x0d) {
      position = 0;
      return $newline;
    }
    return $message;
  }

  function $server(byte) {
    throw "TODO: Implement server-side parser";
  }

  function $newline(byte) {
    if (byte === 0x0a) return $end;
    throw new SyntaxError("Invalid line ending");
  }

  function $end(byte) {
    if (byte === 0x0d) return $ending;
    return $key(byte);
  }

  function $key(byte) {
    if (byte === 0x3a) return $sep;
    key += String.fromCharCode(byte);
    return $key;
  }

  function $sep(byte) {
    if (byte === 0x20) return $sep;
    return $value(byte);
  }

  function $value(byte) {
    if (byte === 0x0d) {
      var lower = key.toLowerCase();
      if (lower === "transfer-encoding" && value === "chunked") {
        chunked = true;
      }
      else if (lower === "content-length") length = parseInt(value, 10);
      headers.push([key, value]);
      key = "";
      value = "";
      return $newline;
    }
    value += String.fromCharCode(byte);
    return $value;
  }

  function $ending(byte) {
    if (byte === 0x0a) {
      emit({
        code: code,
        headers: headers
      });
      headers = [];
      code = 0;
      if (chunked) return chunkMachine(emit, $start);
      return null;
    }
    throw new SyntaxError("Invalid header ending");
  }

}

function chunkMachine(emit, $start) {
  var position = 0, size = 0;
  var chunk = null;
  return $len;
  function $len(byte) {
    if (byte === 0x0d) return $chunkStart;
    size <<= 4;
    if (byte >= 0x30 && byte < 0x40) size += byte - 0x30;
    else if (byte > 0x60 && byte <= 0x66) size += byte - 0x57;
    else if (byte > 0x40 && byte <= 0x46) size += byte - 0x37;
    else throw new SyntaxError("Invalid chunked encoding length header");
    return $len;
  }

  function $chunkStart(byte) {
    if (byte === 0x0a) {
      if (size) {
        chunk = bops.create(size);
        return $chunk;
      }
      return $ending;
    }
    throw new SyntaxError("Invalid chunk ending");
  }

  function $chunk(byte) {
    chunk[position++] = byte;
    if (position < size) return $chunk;
    return $ending;
  }

  function $ending(byte) {
    if (byte !== 0x0d) throw new SyntaxError("Problem in chunked encoding");
    return $end;

  }

  function $end(byte) {
    if (byte !== 0x0a) throw new SyntaxError("Problem in chunked encoding");
    var next;
    if (size) {
      emit(chunk);
      next = $len;
    }
    else {
      emit();
      next = $start;
    }
    chunk = null;
    size = 0;
    position = 0;
    return next;
  }

}


// exports.encoder = encoder;
// function encoder(emit) {
//   var fn = function (err, item) {
//     if (item === undefined) return emit(err);
//     if (typeof item === "string") {
//       return emit(null, bops.from(item));
//     }
//     if (bops.is(item)) {
//       return emit(null, item);
//     }
//     var head = "HTTP/1.1 " + item.statusCode + " " + STATUS_CODES[item.statusCode] + "\r\n";
//     for (var i = 0, l = item.headers.length; i < l; i += 2) {
//       head += item.headers[i] + ": " + item.headers[i + 1] + "\r\n";
//     }
//     head += "\r\n";
//     emit(null, bops.from(head));
//   };
//   fn.is = "min-stream-write";
//   return fn;
// }
// encoder.is = "min-stream-push-filter";
// function syntaxError(message, array) {
//   return new SyntaxError(message + ": " +
//     JSON.stringify(bops.to(bops.from(array)))
//   );
// }

var STATUS_CODES = {
  '100': 'Continue',
  '101': 'Switching Protocols',
  '102': 'Processing',                 // RFC 2518, obsoleted by RFC 4918
  '200': 'OK',
  '201': 'Created',
  '202': 'Accepted',
  '203': 'Non-Authoritative Information',
  '204': 'No Content',
  '205': 'Reset Content',
  '206': 'Partial Content',
  '207': 'Multi-Status',               // RFC 4918
  '300': 'Multiple Choices',
  '301': 'Moved Permanently',
  '302': 'Moved Temporarily',
  '303': 'See Other',
  '304': 'Not Modified',
  '305': 'Use Proxy',
  '307': 'Temporary Redirect',
  '400': 'Bad Request',
  '401': 'Unauthorized',
  '402': 'Payment Required',
  '403': 'Forbidden',
  '404': 'Not Found',
  '405': 'Method Not Allowed',
  '406': 'Not Acceptable',
  '407': 'Proxy Authentication Required',
  '408': 'Request Time-out',
  '409': 'Conflict',
  '410': 'Gone',
  '411': 'Length Required',
  '412': 'Precondition Failed',
  '413': 'Request Entity Too Large',
  '414': 'Request-URI Too Large',
  '415': 'Unsupported Media Type',
  '416': 'Requested Range Not Satisfiable',
  '417': 'Expectation Failed',
  '418': 'I\'m a teapot',              // RFC 2324
  '422': 'Unprocessable Entity',       // RFC 4918
  '423': 'Locked',                     // RFC 4918
  '424': 'Failed Dependency',          // RFC 4918
  '425': 'Unordered Collection',       // RFC 4918
  '426': 'Upgrade Required',           // RFC 2817
  '500': 'Internal Server Error',
  '501': 'Not Implemented',
  '502': 'Bad Gateway',
  '503': 'Service Unavailable',
  '504': 'Gateway Time-out',
  '505': 'HTTP Version not supported',
  '506': 'Variant Also Negotiates',    // RFC 2295
  '507': 'Insufficient Storage',       // RFC 4918
  '509': 'Bandwidth Limit Exceeded',
  '510': 'Not Extended'                // RFC 2774
};
};

defs["src/lib/trace.js"] = function (module, exports) {
var messages = {
  request: "\u21A0",
  response: "\u219E",
  input: "\u2190",
  output: "\u2192",
  save: "\u2907",
  load: "\u2906",
  remove: "\u2716",
  read: "\u2770",
  write: "\u2771",
};

module.exports = function (type, stream, item) {
  var message = messages[type] || type;
  if (!stream) {
    console.log(message, item);
    return;
  }
  if (!message) return stream;
  return { read: traceRead, abort: stream.abort };
  function traceRead(callback) {
    stream.read(function (err, item) {
      if (err) return callback(err);
      console.log(message, item);
      callback(null, item);
    });
  }
};
};

defs["src/lib/defer.js"] = function (module, exports) {
var timeouts = [];
var messageName = "zero-timeout-message";

function handleMessage(event) {
  if (event.source == window && event.data == messageName) {
    event.stopPropagation();
    if (timeouts.length > 0) {
      var fn = timeouts.shift();
      fn();
    }
  }
}

window.addEventListener("message", handleMessage, true);

module.exports = function (fn) {
  timeouts.push(fn);
  window.postMessage(messageName, "*");
};
};

defs["src/app/backend.js"] = function (module, exports) {
module.exports = function (git) {
  var metas = [];
  var dirty;
  var onAdd, onRemove;

  return {
    settings: git.settings,
    add: function (meta, callback) {
      for (var i = 0, l = metas.length; i < l; ++i) {
        if (metas[i].name === meta.name) {
          return callback(new Error(meta.name + " name already taken."));
        }
      }
      addRepo(meta, function (err, repo) {
        if (err) return callback(err);
        saveMeta();
        return callback(null, repo);
      });
    },
    remove: function (repo, callback) {
      var meta;
      for (var i = 0, l = metas.length; i < l; ++i) {
        meta = metas[i];
        if (meta.name === repo.name) break;
      }
      if (i >= l) {
        return callback(new Error("Unknown repo name " + repo.name));
      }
      metas.splice(i, 1);
      saveMeta();
      repo.clear(function (err) {
        if (err) return callback(err);
        saveMeta();
        onRemove(meta, i);
        return callback(null, meta);
      });
    },
    init: function (add, remove, callback) {
      onAdd = add;
      onRemove = remove;
      var metas = git.settings.get("metas");
      if (!metas) return setImmediate(callback);
      var left = metas.length;
      if (!metas.length) return setImmediate(callback);
      var done = false;
      metas.forEach(function (meta) {
        addRepo(meta, check);
      });
      function check(err) {
        if (done) return;
        if (err) {
          done = true;
          return callback(err);
        }
        if (!--left) {
          done = true;
          return callback();
        }
      }
    }
  };

  function addRepo(meta, callback) {
    var db = git.db(meta.name);
    var repo = git.repo(db);
    repo.clear = db.clear;
    var index = metas.length;
    metas[index] = meta;
    repo.remote = git.remote(meta.url);
    repo.name = meta.name;
    repo.url = meta.url;
    repo.description = meta.description || meta.url;
    db.init(function (err) {
      if (err) return callback(err);
      onAdd(repo, index);
      return callback(null, repo);
    });
  }

  function saveMeta() {
    if (dirty) return;
    // Use dirty flag and setImmediate to coalesce many saves in a single tick.
    dirty = true;
    setImmediate(function () {
      dirty = false;
      git.settings.set("metas", metas);
    });
  }

};
};

defs["node_modules/js-git/js-git.js"] = function (module, exports) {
module.exports = newRepo;

function newRepo(db) {
  if (!db) throw new TypeError("A db interface instance is required");

  // Create a new repo object.
  var repo = {};

  // Auto trace the db if tracing is turned on.
  if (require('node_modules/js-git/lib/trace.js')) db = require('node_modules/js-git/lib/tracedb.js')(db);

  // Add the db interface (used by objects, refs, and packops mixins)
  repo.db = db;

  // Mix in object store interface
  require('node_modules/js-git/mixins/objects.js')(repo);

  // Mix in the references interface
  require('node_modules/js-git/mixins/refs.js')(repo);

  // Mix in the walker helpers
  require('node_modules/js-git/mixins/walkers.js')(repo);

  // Mix in packfile import and export ability
  require('node_modules/js-git/mixins/packops.js')(repo);

  // Mix in git network client ability
  require('node_modules/js-git/mixins/client.js')(repo);

  // Mix in git network client ability
  require('node_modules/js-git/mixins/server.js')(repo);

  return repo;
}
};

defs["node_modules/js-git/lib/trace.js"] = function (module, exports) {
module.exports = false;
};

defs["node_modules/js-git/lib/tracedb.js"] = function (module, exports) {
var trace = require('node_modules/js-git/lib/trace.js');

module.exports = function (db) {
  return {
    get: wrap1("get", db.get),
    set: wrap2("set", db.set),
    has: wrap1("has", db.has),
    del: wrap1("del", db.del),
    keys: wrap1("keys", db.keys),
    init: wrap0("init", db.init),
  };
};

function wrap0(type, fn) {
  return zero;
  function zero(callback) {
    if (!callback) return zero.bind(this);
    return fn.call(this, check);
    function check(err) {
      if (err) return callback(err);
      trace(type, null);
      return callback.apply(this, arguments);
    }
  }
}

function wrap1(type, fn) {
  return one;
  function one(arg, callback) {
    if (!callback) return one.bind(this, arg);
    return fn.call(this, arg, check);
    function check(err) {
      if (err) return callback(err);
      trace(type, null, arg);
      return callback.apply(this, arguments);
    }
  }
}

function wrap2(type, fn) {
  return two;
  function two(arg1, arg2, callback) {
    if (!callback) return two.bind(this, arg1. arg2);
    return fn.call(this, arg1, arg2, check);
    function check(err) {
      if (err) return callback(err);
      trace(type, null, arg1);
      return callback.apply(this, arguments);
    }
  }
}
};

defs["node_modules/js-git/mixins/objects.js"] = function (module, exports) {
var sha1 = require('node_modules/js-git/lib/sha1.js');
var frame = require('node_modules/js-git/lib/frame.js');
var deframe = require('node_modules/js-git/lib/deframe.js');
var encoders = require('node_modules/js-git/lib/encoders.js');
var decoders = require('node_modules/js-git/lib/decoders.js');
var parseAscii = require('node_modules/js-git/lib/parseascii.js');
var isHash = require('node_modules/js-git/lib/ishash.js');

// Add "objects" capabilities to a repo using db as storage.
module.exports = function (repo) {

  // Add Object store capability to the system
  repo.load = load;       // (hash-ish) -> object
  repo.save = save;       // (object) -> hash
  repo.loadRaw = loadRaw; // (hash) -> buffer
  repo.saveRaw = saveRaw; // (hash, buffer)
  repo.has = has;         // (hash) -> true or false
  repo.loadAs = loadAs;   // (type, hash-ish) -> value
  repo.saveAs = saveAs;   // (type, value) -> hash
  repo.remove = remove;   // (hash)

  // This is a fallback resolve in case there is no refs system installed.
  if (!repo.resolve) repo.resolve = function (hash, callback) {
    if (isHash(hash)) return callback(null, hash);
    return callback(new Error("This repo only supports direct hashes"));
  };

};

function load(hashish, callback) {
  if (!callback) return load.bind(this, hashish);
  var hash;
  var repo = this;
  var db = repo.db;
  return repo.resolve(hashish, onHash);

  function onHash(err, result) {
    if (result === undefined) return callback(err);
    hash = result;
    return db.get(hash, onBuffer);
  }

  function onBuffer(err, buffer) {
    if (buffer === undefined) return callback(err);
    var type, object;
    try {
      if (sha1(buffer) !== hash) {
        throw new Error("Hash checksum failed for " + hash);
      }
      var pair = deframe(buffer);
      type = pair[0];
      buffer = pair[1];
      object = {
        type: type,
        body: decoders[type](buffer)
      };
    } catch (err) {
      if (err) return callback(err);
    }
    return callback(null, object, hash);
  }
}

function loadRaw(hash, callback) {
  return this.db.get(hash, callback);
}

function saveRaw(hash, buffer, callback) {
  return this.db.set(hash, buffer, callback);
}

function has(hash, callback) {
  return this.db.has(hash, callback);
}

function save(object, callback) {
  if (!callback) return save.bind(this, object);
  var buffer, hash;
  var repo = this;
  var db = repo.db;
  try {
    buffer = encoders[object.type](object.body);
    buffer = frame(object.type, buffer);
    hash = sha1(buffer);
  }
  catch (err) {
    return callback(err);
  }
  return db.set(hash, buffer, onSave);

  function onSave(err) {
    if (err) return callback(err);
    return callback(null, hash);
  }
}

function remove(hash, callback) {
  if (!callback) return remove.bind(this, hash);
  if (!isHash(hash)) return callback(new Error("Invalid hash: " + hash));
  var repo = this;
  var db = repo.db;
  return db.del(hash, callback);
}

function loadAs(type, hashish, callback) {
  if (!callback) return loadAs.bind(this, type, hashish);
  return this.load(hashish, onObject);

  function onObject(err, object, hash) {
    if (object === undefined) return callback(err);
    if (type === "text") {
      type = "blob";
      object.body = parseAscii(object.body, 0, object.body.length);
    }
    if (object.type !== type) {
      return new Error("Expected " + type + ", but found " + object.type);
    }
    return callback(null, object.body, hash);
  }
}

function saveAs(type, body, callback) {
  if (!callback) return saveAs.bind(this, type, body);
  if (type === "text") type = "blob";
  return this.save({ type: type, body: body }, callback);
}
};

defs["node_modules/js-git/lib/sha1.js"] = function (module, exports) {
var Array32 = typeof Uint32Array === "function" ? Uint32Array : Array;

module.exports = function sha1(buffer) {
  if (buffer === undefined) return create();
  var shasum = create();
  shasum.update(buffer);
  return shasum.digest();
};

// A streaming interface for when nothing is passed in.
function create() {
  var h0 = 0x67452301;
  var h1 = 0xEFCDAB89;
  var h2 = 0x98BADCFE;
  var h3 = 0x10325476;
  var h4 = 0xC3D2E1F0;
  // The first 64 bytes (16 words) is the data chunk
  var block = new Array32(80), offset = 0, shift = 24;
  var totalLength = 0;

  return { update: update, digest: digest };

  // The user gave us more data.  Store it!
  function update(chunk) {
    if (typeof chunk === "string") return updateString(chunk);
    var length = chunk.length;
    totalLength += length * 8;
    for (var i = 0; i < length; i++) {
      write(chunk[i]);
    }
  }

  function updateString(string) {
    var length = string.length;
    totalLength += length * 8;
    for (var i = 0; i < length; i++) {
      write(string.charCodeAt(i));
    }
  }

  function write(byte) {
    block[offset] |= (byte & 0xff) << shift;
    if (shift) {
      shift -= 8;
    }
    else {
      offset++;
      shift = 24;
    }
    if (offset === 16) processBlock();
  }

  // No more data will come, pad the block, process and return the result.
  function digest() {
    // Pad
    write(0x80);
    if (offset > 14 || (offset === 14 && shift < 24)) {
      processBlock();
    }
    offset = 14;
    shift = 24;

    // 64-bit length big-endian
    write(0x00); // numbers this big aren't accurate in javascript anyway
    write(0x00); // ..So just hard-code to zero.
    write(totalLength > 0xffffffffff ? totalLength / 0x10000000000 : 0x00);
    write(totalLength > 0xffffffff ? totalLength / 0x100000000 : 0x00);
    for (var s = 24; s >= 0; s -= 8) {
      write(totalLength >> s);
    }

    // At this point one last processBlock() should trigger and we can pull out the result.
    return toHex(h0)
         + toHex(h1)
         + toHex(h2)
         + toHex(h3)
         + toHex(h4);
  }

  // We have a full block to process.  Let's do it!
  function processBlock() {
    // Extend the sixteen 32-bit words into eighty 32-bit words:
    for (var i = 16; i < 80; i++) {
      var w = block[i - 3] ^ block[i - 8] ^ block[i - 14] ^ block[i - 16];
      block[i] = (w << 1) | (w >>> 31);
    }

    // log(block);

    // Initialize hash value for this chunk:
    var a = h0;
    var b = h1;
    var c = h2;
    var d = h3;
    var e = h4;
    var f, k;

    // Main loop:
    for (i = 0; i < 80; i++) {
      if (i < 20) {
        f = d ^ (b & (c ^ d));
        k = 0x5A827999;
      }
      else if (i < 40) {
        f = b ^ c ^ d;
        k = 0x6ED9EBA1;
      }
      else if (i < 60) {
        f = (b & c) | (d & (b | c));
        k = 0x8F1BBCDC;
      }
      else {
        f = b ^ c ^ d;
        k = 0xCA62C1D6;
      }
      var temp = (a << 5 | a >>> 27) + f + e + k + (block[i]|0);
      e = d;
      d = c;
      c = (b << 30 | b >>> 2);
      b = a;
      a = temp;
    }

    // Add this chunk's hash to result so far:
    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0;

    // The block is now reusable.
    offset = 0;
    for (i = 0; i < 16; i++) {
      block[i] = 0;
    }
  }

  function toHex(word) {
    var hex = "";
    for (var i = 28; i >= 0; i -= 4) {
      hex += ((word >> i) & 0xf).toString(16);
    }
    return hex;
  }

}
};

defs["node_modules/js-git/lib/frame.js"] = function (module, exports) {
var bops =  require('node_modules/bops/index.js');

module.exports = function frame(type, body) {
  return bops.join([
    bops.from(type + " " + body.length + "\0"),
    body
  ]);
};
};

defs["node_modules/js-git/lib/deframe.js"] = function (module, exports) {
var bops = require('node_modules/bops/index.js');
var indexOf = require('node_modules/js-git/lib/indexof.js');
var parseDec = require('node_modules/js-git/lib/parsedec.js');
var parseAscii = require('node_modules/js-git/lib/parseascii.js');

module.exports = function deframe(buffer) {
  var space = indexOf(buffer, 0x20);
  if (space < 0) throw new Error("Invalid git object buffer");
  var nil = indexOf(buffer, 0x00, space);
  if (nil < 0) throw new Error("Invalid git object buffer");
  var body = bops.subarray(buffer, nil + 1);
  var size = parseDec(buffer, space + 1, nil);
  if (size !== body.length) throw new Error("Invalid body length.");
  return [
    parseAscii(buffer, 0, space),
    body
  ];
};
};

defs["node_modules/js-git/lib/indexof.js"] = function (module, exports) {
module.exports = function indexOf(buffer, byte, i) {
  i |= 0;
  var length = buffer.length;
  for (;;i++) {
    if (i >= length) return -1;
    if (buffer[i] === byte) return i;
  }
};
};

defs["node_modules/js-git/lib/parsedec.js"] = function (module, exports) {
module.exports = function parseDec(buffer, start, end) {
  var val = 0;
  while (start < end) {
    val = val * 10 + buffer[start++] - 0x30;
  }
  return val;
};
};

defs["node_modules/js-git/lib/parseascii.js"] = function (module, exports) {
module.exports = function parseAscii(buffer, start, end) {
  var val = "";
  while (start < end) {
    val += String.fromCharCode(buffer[start++]);
  }
  return val;
};
};

defs["node_modules/js-git/lib/encoders.js"] = function (module, exports) {
var bops = require('node_modules/bops/index.js');
var pathCmp = require('node_modules/js-git/lib/pathcmp.js');

exports.commit = function encodeCommit(commit) {
  if (!commit.tree || !commit.author || !commit.message) {
    throw new TypeError("Tree, author, and message are require for commits");
  }
  var parents = commit.parents || (commit.parent ? [ commit.parent ] : []);
  if (!Array.isArray(parents)) {
    throw new TypeError("Parents must be an array");
  }
  var str = "tree " + commit.tree;
  for (var i = 0, l = parents.length; i < l; ++i) {
    str += "\nparent " + parents[i];
  }
  str += "\nauthor " + encodePerson(commit.author) +
         "\ncommitter " + encodePerson(commit.committer || commit.author) +
         "\n\n" + commit.message;
  return bops.from(str);
};

exports.tag = function encodeTag(tag) {
  if (!tag.object || !tag.type || !tag.tag || !tag.tagger || !tag.message) {
    throw new TypeError("Object, type, tag, tagger, and message required");
  }
  var str = "object " + tag.object +
    "\ntype " + tag.type +
    "\ntag " + tag.tag +
    "\ntagger " + encodePerson(tag.tagger) +
    "\n\n" + tag.message;
  return bops.from(str + "\n" + tag.message);
};

exports.tree = function encodeTree(tree) {
  var chunks = [];
  if (!Array.isArray(tree)) {
    tree = Object.keys(tree).map(function (name) {
      var entry = tree[name];
      entry.name = name;
      return entry;
    });
  }
  tree.sort(pathCmp).forEach(onEntry);
  return bops.join(chunks);

  function onEntry(entry) {
    chunks.push(
      bops.from(entry.mode.toString(8) + " " + entry.name + "\0"),
      bops.from(entry.hash, "hex")
    );
  }
};

exports.blob = function encodeBlob(blob) {
  if (bops.is(blob)) return blob;
  return bops.from(blob);
};

function encodePerson(person) {
  if (!person.name || !person.email) {
    throw new TypeError("Name and email are required for person fields");
  }
  return safe(person.name) +
    " <" + safe(person.email) + "> " +
    formatDate(person.date || new Date());
}

function safe(string) {
  return string.replace(/(?:^[\.,:;<>"']+|[\0\n<>]+|[\.,:;<>"']+$)/gm, "");
}

function formatDate(date) {
  var timezone = (date.timeZoneoffset || date.getTimezoneOffset()) / 60;
  var seconds = Math.floor(date.getTime() / 1000);
  return seconds + " " + (timezone > 0 ? "-0" : "0") + timezone + "00";
}
};

defs["node_modules/js-git/lib/pathcmp.js"] = function (module, exports) {
module.exports = function pathCmp(oa, ob) {
  var a = oa.name;
  var b = ob.name;
  a += "/"; b += "/";
  return a < b ? -1 : a > b ? 1 : 0;
};
};

defs["node_modules/js-git/lib/decoders.js"] = function (module, exports) {
var indexOf = require('node_modules/js-git/lib/indexof.js');
var parseOct = require('node_modules/js-git/lib/parseoct.js');
var parseAscii = require('node_modules/js-git/lib/parseascii.js');
var parseToHex = require('node_modules/js-git/lib/parsetohex.js');

exports.commit = function decodeCommit(body) {
  var i = 0;
  var start;
  var key;
  var parents = [];
  var commit = {
    tree: "",
    parents: parents,
    author: "",
    committer: "",
    message: ""
  };
  while (body[i] !== 0x0a) {
    start = i;
    i = indexOf(body, 0x20, start);
    if (i < 0) throw new SyntaxError("Missing space");
    key = parseAscii(body, start, i++);
    start = i;
    i = indexOf(body, 0x0a, start);
    if (i < 0) throw new SyntaxError("Missing linefeed");
    var value = parseAscii(body, start, i++);
    if (key === "parent") {
      parents.push(value);
    }
    else {
      if (key === "author" || key === "committer") {
        value = decodePerson(value);
      }
      commit[key] = value;
    }
  }
  i++;
  commit.message = parseAscii(body, i, body.length);
  return commit;
};

exports.tag = function decodeTag(body) {
  var i = 0;
  var start;
  var key;
  var tag = {};
  while (body[i] !== 0x0a) {
    start = i;
    i = indexOf(body, 0x20, start);
    if (i < 0) throw new SyntaxError("Missing space");
    key = parseAscii(body, start, i++);
    start = i;
    i = indexOf(body, 0x0a, start);
    if (i < 0) throw new SyntaxError("Missing linefeed");
    var value = parseAscii(body, start, i++);
    if (key === "tagger") value = decodePerson(value);
    tag[key] = value;
  }
  i++;
  tag.message = parseAscii(body, i, body.length);
  return tag;
};

exports.tree = function decodeTree(body) {
  var i = 0;
  var length = body.length;
  var start;
  var mode;
  var name;
  var hash;
  var tree = {};
  while (i < length) {
    start = i;
    i = indexOf(body, 0x20, start);
    if (i < 0) throw new SyntaxError("Missing space");
    mode = parseOct(body, start, i++);
    start = i;
    i = indexOf(body, 0x00, start);
    name = parseAscii(body, start, i++);
    hash = parseToHex(body, i, i += 20);
    tree[name] = {
      mode: mode,
      hash: hash
    };
  }
  return tree;
};

exports.blob = function decodeBlob(body) {
  return body;
};

function decodePerson(string) {
  var match = string.match(/^([^<]*) <([^>]*)> ([^ ]*) (.*)$/);
  if (!match) throw new Error("Improperly formatted person string");
  var sec = parseInt(match[3], 10);
  var date = new Date(sec * 1000);
  date.timeZoneoffset = parseInt(match[4], 10) / 100 * -60;
  return {
    name: match[1],
    email: match[2],
    date: date
  };
}
};

defs["node_modules/js-git/lib/parseoct.js"] = function (module, exports) {
module.exports = function parseOct(buffer, start, end) {
  var val = 0;
  while (start < end) {
    val = (val << 3) + buffer[start++] - 0x30;
  }
  return val;
};
};

defs["node_modules/js-git/lib/parsetohex.js"] = function (module, exports) {
var chars = "0123456789abcdef";

module.exports = function parseToHex(buffer, start, end) {
  var val = "";
  while (start < end) {
    var byte = buffer[start++];
    val += chars[byte >> 4] + chars[byte & 0xf];
  }
  return val;
};
};

defs["node_modules/js-git/lib/ishash.js"] = function (module, exports) {
module.exports = function isHash(hash) {
  return (/^[0-9a-f]{40}$/).test(hash);
};
};

defs["node_modules/js-git/mixins/refs.js"] = function (module, exports) {
var isHash = require('node_modules/js-git/lib/ishash.js');

module.exports = function (repo) {
  // Refs
  repo.resolve = resolve;       // (hash-ish) -> hash
  repo.updateHead = updateHead; // (hash)
  repo.getHead = getHead;       // () -> ref
  repo.setHead = setHead;       // (ref)
  repo.readRef = readRef;       // (ref) -> hash
  repo.createRef = createRef;   // (ref, hash)
  repo.updateRef = updateRef;   // (ref, hash)
  repo.deleteRef = deleteRef;   // (ref)
  repo.listRefs = listRefs;     // (prefix) -> refs
};

function resolve(hashish, callback) {
  if (!callback) return resolve.bind(this, hashish);
  hashish = hashish.trim();
  var repo = this, db = repo.db;
  if (isHash(hashish)) return callback(null, hashish);
  if (hashish === "HEAD") return repo.getHead(onBranch);
  if ((/^refs\//).test(hashish)) {
    return db.get(hashish, checkBranch);
  }
  return checkBranch();

  function onBranch(err, ref) {
    if (err) return callback(err);
    if (!ref) return callback();
    return repo.resolve(ref, callback);
  }

  function checkBranch(err, hash) {
    if (err && err.code !== "ENOENT") return callback(err);
    if (hash) {
      return repo.resolve(hash, callback);
    }
    return db.get("refs/heads/" + hashish, checkTag);
  }

  function checkTag(err, hash) {
    if (err && err.code !== "ENOENT") return callback(err);
    if (hash) {
      return repo.resolve(hash, callback);
    }
    return db.get("refs/tags/" + hashish, final);
  }

  function final(err, hash) {
    if (err) return callback(err);
    if (hash) {
      return repo.resolve(hash, callback);
    }
    err = new Error("ENOENT: Cannot find " + hashish);
    err.code = "ENOENT";
    return callback(err);
  }
}

function updateHead(hash, callback) {
  if (!callback) return updateHead.bind(this, hash);
  var ref;
  var repo = this, db = repo.db;
  return this.getHead(onBranch);

  function onBranch(err, result) {
    if (err) return callback(err);
    if (result === undefined) {
      return repo.setHead("master", function (err) {
        if (err) return callback(err);
        onBranch(err, "refs/heads/master");
      });
    }
    ref = result;
    return db.set(ref, hash + "\n", callback);
  }
}

function getHead(callback) {
  if (!callback) return getHead.bind(this);
  var repo = this, db = repo.db;
  return db.get("HEAD", onRead);

  function onRead(err, ref) {
    if (err) return callback(err);
    if (!ref) return callback();
    var match = ref.match(/^ref: *(.*)/);
    if (!match) return callback(new Error("Invalid HEAD"));
    return callback(null, match[1]);
  }
}

function setHead(branchName, callback) {
  if (!callback) return setHead.bind(this, branchName);
  var ref = "refs/heads/" + branchName;
  return this.db.set("HEAD", "ref: " + ref + "\n", callback);
}

function readRef(ref, callback) {
  if (!callback) return readRef.bind(this, ref);
  return this.db.get(ref, function (err, result) {
    if (err) return callback(err);
    if (!result) return callback();
    return callback(null, result.trim());
  });
}

function createRef(ref, hash, callback) {
  if (!callback) return createRef.bind(this, ref, hash);
  // TODO: should we check to make sure it doesn't exist first?
  return this.db.set(ref, hash + "\n", callback);
}

function updateRef(ref, hash, callback) {
  if (!callback) return updateRef.bind(this, ref, hash);
  // TODO: should we check to make sure it does exist first?
  return this.db.set(ref, hash + "\n", callback);
}

function deleteRef(ref, callback) {
  if (!callback) return deleteRef.bind(this, ref);
  return this.db.del(ref, callback);
}

function listRefs(prefix, callback) {
  if (!callback) return listRefs.bind(this, prefix);
  if (!prefix) prefix = "refs\/";
  else if (!/^refs\//.test(prefix)) {
    return callback(new TypeError("Invalid prefix: " + prefix));
  }
  var db = this.db;
  var refs = {};
  return db.keys(prefix, onKeys);

  function onKeys(err, keys) {
    if (err) return callback(err);
    var left = keys.length, done = false;
    if (!left) return callback(null, refs);
    keys.forEach(function (key) {
      db.get(key, function (err, value) {
        if (done) return;
        if (err) {
          done = true;
          return callback(err);
        }
        refs[key] = value.trim();
        if (--left) return;
        done = true;
        callback(null, refs);
      });
    });
  }
}
};

defs["node_modules/js-git/mixins/walkers.js"] = function (module, exports) {
var walk = require('node_modules/js-git/lib/walk.js');
var assertType = require('node_modules/js-git/lib/assert-type.js');

module.exports = function (repo) {
  repo.logWalk = logWalk;   // (hash-ish) => stream<commit>
  repo.treeWalk = treeWalk; // (hash-ish) => stream<object>
};

function logWalk(hashish, callback) {
  if (!callback) return logWalk.bind(this, hashish);
  var last, seen = {};
  var repo = this;
  return repo.readRef("shallow", onShallow);

  function onShallow(err, shallow) {
    last = shallow;
    return repo.loadAs("commit", hashish, onLoad);
  }

  function onLoad(err, commit, hash) {
    if (commit === undefined) return callback(err);
    commit.hash = hash;
    seen[hash] = true;
    return callback(null, walk(commit, scan, loadKey, compare));
  }

  function scan(commit) {
    if (last === commit) return [];
    return commit.parents.filter(function (hash) {
      return !seen[hash];
    });
  }

  function loadKey(hash, callback) {
    return repo.loadAs("commit", hash, function (err, commit) {
      if (err) return callback(err);
      commit.hash = hash;
      if (hash === last) commit.last = true;
      return callback(null, commit);
    });
  }

}

function compare(commit, other) {
  return commit.author.date < other.author.date;
}

function treeWalk(hashish, callback) {
  if (!callback) return treeWalk.bind(this, hashish);
  var repo = this;
  return repo.load(hashish, onLoad);
  function onLoad(err, item, hash) {
    if (err) return callback(err);
    if (item.type === "commit") return repo.load(item.body.tree, onLoad);
    item.hash = hash;
    item.path = "/";
    return callback(null, walk(item, treeScan, treeLoadKey, treeCompare));
  }

  function treeLoadKey(entry, callback) {
    return repo.load(entry.hash, function (err, object) {
      if (err) return callback(err);
      entry.type = object.type;
      entry.body = object.body;
      return callback(null, entry);
    });
  }

}

function treeScan(object) {
  if (object.type === "blob") return [];
  assertType(object, "tree");
  return object.body.filter(function (entry) {
    return entry.mode !== 0160000;
  }).map(function (entry) {
    var path = object.path + entry.name;
    if (entry.mode === 040000) path += "/";
    entry.path = path;
    return entry;
  });
}

function treeCompare(first, second) {
  return first.path < second.path;
}
};

defs["node_modules/js-git/lib/walk.js"] = function (module, exports) {
module.exports = function walk(seed, scan, loadKey, compare) {
  var queue = [seed];
  var working = 0, error, cb;
  return {read: read, abort: abort};

  function read(callback) {
    if (cb) return callback(new Error("Only one read at a time"));
    if (working) { cb = callback; return; }
    var item = queue.shift();
    if (!item) return callback();
    try { scan(item).forEach(onKey); }
    catch (err) { return callback(err); }
    return callback(null, item);
  }

  function abort(callback) { return callback(); }

  function onError(err) {
    if (cb) {
      var callback = cb; cb = null;
      return callback(err);
    }
    error = err;
  }

  function onKey(key) {
    working++;
    loadKey(key, onItem);
  }

  function onItem(err, item) {
    working--;
    if (err) return onError(err);
    var index = queue.length;
    while (index && compare(item, queue[index - 1])) index--;
    queue.splice(index, 0, item);
    if (!working && cb) {
      var callback = cb; cb = null;
      return read(callback);
    }
  }
};
};

defs["node_modules/js-git/lib/assert-type.js"] = function (module, exports) {
module.exports = function assertType(object, type) {
  if (object.type !== type) {
    throw new Error(type + " expected, but found " + object.type);
  }
};
};

defs["node_modules/js-git/mixins/packops.js"] = function (module, exports) {
var bops = require('node_modules/bops/index.js');
var deframe = require('node_modules/js-git/lib/deframe.js');
var frame = require('node_modules/js-git/lib/frame.js');
var sha1 = require('node_modules/js-git/lib/sha1.js');
var applyDelta = require('node_modules/js-git/lib/apply-delta.js');
var pushToPull = require('node_modules/push-to-pull/transform.js');
var decodePack = require('node_modules/js-git/lib/pack-codec.js').decodePack;
var packFrame = require('node_modules/js-git/lib/pack-codec.js').packFrame;

module.exports = function (repo) {
  // packStream is a simple-stream containing raw packfile binary data
  // opts can contain "onProgress" or "onError" hook functions.
  // callback will be called with a list of all unpacked hashes on success.
  repo.unpack = unpack; // (packStream, opts) -> hashes

  // hashes is an array of hashes to pack
  // callback will be a simple-stream containing raw packfile binary data
  repo.pack = pack;     // (hashes, opts) -> packStream
};

function unpack(packStream, opts, callback) {
  if (!callback) return unpack.bind(this, packStream, opts);

  packStream = pushToPull(decodePack)(packStream);

  var repo = this;

  var version, num, numDeltas = 0, count = 0, countDeltas = 0;
  var done, startDeltaProgress = false;

  // hashes keyed by offset for ofs-delta resolving
  var hashes = {};
  // key is hash, boolean is cached "has" value of true or false
  var has = {};
  // key is hash we're waiting for, value is array of items that are waiting.
  var pending = {};

  return packStream.read(onStats);

  function onDone(err) {
    if (done) return;
    done = true;
    if (err) return callback(err);
    return callback(null, values(hashes));
  }

  function onStats(err, stats) {
    if (err) return onDone(err);
    version = stats.version;
    num = stats.num;
    packStream.read(onRead);
  }

  function objectProgress(more) {
    if (!more) startDeltaProgress = true;
    var percent = Math.round(count / num * 100);
    return opts.onProgress("Receiving objects: " + percent + "% (" + (count++) + "/" + num + ")   " + (more ? "\r" : "\n"));
  }

  function deltaProgress(more) {
    if (!startDeltaProgress) return;
    var percent = Math.round(countDeltas / numDeltas * 100);
    return opts.onProgress("Applying deltas: " + percent + "% (" + (countDeltas++) + "/" + numDeltas + ")   " + (more ? "\r" : "\n"));
  }

  function onRead(err, item) {
    if (err) return onDone(err);
    if (opts.onProgress) objectProgress(item);
    if (item === undefined) return onDone();
    if (item.size !== item.body.length) {
      return onDone(new Error("Body size mismatch"));
    }
    if (item.type === "ofs-delta") {
      numDeltas++;
      item.ref = hashes[item.offset - item.ref];
      return resolveDelta(item);
    }
    if (item.type === "ref-delta") {
      numDeltas++;
      return checkDelta(item);
    }
    return saveValue(item);
  }

  function resolveDelta(item) {
    if (opts.onProgress) deltaProgress();
    return repo.loadRaw(item.ref, function (err, buffer) {
      if (err) return onDone(err);
      if (!buffer) return onDone(new Error("Missing base image at " + item.ref));
      var target = deframe(buffer);
      item.type = target[0];
      item.body = applyDelta(item.body, target[1]);
      return saveValue(item);
    });
  }

  function checkDelta(item) {
    var hasTarget = has[item.ref];
    if (hasTarget === true) return resolveDelta(item);
    if (hasTarget === false) return enqueueDelta(item);
    return repo.has(item.ref, function (err, value) {
      if (err) return onDone(err);
      has[item.ref] = value;
      if (value) return resolveDelta(item);
      return enqueueDelta(item);
    });
  }

  function saveValue(item) {
    var buffer = frame(item.type, item.body);
    var hash = sha1(buffer);
    hashes[item.offset] = hash;
    has[hash] = true;
    if (hash in pending) {
      // I have yet to come across a pack stream that actually needs this.
      // So I will only implement it when I have concrete data to test against.
      console.error({
        list: pending[hash],
        item: item
      });
      throw "TODO: pending value was found, resolve it";
    }
    return repo.saveRaw(hash, buffer, onSave);
  }

  function onSave(err) {
    if (err) return callback(err);
    packStream.read(onRead);
  }

  function enqueueDelta(item) {
    var list = pending[item.ref];
    if (!list) pending[item.ref] = [item];
    else list.push(item);
    packStream.read(onRead);
  }

}

// TODO: Implement delta refs to reduce stream size
function pack(hashes, opts, callback) {
  if (!callback) return pack.bind(this, hashes, opts);
  var repo = this;
  var sha1sum = sha1();
  var i = 0, first = true, done = false;
  return callback(null, { read: read, abort: callback });

  function read(callback) {
    if (done) return callback();
    if (first) return readFirst(callback);
    var hash = hashes[i++];
    if (hash === undefined) {
      var sum = sha1sum.digest();
      done = true;
      return callback(null, bops.from(sum, "hex"));
    }
    repo.loadRaw(hash, function (err, buffer) {
      if (err) return callback(err);
      if (!buffer) return callback(new Error("Missing hash: " + hash));
      // Reframe with pack format header
      var pair = deframe(buffer);
      packFrame(pair[0], pair[1], function (err, buffer) {
        if (err) return callback(err);
        sha1sum.update(buffer);
        callback(null, buffer);
      });
    });
  }

  function readFirst(callback) {
    var length = hashes.length;
    var chunk = bops.create([
      0x50, 0x41, 0x43, 0x4b, // PACK
      0, 0, 0, 2,             // version 2
      length >> 24,           // Num of objects
      (length >> 16) & 0xff,
      (length >> 8) & 0xff,
      length & 0xff
    ]);
    first = false;
    sha1sum.update(chunk);
    callback(null, chunk);
  }
}

function values(object) {
  var keys = Object.keys(object);
  var length = keys.length;
  var out = new Array(length);
  for (var i = 0; i < length; i++) {
    out[i] = object[keys[i]];
  }
  return out;
}
};

defs["node_modules/js-git/lib/apply-delta.js"] = function (module, exports) {
// This is Chris Dickinson's code

var binary = require('node_modules/bops/index.js')
  , Decoder = require('node_modules/varint/decode.js')
  , vi = new Decoder

// we use writeUint[8|32][LE|BE] instead of indexing
// into buffers so that we get buffer-browserify compat.
var OFFSET_BUFFER = binary.create(4)
  , LENGTH_BUFFER = binary.create(4)

module.exports = apply_delta;
function apply_delta(delta, target) {
  var base_size_info = {size: null, buffer: null}
    , resized_size_info = {size: null, buffer: null}
    , output_buffer
    , out_idx
    , command
    , len
    , idx

  delta_header(delta, base_size_info)
  delta_header(base_size_info.buffer, resized_size_info)

  delta = resized_size_info.buffer

  idx =
  out_idx = 0
  output_buffer = binary.create(resized_size_info.size)

  len = delta.length

  while(idx < len) {
    command = delta[idx++]
    command & 0x80 ? copy() : insert()
  }

  return output_buffer

  function copy() {
    binary.writeUInt32LE(OFFSET_BUFFER, 0, 0)
    binary.writeUInt32LE(LENGTH_BUFFER, 0, 0)

    var check = 1
      , length
      , offset

    for(var x = 0; x < 4; ++x) {
      if(command & check) {
        OFFSET_BUFFER[3 - x] = delta[idx++]
      }
      check <<= 1
    }

    for(var x = 0; x < 3; ++x) {
      if(command & check) {
        LENGTH_BUFFER[3 - x] = delta[idx++]
      }
      check <<= 1
    }
    LENGTH_BUFFER[0] = 0

    length = binary.readUInt32BE(LENGTH_BUFFER, 0) || 0x10000
    offset = binary.readUInt32BE(OFFSET_BUFFER, 0)

    binary.copy(target, output_buffer, out_idx, offset, offset + length)
    out_idx += length
  }

  function insert() {
    binary.copy(delta, output_buffer, out_idx, idx, command + idx)
    idx += command
    out_idx += command
  }
}

function delta_header(buf, output) {
  var done = false
    , idx = 0
    , size = 0

  vi.ondata = function(s) {
    size = s
    done = true
  }

  do {
    vi.write(buf[idx++])
  } while(!done)

  output.size = size
  output.buffer = binary.subarray(buf, idx)

}
};

defs["node_modules/varint/decode.js"] = function (module, exports) {
module.exports = Decoder

var MSB = 0x80
  , REST = 0x7F


function Decoder() {
  this.accum = []
}
Decoder.prototype.write = write;

function write(byte) {
  var msb = byte & MSB
    , accum = this.accum
    , len
    , out

  accum[accum.length] = byte & REST
  if(msb) {
    return
  }

  len = accum.length
  out = 0

  for(var i = 0; i < len; ++i) {
    out |= accum[i] << (7 * i)
  }

  accum.length = 0
  this.ondata(out)
  return
}
};

defs["node_modules/js-git/lib/pack-codec.js"] = function (module, exports) {
var inflate = require('node_modules/js-git/lib/inflate.js');
var deflate = require('node_modules/js-git/lib/deflate.js');
var sha1 = require('node_modules/js-git/lib/sha1.js');
var bops = {
  subarray: require('node_modules/bops/typedarray/subarray.js'),
  join: require('node_modules/bops/typedarray/join.js'),
  from: require('node_modules/bops/typedarray/from.js'),
};

var typeToNum = {
  commit: 1,
  tree: 2,
  blob: 3,
  tag: 4,
  "ofs-delta": 6,
  "ref-delta": 7
};
var numToType = {};
for (var type in typeToNum) {
  var num = typeToNum[type];
  numToType[num] = type;
}

exports.packFrame = packFrame;
function packFrame(type, body, callback) {
  var length = body.length;
  var head = [(typeToNum[type] << 4) | (length & 0xf)];
  var i = 0;
  length >>= 4;
  while (length) {
    head[i++] |= 0x80;
    head[i] = length & 0x7f;
    length >>= 7;
  }
  deflate(body, function (err, body) {
    if (err) return callback(err);
    callback(null, bops.join([bops.from(head), body]));
  });
}

exports.decodePack = decodePack;
function decodePack(emit) {

  var state = $pack;
  var sha1sum = sha1();
  var inf = inflate();

  var offset = 0;
  var position = 0;
  var version = 0x4b434150; // PACK reversed
  var num = 0;
  var type = 0;
  var length = 0;
  var ref = null;
  var checksum = "";
  var start = 0;
  var parts = [];


  return function (chunk) {
    if (chunk === undefined) {
      if (num || checksum.length < 40) throw new Error("Unexpected end of input stream");
      return emit();
    }

    for (var i = 0, l = chunk.length; i < l; i++) {
      // console.log([state, i, chunk[i].toString(16)]);
      if (!state) throw new Error("Unexpected extra bytes: " + bops.subarray(chunk, i));
      state = state(chunk[i], i, chunk);
      position++;
    }
    if (!state) return;
    if (state !== $checksum) sha1sum.update(chunk);
    var buff = inf.flush();
    if (buff.length) {
      parts.push(buff);
    }
  };

  // The first four bytes in a packfile are the bytes 'PACK'
  function $pack(byte) {
    if ((version & 0xff) === byte) {
      version >>>= 8;
      return version ? $pack : $version;
    }
    throw new Error("Invalid packfile header");
  }

  // The version is stored as an unsigned 32 integer in network byte order.
  // It must be version 2 or 3.
  function $version(byte) {
    version = (version << 8) | byte;
    if (++offset < 4) return $version;
    if (version >= 2 && version <= 3) {
      offset = 0;
      return $num;
    }
    throw new Error("Invalid version number " + num);
  }

  // The number of objects in this packfile is also stored as an unsigned 32 bit int.
  function $num(byte) {
    num = (num << 8) | byte;
    if (++offset < 4) return $num;
    offset = 0;
    emit({version: version, num: num});
    return $header;
  }

  // n-byte type and length (3-bit type, (n-1)*7+4-bit length)
  // CTTTSSSS
  // C is continue bit, TTT is type, S+ is length
  function $header(byte) {
    if (start === 0) start = position;
    type = byte >> 4 & 0x07;
    length = byte & 0x0f;
    if (byte & 0x80) {
      offset = 4;
      return $header2;
    }
    return afterHeader();
  }

  // Second state in the same header parsing.
  // CSSSSSSS*
  function $header2(byte) {
    length |= (byte & 0x7f) << offset;
    if (byte & 0x80) {
      offset += 7;
      return $header2;
    }
    return afterHeader();
  }

  // Common helper for finishing tiny and normal headers.
  function afterHeader() {
    offset = 0;
    if (type === 6) {
      ref = 0;
      return $ofsDelta;
    }
    if (type === 7) {
      ref = "";
      return $refDelta;
    }
    return $body;
  }

  // Big-endian modified base 128 number encoded ref offset
  function $ofsDelta(byte) {
    ref = byte & 0x7f;
    if (byte & 0x80) return $ofsDelta2;
    return $body;
  }

  function $ofsDelta2(byte) {
    ref = ((ref + 1) << 7) | (byte & 0x7f);
    if (byte & 0x80) return $ofsDelta2;
    return $body;
  }

  // 20 byte raw sha1 hash for ref
  function $refDelta(byte) {
    ref += toHex(byte);
    if (++offset < 20) return $refDelta;
    return $body;
  }

  // Common helper for generating 2-character hex numbers
  function toHex(num) {
    return num < 0x10 ? "0" + num.toString(16) : num.toString(16);
  }

  // Common helper for emitting all three object shapes
  function emitObject() {
    var item = {
      type: numToType[type],
      size: length,
      body: bops.join(parts),
      offset: start
    };
    if (ref) item.ref = ref;
    parts.length = 0;
    start = 0;
    offset = 0;
    type = 0;
    length = 0;
    ref = null;
    emit(item);
  }

  // Feed the deflated code to the inflate engine
  function $body(byte, i, chunk) {
    if (inf.write(byte)) return $body;
    var buf = inf.flush();
    if (buf.length !== length) throw new Error("Length mismatch, expected " + length + " got " + buf.length);
    inf.recycle();
    if (buf.length) {
      parts.push(buf);
    }
    emitObject();
    // If this was all the objects, start calculating the sha1sum
    if (--num) return $header;
    sha1sum.update(bops.subarray(chunk, 0, i + 1));
    return $checksum;
  }

  // 20 byte checksum
  function $checksum(byte) {
    checksum += toHex(byte);
    if (++offset < 20) return $checksum;
    var actual = sha1sum.digest();
    if (checksum !== actual) throw new Error("Checksum mismatch: " + actual + " != " + checksum);
  }

}
};

defs["node_modules/js-git/lib/inflate.js"] = function (module, exports) {
var bops = require('node_modules/bops/index.js');

// Wrapper for proposed new API to inflate:
//
//   var inf = inflate();
//   inf.write(byte) -> more - Write a byte to inflate's state-machine.
//                             Returns true if more data is expected.
//   inf.recycle()           - Reset the internal state machine.
//   inf.flush() -> data     - Flush the output as a binary buffer.
//
// This is quite slow, but could be made fast if baked into inflate itself.
module.exports = function () {
  var push = inflate(onEmit, onUnused);
  var more = true;
  var chunks = [];
  var b = bops.create(1);

  return { write: write, recycle: recycle, flush: flush };

  function write(byte) {
    b[0] = byte;
    push(null, b);
    return more;
  }

  function recycle() {
    push.recycle();
    more = true;
  }

  function flush() {
    var buffer = bops.join(chunks);
    chunks.length = 0;
    return buffer;
  }

  function onEmit(err, item) {
    if (err) throw err;
    if (item === undefined) {
      // console.log("onEnd");
      more = false;
      return;
    }
    chunks.push(item);
  }

  function onUnused(chunks) {
    // console.log("onUnused", chunks);
    more = false;
  }
};

var MAXBITS = 15
  , MAXLCODES = 286
  , MAXDCODES = 30
  , MAXCODES = (MAXLCODES+MAXDCODES)
  , FIXLCODES = 288

var lens = [
  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
  35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258
]

var lext = [
  0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,
  3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0
]

var dists = [
  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
  257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
  8193, 12289, 16385, 24577
]

var dext = [
  0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6,
  7, 7, 8, 8, 9, 9, 10, 10, 11, 11,
  12, 12, 13, 13
]

var order = [
  16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15
]

var WINDOW = 32768
  , WINDOW_MINUS_ONE = WINDOW - 1

function inflate(emit, on_unused) {
  var output = new Uint8Array(WINDOW)
    , need_input = false
    , buffer_offset = 0
    , bytes_read = 0
    , output_idx = 0
    , ended = false
    , state = null
    , states = []
    , buffer = []
    , got = 0

  // buffer up to 128k "output one" bytes
  var OUTPUT_ONE_LENGTH = 131070
    , output_one_offs = OUTPUT_ONE_LENGTH
    , output_one_buf

  var bitbuf = 0
    , bitcnt = 0
    , is_final = false
    , fixed_codes

  var adler_s1 = 1
    , adler_s2 = 0

  onread.recycle = function recycle() {
    var out
    buffer.length = 0
    buffer_offset = 0
    output_idx = 0
    bitbuf = 0
    bitcnt = 0
    states.length = 0
    is_final = false
    need_input = false
    bytes_read = 0
    output_idx = 0
    ended = false
    got = 0
    adler_s1 = 1
    adler_s2 = 0
    output_one_offs = 0
    become(noop, {}, noop)
    start_stream_header()
    // return stream
  }

  var bytes_need = 0
    , bytes_value = []

  var bits_need = 0
    , bits_value = []

  var codes_distcode = null
    , codes_lencode = null
    , codes_len = 0
    , codes_dist = 0
    , codes_symbol = 0

  var dynamic_distcode = {symbol: [], count: []}
    , dynamic_lencode = {symbol: [], count: []}
    , dynamic_lengths = []
    , dynamic_nlen = 0
    , dynamic_ndist = 0
    , dynamic_ncode = 0
    , dynamic_index = 0
    , dynamic_symbol = 0
    , dynamic_len = 0

  var decode_huffman = null
    , decode_len = 0
    , decode_code = 0
    , decode_first = 0
    , decode_count = 0
    , decode_index = 0

  var last = null

  become(noop, {}, noop)
  start_stream_header()

  return onread

  function onread(err, buf) {
    if(buf === undefined) {
      return emit(err)
    }

    return write(buf)
  }

  function noop() {

  }

  function call_header() {
  }

  function call_bytes(need) {
    bytes_value.length = 0
    bytes_need = need
  }

  function call_bits(need) {
    bits_value = 0
    bits_need = need
  }

  function call_codes(distcode, lencode) {
    codes_len =
    codes_dist =
    codes_symbol = 0
    codes_distcode = distcode
    codes_lencode = lencode
  }

  function call_dynamic() {
    dynamic_distcode.symbol.length =
    dynamic_distcode.count.length =
    dynamic_lencode.symbol.length =
    dynamic_lencode.count.length =
    dynamic_lengths.length = 0
    dynamic_nlen = 0
    dynamic_ndist = 0
    dynamic_ncode = 0
    dynamic_index = 0
    dynamic_symbol = 0
    dynamic_len = 0
  }

  function call_decode(h) {
    decode_huffman = h
    decode_len = 1
    decode_first =
    decode_index =
    decode_code = 0
  }

  function write(buf) {
    buffer.push(buf)
    got += buf.length
    if(!ended) {
      execute()
    }
  }

  function execute() {
    do {
      states[0].current()
    } while(!need_input && !ended)

    var needed = need_input
    need_input = false
  }

  function start_stream_header() {
    become(bytes, call_bytes(2), got_stream_header)
  }

  function got_stream_header() {
    var cmf = last[0]
      , flg = last[1]


    if((cmf << 8 | flg) % 31 !== 0) {
      emit(new Error(
        'failed header check'
      ))
      return
    }




    if(flg & 32) {
      return become(bytes, call_bytes(4), on_got_fdict)
    }
    return become(bits, call_bits(1), on_got_is_final)
  }




  function on_got_fdict() {
    return become(bits, call_bits(1), on_got_is_final)
  }








  function on_got_is_final() {
    is_final = last
    become(bits, call_bits(2), on_got_type)
  }












  function on_got_type() {
    if(last === 0) {
      become(bytes, call_bytes(4), on_got_len_nlen)
      return
    }

    if(last === 1) {
      // `fixed` and `dynamic` blocks both eventually delegate
      // to the "codes" state -- which reads bits of input, throws
      // them into a huffman tree, and produces "symbols" of output.
      fixed_codes = fixed_codes || build_fixed()
      become(start_codes, call_codes(
        fixed_codes.distcode
      , fixed_codes.lencode
      ), done_with_codes)
      return
    }

    become(start_dynamic, call_dynamic(), done_with_codes)
    return
  }




  function on_got_len_nlen() {
    var want = last[0] | (last[1] << 8)
      , nlen = last[2] | (last[3] << 8)

    if((~nlen & 0xFFFF) !== want) {
      emit(new Error(
        'failed len / nlen check'
      ))
    }

    if(!want) {
      become(bits, call_bits(1), on_got_is_final)
      return
    }
    become(bytes, call_bytes(want), on_got_stored)
  }




  function on_got_stored() {
    output_many(last)
    if(is_final) {
      become(bytes, call_bytes(4), on_got_adler)
      return
    }
    become(bits, call_bits(1), on_got_is_final)
  }






  function start_dynamic() {
    become(bits, call_bits(5), on_got_nlen)
  }

  function on_got_nlen() {
    dynamic_nlen = last + 257
    become(bits, call_bits(5), on_got_ndist)
  }

  function on_got_ndist() {
    dynamic_ndist = last + 1
    become(bits, call_bits(4), on_got_ncode)
  }

  function on_got_ncode() {
    dynamic_ncode = last + 4
    if(dynamic_nlen > MAXLCODES || dynamic_ndist > MAXDCODES) {
      emit(new Error('bad counts'))
      return
    }

    become(bits, call_bits(3), on_got_lengths_part)
  }

  function on_got_lengths_part() {
    dynamic_lengths[order[dynamic_index]] = last

    ++dynamic_index
    if(dynamic_index === dynamic_ncode) {
      for(; dynamic_index < 19; ++dynamic_index) {
        dynamic_lengths[order[dynamic_index]] = 0
      }

      // temporarily construct the `lencode` using the
      // lengths we've read. we'll actually be using the
      // symbols produced by throwing bits into the huffman
      // tree to constuct the `lencode` and `distcode` huffman
      // trees.
      construct(dynamic_lencode, dynamic_lengths, 19)
      dynamic_index = 0

      become(decode, call_decode(dynamic_lencode), on_got_dynamic_symbol_iter)
      return
    }
    become(bits, call_bits(3), on_got_lengths_part)
  }

  function on_got_dynamic_symbol_iter() {
    dynamic_symbol = last

    if(dynamic_symbol < 16) {
      dynamic_lengths[dynamic_index++] = dynamic_symbol
      do_check()
      return
    }

    dynamic_len = 0
    if(dynamic_symbol === 16) {
      become(bits, call_bits(2), on_got_dynamic_symbol_16)
      return
    }

    if(dynamic_symbol === 17) {
      become(bits, call_bits(3), on_got_dynamic_symbol_17)
      return
    }

    become(bits, call_bits(7), on_got_dynamic_symbol)
  }

  function on_got_dynamic_symbol_16() {
    dynamic_len = dynamic_lengths[dynamic_index - 1]
    on_got_dynamic_symbol_17()
  }

  function on_got_dynamic_symbol_17() {
    dynamic_symbol = 3 + last
    do_dynamic_end_loop()
  }

  function on_got_dynamic_symbol() {
    dynamic_symbol = 11 + last
    do_dynamic_end_loop()
  }

  function do_dynamic_end_loop() {
    if(dynamic_index + dynamic_symbol > dynamic_nlen + dynamic_ndist) {
      emit(new Error('too many lengths'))
      return
    }

    while(dynamic_symbol--) {
      dynamic_lengths[dynamic_index++] = dynamic_len
    }

    do_check()
  }

  function do_check() {
    if(dynamic_index >= dynamic_nlen + dynamic_ndist) {
      end_read_dynamic()
      return
    }
    become(decode, call_decode(dynamic_lencode), on_got_dynamic_symbol_iter)
  }

  function end_read_dynamic() {
    // okay, we can finally start reading data out of the stream.
    construct(dynamic_lencode, dynamic_lengths, dynamic_nlen)
    construct(dynamic_distcode, dynamic_lengths.slice(dynamic_nlen), dynamic_ndist)
    become(start_codes, call_codes(
        dynamic_distcode
      , dynamic_lencode
    ), done_with_codes)
  }

  function start_codes() {
    become(decode, call_decode(codes_lencode), on_got_codes_symbol)
  }

  function on_got_codes_symbol() {
    var symbol = codes_symbol = last
    if(symbol < 0) {
      emit(new Error('invalid symbol'))
      return
    }

    if(symbol < 256) {
      output_one(symbol)
      become(decode, call_decode(codes_lencode), on_got_codes_symbol)
      return
    }

    if(symbol > 256) {
      symbol = codes_symbol -= 257
      if(symbol >= 29) {
        emit(new Error('invalid fixed code'))
        return
      }

      become(bits, call_bits(lext[symbol]), on_got_codes_len)
      return
    }

    if(symbol === 256) {
      unbecome()
      return
    }
  }






  function on_got_codes_len() {
    codes_len = lens[codes_symbol] + last
    become(decode, call_decode(codes_distcode), on_got_codes_dist_symbol)
  }


  function on_got_codes_dist_symbol() {
    codes_symbol = last
    if(codes_symbol < 0) {
      emit(new Error('invalid distance symbol'))
      return
    }

    become(bits, call_bits(dext[codes_symbol]), on_got_codes_dist_dist)
  }

  function on_got_codes_dist_dist() {
    var dist = dists[codes_symbol] + last

    // Once we have a "distance" and a "length", we start to output bytes.
    // We reach "dist" back from our current output position to get the byte
    // we should repeat and output it (thus moving the output window cursor forward).
    // Two notes:
    //
    // 1. Theoretically we could overlap our output and input.
    // 2. `X % (2^N) == X & (2^N - 1)` with the distinction that
    //    the result of the bitwise AND won't be negative for the
    //    range of values we're feeding it. Spare a modulo, spoil the child.
    while(codes_len--) {
      output_one(output[(output_idx - dist) & WINDOW_MINUS_ONE])
    }

    become(decode, call_decode(codes_lencode), on_got_codes_symbol)
  }

  function done_with_codes() {
    if(is_final) {
      become(bytes, call_bytes(4), on_got_adler)
      return
    }
    become(bits, call_bits(1), on_got_is_final)
  }




  function on_got_adler() {
    var check_s1 = last[3] | (last[2] << 8)
      , check_s2 = last[1] | (last[0] << 8)

    if(check_s2 !== adler_s2 || check_s1 !== adler_s1) {
      emit(new Error(
        'bad adler checksum: '+[check_s2, adler_s2, check_s1, adler_s1]
      ))
      return
    }

    ended = true

    output_one_recycle()

    if(on_unused) {
      on_unused(
          [bops.subarray(buffer[0], buffer_offset)].concat(buffer.slice(1))
        , bytes_read
      )
    }

    output_idx = 0
    ended = true
    emit()
  }

  function decode() {
    _decode()
  }

  function _decode() {
    if(decode_len > MAXBITS) {
      emit(new Error('ran out of codes'))
      return
    }

    become(bits, call_bits(1), got_decode_bit)
  }

  function got_decode_bit() {
    decode_code = (decode_code | last) >>> 0
    decode_count = decode_huffman.count[decode_len]
    if(decode_code < decode_first + decode_count) {
      unbecome(decode_huffman.symbol[decode_index + (decode_code - decode_first)])
      return
    }
    decode_index += decode_count
    decode_first += decode_count
    decode_first <<= 1
    decode_code = (decode_code << 1) >>> 0
    ++decode_len
    _decode()
  }


  function become(fn, s, then) {
    if(typeof then !== 'function') {
      throw new Error
    }
    states.unshift({
      current: fn
    , next: then
    })
  }

  function unbecome(result) {
    if(states.length > 1) {
      states[1].current = states[0].next
    }
    states.shift()
    if(!states.length) {
      ended = true

      output_one_recycle()
      if(on_unused) {
        on_unused(
            [bops.subarray(buffer[0], buffer_offset)].concat(buffer.slice(1))
          , bytes_read
        )
      }
      output_idx = 0
      ended = true
      emit()
      // return
    }
    else {
      last = result
    }
  }

  function bits() {
    var byt
      , idx

    idx = 0
    bits_value = bitbuf
    while(bitcnt < bits_need) {
      // we do this to preserve `bits_value` when
      // "need_input" is tripped.
      //
      // fun fact: if we moved that into the `if` statement
      // below, it would trigger a deoptimization of this (very
      // hot) function. JITs!
      bitbuf = bits_value
      byt = take()
      if(need_input) {
        break
      }
      ++idx
      bits_value = (bits_value | (byt << bitcnt)) >>> 0
      bitcnt += 8
    }

    if(!need_input) {
      bitbuf = bits_value >>> bits_need
      bitcnt -= bits_need
      unbecome((bits_value & ((1 << bits_need) - 1)) >>> 0)
    }
  }



  function bytes() {
    var byte_accum = bytes_value
      , value

    while(bytes_need--) {
      value = take()


      if(need_input) {
        bitbuf = bitcnt = 0
        bytes_need += 1
        break
      }
      byte_accum[byte_accum.length] = value
    }
    if(!need_input) {
      bitcnt = bitbuf = 0
      unbecome(byte_accum)
    }
  }



  function take() {
    if(!buffer.length) {
      need_input = true
      return
    }

    if(buffer_offset === buffer[0].length) {
      buffer.shift()
      buffer_offset = 0
      return take()
    }

    ++bytes_read

    return bitbuf = takebyte()
  }

  function takebyte() {
    return buffer[0][buffer_offset++]
  }



  function output_one(val) {
    adler_s1 = (adler_s1 + val) % 65521
    adler_s2 = (adler_s2 + adler_s1) % 65521
    output[output_idx++] = val
    output_idx &= WINDOW_MINUS_ONE
    output_one_pool(val)
  }

  function output_one_pool(val) {
    if(output_one_offs === OUTPUT_ONE_LENGTH) {
      output_one_recycle()
    }

    output_one_buf[output_one_offs++] = val
  }

  function output_one_recycle() {
    if(output_one_offs > 0) {
      if(output_one_buf) {
        emit(null, bops.subarray(output_one_buf, 0, output_one_offs))
      } else {
      }
      output_one_buf = bops.create(OUTPUT_ONE_LENGTH)
      output_one_offs = 0
    }
  }

  function output_many(vals) {
    var len
      , byt
      , olen

    output_one_recycle()
    for(var i = 0, len = vals.length; i < len; ++i) {
      byt = vals[i]
      adler_s1 = (adler_s1 + byt) % 65521
      adler_s2 = (adler_s2 + adler_s1) % 65521
      output[output_idx++] = byt
      output_idx &= WINDOW_MINUS_ONE
    }

    emit(null, bops.from(vals))
  }
}

function build_fixed() {
  var lencnt = []
    , lensym = []
    , distcnt = []
    , distsym = []

  var lencode = {
      count: lencnt
    , symbol: lensym
  }

  var distcode = {
      count: distcnt
    , symbol: distsym
  }

  var lengths = []
    , symbol

  for(symbol = 0; symbol < 144; ++symbol) {
    lengths[symbol] = 8
  }
  for(; symbol < 256; ++symbol) {
    lengths[symbol] = 9
  }
  for(; symbol < 280; ++symbol) {
    lengths[symbol] = 7
  }
  for(; symbol < FIXLCODES; ++symbol) {
    lengths[symbol] = 8
  }
  construct(lencode, lengths, FIXLCODES)

  for(symbol = 0; symbol < MAXDCODES; ++symbol) {
    lengths[symbol] = 5
  }
  construct(distcode, lengths, MAXDCODES)
  return {lencode: lencode, distcode: distcode}
}

function construct(huffman, lengths, num) {
  var symbol
    , left
    , offs
    , len

  offs = []

  for(len = 0; len <= MAXBITS; ++len) {
    huffman.count[len] = 0
  }

  for(symbol = 0; symbol < num; ++symbol) {
    huffman.count[lengths[symbol]] += 1
  }

  if(huffman.count[0] === num) {
    return
  }

  left = 1
  for(len = 1; len <= MAXBITS; ++len) {
    left <<= 1
    left -= huffman.count[len]
    if(left < 0) {
      return left
    }
  }

  offs[1] = 0
  for(len = 1; len < MAXBITS; ++len) {
    offs[len + 1] = offs[len] + huffman.count[len]
  }

  for(symbol = 0; symbol < num; ++symbol) {
    if(lengths[symbol] !== 0) {
      huffman.symbol[offs[lengths[symbol]]++] = symbol
    }
  }

  return left
}
};

defs["node_modules/js-git/lib/deflate.js"] = function (module, exports) {
var zlib = require('zlib');
module.exports = function deflate(buffer, callback) {
  return zlib.deflate(buffer, callback);
};
// TODO: make this work in the browser too.
};

defs["node_modules/js-git/mixins/client.js"] = function (module, exports) {
var pushToPull = require('node_modules/push-to-pull/transform.js');
var parse = pushToPull(require('node_modules/js-git/lib/pack-codec.js').decodePack);
var agent = require('node_modules/js-git/lib/agent.js');

module.exports = function (repo) {
  repo.fetchPack = fetchPack;
  repo.sendPack = sendPack;
};

function fetchPack(remote, opts, callback) {
  if (!callback) return fetchPack.bind(this, remote, opts);
  var repo = this;
  var db = repo.db;
  var refs, branch, queue, ref, hash;
  return remote.discover(onDiscover);

  function onDiscover(err, serverRefs, serverCaps) {
    if (err) return callback(err);
    refs = serverRefs;
    opts.caps = processCaps(opts, serverCaps);
    return processWants(refs, opts.want, onWants);
  }

  function onWants(err, wants) {
    if (err) return callback(err);
    opts.wants = wants;
    return remote.fetch(repo, opts, onPackStream);
  }

  function onPackStream(err, raw) {
    if (err) return callback(err);
    if (!raw) return remote.close(onDone);
    var packStream = parse(raw);
    return repo.unpack(packStream, opts, onUnpack);
  }

  function onUnpack(err) {
    if (err) return callback(err);
    return remote.close(onClose);
  }

  function onClose(err) {
    if (err) return callback(err);
    queue = Object.keys(refs);
    return next();
  }

  function next(err) {
    if (err) return callback(err);
    ref = queue.shift();
    if (!ref) return repo.setHead(branch, onDone);
    if (ref === "HEAD" || /{}$/.test(ref)) return next();
    hash = refs[ref];
    if (!branch && (hash === refs.HEAD)) branch = ref.substr(11);
    db.has(hash, onHas);
  }

  function onHas(err, has) {
    if (err) return callback(err);
    if (!has) return next();
    return db.set(ref, hash + "\n", next);
  }

  function onDone(err) {
    if (err) return callback(err);
    return callback(null, refs);
  }

  function processCaps(opts, serverCaps) {
    var caps = [];
    if (serverCaps["ofs-delta"]) caps.push("ofs-delta");
    if (serverCaps["thin-pack"]) caps.push("thin-pack");
    if (opts.includeTag && serverCaps["include-tag"]) caps.push("include-tag");
    if ((opts.onProgress || opts.onError) &&
        (serverCaps["side-band-64k"] || serverCaps["side-band"])) {
      caps.push(serverCaps["side-band-64k"] ? "side-band-64k" : "side-band");
      if (!opts.onProgress && serverCaps["no-progress"]) {
        caps.push("no-progress");
      }
    }
    if (serverCaps.agent) caps.push("agent=" + agent);
    return caps;
  }

  function processWants(refs, filter, callback) {
    if (filter === null || filter === undefined) {
      return defaultWants(refs, callback);
    }
    filter = Array.isArray(filter) ? arrayFilter(filter) :
      typeof filter === "function" ? filter = filter :
      wantFilter(filter);

    var list = Object.keys(refs);
    var wants = {};
    var ref, hash;
    return shift();
    function shift() {
      ref = list.shift();
      if (!ref) return callback(null, Object.keys(wants));
      hash = refs[ref];
      repo.resolve(ref, onResolve);
    }
    function onResolve(err, oldHash) {
      // Skip refs we already have
      if (hash === oldHash) return shift();
      filter(ref, onFilter);
    }
    function onFilter(err, want) {
      if (err) return callback(err);
      // Skip refs the user doesn't want
      if (want) wants[hash] = true;
      return shift();
    }
  }

  function defaultWants(refs, callback) {
    return repo.listRefs("refs/heads", onRefs);

    function onRefs(err, branches) {
      if (err) return callback(err);
      var wants = Object.keys(branches);
      wants.unshift("HEAD");
      return processWants(refs, wants, callback);
    }
  }

}

function wantMatch(ref, want) {
  if (want === "HEAD" || want === null || want === undefined) {
    return ref === "HEAD";
  }
  if (Object.prototype.toString.call(want) === '[object RegExp]') {
    return want.test(ref);
  }
  if (typeof want === "boolean") return want;
  if (typeof want !== "string") {
    throw new TypeError("Invalid want type: " + typeof want);
  }
  return (/^refs\//.test(ref) && ref === want) ||
    (ref === "refs/heads/" + want) ||
    (ref === "refs/tags/" + want);
}

function wantFilter(want) {
  return filter;
  function filter(ref, callback) {
    var result;
    try {
      result = wantMatch(ref, want);
    }
    catch (err) {
      return callback(err);
    }
    return callback(null, result);
  }
}

function arrayFilter(want) {
  var length = want.length;
  return filter;
  function filter(ref, callback) {
    var result;
    try {
      for (var i = 0; i < length; ++i) {
        result = wantMatch(ref, want[i]);
        if (result) break;
      }
    }
    catch (err) {
      return callback(err);
    }
    return callback(null, result);
  }
}

function sendPack(remote, opts, callback) {
  if (!callback) return sendPack.bind(this, remote, opts);
  throw "TODO: Implement repo.sendPack";
}
};

defs["node_modules/js-git/lib/agent.js"] = function (module, exports) {
var meta = require('node_modules/js-git/package.json');
module.exports = meta.name + "/" + meta.version;
};

defs["node_modules/js-git/package.json"] = function (module, exports) {
module.exports = {"name":"js-git","version":"0.6.2","description":"Git Implemented in JavaScript","main":"js-git.js","repository":{"type":"git","url":"git://github.com/creationix/js-git.git"},"devDependencies":{"git-fs-db":"~0.2.0","git-net":"~0.0.4","git-node-platform":"~0.1.4","gen-run":"~0.1.1"},"keywords":["git","js-git"],"author":{"name":"Tim Caswell","email":"tim@creationix.com"},"license":"MIT","bugs":{"url":"https://github.com/creationix/js-git/issues"},"dependencies":{"push-to-pull":"~0.1.0","varint":"0.0.3","bops":"~0.1.0"},"readme":"js-git\n======\n\nGit Implemented in JavaScript.\n\nThis project is very modular and configurable by gluing different components together.\n\nThis repo, `js-git`, is the core implementation of git and consumes various instances of interfaces.  This means that your network and persistance stack is completely pluggable.\n\nIf you're looking for a more pre-packaged system, consider packages like `creationix/git-node` that implement all the abstract interfaces using node.js native APIs.  The `creationix/jsgit` package is an example of a CLI tool that consumes this.\n\nThe main end-user API as exported by this module for working with local repositories is:\n\n## Initialize the library\n\nFirst you create an instance of the library by injecting the platform dependencies.\n\n```js\nvar platform = require('git-node-platform');\nvar jsGit = require('js-git')(platform);\n```\n\n## Wrap a Database\n\nThen you implement the database interface (or more likely use a library to create it for you).\n\n```js\nvar fsDb = require('git-fs-db')(platform);\nvar db = fsDb(\"/path/to/repo.git\");\n```\n\nThe database interface is documented later on.\n\n## Continuables\n\nIn all public async functions you can either pass in a node-style callback last or omit the callback and it will return you a continuable.\n\nThis means you can consume the js-git library using normal ES3 code or if you prefer use [gen-run][] and consume the continuables.\n\nIf the callback is omitted, a continuable is returned.  You must pass a callback into this continuable to actually start the action.\n\n```js\n// Callback mode\njsgit.someAction(arg1, arg2, function (err, result) {\n  ...\n});\n\n// Continuable mode\nvar cont = jsgit.someAction(arg1, arg2);\ncont(function (err, result) {\n  ...\n});\n\n// Continuable mode with gen-run\nvar result = yield jsgit.someAction(arg1, arg2);\n```\n\n### db.get(key, [callback]) -> value\n\nLoad a ref or object from the database.\n\nThe database should assume that keys that are 40-character long hex strings are sha1 hashes.  The value for these will always be binary (`Buffer` in node, `Uint8Array` in browser)\nAll other keys are paths like `refs/heads/master` or `HEAD` and the value is a string.\n\n\n### db.set(key, value, [callback])\n\nSave a value to the database.  Same rules apply about hash keys being binary values and other keys being string values.\n\n### db.has(key, [callback]) -> hasKey?\n\nCheck if a key is in the database\n\n### db.del(key, [callback])\n\nRemove an object or ref from the database.\n\n### db.keys(prefix, [callback]) -> keys\n\nGiven a path prefix, give all the keys.  This is like a readdir if you treat the keys as paths.\n\nFor example, given the keys `refs/heads/master`, `refs/heads/experimental`, `refs/tags/0.1.3` and the prefix `refs/heads/`, the output would be `master` and `experimental`.\n\nA null prefix returns all non hash keys.\n\n### db.init([callback])\n\nInitialize a database.  This is where you db implementation can setup stuff.\n\n### db.clear([callback])\n\nThis is for when the user wants to delete or otherwise reclaim your database's resources.\n\n\n### Wrapping the DataBase\n\nNow that you have a database instance, you can use the jsGit library created above.\n\n```js\nvar repo = jsGit(db);\n```\n\n### repo.load(hash(ish), [callback]) -> git object\n\nLoad a git object from the database.  You can pass in either a hash or a symbolic name like `HEAD` or `refs/tags/v3.1.4`.\n\nThe object will be of the form:\n\n```js\n{\n  type: \"commit\", // Or \"tag\", \"tree\", or \"blob\"\n  body: { ... } // Or an array for tree and a binary value for blob.\n}\n```\n\n### repo.save(object, [callback]) -> hash\n\nSave an object to the database.  This will give you back the hash of the cotent by which you can retrieve the value back.\n\n### repo.loadAs(type, hash, [callback]) -> body\n\nThis convenience wrapper will call `repo.load` for you and then check if the type is what you expected.  If it is, it will return the body directly.  If it's not, it will error.\n\n```js\nvar commit = yield repo.loadAs(\"commit\", \"HEAD\");\nvar tree = yield repo.loadAs(\"tree\", commit.tree);\n```\n\nI'm using yield syntax because it's simpler, you can use callbacks instead if you prefer.\n\n### repo.saveAs(type, body, [callback]) -> hash\n\nAnother convenience wrapper, this time to save objects as a specefic type.  The body must be in the right format.\n\n```js\nvar blobHash = yield repo.saveAs(\"blob\", binaryData);\nvar treeHash = yield repo.saveAs(\"tree\", [\n  { mode: 0100644, name: \"file.dat\", hash: blobHash }\n]);\nvar commitHash = yield repo.saveAs(\"commit\", {\n  tree: treeHash,\n  author: { name: \"Tim Caswell\", email: \"tim@creationix.com\", date: new Date },\n  message: \"Save the blob\"\n});\n```\n\n### repo.remove(hash, [callback])\n\nRemove an object.\n\n### repo.unpack(packFileStream, opts, [callback])\n\nImport a packfile stream (simple-stream format) into the current database.  This is used mostly for clone and fetch operations where the stream comes from a remote repo.\n\n`opts` is a hash of optional configs.\n\n - `opts.onProgress(progress)` - listen to the git progress channel by passing in a event listener.\n - `opts.onError(error)` - same thing, but for the error channel.\n - `opts.deline` - If this is truthy, the progress and error messages will be rechunked to be whole lines.  They usually come jumbled in the internal sidechannel.\n\n### repo.logWalk(hash(ish), [callback]) -> log stream\n\nThis convenience wrapper creates a readable stream of the history sorted by author date.\n\nIf you want full history, pass in `HEAD` for the hash.\n\n### repo.treeWalk(hash(ish), [callback]) -> file stream\n\nThis helper will return a stream of files suitable for traversing a file tree as a linear stream.  The hash can be a ref to a commit, a commit hash or a tree hash directly.\n\n### repo.walk(seed, scan, loadKey, compare) -> stream\n\nThis is the generic helper that `logWalk` and `treeWalk` use.  See `js-git.js` source for usage.\n\n### repo.resolveHashish(hashish, [callback]) -> hash\n\nResolve a ref, branch, or tag to a real hash.\n\n### repo.updateHead(hash, [callback])\n\nUpdate whatever branch `HEAD` is pointing to so that it points to `hash`.\n\nYou'll usually want to do this after creating a new commint in the HEAD branch.\n\n### repo.getHead([callback]) -> ref name\n\nRead the current active branch.\n\n### repo.setHead(ref, [callback])\n\nSet the current active branch.\n\n### repo.fetch(remote, opts, [callback])\n\nConvenience wrapper that fetches from a remote instance and calls `repo.unpack` with the resulting packfile stream for you.\n\n## Related Packages\n\nBeing that js-git is so modular, here is a list of the most relevent modules that work with js-git:\n\n - <https://github.com/creationix/git-net> - A generic remote protocol implementation that wraps the platform interfaces and consumes urls.\n - Example Applications\n   - <https://github.com/creationix/git-browser> - A multi-platform GUI program that clones and browses git repos.\n   - <https://github.com/creationix/jsgit> - An example of using js-git in node.  This is a CLI tool.\n     - <https://github.com/creationix/git-node> - A packaged version of js-git made for node.js\n - Platform Helpers\n   - <https://github.com/creationix/git-http> - A git-http platform interface adapter that wraps git-tcp platform instances.\n   - <https://github.com/creationix/git-node-platform> - Just the platform interface for using js-git on node.js.\n   - <https://github.com/creationix/git-sha1> - A pure-js implementation of the sha1 part of the platform interface.\n   - <https://github.com/creationix/git-web-platform> - An implementation of js-git platform for browsers.\n   - <https://github.com/creationix/websocket-tcp-client> - An implementation of the git-tcp interface that consumes a websocket to tcp proxy server.\n   - <https://github.com/creationix/git-zlib> - A pure-js implementation of the zlib parts of the platform interface.\n - Storage Backends\n   - <https://github.com/creationix/git-fs-db> - A database interface adapter that wraps a fs interface.\n   - <https://github.com/creationix/git-localdb> - A git-db implementation based on `localStorage`.\n   - <https://github.com/creationix/git-memdb> - A git-db implementation that stores data in ram for quick testing.\n   - <https://github.com/aaronpowell/git-indexeddb> - A git-db implementation cased on `indexedDB`.\n\n[gen-run]: https://github.com/creationix/gen-run\n","readmeFilename":"README.md","homepage":"https://github.com/creationix/js-git","_id":"js-git@0.6.2","_shasum":"66a2afaeae0317eaf2d10535d934e17d0ace61e6","_from":"js-git@~0.6.1","_resolved":"https://registry.npmjs.org/js-git/-/js-git-0.6.2.tgz"};
};

defs["node_modules/js-git/mixins/server.js"] = function (module, exports) {
var parallel = require('node_modules/js-git/lib/parallel.js');
var map = require('node_modules/js-git/lib/map.js');
var each = require('node_modules/js-git/lib/each.js');

var bops = {
  join: require('node_modules/bops/typedarray/join.js')
};

module.exports = function (repo) {
  repo.uploadPack = uploadPack;
  repo.receivePack = receivePack;
};

function uploadPack(remote, opts, callback) {
  if (!callback) return uploadPack.bind(this, remote, opts);
  var repo = this, refs, wants = {}, haves = {}, clientCaps = {};
  var packQueue = [];
  var queueBytes = 0;
  var queueLimit = 0;
  return parallel({
    head: repo.getHead(),
    refs: getRefs()
  }, onHeadRef);

  // The peeled value of a ref (that is "ref^{}") MUST be immediately after
  // the ref itself, if presented. A conforming server MUST peel the ref if
  // it’s an annotated tag.
  function getRefs(callback) {
    if (!callback) return getRefs;
    var refs;
    repo.listRefs(null, onRefs);

    function onRefs(err, result) {
      if (err) return callback(err);
      refs = result;
      parallel(map(refs, function (hash) {
        return repo.load(hash);
      }), onValues);
    }

    function onValues(err, values) {
      each(values, function (value, name) {
        if (value.type !== "tag") return;
        refs[name + "^{}"] = value.body.object;
      });
      callback(null, refs);
    }
  }

  function onHeadRef(err, result) {
    if (err) return callback(err);
    var head = result.head;
    refs = result.refs;

    // The returned response is a pkt-line stream describing each ref and its
    // current value. The stream MUST be sorted by name according to the C
    // locale ordering.
    var keys = Object.keys(refs).sort();
    var lines = keys.map(function (ref) {
      return refs[ref] + " " + ref;
    });

    // If HEAD is a valid ref, HEAD MUST appear as the first advertised ref.
    // If HEAD is not a valid ref, HEAD MUST NOT appear in the advertisement
    // list at all, but other refs may still appear.
    if (head) lines.unshift(refs[head] + " HEAD");

    // The stream MUST include capability declarations behind a NUL on the
    // first ref.
    // TODO: add "multi_ack" once it's implemented
    // TODO: add "multi_ack_detailed" once it's implemented
    // TODO: add "shallow" once it's implemented
    // TODO: add "include-tag" once it's implemented
    // TODO: add "thin-pack" once it's implemented
    lines[0] += "\0no-progress side-band side-band-64k ofs-delta";

    // Server SHOULD terminate each non-flush line using LF ("\n") terminator;
    // client MUST NOT complain if there is no terminator.
    lines.forEach(function (line) {
      remote.write(line, null);
    });

    remote.write(null, null);
    remote.read(onWant);
  }

  function onWant(err, line) {
    if (line === undefined) return callback(err);
    if (line === null) {
      return remote.read(onHave);
    }
    var match = line.match(/^want ([0-9a-f]{40})(?: (.+))?\n?$/);
    if (!match) {
      return callback(new Error("Invalid want: " + line));
    }
    var hash = match[1];
    if (match[2]) clientCaps = parseCaps(match[2]);
    wants[hash] = true;
    remote.read(onWant);
  }

  function onHave(err, line) {
    if (line === undefined) return callback(err);
    var match = line.match(/^(done|have)(?: ([0-9a-f]{40}))?\n?$/);
    if (!match) {
      return callback(new Error("Unexpected have line: " + line));
    }
    if (match[1] === "have") {
      haves[match[2]] = true;
      return remote.read(onHave);
    }
    if (Object.keys(haves).length) {
      throw new Error("TODO: handle haves");
    }
    remote.write("NAK\n", null);
    walkRepo(repo, wants, haves, onHashes);
  }

  function onHashes(err, hashes) {
    if (err) return callback(err);
    if (clientCaps["side-band-64k"]) queueLimit = 65519;
    else if (clientCaps["size-band"]) queueLimit = 999;
    repo.pack(hashes, opts, onPack);
  }

  function flush(callback) {
    if (!queueBytes) return callback();
    var chunk = bops.join(packQueue, queueBytes);
    packQueue.length = 0;
    queueBytes = 0;
    remote.write(["pack", chunk], callback);
  }

  function onPack(err, packStream) {
    if (err) return callback(err);
    onWrite();

    function onRead(err, chunk) {
      if (err) return callback(err);
      if (chunk === undefined) return flush(onFlush);
      if (!queueLimit) {
        return remote.write(chunk, onWrite);
      }
      var length = chunk.length;
      if (queueBytes + length <= queueLimit) {
        packQueue.push(chunk);
        queueBytes += length;
        return onWrite();
      }
      if (queueBytes) {
        flush(function (err) {
          if (err) return callback(err);
          return onRead(null, chunk);
        });
      }
      remote.write(["pack", bops.subarray(chunk, 0, queueLimit)], function (err) {
        if (err) return callback(err);
        return onRead(null, bops.subarray(chunk, queueLimit));
      });
    }
    function onWrite(err) {
      if (err) return callback(err);
      packStream.read(onRead);
    }
  }

  function onFlush(err) {
    if (err) return callback(err);
    if (queueLimit) remote.write(null, callback);
    else callback();
  }

}

function receivePack(remote, opts, callback) {
  if (!callback) return receivePack.bind(this, remote, opts);
  var clientCaps = {}, changes = [];
  var repo = this;
  this.listRefs(null, function (err, refs) {
    if (err) return callback(err);
    Object.keys(refs).forEach(function (ref, i) {
      var hash = refs[ref];
      var line = hash + " " + ref;
      // TODO: Implement report-status below and add here
      if (!i) line += "\0delete-refs ofs-delta";
      remote.write(line, null);
    });
    remote.write(null, null);
    remote.read(onLine);
  });

  function onLine(err, line) {
    if (err) return callback(err);
    if (line === null) {
      if (changes.length) return repo.unpack(remote, opts, onUnpack);
      return callback(null, changes);
    }
    var match = line.match(/^([0-9a-f]{40}) ([0-9a-f]{40}) ([^ ]+)(?: (.+))?\n?$/);
    changes.push({
      oldHash: match[1],
      newHash: match[2],
      ref: match[3]
    });
    if (match[4]) clientCaps = parseCaps(match[4]);
    remote.read(onLine);
  }

  function onUnpack(err) {
    if (err) return callback(err);
    var i = 0, change;
    next();
    function next(err) {
      if (err) return callback(err);
      change = changes[i++];
      if (!change) return callback(err, changes);
      if (change.oldHash === "0000000000000000000000000000000000000000") {
        return repo.createRef(change.ref, change.newHash, next);
      }
      if (change.newHash === "0000000000000000000000000000000000000000") {
        return repo.deleteRef(change.ref, next);
      }
      return repo.updateRef(change.ref, change.newHash, next);
    }
  }
}

function parseCaps(line) {
  var caps = {};
  line.split(" ").map(function (cap) {
    var pair = cap.split("=");
    caps[pair[0]] = pair[1] || true;
  });
  return caps;
}

// Calculate a list of hashes to be included in a pack file based on have and want lists.
//
function walkRepo(repo, wants, haves, callback) {
  var hashes = {};
  var done = false;
  var left = 0;

  function onDone(err) {
    if (done) return;
    done = true;
    return callback(err, Object.keys(hashes));
  }

  var keys = Object.keys(wants);
  if (!keys.length) return onDone();
  keys.forEach(walkCommit);

  function walkCommit(hash) {
    if (done) return;
    if (hash in hashes || hash in haves) return;
    hashes[hash] = true;
    left++;
    repo.loadAs("commit", hash, function (err, commit) {
      if (done) return;
      if (err) return onDone(err);
      if (!commit) return onDone(new Error("Missing Commit: " + hash));
      commit.parents.forEach(walkCommit);
      walkTree(commit.tree);
      if (!--left) return onDone();
    });
  }

  function walkTree(hash) {
    if (done) return;
    if (hash in hashes || hash in haves) return;
    hashes[hash] = true;
    left++;
    repo.loadAs("tree", hash, function (err, tree) {
      if (done) return;
      if (err) return onDone(err);
      if (tree === undefined) return onDone(new Error("Missing tree: " + hash));
      Object.keys(tree).forEach(function (name) {
        if (done) return;
        var item = tree[name];
        if (item.mode === 040000) walkTree(item.hash);
        else {
          if (item.hash in hashes || item.hash in haves) return;
          hashes[item.hash] = true;
        }
      });
      if (!--left) return onDone();
    });
  }
}
};

defs["node_modules/js-git/lib/parallel.js"] = function (module, exports) {
module.exports = parallel;

// Run several continuables in parallel.  The results are stored in the same
// shape as the input continuables (array or object).
// Returns a new continuable or accepts a callback.
// This will bail on the first error and ignore all others after it.
function parallel(commands, callback) {
  if (!callback) return parallel.bind(this, commands);
  var results, length, left, i, done;
  
  // Handle array shapes
  if (Array.isArray(commands)) {
    left = length = commands.length;
    results = new Array(left);
    for (i = 0; i < length; i++) {
      run(i, commands[i]);
    }
  }
  
  // Otherwise assume it's an object.
  else {
    var keys = Object.keys(commands);
    left = length = keys.length;
    results = {};
    for (i = 0; i < length; i++) {
      var key = keys[i];
      run(key, commands[key]);
    }
  }
  
  // Common logic for both
  function run(key, command) {
    command(function (err, result) {
      if (done) return;
      if (err) {
        done = true;
        return callback(err);
      }
      results[key] = result;
      if (--left) return;
      done = true;
      callback(null, results);
    });
  }
}
};

defs["node_modules/js-git/lib/map.js"] = function (module, exports) {
module.exports = map;

// A functional map that works on both arrays and objects
// The returned object has the same shape as the original, but values mapped.
function map(obj, fn) {
  if (Array.isArray(obj)) return obj.map(fn);
  var result = {};
  var keys = Object.keys(obj);
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    result[key] = fn(obj[key], key, obj);
  }
  return result;
}
};

defs["node_modules/js-git/lib/each.js"] = function (module, exports) {
module.exports = each;

// A functional forEach that works on both arrays and objects
function each(obj, fn) {
  if (Array.isArray(obj)) return obj.forEach(fn);
  var keys = Object.keys(obj);
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    fn(obj[key], key, obj);
  }
}
};

defs["node_modules/git-net/remote.js"] = function (module, exports) {
var urlParse = require('node_modules/git-net/url-parse.js');
module.exports = function (platform) {
  var tcp, http, ws, ssh;
  return processUrl;
  function processUrl(url) {
    var opts = urlParse(url);
    if (opts.protocol === "git:") {
      if (!platform.tcp) throw new Error("Platform does not support git: urls");
      tcp = tcp || require('node_modules/git-net/tcp.js')(platform);
      return tcp(opts);
    }
    if (opts.protocol === "http:" || opts.protocol === "https:") {
      if (!platform.http) throw new Error("Platform does not support http(s): urls");
      http = http || require('node_modules/git-net/smart-http.js')(platform);
      return http(opts);
    }
    if (opts.protocol === "ws:" || opts.protocol === "wss:") {
      if (!platform.ws) throw new Error("Platform does not support ws(s): urls");
      ws = ws || require('node_modules/git-net/ws.js')(platform);
      return ws(opts);
    }
    if (opts.protocol === "ssh:") {
      if (!platform.ssh) throw new Error("Platform does not support ssh: urls");
      ssh = ssh || require('node_modules/git-net/ssh.js')(platform);
      return ssh(opts);
    }
    throw new Error("Unknown protocol " + opts.protocol);
  }
};
};

defs["node_modules/git-net/url-parse.js"] = function (module, exports) {
module.exports = urlParse;

function urlParse(href) {
  var protocol, username, password, hostname, port, pathname, search, hash;
  var match, host, path;
  // Match URL style remotes
  if (match = href.match(/^(?:(wss?:|https?:|git:|ssh:)\/\/)([^\/]+)([^:]+)$/)) {
    protocol = match[1],
    host = match[2];
    path = match[3];
    match = host.match(/^(?:([^@:]+)(?::([^@]+))?@)?([^@:]+)(?::([0-9]+))?$/);
    username = match[1];
    password = match[2];
    hostname = match[3];
    port = match[4];
    match = path.match(/^([^?]*)(\?[^#]*)?(#.*)?$/);
    pathname = match[1];
    if (protocol === "ssh:") pathname = pathname.substr(1);
    search = match[2];
    hash = match[3];
  }
  // Match scp style ssh remotes
  else if (match = href.match(/^(?:([^@]+)@)?([^:\/]+)([:\/][^:\/][^:]+)$/)) {
    protocol = "ssh:";
    username = match[1];
    host = hostname = match[2];
    path = pathname = match[3];
    if (pathname[0] === ":") pathname = pathname.substr(1);
  }
  else {
    throw new Error("Uknown URL format: " + href);
  }

  if (port) port = parseInt(port, 10);
  else if (protocol === "http:" || protocol === "ws:") port = 80;
  else if (protocol === "https:" || protocol === "wss:") port = 443;
  else if (protocol === "ssh:") port = 22;
  else if (protocol === "git:") port = 9418;

  var opt = {
    href: href,
    protocol: protocol
  };
  if (username) {
    opt.username = username;
    if (password) {
      opt.password = password;
      opt.auth = username + ":" + password;
    }
    else {
      opt.auth = username;
    }
  }
  opt.host = host;
  opt.hostname = hostname;
  opt.port = port;
  opt.path = path;
  opt.pathname = pathname;
  if (search) opt.search = search;
  if (hash) opt.hash = hash;

  return opt;
}
};

defs["node_modules/git-net/tcp.js"] = function (module, exports) {
module.exports = function (platform) {
  var writable = require('node_modules/git-net/writable.js');
  var sharedFetch = require('node_modules/git-net/fetch.js');
  var sharedDiscover = require('node_modules/git-net/discover.js');
  var pushToPull = require('node_modules/push-to-pull/transform.js');
  var pktLine = require('node_modules/git-net/pkt-line.js')(platform);
  var framer = pushToPull(pktLine.framer);
  var deframer = pushToPull(pktLine.deframer);
  var tcp = platform.tcp;
  var trace = platform.trace;

  // opts.hostname - host to connect to (github.com)
  // opts.pathname - path to repo (/creationix/conquest.git)
  // opts.port - override default port (9418)
  return function (opts) {

    var connection;

    opts.discover = discover;
    opts.fetch = fetch;
    opts.close = closeConnection;
    return opts;

    function connect(callback) {
      return tcp.connect(opts.port, opts.hostname, function (err, socket) {
        if (err) return callback(err);
        var input = deframer(socket);
        if (trace) input = trace("input", input);

        var output = writable(input.abort);
        connection = {
          read: input.read,
          abort: input.abort,
          write: output
        };
        if (trace) output = trace("output", output);
        output = framer(output);
        socket.sink(output)(function (err) {
          if (err) console.error(err.stack || err);
          // TODO: handle this better somehow
          // maybe allow writable streams
        });
        callback();
      });
    }

    // Send initial git-upload-pack request
    // outputs refs and caps
    function discover(callback) {
      if (!callback) return discover.bind(this);
      if (!connection) {
        return connect(function (err) {
          if (err) return callback(err);
          return discover(callback);
        });
      }
      connection.write("git-upload-pack " + opts.pathname + "\0host=" + opts.hostname + "\0");
      sharedDiscover(connection, callback);
    }

    function fetch(repo, opts, callback) {
      if (!callback) return fetch.bind(this, repo, opts);
      if (!connection) {
        return callback(new Error("Please connect before fetching"));
      }
      return sharedFetch(connection, repo, opts, callback);
    }

    function closeConnection(callback) {
      if (!callback) return closeConnection.bind(this);
      connection.write();
      callback();
    }
  };
};
};

defs["node_modules/git-net/fetch.js"] = function (module, exports) {
var deline = require('node_modules/git-net/deline.js');
module.exports = fetch;
function fetch(socket, repo, opts, callback) {

  var read = socket.read,
      write = socket.write,
      abort = socket.abort;
  var onProgress = opts.onProgress,
      onError = opts.onError,
      wants = opts.wants,
      depth = opts.depth,
      caps = opts.caps;
  var cb;

  if (opts.deline) {
    if (onProgress) onProgress = deline(onProgress);
    if (onError) onError = deline(onError);
  }

  if (!wants.length) {
    write(null);
    write("done\n");
    return callback();
  }

  return repo.listRefs("refs", onRefs);

  function onRefs(err, refs) {
    if (err) return callback(err);

    // want-list
    for (var i = 0, l = wants.length; i < l; ++i) {
      write("want " + wants[i] + (i === 0 ? " " + caps.join(" ") : "") + "\n");
    }
    if (depth) {
      write("deepen " + depth + "\n");
    }
    write(null);

    // have-list
    for (var ref in refs) {
      write("have " + refs[ref] + "\n");
    }

    // compute-end
    write("done\n");
    return read(onResponse);
  }

  function onResponse(err, resp) {
    if (err) return callback(err);
    if (resp === undefined) return callback(new Error("Server disconnected"));
    if (resp === null) return read(onResponse);
    var match = resp.match(/^([^ \n]*)(?: (.*))?/);
    var command = match[1];
    var value = match[2];
    if (command === "shallow") {
      return repo.createRef("shallow", value, onShallow);
    }
    if (command === "NAK" || command === "ACK") {
      return callback(null, { read: packRead, abort: abort });
    }
    return callback(new Error("Unknown command " + command + " " + value));
  }

  function onShallow(err) {
    if (err) return callback(err);
    return read(onResponse);
  }

  function packRead(callback) {
    if (cb) return callback(new Error("Only one read at a time"));
    cb = callback;
    return read(onItem);
  }

  function onItem(err, item) {
    var callback = cb;
    if (item === undefined) {
      cb = null;
      return callback(err);
    }
    if (item) {
      if (item.progress) {
        if (onProgress) onProgress(item.progress);
        return read(onItem);
      }
      if (item.error) {
        if (onError) onError(item.error);
        return read(onItem);
      }
    }
    if (!item) return read(onItem);
    cb = null;
    return callback(null, item);
  }
}
};

defs["node_modules/git-net/deline.js"] = function (module, exports) {
module.exports = function deline(emit) {
  var buffer = "";
  return function (chunk) {
    var start = 0;
    for (var i = 0, l = chunk.length; i < l; ++i) {
      var c = chunk[i];
      if (c === "\r" || c === "\n") {
        buffer += chunk.substr(start, i - start + 1);
        start = i + 1;
        emit(buffer);
        buffer = "";
      }
    }
    buffer += chunk.substr(start);
  };
};
};

defs["node_modules/git-net/discover.js"] = function (module, exports) {
module.exports = discover;
function discover(socket, callback) {
  var read = socket.read;

  var refs = {};
  var caps = null;

  read(onLine);

  function onLine(err, line) {
    if (err) return callback(err);
    if (/^ERR \n/.test(line)) {
      return callback(new Error(line.substr(5).trim()));
    }
    if (line === null) {
      return callback(null, refs, caps);
    }
    line = line.trim();
    if (!caps) line = pullCaps(line);
    var index = line.indexOf(" ");
    refs[line.substr(index + 1)] = line.substr(0, index);
    read(onLine);
  }

  function pullCaps(line) {
    var index = line.indexOf("\0");
    caps = {};
    line.substr(index + 1).split(" ").map(function (cap) {
      var pair = cap.split("=");
      caps[pair[0]] = pair[1] || true;
    });
    return line.substr(0, index);
  }
}
};

defs["node_modules/git-net/pkt-line.js"] = function (module, exports) {
module.exports = function (platform) {
  var bops = platform.bops;
  var PACK = bops.from("PACK");

  return {
    deframer: deframer,
    framer: framer
  };

  function deframer(emit) {
    var state = 0;
    var offset = 4;
    var length = 0;
    var data;

    return function (item) {

      // Forward the EOS marker
      if (item === undefined) return emit();

      // Once we're in pack mode, everything goes straight through
      if (state === 3) return emit(item);

      // Otherwise parse the data using a state machine.
      for (var i = 0, l = item.length; i < l; i++) {
        var byte = item[i];
        if (state === 0) {
          var val = fromHexChar(byte);
          if (val === -1) {
            if (byte === PACK[0]) {
              offset = 1;
              state = 2;
              continue;
            }
            state = -1;
            throw new SyntaxError("Not a hex char: " + String.fromCharCode(byte));
          }
          length |= val << ((--offset) * 4);
          if (offset === 0) {
            if (length === 4) {
              offset = 4;
              emit("");
            }
            else if (length === 0) {
              offset = 4;
              emit(null);
            }
            else if (length > 4) {
              length -= 4;
              data = bops.create(length);
              state = 1;
            }
            else {
              state = -1;
              throw new SyntaxError("Invalid length: " + length);
            }
          }
        }
        else if (state === 1) {
          data[offset++] = byte;
          if (offset === length) {
            offset = 4;
            state = 0;
            length = 0;
            if (data[0] === 1) {
              emit(bops.subarray(data, 1));
            }
            else if (data[0] === 2) {
              emit({progress: bops.to(bops.subarray(data, 1))});
            }
            else if (data[0] === 3) {
              emit({error: bops.to(bops.subarray(data, 1))});
            }
            else {
              emit(bops.to(data));
            }
          }
        }
        else if (state === 2) {
          if (offset < 4 && byte === PACK[offset++]) {
            continue;
          }
          state = 3;
          emit(bops.join([PACK, bops.subarray(item, i)]));
          break;
        }
        else {
          throw new Error("pkt-line decoder in invalid state");
        }
      }
    };

  }

  function framer(emit) {
    return function (item) {
      if (item === undefined) return emit();
      if (item === null) {
        emit(bops.from("0000"));
        return;
      }
      if (typeof item === "string") {
        item = bops.from(item);
      }
      emit(bops.join([frameHead(item.length + 4), item]));
    };
  }

  function frameHead(length) {
    var buffer = bops.create(4);
    buffer[0] = toHexChar(length >>> 12);
    buffer[1] = toHexChar((length >>> 8) & 0xf);
    buffer[2] = toHexChar((length >>> 4) & 0xf);
    buffer[3] = toHexChar(length & 0xf);
    return buffer;
  }

  function fromHexChar(val) {
    return (val >= 0x30 && val <  0x40) ? val - 0x30 :
          ((val >  0x60 && val <= 0x66) ? val - 0x57 : -1);
  }

  function toHexChar(val) {
    return val < 0x0a ? val + 0x30 : val + 0x57;
  }

};
};

defs["node_modules/git-net/smart-http.js"] = function (module, exports) {
module.exports = function (platform) {
  var writable = require('node_modules/git-net/writable.js');
  var sharedDiscover = require('node_modules/git-net/discover.js');
  var sharedFetch = require('node_modules/git-net/fetch.js');
  var pushToPull = require('node_modules/push-to-pull/transform.js');
  var pktLine = require('node_modules/git-net/pkt-line.js')(platform);
  var framer = pushToPull(pktLine.framer);
  var deframer = pushToPull(pktLine.deframer);
  var http = platform.http;
  var trace = platform.trace;
  var bops = platform.bops;
  var agent = platform.agent;
  var urlParse = require('node_modules/git-net/url-parse.js');

  // opts.hostname - host to connect to (github.com)
  // opts.pathname - path to repo (/creationix/conquest.git)
  // opts.port - override default port (80 for http, 443 for https)
  return function (opts) {
    opts.tls = opts.protocol === "https:";
    opts.port = opts.port ? opts.port | 0 : (opts.tls ? 443 : 80);
    if (!opts.hostname) throw new TypeError("hostname is a required option");
    if (!opts.pathname) throw new TypeError("pathname is a required option");

    opts.discover = discover;
    opts.fetch = fetch;
    opts.close = closeConnection;

    var write, read, abort, cb, error, pathname, headers;

    return opts;

    function connect() {
      write = writable();
      var output = write;
      if (trace) output = trace("output", output);
      output = framer(output);
      read = null;
      abort = null;
      post(pathname, headers, output, onResponse);
    }

    function onResponse(err, code, headers, body) {
      if (err) return onError(err);
      if (code !== 200) return onError(new Error("Unexpected status code " + code));
      if (headers['content-type'] !== 'application/x-git-upload-pack-result') {
        return onError(new Error("Wrong content-type in server response"));
      }
      body = deframer(body);
      if (trace) body = trace("input", body);
      read = body.read;
      abort = body.abort;

      if (cb) {
        var callback = cb;
        cb = null;
        return read(callback);
      }
    }

    function onError(err) {
      if (cb) {
        var callback = cb;
        cb = null;
        return callback(err);
      }
      error = err;
    }

    function enqueue(callback) {
      if (error) {
        var err = error;
        error = null;
        return callback(err);
      }
      cb = callback;
    }


    function addDefaults(extras) {

      var headers = {
        "User-Agent": agent,
        "Host": opts.hostname,
      };

      // Hack to workaround gist bug.
      // https://github.com/creationix/js-git/issues/25
      if (opts.hostname === "gist.github.com") {
        headers["User-Agent"] = "git/1.8.1.2";
        headers["X-Real-User-Agent"] = agent;
      }

      for (var key in extras) {
        headers[key] = extras[key];
      }
      return headers;
    }

    function get(path, headers, callback) {
      return http.request({
        method: "GET",
        hostname: opts.hostname,
        tls: opts.tls,
        port: opts.port,
        auth: opts.auth,
        path: opts.pathname + path,
        headers: addDefaults(headers)
      }, onGet);

      function onGet(err, code, responseHeaders, body) {
        if (err) return callback(err);
        if (code === 301) {
          var uri = urlParse(responseHeaders.location);
          opts.protocol = uri.protocol;
          opts.hostname = uri.hostname;
          opts.tls = uri.protocol === "https:";
          opts.port = uri.port;
          opts.auth = uri.auth;
          opts.pathname = uri.path.replace(path, "");
          return get(path, headers, callback);
        }
        return callback(err, code, responseHeaders, body);
      }
    }

    function buffer(body, callback) {
      var parts = [];
      body.read(onRead);
      function onRead(err, item) {
        if (err) return callback(err);
        if (item === undefined) {
          return callback(null, bops.join(parts));
        }
        parts.push(item);
        body.read(onRead);
      }
    }

    function post(path, headers, body, callback) {
      headers = addDefaults(headers);
      if (typeof body === "string") {
        body = bops.from(body);
      }
      if (bops.is(body)) {
        headers["Content-Length"] = body.length;
      }
      else {
        if (headers['Transfer-Encoding'] !== 'chunked') {
          return buffer(body, function (err, body) {
            if (err) return callback(err);
            headers["Content-Length"] = body.length;
            send(body);
          });
        }
      }
      send(body);
      function send(body) {
        http.request({
          method: "POST",
          hostname: opts.hostname,
          tls: opts.tls,
          port: opts.port,
          auth: opts.auth,
          path: opts.pathname + path,
          headers: headers,
          body: body
        }, callback);
      }
    }

    // Send initial git-upload-pack request
    // outputs refs and caps
    function discover(callback) {
      if (!callback) return discover.bind(this);
      get("/info/refs?service=git-upload-pack", {
        "Accept": "*/*",
        "Accept-Encoding": "gzip",
        "Pragma": "no-cache"
      }, function (err, code, headers, body) {
        if (err) return callback(err);
        if (code !== 200) return callback(new Error("Unexpected status code " + code));
        if (headers['content-type'] !== 'application/x-git-upload-pack-advertisement') {
          return callback(new Error("Wrong content-type in server response"));
        }

        body = deframer(body);
        if (trace) body = trace("input", body);

        body.read(function (err, line) {
          if (err) return callback(err);
          if (line.trim() !== '# service=git-upload-pack') {
            return callback(new Error("Missing expected service line"));
          }
          body.read(function (err, line) {
            if (err) return callback(err);
            if (line !== null) {
              return callback(new Error("Missing expected terminator"));
            }
            sharedDiscover(body, callback);
          });
        });
      });
    }

    function fetch(repo, opts, callback) {
      if (!callback) return fetch.bind(this, repo, opts);
      pathname = "/git-upload-pack";
      headers = {
        "Content-Type": "application/x-git-upload-pack-request",
        "Accept": "application/x-git-upload-pack-result",
      };

      return sharedFetch({
        read: resRead,
        abort: resAbort,
        write: resWrite
      }, repo, opts, callback);
    }

    function resRead(callback) {
      if (read) return read(callback);
      return enqueue(callback);
    }

    function resAbort(callback) {
      if (abort) return abort(callback);
      return callback();
    }

    function resWrite(line) {
      if (!write) connect();
      if (line === "done\n") {
        write(line);
        write();
        write = null;
      }
      else {
        write(line);
      }
    }

    function closeConnection(callback) {
      if (!callback) return closeConnection.bind(this);
      callback();
    }
  };
};
};

defs["node_modules/git-net/ws.js"] = function (module, exports) {

};

defs["node_modules/git-net/ssh.js"] = function (module, exports) {
module.exports = function (platform) {
  var writable = require('node_modules/git-net/writable.js');
  var sharedFetch = require('node_modules/git-net/fetch.js');
  var sharedDiscover = require('node_modules/git-net/discover.js');
  var pushToPull = require('node_modules/push-to-pull/transform.js');
  var trace = platform.trace;
  var pktLine = require('node_modules/git-net/pkt-line.js')(platform);
  var framer = pushToPull(pktLine.framer);
  var deframer = pushToPull(pktLine.deframer);
  var ssh = platform.ssh;

  // opts.hostname - host to connect to (github.com)
  // opts.pathname - path to repo (/creationix/conquest.git)
  // opts.port - override default port (22)
  // opts.auth - username:password or just username
  // opts.privateKey - binary contents of private key to use.
  return function (opts) {
    if (!opts.hostname) throw new TypeError("hostname is a required option");
    if (!opts.pathname) throw new TypeError("pathname is a required option");

    var tunnel, connection;

    opts.discover = discover;
    opts.fetch = fetch;
    opts.close = closeConnection;
    return opts;

    function connect(command, callback) {
      if (connection) return callback();
      ssh(opts, function (err, result) {
        if (err) return callback(err);
        tunnel = result;
        tunnel.exec(command, function (err, socket) {
          if (err) return callback(err);
          var input = deframer(socket);
          if (trace) input = trace("input", input);

          var output = writable(input.abort);
          connection = {
            read: input.read,
            abort: input.abort,
            write: output
          };
          if (trace) output = trace("output", output);
          output = framer(output);
          socket.sink(output)(function (err) {
            throw err;
            // TODO: handle this better somehow
            // maybe allow writable streams
          });
          callback();
        });
      });
    }

    // Send initial git-upload-pack request
    // outputs refs and caps
    function discover(callback) {
      if (!callback) return discover.bind(this);
      if (!connection) {
        return connect("git-upload-pack", function (err) {
          if (err) return callback(err);
          return discover(callback);
        });
      }
      sharedDiscover(connection, callback);
    }

    function fetch(repo, opts, callback) {
      if (!callback) return fetch.bind(this, repo, opts);
      if (!connection) {
        return callback(new Error("Please connect before fetching"));
      }
      return sharedFetch(connection, repo, opts, callback);
    }

    function closeConnection(callback) {
      if (!callback) return closeConnection.bind(this);
      connection.write();
      tunnel.close();
      callback();
    }

  };

};
};

defs["node_modules/git-indexeddb/indexeddb.js"] = function (module, exports) {
(function (module, exports, fn) {
    'use strict';
    if (typeof module === 'undefined') {
        module = {
            exports: {}
        };

        window.gitIndexedDB = module;
    }

    if (typeof exports === 'undefined') {
        exports = module.exports;
    }

    fn(
        module,
        exports,
        window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB
    );
})(module, exports,
function (module, exports, indexedDB) {
    'use strict';
    var version = 1;
    var hashStoreName = 'hashs';
    var hashIndexKey = 'hash';
    var pathStoreName = 'paths';
    var pathIndexKey = 'path';
    var isHash = /^[a-z0-9]{40}$/;

    var deflate, inflate;
    module.exports = function (platform) {
        deflate = platform.deflate || fake;
        inflate = platform.inflate || fake;
        return db;
    };

    var fake = function fake(input, callback) {
        callback(null, input);
    };

    var db = function db(prefix) {
        var context = {};

        return {
            init: init.bind(context, prefix),
            get: get.bind(context),
            keys: keys.bind(context),
            set: set.bind(context),
            has: has.bind(context),
            del: del.bind(context),
            clear: clear.bind(context, prefix)
        };
    };

    var init = function init(prefix, callback) {
        if (!callback) return init.bind(this, prefix);
        var request = indexedDB.open(prefix, version);
        var context = this;

        request.addEventListener('upgradeneeded', function (e) {
            var db = e.target.result;

            var hashStore = db.createObjectStore(hashStoreName, { keyPath: hashIndexKey });

            var pathStore = db.createObjectStore(pathStoreName, { keyPath: pathIndexKey });
        });
        request.addEventListener('success', function (e) {
            context.db = e.target.result;
            callback();
        });
        request.addEventListener('error', function (e) {
            callback(e);
        });
    };

    var get = function get(key, callback) {
        if (!callback) return get.bind(this, key);
        var context = this;
        if (!callback) {
            return get.bind(this, key);
        }
        if (isHash.test(key)) {
            var transaction = context.db.transaction(hashStoreName);
            var store = transaction.objectStore(hashStoreName);

            var request = store.get(key);

            request.addEventListener('success', function (e) {
                callback(null, e.target.result.value);
            });
            request.addEventListener('error', function (e) {
                callback(e);
            });
        } else {
            var transaction = context.db.transaction(pathStoreName);
            var store = transaction.objectStore(pathStoreName);

            var request = store.get(key);

            request.addEventListener('success', function (e) {
                callback(null, e.target.result ? e.target.result.ref : undefined);
            });
            request.addEventListener('error', function (e) {
                callback(e);
            });
        }
    };

    var keys = function keys(prefix, callback) {
        if (!callback) return keys.bind(this, prefix);
        var context = this;

        var transaction = context.db.transaction(pathStoreName);
        var store = transaction.objectStore(pathStoreName);

        if (prefix) {
            var request = store.get(prefix);

            request.addEventListener('success', function (e) {
                if (e.target.result) {
                    callback(null, e.target.result.keys);
                } else {
                    callback(null, []);
                }
            });
            request.addEventListener('error', function (e) {
                callback(e);
            });
        } else {
            var request = store.openCursor();
            var refs = [];
            request.addEventListener('success', function (e) {
                var cursor = e.target.result;

                if (cursor) {
                    refs.push(cursor.value.ref);
                    cursor['continue']();
                }
            });
            request.addEventListener('error', function (e) {
                callback(e);
            });
            transaction.addEventListener('success', function (e) {
                callback(null, refs);
            });
        }
    };

    var set = function set(key, value, callback) {
        if (!callback) return set.bind(this, key, value);
        var context = this;
        if (!callback) {
            return set.bind(context, key, value);
        }

        if (isHash.test(key)) {
            var transaction = context.db.transaction(hashStoreName, 'readwrite');
            var store = transaction.objectStore(hashStoreName);
            var record = {
                value: value
            };
            record[hashIndexKey] = key;

            var request = store.put(record);

            transaction.addEventListener('complete', function (e) {
                callback();
            });
            transaction.addEventListener('error', function (e) {
                callback(e);
            });
        } else {
            var transaction = context.db.transaction(pathStoreName, 'readwrite');
            var store = transaction.objectStore(pathStoreName);
            var record = {
                ref: value
            };
            record[pathIndexKey] = key;

            var request = store.put(record);

            transaction.addEventListener('complete', function (e) {
                callback();
            });
            transaction.addEventListener('error', function (e) {
                callback(e);
            });
        }
    };

    var has = function has(key, callback) {
        if (!callback) return has.bind(this, key);
        var store = pathStoreName;
        var context = this;

        if (isHash.test(key)) {
            store = hashStoreName;
        }

        var transaction = context.db.transaction(store);
        var store = transaction.objectStore(store);

        var request = store.get(key);

        request.addEventListener('success', function (e) {
            callback(null, !!e.target.result);
        });
        request.addEventListener('error', function (e) {
            callback(e);
        });
    };

    var del = function del(key, callback) {
        if (!callback) return del.bind(this, key);

        var store = pathStoreName;
        var context = this;

        if (isHash.test(key)) {
            store = hashStoreName;
        }

        var transaction = context.db.transaction(store, 'readwrite');
        var store = transaction.objectStore(store);

        var request = store.delete(key);

        request.addEventListener('success', function (e) {
            callback();
        });
        request.addEventListener('error', function (e) {
            callback(e);
        });
    };

    var clear = function clear(prefix, callback) {
        if (!callback) return clear.bind(this, prefix);
        var context = this;

        context.db.close();

        var request = indexedDB.deleteDatabase(prefix);
        request.addEventListener('success', function (e) {
            callback();
        });
        request.addEventListener('error', function (e) {
            callback(e);
        });
    };
});
};

defs["src/app/phone-ui.js"] = function (module, exports) {
var domBuilder = require('node_modules/dombuilder/dombuilder.js');
var progressParser = require('src/lib/progress-parser.js');
var ui = require('src/app/ui.js');
var prism = require('src/prism/prism-core.js');
require('src/prism/prism-javascript.js');
require('src/prism/prism-c.js');
require('src/prism/prism-bash.js');
require('src/prism/prism-coffeescript.js');
require('src/prism/prism-cpp.js');
require('src/prism/prism-css-extras.js');
require('src/prism/prism-markup.js');

// Patterns for different language mode names.
var modes = {
  javascript: /\.(?:js|json|webapp)$/i,
  css: /\.(?:css|less)$/i,
  // markup: /\.(?:xml|html|svg)$/i,
  bash: /\.sh$/i,
  c: /\.(?:h|c)$/i,
  cpp: /\.(?:cpp|cxx|hxx|h)$/i,
  coffeescript: /\.(?:cs|coffee)$/i,
};

var isText = /(?:\.(?:markdown|md|txt|html|svg|xml)|^(?:LICENSE|README|\.gitignore))$/i;

var isImage = /\.(?:png|jpg|jpeg|gif)$/i;

module.exports = function (backend) {
  ui.push(repoList(backend));
};

function repoList(backend) {
  var $ = {};
  var pending;
  var children = {};
  backend.init(onAdd, onRemove, onReady);

  return domBuilder(["section.page$page", {"data-position": "none", css: {opacity: 0.5}},
    ["header",
      ["button", {onclick:onclick(add)}, [".icon-plus"]],
      ["h1", "Git Repositories"]
    ],
    ["ul.content.header$list"]
  ], $);

  function onAdd(repo) {
    var icon = ".icon.left.icon-";
    if (/github\.com/.test(repo.url)) {
      icon += "github";
    }
    else if (/bitbucket\.org/.test(repo.url)) {
      icon += "bitbucket";
    }
    else {
      icon += "git";
    }
    var $$ = {};
    var child = domBuilder(
      ["li$li", { href: "#", onclick: onclick(fetch, repo, icon, $$) },
        [icon],
        ["p", repo.name],
        ["p", repo.description],
        ["p.progress",
          ["progress$progress"], ["span$span", "Working..."]
        ],
      ], $$
    );
    children[repo.name] = child;
    $.list.appendChild(child);
    repo.remove = function (callback) {
      backend.remove(repo, callback);
    };
  }

  function onRemove(meta) {
    var child = children[meta.name];
    delete children[meta.name];
    $.list.removeChild(child);
  }

  function onReady(err) {
    if (err) return ui.error(err);
    $.page.style.opacity = 1;
  }

  function fetch(repo, icon, $$) {
    var progress = $$.progress;
    var span = $$.span;
    var child = $$.li;
    pending = repo;

    return repo.getHead(function (err, head) {
      if (err) return ui.error(err);
      if (!head) return clone();
      return onFetch();
    });

    function clone() {
      child.classList.add("active");
      var old;
      repo.fetch(repo.remote, {
        onProgress: progressParser(function (message, num, max) {
          if (max) {
            progress.setAttribute("max", max);
            progress.setAttribute("value", num);
          }
          if (message !== old) {
            span.textContent = old = message;
          }
        })
      }, onFetch);

    }

    function onFetch(err) {
      if (err) {
        return repo.remove(function () {
          return ui.error(err);
        });
      }
      var oldChild = child;
      child = domBuilder(
        ["li", { href:"#", onclick: onclick(load, repo) },
          [icon],
          [".icon.right.icon-right-open"],
          ["p", repo.name],
          ["p", repo.description]
        ]
      );
      children[repo.name] = child;
      $$ = null;
      $.list.replaceChild(child, oldChild);
      if (pending === repo) load(repo);
    }

  }

  function load(repo) {
    pending = null;
    repo.logWalk("HEAD", function (err, stream) {
      if (err) return ui.error(err);
      ui.push(historyList(repo, stream));
    });
  }

  function add() {
    ui.push(addPage(backend));
  }

}

function addPage(backend) {
  var $ = {};
  var working = false;
  return domBuilder(["section.page",
    ["header",
      ["button.back", {onclick: ui.pop}, [".icon-left-open"]],
      ["h1", "Add Repository"]
    ],
    ["form.content.header", {onsubmit: submit},
      ["label", {"for": "url"}, "Remote Url"],
      ["input", {
        type: "url",
        name: "url",
        placeholder: "Enter git url here",
        value: "git://github.com/creationix/conquest.git",
        required: true
      }],
      ["label", {"for": "name"}, "Name"],
      ["input", {
        type: "text",
        name: "name",
        placeholder: "Enter custom local name here",
      }],
      ["label", {"for": "description"}, "Description"],
      ["input", {
        type: "text",
        name: "description",
        placeholder: "Enter a short description here",
      }],
      ["input$submit", {
        type: "submit",
        value: "Add Repo"
      }]
    ]
  ], $);
  function submit(evt) {
    evt.preventDefault();
    if (working) return;
    working = true;
    var url = this.url.value;
    var name = this.name.value;
    if (!name) {
      var index = url.lastIndexOf("/");
      name = url.substr(index + 1);
      if (/\.git$/.test(name)) {
        name = name.substr(0, name.length - 4);
      }
    }
    var description = this.description.value;
    return backend.add({
      name: name,
      url: url,
      description: description
    }, onRepo);

    function onRepo(err) {
      working = false;
      if (err) return ui.error(err);
      return ui.pop();
    }
  }
}

function historyList(repo, stream) {
  var $ = {}, ul, end, reading = false;
  var root = domBuilder(["section.page",
    ["header",
      ["button", {onclick:onclick(remove)}, [".icon-minus"]],
      ["button", {onclick:onclick(update)}, [".icon-download"]],
      ["button.back", {onclick: ui.pop}, [".icon-left-open"]],
      ["h1", repo.name]
    ],
    ["ul$ul.content.header",
      ["li$li", {css:{height: "100px"}}, "Loading..."]
    ]
  ], $);
  ul = $.ul;
  end = $.li;
  $ = {};
  ul.addEventListener('scroll', check, false);
  window.addEventListener('resize', check, false);
  setImmediate(function () {
    reading = true;
    stream.read(onRead);
  });
  return root;

  function remove() {
    ui.confirm("Are you sure you want to delete this local repo?", function (res) {
      if (!res) return;
      repo.remove(function (err) {
        if (err) return ui.error(err);
        ui.pop();
      });
    });
  }

  function update() {
    ui.error("TODO: Implement update");
  }

  function load(commit) {
    ui.push(commitPage(repo, commit));
  }

  function onRead(err, commit) {
    reading = false;
    if (err) return ui.error(err);
    if (commit === undefined) {
      ul.removeChild(end);
      end = null;
      ul.removeEventListener('scroll', check, false);
      window.removeEventListener('resize', check, false);
      return;
    }
    var title = truncate(commit.message, 80);
    var item = domBuilder(
      ["li", { href:"#", onclick: onclick(load, commit) },
        [".icon.right.icon-right-open", { title: commit.hash }],
        ["p", title],
        ["p", commit.author.date]
      ]
    );
    ul.insertBefore(item, end);
    check();
  }

  function check() {
    if (reading) return;
    if (end.offsetTop > ul.offsetHeight + ul.scrollTop) return;
    reading = true;
    stream.read(onRead);
  }

}

function commitPage(repo, commit) {
  var details = [];
  var body = ["section.page",
    ["header",
      ["button.back", {onclick: ui.pop}, [".icon-left-open"]],
      ["h1", repo.name]
    ],
    ["form.content.header", {onsubmit: prevent}, details]
  ];
  details.push(
    ["label", "Message"],
    ["p", {css:{whiteSpace:"pre-wrap"}}, commit.message]);
  details.push(
    ["label", "Tree"],
    ["button.recommend", {onclick: enter}, commit.tree]);
  if (commit.parents) {
    details.push(["label",
      "Parent" + (commit.parents.length === 1 ? "" : "s")
    ]);
    commit.parents.forEach(function (parent) {
      details.push(["button", {onclick: ascend(parent)}, parent]);
    });
  }
  details.push(
    ["label", "Author"],
    ["p", commit.author.name + " <" + commit.author.email + "> " + commit.author.date]);
  if (commit.author.email !== commit.committer.email) {
    details.push(
      ["label", "Committer"],
      ["p", commit.committer.name + " <" + commit.committer.email + "> " + commit.committer.date]);
  }
  details.push(
    ["label", "Hash"],
    ["button", {disabled:true}, commit.hash]);

  return domBuilder(body);

  function prevent(evt) {
    evt.preventDefault();
  }

  function enter() {
    repo.loadAs("tree", commit.tree, function (err, tree) {
      if (err) return ui.error(err);
      ui.push(filesList(repo, tree));
    });
  }

  function ascend(parent) {
    return function () {
      repo.loadAs("commit", parent, function (err, commit) {
        if (err) return ui.error(err);
        ui.peer(commitPage(repo, commit));
      });
    };
  }
}

function filesList(repo, tree) {
  return domBuilder(["section.page",
    ["header",
      ["button.back", {onclick: ui.pop}, [".icon-left-open"]],
      ["h1", repo.name]
    ],
    ["ul.content.header", tree.map(function (file) {
      var icon = ".icon.left.icon-";
      var action;
      if (file.mode === 16384) {
        icon += "folder-empty";
        action = enterFolder;
      }
      else if (isImage.test(file.name)) {
        icon += "picture";
        action = loadImage;
      }
      else if (isText.test(file.name)) {
        icon += "doc-text";
        action = loadText;
      }
      else {
        var names = Object.keys(modes);
        for (var i = 0, l = names.length; i < l; ++i) {
          var name = names[i];
          var regexp = modes[name];
          if (regexp.test(file.name)) {
            icon += "doc-text";
            action = loadCode.bind(null, name);
            break;
          }
        }
      }
      if (!action) {
        icon += "doc";
        action = load;
      }
      return ["li", { href:"#", onclick: onclick(action, file) },
        [icon],
        (file.mode === 16384 ? [".icon.right.icon-right-open"] : []),
        ["p", file.name],
        ["p", file.hash]
      ];
    })]
  ]);

  function enterFolder(file) {
    return repo.loadAs("tree", file.hash, function (err, tree) {
      if (err) return ui.error(err);
      ui.push(filesList(repo, tree));
    });
  }

  function loadImage(file) {
    return repo.loadAs("blob", file.hash, function (err, blob) {
      if (err) return ui.error(err);
      ui.push(imagePage(file.name, blob));
    });
  }

  function loadCode(language, file) {
    return repo.loadAs("blob", file.hash, function (err, blob) {
      if (err) return ui.error(err);
      ui.push(codePage(file.name, blob, language));
    });
  }

  function loadText(file) {
    return repo.loadAs("blob", file.hash, function (err, blob) {
      if (err) return ui.error(err);
      ui.push(textPage(file.name, blob));
    });
  }

  function load(file) {
    console.log("TODO: load file");
  }
}

function codePage(filename, blob, language) {
  var code = "";
  for (var i = 0, l = blob.length; i < l; ++i) {
    code += String.fromCharCode(blob[i]);
  }
  var body = prism.parse(code, language);
  body[0] += ".content.header";

  return domBuilder(["section.page",
    ["header",
      ["button.back", {onclick: ui.pop}, [".icon-left-open"]],
      ["h1", filename]
    ],
    body
  ]);
}

function textPage(filename, blob) {
  var text = "";
  for (var i = 0, l = blob.length; i < l; ++i) {
    text += String.fromCharCode(blob[i]);
  }
  return domBuilder(["section.page",
    ["header",
      ["button.back", {onclick: ui.pop}, [".icon-left-open"]],
      ["h1", filename]
    ],
    ["pre.content.header", {css: {
      padding: "1rem",
      whiteSpace:"pre-wrap"
    }},
      ["code", text]
    ]
  ]);
}

function imagePage(filename, blob) {
  blob = new Blob([blob]);
  var url = window.URL.createObjectURL(blob);
  return domBuilder(["section.page",
    ["header",
      ["button.back", {onclick: ui.pop}, [".icon-left-open"]],
      ["h1", filename],
    ],
    [".content.header", {css:{
      backgroundImage: "url(" + url + ")",
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center"
    }}]
  ]);
}


function truncate(message, limit) {
  var title = message.split(/[\r\n]/)[0];
  if (title.length > limit) title = title.substr(0, limit - 3) + "...";
  return title;
}



function onclick(handler) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    return handler.apply(this, args);
  };
}
};

defs["node_modules/dombuilder/dombuilder.js"] = function (module, exports) {
//////////////////////////////////////
//                                  //
// JS domBuilder Library            //
//                                  //
// Tim Caswell <tim@creationix.com> //
//                                  //
//////////////////////////////////////

( // Module boilerplate to support component, browser globals and AMD.
  (typeof module !== "undefined" && function (m) { module.exports = m(); }) ||
  (typeof define === "function" && function (m) { define("dombuilder", m); }) ||
  (function (m) { window.domBuilder = m(); })
)(function () {
"use strict";

function domBuilder(json, refs) {

  // Render strings as text nodes
  if (typeof json === 'string') return document.createTextNode(json);

  // Pass through html elements and text nodes as-is
  if (json instanceof HTMLElement || json instanceof Text) return json;

  // Stringify any other value types
  if (!Array.isArray(json)) return document.createTextNode(json + "");

  // Empty arrays are just empty fragments.
  if (!json.length) return document.createDocumentFragment();

  var node, first;
  for (var i = 0, l = json.length; i < l; i++) {
    var part = json[i];

    if (!node) {
      if (typeof part === 'string') {
        // Create a new dom node by parsing the tagline
        var tag = part.match(TAG_MATCH);
        tag = tag ? tag[0] : "div";
        node = document.createElement(tag);
        first = true;
        var classes = part.match(CLASS_MATCH);
        if (classes) node.setAttribute('class', classes.map(stripFirst).join(' '));
        var id = part.match(ID_MATCH);
        if (id) node.setAttribute('id', id[0].substr(1));
        var ref = part.match(REF_MATCH);
        if (refs && ref) refs[ref[0].substr(1)] = node;
        continue;
      } else {
        node = document.createDocumentFragment();
      }
    }

    // Except the first item if it's an attribute object
    if (first && typeof part === 'object' && part.__proto__ === Object.prototype) {
      setAttrs(node, part);
    } else {
      node.appendChild(domBuilder(part, refs));
    }
    first = false;
  }
  return node;
};

function setAttrs(node, attrs) {
  var keys = Object.keys(attrs);
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    var value = attrs[key];
    if (key === "$") {
      value(node);
    } else if (key === "css") {
      setStyle(node.style, value);
    } else if (key.substr(0, 2) === "on") {
      node.addEventListener(key.substr(2), value, false);
    } else {
      node.setAttribute(key, value);
    }
  }
}

function setStyle(style, attrs) {
  var keys = Object.keys(attrs);
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    style[key] = attrs[key];
  }
}

var CLASS_MATCH = /\.[^.#$]+/g,
    ID_MATCH = /#[^.#$]+/,
    REF_MATCH = /\$[^.#$]+/,
    TAG_MATCH = /^[^.#$]+/;

function stripFirst(part) {
  return part.substr(1);
}

return domBuilder;

});
};

defs["src/lib/progress-parser.js"] = function (module, exports) {
var progMatch = /^([^:]*):[^\(]*\(([0-9]+)\/([0-9]+)\)/;
var progMatchBasic = /^([^:]*)/;
module.exports = progressParser;
function progressParser(emit) {
  var buffer = "";
  return function (chunk) {
    var start = 0;
    for (var i = 0, l = chunk.length; i < l; ++i) {
      var c = chunk[i];
      if (c === "\r" || c === "\n") {
        buffer += chunk.substr(start, i);
        start = i + 1;
        var match = buffer.match(progMatch) ||
                    buffer.match(progMatchBasic);
        buffer = "";
        if (!match) continue;
        emit(match[1], parseInt(match[2], 10), parseInt(match[3], 10));
      }
    }
    buffer += chunk.substr(start);
  };
}
};

defs["src/app/ui.js"] = function (module, exports) {
exports.push = push;
exports.pop = pop;
exports.peer = peer;
exports.error = error;
exports.confirm = confirm;

document.body.textContent = "";
var pages = [];

function push(next) {
  next.addEventListener("animationend", onAnimationEnd, false);
  next.addEventListener("webkitAnimationEnd", onAnimationEnd, false);

  var current = pages.length && pages[pages.length - 1];
  if (current) {
    current.classList.remove("current");
    current.classList.add("left");
  }
  pages.push(next);
  if (!next.getAttribute("data-position")) {
    next.setAttribute("data-position", "right");
  }
  next.classList.remove("right");
  next.classList.add("current");
  document.body.appendChild(next);
}

function pop() {
  if (!pages.length) return;
  var current = pages.pop();
  var previous = pages.length && pages[pages.length - 1];
  current.classList.remove("current");
  current.classList.remove("current");
  current.classList.add("right");
  if (previous) {
    previous.classList.remove("left");
    previous.classList.add("current");
  }
  setTimeout(function () {
    document.body.removeChild(current);
  }, 400);
}

function onAnimationEnd(evt) {
  var page = evt.target;
  var classList = page.classList;
  if (classList.contains("current")) {
    page.setAttribute("data-position", "current");
  }
  else if (classList.contains("left")) {
    page.setAttribute("data-position", "left");
  }
}

function peer(next) {
  // TODO: make this prettier
  pop();
  push(next);
}

function error(err) {
  setImmediate(function () {
    alert(err);
  });
  throw err;
}

function confirm(message, callback) {
  callback(window.confirm(message));
}
};

defs["src/prism/prism-core.js"] = function (module, exports) {
/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

// Private helper vars
var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;

var _ = module.exports = {
	util: {
		type: function (o) {
			return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
		},

		// Deep clone a language definition (e.g. to extend it)
		clone: function (o) {
			var type = _.util.type(o);

			switch (type) {
				case 'Object':
					var clone = {};

					for (var key in o) {
						if (o.hasOwnProperty(key)) {
							clone[key] = _.util.clone(o[key]);
						}
					}

					return clone;

				case 'Array':
					return o.slice();
			}

			return o;
		}
	},

	languages: {
		extend: function (id, redef) {
			var lang = _.util.clone(_.languages[id]);

			for (var key in redef) {
				lang[key] = redef[key];
			}

			return lang;
		},

		// Insert a token before another token in a language literal
		insertBefore: function (inside, before, insert, root) {
			root = root || _.languages;
			var grammar = root[inside];
			var ret = {};

			for (var token in grammar) {

				if (grammar.hasOwnProperty(token)) {

					if (token == before) {

						for (var newToken in insert) {

							if (insert.hasOwnProperty(newToken)) {
								ret[newToken] = insert[newToken];
							}
						}
					}

					ret[token] = grammar[token];
				}
			}

			return root[inside] = ret;
		},

		// Traverse a language definition with Depth First Search
		DFS: function(o, callback) {
			for (var i in o) {
				callback.call(o, i, o[i]);

				if (_.util.type(o) === 'Object') {
					_.languages.DFS(o[i], callback);
				}
			}
		}
	},

	parse: function (text, language) {
		var grammar = _.languages[language];
		if (!grammar) {
			return ["code", text];
		}
		var tokens = _.tokenize(text, grammar);
		return ["pre.language-" + language,
			["code.language-" + language,
				["span.token.script", _.Token.toJson(tokens)]
			]
		];
	},

	tokenize: function(text, grammar) {
		var Token = _.Token;

		var strarr = [text];

		var rest = grammar.rest;

		if (rest) {
			for (var token in rest) {
				grammar[token] = rest[token];
			}

			delete grammar.rest;
		}

		tokenloop: for (var token in grammar) {
			if(!grammar.hasOwnProperty(token) || !grammar[token]) {
				continue;
			}

			var pattern = grammar[token],
				inside = pattern.inside,
				lookbehind = !!pattern.lookbehind,
				lookbehindLength = 0;

			pattern = pattern.pattern || pattern;

			for (var i=0; i<strarr.length; i++) { // Don’t cache length as it changes during the loop

				var str = strarr[i];

				if (strarr.length > text.length) {
					// Something went terribly wrong, ABORT, ABORT!
					break tokenloop;
				}

				if (str instanceof Token) {
					continue;
				}

				pattern.lastIndex = 0;

				var match = pattern.exec(str);

				if (match) {
					if(lookbehind) {
						lookbehindLength = match[1].length;
					}

					var from = match.index - 1 + lookbehindLength,
					    match = match[0].slice(lookbehindLength),
					    len = match.length,
					    to = from + len,
						before = str.slice(0, from + 1),
						after = str.slice(to + 1);

					var args = [i, 1];

					if (before) {
						args.push(before);
					}

					var wrapped = new Token(token, inside? _.tokenize(match, inside) : match);

					args.push(wrapped);

					if (after) {
						args.push(after);
					}

					Array.prototype.splice.apply(strarr, args);
				}
			}
		}

		return strarr;
	},

	hooks: {
		all: {},

		add: function (name, callback) {
			var hooks = _.hooks.all;

			hooks[name] = hooks[name] || [];

			hooks[name].push(callback);
		},

		run: function (name, env) {
			var callbacks = _.hooks.all[name];

			if (!callbacks || !callbacks.length) {
				return;
			}

			for (var i=0, callback; callback = callbacks[i++];) {
				callback(env);
			}
		}
	}
};

var Token = _.Token = function(type, content) {
	this.type = type;
	this.content = content;
};

Token.toJson = function(o, language, parent) {
	if (typeof o == 'string') {
		return o;
	}

	if (Array.isArray(o) && typeof o[0] !== "string") {
		return o.map(function(element) {
			return Token.toJson(element, language, o);
		});
	}

	var env = {
		type: o.type,
		content: o.content && Token.toJson(o.content, language, parent),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {},
		language: language,
		parent: parent
	};

	if (env.type == 'comment') {
		env.attributes['spellcheck'] = 'true';
	}

	_.hooks.run('wrap', env);

	if (env.classes.length) {
		env.tag += "." + env.classes.join(".");
	}
	var element = [env.tag];

	var attr = {};
	var has = false;

	for (var name in env.attributes) {
		has = true;
		attr[name] = env.attributes[name] || '';
	}
	if (has) element.push(attr);

	if (env.content) element.push(env.content);
	return element;

};
};

defs["src/prism/prism-javascript.js"] = function (module, exports) {
var Prism = require('src/prism/prism-core.js');
require('src/prism/prism-clike.js');

Prism.languages.javascript = Prism.languages.extend('clike', {
	'keyword': /\b(var|let|if|else|while|do|for|return|in|instanceof|function|new|with|typeof|try|throw|catch|finally|null|break|continue)\b/g,
	'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?|NaN|-?Infinity)\b/g
});

Prism.languages.insertBefore('javascript', 'keyword', {
	'regex': {
		pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/g,
		lookbehind: true
	}
});

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'script': {
			pattern: /(&lt;|<)script[\w\W]*?(>|&gt;)[\w\W]*?(&lt;|<)\/script(>|&gt;)/ig,
			inside: {
				'tag': {
					pattern: /(&lt;|<)script[\w\W]*?(>|&gt;)|(&lt;|<)\/script(>|&gt;)/ig,
					inside: Prism.languages.markup.tag.inside
				},
				rest: Prism.languages.javascript
			}
		}
	});
}
};

defs["src/prism/prism-clike.js"] = function (module, exports) {
var Prism = require('src/prism/prism-core.js');

Prism.languages.clike = {
	'comment': {
		pattern: /(^|[^\\])(\/\*[\w\W]*?\*\/|(^|[^:])\/\/.*?(\r?\n|$))/g,
		lookbehind: true
	},
	'string': /("|')(\\?.)*?\1/g,
	'class-name': {
		pattern: /((?:(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/ig,
		lookbehind: true,
		inside: {
			punctuation: /(\.|\\)/
		}
	},
	'keyword': /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/g,
	'boolean': /\b(true|false)\b/g,
	'function': {
		pattern: /[a-z0-9_]+\(/ig,
		inside: {
			punctuation: /\(/
		}
	},
	'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g,
	'operator': /[-+]{1,2}|!|&lt;=?|>=?|={1,3}|(&amp;){1,2}|\|?\||\?|\*|\/|\~|\^|\%/g,
	'ignore': /&(lt|gt|amp);/gi,
	'punctuation': /[{}[\];(),.:]/g
};
};

defs["src/prism/prism-c.js"] = function (module, exports) {
var Prism = require('src/prism/prism-core.js');
require('src/prism/prism-clike.js');

Prism.languages.c = Prism.languages.extend('clike', {
	'keyword': /\b(asm|typeof|inline|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while)\b/g,
	'operator': /[-+]{1,2}|!=?|&lt;{1,2}=?|&gt;{1,2}=?|\-&gt;|={1,2}|\^|~|%|(&amp;){1,2}|\|?\||\?|\*|\//g
});

Prism.languages.insertBefore('c', 'keyword', {
	//property class reused for macro statements
	'property': /#\s*[a-zA-Z]+/g
});
};

defs["src/prism/prism-bash.js"] = function (module, exports) {
var Prism = require('src/prism/prism-core.js');
require('src/prism/prism-clike.js');

Prism.languages.bash = Prism.languages.extend('clike', {
	'comment': {
		pattern: /(^|[^"{\\])(#.*?(\r?\n|$))/g,
		lookbehind: true
	},
	'string': {
		//allow multiline string
		pattern: /("|')(\\?[\s\S])*?\1/g,
		inside: {
			//'property' class reused for bash variables
			'property': /\$([a-zA-Z0-9_#\?\-\*!@]+|\{[^\}]+\})/g
		}
	},
	'keyword': /\b(if|then|else|elif|fi|for|break|continue|while|in|case|function|select|do|done|until|echo|exit|return|set|declare)\b/g
});

Prism.languages.insertBefore('bash', 'keyword', {
	//'property' class reused for bash variables
	'property': /\$([a-zA-Z0-9_#\?\-\*!@]+|\{[^}]+\})/g
});
Prism.languages.insertBefore('bash', 'comment', {
	//shebang must be before comment, 'important' class from css reused
	'important': /(^#!\s*\/bin\/bash)|(^#!\s*\/bin\/sh)/g
});
};

defs["src/prism/prism-coffeescript.js"] = function (module, exports) {
var Prism = require('src/prism/prism-core.js');
require('src/prism/prism-javascript.js');

Prism.languages.coffeescript = Prism.languages.extend('javascript', {
	'block-comment': /([#]{3}\s*\r?\n(.*\s*\r*\n*)\s*?\r?\n[#]{3})/g,
	'comment': /(\s|^)([#]{1}[^#^\r^\n]{2,}?(\r?\n|$))/g,
	'keyword': /\b(this|window|delete|class|extends|namespace|extend|ar|let|if|else|while|do|for|each|of|return|in|instanceof|new|with|typeof|try|catch|finally|null|undefined|break|continue)\b/g
});

Prism.languages.insertBefore('coffeescript', 'keyword', {
	'function': {
		pattern: /[a-z|A-z]+\s*[:|=]\s*(\([.|a-z\s|,|:|{|}|\"|\'|=]*\))?\s*-&gt;/gi,
		inside: {
			'function-name': /[_?a-z-|A-Z-]+(\s*[:|=])| @[_?$?a-z-|A-Z-]+(\s*)| /g,
			'operator': /[-+]{1,2}|!|=?&lt;|=?&gt;|={1,2}|(&amp;){1,2}|\|?\||\?|\*|\//g
		}
	},
	'attr-name': /[_?a-z-|A-Z-]+(\s*:)| @[_?$?a-z-|A-Z-]+(\s*)| /g
});
};

defs["src/prism/prism-cpp.js"] = function (module, exports) {
var Prism = require('src/prism/prism-core.js');
require('src/prism/prism-c.js');

Prism.languages.cpp = Prism.languages.extend('c', {
	'keyword': /\b(alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|class|compl|const|constexpr|const_cast|continue|decltype|default|delete|delete\[\]|do|double|dynamic_cast|else|enum|explicit|export|extern|float|for|friend|goto|if|inline|int|long|mutable|namespace|new|new\[\]|noexcept|nullptr|operator|private|protected|public|register|reinterpret_cast|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/g,
	'operator': /[-+]{1,2}|!=?|&lt;{1,2}=?|&gt;{1,2}=?|\-&gt;|:{1,2}|={1,2}|\^|~|%|(&amp;){1,2}|\|?\||\?|\*|\/|\b(and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/g
});
};

defs["src/prism/prism-css-extras.js"] = function (module, exports) {
var Prism = require('src/prism/prism-core.js');
require('src/prism/prism-css.js');

Prism.languages.css.selector = {
	pattern: /[^\{\}\s][^\{\}]*(?=\s*\{)/g,
	inside: {
		'pseudo-element': /:(?:after|before|first-letter|first-line|selection)|::[-\w]+/g,
		'pseudo-class': /:[-\w]+(?:\(.*\))?/g,
		'class': /\.[-:\.\w]+/g,
		'id': /#[-:\.\w]+/g
	}
};

Prism.languages.insertBefore('css', 'ignore', {
	'hexcode': /#[\da-f]{3,6}/gi,
	'entity': /\\[\da-f]{1,8}/gi,
	'number': /[\d%\.]+/g,
	'function': /(attr|calc|cross-fade|cycle|element|hsla?|image|lang|linear-gradient|matrix3d|matrix|perspective|radial-gradient|repeating-linear-gradient|repeating-radial-gradient|rgba?|rotatex|rotatey|rotatez|rotate3d|rotate|scalex|scaley|scalez|scale3d|scale|skewx|skewy|skew|steps|translatex|translatey|translatez|translate3d|translate|url|var)/ig
});
};

defs["src/prism/prism-css.js"] = function (module, exports) {
var Prism = require('src/prism/prism-core.js');
require('src/prism/prism-markup.js');

Prism.languages.css = {
	'comment': /\/\*[\w\W]*?\*\//g,
	'atrule': {
		pattern: /@[\w-]+?.*?(;|(?=\s*{))/gi,
		inside: {
			'punctuation': /[;:]/g
		}
	},
	'url': /url\((["']?).*?\1\)/gi,
	'selector': /[^\{\}\s][^\{\};]*(?=\s*\{)/g,
	'property': /(\b|\B)[\w-]+(?=\s*:)/ig,
	'string': /("|')(\\?.)*?\1/g,
	'important': /\B!important\b/gi,
	'ignore': /&(lt|gt|amp);/gi,
	'punctuation': /[\{\};:]/g
};

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'style': {
			pattern: /(&lt;|<)style[\w\W]*?(>|&gt;)[\w\W]*?(&lt;|<)\/style(>|&gt;)/ig,
			inside: {
				'tag': {
					pattern: /(&lt;|<)style[\w\W]*?(>|&gt;)|(&lt;|<)\/style(>|&gt;)/ig,
					inside: Prism.languages.markup.tag.inside
				},
				rest: Prism.languages.css
			}
		}
	});
}
};

defs["src/prism/prism-markup.js"] = function (module, exports) {
var Prism = require('src/prism/prism-core.js');

Prism.languages.markup = {
	'comment': /&lt;!--[\w\W]*?-->/g,
	'prolog': /&lt;\?.+?\?>/,
	'doctype': /&lt;!DOCTYPE.+?>/,
	'cdata': /&lt;!\[CDATA\[[\w\W]*?]]>/i,
	'tag': {
		pattern: /&lt;\/?[\w:-]+\s*(?:\s+[\w:-]+(?:=(?:("|')(\\?[\w\W])*?\1|\w+))?\s*)*\/?>/gi,
		inside: {
			'tag': {
				pattern: /^&lt;\/?[\w:-]+/i,
				inside: {
					'punctuation': /^&lt;\/?/,
					'namespace': /^[\w-]+?:/
				}
			},
			'attr-value': {
				pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/gi,
				inside: {
					'punctuation': /=|>|"/g
				}
			},
			'punctuation': /\/?>/g,
			'attr-name': {
				pattern: /[\w:-]+/g,
				inside: {
					'namespace': /^[\w-]+?:/
				}
			}

		}
	},
	'entity': /&amp;#?[\da-z]{1,8};/gi
};

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function(env) {

	if (env.type === 'entity') {
		env.attributes['title'] = env.content.replace(/&amp;/, '&');
	}
});
};

var realRequire = typeof require === 'undefined' ? null : require;

require = function require(name) {
  if (name in modules) return modules[name];
  if (!(name in defs)) {
    if (realRequire) return realRequire(name);
    throw new Error("Missing module: " + name);
  }
  var exports = modules[name] = {};
  var module = { exports: exports };
  var def = defs[name];
  def(module, exports);
  exports = modules[name] = module.exports;
  return exports;
}

require("src/web.js");