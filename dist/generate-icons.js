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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var server_1 = require("react-dom/server");
var sharp_1 = require("sharp");
var fs_1 = require("fs");
var path_1 = require("path");
var AppIcon_1 = require("../src/components/AppIcon");
// Define iOS icon sizes
var IOS_SIZES = {
    'Icon-20@2x.png': 40,
    'Icon-20@3x.png': 60,
    'Icon-29@2x.png': 58,
    'Icon-29@3x.png': 87,
    'Icon-40@2x.png': 80,
    'Icon-40@3x.png': 120,
    'Icon-60@2x.png': 120,
    'Icon-60@3x.png': 180,
    'Icon-76.png': 76,
    'Icon-76@2x.png': 152,
    'Icon-83.5@2x.png': 167,
    'Icon-1024.png': 1024,
};
// Define Android icon sizes
var ANDROID_SIZES = {
    'mipmap-mdpi/ic_launcher.png': 48,
    'mipmap-hdpi/ic_launcher.png': 72,
    'mipmap-xhdpi/ic_launcher.png': 96,
    'mipmap-xxhdpi/ic_launcher.png': 144,
    'mipmap-xxxhdpi/ic_launcher.png': 192,
    'playstore-icon.png': 512,
};
function generateIcon(svgString, size, outputPath) {
    return __awaiter(this, void 0, void 0, function () {
        var dir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dir = path_1.default.dirname(outputPath);
                    if (!fs_1.default.existsSync(dir)) {
                        fs_1.default.mkdirSync(dir, { recursive: true });
                    }
                    // Convert SVG to PNG with specified size
                    return [4 /*yield*/, (0, sharp_1.default)(Buffer.from(svgString))
                            .resize(size, size)
                            .png()
                            .toFile(outputPath)];
                case 1:
                    // Convert SVG to PNG with specified size
                    _a.sent();
                    console.log("Generated: ".concat(outputPath));
                    return [2 /*return*/];
            }
        });
    });
}
function generateIcons() {
    return __awaiter(this, void 0, void 0, function () {
        var iosPath, _i, _a, _b, filename, size, svgString, androidPath, _c, _d, _e, filename, size, svgString;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    iosPath = path_1.default.join(__dirname, '../ios/apntaloreact/Images.xcassets/AppIcon.appiconset');
                    _i = 0, _a = Object.entries(IOS_SIZES);
                    _f.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    _b = _a[_i], filename = _b[0], size = _b[1];
                    svgString = (0, server_1.renderToString)((0, AppIcon_1.default)({ size: size }));
                    return [4 /*yield*/, generateIcon(svgString, size, path_1.default.join(iosPath, filename))];
                case 2:
                    _f.sent();
                    _f.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    androidPath = path_1.default.join(__dirname, '../android/app/src/main/res');
                    _c = 0, _d = Object.entries(ANDROID_SIZES);
                    _f.label = 5;
                case 5:
                    if (!(_c < _d.length)) return [3 /*break*/, 8];
                    _e = _d[_c], filename = _e[0], size = _e[1];
                    svgString = (0, server_1.renderToString)((0, AppIcon_1.default)({ size: size }));
                    return [4 /*yield*/, generateIcon(svgString, size, path_1.default.join(androidPath, filename))];
                case 6:
                    _f.sent();
                    _f.label = 7;
                case 7:
                    _c++;
                    return [3 /*break*/, 5];
                case 8: return [2 /*return*/];
            }
        });
    });
}
generateIcons().catch(console.error);
