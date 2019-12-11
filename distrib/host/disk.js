///<reference path="../globals.ts" />
///<reference path ="../host/memory.ts"/>
///<reference path = "../host/memoryAccessor.ts"/>
var TSOS;
(function (TSOS) {
    var Disk = /** @class */ (function () {
        function Disk(tracks, sectors, blocks, blocksize) {
            if (tracks === void 0) { tracks = 4; }
            if (sectors === void 0) { sectors = 8; }
            if (blocks === void 0) { blocks = 8; }
            if (blocksize === void 0) { blocksize = 65; }
            this.tracks = tracks;
            this.sectors = sectors;
            this.blocks = blocks;
            this.blocksize = blocksize;
        }
        Disk.prototype.init = function () {
            this.tracks = 4;
            this.sectors = 8;
            this.blocks = 8;
            this.blocksize = 64;
        };
        return Disk;
    }());
    TSOS.Disk = Disk;
})(TSOS || (TSOS = {}));
