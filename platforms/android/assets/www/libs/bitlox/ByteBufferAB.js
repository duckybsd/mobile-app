
/*
 ByteBuffer.js (c) 2013-2014 Daniel Wirtz <dcode@dcode.io>
 This version of ByteBuffer.js uses an ArrayBuffer (AB) as its backing buffer and is compatible with modern browsers.
 Released under the Apache License, Version 2.0
 see: https://github.com/dcodeIO/ByteBuffer.js for details
*/
(function(s) {
    function u(k) {
        function g(a, b, c) {
            "undefined" === typeof a && (a = g.DEFAULT_CAPACITY);
            "undefined" === typeof b && (b = g.DEFAULT_ENDIAN);
            "undefined" === typeof c && (c = g.DEFAULT_NOASSERT);
            if (!c) {
                a |= 0;
                if (0 > a) throw RangeError("Illegal capacity");
                b = !!b;
                c = !!c
            }
            this.buffer = 0 === a ? s : new ArrayBuffer(a);
            this.view = 0 === a ? null : new DataView(this.buffer);
            this.offset = 0;
            this.markedOffset = -1;
            this.limit = a;
            this.littleEndian = "undefined" !== typeof b ? !!b : !1;
            this.noAssert = !!c
        }

        function m(a) {
            var b = 0;
            return function() {
                return b <
                    a.length ? a.charCodeAt(b++) : null
            }
        }

        function t() {
            var a = [],
                b = [];
            return function() {
                if (0 === arguments.length) return b.join("") + u.apply(String, a);
                1024 < a.length + arguments.length && (b.push(u.apply(String, a)), a.length = 0);
                Array.prototype.push.apply(a, arguments)
            }
        }
        g.VERSION = "3.5.4";
        g.LITTLE_ENDIAN = !0;
        g.BIG_ENDIAN = !1;
        g.DEFAULT_CAPACITY = 16;
        g.DEFAULT_ENDIAN = g.BIG_ENDIAN;
        g.DEFAULT_NOASSERT = !1;
        g.Long = k || null;
        var e = g.prototype,
            s = new ArrayBuffer(0),
            u = String.fromCharCode;
        g.allocate = function(a, b, c) {
            return new g(a, b, c)
        };
        g.concat = function(a, b, c, d) {
            if ("boolean" === typeof b || "string" !== typeof b) d = c, c = b, b = void 0;
            for (var f = 0, n = 0, h = a.length, e; n < h; ++n) g.isByteBuffer(a[n]) || (a[n] = g.wrap(a[n], b)), e = a[n].limit - a[n].offset, 0 < e && (f += e);
            if (0 === f) return new g(0, c, d);
            b = new g(f, c, d);
            d = new Uint8Array(b.buffer);
            for (n = 0; n < h;) c = a[n++], e = c.limit - c.offset, 0 >= e || (d.set((new Uint8Array(c.buffer)).subarray(c.offset, c.limit), b.offset), b.offset += e);
            b.limit = b.offset;
            b.offset = 0;
            return b
        };
        g.isByteBuffer = function(a) {
            return !0 === (a && a instanceof g)
        };
        g.type = function() {
            return ArrayBuffer
        };
        g.wrap = function(a, b, c, d) {
            "string" !== typeof b && (d = c, c = b, b = void 0);
            if ("string" === typeof a) switch ("undefined" === typeof b && (b = "utf8"), b) {
                case "base64":
                    return g.fromBase64(a, c);
                case "hex":
                    return g.fromHex(a, c);
                case "binary":
                    return g.fromBinary(a, c);
                case "utf8":
                    return g.fromUTF8(a, c);
                case "debug":
                    return g.fromDebug(a, c);
                default:
                    throw Error("Unsupported encoding: " + b);
            }
            if (null === a || "object" !== typeof a) throw TypeError("Illegal buffer");
            if (g.isByteBuffer(a)) return b =
                e.clone.call(a), b.markedOffset = -1, b;
            if (a instanceof Uint8Array) b = new g(0, c, d), 0 < a.length && (b.buffer = a.buffer, b.offset = a.byteOffset, b.limit = a.byteOffset + a.length, b.view = 0 < a.length ? new DataView(a.buffer) : null);
            else if (a instanceof ArrayBuffer) b = new g(0, c, d), 0 < a.byteLength && (b.buffer = a, b.offset = 0, b.limit = a.byteLength, b.view = 0 < a.byteLength ? new DataView(a) : null);
            else if ("[object Array]" === Object.prototype.toString.call(a))
                for (b = new g(a.length, c, d), b.limit = a.length, i = 0; i < a.length; ++i) b.view.setUint8(i,
                    a[i]);
            else throw TypeError("Illegal buffer");
            return b
        };
        e.writeInt8 = function(a, b) {
            var c = "undefined" === typeof b;
            c && (b = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " + a + " (not an integer)");
                a |= 0;
                if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
            }
            b += 1;
            var d = this.buffer.byteLength;
            b > d && this.resize((d *=
                2) > b ? d : b);
            this.view.setInt8(b - 1, a);
            c && (this.offset += 1);
            return this
        };
        e.writeByte = e.writeInt8;
        e.readInt8 = function(a) {
            var b = "undefined" === typeof a;
            b && (a = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
                a >>>= 0;
                if (0 > a || a + 1 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+1) <= " + this.buffer.byteLength);
            }
            a = this.view.getInt8(a);
            b && (this.offset += 1);
            return a
        };
        e.readByte = e.readInt8;
        e.writeUint8 = function(a, b) {
            var c =
                "undefined" === typeof b;
            c && (b = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " + a + " (not an integer)");
                a >>>= 0;
                if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
            }
            b += 1;
            var d = this.buffer.byteLength;
            b > d && this.resize((d *= 2) > b ? d : b);
            this.view.setUint8(b - 1, a);
            c && (this.offset += 1);
            return this
        };
        e.readUint8 =
            function(a) {
                var b = "undefined" === typeof a;
                b && (a = this.offset);
                if (!this.noAssert) {
                    if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
                    a >>>= 0;
                    if (0 > a || a + 1 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+1) <= " + this.buffer.byteLength);
                }
                a = this.view.getUint8(a);
                b && (this.offset += 1);
                return a
            };
        e.writeInt16 = function(a, b) {
            var c = "undefined" === typeof b;
            c && (b = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " +
                    a + " (not an integer)");
                a |= 0;
                if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
            }
            b += 2;
            var d = this.buffer.byteLength;
            b > d && this.resize((d *= 2) > b ? d : b);
            this.view.setInt16(b - 2, a, this.littleEndian);
            c && (this.offset += 2);
            return this
        };
        e.writeShort = e.writeInt16;
        e.readInt16 = function(a) {
            var b = "undefined" === typeof a;
            b && (a = this.offset);
            if (!this.noAssert) {
                if ("number" !==
                    typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
                a >>>= 0;
                if (0 > a || a + 2 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+2) <= " + this.buffer.byteLength);
            }
            a = this.view.getInt16(a, this.littleEndian);
            b && (this.offset += 2);
            return a
        };
        e.readShort = e.readInt16;
        e.writeUint16 = function(a, b) {
            var c = "undefined" === typeof b;
            c && (b = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " + a + " (not an integer)");
                a >>>= 0;
                if ("number" !== typeof b ||
                    0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
            }
            b += 2;
            var d = this.buffer.byteLength;
            b > d && this.resize((d *= 2) > b ? d : b);
            this.view.setUint16(b - 2, a, this.littleEndian);
            c && (this.offset += 2);
            return this
        };
        e.readUint16 = function(a) {
            var b = "undefined" === typeof a;
            b && (a = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
                a >>>= 0;
                if (0 > a || a + 2 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+2) <= " + this.buffer.byteLength);
            }
            a = this.view.getUint16(a, this.littleEndian);
            b && (this.offset += 2);
            return a
        };
        e.writeInt32 = function(a, b) {
            var c = "undefined" === typeof b;
            c && (b = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " + a + " (not an integer)");
                a |= 0;
                if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " +
                    b + " (+0) <= " + this.buffer.byteLength);
            }
            b += 4;
            var d = this.buffer.byteLength;
            b > d && this.resize((d *= 2) > b ? d : b);
            this.view.setInt32(b - 4, a, this.littleEndian);
            c && (this.offset += 4);
            return this
        };
        e.writeInt = e.writeInt32;
        e.readInt32 = function(a) {
            var b = "undefined" === typeof a;
            b && (a = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
                a >>>= 0;
                if (0 > a || a + 4 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+4) <= " + this.buffer.byteLength);
            }
            a = this.view.getInt32(a, this.littleEndian);
            b && (this.offset += 4);
            return a
        };
        e.readInt = e.readInt32;
        e.writeUint32 = function(a, b) {
            var c = "undefined" === typeof b;
            c && (b = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " + a + " (not an integer)");
                a >>>= 0;
                if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
            }
            b +=
                4;
            var d = this.buffer.byteLength;
            b > d && this.resize((d *= 2) > b ? d : b);
            this.view.setUint32(b - 4, a, this.littleEndian);
            c && (this.offset += 4);
            return this
        };
        e.readUint32 = function(a) {
            var b = "undefined" === typeof a;
            b && (a = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
                a >>>= 0;
                if (0 > a || a + 4 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+4) <= " + this.buffer.byteLength);
            }
            a = this.view.getUint32(a, this.littleEndian);
            b && (this.offset +=
                4);
            return a
        };
        k && (e.writeInt64 = function(a, b) {
            var c = "undefined" === typeof b;
            c && (b = this.offset);
            if (!this.noAssert) {
                if ("number" === typeof a) a = k.fromNumber(a);
                else if (!(a && a instanceof k)) throw TypeError("Illegal value: " + a + " (not an integer or Long)");
                if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
            }
            "number" === typeof a && (a = k.fromNumber(a));
            b +=
                8;
            var d = this.buffer.byteLength;
            b > d && this.resize((d *= 2) > b ? d : b);
            b -= 8;
            this.littleEndian ? (this.view.setInt32(b, a.low, !0), this.view.setInt32(b + 4, a.high, !0)) : (this.view.setInt32(b, a.high, !1), this.view.setInt32(b + 4, a.low, !1));
            c && (this.offset += 8);
            return this
        }, e.writeLong = e.writeInt64, e.readInt64 = function(a) {
            var b = "undefined" === typeof a;
            b && (a = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
                a >>>= 0;
                if (0 > a || a + 8 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " +
                    a + " (+8) <= " + this.buffer.byteLength);
            }
            a = this.littleEndian ? new k(this.view.getInt32(a, !0), this.view.getInt32(a + 4, !0), !1) : new k(this.view.getInt32(a + 4, !1), this.view.getInt32(a, !1), !1);
            b && (this.offset += 8);
            return a
        }, e.readLong = e.readInt64, e.writeUint64 = function(a, b) {
            var c = "undefined" === typeof b;
            c && (b = this.offset);
            if (!this.noAssert) {
                if ("number" === typeof a) a = k.fromNumber(a);
                else if (!(a && a instanceof k)) throw TypeError("Illegal value: " + a + " (not an integer or Long)");
                if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " +
                    b + " (not an integer)");
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
            }
            "number" === typeof a && (a = k.fromNumber(a));
            b += 8;
            var d = this.buffer.byteLength;
            b > d && this.resize((d *= 2) > b ? d : b);
            b -= 8;
            this.littleEndian ? (this.view.setInt32(b, a.low, !0), this.view.setInt32(b + 4, a.high, !0)) : (this.view.setInt32(b, a.high, !1), this.view.setInt32(b + 4, a.low, !1));
            c && (this.offset += 8);
            return this
        }, e.readUint64 = function(a) {
            var b = "undefined" === typeof a;
            b && (a =
                this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
                a >>>= 0;
                if (0 > a || a + 8 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+8) <= " + this.buffer.byteLength);
            }
            a = this.littleEndian ? new k(this.view.getInt32(a, !0), this.view.getInt32(a + 4, !0), !0) : new k(this.view.getInt32(a + 4, !1), this.view.getInt32(a, !1), !0);
            b && (this.offset += 8);
            return a
        });
        e.writeFloat32 = function(a, b) {
            var c = "undefined" === typeof b;
            c && (b = this.offset);
            if (!this.noAssert) {
                if ("number" !==
                    typeof a) throw TypeError("Illegal value: " + a + " (not a number)");
                if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
            }
            b += 4;
            var d = this.buffer.byteLength;
            b > d && this.resize((d *= 2) > b ? d : b);
            this.view.setFloat32(b - 4, a, this.littleEndian);
            c && (this.offset += 4);
            return this
        };
        e.writeFloat = e.writeFloat32;
        e.readFloat32 = function(a) {
            var b = "undefined" === typeof a;
            b && (a = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
                a >>>= 0;
                if (0 > a || a + 4 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+4) <= " + this.buffer.byteLength);
            }
            a = this.view.getFloat32(a, this.littleEndian);
            b && (this.offset += 4);
            return a
        };
        e.readFloat = e.readFloat32;
        e.writeFloat64 = function(a, b) {
            var c = "undefined" === typeof b;
            c && (b = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a) throw TypeError("Illegal value: " +
                    a + " (not a number)");
                if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
            }
            b += 8;
            var d = this.buffer.byteLength;
            b > d && this.resize((d *= 2) > b ? d : b);
            this.view.setFloat64(b - 8, a, this.littleEndian);
            c && (this.offset += 8);
            return this
        };
        e.writeDouble = e.writeFloat64;
        e.readFloat64 = function(a) {
            var b = "undefined" === typeof a;
            b && (a = this.offset);
            if (!this.noAssert) {
                if ("number" !==
                    typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
                a >>>= 0;
                if (0 > a || a + 8 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+8) <= " + this.buffer.byteLength);
            }
            a = this.view.getFloat64(a, this.littleEndian);
            b && (this.offset += 8);
            return a
        };
        e.readDouble = e.readFloat64;
        g.MAX_VARINT32_BYTES = 5;
        g.calculateVarint32 = function(a) {
            a >>>= 0;
            return 128 > a ? 1 : 16384 > a ? 2 : 2097152 > a ? 3 : 268435456 > a ? 4 : 5
        };
        g.zigZagEncode32 = function(a) {
            return ((a |= 0) << 1 ^ a >> 31) >>> 0
        };
        g.zigZagDecode32 = function(a) {
            return a >>>
                1 ^ -(a & 1) | 0
        };
        e.writeVarint32 = function(a, b) {
            var c = "undefined" === typeof b;
            c && (b = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " + a + " (not an integer)");
                a |= 0;
                if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
            }
            var d = g.calculateVarint32(a);
            b += d;
            var f = this.buffer.byteLength;
            b > f && this.resize((f *= 2) >
                b ? f : b);
            b -= d;
            this.view.setUint8(b, d = a | 128);
            a >>>= 0;
            128 <= a ? (d = a >> 7 | 128, this.view.setUint8(b + 1, d), 16384 <= a ? (d = a >> 14 | 128, this.view.setUint8(b + 2, d), 2097152 <= a ? (d = a >> 21 | 128, this.view.setUint8(b + 3, d), 268435456 <= a ? (this.view.setUint8(b + 4, a >> 28 & 15), d = 5) : (this.view.setUint8(b + 3, d & 127), d = 4)) : (this.view.setUint8(b + 2, d & 127), d = 3)) : (this.view.setUint8(b + 1, d & 127), d = 2)) : (this.view.setUint8(b, d & 127), d = 1);
            return c ? (this.offset += d, this) : d
        };
        e.writeVarint32ZigZag = function(a, b) {
            return this.writeVarint32(g.zigZagEncode32(a),
                b)
        };
        e.readVarint32 = function(a) {
            var b = "undefined" === typeof a;
            b && (a = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
                a >>>= 0;
                if (0 > a || a + 1 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+1) <= " + this.buffer.byteLength);
            }
            var c = 0,
                d = 0,
                f;
            do {
                f = a + c;
                if (!this.noAssert && f > this.limit) throw a = Error("Truncated"), a.truncated = !0, a;
                f = this.view.getUint8(f);
                5 > c && (d |= (f & 127) << 7 * c >>> 0);
                ++c
            } while (128 === (f & 128));
            d |= 0;
            return b ? (this.offset +=
                c, d) : {
                value: d,
                length: c
            }
        };
        e.readVarint32ZigZag = function(a) {
            a = this.readVarint32(a);
            "object" === typeof a ? a.value = g.zigZagDecode32(a.value) : a = g.zigZagDecode32(a);
            return a
        };
        k && (g.MAX_VARINT64_BYTES = 10, g.calculateVarint64 = function(a) {
            "number" === typeof a && (a = k.fromNumber(a));
            var b = a.toInt() >>> 0,
                c = a.shiftRightUnsigned(28).toInt() >>> 0;
            a = a.shiftRightUnsigned(56).toInt() >>> 0;
            return 0 == a ? 0 == c ? 16384 > b ? 128 > b ? 1 : 2 : 2097152 > b ? 3 : 4 : 16384 > c ? 128 > c ? 5 : 6 : 2097152 > c ? 7 : 8 : 128 > a ? 9 : 10
        }, g.zigZagEncode64 = function(a) {
            "number" === typeof a ?
                a = k.fromNumber(a, !1) : !1 !== a.unsigned && (a = a.toSigned());
            return a.shiftLeft(1).xor(a.shiftRight(63)).toUnsigned()
        }, g.zigZagDecode64 = function(a) {
            "number" === typeof a ? a = k.fromNumber(a, !1) : !1 !== a.unsigned && (a = a.toSigned());
            return a.shiftRightUnsigned(1).xor(a.and(k.ONE).toSigned().negate()).toSigned()
        }, e.writeVarint64 = function(a, b) {
            var c = "undefined" === typeof b;
            c && (b = this.offset);
            if (!this.noAssert) {
                if ("number" === typeof a) a = k.fromNumber(a);
                else if (!(a && a instanceof k)) throw TypeError("Illegal value: " + a +
                    " (not an integer or Long)");
                if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
            }
            "number" === typeof a ? a = k.fromNumber(a, !1) : !1 !== a.unsigned && (a = a.toSigned());
            var d = g.calculateVarint64(a),
                f = a.toInt() >>> 0,
                n = a.shiftRightUnsigned(28).toInt() >>> 0,
                e = a.shiftRightUnsigned(56).toInt() >>> 0;
            b += d;
            var r = this.buffer.byteLength;
            b > r && this.resize((r *= 2) > b ? r :
                b);
            b -= d;
            switch (d) {
                case 10:
                    this.view.setUint8(b + 9, e >>> 7 & 1);
                case 9:
                    this.view.setUint8(b + 8, 9 !== d ? e | 128 : e & 127);
                case 8:
                    this.view.setUint8(b + 7, 8 !== d ? n >>> 21 | 128 : n >>> 21 & 127);
                case 7:
                    this.view.setUint8(b + 6, 7 !== d ? n >>> 14 | 128 : n >>> 14 & 127);
                case 6:
                    this.view.setUint8(b + 5, 6 !== d ? n >>> 7 | 128 : n >>> 7 & 127);
                case 5:
                    this.view.setUint8(b + 4, 5 !== d ? n | 128 : n & 127);
                case 4:
                    this.view.setUint8(b + 3, 4 !== d ? f >>> 21 | 128 : f >>> 21 & 127);
                case 3:
                    this.view.setUint8(b + 2, 3 !== d ? f >>> 14 | 128 : f >>> 14 & 127);
                case 2:
                    this.view.setUint8(b + 1, 2 !== d ? f >>> 7 | 128 : f >>> 7 &
                        127);
                case 1:
                    this.view.setUint8(b, 1 !== d ? f | 128 : f & 127)
            }
            return c ? (this.offset += d, this) : d
        }, e.writeVarint64ZigZag = function(a, b) {
            return this.writeVarint64(g.zigZagEncode64(a), b)
        }, e.readVarint64 = function(a) {
            var b = "undefined" === typeof a;
            b && (a = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
                a >>>= 0;
                if (0 > a || a + 1 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+1) <= " + this.buffer.byteLength);
            }
            var c = a,
                d = 0,
                f = 0,
                e = 0,
                h = 0,
                h = this.view.getUint8(a++),
                d = h & 127;
            if (h & 128 && (h = this.view.getUint8(a++), d |= (h & 127) << 7, h & 128 && (h = this.view.getUint8(a++), d |= (h & 127) << 14, h & 128 && (h = this.view.getUint8(a++), d |= (h & 127) << 21, h & 128 && (h = this.view.getUint8(a++), f = h & 127, h & 128 && (h = this.view.getUint8(a++), f |= (h & 127) << 7, h & 128 && (h = this.view.getUint8(a++), f |= (h & 127) << 14, h & 128 && (h = this.view.getUint8(a++), f |= (h & 127) << 21, h & 128 && (h = this.view.getUint8(a++), e = h & 127, h & 128 && (h = this.view.getUint8(a++), e |= (h & 127) << 7, h & 128)))))))))) throw Error("Buffer overrun");
            d = k.fromBits(d | f << 28, f >>> 4 | e << 24, !1);
            return b ? (this.offset = a, d) : {
                value: d,
                length: a - c
            }
        }, e.readVarint64ZigZag = function(a) {
            (a = this.readVarint64(a)) && a.value instanceof k ? a.value = g.zigZagDecode64(a.value) : a = g.zigZagDecode64(a);
            return a
        });
        e.writeCString = function(a, b) {
            var c = "undefined" === typeof b;
            c && (b = this.offset);
            var d, f = a.length;
            if (!this.noAssert) {
                if ("string" !== typeof a) throw TypeError("Illegal str: Not a string");
                for (d = 0; d < f; ++d)
                    if (0 === a.charCodeAt(d)) throw RangeError("Illegal str: Contains NULL-characters");
                if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
            }
            d = b;
            f = l.a(m(a))[1];
            b += f + 1;
            var e = this.buffer.byteLength;
            b > e && this.resize((e *= 2) > b ? e : b);
            b -= f + 1;
            l.c(m(a), function(a) {
                this.view.setUint8(b++, a)
            }.bind(this));
            this.view.setUint8(b++, 0);
            return c ? (this.offset = b - d, this) : f
        };
        e.readCString = function(a) {
            var b = "undefined" === typeof a;
            b && (a = this.offset);
            if (!this.noAssert) {
                if ("number" !==
                    typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
                a >>>= 0;
                if (0 > a || a + 1 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+1) <= " + this.buffer.byteLength);
            }
            var c = a,
                d, f = -1;
            l.b(function() {
                if (0 === f) return null;
                if (a >= this.limit) throw RangeError("Illegal range: Truncated data, " + a + " < " + this.limit);
                return 0 === (f = this.view.getUint8(a++)) ? null : f
            }.bind(this), d = t(), !0);
            return b ? (this.offset = a, d()) : {
                string: d(),
                length: a - c
            }
        };
        e.writeIString = function(a, b) {
            var c = "undefined" ===
                typeof b;
            c && (b = this.offset);
            if (!this.noAssert) {
                if ("string" !== typeof a) throw TypeError("Illegal str: Not a string");
                if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
            }
            var d = b,
                f;
            f = l.a(m(a), this.noAssert)[1];
            b += 4 + f;
            var e = this.buffer.byteLength;
            b > e && this.resize((e *= 2) > b ? e : b);
            b -= 4 + f;
            this.view.setUint32(b, f, this.littleEndian);
            b += 4;
            l.c(m(a), function(a) {
                this.view.setUint8(b++,
                    a)
            }.bind(this));
            if (b !== d + 4 + f) throw RangeError("Illegal range: Truncated data, " + b + " == " + (b + 4 + f));
            return c ? (this.offset = b, this) : b - d
        };
        e.readIString = function(a) {
            var b = "undefined" === typeof a;
            b && (a = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
                a >>>= 0;
                if (0 > a || a + 4 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+4) <= " + this.buffer.byteLength);
            }
            var c = 0,
                d = a,
                c = this.view.getUint32(a, this.littleEndian);
            a += 4;
            var f =
                a + c;
            l.b(function() {
                return a < f ? this.view.getUint8(a++) : null
            }.bind(this), c = t(), this.noAssert);
            c = c();
            return b ? (this.offset = a, c) : {
                string: c,
                length: a - d
            }
        };
        g.METRICS_CHARS = "c";
        g.METRICS_BYTES = "b";
        e.writeUTF8String = function(a, b) {
            var c = "undefined" === typeof b;
            c && (b = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
            }
            var d,
                f = b;
            d = l.a(m(a))[1];
            b += d;
            var e = this.buffer.byteLength;
            b > e && this.resize((e *= 2) > b ? e : b);
            b -= d;
            l.c(m(a), function(a) {
                this.view.setUint8(b++, a)
            }.bind(this));
            return c ? (this.offset = b, this) : b - f
        };
        e.writeString = e.writeUTF8String;
        g.calculateUTF8Chars = function(a) {
            return l.a(m(a))[0]
        };
        g.calculateUTF8Bytes = function(a) {
            return l.a(m(a))[1]
        };
        e.readUTF8String = function(a, b, c) {
            "number" === typeof b && (c = b, b = void 0);
            var d = "undefined" === typeof c;
            d && (c = this.offset);
            "undefined" === typeof b && (b = g.METRICS_CHARS);
            if (!this.noAssert) {
                if ("number" !==
                    typeof a || 0 !== a % 1) throw TypeError("Illegal length: " + a + " (not an integer)");
                a |= 0;
                if ("number" !== typeof c || 0 !== c % 1) throw TypeError("Illegal offset: " + c + " (not an integer)");
                c >>>= 0;
                if (0 > c || c + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + c + " (+0) <= " + this.buffer.byteLength);
            }
            var f = 0,
                e = c,
                h;
            if (b === g.METRICS_CHARS) {
                h = t();
                l.g(function() {
                    return f < a && c < this.limit ? this.view.getUint8(c++) : null
                }.bind(this), function(a) {
                    ++f;
                    l.e(a, h)
                }.bind(this));
                if (f !== a) throw RangeError("Illegal range: Truncated data, " +
                    f + " == " + a);
                return d ? (this.offset = c, h()) : {
                    string: h(),
                    length: c - e
                }
            }
            if (b === g.METRICS_BYTES) {
                if (!this.noAssert) {
                    if ("number" !== typeof c || 0 !== c % 1) throw TypeError("Illegal offset: " + c + " (not an integer)");
                    c >>>= 0;
                    if (0 > c || c + a > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + c + " (+" + a + ") <= " + this.buffer.byteLength);
                }
                var r = c + a;
                l.b(function() {
                    return c < r ? this.view.getUint8(c++) : null
                }.bind(this), h = t(), this.noAssert);
                if (c !== r) throw RangeError("Illegal range: Truncated data, " + c + " == " + r);
                return d ?
                    (this.offset = c, h()) : {
                        string: h(),
                        length: c - e
                    }
            }
            throw TypeError("Unsupported metrics: " + b);
        };
        e.readString = e.readUTF8String;
        e.writeVString = function(a, b) {
            var c = "undefined" === typeof b;
            c && (b = this.offset);
            if (!this.noAssert) {
                if ("string" !== typeof a) throw TypeError("Illegal str: Not a string");
                if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
            }
            var d =
                b,
                f, e;
            f = l.a(m(a), this.noAssert)[1];
            e = g.calculateVarint32(f);
            b += e + f;
            var h = this.buffer.byteLength;
            b > h && this.resize((h *= 2) > b ? h : b);
            b -= e + f;
            b += this.writeVarint32(f, b);
            l.c(m(a), function(a) {
                this.view.setUint8(b++, a)
            }.bind(this));
            if (b !== d + f + e) throw RangeError("Illegal range: Truncated data, " + b + " == " + (b + f + e));
            return c ? (this.offset = b, this) : b - d
        };
        e.readVString = function(a) {
            var b = "undefined" === typeof a;
            b && (a = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
                a >>>= 0;
                if (0 > a || a + 1 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+1) <= " + this.buffer.byteLength);
            }
            var c = this.readVarint32(a),
                d = a;
            a += c.length;
            var c = c.value,
                f = a + c,
                c = t();
            l.b(function() {
                return a < f ? this.view.getUint8(a++) : null
            }.bind(this), c, this.noAssert);
            c = c();
            return b ? (this.offset = a, c) : {
                string: c,
                length: a - d
            }
        };
        e.append = function(a, b, c) {
            if ("number" === typeof b || "string" !== typeof b) c = b, b = void 0;
            var d = "undefined" === typeof c;
            d && (c = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof c ||
                    0 !== c % 1) throw TypeError("Illegal offset: " + c + " (not an integer)");
                c >>>= 0;
                if (0 > c || c + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + c + " (+0) <= " + this.buffer.byteLength);
            }
            a instanceof g || (a = g.wrap(a, b));
            b = a.limit - a.offset;
            if (0 >= b) return this;
            c += b;
            var f = this.buffer.byteLength;
            c > f && this.resize((f *= 2) > c ? f : c);
            (new Uint8Array(this.buffer, c - b)).set((new Uint8Array(a.buffer)).subarray(a.offset, a.limit));
            a.offset += b;
            d && (this.offset += b);
            return this
        };
        e.appendTo = function(a, b) {
            a.append(this,
                b);
            return this
        };
        e.assert = function(a) {
            this.noAssert = !a;
            return this
        };
        e.capacity = function() {
            return this.buffer.byteLength
        };
        e.clear = function() {
            this.offset = 0;
            this.limit = this.buffer.byteLength;
            this.markedOffset = -1;
            return this
        };
        e.clone = function(a) {
            var b = new g(0, this.littleEndian, this.noAssert);
            a ? (a = new ArrayBuffer(this.buffer.byteLength), (new Uint8Array(a)).set(this.buffer), b.buffer = a, b.view = new DataView(a)) : (b.buffer = this.buffer, b.view = this.view);
            b.offset = this.offset;
            b.markedOffset = this.markedOffset;
            b.limit =
                this.limit;
            return b
        };
        e.compact = function(a, b) {
            "undefined" === typeof a && (a = this.offset);
            "undefined" === typeof b && (b = this.limit);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal begin: Not an integer");
                a >>>= 0;
                if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal end: Not an integer");
                b >>>= 0;
                if (0 > a || a > b || b > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength);
            }
            if (0 === a && b === this.buffer.byteLength) return this;
            var c = b - a;
            if (0 ===
                c) return this.buffer = s, this.view = null, 0 <= this.markedOffset && (this.markedOffset -= a), this.limit = this.offset = 0, this;
            var d = new ArrayBuffer(c);
            (new Uint8Array(d)).set((new Uint8Array(this.buffer)).subarray(a, b));
            this.buffer = d;
            this.view = new DataView(d);
            0 <= this.markedOffset && (this.markedOffset -= a);
            this.offset = 0;
            this.limit = c;
            return this
        };
        e.copy = function(a, b) {
            "undefined" === typeof a && (a = this.offset);
            "undefined" === typeof b && (b = this.limit);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal begin: Not an integer");
                a >>>= 0;
                if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal end: Not an integer");
                b >>>= 0;
                if (0 > a || a > b || b > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength);
            }
            if (a === b) return new g(0, this.littleEndian, this.noAssert);
            var c = b - a,
                d = new g(c, this.littleEndian, this.noAssert);
            d.offset = 0;
            d.limit = c;
            0 <= d.markedOffset && (d.markedOffset -= a);
            this.copyTo(d, 0, a, b);
            return d
        };
        e.copyTo = function(a, b, c, d) {
            var f, e;
            if (!this.noAssert && !g.isByteBuffer(a)) throw TypeError("Illegal target: Not a ByteBuffer");
            b = (e = "undefined" === typeof b) ? a.offset : b | 0;
            c = (f = "undefined" === typeof c) ? this.offset : c | 0;
            d = "undefined" === typeof d ? this.limit : d | 0;
            if (0 > b || b > a.buffer.byteLength) throw RangeError("Illegal target range: 0 <= " + b + " <= " + a.buffer.byteLength);
            if (0 > c || d > this.buffer.byteLength) throw RangeError("Illegal source range: 0 <= " + c + " <= " + this.buffer.byteLength);
            var h = d - c;
            if (0 === h) return a;
            a.ensureCapacity(b + h);
            (new Uint8Array(a.buffer)).set((new Uint8Array(this.buffer)).subarray(c, d), b);
            f && (this.offset += h);
            e && (a.offset +=
                h);
            return this
        };
        e.ensureCapacity = function(a) {
            var b = this.buffer.byteLength;
            return b < a ? this.resize((b *= 2) > a ? b : a) : this
        };
        e.fill = function(a, b, c) {
            var d = "undefined" === typeof b;
            d && (b = this.offset);
            "string" === typeof a && 0 < a.length && (a = a.charCodeAt(0));
            "undefined" === typeof b && (b = this.offset);
            "undefined" === typeof c && (c = this.limit);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " + a + " (not an integer)");
                a |= 0;
                if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal begin: Not an integer");
                b >>>= 0;
                if ("number" !== typeof c || 0 !== c % 1) throw TypeError("Illegal end: Not an integer");
                c >>>= 0;
                if (0 > b || b > c || c > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + b + " <= " + c + " <= " + this.buffer.byteLength);
            }
            if (b >= c) return this;
            for (; b < c;) this.view.setUint8(b++, a);
            d && (this.offset = b);
            return this
        };
        e.flip = function() {
            this.limit = this.offset;
            this.offset = 0;
            return this
        };
        e.mark = function(a) {
            a = "undefined" === typeof a ? this.offset : a;
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " +
                    a + " (not an integer)");
                a >>>= 0;
                if (0 > a || a + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+0) <= " + this.buffer.byteLength);
            }
            this.markedOffset = a;
            return this
        };
        e.order = function(a) {
            if (!this.noAssert && "boolean" !== typeof a) throw TypeError("Illegal littleEndian: Not a boolean");
            this.littleEndian = !!a;
            return this
        };
        e.LE = function(a) {
            this.littleEndian = "undefined" !== typeof a ? !!a : !0;
            return this
        };
        e.BE = function(a) {
            this.littleEndian = "undefined" !== typeof a ? !a : !1;
            return this
        };
        e.prepend = function(a,
            b, c) {
            if ("number" === typeof b || "string" !== typeof b) c = b, b = void 0;
            var d = "undefined" === typeof c;
            d && (c = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof c || 0 !== c % 1) throw TypeError("Illegal offset: " + c + " (not an integer)");
                c >>>= 0;
                if (0 > c || c + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + c + " (+0) <= " + this.buffer.byteLength);
            }
            a instanceof g || (a = g.wrap(a, b));
            b = a.limit - a.offset;
            if (0 >= b) return this;
            var f = b - c,
                e;
            if (0 < f) {
                var h = new ArrayBuffer(this.buffer.byteLength + f);
                e = new Uint8Array(h);
                e.set((new Uint8Array(this.buffer)).subarray(c,
                    this.buffer.byteLength), b);
                this.buffer = h;
                this.view = new DataView(h);
                this.offset += f;
                0 <= this.markedOffset && (this.markedOffset += f);
                this.limit += f;
                c += f
            } else e = new Uint8Array(this.buffer);
            e.set((new Uint8Array(a.buffer)).subarray(a.offset, a.limit), c - b);
            a.offset = a.limit;
            d && (this.offset -= b);
            return this
        };
        e.prependTo = function(a, b) {
            a.prepend(this, b);
            return this
        };
        e.printDebug = function(a) {
            "function" !== typeof a && (a = console.log.bind(console));
            a(this.toString() + "\n-------------------------------------------------------------------\n" +
                this.toDebug(!0))
        };
        e.remaining = function() {
            return this.limit - this.offset
        };
        e.reset = function() {
            0 <= this.markedOffset ? (this.offset = this.markedOffset, this.markedOffset = -1) : this.offset = 0;
            return this
        };
        e.resize = function(a) {
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal capacity: " + a + " (not an integer)");
                a |= 0;
                if (0 > a) throw RangeError("Illegal capacity: 0 <= " + a);
            }
            this.buffer.byteLength < a && (a = new ArrayBuffer(a), (new Uint8Array(a)).set(new Uint8Array(this.buffer)), this.buffer = a, this.view =
                new DataView(a));
            return this
        };
        e.reverse = function(a, b) {
            "undefined" === typeof a && (a = this.offset);
            "undefined" === typeof b && (b = this.limit);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal begin: Not an integer");
                a >>>= 0;
                if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal end: Not an integer");
                b >>>= 0;
                if (0 > a || a > b || b > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength);
            }
            if (a === b) return this;
            Array.prototype.reverse.call((new Uint8Array(this.buffer)).subarray(a,
                b));
            this.view = new DataView(this.buffer);
            return this
        };
        e.skip = function(a) {
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal length: " + a + " (not an integer)");
                a |= 0
            }
            var b = this.offset + a;
            if (!this.noAssert && (0 > b || b > this.buffer.byteLength)) throw RangeError("Illegal length: 0 <= " + this.offset + " + " + a + " <= " + this.buffer.byteLength);
            this.offset = b;
            return this
        };
        e.slice = function(a, b) {
            "undefined" === typeof a && (a = this.offset);
            "undefined" === typeof b && (b = this.limit);
            if (!this.noAssert) {
                if ("number" !==
                    typeof a || 0 !== a % 1) throw TypeError("Illegal begin: Not an integer");
                a >>>= 0;
                if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal end: Not an integer");
                b >>>= 0;
                if (0 > a || a > b || b > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength);
            }
            var c = this.clone();
            c.offset = a;
            c.limit = b;
            return c
        };
        e.toBuffer = function(a) {
            var b = this.offset,
                c = this.limit;
            if (b > c) var d = b,
                b = c,
                c = d;
            if (!this.noAssert) {
                if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: Not an integer");
                b >>>= 0;
                if ("number" !== typeof c || 0 !== c % 1) throw TypeError("Illegal limit: Not an integer");
                c >>>= 0;
                if (0 > b || b > c || c > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + b + " <= " + c + " <= " + this.buffer.byteLength);
            }
            if (!a && 0 === b && c === this.buffer.byteLength) return this.buffer;
            if (b === c) return s;
            a = new ArrayBuffer(c - b);
            (new Uint8Array(a)).set((new Uint8Array(this.buffer)).subarray(b, c), 0);
            return a
        };
        e.toArrayBuffer = e.toBuffer;
        e.toString = function(a, b, c) {
            if ("undefined" === typeof a) return "ByteBufferAB(offset=" +
                this.offset + ",markedOffset=" + this.markedOffset + ",limit=" + this.limit + ",capacity=" + this.capacity() + ")";
            "number" === typeof a && (c = b = a = "utf8");
            switch (a) {
                case "utf8":
                    return this.toUTF8(b, c);
                case "base64":
                    return this.toBase64(b, c);
                case "hex":
                    return this.toHex(b, c);
                case "binary":
                    return this.toBinary(b, c);
                case "debug":
                    return this.toDebug();
                case "columns":
                    return this.m();
                default:
                    throw Error("Unsupported encoding: " + a);
            }
        };
        var v = function() {
            for (var a = {}, b = [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82,
                    83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 43, 47
                ], c = [], d = 0, f = b.length; d < f; ++d) c[b[d]] = d;
            a.i = function(a, c) {
                for (var d, f; null !== (d = a());) c(b[d >> 2 & 63]), f = (d & 3) << 4, null !== (d = a()) ? (f |= d >> 4 & 15, c(b[(f | d >> 4 & 15) & 63]), f = (d & 15) << 2, null !== (d = a()) ? (c(b[(f | d >> 6 & 3) & 63]), c(b[d & 63])) : (c(b[f & 63]), c(61))) : (c(b[f & 63]), c(61), c(61))
            };
            a.h = function(a, b) {
                function d(a) {
                    throw Error("Illegal character code: " + a);
                }
                for (var f,
                        e, g; null !== (f = a());)
                    if (e = c[f], "undefined" === typeof e && d(f), null !== (f = a()) && (g = c[f], "undefined" === typeof g && d(f), b(e << 2 >>> 0 | (g & 48) >> 4), null !== (f = a()))) {
                        e = c[f];
                        if ("undefined" === typeof e)
                            if (61 === f) break;
                            else d(f);
                        b((g & 15) << 4 >>> 0 | (e & 60) >> 2);
                        if (null !== (f = a())) {
                            g = c[f];
                            if ("undefined" === typeof g)
                                if (61 === f) break;
                                else d(f);
                            b((e & 3) << 6 >>> 0 | g)
                        }
                    }
            };
            a.test = function(a) {
                return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(a)
            };
            return a
        }();
        e.toBase64 = function(a, b) {
            "undefined" === typeof a && (a =
                this.offset);
            "undefined" === typeof b && (b = this.limit);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal begin: Not an integer");
                a >>>= 0;
                if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal end: Not an integer");
                b >>>= 0;
                if (0 > a || a > b || b > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength);
            }
            var c;
            v.i(function() {
                return a < b ? this.view.getUint8(a++) : null
            }.bind(this), c = t());
            return c()
        };
        g.fromBase64 = function(a, b, c) {
            if (!c) {
                if ("string" !==
                    typeof a) throw TypeError("Illegal str: Not a string");
                if (0 !== a.length % 4) throw TypeError("Illegal str: Length not a multiple of 4");
            }
            var d = new g(a.length / 4 * 3, b, c),
                f = 0;
            v.h(m(a), function(a) {
                d.view.setUint8(f++, a)
            });
            d.limit = f;
            return d
        };
        g.btoa = function(a) {
            return g.fromBinary(a).toBase64()
        };
        g.atob = function(a) {
            return g.fromBase64(a).toBinary()
        };
        e.toBinary = function(a, b) {
            a = "undefined" === typeof a ? this.offset : a;
            b = "undefined" === typeof b ? this.limit : b;
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal begin: Not an integer");
                a >>>= 0;
                if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal end: Not an integer");
                b >>>= 0;
                if (0 > a || a > b || b > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength);
            }
            if (a === b) return "";
            for (var c = [], d = []; a < b;) c.push(this.view.getUint8(a++)), 1024 <= c.length && (d.push(String.fromCharCode.apply(String, c)), c = []);
            return d.join("") + String.fromCharCode.apply(String, c)
        };
        g.fromBinary = function(a, b, c) {
            if (!c && "string" !== typeof a) throw TypeError("Illegal str: Not a string");
            for (var d = 0, f = a.length, e = new g(f, b, c); d < f;) {
                b = a.charCodeAt(d);
                if (!c && 255 < b) throw RangeError("Illegal charCode at " + d + ": 0 <= " + b + " <= 255");
                e.view.setUint8(d++, b)
            }
            e.limit = f;
            return e
        };
        e.toDebug = function(a) {
            for (var b = -1, c = this.buffer.byteLength, d, f = "", e = "", g = ""; b < c;) {
                -1 !== b && (d = this.view.getUint8(b), f = 16 > d ? f + ("0" + d.toString(16).toUpperCase()) : f + d.toString(16).toUpperCase(), a && (e += 32 < d && 127 > d ? String.fromCharCode(d) : "."));
                ++b;
                if (a && 0 < b && 0 === b % 16 && b !== c) {
                    for (; 51 > f.length;) f += " ";
                    g += f + e + "\n";
                    f = e = ""
                }
                f = b ===
                    this.offset && b === this.limit ? f + (b === this.markedOffset ? "!" : "|") : b === this.offset ? f + (b === this.markedOffset ? "[" : "<") : b === this.limit ? f + (b === this.markedOffset ? "]" : ">") : f + (b === this.markedOffset ? "'" : a || 0 !== b && b !== c ? " " : "")
            }
            if (a && " " !== f) {
                for (; 51 > f.length;) f += " ";
                g += f + e + "\n"
            }
            return a ? g : f
        };
        g.fromDebug = function(a, b, c) {
            var d = a.length;
            b = new g((d + 1) / 3 | 0, b, c);
            for (var f = 0, e = 0, h, k = !1, l = !1, m = !1, q = !1, p = !1; f < d;) {
                switch (h = a.charAt(f++)) {
                    case "!":
                        if (!c) {
                            if (l || m || q) {
                                p = !0;
                                break
                            }
                            l = m = q = !0
                        }
                        b.offset = b.markedOffset = b.limit = e;
                        k = !1;
                        break;
                    case "|":
                        if (!c) {
                            if (l || q) {
                                p = !0;
                                break
                            }
                            l = q = !0
                        }
                        b.offset = b.limit = e;
                        k = !1;
                        break;
                    case "[":
                        if (!c) {
                            if (l || m) {
                                p = !0;
                                break
                            }
                            l = m = !0
                        }
                        b.offset = b.markedOffset = e;
                        k = !1;
                        break;
                    case "<":
                        if (!c) {
                            if (l) {
                                p = !0;
                                break
                            }
                            l = !0
                        }
                        b.offset = e;
                        k = !1;
                        break;
                    case "]":
                        if (!c) {
                            if (q || m) {
                                p = !0;
                                break
                            }
                            q = m = !0
                        }
                        b.limit = b.markedOffset = e;
                        k = !1;
                        break;
                    case ">":
                        if (!c) {
                            if (q) {
                                p = !0;
                                break
                            }
                            q = !0
                        }
                        b.limit = e;
                        k = !1;
                        break;
                    case "'":
                        if (!c) {
                            if (m) {
                                p = !0;
                                break
                            }
                            m = !0
                        }
                        b.markedOffset = e;
                        k = !1;
                        break;
                    case " ":
                        k = !1;
                        break;
                    default:
                        if (!c && k) {
                            p = !0;
                            break
                        }
                        h = parseInt(h + a.charAt(f++),
                            16);
                        if (!c && (isNaN(h) || 0 > h || 255 < h)) throw TypeError("Illegal str: Not a debug encoded string");
                        b.view.setUint8(e++, h);
                        k = !0
                }
                if (p) throw TypeError("Illegal str: Invalid symbol at " + f);
            }
            if (!c) {
                if (!l || !q) throw TypeError("Illegal str: Missing offset or limit");
                if (e < b.buffer.byteLength) throw TypeError("Illegal str: Not a debug encoded string (is it hex?) " + e + " < " + d);
            }
            return b
        };
        e.toHex = function(a, b) {
            a = "undefined" === typeof a ? this.offset : a;
            b = "undefined" === typeof b ? this.limit : b;
            if (!this.noAssert) {
                if ("number" !==
                    typeof a || 0 !== a % 1) throw TypeError("Illegal begin: Not an integer");
                a >>>= 0;
                if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal end: Not an integer");
                b >>>= 0;
                if (0 > a || a > b || b > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength);
            }
            for (var c = Array(b - a), d; a < b;) d = this.view.getUint8(a++), 16 > d ? c.push("0", d.toString(16)) : c.push(d.toString(16));
            return c.join("")
        };
        g.fromHex = function(a, b, c) {
            if (!c) {
                if ("string" !== typeof a) throw TypeError("Illegal str: Not a string");
                if (0 !== a.length % 2) throw TypeError("Illegal str: Length not a multiple of 2");
            }
            var d = a.length;
            b = new g(d / 2 | 0, b);
            for (var f, e = 0, h = 0; e < d; e += 2) {
                f = parseInt(a.substring(e, e + 2), 16);
                if (!c && (!isFinite(f) || 0 > f || 255 < f)) throw TypeError("Illegal str: Contains non-hex characters");
                b.view.setUint8(h++, f)
            }
            b.limit = h;
            return b
        };
        var l = function() {
            var a = {
                k: 1114111,
                j: function(a, c) {
                    var d = null;
                    "number" === typeof a && (d = a, a = function() {
                        return null
                    });
                    for (; null !== d || null !== (d = a());) 128 > d ? c(d & 127) : (2048 > d ? c(d >> 6 & 31 | 192) : (65536 > d ?
                        c(d >> 12 & 15 | 224) : (c(d >> 18 & 7 | 240), c(d >> 12 & 63 | 128)), c(d >> 6 & 63 | 128)), c(d & 63 | 128)), d = null
                },
                g: function(a, c) {
                    function d(a) {
                        a = a.slice(0, a.indexOf(null));
                        var b = Error(a.toString());
                        b.name = "TruncatedError";
                        b.bytes = a;
                        throw b;
                    }
                    for (var e, g, h, k; null !== (e = a());)
                        if (0 === (e & 128)) c(e);
                        else if (192 === (e & 224)) null === (g = a()) && d([e, g]), c((e & 31) << 6 | g & 63);
                    else if (224 === (e & 240)) null !== (g = a()) && null !== (h = a()) || d([e, g, h]), c((e & 15) << 12 | (g & 63) << 6 | h & 63);
                    else if (240 === (e & 248)) null !== (g = a()) && null !== (h = a()) && null !== (k = a()) || d([e, g,
                        h, k
                    ]), c((e & 7) << 18 | (g & 63) << 12 | (h & 63) << 6 | k & 63);
                    else throw RangeError("Illegal starting byte: " + e);
                },
                d: function(a, c) {
                    for (var d, e = null; null !== (d = null !== e ? e : a());) 55296 <= d && 57343 >= d && null !== (e = a()) && 56320 <= e && 57343 >= e ? (c(1024 * (d - 55296) + e - 56320 + 65536), e = null) : c(d);
                    null !== e && c(e)
                },
                e: function(a, c) {
                    var d = null;
                    "number" === typeof a && (d = a, a = function() {
                        return null
                    });
                    for (; null !== d || null !== (d = a());) 65535 >= d ? c(d) : (d -= 65536, c((d >> 10) + 55296), c(d % 1024 + 56320)), d = null
                },
                c: function(b, c) {
                    a.d(b, function(b) {
                        a.j(b, c)
                    })
                },
                b: function(b,
                    c) {
                    a.g(b, function(b) {
                        a.e(b, c)
                    })
                },
                f: function(a) {
                    return 128 > a ? 1 : 2048 > a ? 2 : 65536 > a ? 3 : 4
                },
                l: function(b) {
                    for (var c, d = 0; null !== (c = b());) d += a.f(c);
                    return d
                },
                a: function(b) {
                    var c = 0,
                        d = 0;
                    a.d(b, function(b) {
                        ++c;
                        d += a.f(b)
                    });
                    return [c, d]
                }
            };
            return a
        }();
        e.toUTF8 = function(a, b) {
            "undefined" === typeof a && (a = this.offset);
            "undefined" === typeof b && (b = this.limit);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal begin: Not an integer");
                a >>>= 0;
                if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal end: Not an integer");
                b >>>= 0;
                if (0 > a || a > b || b > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength);
            }
            var c;
            try {
                l.b(function() {
                    return a < b ? this.view.getUint8(a++) : null
                }.bind(this), c = t())
            } catch (d) {
                if (a !== b) throw RangeError("Illegal range: Truncated data, " + a + " != " + b);
            }
            return c()
        };
        g.fromUTF8 = function(a, b, c) {
            if (!c && "string" !== typeof a) throw TypeError("Illegal str: Not a string");
            var d = new g(l.a(m(a), !0)[1], b, c),
                e = 0;
            l.c(m(a), function(a) {
                d.view.setUint8(e++, a)
            });
            d.limit = e;
            return d
        };
        return g
    }
    "function" === typeof require && "object" === typeof module && module && "object" === typeof exports && exports ? module.exports = function() {
        var k;
        try {
            k = require("long")
        } catch (g) {}
        return u(k)
    }() : "function" === typeof define && define.amd ? define("ByteBuffer", ["Long"], function(k) {
        return u(k)
    }) : (s.dcodeIO = s.dcodeIO || {}).ByteBuffer = u(s.dcodeIO.Long)
})(this);