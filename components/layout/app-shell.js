"use client";
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AppShell;
var react_1 = require("react");
var header_1 = require("./header");
var sidebar_1 = require("./sidebar");
var bottom_player_1 = require("./bottom-player");
var footer_1 = require("./footer");
var queue_panel_1 = require("./queue-panel");
var player_store_1 = require("@/lib/player-store");
var music_api_1 = require("@/lib/music-api");
var toaster_1 = require("@/components/ui/toaster");
function AppShell(_a) {
    var _this = this;
    var children = _a.children, _b = _a.showFooter, showFooter = _b === void 0 ? true : _b;
    var _c = (0, react_1.useState)(false), sidebarCollapsed = _c[0], setSidebarCollapsed = _c[1];
    var _d = (0, player_store_1.usePlayerStore)(), isQueueOpen = _d.isQueueOpen, setTrack = _d.setTrack, setQueue = _d.setQueue;
    (0, react_1.useEffect)(function () {
        var cancelled = false;
        var loadDefaultTrack = function () { return __awaiter(_this, void 0, void 0, function () {
            var defaultTrack;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, music_api_1.getTrackByTitle)('Thêm bao nhiêu lâu', 'VN')];
                    case 1:
                        defaultTrack = _a.sent();
                        if (cancelled || !defaultTrack)
                            return [2 /*return*/];
                        setQueue([defaultTrack]);
                        setTrack(defaultTrack);
                        return [2 /*return*/];
                }
            });
        }); };
        loadDefaultTrack();
        return function () {
            cancelled = true;
        };
    }, [setQueue, setTrack]);
    return (<div className="min-h-screen bg-vw-bg relative overflow-hidden">
      {/* Immersive Deep Background */}
      <div suppressHydrationWarning={true} className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-vw-purple opacity-[0.25] blur-[100px] mix-blend-screen animate-blob"/>
        <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-[#00FFFF] opacity-[0.15] blur-[120px] mix-blend-screen animate-blob animation-delay-2000"/>
        <div className="absolute bottom-[-10%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-[#FF00FF] opacity-[0.15] blur-[120px] mix-blend-screen animate-blob animation-delay-4000"/>
        <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay"/>
      </div>

      <div className="relative z-10">
        <header_1.default />
        <react_1.Suspense fallback={null}>
          <sidebar_1.default collapsed={sidebarCollapsed} onToggle={setSidebarCollapsed}/>
        </react_1.Suspense>

        <main className="pt-16 pb-20 min-h-screen" style={{
            marginLeft: sidebarCollapsed ? '72px' : '240px',
            marginRight: isQueueOpen ? '380px' : '0px',
            transition: 'margin-left 0.3s ease, margin-right 0.3s ease',
        }}>
          <div className="max-w-[1220px] mx-auto px-8 py-8">
            {children}
          </div>
          {showFooter && <footer_1.default />}
        </main>

        <bottom_player_1.default sidebarCollapsed={sidebarCollapsed}/>
        <queue_panel_1.default />
        <toaster_1.Toaster />
      </div>
    </div>);
}
