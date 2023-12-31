"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const teaser_1 = __importDefault(require("./teaser"));
const settings_1 = __importDefault(require("./settings"));
exports.default = {
    teaser: teaser_1.default,
    settings: settings_1.default
};
