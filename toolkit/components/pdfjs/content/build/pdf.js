/**
 * @licstart The following is the entire license notice for the
 * Javascript code in this page
 *
 * Copyright 2021 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @licend The above is the entire license notice for the
 * Javascript code in this page
 */

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("pdfjs-dist/build/pdf", [], factory);
	else if(typeof exports === 'object')
		exports["pdfjs-dist/build/pdf"] = factory();
	else
		root["pdfjs-dist/build/pdf"] = root.pdfjsLib = factory();
})(this, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.addLinkAttributes = addLinkAttributes;
exports.deprecated = deprecated;
exports.getFilenameFromUrl = getFilenameFromUrl;
exports.getPdfFilenameFromUrl = getPdfFilenameFromUrl;
exports.getXfaPageViewport = getXfaPageViewport;
exports.isDataScheme = isDataScheme;
exports.isPdfFile = isPdfFile;
exports.isValidFetchUrl = isValidFetchUrl;
exports.loadScript = loadScript;
exports.StatTimer = exports.RenderingCancelledException = exports.PDFDateString = exports.PageViewport = exports.LinkTarget = exports.DOMSVGFactory = exports.DOMStandardFontDataFactory = exports.DOMCMapReaderFactory = exports.DOMCanvasFactory = exports.DEFAULT_LINK_REL = void 0;

var _util = __w_pdfjs_require__(2);

var _base_factory = __w_pdfjs_require__(5);

const DEFAULT_LINK_REL = "noopener noreferrer nofollow";
exports.DEFAULT_LINK_REL = DEFAULT_LINK_REL;
const SVG_NS = "http://www.w3.org/2000/svg";

class DOMCanvasFactory extends _base_factory.BaseCanvasFactory {
  constructor({
    ownerDocument = globalThis.document
  } = {}) {
    super();
    this._document = ownerDocument;
  }

  _createCanvas(width, height) {
    const canvas = this._document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

}

exports.DOMCanvasFactory = DOMCanvasFactory;

async function fetchData(url, asTypedArray = false) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return asTypedArray ? new Uint8Array(await response.arrayBuffer()) : (0, _util.stringToBytes)(await response.text());
}

class DOMCMapReaderFactory extends _base_factory.BaseCMapReaderFactory {
  _fetchData(url, compressionType) {
    return fetchData(url, this.isCompressed).then(data => {
      return {
        cMapData: data,
        compressionType
      };
    });
  }

}

exports.DOMCMapReaderFactory = DOMCMapReaderFactory;

class DOMStandardFontDataFactory extends _base_factory.BaseStandardFontDataFactory {
  _fetchData(url) {
    return fetchData(url, true);
  }

}

exports.DOMStandardFontDataFactory = DOMStandardFontDataFactory;

class DOMSVGFactory extends _base_factory.BaseSVGFactory {
  _createSVG(type) {
    return document.createElementNS(SVG_NS, type);
  }

}

exports.DOMSVGFactory = DOMSVGFactory;

class PageViewport {
  constructor({
    viewBox,
    scale,
    rotation,
    offsetX = 0,
    offsetY = 0,
    dontFlip = false
  }) {
    this.viewBox = viewBox;
    this.scale = scale;
    this.rotation = rotation;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    const centerX = (viewBox[2] + viewBox[0]) / 2;
    const centerY = (viewBox[3] + viewBox[1]) / 2;
    let rotateA, rotateB, rotateC, rotateD;
    rotation %= 360;

    if (rotation < 0) {
      rotation += 360;
    }

    switch (rotation) {
      case 180:
        rotateA = -1;
        rotateB = 0;
        rotateC = 0;
        rotateD = 1;
        break;

      case 90:
        rotateA = 0;
        rotateB = 1;
        rotateC = 1;
        rotateD = 0;
        break;

      case 270:
        rotateA = 0;
        rotateB = -1;
        rotateC = -1;
        rotateD = 0;
        break;

      case 0:
        rotateA = 1;
        rotateB = 0;
        rotateC = 0;
        rotateD = -1;
        break;

      default:
        throw new Error("PageViewport: Invalid rotation, must be a multiple of 90 degrees.");
    }

    if (dontFlip) {
      rotateC = -rotateC;
      rotateD = -rotateD;
    }

    let offsetCanvasX, offsetCanvasY;
    let width, height;

    if (rotateA === 0) {
      offsetCanvasX = Math.abs(centerY - viewBox[1]) * scale + offsetX;
      offsetCanvasY = Math.abs(centerX - viewBox[0]) * scale + offsetY;
      width = Math.abs(viewBox[3] - viewBox[1]) * scale;
      height = Math.abs(viewBox[2] - viewBox[0]) * scale;
    } else {
      offsetCanvasX = Math.abs(centerX - viewBox[0]) * scale + offsetX;
      offsetCanvasY = Math.abs(centerY - viewBox[1]) * scale + offsetY;
      width = Math.abs(viewBox[2] - viewBox[0]) * scale;
      height = Math.abs(viewBox[3] - viewBox[1]) * scale;
    }

    this.transform = [rotateA * scale, rotateB * scale, rotateC * scale, rotateD * scale, offsetCanvasX - rotateA * scale * centerX - rotateC * scale * centerY, offsetCanvasY - rotateB * scale * centerX - rotateD * scale * centerY];
    this.width = width;
    this.height = height;
  }

  clone({
    scale = this.scale,
    rotation = this.rotation,
    offsetX = this.offsetX,
    offsetY = this.offsetY,
    dontFlip = false
  } = {}) {
    return new PageViewport({
      viewBox: this.viewBox.slice(),
      scale,
      rotation,
      offsetX,
      offsetY,
      dontFlip
    });
  }

  convertToViewportPoint(x, y) {
    return _util.Util.applyTransform([x, y], this.transform);
  }

  convertToViewportRectangle(rect) {
    const topLeft = _util.Util.applyTransform([rect[0], rect[1]], this.transform);

    const bottomRight = _util.Util.applyTransform([rect[2], rect[3]], this.transform);

    return [topLeft[0], topLeft[1], bottomRight[0], bottomRight[1]];
  }

  convertToPdfPoint(x, y) {
    return _util.Util.applyInverseTransform([x, y], this.transform);
  }

}

exports.PageViewport = PageViewport;

class RenderingCancelledException extends _util.BaseException {
  constructor(msg, type) {
    super(msg);
    this.type = type;
  }

}

exports.RenderingCancelledException = RenderingCancelledException;
const LinkTarget = {
  NONE: 0,
  SELF: 1,
  BLANK: 2,
  PARENT: 3,
  TOP: 4
};
exports.LinkTarget = LinkTarget;

function addLinkAttributes(link, {
  url,
  target,
  rel,
  enabled = true
} = {}) {
  (0, _util.assert)(url && typeof url === "string", 'addLinkAttributes: A valid "url" parameter must provided.');
  const urlNullRemoved = (0, _util.removeNullCharacters)(url);

  if (enabled) {
    link.href = link.title = urlNullRemoved;
  } else {
    link.href = "";
    link.title = `Disabled: ${urlNullRemoved}`;

    link.onclick = () => {
      return false;
    };
  }

  let targetStr = "";

  switch (target) {
    case LinkTarget.NONE:
      break;

    case LinkTarget.SELF:
      targetStr = "_self";
      break;

    case LinkTarget.BLANK:
      targetStr = "_blank";
      break;

    case LinkTarget.PARENT:
      targetStr = "_parent";
      break;

    case LinkTarget.TOP:
      targetStr = "_top";
      break;
  }

  link.target = targetStr;
  link.rel = typeof rel === "string" ? rel : DEFAULT_LINK_REL;
}

function isDataScheme(url) {
  const ii = url.length;
  let i = 0;

  while (i < ii && url[i].trim() === "") {
    i++;
  }

  return url.substring(i, i + 5).toLowerCase() === "data:";
}

function isPdfFile(filename) {
  return typeof filename === "string" && /\.pdf$/i.test(filename);
}

function getFilenameFromUrl(url) {
  const anchor = url.indexOf("#");
  const query = url.indexOf("?");
  const end = Math.min(anchor > 0 ? anchor : url.length, query > 0 ? query : url.length);
  return url.substring(url.lastIndexOf("/", end) + 1, end);
}

function getPdfFilenameFromUrl(url, defaultFilename = "document.pdf") {
  if (typeof url !== "string") {
    return defaultFilename;
  }

  if (isDataScheme(url)) {
    (0, _util.warn)('getPdfFilenameFromUrl: ignore "data:"-URL for performance reasons.');
    return defaultFilename;
  }

  const reURI = /^(?:(?:[^:]+:)?\/\/[^/]+)?([^?#]*)(\?[^#]*)?(#.*)?$/;
  const reFilename = /[^/?#=]+\.pdf\b(?!.*\.pdf\b)/i;
  const splitURI = reURI.exec(url);
  let suggestedFilename = reFilename.exec(splitURI[1]) || reFilename.exec(splitURI[2]) || reFilename.exec(splitURI[3]);

  if (suggestedFilename) {
    suggestedFilename = suggestedFilename[0];

    if (suggestedFilename.includes("%")) {
      try {
        suggestedFilename = reFilename.exec(decodeURIComponent(suggestedFilename))[0];
      } catch (ex) {}
    }
  }

  return suggestedFilename || defaultFilename;
}

class StatTimer {
  constructor() {
    this.started = Object.create(null);
    this.times = [];
  }

  time(name) {
    if (name in this.started) {
      (0, _util.warn)(`Timer is already running for ${name}`);
    }

    this.started[name] = Date.now();
  }

  timeEnd(name) {
    if (!(name in this.started)) {
      (0, _util.warn)(`Timer has not been started for ${name}`);
    }

    this.times.push({
      name,
      start: this.started[name],
      end: Date.now()
    });
    delete this.started[name];
  }

  toString() {
    const outBuf = [];
    let longest = 0;

    for (const time of this.times) {
      const name = time.name;

      if (name.length > longest) {
        longest = name.length;
      }
    }

    for (const time of this.times) {
      const duration = time.end - time.start;
      outBuf.push(`${time.name.padEnd(longest)} ${duration}ms\n`);
    }

    return outBuf.join("");
  }

}

exports.StatTimer = StatTimer;

function isValidFetchUrl(url, baseUrl) {
  try {
    const {
      protocol
    } = baseUrl ? new URL(url, baseUrl) : new URL(url);
    return protocol === "http:" || protocol === "https:";
  } catch (ex) {
    return false;
  }
}

function loadScript(src, removeScriptElement = false) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;

    script.onload = function (evt) {
      if (removeScriptElement) {
        script.remove();
      }

      resolve(evt);
    };

    script.onerror = function () {
      reject(new Error(`Cannot load script at: ${script.src}`));
    };

    (document.head || document.documentElement).appendChild(script);
  });
}

function deprecated(details) {
  console.log("Deprecated API usage: " + details);
}

let pdfDateStringRegex;

class PDFDateString {
  static toDateObject(input) {
    if (!input || !(0, _util.isString)(input)) {
      return null;
    }

    if (!pdfDateStringRegex) {
      pdfDateStringRegex = new RegExp("^D:" + "(\\d{4})" + "(\\d{2})?" + "(\\d{2})?" + "(\\d{2})?" + "(\\d{2})?" + "(\\d{2})?" + "([Z|+|-])?" + "(\\d{2})?" + "'?" + "(\\d{2})?" + "'?");
    }

    const matches = pdfDateStringRegex.exec(input);

    if (!matches) {
      return null;
    }

    const year = parseInt(matches[1], 10);
    let month = parseInt(matches[2], 10);
    month = month >= 1 && month <= 12 ? month - 1 : 0;
    let day = parseInt(matches[3], 10);
    day = day >= 1 && day <= 31 ? day : 1;
    let hour = parseInt(matches[4], 10);
    hour = hour >= 0 && hour <= 23 ? hour : 0;
    let minute = parseInt(matches[5], 10);
    minute = minute >= 0 && minute <= 59 ? minute : 0;
    let second = parseInt(matches[6], 10);
    second = second >= 0 && second <= 59 ? second : 0;
    const universalTimeRelation = matches[7] || "Z";
    let offsetHour = parseInt(matches[8], 10);
    offsetHour = offsetHour >= 0 && offsetHour <= 23 ? offsetHour : 0;
    let offsetMinute = parseInt(matches[9], 10) || 0;
    offsetMinute = offsetMinute >= 0 && offsetMinute <= 59 ? offsetMinute : 0;

    if (universalTimeRelation === "-") {
      hour += offsetHour;
      minute += offsetMinute;
    } else if (universalTimeRelation === "+") {
      hour -= offsetHour;
      minute -= offsetMinute;
    }

    return new Date(Date.UTC(year, month, day, hour, minute, second));
  }

}

exports.PDFDateString = PDFDateString;

function getXfaPageViewport(xfaPage, {
  scale = 1,
  rotation = 0
}) {
  const {
    width,
    height
  } = xfaPage.attributes.style;
  const viewBox = [0, 0, parseInt(width), parseInt(height)];
  return new PageViewport({
    viewBox,
    scale,
    rotation
  });
}

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.arrayByteLength = arrayByteLength;
exports.arraysToBytes = arraysToBytes;
exports.assert = assert;
exports.bytesToString = bytesToString;
exports.createObjectURL = createObjectURL;
exports.createPromiseCapability = createPromiseCapability;
exports.createValidAbsoluteUrl = createValidAbsoluteUrl;
exports.escapeString = escapeString;
exports.getModificationDate = getModificationDate;
exports.getVerbosityLevel = getVerbosityLevel;
exports.info = info;
exports.isArrayBuffer = isArrayBuffer;
exports.isArrayEqual = isArrayEqual;
exports.isAscii = isAscii;
exports.isBool = isBool;
exports.isNum = isNum;
exports.isSameOrigin = isSameOrigin;
exports.isString = isString;
exports.objectFromMap = objectFromMap;
exports.objectSize = objectSize;
exports.removeNullCharacters = removeNullCharacters;
exports.setVerbosityLevel = setVerbosityLevel;
exports.shadow = shadow;
exports.string32 = string32;
exports.stringToBytes = stringToBytes;
exports.stringToPDFString = stringToPDFString;
exports.stringToUTF16BEString = stringToUTF16BEString;
exports.stringToUTF8String = stringToUTF8String;
exports.unreachable = unreachable;
exports.utf8StringToString = utf8StringToString;
exports.warn = warn;
exports.VerbosityLevel = exports.Util = exports.UNSUPPORTED_FEATURES = exports.UnknownErrorException = exports.UnexpectedResponseException = exports.TextRenderingMode = exports.StreamType = exports.PermissionFlag = exports.PasswordResponses = exports.PasswordException = exports.PageActionEventType = exports.OPS = exports.MissingPDFException = exports.IsLittleEndianCached = exports.IsEvalSupportedCached = exports.InvalidPDFException = exports.ImageKind = exports.IDENTITY_MATRIX = exports.FormatError = exports.FontType = exports.FONT_IDENTITY_MATRIX = exports.DocumentActionEventType = exports.CMapCompressionType = exports.BaseException = exports.AnnotationType = exports.AnnotationStateModelType = exports.AnnotationReviewState = exports.AnnotationReplyType = exports.AnnotationMarkedState = exports.AnnotationFlag = exports.AnnotationFieldFlag = exports.AnnotationBorderStyleType = exports.AnnotationActionEventType = exports.AbortException = void 0;

__w_pdfjs_require__(3);

const IDENTITY_MATRIX = [1, 0, 0, 1, 0, 0];
exports.IDENTITY_MATRIX = IDENTITY_MATRIX;
const FONT_IDENTITY_MATRIX = [0.001, 0, 0, 0.001, 0, 0];
exports.FONT_IDENTITY_MATRIX = FONT_IDENTITY_MATRIX;
const PermissionFlag = {
  PRINT: 0x04,
  MODIFY_CONTENTS: 0x08,
  COPY: 0x10,
  MODIFY_ANNOTATIONS: 0x20,
  FILL_INTERACTIVE_FORMS: 0x100,
  COPY_FOR_ACCESSIBILITY: 0x200,
  ASSEMBLE: 0x400,
  PRINT_HIGH_QUALITY: 0x800
};
exports.PermissionFlag = PermissionFlag;
const TextRenderingMode = {
  FILL: 0,
  STROKE: 1,
  FILL_STROKE: 2,
  INVISIBLE: 3,
  FILL_ADD_TO_PATH: 4,
  STROKE_ADD_TO_PATH: 5,
  FILL_STROKE_ADD_TO_PATH: 6,
  ADD_TO_PATH: 7,
  FILL_STROKE_MASK: 3,
  ADD_TO_PATH_FLAG: 4
};
exports.TextRenderingMode = TextRenderingMode;
const ImageKind = {
  GRAYSCALE_1BPP: 1,
  RGB_24BPP: 2,
  RGBA_32BPP: 3
};
exports.ImageKind = ImageKind;
const AnnotationType = {
  TEXT: 1,
  LINK: 2,
  FREETEXT: 3,
  LINE: 4,
  SQUARE: 5,
  CIRCLE: 6,
  POLYGON: 7,
  POLYLINE: 8,
  HIGHLIGHT: 9,
  UNDERLINE: 10,
  SQUIGGLY: 11,
  STRIKEOUT: 12,
  STAMP: 13,
  CARET: 14,
  INK: 15,
  POPUP: 16,
  FILEATTACHMENT: 17,
  SOUND: 18,
  MOVIE: 19,
  WIDGET: 20,
  SCREEN: 21,
  PRINTERMARK: 22,
  TRAPNET: 23,
  WATERMARK: 24,
  THREED: 25,
  REDACT: 26
};
exports.AnnotationType = AnnotationType;
const AnnotationStateModelType = {
  MARKED: "Marked",
  REVIEW: "Review"
};
exports.AnnotationStateModelType = AnnotationStateModelType;
const AnnotationMarkedState = {
  MARKED: "Marked",
  UNMARKED: "Unmarked"
};
exports.AnnotationMarkedState = AnnotationMarkedState;
const AnnotationReviewState = {
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  NONE: "None"
};
exports.AnnotationReviewState = AnnotationReviewState;
const AnnotationReplyType = {
  GROUP: "Group",
  REPLY: "R"
};
exports.AnnotationReplyType = AnnotationReplyType;
const AnnotationFlag = {
  INVISIBLE: 0x01,
  HIDDEN: 0x02,
  PRINT: 0x04,
  NOZOOM: 0x08,
  NOROTATE: 0x10,
  NOVIEW: 0x20,
  READONLY: 0x40,
  LOCKED: 0x80,
  TOGGLENOVIEW: 0x100,
  LOCKEDCONTENTS: 0x200
};
exports.AnnotationFlag = AnnotationFlag;
const AnnotationFieldFlag = {
  READONLY: 0x0000001,
  REQUIRED: 0x0000002,
  NOEXPORT: 0x0000004,
  MULTILINE: 0x0001000,
  PASSWORD: 0x0002000,
  NOTOGGLETOOFF: 0x0004000,
  RADIO: 0x0008000,
  PUSHBUTTON: 0x0010000,
  COMBO: 0x0020000,
  EDIT: 0x0040000,
  SORT: 0x0080000,
  FILESELECT: 0x0100000,
  MULTISELECT: 0x0200000,
  DONOTSPELLCHECK: 0x0400000,
  DONOTSCROLL: 0x0800000,
  COMB: 0x1000000,
  RICHTEXT: 0x2000000,
  RADIOSINUNISON: 0x2000000,
  COMMITONSELCHANGE: 0x4000000
};
exports.AnnotationFieldFlag = AnnotationFieldFlag;
const AnnotationBorderStyleType = {
  SOLID: 1,
  DASHED: 2,
  BEVELED: 3,
  INSET: 4,
  UNDERLINE: 5
};
exports.AnnotationBorderStyleType = AnnotationBorderStyleType;
const AnnotationActionEventType = {
  E: "Mouse Enter",
  X: "Mouse Exit",
  D: "Mouse Down",
  U: "Mouse Up",
  Fo: "Focus",
  Bl: "Blur",
  PO: "PageOpen",
  PC: "PageClose",
  PV: "PageVisible",
  PI: "PageInvisible",
  K: "Keystroke",
  F: "Format",
  V: "Validate",
  C: "Calculate"
};
exports.AnnotationActionEventType = AnnotationActionEventType;
const DocumentActionEventType = {
  WC: "WillClose",
  WS: "WillSave",
  DS: "DidSave",
  WP: "WillPrint",
  DP: "DidPrint"
};
exports.DocumentActionEventType = DocumentActionEventType;
const PageActionEventType = {
  O: "PageOpen",
  C: "PageClose"
};
exports.PageActionEventType = PageActionEventType;
const StreamType = {
  UNKNOWN: "UNKNOWN",
  FLATE: "FLATE",
  LZW: "LZW",
  DCT: "DCT",
  JPX: "JPX",
  JBIG: "JBIG",
  A85: "A85",
  AHX: "AHX",
  CCF: "CCF",
  RLX: "RLX"
};
exports.StreamType = StreamType;
const FontType = {
  UNKNOWN: "UNKNOWN",
  TYPE1: "TYPE1",
  TYPE1STANDARD: "TYPE1STANDARD",
  TYPE1C: "TYPE1C",
  CIDFONTTYPE0: "CIDFONTTYPE0",
  CIDFONTTYPE0C: "CIDFONTTYPE0C",
  TRUETYPE: "TRUETYPE",
  CIDFONTTYPE2: "CIDFONTTYPE2",
  TYPE3: "TYPE3",
  OPENTYPE: "OPENTYPE",
  TYPE0: "TYPE0",
  MMTYPE1: "MMTYPE1"
};
exports.FontType = FontType;
const VerbosityLevel = {
  ERRORS: 0,
  WARNINGS: 1,
  INFOS: 5
};
exports.VerbosityLevel = VerbosityLevel;
const CMapCompressionType = {
  NONE: 0,
  BINARY: 1,
  STREAM: 2
};
exports.CMapCompressionType = CMapCompressionType;
const OPS = {
  dependency: 1,
  setLineWidth: 2,
  setLineCap: 3,
  setLineJoin: 4,
  setMiterLimit: 5,
  setDash: 6,
  setRenderingIntent: 7,
  setFlatness: 8,
  setGState: 9,
  save: 10,
  restore: 11,
  transform: 12,
  moveTo: 13,
  lineTo: 14,
  curveTo: 15,
  curveTo2: 16,
  curveTo3: 17,
  closePath: 18,
  rectangle: 19,
  stroke: 20,
  closeStroke: 21,
  fill: 22,
  eoFill: 23,
  fillStroke: 24,
  eoFillStroke: 25,
  closeFillStroke: 26,
  closeEOFillStroke: 27,
  endPath: 28,
  clip: 29,
  eoClip: 30,
  beginText: 31,
  endText: 32,
  setCharSpacing: 33,
  setWordSpacing: 34,
  setHScale: 35,
  setLeading: 36,
  setFont: 37,
  setTextRenderingMode: 38,
  setTextRise: 39,
  moveText: 40,
  setLeadingMoveText: 41,
  setTextMatrix: 42,
  nextLine: 43,
  showText: 44,
  showSpacedText: 45,
  nextLineShowText: 46,
  nextLineSetSpacingShowText: 47,
  setCharWidth: 48,
  setCharWidthAndBounds: 49,
  setStrokeColorSpace: 50,
  setFillColorSpace: 51,
  setStrokeColor: 52,
  setStrokeColorN: 53,
  setFillColor: 54,
  setFillColorN: 55,
  setStrokeGray: 56,
  setFillGray: 57,
  setStrokeRGBColor: 58,
  setFillRGBColor: 59,
  setStrokeCMYKColor: 60,
  setFillCMYKColor: 61,
  shadingFill: 62,
  beginInlineImage: 63,
  beginImageData: 64,
  endInlineImage: 65,
  paintXObject: 66,
  markPoint: 67,
  markPointProps: 68,
  beginMarkedContent: 69,
  beginMarkedContentProps: 70,
  endMarkedContent: 71,
  beginCompat: 72,
  endCompat: 73,
  paintFormXObjectBegin: 74,
  paintFormXObjectEnd: 75,
  beginGroup: 76,
  endGroup: 77,
  beginAnnotations: 78,
  endAnnotations: 79,
  beginAnnotation: 80,
  endAnnotation: 81,
  paintJpegXObject: 82,
  paintImageMaskXObject: 83,
  paintImageMaskXObjectGroup: 84,
  paintImageXObject: 85,
  paintInlineImageXObject: 86,
  paintInlineImageXObjectGroup: 87,
  paintImageXObjectRepeat: 88,
  paintImageMaskXObjectRepeat: 89,
  paintSolidColorImageMask: 90,
  constructPath: 91
};
exports.OPS = OPS;
const UNSUPPORTED_FEATURES = {
  unknown: "unknown",
  forms: "forms",
  javaScript: "javaScript",
  signatures: "signatures",
  smask: "smask",
  shadingPattern: "shadingPattern",
  font: "font",
  errorTilingPattern: "errorTilingPattern",
  errorExtGState: "errorExtGState",
  errorXObject: "errorXObject",
  errorFontLoadType3: "errorFontLoadType3",
  errorFontState: "errorFontState",
  errorFontMissing: "errorFontMissing",
  errorFontTranslate: "errorFontTranslate",
  errorColorSpace: "errorColorSpace",
  errorOperatorList: "errorOperatorList",
  errorFontToUnicode: "errorFontToUnicode",
  errorFontLoadNative: "errorFontLoadNative",
  errorFontBuildPath: "errorFontBuildPath",
  errorFontGetPath: "errorFontGetPath",
  errorMarkedContent: "errorMarkedContent"
};
exports.UNSUPPORTED_FEATURES = UNSUPPORTED_FEATURES;
const PasswordResponses = {
  NEED_PASSWORD: 1,
  INCORRECT_PASSWORD: 2
};
exports.PasswordResponses = PasswordResponses;
let verbosity = VerbosityLevel.WARNINGS;

function setVerbosityLevel(level) {
  if (Number.isInteger(level)) {
    verbosity = level;
  }
}

function getVerbosityLevel() {
  return verbosity;
}

function info(msg) {
  if (verbosity >= VerbosityLevel.INFOS) {
    console.log(`Info: ${msg}`);
  }
}

function warn(msg) {
  if (verbosity >= VerbosityLevel.WARNINGS) {
    console.log(`Warning: ${msg}`);
  }
}

function unreachable(msg) {
  throw new Error(msg);
}

function assert(cond, msg) {
  if (!cond) {
    unreachable(msg);
  }
}

function isSameOrigin(baseUrl, otherUrl) {
  let base;

  try {
    base = new URL(baseUrl);

    if (!base.origin || base.origin === "null") {
      return false;
    }
  } catch (e) {
    return false;
  }

  const other = new URL(otherUrl, base);
  return base.origin === other.origin;
}

function _isValidProtocol(url) {
  if (!url) {
    return false;
  }

  switch (url.protocol) {
    case "http:":
    case "https:":
    case "ftp:":
    case "mailto:":
    case "tel:":
      return true;

    default:
      return false;
  }
}

function createValidAbsoluteUrl(url, baseUrl) {
  if (!url) {
    return null;
  }

  try {
    const absoluteUrl = baseUrl ? new URL(url, baseUrl) : new URL(url);

    if (_isValidProtocol(absoluteUrl)) {
      return absoluteUrl;
    }
  } catch (ex) {}

  return null;
}

function shadow(obj, prop, value) {
  Object.defineProperty(obj, prop, {
    value,
    enumerable: true,
    configurable: true,
    writable: false
  });
  return value;
}

const BaseException = function BaseExceptionClosure() {
  function BaseException(message) {
    if (this.constructor === BaseException) {
      unreachable("Cannot initialize BaseException.");
    }

    this.message = message;
    this.name = this.constructor.name;
  }

  BaseException.prototype = new Error();
  BaseException.constructor = BaseException;
  return BaseException;
}();

exports.BaseException = BaseException;

class PasswordException extends BaseException {
  constructor(msg, code) {
    super(msg);
    this.code = code;
  }

}

exports.PasswordException = PasswordException;

class UnknownErrorException extends BaseException {
  constructor(msg, details) {
    super(msg);
    this.details = details;
  }

}

exports.UnknownErrorException = UnknownErrorException;

class InvalidPDFException extends BaseException {}

exports.InvalidPDFException = InvalidPDFException;

class MissingPDFException extends BaseException {}

exports.MissingPDFException = MissingPDFException;

class UnexpectedResponseException extends BaseException {
  constructor(msg, status) {
    super(msg);
    this.status = status;
  }

}

exports.UnexpectedResponseException = UnexpectedResponseException;

class FormatError extends BaseException {}

exports.FormatError = FormatError;

class AbortException extends BaseException {}

exports.AbortException = AbortException;
const NullCharactersRegExp = /\x00/g;

function removeNullCharacters(str) {
  if (typeof str !== "string") {
    warn("The argument for removeNullCharacters must be a string.");
    return str;
  }

  return str.replace(NullCharactersRegExp, "");
}

function bytesToString(bytes) {
  assert(bytes !== null && typeof bytes === "object" && bytes.length !== undefined, "Invalid argument for bytesToString");
  const length = bytes.length;
  const MAX_ARGUMENT_COUNT = 8192;

  if (length < MAX_ARGUMENT_COUNT) {
    return String.fromCharCode.apply(null, bytes);
  }

  const strBuf = [];

  for (let i = 0; i < length; i += MAX_ARGUMENT_COUNT) {
    const chunkEnd = Math.min(i + MAX_ARGUMENT_COUNT, length);
    const chunk = bytes.subarray(i, chunkEnd);
    strBuf.push(String.fromCharCode.apply(null, chunk));
  }

  return strBuf.join("");
}

function stringToBytes(str) {
  assert(typeof str === "string", "Invalid argument for stringToBytes");
  const length = str.length;
  const bytes = new Uint8Array(length);

  for (let i = 0; i < length; ++i) {
    bytes[i] = str.charCodeAt(i) & 0xff;
  }

  return bytes;
}

function arrayByteLength(arr) {
  if (arr.length !== undefined) {
    return arr.length;
  }

  assert(arr.byteLength !== undefined, "arrayByteLength - invalid argument.");
  return arr.byteLength;
}

function arraysToBytes(arr) {
  const length = arr.length;

  if (length === 1 && arr[0] instanceof Uint8Array) {
    return arr[0];
  }

  let resultLength = 0;

  for (let i = 0; i < length; i++) {
    resultLength += arrayByteLength(arr[i]);
  }

  let pos = 0;
  const data = new Uint8Array(resultLength);

  for (let i = 0; i < length; i++) {
    let item = arr[i];

    if (!(item instanceof Uint8Array)) {
      if (typeof item === "string") {
        item = stringToBytes(item);
      } else {
        item = new Uint8Array(item);
      }
    }

    const itemLength = item.byteLength;
    data.set(item, pos);
    pos += itemLength;
  }

  return data;
}

function string32(value) {
  return String.fromCharCode(value >> 24 & 0xff, value >> 16 & 0xff, value >> 8 & 0xff, value & 0xff);
}

function objectSize(obj) {
  return Object.keys(obj).length;
}

function objectFromMap(map) {
  const obj = Object.create(null);

  for (const [key, value] of map) {
    obj[key] = value;
  }

  return obj;
}

function isLittleEndian() {
  const buffer8 = new Uint8Array(4);
  buffer8[0] = 1;
  const view32 = new Uint32Array(buffer8.buffer, 0, 1);
  return view32[0] === 1;
}

const IsLittleEndianCached = {
  get value() {
    return shadow(this, "value", isLittleEndian());
  }

};
exports.IsLittleEndianCached = IsLittleEndianCached;

function isEvalSupported() {
  try {
    new Function("");
    return true;
  } catch (e) {
    return false;
  }
}

const IsEvalSupportedCached = {
  get value() {
    return shadow(this, "value", isEvalSupported());
  }

};
exports.IsEvalSupportedCached = IsEvalSupportedCached;
const hexNumbers = [...Array(256).keys()].map(n => n.toString(16).padStart(2, "0"));

class Util {
  static makeHexColor(r, g, b) {
    return `#${hexNumbers[r]}${hexNumbers[g]}${hexNumbers[b]}`;
  }

  static transform(m1, m2) {
    return [m1[0] * m2[0] + m1[2] * m2[1], m1[1] * m2[0] + m1[3] * m2[1], m1[0] * m2[2] + m1[2] * m2[3], m1[1] * m2[2] + m1[3] * m2[3], m1[0] * m2[4] + m1[2] * m2[5] + m1[4], m1[1] * m2[4] + m1[3] * m2[5] + m1[5]];
  }

  static applyTransform(p, m) {
    const xt = p[0] * m[0] + p[1] * m[2] + m[4];
    const yt = p[0] * m[1] + p[1] * m[3] + m[5];
    return [xt, yt];
  }

  static applyInverseTransform(p, m) {
    const d = m[0] * m[3] - m[1] * m[2];
    const xt = (p[0] * m[3] - p[1] * m[2] + m[2] * m[5] - m[4] * m[3]) / d;
    const yt = (-p[0] * m[1] + p[1] * m[0] + m[4] * m[1] - m[5] * m[0]) / d;
    return [xt, yt];
  }

  static getAxialAlignedBoundingBox(r, m) {
    const p1 = Util.applyTransform(r, m);
    const p2 = Util.applyTransform(r.slice(2, 4), m);
    const p3 = Util.applyTransform([r[0], r[3]], m);
    const p4 = Util.applyTransform([r[2], r[1]], m);
    return [Math.min(p1[0], p2[0], p3[0], p4[0]), Math.min(p1[1], p2[1], p3[1], p4[1]), Math.max(p1[0], p2[0], p3[0], p4[0]), Math.max(p1[1], p2[1], p3[1], p4[1])];
  }

  static inverseTransform(m) {
    const d = m[0] * m[3] - m[1] * m[2];
    return [m[3] / d, -m[1] / d, -m[2] / d, m[0] / d, (m[2] * m[5] - m[4] * m[3]) / d, (m[4] * m[1] - m[5] * m[0]) / d];
  }

  static apply3dTransform(m, v) {
    return [m[0] * v[0] + m[1] * v[1] + m[2] * v[2], m[3] * v[0] + m[4] * v[1] + m[5] * v[2], m[6] * v[0] + m[7] * v[1] + m[8] * v[2]];
  }

  static singularValueDecompose2dScale(m) {
    const transpose = [m[0], m[2], m[1], m[3]];
    const a = m[0] * transpose[0] + m[1] * transpose[2];
    const b = m[0] * transpose[1] + m[1] * transpose[3];
    const c = m[2] * transpose[0] + m[3] * transpose[2];
    const d = m[2] * transpose[1] + m[3] * transpose[3];
    const first = (a + d) / 2;
    const second = Math.sqrt((a + d) ** 2 - 4 * (a * d - c * b)) / 2;
    const sx = first + second || 1;
    const sy = first - second || 1;
    return [Math.sqrt(sx), Math.sqrt(sy)];
  }

  static normalizeRect(rect) {
    const r = rect.slice(0);

    if (rect[0] > rect[2]) {
      r[0] = rect[2];
      r[2] = rect[0];
    }

    if (rect[1] > rect[3]) {
      r[1] = rect[3];
      r[3] = rect[1];
    }

    return r;
  }

  static intersect(rect1, rect2) {
    function compare(a, b) {
      return a - b;
    }

    const orderedX = [rect1[0], rect1[2], rect2[0], rect2[2]].sort(compare);
    const orderedY = [rect1[1], rect1[3], rect2[1], rect2[3]].sort(compare);
    const result = [];
    rect1 = Util.normalizeRect(rect1);
    rect2 = Util.normalizeRect(rect2);

    if (orderedX[0] === rect1[0] && orderedX[1] === rect2[0] || orderedX[0] === rect2[0] && orderedX[1] === rect1[0]) {
      result[0] = orderedX[1];
      result[2] = orderedX[2];
    } else {
      return null;
    }

    if (orderedY[0] === rect1[1] && orderedY[1] === rect2[1] || orderedY[0] === rect2[1] && orderedY[1] === rect1[1]) {
      result[1] = orderedY[1];
      result[3] = orderedY[2];
    } else {
      return null;
    }

    return result;
  }

}

exports.Util = Util;
const PDFStringTranslateTable = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x2d8, 0x2c7, 0x2c6, 0x2d9, 0x2dd, 0x2db, 0x2da, 0x2dc, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x2022, 0x2020, 0x2021, 0x2026, 0x2014, 0x2013, 0x192, 0x2044, 0x2039, 0x203a, 0x2212, 0x2030, 0x201e, 0x201c, 0x201d, 0x2018, 0x2019, 0x201a, 0x2122, 0xfb01, 0xfb02, 0x141, 0x152, 0x160, 0x178, 0x17d, 0x131, 0x142, 0x153, 0x161, 0x17e, 0, 0x20ac];

function stringToPDFString(str) {
  const length = str.length,
        strBuf = [];

  if (str[0] === "\xFE" && str[1] === "\xFF") {
    for (let i = 2; i < length; i += 2) {
      strBuf.push(String.fromCharCode(str.charCodeAt(i) << 8 | str.charCodeAt(i + 1)));
    }
  } else if (str[0] === "\xFF" && str[1] === "\xFE") {
    for (let i = 2; i < length; i += 2) {
      strBuf.push(String.fromCharCode(str.charCodeAt(i + 1) << 8 | str.charCodeAt(i)));
    }
  } else {
    for (let i = 0; i < length; ++i) {
      const code = PDFStringTranslateTable[str.charCodeAt(i)];
      strBuf.push(code ? String.fromCharCode(code) : str.charAt(i));
    }
  }

  return strBuf.join("");
}

function escapeString(str) {
  return str.replace(/([()\\\n\r])/g, match => {
    if (match === "\n") {
      return "\\n";
    } else if (match === "\r") {
      return "\\r";
    }

    return `\\${match}`;
  });
}

function isAscii(str) {
  return /^[\x00-\x7F]*$/.test(str);
}

function stringToUTF16BEString(str) {
  const buf = ["\xFE\xFF"];

  for (let i = 0, ii = str.length; i < ii; i++) {
    const char = str.charCodeAt(i);
    buf.push(String.fromCharCode(char >> 8 & 0xff), String.fromCharCode(char & 0xff));
  }

  return buf.join("");
}

function stringToUTF8String(str) {
  return decodeURIComponent(escape(str));
}

function utf8StringToString(str) {
  return unescape(encodeURIComponent(str));
}

function isBool(v) {
  return typeof v === "boolean";
}

function isNum(v) {
  return typeof v === "number";
}

function isString(v) {
  return typeof v === "string";
}

function isArrayBuffer(v) {
  return typeof v === "object" && v !== null && v.byteLength !== undefined;
}

function isArrayEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0, ii = arr1.length; i < ii; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

function getModificationDate(date = new Date()) {
  const buffer = [date.getUTCFullYear().toString(), (date.getUTCMonth() + 1).toString().padStart(2, "0"), date.getUTCDate().toString().padStart(2, "0"), date.getUTCHours().toString().padStart(2, "0"), date.getUTCMinutes().toString().padStart(2, "0"), date.getUTCSeconds().toString().padStart(2, "0")];
  return buffer.join("");
}

function createPromiseCapability() {
  const capability = Object.create(null);
  let isSettled = false;
  Object.defineProperty(capability, "settled", {
    get() {
      return isSettled;
    }

  });
  capability.promise = new Promise(function (resolve, reject) {
    capability.resolve = function (data) {
      isSettled = true;
      resolve(data);
    };

    capability.reject = function (reason) {
      isSettled = true;
      reject(reason);
    };
  });
  return capability;
}

function createObjectURL(data, contentType = "", forceDataSchema = false) {
  if (URL.createObjectURL && !forceDataSchema) {
    return URL.createObjectURL(new Blob([data], {
      type: contentType
    }));
  }

  const digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let buffer = `data:${contentType};base64,`;

  for (let i = 0, ii = data.length; i < ii; i += 3) {
    const b1 = data[i] & 0xff;
    const b2 = data[i + 1] & 0xff;
    const b3 = data[i + 2] & 0xff;
    const d1 = b1 >> 2,
          d2 = (b1 & 3) << 4 | b2 >> 4;
    const d3 = i + 1 < ii ? (b2 & 0xf) << 2 | b3 >> 6 : 64;
    const d4 = i + 2 < ii ? b3 & 0x3f : 64;
    buffer += digits[d1] + digits[d2] + digits[d3] + digits[d4];
  }

  return buffer;
}

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __unused_webpack_exports, __w_pdfjs_require__) => {



var _is_node = __w_pdfjs_require__(4);

;

/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.isNodeJS = void 0;
const isNodeJS = typeof process === "object" && process + "" === "[object process]" && !process.versions.nw && !(process.versions.electron && process.type && process.type !== "browser");
exports.isNodeJS = isNodeJS;

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BaseSVGFactory = exports.BaseStandardFontDataFactory = exports.BaseCMapReaderFactory = exports.BaseCanvasFactory = void 0;

var _util = __w_pdfjs_require__(2);

class BaseCanvasFactory {
  constructor() {
    if (this.constructor === BaseCanvasFactory) {
      (0, _util.unreachable)("Cannot initialize BaseCanvasFactory.");
    }
  }

  create(width, height) {
    if (width <= 0 || height <= 0) {
      throw new Error("Invalid canvas size");
    }

    const canvas = this._createCanvas(width, height);

    return {
      canvas,
      context: canvas.getContext("2d")
    };
  }

  reset(canvasAndContext, width, height) {
    if (!canvasAndContext.canvas) {
      throw new Error("Canvas is not specified");
    }

    if (width <= 0 || height <= 0) {
      throw new Error("Invalid canvas size");
    }

    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }

  destroy(canvasAndContext) {
    if (!canvasAndContext.canvas) {
      throw new Error("Canvas is not specified");
    }

    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }

  _createCanvas(width, height) {
    (0, _util.unreachable)("Abstract method `_createCanvas` called.");
  }

}

exports.BaseCanvasFactory = BaseCanvasFactory;

class BaseCMapReaderFactory {
  constructor({
    baseUrl = null,
    isCompressed = false
  }) {
    if (this.constructor === BaseCMapReaderFactory) {
      (0, _util.unreachable)("Cannot initialize BaseCMapReaderFactory.");
    }

    this.baseUrl = baseUrl;
    this.isCompressed = isCompressed;
  }

  async fetch({
    name
  }) {
    if (!this.baseUrl) {
      throw new Error('The CMap "baseUrl" parameter must be specified, ensure that ' + 'the "cMapUrl" and "cMapPacked" API parameters are provided.');
    }

    if (!name) {
      throw new Error("CMap name must be specified.");
    }

    const url = this.baseUrl + name + (this.isCompressed ? ".bcmap" : "");
    const compressionType = this.isCompressed ? _util.CMapCompressionType.BINARY : _util.CMapCompressionType.NONE;
    return this._fetchData(url, compressionType).catch(reason => {
      throw new Error(`Unable to load ${this.isCompressed ? "binary " : ""}CMap at: ${url}`);
    });
  }

  _fetchData(url, compressionType) {
    (0, _util.unreachable)("Abstract method `_fetchData` called.");
  }

}

exports.BaseCMapReaderFactory = BaseCMapReaderFactory;

class BaseStandardFontDataFactory {
  constructor({
    baseUrl = null
  }) {
    if (this.constructor === BaseStandardFontDataFactory) {
      (0, _util.unreachable)("Cannot initialize BaseStandardFontDataFactory.");
    }

    this.baseUrl = baseUrl;
  }

  async fetch({
    filename
  }) {
    if (!this.baseUrl) {
      throw new Error('The standard font "baseUrl" parameter must be specified, ensure that ' + 'the "standardFontDataUrl" API parameter is provided.');
    }

    if (!filename) {
      throw new Error("Font filename must be specified.");
    }

    const url = `${this.baseUrl}${filename}`;
    return this._fetchData(url).catch(reason => {
      throw new Error(`Unable to load font data at: ${url}`);
    });
  }

  _fetchData(url) {
    (0, _util.unreachable)("Abstract method `_fetchData` called.");
  }

}

exports.BaseStandardFontDataFactory = BaseStandardFontDataFactory;

class BaseSVGFactory {
  constructor() {
    if (this.constructor === BaseSVGFactory) {
      (0, _util.unreachable)("Cannot initialize BaseSVGFactory.");
    }
  }

  create(width, height) {
    if (width <= 0 || height <= 0) {
      throw new Error("Invalid SVG dimensions");
    }

    const svg = this._createSVG("svg:svg");

    svg.setAttribute("version", "1.1");
    svg.setAttribute("width", `${width}px`);
    svg.setAttribute("height", `${height}px`);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    return svg;
  }

  createElement(type) {
    if (typeof type !== "string") {
      throw new Error("Invalid SVG element type");
    }

    return this._createSVG(type);
  }

  _createSVG(type) {
    (0, _util.unreachable)("Abstract method `_createSVG` called.");
  }

}

exports.BaseSVGFactory = BaseSVGFactory;

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getDocument = getDocument;
exports.setPDFNetworkStreamFactory = setPDFNetworkStreamFactory;
exports.version = exports.PDFWorker = exports.PDFPageProxy = exports.PDFDocumentProxy = exports.PDFDataRangeTransport = exports.LoopbackPort = exports.DefaultStandardFontDataFactory = exports.DefaultCMapReaderFactory = exports.DefaultCanvasFactory = exports.build = void 0;

var _util = __w_pdfjs_require__(2);

var _display_utils = __w_pdfjs_require__(1);

var _font_loader = __w_pdfjs_require__(7);

var _node_utils = __w_pdfjs_require__(8);

var _annotation_storage = __w_pdfjs_require__(9);

var _canvas = __w_pdfjs_require__(10);

var _worker_options = __w_pdfjs_require__(12);

var _is_node = __w_pdfjs_require__(4);

var _message_handler = __w_pdfjs_require__(13);

var _metadata = __w_pdfjs_require__(14);

var _optional_content_config = __w_pdfjs_require__(15);

var _transport_stream = __w_pdfjs_require__(16);

const DEFAULT_RANGE_CHUNK_SIZE = 65536;
const RENDERING_CANCELLED_TIMEOUT = 100;
const DefaultCanvasFactory = _display_utils.DOMCanvasFactory;
exports.DefaultCanvasFactory = DefaultCanvasFactory;
const DefaultCMapReaderFactory = _display_utils.DOMCMapReaderFactory;
exports.DefaultCMapReaderFactory = DefaultCMapReaderFactory;
const DefaultStandardFontDataFactory = _display_utils.DOMStandardFontDataFactory;
exports.DefaultStandardFontDataFactory = DefaultStandardFontDataFactory;
let createPDFNetworkStream;

function setPDFNetworkStreamFactory(pdfNetworkStreamFactory) {
  createPDFNetworkStream = pdfNetworkStreamFactory;
}

function getDocument(src) {
  const task = new PDFDocumentLoadingTask();
  let source;

  if (typeof src === "string" || src instanceof URL) {
    source = {
      url: src
    };
  } else if ((0, _util.isArrayBuffer)(src)) {
    source = {
      data: src
    };
  } else if (src instanceof PDFDataRangeTransport) {
    source = {
      range: src
    };
  } else {
    if (typeof src !== "object") {
      throw new Error("Invalid parameter in getDocument, " + "need either string, URL, Uint8Array, or parameter object.");
    }

    if (!src.url && !src.data && !src.range) {
      throw new Error("Invalid parameter object: need either .data, .range or .url");
    }

    source = src;
  }

  const params = Object.create(null);
  let rangeTransport = null,
      worker = null;

  for (const key in source) {
    const value = source[key];

    switch (key) {
      case "url":
        if (typeof window !== "undefined") {
          try {
            params[key] = new URL(value, window.location).href;
            continue;
          } catch (ex) {
            (0, _util.warn)(`Cannot create valid URL: "${ex}".`);
          }
        } else if (typeof value === "string" || value instanceof URL) {
          params[key] = value.toString();
          continue;
        }

        throw new Error("Invalid PDF url data: " + "either string or URL-object is expected in the url property.");

      case "range":
        rangeTransport = value;
        continue;

      case "worker":
        worker = value;
        continue;

      case "data":
        if (value instanceof Uint8Array) {
          break;
        } else if (typeof value === "string") {
          params[key] = (0, _util.stringToBytes)(value);
        } else if (typeof value === "object" && value !== null && !isNaN(value.length)) {
          params[key] = new Uint8Array(value);
        } else if ((0, _util.isArrayBuffer)(value)) {
          params[key] = new Uint8Array(value);
        } else {
          throw new Error("Invalid PDF binary data: either typed array, " + "string, or array-like object is expected in the data property.");
        }

        continue;
    }

    params[key] = value;
  }

  params.rangeChunkSize = params.rangeChunkSize || DEFAULT_RANGE_CHUNK_SIZE;
  params.CMapReaderFactory = params.CMapReaderFactory || DefaultCMapReaderFactory;
  params.StandardFontDataFactory = params.StandardFontDataFactory || DefaultStandardFontDataFactory;
  params.ignoreErrors = params.stopAtErrors !== true;
  params.fontExtraProperties = params.fontExtraProperties === true;
  params.pdfBug = params.pdfBug === true;
  params.enableXfa = params.enableXfa === true;

  if (typeof params.docBaseUrl !== "string" || (0, _display_utils.isDataScheme)(params.docBaseUrl)) {
    params.docBaseUrl = null;
  }

  if (!Number.isInteger(params.maxImageSize)) {
    params.maxImageSize = -1;
  }

  if (typeof params.useWorkerFetch !== "boolean") {
    params.useWorkerFetch = params.CMapReaderFactory === _display_utils.DOMCMapReaderFactory && params.StandardFontDataFactory === _display_utils.DOMStandardFontDataFactory;
  }

  if (typeof params.isEvalSupported !== "boolean") {
    params.isEvalSupported = true;
  }

  if (typeof params.disableFontFace !== "boolean") {
    params.disableFontFace = false;
  }

  if (typeof params.useSystemFonts !== "boolean") {
    params.useSystemFonts = !params.disableFontFace;
  }

  if (typeof params.ownerDocument === "undefined") {
    params.ownerDocument = globalThis.document;
  }

  if (typeof params.disableRange !== "boolean") {
    params.disableRange = false;
  }

  if (typeof params.disableStream !== "boolean") {
    params.disableStream = false;
  }

  if (typeof params.disableAutoFetch !== "boolean") {
    params.disableAutoFetch = false;
  }

  (0, _util.setVerbosityLevel)(params.verbosity);

  if (!worker) {
    const workerParams = {
      verbosity: params.verbosity,
      port: _worker_options.GlobalWorkerOptions.workerPort
    };
    worker = workerParams.port ? PDFWorker.fromPort(workerParams) : new PDFWorker(workerParams);
    task._worker = worker;
  }

  const docId = task.docId;
  worker.promise.then(function () {
    if (task.destroyed) {
      throw new Error("Loading aborted");
    }

    const workerIdPromise = _fetchDocument(worker, params, rangeTransport, docId);

    const networkStreamPromise = new Promise(function (resolve) {
      let networkStream;

      if (rangeTransport) {
        networkStream = new _transport_stream.PDFDataTransportStream({
          length: params.length,
          initialData: params.initialData,
          progressiveDone: params.progressiveDone,
          contentDispositionFilename: params.contentDispositionFilename,
          disableRange: params.disableRange,
          disableStream: params.disableStream
        }, rangeTransport);
      } else if (!params.data) {
        networkStream = createPDFNetworkStream({
          url: params.url,
          length: params.length,
          httpHeaders: params.httpHeaders,
          withCredentials: params.withCredentials,
          rangeChunkSize: params.rangeChunkSize,
          disableRange: params.disableRange,
          disableStream: params.disableStream
        });
      }

      resolve(networkStream);
    });
    return Promise.all([workerIdPromise, networkStreamPromise]).then(function ([workerId, networkStream]) {
      if (task.destroyed) {
        throw new Error("Loading aborted");
      }

      const messageHandler = new _message_handler.MessageHandler(docId, workerId, worker.port);
      messageHandler.postMessageTransfers = worker.postMessageTransfers;
      const transport = new WorkerTransport(messageHandler, task, networkStream, params);
      task._transport = transport;
      messageHandler.send("Ready", null);
    });
  }).catch(task._capability.reject);
  return task;
}

function _fetchDocument(worker, source, pdfDataRangeTransport, docId) {
  if (worker.destroyed) {
    return Promise.reject(new Error("Worker was destroyed"));
  }

  if (pdfDataRangeTransport) {
    source.length = pdfDataRangeTransport.length;
    source.initialData = pdfDataRangeTransport.initialData;
    source.progressiveDone = pdfDataRangeTransport.progressiveDone;
    source.contentDispositionFilename = pdfDataRangeTransport.contentDispositionFilename;
  }

  return worker.messageHandler.sendWithPromise("GetDocRequest", {
    docId,
    apiVersion: '2.10.339',
    source: {
      data: source.data,
      url: source.url,
      password: source.password,
      disableAutoFetch: source.disableAutoFetch,
      rangeChunkSize: source.rangeChunkSize,
      length: source.length
    },
    maxImageSize: source.maxImageSize,
    disableFontFace: source.disableFontFace,
    postMessageTransfers: worker.postMessageTransfers,
    docBaseUrl: source.docBaseUrl,
    ignoreErrors: source.ignoreErrors,
    isEvalSupported: source.isEvalSupported,
    fontExtraProperties: source.fontExtraProperties,
    enableXfa: source.enableXfa,
    useSystemFonts: source.useSystemFonts,
    cMapUrl: source.useWorkerFetch ? source.cMapUrl : null,
    standardFontDataUrl: source.useWorkerFetch ? source.standardFontDataUrl : null
  }).then(function (workerId) {
    if (worker.destroyed) {
      throw new Error("Worker was destroyed");
    }

    return workerId;
  });
}

const PDFDocumentLoadingTask = function PDFDocumentLoadingTaskClosure() {
  let nextDocumentId = 0;

  class PDFDocumentLoadingTask {
    constructor() {
      this._capability = (0, _util.createPromiseCapability)();
      this._transport = null;
      this._worker = null;
      this.docId = "d" + nextDocumentId++;
      this.destroyed = false;
      this.onPassword = null;
      this.onProgress = null;
      this.onUnsupportedFeature = null;
    }

    get promise() {
      return this._capability.promise;
    }

    destroy() {
      this.destroyed = true;
      const transportDestroyed = !this._transport ? Promise.resolve() : this._transport.destroy();
      return transportDestroyed.then(() => {
        this._transport = null;

        if (this._worker) {
          this._worker.destroy();

          this._worker = null;
        }
      });
    }

  }

  return PDFDocumentLoadingTask;
}();

class PDFDataRangeTransport {
  constructor(length, initialData, progressiveDone = false, contentDispositionFilename = null) {
    this.length = length;
    this.initialData = initialData;
    this.progressiveDone = progressiveDone;
    this.contentDispositionFilename = contentDispositionFilename;
    this._rangeListeners = [];
    this._progressListeners = [];
    this._progressiveReadListeners = [];
    this._progressiveDoneListeners = [];
    this._readyCapability = (0, _util.createPromiseCapability)();
  }

  addRangeListener(listener) {
    this._rangeListeners.push(listener);
  }

  addProgressListener(listener) {
    this._progressListeners.push(listener);
  }

  addProgressiveReadListener(listener) {
    this._progressiveReadListeners.push(listener);
  }

  addProgressiveDoneListener(listener) {
    this._progressiveDoneListeners.push(listener);
  }

  onDataRange(begin, chunk) {
    for (const listener of this._rangeListeners) {
      listener(begin, chunk);
    }
  }

  onDataProgress(loaded, total) {
    this._readyCapability.promise.then(() => {
      for (const listener of this._progressListeners) {
        listener(loaded, total);
      }
    });
  }

  onDataProgressiveRead(chunk) {
    this._readyCapability.promise.then(() => {
      for (const listener of this._progressiveReadListeners) {
        listener(chunk);
      }
    });
  }

  onDataProgressiveDone() {
    this._readyCapability.promise.then(() => {
      for (const listener of this._progressiveDoneListeners) {
        listener();
      }
    });
  }

  transportReady() {
    this._readyCapability.resolve();
  }

  requestDataRange(begin, end) {
    (0, _util.unreachable)("Abstract method PDFDataRangeTransport.requestDataRange");
  }

  abort() {}

}

exports.PDFDataRangeTransport = PDFDataRangeTransport;

class PDFDocumentProxy {
  constructor(pdfInfo, transport) {
    this._pdfInfo = pdfInfo;
    this._transport = transport;
  }

  get annotationStorage() {
    return this._transport.annotationStorage;
  }

  get numPages() {
    return this._pdfInfo.numPages;
  }

  get fingerprints() {
    return this._pdfInfo.fingerprints;
  }

  get isPureXfa() {
    return !!this._transport._htmlForXfa;
  }

  get allXfaHtml() {
    return this._transport._htmlForXfa;
  }

  getPage(pageNumber) {
    return this._transport.getPage(pageNumber);
  }

  getPageIndex(ref) {
    return this._transport.getPageIndex(ref);
  }

  getDestinations() {
    return this._transport.getDestinations();
  }

  getDestination(id) {
    return this._transport.getDestination(id);
  }

  getPageLabels() {
    return this._transport.getPageLabels();
  }

  getPageLayout() {
    return this._transport.getPageLayout();
  }

  getPageMode() {
    return this._transport.getPageMode();
  }

  getViewerPreferences() {
    return this._transport.getViewerPreferences();
  }

  getOpenAction() {
    return this._transport.getOpenAction();
  }

  getAttachments() {
    return this._transport.getAttachments();
  }

  getJavaScript() {
    return this._transport.getJavaScript();
  }

  getJSActions() {
    return this._transport.getDocJSActions();
  }

  getOutline() {
    return this._transport.getOutline();
  }

  getOptionalContentConfig() {
    return this._transport.getOptionalContentConfig();
  }

  getPermissions() {
    return this._transport.getPermissions();
  }

  getMetadata() {
    return this._transport.getMetadata();
  }

  getMarkInfo() {
    return this._transport.getMarkInfo();
  }

  getData() {
    return this._transport.getData();
  }

  getDownloadInfo() {
    return this._transport.downloadInfoCapability.promise;
  }

  getStats() {
    return this._transport.getStats();
  }

  cleanup(keepLoadedFonts = false) {
    return this._transport.startCleanup(keepLoadedFonts || this.isPureXfa);
  }

  destroy() {
    return this.loadingTask.destroy();
  }

  get loadingParams() {
    return this._transport.loadingParams;
  }

  get loadingTask() {
    return this._transport.loadingTask;
  }

  saveDocument() {
    return this._transport.saveDocument();
  }

  getFieldObjects() {
    return this._transport.getFieldObjects();
  }

  hasJSActions() {
    return this._transport.hasJSActions();
  }

  getCalculationOrderIds() {
    return this._transport.getCalculationOrderIds();
  }

}

exports.PDFDocumentProxy = PDFDocumentProxy;

class PDFPageProxy {
  constructor(pageIndex, pageInfo, transport, ownerDocument, pdfBug = false) {
    this._pageIndex = pageIndex;
    this._pageInfo = pageInfo;
    this._ownerDocument = ownerDocument;
    this._transport = transport;
    this._stats = pdfBug ? new _display_utils.StatTimer() : null;
    this._pdfBug = pdfBug;
    this.commonObjs = transport.commonObjs;
    this.objs = new PDFObjects();
    this.cleanupAfterRender = false;
    this.pendingCleanup = false;
    this._intentStates = new Map();
    this.destroyed = false;
  }

  get pageNumber() {
    return this._pageIndex + 1;
  }

  get rotate() {
    return this._pageInfo.rotate;
  }

  get ref() {
    return this._pageInfo.ref;
  }

  get userUnit() {
    return this._pageInfo.userUnit;
  }

  get view() {
    return this._pageInfo.view;
  }

  getViewport({
    scale,
    rotation = this.rotate,
    offsetX = 0,
    offsetY = 0,
    dontFlip = false
  } = {}) {
    return new _display_utils.PageViewport({
      viewBox: this.view,
      scale,
      rotation,
      offsetX,
      offsetY,
      dontFlip
    });
  }

  getAnnotations({
    intent = null
  } = {}) {
    const renderingIntent = intent === "display" || intent === "print" ? intent : null;

    if (!this._annotationsPromise || this._annotationsIntent !== renderingIntent) {
      this._annotationsPromise = this._transport.getAnnotations(this._pageIndex, renderingIntent);
      this._annotationsIntent = renderingIntent;
    }

    return this._annotationsPromise;
  }

  getJSActions() {
    return this._jsActionsPromise ||= this._transport.getPageJSActions(this._pageIndex);
  }

  async getXfa() {
    return this._transport._htmlForXfa?.children[this._pageIndex] || null;
  }

  render({
    canvasContext,
    viewport,
    intent = "display",
    renderInteractiveForms = false,
    transform = null,
    imageLayer = null,
    canvasFactory = null,
    background = null,
    includeAnnotationStorage = false,
    optionalContentConfigPromise = null
  }) {
    if (this._stats) {
      this._stats.time("Overall");
    }

    const renderingIntent = intent === "print" ? "print" : "display";
    this.pendingCleanup = false;

    if (!optionalContentConfigPromise) {
      optionalContentConfigPromise = this._transport.getOptionalContentConfig();
    }

    let intentState = this._intentStates.get(renderingIntent);

    if (!intentState) {
      intentState = Object.create(null);

      this._intentStates.set(renderingIntent, intentState);
    }

    if (intentState.streamReaderCancelTimeout) {
      clearTimeout(intentState.streamReaderCancelTimeout);
      intentState.streamReaderCancelTimeout = null;
    }

    const canvasFactoryInstance = canvasFactory || new DefaultCanvasFactory({
      ownerDocument: this._ownerDocument
    });
    const annotationStorage = includeAnnotationStorage ? this._transport.annotationStorage.serializable : null;

    if (!intentState.displayReadyCapability) {
      intentState.displayReadyCapability = (0, _util.createPromiseCapability)();
      intentState.operatorList = {
        fnArray: [],
        argsArray: [],
        lastChunk: false
      };

      if (this._stats) {
        this._stats.time("Page Request");
      }

      this._pumpOperatorList({
        pageIndex: this._pageIndex,
        intent: renderingIntent,
        renderInteractiveForms: renderInteractiveForms === true,
        annotationStorage
      });
    }

    const complete = error => {
      intentState.renderTasks.delete(internalRenderTask);

      if (this.cleanupAfterRender || renderingIntent === "print") {
        this.pendingCleanup = true;
      }

      this._tryCleanup();

      if (error) {
        internalRenderTask.capability.reject(error);

        this._abortOperatorList({
          intentState,
          reason: error
        });
      } else {
        internalRenderTask.capability.resolve();
      }

      if (this._stats) {
        this._stats.timeEnd("Rendering");

        this._stats.timeEnd("Overall");
      }
    };

    const internalRenderTask = new InternalRenderTask({
      callback: complete,
      params: {
        canvasContext,
        viewport,
        transform,
        imageLayer,
        background
      },
      objs: this.objs,
      commonObjs: this.commonObjs,
      operatorList: intentState.operatorList,
      pageIndex: this._pageIndex,
      canvasFactory: canvasFactoryInstance,
      useRequestAnimationFrame: renderingIntent !== "print",
      pdfBug: this._pdfBug
    });
    (intentState.renderTasks ||= new Set()).add(internalRenderTask);
    const renderTask = internalRenderTask.task;
    Promise.all([intentState.displayReadyCapability.promise, optionalContentConfigPromise]).then(([transparency, optionalContentConfig]) => {
      if (this.pendingCleanup) {
        complete();
        return;
      }

      if (this._stats) {
        this._stats.time("Rendering");
      }

      internalRenderTask.initializeGraphics({
        transparency,
        optionalContentConfig
      });
      internalRenderTask.operatorListChanged();
    }).catch(complete);
    return renderTask;
  }

  getOperatorList({
    intent = "display"
  } = {}) {
    function operatorListChanged() {
      if (intentState.operatorList.lastChunk) {
        intentState.opListReadCapability.resolve(intentState.operatorList);
        intentState.renderTasks.delete(opListTask);
      }
    }

    const renderingIntent = `oplist-${intent === "print" ? "print" : "display"}`;

    let intentState = this._intentStates.get(renderingIntent);

    if (!intentState) {
      intentState = Object.create(null);

      this._intentStates.set(renderingIntent, intentState);
    }

    let opListTask;

    if (!intentState.opListReadCapability) {
      opListTask = Object.create(null);
      opListTask.operatorListChanged = operatorListChanged;
      intentState.opListReadCapability = (0, _util.createPromiseCapability)();
      (intentState.renderTasks ||= new Set()).add(opListTask);
      intentState.operatorList = {
        fnArray: [],
        argsArray: [],
        lastChunk: false
      };

      if (this._stats) {
        this._stats.time("Page Request");
      }

      this._pumpOperatorList({
        pageIndex: this._pageIndex,
        intent: renderingIntent
      });
    }

    return intentState.opListReadCapability.promise;
  }

  streamTextContent({
    normalizeWhitespace = false,
    disableCombineTextItems = false,
    includeMarkedContent = false
  } = {}) {
    const TEXT_CONTENT_CHUNK_SIZE = 100;
    return this._transport.messageHandler.sendWithStream("GetTextContent", {
      pageIndex: this._pageIndex,
      normalizeWhitespace: normalizeWhitespace === true,
      combineTextItems: disableCombineTextItems !== true,
      includeMarkedContent: includeMarkedContent === true
    }, {
      highWaterMark: TEXT_CONTENT_CHUNK_SIZE,

      size(textContent) {
        return textContent.items.length;
      }

    });
  }

  getTextContent(params = {}) {
    const readableStream = this.streamTextContent(params);
    return new Promise(function (resolve, reject) {
      function pump() {
        reader.read().then(function ({
          value,
          done
        }) {
          if (done) {
            resolve(textContent);
            return;
          }

          Object.assign(textContent.styles, value.styles);
          textContent.items.push(...value.items);
          pump();
        }, reject);
      }

      const reader = readableStream.getReader();
      const textContent = {
        items: [],
        styles: Object.create(null)
      };
      pump();
    });
  }

  getStructTree() {
    return this._structTreePromise ||= this._transport.getStructTree(this._pageIndex);
  }

  _destroy() {
    this.destroyed = true;
    this._transport.pageCache[this._pageIndex] = null;
    const waitOn = [];

    for (const [intent, intentState] of this._intentStates) {
      this._abortOperatorList({
        intentState,
        reason: new Error("Page was destroyed."),
        force: true
      });

      if (intent.startsWith("oplist-")) {
        continue;
      }

      for (const internalRenderTask of intentState.renderTasks) {
        waitOn.push(internalRenderTask.completed);
        internalRenderTask.cancel();
      }
    }

    this.objs.clear();
    this._annotationsPromise = null;
    this._jsActionsPromise = null;
    this._structTreePromise = null;
    this.pendingCleanup = false;
    return Promise.all(waitOn);
  }

  cleanup(resetStats = false) {
    this.pendingCleanup = true;
    return this._tryCleanup(resetStats);
  }

  _tryCleanup(resetStats = false) {
    if (!this.pendingCleanup) {
      return false;
    }

    for (const {
      renderTasks,
      operatorList
    } of this._intentStates.values()) {
      if (renderTasks.size > 0 || !operatorList.lastChunk) {
        return false;
      }
    }

    this._intentStates.clear();

    this.objs.clear();
    this._annotationsPromise = null;
    this._jsActionsPromise = null;
    this._structTreePromise = null;

    if (resetStats && this._stats) {
      this._stats = new _display_utils.StatTimer();
    }

    this.pendingCleanup = false;
    return true;
  }

  _startRenderPage(transparency, intent) {
    const intentState = this._intentStates.get(intent);

    if (!intentState) {
      return;
    }

    if (this._stats) {
      this._stats.timeEnd("Page Request");
    }

    if (intentState.displayReadyCapability) {
      intentState.displayReadyCapability.resolve(transparency);
    }
  }

  _renderPageChunk(operatorListChunk, intentState) {
    for (let i = 0, ii = operatorListChunk.length; i < ii; i++) {
      intentState.operatorList.fnArray.push(operatorListChunk.fnArray[i]);
      intentState.operatorList.argsArray.push(operatorListChunk.argsArray[i]);
    }

    intentState.operatorList.lastChunk = operatorListChunk.lastChunk;

    for (const internalRenderTask of intentState.renderTasks) {
      internalRenderTask.operatorListChanged();
    }

    if (operatorListChunk.lastChunk) {
      this._tryCleanup();
    }
  }

  _pumpOperatorList(args) {
    (0, _util.assert)(args.intent, 'PDFPageProxy._pumpOperatorList: Expected "intent" argument.');

    const readableStream = this._transport.messageHandler.sendWithStream("GetOperatorList", args);

    const reader = readableStream.getReader();

    const intentState = this._intentStates.get(args.intent);

    intentState.streamReader = reader;

    const pump = () => {
      reader.read().then(({
        value,
        done
      }) => {
        if (done) {
          intentState.streamReader = null;
          return;
        }

        if (this._transport.destroyed) {
          return;
        }

        this._renderPageChunk(value, intentState);

        pump();
      }, reason => {
        intentState.streamReader = null;

        if (this._transport.destroyed) {
          return;
        }

        if (intentState.operatorList) {
          intentState.operatorList.lastChunk = true;

          for (const internalRenderTask of intentState.renderTasks) {
            internalRenderTask.operatorListChanged();
          }

          this._tryCleanup();
        }

        if (intentState.displayReadyCapability) {
          intentState.displayReadyCapability.reject(reason);
        } else if (intentState.opListReadCapability) {
          intentState.opListReadCapability.reject(reason);
        } else {
          throw reason;
        }
      });
    };

    pump();
  }

  _abortOperatorList({
    intentState,
    reason,
    force = false
  }) {
    (0, _util.assert)(reason instanceof Error || typeof reason === "object" && reason !== null, 'PDFPageProxy._abortOperatorList: Expected "reason" argument.');

    if (!intentState.streamReader) {
      return;
    }

    if (!force) {
      if (intentState.renderTasks.size > 0) {
        return;
      }

      if (reason instanceof _display_utils.RenderingCancelledException) {
        intentState.streamReaderCancelTimeout = setTimeout(() => {
          this._abortOperatorList({
            intentState,
            reason,
            force: true
          });

          intentState.streamReaderCancelTimeout = null;
        }, RENDERING_CANCELLED_TIMEOUT);
        return;
      }
    }

    intentState.streamReader.cancel(new _util.AbortException(reason?.message));
    intentState.streamReader = null;

    if (this._transport.destroyed) {
      return;
    }

    for (const [intent, curIntentState] of this._intentStates) {
      if (curIntentState === intentState) {
        this._intentStates.delete(intent);

        break;
      }
    }

    this.cleanup();
  }

  get stats() {
    return this._stats;
  }

}

exports.PDFPageProxy = PDFPageProxy;

class LoopbackPort {
  constructor() {
    this._listeners = [];
    this._deferred = Promise.resolve(undefined);
  }

  postMessage(obj, transfers) {
    function cloneValue(value) {
      if (typeof value === "function" || typeof value === "symbol" || value instanceof URL) {
        throw new Error(`LoopbackPort.postMessage - cannot clone: ${value?.toString()}`);
      }

      if (typeof value !== "object" || value === null) {
        return value;
      }

      if (cloned.has(value)) {
        return cloned.get(value);
      }

      let buffer, result;

      if ((buffer = value.buffer) && (0, _util.isArrayBuffer)(buffer)) {
        if (transfers?.includes(buffer)) {
          result = new value.constructor(buffer, value.byteOffset, value.byteLength);
        } else {
          result = new value.constructor(value);
        }

        cloned.set(value, result);
        return result;
      }

      if (value instanceof Map) {
        result = new Map();
        cloned.set(value, result);

        for (const [key, val] of value) {
          result.set(key, cloneValue(val));
        }

        return result;
      }

      if (value instanceof Set) {
        result = new Set();
        cloned.set(value, result);

        for (const val of value) {
          result.add(cloneValue(val));
        }

        return result;
      }

      result = Array.isArray(value) ? [] : Object.create(null);
      cloned.set(value, result);

      for (const i in value) {
        let desc,
            p = value;

        while (!(desc = Object.getOwnPropertyDescriptor(p, i))) {
          p = Object.getPrototypeOf(p);
        }

        if (typeof desc.value === "undefined") {
          continue;
        }

        if (typeof desc.value === "function" && !value.hasOwnProperty?.(i)) {
          continue;
        }

        result[i] = cloneValue(desc.value);
      }

      return result;
    }

    const cloned = new WeakMap();
    const event = {
      data: cloneValue(obj)
    };

    this._deferred.then(() => {
      for (const listener of this._listeners) {
        listener.call(this, event);
      }
    });
  }

  addEventListener(name, listener) {
    this._listeners.push(listener);
  }

  removeEventListener(name, listener) {
    const i = this._listeners.indexOf(listener);

    this._listeners.splice(i, 1);
  }

  terminate() {
    this._listeners.length = 0;
  }

}

exports.LoopbackPort = LoopbackPort;

const PDFWorker = function PDFWorkerClosure() {
  const pdfWorkerPorts = new WeakMap();
  let isWorkerDisabled = false;
  let fallbackWorkerSrc;
  let nextFakeWorkerId = 0;
  let fakeWorkerCapability;

  function getWorkerSrc() {
    if (_worker_options.GlobalWorkerOptions.workerSrc) {
      return _worker_options.GlobalWorkerOptions.workerSrc;
    }

    if (typeof fallbackWorkerSrc !== "undefined") {
      if (!_is_node.isNodeJS) {
        (0, _display_utils.deprecated)('No "GlobalWorkerOptions.workerSrc" specified.');
      }

      return fallbackWorkerSrc;
    }

    throw new Error('No "GlobalWorkerOptions.workerSrc" specified.');
  }

  function getMainThreadWorkerMessageHandler() {
    let mainWorkerMessageHandler;

    try {
      mainWorkerMessageHandler = globalThis.pdfjsWorker?.WorkerMessageHandler;
    } catch (ex) {}

    return mainWorkerMessageHandler || null;
  }

  function setupFakeWorkerGlobal() {
    if (fakeWorkerCapability) {
      return fakeWorkerCapability.promise;
    }

    fakeWorkerCapability = (0, _util.createPromiseCapability)();

    const loader = async function () {
      const mainWorkerMessageHandler = getMainThreadWorkerMessageHandler();

      if (mainWorkerMessageHandler) {
        return mainWorkerMessageHandler;
      }

      await (0, _display_utils.loadScript)(getWorkerSrc());
      return window.pdfjsWorker.WorkerMessageHandler;
    };

    loader().then(fakeWorkerCapability.resolve, fakeWorkerCapability.reject);
    return fakeWorkerCapability.promise;
  }

  function createCDNWrapper(url) {
    const wrapper = "importScripts('" + url + "');";
    return URL.createObjectURL(new Blob([wrapper]));
  }

  class PDFWorker {
    constructor({
      name = null,
      port = null,
      verbosity = (0, _util.getVerbosityLevel)()
    } = {}) {
      if (port && pdfWorkerPorts.has(port)) {
        throw new Error("Cannot use more than one PDFWorker per port");
      }

      this.name = name;
      this.destroyed = false;
      this.postMessageTransfers = true;
      this.verbosity = verbosity;
      this._readyCapability = (0, _util.createPromiseCapability)();
      this._port = null;
      this._webWorker = null;
      this._messageHandler = null;

      if (port) {
        pdfWorkerPorts.set(port, this);

        this._initializeFromPort(port);

        return;
      }

      this._initialize();
    }

    get promise() {
      return this._readyCapability.promise;
    }

    get port() {
      return this._port;
    }

    get messageHandler() {
      return this._messageHandler;
    }

    _initializeFromPort(port) {
      this._port = port;
      this._messageHandler = new _message_handler.MessageHandler("main", "worker", port);

      this._messageHandler.on("ready", function () {});

      this._readyCapability.resolve();
    }

    _initialize() {
      if (typeof Worker !== "undefined" && !isWorkerDisabled && !getMainThreadWorkerMessageHandler()) {
        let workerSrc = getWorkerSrc();

        try {
          const worker = new Worker(workerSrc);
          const messageHandler = new _message_handler.MessageHandler("main", "worker", worker);

          const terminateEarly = () => {
            worker.removeEventListener("error", onWorkerError);
            messageHandler.destroy();
            worker.terminate();

            if (this.destroyed) {
              this._readyCapability.reject(new Error("Worker was destroyed"));
            } else {
              this._setupFakeWorker();
            }
          };

          const onWorkerError = () => {
            if (!this._webWorker) {
              terminateEarly();
            }
          };

          worker.addEventListener("error", onWorkerError);
          messageHandler.on("test", data => {
            worker.removeEventListener("error", onWorkerError);

            if (this.destroyed) {
              terminateEarly();
              return;
            }

            if (data) {
              this._messageHandler = messageHandler;
              this._port = worker;
              this._webWorker = worker;

              if (!data.supportTransfers) {
                this.postMessageTransfers = false;
              }

              this._readyCapability.resolve();

              messageHandler.send("configure", {
                verbosity: this.verbosity
              });
            } else {
              this._setupFakeWorker();

              messageHandler.destroy();
              worker.terminate();
            }
          });
          messageHandler.on("ready", data => {
            worker.removeEventListener("error", onWorkerError);

            if (this.destroyed) {
              terminateEarly();
              return;
            }

            try {
              sendTest();
            } catch (e) {
              this._setupFakeWorker();
            }
          });

          const sendTest = () => {
            const testObj = new Uint8Array([this.postMessageTransfers ? 255 : 0]);

            try {
              messageHandler.send("test", testObj, [testObj.buffer]);
            } catch (ex) {
              (0, _util.warn)("Cannot use postMessage transfers.");
              testObj[0] = 0;
              messageHandler.send("test", testObj);
            }
          };

          sendTest();
          return;
        } catch (e) {
          (0, _util.info)("The worker has been disabled.");
        }
      }

      this._setupFakeWorker();
    }

    _setupFakeWorker() {
      if (!isWorkerDisabled) {
        (0, _util.warn)("Setting up fake worker.");
        isWorkerDisabled = true;
      }

      setupFakeWorkerGlobal().then(WorkerMessageHandler => {
        if (this.destroyed) {
          this._readyCapability.reject(new Error("Worker was destroyed"));

          return;
        }

        const port = new LoopbackPort();
        this._port = port;
        const id = "fake" + nextFakeWorkerId++;
        const workerHandler = new _message_handler.MessageHandler(id + "_worker", id, port);
        WorkerMessageHandler.setup(workerHandler, port);
        const messageHandler = new _message_handler.MessageHandler(id, id + "_worker", port);
        this._messageHandler = messageHandler;

        this._readyCapability.resolve();

        messageHandler.send("configure", {
          verbosity: this.verbosity
        });
      }).catch(reason => {
        this._readyCapability.reject(new Error(`Setting up fake worker failed: "${reason.message}".`));
      });
    }

    destroy() {
      this.destroyed = true;

      if (this._webWorker) {
        this._webWorker.terminate();

        this._webWorker = null;
      }

      pdfWorkerPorts.delete(this._port);
      this._port = null;

      if (this._messageHandler) {
        this._messageHandler.destroy();

        this._messageHandler = null;
      }
    }

    static fromPort(params) {
      if (!params || !params.port) {
        throw new Error("PDFWorker.fromPort - invalid method signature.");
      }

      if (pdfWorkerPorts.has(params.port)) {
        return pdfWorkerPorts.get(params.port);
      }

      return new PDFWorker(params);
    }

    static getWorkerSrc() {
      return getWorkerSrc();
    }

  }

  return PDFWorker;
}();

exports.PDFWorker = PDFWorker;

class WorkerTransport {
  constructor(messageHandler, loadingTask, networkStream, params) {
    this.messageHandler = messageHandler;
    this.loadingTask = loadingTask;
    this.commonObjs = new PDFObjects();
    this.fontLoader = new _font_loader.FontLoader({
      docId: loadingTask.docId,
      onUnsupportedFeature: this._onUnsupportedFeature.bind(this),
      ownerDocument: params.ownerDocument,
      styleElement: params.styleElement
    });
    this._params = params;

    if (!params.useWorkerFetch) {
      this.CMapReaderFactory = new params.CMapReaderFactory({
        baseUrl: params.cMapUrl,
        isCompressed: params.cMapPacked
      });
      this.StandardFontDataFactory = new params.StandardFontDataFactory({
        baseUrl: params.standardFontDataUrl
      });
    }

    this.destroyed = false;
    this.destroyCapability = null;
    this._passwordCapability = null;
    this._networkStream = networkStream;
    this._fullReader = null;
    this._lastProgress = null;
    this.pageCache = [];
    this.pagePromises = [];
    this.downloadInfoCapability = (0, _util.createPromiseCapability)();
    this.setupMessageHandler();
  }

  get annotationStorage() {
    return (0, _util.shadow)(this, "annotationStorage", new _annotation_storage.AnnotationStorage());
  }

  destroy() {
    if (this.destroyCapability) {
      return this.destroyCapability.promise;
    }

    this.destroyed = true;
    this.destroyCapability = (0, _util.createPromiseCapability)();

    if (this._passwordCapability) {
      this._passwordCapability.reject(new Error("Worker was destroyed during onPassword callback"));
    }

    const waitOn = [];

    for (const page of this.pageCache) {
      if (page) {
        waitOn.push(page._destroy());
      }
    }

    this.pageCache.length = 0;
    this.pagePromises.length = 0;

    if (this.hasOwnProperty("annotationStorage")) {
      this.annotationStorage.resetModified();
    }

    const terminated = this.messageHandler.sendWithPromise("Terminate", null);
    waitOn.push(terminated);
    Promise.all(waitOn).then(() => {
      this.commonObjs.clear();
      this.fontLoader.clear();
      this._hasJSActionsPromise = null;

      if (this._networkStream) {
        this._networkStream.cancelAllRequests(new _util.AbortException("Worker was terminated."));
      }

      if (this.messageHandler) {
        this.messageHandler.destroy();
        this.messageHandler = null;
      }

      this.destroyCapability.resolve();
    }, this.destroyCapability.reject);
    return this.destroyCapability.promise;
  }

  setupMessageHandler() {
    const {
      messageHandler,
      loadingTask
    } = this;
    messageHandler.on("GetReader", (data, sink) => {
      (0, _util.assert)(this._networkStream, "GetReader - no `IPDFStream` instance available.");
      this._fullReader = this._networkStream.getFullReader();

      this._fullReader.onProgress = evt => {
        this._lastProgress = {
          loaded: evt.loaded,
          total: evt.total
        };
      };

      sink.onPull = () => {
        this._fullReader.read().then(function ({
          value,
          done
        }) {
          if (done) {
            sink.close();
            return;
          }

          (0, _util.assert)((0, _util.isArrayBuffer)(value), "GetReader - expected an ArrayBuffer.");
          sink.enqueue(new Uint8Array(value), 1, [value]);
        }).catch(reason => {
          sink.error(reason);
        });
      };

      sink.onCancel = reason => {
        this._fullReader.cancel(reason);

        sink.ready.catch(readyReason => {
          if (this.destroyed) {
            return;
          }

          throw readyReason;
        });
      };
    });
    messageHandler.on("ReaderHeadersReady", data => {
      const headersCapability = (0, _util.createPromiseCapability)();
      const fullReader = this._fullReader;
      fullReader.headersReady.then(() => {
        if (!fullReader.isStreamingSupported || !fullReader.isRangeSupported) {
          if (this._lastProgress && loadingTask.onProgress) {
            loadingTask.onProgress(this._lastProgress);
          }

          fullReader.onProgress = evt => {
            if (loadingTask.onProgress) {
              loadingTask.onProgress({
                loaded: evt.loaded,
                total: evt.total
              });
            }
          };
        }

        headersCapability.resolve({
          isStreamingSupported: fullReader.isStreamingSupported,
          isRangeSupported: fullReader.isRangeSupported,
          contentLength: fullReader.contentLength
        });
      }, headersCapability.reject);
      return headersCapability.promise;
    });
    messageHandler.on("GetRangeReader", (data, sink) => {
      (0, _util.assert)(this._networkStream, "GetRangeReader - no `IPDFStream` instance available.");

      const rangeReader = this._networkStream.getRangeReader(data.begin, data.end);

      if (!rangeReader) {
        sink.close();
        return;
      }

      sink.onPull = () => {
        rangeReader.read().then(function ({
          value,
          done
        }) {
          if (done) {
            sink.close();
            return;
          }

          (0, _util.assert)((0, _util.isArrayBuffer)(value), "GetRangeReader - expected an ArrayBuffer.");
          sink.enqueue(new Uint8Array(value), 1, [value]);
        }).catch(reason => {
          sink.error(reason);
        });
      };

      sink.onCancel = reason => {
        rangeReader.cancel(reason);
        sink.ready.catch(readyReason => {
          if (this.destroyed) {
            return;
          }

          throw readyReason;
        });
      };
    });
    messageHandler.on("GetDoc", ({
      pdfInfo
    }) => {
      this._numPages = pdfInfo.numPages;
      this._htmlForXfa = pdfInfo.htmlForXfa;
      delete pdfInfo.htmlForXfa;

      loadingTask._capability.resolve(new PDFDocumentProxy(pdfInfo, this));
    });
    messageHandler.on("DocException", function (ex) {
      let reason;

      switch (ex.name) {
        case "PasswordException":
          reason = new _util.PasswordException(ex.message, ex.code);
          break;

        case "InvalidPDFException":
          reason = new _util.InvalidPDFException(ex.message);
          break;

        case "MissingPDFException":
          reason = new _util.MissingPDFException(ex.message);
          break;

        case "UnexpectedResponseException":
          reason = new _util.UnexpectedResponseException(ex.message, ex.status);
          break;

        case "UnknownErrorException":
          reason = new _util.UnknownErrorException(ex.message, ex.details);
          break;
      }

      if (!(reason instanceof Error)) {
        const msg = "DocException - expected a valid Error.";
        (0, _util.warn)(msg);
      }

      loadingTask._capability.reject(reason);
    });
    messageHandler.on("PasswordRequest", exception => {
      this._passwordCapability = (0, _util.createPromiseCapability)();

      if (loadingTask.onPassword) {
        const updatePassword = password => {
          this._passwordCapability.resolve({
            password
          });
        };

        try {
          loadingTask.onPassword(updatePassword, exception.code);
        } catch (ex) {
          this._passwordCapability.reject(ex);
        }
      } else {
        this._passwordCapability.reject(new _util.PasswordException(exception.message, exception.code));
      }

      return this._passwordCapability.promise;
    });
    messageHandler.on("DataLoaded", data => {
      if (loadingTask.onProgress) {
        loadingTask.onProgress({
          loaded: data.length,
          total: data.length
        });
      }

      this.downloadInfoCapability.resolve(data);
    });
    messageHandler.on("StartRenderPage", data => {
      if (this.destroyed) {
        return;
      }

      const page = this.pageCache[data.pageIndex];

      page._startRenderPage(data.transparency, data.intent);
    });
    messageHandler.on("commonobj", data => {
      if (this.destroyed) {
        return;
      }

      const [id, type, exportedData] = data;

      if (this.commonObjs.has(id)) {
        return;
      }

      switch (type) {
        case "Font":
          const params = this._params;

          if ("error" in exportedData) {
            const exportedError = exportedData.error;
            (0, _util.warn)(`Error during font loading: ${exportedError}`);
            this.commonObjs.resolve(id, exportedError);
            break;
          }

          let fontRegistry = null;

          if (params.pdfBug && globalThis.FontInspector?.enabled) {
            fontRegistry = {
              registerFont(font, url) {
                globalThis.FontInspector.fontAdded(font, url);
              }

            };
          }

          const font = new _font_loader.FontFaceObject(exportedData, {
            isEvalSupported: params.isEvalSupported,
            disableFontFace: params.disableFontFace,
            ignoreErrors: params.ignoreErrors,
            onUnsupportedFeature: this._onUnsupportedFeature.bind(this),
            fontRegistry
          });
          this.fontLoader.bind(font).catch(reason => {
            return messageHandler.sendWithPromise("FontFallback", {
              id
            });
          }).finally(() => {
            if (!params.fontExtraProperties && font.data) {
              font.data = null;
            }

            this.commonObjs.resolve(id, font);
          });
          break;

        case "FontPath":
        case "Image":
          this.commonObjs.resolve(id, exportedData);
          break;

        default:
          throw new Error(`Got unknown common object type ${type}`);
      }
    });
    messageHandler.on("obj", data => {
      if (this.destroyed) {
        return undefined;
      }

      const [id, pageIndex, type, imageData] = data;
      const pageProxy = this.pageCache[pageIndex];

      if (pageProxy.objs.has(id)) {
        return undefined;
      }

      switch (type) {
        case "Image":
          pageProxy.objs.resolve(id, imageData);
          const MAX_IMAGE_SIZE_TO_STORE = 8000000;

          if (imageData?.data?.length > MAX_IMAGE_SIZE_TO_STORE) {
            pageProxy.cleanupAfterRender = true;
          }

          break;

        default:
          throw new Error(`Got unknown object type ${type}`);
      }

      return undefined;
    });
    messageHandler.on("DocProgress", data => {
      if (this.destroyed) {
        return;
      }

      if (loadingTask.onProgress) {
        loadingTask.onProgress({
          loaded: data.loaded,
          total: data.total
        });
      }
    });
    messageHandler.on("UnsupportedFeature", this._onUnsupportedFeature.bind(this));
    messageHandler.on("FetchBuiltInCMap", data => {
      if (this.destroyed) {
        return Promise.reject(new Error("Worker was destroyed."));
      }

      if (!this.CMapReaderFactory) {
        return Promise.reject(new Error("CMapReaderFactory not initialized, see the `useWorkerFetch` parameter."));
      }

      return this.CMapReaderFactory.fetch(data);
    });
    messageHandler.on("FetchStandardFontData", data => {
      if (this.destroyed) {
        return Promise.reject(new Error("Worker was destroyed."));
      }

      if (!this.StandardFontDataFactory) {
        return Promise.reject(new Error("StandardFontDataFactory not initialized, see the `useWorkerFetch` parameter."));
      }

      return this.StandardFontDataFactory.fetch(data);
    });
  }

  _onUnsupportedFeature({
    featureId
  }) {
    if (this.destroyed) {
      return;
    }

    if (this.loadingTask.onUnsupportedFeature) {
      this.loadingTask.onUnsupportedFeature(featureId);
    }
  }

  getData() {
    return this.messageHandler.sendWithPromise("GetData", null);
  }

  getPage(pageNumber) {
    if (!Number.isInteger(pageNumber) || pageNumber <= 0 || pageNumber > this._numPages) {
      return Promise.reject(new Error("Invalid page request"));
    }

    const pageIndex = pageNumber - 1;

    if (pageIndex in this.pagePromises) {
      return this.pagePromises[pageIndex];
    }

    const promise = this.messageHandler.sendWithPromise("GetPage", {
      pageIndex
    }).then(pageInfo => {
      if (this.destroyed) {
        throw new Error("Transport destroyed");
      }

      const page = new PDFPageProxy(pageIndex, pageInfo, this, this._params.ownerDocument, this._params.pdfBug);
      this.pageCache[pageIndex] = page;
      return page;
    });
    this.pagePromises[pageIndex] = promise;
    return promise;
  }

  getPageIndex(ref) {
    return this.messageHandler.sendWithPromise("GetPageIndex", {
      ref
    }).catch(function (reason) {
      return Promise.reject(new Error(reason));
    });
  }

  getAnnotations(pageIndex, intent) {
    return this.messageHandler.sendWithPromise("GetAnnotations", {
      pageIndex,
      intent
    });
  }

  saveDocument() {
    return this.messageHandler.sendWithPromise("SaveDocument", {
      isPureXfa: !!this._htmlForXfa,
      numPages: this._numPages,
      annotationStorage: this.annotationStorage.serializable,
      filename: this._fullReader?.filename ?? null
    }).finally(() => {
      this.annotationStorage.resetModified();
    });
  }

  getFieldObjects() {
    return this.messageHandler.sendWithPromise("GetFieldObjects", null);
  }

  hasJSActions() {
    return this._hasJSActionsPromise ||= this.messageHandler.sendWithPromise("HasJSActions", null);
  }

  getCalculationOrderIds() {
    return this.messageHandler.sendWithPromise("GetCalculationOrderIds", null);
  }

  getDestinations() {
    return this.messageHandler.sendWithPromise("GetDestinations", null);
  }

  getDestination(id) {
    if (typeof id !== "string") {
      return Promise.reject(new Error("Invalid destination request."));
    }

    return this.messageHandler.sendWithPromise("GetDestination", {
      id
    });
  }

  getPageLabels() {
    return this.messageHandler.sendWithPromise("GetPageLabels", null);
  }

  getPageLayout() {
    return this.messageHandler.sendWithPromise("GetPageLayout", null);
  }

  getPageMode() {
    return this.messageHandler.sendWithPromise("GetPageMode", null);
  }

  getViewerPreferences() {
    return this.messageHandler.sendWithPromise("GetViewerPreferences", null);
  }

  getOpenAction() {
    return this.messageHandler.sendWithPromise("GetOpenAction", null);
  }

  getAttachments() {
    return this.messageHandler.sendWithPromise("GetAttachments", null);
  }

  getJavaScript() {
    return this.messageHandler.sendWithPromise("GetJavaScript", null);
  }

  getDocJSActions() {
    return this.messageHandler.sendWithPromise("GetDocJSActions", null);
  }

  getPageJSActions(pageIndex) {
    return this.messageHandler.sendWithPromise("GetPageJSActions", {
      pageIndex
    });
  }

  getStructTree(pageIndex) {
    return this.messageHandler.sendWithPromise("GetStructTree", {
      pageIndex
    });
  }

  getOutline() {
    return this.messageHandler.sendWithPromise("GetOutline", null);
  }

  getOptionalContentConfig() {
    return this.messageHandler.sendWithPromise("GetOptionalContentConfig", null).then(results => {
      return new _optional_content_config.OptionalContentConfig(results);
    });
  }

  getPermissions() {
    return this.messageHandler.sendWithPromise("GetPermissions", null);
  }

  getMetadata() {
    return this.messageHandler.sendWithPromise("GetMetadata", null).then(results => {
      return {
        info: results[0],
        metadata: results[1] ? new _metadata.Metadata(results[1]) : null,
        contentDispositionFilename: this._fullReader?.filename ?? null,
        contentLength: this._fullReader?.contentLength ?? null
      };
    });
  }

  getMarkInfo() {
    return this.messageHandler.sendWithPromise("GetMarkInfo", null);
  }

  getStats() {
    return this.messageHandler.sendWithPromise("GetStats", null);
  }

  async startCleanup(keepLoadedFonts = false) {
    await this.messageHandler.sendWithPromise("Cleanup", null);

    if (this.destroyed) {
      return;
    }

    for (let i = 0, ii = this.pageCache.length; i < ii; i++) {
      const page = this.pageCache[i];

      if (!page) {
        continue;
      }

      const cleanupSuccessful = page.cleanup();

      if (!cleanupSuccessful) {
        throw new Error(`startCleanup: Page ${i + 1} is currently rendering.`);
      }
    }

    this.commonObjs.clear();

    if (!keepLoadedFonts) {
      this.fontLoader.clear();
    }

    this._hasJSActionsPromise = null;
  }

  get loadingParams() {
    const params = this._params;
    return (0, _util.shadow)(this, "loadingParams", {
      disableAutoFetch: params.disableAutoFetch
    });
  }

}

class PDFObjects {
  constructor() {
    this._objs = Object.create(null);
  }

  _ensureObj(objId) {
    if (this._objs[objId]) {
      return this._objs[objId];
    }

    return this._objs[objId] = {
      capability: (0, _util.createPromiseCapability)(),
      data: null,
      resolved: false
    };
  }

  get(objId, callback = null) {
    if (callback) {
      this._ensureObj(objId).capability.promise.then(callback);

      return null;
    }

    const obj = this._objs[objId];

    if (!obj || !obj.resolved) {
      throw new Error(`Requesting object that isn't resolved yet ${objId}.`);
    }

    return obj.data;
  }

  has(objId) {
    const obj = this._objs[objId];
    return obj?.resolved || false;
  }

  resolve(objId, data) {
    const obj = this._ensureObj(objId);

    obj.resolved = true;
    obj.data = data;
    obj.capability.resolve(data);
  }

  clear() {
    this._objs = Object.create(null);
  }

}

class RenderTask {
  constructor(internalRenderTask) {
    this._internalRenderTask = internalRenderTask;
    this.onContinue = null;
  }

  get promise() {
    return this._internalRenderTask.capability.promise;
  }

  cancel() {
    this._internalRenderTask.cancel();
  }

}

const InternalRenderTask = function InternalRenderTaskClosure() {
  const canvasInRendering = new WeakSet();

  class InternalRenderTask {
    constructor({
      callback,
      params,
      objs,
      commonObjs,
      operatorList,
      pageIndex,
      canvasFactory,
      useRequestAnimationFrame = false,
      pdfBug = false
    }) {
      this.callback = callback;
      this.params = params;
      this.objs = objs;
      this.commonObjs = commonObjs;
      this.operatorListIdx = null;
      this.operatorList = operatorList;
      this._pageIndex = pageIndex;
      this.canvasFactory = canvasFactory;
      this._pdfBug = pdfBug;
      this.running = false;
      this.graphicsReadyCallback = null;
      this.graphicsReady = false;
      this._useRequestAnimationFrame = useRequestAnimationFrame === true && typeof window !== "undefined";
      this.cancelled = false;
      this.capability = (0, _util.createPromiseCapability)();
      this.task = new RenderTask(this);
      this._cancelBound = this.cancel.bind(this);
      this._continueBound = this._continue.bind(this);
      this._scheduleNextBound = this._scheduleNext.bind(this);
      this._nextBound = this._next.bind(this);
      this._canvas = params.canvasContext.canvas;
    }

    get completed() {
      return this.capability.promise.catch(function () {});
    }

    initializeGraphics({
      transparency = false,
      optionalContentConfig
    }) {
      if (this.cancelled) {
        return;
      }

      if (this._canvas) {
        if (canvasInRendering.has(this._canvas)) {
          throw new Error("Cannot use the same canvas during multiple render() operations. " + "Use different canvas or ensure previous operations were " + "cancelled or completed.");
        }

        canvasInRendering.add(this._canvas);
      }

      if (this._pdfBug && globalThis.StepperManager?.enabled) {
        this.stepper = globalThis.StepperManager.create(this._pageIndex);
        this.stepper.init(this.operatorList);
        this.stepper.nextBreakPoint = this.stepper.getNextBreakPoint();
      }

      const {
        canvasContext,
        viewport,
        transform,
        imageLayer,
        background
      } = this.params;
      this.gfx = new _canvas.CanvasGraphics(canvasContext, this.commonObjs, this.objs, this.canvasFactory, imageLayer, optionalContentConfig);
      this.gfx.beginDrawing({
        transform,
        viewport,
        transparency,
        background
      });
      this.operatorListIdx = 0;
      this.graphicsReady = true;

      if (this.graphicsReadyCallback) {
        this.graphicsReadyCallback();
      }
    }

    cancel(error = null) {
      this.running = false;
      this.cancelled = true;

      if (this.gfx) {
        this.gfx.endDrawing();
      }

      if (this._canvas) {
        canvasInRendering.delete(this._canvas);
      }

      this.callback(error || new _display_utils.RenderingCancelledException(`Rendering cancelled, page ${this._pageIndex + 1}`, "canvas"));
    }

    operatorListChanged() {
      if (!this.graphicsReady) {
        if (!this.graphicsReadyCallback) {
          this.graphicsReadyCallback = this._continueBound;
        }

        return;
      }

      if (this.stepper) {
        this.stepper.updateOperatorList(this.operatorList);
      }

      if (this.running) {
        return;
      }

      this._continue();
    }

    _continue() {
      this.running = true;

      if (this.cancelled) {
        return;
      }

      if (this.task.onContinue) {
        this.task.onContinue(this._scheduleNextBound);
      } else {
        this._scheduleNext();
      }
    }

    _scheduleNext() {
      if (this._useRequestAnimationFrame) {
        window.requestAnimationFrame(() => {
          this._nextBound().catch(this._cancelBound);
        });
      } else {
        Promise.resolve().then(this._nextBound).catch(this._cancelBound);
      }
    }

    async _next() {
      if (this.cancelled) {
        return;
      }

      this.operatorListIdx = this.gfx.executeOperatorList(this.operatorList, this.operatorListIdx, this._continueBound, this.stepper);

      if (this.operatorListIdx === this.operatorList.argsArray.length) {
        this.running = false;

        if (this.operatorList.lastChunk) {
          this.gfx.endDrawing();

          if (this._canvas) {
            canvasInRendering.delete(this._canvas);
          }

          this.callback();
        }
      }
    }

  }

  return InternalRenderTask;
}();

const version = '2.10.339';
exports.version = version;
const build = '07955fa1d';
exports.build = build;

/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.FontLoader = exports.FontFaceObject = void 0;

var _util = __w_pdfjs_require__(2);

class BaseFontLoader {
  constructor({
    docId,
    onUnsupportedFeature,
    ownerDocument = globalThis.document,
    styleElement = null
  }) {
    if (this.constructor === BaseFontLoader) {
      (0, _util.unreachable)("Cannot initialize BaseFontLoader.");
    }

    this.docId = docId;
    this._onUnsupportedFeature = onUnsupportedFeature;
    this._document = ownerDocument;
    this.nativeFontFaces = [];
    this.styleElement = null;
  }

  addNativeFontFace(nativeFontFace) {
    this.nativeFontFaces.push(nativeFontFace);

    this._document.fonts.add(nativeFontFace);
  }

  insertRule(rule) {
    let styleElement = this.styleElement;

    if (!styleElement) {
      styleElement = this.styleElement = this._document.createElement("style");
      styleElement.id = `PDFJS_FONT_STYLE_TAG_${this.docId}`;

      this._document.documentElement.getElementsByTagName("head")[0].appendChild(styleElement);
    }

    const styleSheet = styleElement.sheet;
    styleSheet.insertRule(rule, styleSheet.cssRules.length);
  }

  clear() {
    for (const nativeFontFace of this.nativeFontFaces) {
      this._document.fonts.delete(nativeFontFace);
    }

    this.nativeFontFaces.length = 0;

    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }
  }

  async bind(font) {
    if (font.attached || font.missingFile) {
      return;
    }

    font.attached = true;

    if (this.isFontLoadingAPISupported) {
      const nativeFontFace = font.createNativeFontFace();

      if (nativeFontFace) {
        this.addNativeFontFace(nativeFontFace);

        try {
          await nativeFontFace.loaded;
        } catch (ex) {
          this._onUnsupportedFeature({
            featureId: _util.UNSUPPORTED_FEATURES.errorFontLoadNative
          });

          (0, _util.warn)(`Failed to load font '${nativeFontFace.family}': '${ex}'.`);
          font.disableFontFace = true;
          throw ex;
        }
      }

      return;
    }

    const rule = font.createFontFaceRule();

    if (rule) {
      this.insertRule(rule);

      if (this.isSyncFontLoadingSupported) {
        return;
      }

      await new Promise(resolve => {
        const request = this._queueLoadingCallback(resolve);

        this._prepareFontLoadEvent([rule], [font], request);
      });
    }
  }

  _queueLoadingCallback(callback) {
    (0, _util.unreachable)("Abstract method `_queueLoadingCallback`.");
  }

  get isFontLoadingAPISupported() {
    const hasFonts = !!this._document?.fonts;
    return (0, _util.shadow)(this, "isFontLoadingAPISupported", hasFonts);
  }

  get isSyncFontLoadingSupported() {
    (0, _util.unreachable)("Abstract method `isSyncFontLoadingSupported`.");
  }

  get _loadTestFont() {
    (0, _util.unreachable)("Abstract method `_loadTestFont`.");
  }

  _prepareFontLoadEvent(rules, fontsToLoad, request) {
    (0, _util.unreachable)("Abstract method `_prepareFontLoadEvent`.");
  }

}

let FontLoader;
exports.FontLoader = FontLoader;
{
  exports.FontLoader = FontLoader = class MozcentralFontLoader extends BaseFontLoader {
    get isSyncFontLoadingSupported() {
      return (0, _util.shadow)(this, "isSyncFontLoadingSupported", true);
    }

  };
}

class FontFaceObject {
  constructor(translatedData, {
    isEvalSupported = true,
    disableFontFace = false,
    ignoreErrors = false,
    onUnsupportedFeature,
    fontRegistry = null
  }) {
    this.compiledGlyphs = Object.create(null);

    for (const i in translatedData) {
      this[i] = translatedData[i];
    }

    this.isEvalSupported = isEvalSupported !== false;
    this.disableFontFace = disableFontFace === true;
    this.ignoreErrors = ignoreErrors === true;
    this._onUnsupportedFeature = onUnsupportedFeature;
    this.fontRegistry = fontRegistry;
  }

  createNativeFontFace() {
    if (!this.data || this.disableFontFace) {
      return null;
    }

    let nativeFontFace;

    if (!this.cssFontInfo) {
      nativeFontFace = new FontFace(this.loadedName, this.data, {});
    } else {
      const css = {
        weight: this.cssFontInfo.fontWeight
      };

      if (this.cssFontInfo.italicAngle) {
        css.style = `oblique ${this.cssFontInfo.italicAngle}deg`;
      }

      nativeFontFace = new FontFace(this.cssFontInfo.fontFamily, this.data, css);
    }

    if (this.fontRegistry) {
      this.fontRegistry.registerFont(this);
    }

    return nativeFontFace;
  }

  createFontFaceRule() {
    if (!this.data || this.disableFontFace) {
      return null;
    }

    const data = (0, _util.bytesToString)(this.data);
    const url = `url(data:${this.mimetype};base64,${btoa(data)});`;
    let rule;

    if (!this.cssFontInfo) {
      rule = `@font-face {font-family:"${this.loadedName}";src:${url}}`;
    } else {
      let css = `font-weight: ${this.cssFontInfo.fontWeight};`;

      if (this.cssFontInfo.italicAngle) {
        css += `font-style: oblique ${this.cssFontInfo.italicAngle}deg;`;
      }

      rule = `@font-face {font-family:"${this.cssFontInfo.fontFamily}";${css}src:${url}}`;
    }

    if (this.fontRegistry) {
      this.fontRegistry.registerFont(this, url);
    }

    return rule;
  }

  getPathGenerator(objs, character) {
    if (this.compiledGlyphs[character] !== undefined) {
      return this.compiledGlyphs[character];
    }

    let cmds;

    try {
      cmds = objs.get(this.loadedName + "_path_" + character);
    } catch (ex) {
      if (!this.ignoreErrors) {
        throw ex;
      }

      this._onUnsupportedFeature({
        featureId: _util.UNSUPPORTED_FEATURES.errorFontGetPath
      });

      (0, _util.warn)(`getPathGenerator - ignoring character: "${ex}".`);
      return this.compiledGlyphs[character] = function (c, size) {};
    }

    if (this.isEvalSupported && _util.IsEvalSupportedCached.value) {
      const jsBuf = [];

      for (const current of cmds) {
        const args = current.args !== undefined ? current.args.join(",") : "";
        jsBuf.push("c.", current.cmd, "(", args, ");\n");
      }

      return this.compiledGlyphs[character] = new Function("c", "size", jsBuf.join(""));
    }

    return this.compiledGlyphs[character] = function (c, size) {
      for (const current of cmds) {
        if (current.cmd === "scale") {
          current.args = [size, -size];
        }

        c[current.cmd].apply(c, current.args);
      }
    };
  }

}

exports.FontFaceObject = FontFaceObject;

/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.NodeStandardFontDataFactory = exports.NodeCMapReaderFactory = exports.NodeCanvasFactory = void 0;

var _base_factory = __w_pdfjs_require__(5);

var _is_node = __w_pdfjs_require__(4);

var _util = __w_pdfjs_require__(2);

let NodeCanvasFactory = class {
  constructor() {
    (0, _util.unreachable)("Not implemented: NodeCanvasFactory");
  }

};
exports.NodeCanvasFactory = NodeCanvasFactory;
let NodeCMapReaderFactory = class {
  constructor() {
    (0, _util.unreachable)("Not implemented: NodeCMapReaderFactory");
  }

};
exports.NodeCMapReaderFactory = NodeCMapReaderFactory;
let NodeStandardFontDataFactory = class {
  constructor() {
    (0, _util.unreachable)("Not implemented: NodeStandardFontDataFactory");
  }

};
exports.NodeStandardFontDataFactory = NodeStandardFontDataFactory;
;

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.AnnotationStorage = void 0;

var _util = __w_pdfjs_require__(2);

class AnnotationStorage {
  constructor() {
    this._storage = new Map();
    this._modified = false;
    this.onSetModified = null;
    this.onResetModified = null;
  }

  getValue(key, defaultValue) {
    const obj = this._storage.get(key);

    return obj !== undefined ? obj : defaultValue;
  }

  setValue(key, value) {
    const obj = this._storage.get(key);

    let modified = false;

    if (obj !== undefined) {
      for (const [entry, val] of Object.entries(value)) {
        if (obj[entry] !== val) {
          modified = true;
          obj[entry] = val;
        }
      }
    } else {
      this._storage.set(key, value);

      modified = true;
    }

    if (modified) {
      this._setModified();
    }
  }

  getAll() {
    return this._storage.size > 0 ? (0, _util.objectFromMap)(this._storage) : null;
  }

  get size() {
    return this._storage.size;
  }

  _setModified() {
    if (!this._modified) {
      this._modified = true;

      if (typeof this.onSetModified === "function") {
        this.onSetModified();
      }
    }
  }

  resetModified() {
    if (this._modified) {
      this._modified = false;

      if (typeof this.onResetModified === "function") {
        this.onResetModified();
      }
    }
  }

  get serializable() {
    return this._storage.size > 0 ? this._storage : null;
  }

}

exports.AnnotationStorage = AnnotationStorage;

/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.CanvasGraphics = void 0;

var _util = __w_pdfjs_require__(2);

var _pattern_helper = __w_pdfjs_require__(11);

const MIN_FONT_SIZE = 16;
const MAX_FONT_SIZE = 100;
const MAX_GROUP_SIZE = 4096;
const COMPILE_TYPE3_GLYPHS = true;
const MAX_SIZE_TO_COMPILE = 1000;
const FULL_CHUNK_HEIGHT = 16;
const LINEWIDTH_SCALE_FACTOR = 1.000001;

function addContextCurrentTransform(ctx) {
  if (ctx.mozCurrentTransform) {
    return;
  }

  ctx._originalSave = ctx.save;
  ctx._originalRestore = ctx.restore;
  ctx._originalRotate = ctx.rotate;
  ctx._originalScale = ctx.scale;
  ctx._originalTranslate = ctx.translate;
  ctx._originalTransform = ctx.transform;
  ctx._originalSetTransform = ctx.setTransform;
  ctx._originalResetTransform = ctx.resetTransform;
  ctx._transformMatrix = ctx._transformMatrix || [1, 0, 0, 1, 0, 0];
  ctx._transformStack = [];

  try {
    const desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(ctx), "lineWidth");
    ctx._setLineWidth = desc.set;
    ctx._getLineWidth = desc.get;
    Object.defineProperty(ctx, "lineWidth", {
      set: function setLineWidth(width) {
        this._setLineWidth(width * LINEWIDTH_SCALE_FACTOR);
      },
      get: function getLineWidth() {
        return this._getLineWidth();
      }
    });
  } catch (_) {}

  Object.defineProperty(ctx, "mozCurrentTransform", {
    get: function getCurrentTransform() {
      return this._transformMatrix;
    }
  });
  Object.defineProperty(ctx, "mozCurrentTransformInverse", {
    get: function getCurrentTransformInverse() {
      const [a, b, c, d, e, f] = this._transformMatrix;
      const ad_bc = a * d - b * c;
      const bc_ad = b * c - a * d;
      return [d / ad_bc, b / bc_ad, c / bc_ad, a / ad_bc, (d * e - c * f) / bc_ad, (b * e - a * f) / ad_bc];
    }
  });

  ctx.save = function ctxSave() {
    const old = this._transformMatrix;

    this._transformStack.push(old);

    this._transformMatrix = old.slice(0, 6);

    this._originalSave();
  };

  ctx.restore = function ctxRestore() {
    const prev = this._transformStack.pop();

    if (prev) {
      this._transformMatrix = prev;

      this._originalRestore();
    }
  };

  ctx.translate = function ctxTranslate(x, y) {
    const m = this._transformMatrix;
    m[4] = m[0] * x + m[2] * y + m[4];
    m[5] = m[1] * x + m[3] * y + m[5];

    this._originalTranslate(x, y);
  };

  ctx.scale = function ctxScale(x, y) {
    const m = this._transformMatrix;
    m[0] *= x;
    m[1] *= x;
    m[2] *= y;
    m[3] *= y;

    this._originalScale(x, y);
  };

  ctx.transform = function ctxTransform(a, b, c, d, e, f) {
    const m = this._transformMatrix;
    this._transformMatrix = [m[0] * a + m[2] * b, m[1] * a + m[3] * b, m[0] * c + m[2] * d, m[1] * c + m[3] * d, m[0] * e + m[2] * f + m[4], m[1] * e + m[3] * f + m[5]];

    ctx._originalTransform(a, b, c, d, e, f);
  };

  ctx.setTransform = function ctxSetTransform(a, b, c, d, e, f) {
    this._transformMatrix = [a, b, c, d, e, f];

    ctx._originalSetTransform(a, b, c, d, e, f);
  };

  ctx.resetTransform = function ctxResetTransform() {
    this._transformMatrix = [1, 0, 0, 1, 0, 0];

    ctx._originalResetTransform();
  };

  ctx.rotate = function ctxRotate(angle) {
    const cosValue = Math.cos(angle);
    const sinValue = Math.sin(angle);
    const m = this._transformMatrix;
    this._transformMatrix = [m[0] * cosValue + m[2] * sinValue, m[1] * cosValue + m[3] * sinValue, m[0] * -sinValue + m[2] * cosValue, m[1] * -sinValue + m[3] * cosValue, m[4], m[5]];

    this._originalRotate(angle);
  };
}

class CachedCanvases {
  constructor(canvasFactory) {
    this.canvasFactory = canvasFactory;
    this.cache = Object.create(null);
  }

  getCanvas(id, width, height, trackTransform) {
    let canvasEntry;

    if (this.cache[id] !== undefined) {
      canvasEntry = this.cache[id];
      this.canvasFactory.reset(canvasEntry, width, height);
      canvasEntry.context.setTransform(1, 0, 0, 1, 0, 0);
    } else {
      canvasEntry = this.canvasFactory.create(width, height);
      this.cache[id] = canvasEntry;
    }

    if (trackTransform) {
      addContextCurrentTransform(canvasEntry.context);
    }

    return canvasEntry;
  }

  clear() {
    for (const id in this.cache) {
      const canvasEntry = this.cache[id];
      this.canvasFactory.destroy(canvasEntry);
      delete this.cache[id];
    }
  }

}

function compileType3Glyph(imgData) {
  const POINT_TO_PROCESS_LIMIT = 1000;
  const POINT_TYPES = new Uint8Array([0, 2, 4, 0, 1, 0, 5, 4, 8, 10, 0, 8, 0, 2, 1, 0]);
  const width = imgData.width,
        height = imgData.height,
        width1 = width + 1;
  let i, ii, j, j0;
  const points = new Uint8Array(width1 * (height + 1));
  const lineSize = width + 7 & ~7,
        data0 = imgData.data;
  const data = new Uint8Array(lineSize * height);
  let pos = 0;

  for (i = 0, ii = data0.length; i < ii; i++) {
    const elem = data0[i];
    let mask = 128;

    while (mask > 0) {
      data[pos++] = elem & mask ? 0 : 255;
      mask >>= 1;
    }
  }

  let count = 0;
  pos = 0;

  if (data[pos] !== 0) {
    points[0] = 1;
    ++count;
  }

  for (j = 1; j < width; j++) {
    if (data[pos] !== data[pos + 1]) {
      points[j] = data[pos] ? 2 : 1;
      ++count;
    }

    pos++;
  }

  if (data[pos] !== 0) {
    points[j] = 2;
    ++count;
  }

  for (i = 1; i < height; i++) {
    pos = i * lineSize;
    j0 = i * width1;

    if (data[pos - lineSize] !== data[pos]) {
      points[j0] = data[pos] ? 1 : 8;
      ++count;
    }

    let sum = (data[pos] ? 4 : 0) + (data[pos - lineSize] ? 8 : 0);

    for (j = 1; j < width; j++) {
      sum = (sum >> 2) + (data[pos + 1] ? 4 : 0) + (data[pos - lineSize + 1] ? 8 : 0);

      if (POINT_TYPES[sum]) {
        points[j0 + j] = POINT_TYPES[sum];
        ++count;
      }

      pos++;
    }

    if (data[pos - lineSize] !== data[pos]) {
      points[j0 + j] = data[pos] ? 2 : 4;
      ++count;
    }

    if (count > POINT_TO_PROCESS_LIMIT) {
      return null;
    }
  }

  pos = lineSize * (height - 1);
  j0 = i * width1;

  if (data[pos] !== 0) {
    points[j0] = 8;
    ++count;
  }

  for (j = 1; j < width; j++) {
    if (data[pos] !== data[pos + 1]) {
      points[j0 + j] = data[pos] ? 4 : 8;
      ++count;
    }

    pos++;
  }

  if (data[pos] !== 0) {
    points[j0 + j] = 4;
    ++count;
  }

  if (count > POINT_TO_PROCESS_LIMIT) {
    return null;
  }

  const steps = new Int32Array([0, width1, -1, 0, -width1, 0, 0, 0, 1]);
  const outlines = [];

  for (i = 0; count && i <= height; i++) {
    let p = i * width1;
    const end = p + width;

    while (p < end && !points[p]) {
      p++;
    }

    if (p === end) {
      continue;
    }

    const coords = [p % width1, i];
    const p0 = p;
    let type = points[p];

    do {
      const step = steps[type];

      do {
        p += step;
      } while (!points[p]);

      const pp = points[p];

      if (pp !== 5 && pp !== 10) {
        type = pp;
        points[p] = 0;
      } else {
        type = pp & 0x33 * type >> 4;
        points[p] &= type >> 2 | type << 2;
      }

      coords.push(p % width1, p / width1 | 0);

      if (!points[p]) {
        --count;
      }
    } while (p0 !== p);

    outlines.push(coords);
    --i;
  }

  const drawOutline = function (c) {
    c.save();
    c.scale(1 / width, -1 / height);
    c.translate(0, -height);
    c.beginPath();

    for (let k = 0, kk = outlines.length; k < kk; k++) {
      const o = outlines[k];
      c.moveTo(o[0], o[1]);

      for (let l = 2, ll = o.length; l < ll; l += 2) {
        c.lineTo(o[l], o[l + 1]);
      }
    }

    c.fill();
    c.beginPath();
    c.restore();
  };

  return drawOutline;
}

class CanvasExtraState {
  constructor() {
    this.alphaIsShape = false;
    this.fontSize = 0;
    this.fontSizeScale = 1;
    this.textMatrix = _util.IDENTITY_MATRIX;
    this.textMatrixScale = 1;
    this.fontMatrix = _util.FONT_IDENTITY_MATRIX;
    this.leading = 0;
    this.x = 0;
    this.y = 0;
    this.lineX = 0;
    this.lineY = 0;
    this.charSpacing = 0;
    this.wordSpacing = 0;
    this.textHScale = 1;
    this.textRenderingMode = _util.TextRenderingMode.FILL;
    this.textRise = 0;
    this.fillColor = "#000000";
    this.strokeColor = "#000000";
    this.patternFill = false;
    this.fillAlpha = 1;
    this.strokeAlpha = 1;
    this.lineWidth = 1;
    this.activeSMask = null;
    this.resumeSMaskCtx = null;
    this.transferMaps = null;
  }

  clone() {
    return Object.create(this);
  }

  setCurrentPoint(x, y) {
    this.x = x;
    this.y = y;
  }

}

const CanvasGraphics = function CanvasGraphicsClosure() {
  const EXECUTION_TIME = 15;
  const EXECUTION_STEPS = 10;

  function putBinaryImageData(ctx, imgData, transferMaps = null) {
    if (typeof ImageData !== "undefined" && imgData instanceof ImageData) {
      ctx.putImageData(imgData, 0, 0);
      return;
    }

    const height = imgData.height,
          width = imgData.width;
    const partialChunkHeight = height % FULL_CHUNK_HEIGHT;
    const fullChunks = (height - partialChunkHeight) / FULL_CHUNK_HEIGHT;
    const totalChunks = partialChunkHeight === 0 ? fullChunks : fullChunks + 1;
    const chunkImgData = ctx.createImageData(width, FULL_CHUNK_HEIGHT);
    let srcPos = 0,
        destPos;
    const src = imgData.data;
    const dest = chunkImgData.data;
    let i, j, thisChunkHeight, elemsInThisChunk;
    let transferMapRed, transferMapGreen, transferMapBlue, transferMapGray;

    if (transferMaps) {
      switch (transferMaps.length) {
        case 1:
          transferMapRed = transferMaps[0];
          transferMapGreen = transferMaps[0];
          transferMapBlue = transferMaps[0];
          transferMapGray = transferMaps[0];
          break;

        case 4:
          transferMapRed = transferMaps[0];
          transferMapGreen = transferMaps[1];
          transferMapBlue = transferMaps[2];
          transferMapGray = transferMaps[3];
          break;
      }
    }

    if (imgData.kind === _util.ImageKind.GRAYSCALE_1BPP) {
      const srcLength = src.byteLength;
      const dest32 = new Uint32Array(dest.buffer, 0, dest.byteLength >> 2);
      const dest32DataLength = dest32.length;
      const fullSrcDiff = width + 7 >> 3;
      let white = 0xffffffff;
      let black = _util.IsLittleEndianCached.value ? 0xff000000 : 0x000000ff;

      if (transferMapGray) {
        if (transferMapGray[0] === 0xff && transferMapGray[0xff] === 0) {
          [white, black] = [black, white];
        }
      }

      for (i = 0; i < totalChunks; i++) {
        thisChunkHeight = i < fullChunks ? FULL_CHUNK_HEIGHT : partialChunkHeight;
        destPos = 0;

        for (j = 0; j < thisChunkHeight; j++) {
          const srcDiff = srcLength - srcPos;
          let k = 0;
          const kEnd = srcDiff > fullSrcDiff ? width : srcDiff * 8 - 7;
          const kEndUnrolled = kEnd & ~7;
          let mask = 0;
          let srcByte = 0;

          for (; k < kEndUnrolled; k += 8) {
            srcByte = src[srcPos++];
            dest32[destPos++] = srcByte & 128 ? white : black;
            dest32[destPos++] = srcByte & 64 ? white : black;
            dest32[destPos++] = srcByte & 32 ? white : black;
            dest32[destPos++] = srcByte & 16 ? white : black;
            dest32[destPos++] = srcByte & 8 ? white : black;
            dest32[destPos++] = srcByte & 4 ? white : black;
            dest32[destPos++] = srcByte & 2 ? white : black;
            dest32[destPos++] = srcByte & 1 ? white : black;
          }

          for (; k < kEnd; k++) {
            if (mask === 0) {
              srcByte = src[srcPos++];
              mask = 128;
            }

            dest32[destPos++] = srcByte & mask ? white : black;
            mask >>= 1;
          }
        }

        while (destPos < dest32DataLength) {
          dest32[destPos++] = 0;
        }

        ctx.putImageData(chunkImgData, 0, i * FULL_CHUNK_HEIGHT);
      }
    } else if (imgData.kind === _util.ImageKind.RGBA_32BPP) {
      const hasTransferMaps = !!(transferMapRed || transferMapGreen || transferMapBlue);
      j = 0;
      elemsInThisChunk = width * FULL_CHUNK_HEIGHT * 4;

      for (i = 0; i < fullChunks; i++) {
        dest.set(src.subarray(srcPos, srcPos + elemsInThisChunk));
        srcPos += elemsInThisChunk;

        if (hasTransferMaps) {
          for (let k = 0; k < elemsInThisChunk; k += 4) {
            if (transferMapRed) {
              dest[k + 0] = transferMapRed[dest[k + 0]];
            }

            if (transferMapGreen) {
              dest[k + 1] = transferMapGreen[dest[k + 1]];
            }

            if (transferMapBlue) {
              dest[k + 2] = transferMapBlue[dest[k + 2]];
            }
          }
        }

        ctx.putImageData(chunkImgData, 0, j);
        j += FULL_CHUNK_HEIGHT;
      }

      if (i < totalChunks) {
        elemsInThisChunk = width * partialChunkHeight * 4;
        dest.set(src.subarray(srcPos, srcPos + elemsInThisChunk));

        if (hasTransferMaps) {
          for (let k = 0; k < elemsInThisChunk; k += 4) {
            if (transferMapRed) {
              dest[k + 0] = transferMapRed[dest[k + 0]];
            }

            if (transferMapGreen) {
              dest[k + 1] = transferMapGreen[dest[k + 1]];
            }

            if (transferMapBlue) {
              dest[k + 2] = transferMapBlue[dest[k + 2]];
            }
          }
        }

        ctx.putImageData(chunkImgData, 0, j);
      }
    } else if (imgData.kind === _util.ImageKind.RGB_24BPP) {
      const hasTransferMaps = !!(transferMapRed || transferMapGreen || transferMapBlue);
      thisChunkHeight = FULL_CHUNK_HEIGHT;
      elemsInThisChunk = width * thisChunkHeight;

      for (i = 0; i < totalChunks; i++) {
        if (i >= fullChunks) {
          thisChunkHeight = partialChunkHeight;
          elemsInThisChunk = width * thisChunkHeight;
        }

        destPos = 0;

        for (j = elemsInThisChunk; j--;) {
          dest[destPos++] = src[srcPos++];
          dest[destPos++] = src[srcPos++];
          dest[destPos++] = src[srcPos++];
          dest[destPos++] = 255;
        }

        if (hasTransferMaps) {
          for (let k = 0; k < destPos; k += 4) {
            if (transferMapRed) {
              dest[k + 0] = transferMapRed[dest[k + 0]];
            }

            if (transferMapGreen) {
              dest[k + 1] = transferMapGreen[dest[k + 1]];
            }

            if (transferMapBlue) {
              dest[k + 2] = transferMapBlue[dest[k + 2]];
            }
          }
        }

        ctx.putImageData(chunkImgData, 0, i * FULL_CHUNK_HEIGHT);
      }
    } else {
      throw new Error(`bad image kind: ${imgData.kind}`);
    }
  }

  function putBinaryImageMask(ctx, imgData) {
    const height = imgData.height,
          width = imgData.width;
    const partialChunkHeight = height % FULL_CHUNK_HEIGHT;
    const fullChunks = (height - partialChunkHeight) / FULL_CHUNK_HEIGHT;
    const totalChunks = partialChunkHeight === 0 ? fullChunks : fullChunks + 1;
    const chunkImgData = ctx.createImageData(width, FULL_CHUNK_HEIGHT);
    let srcPos = 0;
    const src = imgData.data;
    const dest = chunkImgData.data;

    for (let i = 0; i < totalChunks; i++) {
      const thisChunkHeight = i < fullChunks ? FULL_CHUNK_HEIGHT : partialChunkHeight;
      let destPos = 3;

      for (let j = 0; j < thisChunkHeight; j++) {
        let elem,
            mask = 0;

        for (let k = 0; k < width; k++) {
          if (!mask) {
            elem = src[srcPos++];
            mask = 128;
          }

          dest[destPos] = elem & mask ? 0 : 255;
          destPos += 4;
          mask >>= 1;
        }
      }

      ctx.putImageData(chunkImgData, 0, i * FULL_CHUNK_HEIGHT);
    }
  }

  function copyCtxState(sourceCtx, destCtx) {
    const properties = ["strokeStyle", "fillStyle", "fillRule", "globalAlpha", "lineWidth", "lineCap", "lineJoin", "miterLimit", "globalCompositeOperation", "font"];

    for (let i = 0, ii = properties.length; i < ii; i++) {
      const property = properties[i];

      if (sourceCtx[property] !== undefined) {
        destCtx[property] = sourceCtx[property];
      }
    }

    if (sourceCtx.setLineDash !== undefined) {
      destCtx.setLineDash(sourceCtx.getLineDash());
      destCtx.lineDashOffset = sourceCtx.lineDashOffset;
    }
  }

  function resetCtxToDefault(ctx) {
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
    ctx.fillRule = "nonzero";
    ctx.globalAlpha = 1;
    ctx.lineWidth = 1;
    ctx.lineCap = "butt";
    ctx.lineJoin = "miter";
    ctx.miterLimit = 10;
    ctx.globalCompositeOperation = "source-over";
    ctx.font = "10px sans-serif";

    if (ctx.setLineDash !== undefined) {
      ctx.setLineDash([]);
      ctx.lineDashOffset = 0;
    }
  }

  function composeSMaskBackdrop(bytes, r0, g0, b0) {
    const length = bytes.length;

    for (let i = 3; i < length; i += 4) {
      const alpha = bytes[i];

      if (alpha === 0) {
        bytes[i - 3] = r0;
        bytes[i - 2] = g0;
        bytes[i - 1] = b0;
      } else if (alpha < 255) {
        const alpha_ = 255 - alpha;
        bytes[i - 3] = bytes[i - 3] * alpha + r0 * alpha_ >> 8;
        bytes[i - 2] = bytes[i - 2] * alpha + g0 * alpha_ >> 8;
        bytes[i - 1] = bytes[i - 1] * alpha + b0 * alpha_ >> 8;
      }
    }
  }

  function composeSMaskAlpha(maskData, layerData, transferMap) {
    const length = maskData.length;
    const scale = 1 / 255;

    for (let i = 3; i < length; i += 4) {
      const alpha = transferMap ? transferMap[maskData[i]] : maskData[i];
      layerData[i] = layerData[i] * alpha * scale | 0;
    }
  }

  function composeSMaskLuminosity(maskData, layerData, transferMap) {
    const length = maskData.length;

    for (let i = 3; i < length; i += 4) {
      const y = maskData[i - 3] * 77 + maskData[i - 2] * 152 + maskData[i - 1] * 28;
      layerData[i] = transferMap ? layerData[i] * transferMap[y >> 8] >> 8 : layerData[i] * y >> 16;
    }
  }

  function genericComposeSMask(maskCtx, layerCtx, width, height, subtype, backdrop, transferMap) {
    const hasBackdrop = !!backdrop;
    const r0 = hasBackdrop ? backdrop[0] : 0;
    const g0 = hasBackdrop ? backdrop[1] : 0;
    const b0 = hasBackdrop ? backdrop[2] : 0;
    let composeFn;

    if (subtype === "Luminosity") {
      composeFn = composeSMaskLuminosity;
    } else {
      composeFn = composeSMaskAlpha;
    }

    const PIXELS_TO_PROCESS = 1048576;
    const chunkSize = Math.min(height, Math.ceil(PIXELS_TO_PROCESS / width));

    for (let row = 0; row < height; row += chunkSize) {
      const chunkHeight = Math.min(chunkSize, height - row);
      const maskData = maskCtx.getImageData(0, row, width, chunkHeight);
      const layerData = layerCtx.getImageData(0, row, width, chunkHeight);

      if (hasBackdrop) {
        composeSMaskBackdrop(maskData.data, r0, g0, b0);
      }

      composeFn(maskData.data, layerData.data, transferMap);
      maskCtx.putImageData(layerData, 0, row);
    }
  }

  function composeSMask(ctx, smask, layerCtx) {
    const mask = smask.canvas;
    const maskCtx = smask.context;
    ctx.setTransform(smask.scaleX, 0, 0, smask.scaleY, smask.offsetX, smask.offsetY);
    genericComposeSMask(maskCtx, layerCtx, mask.width, mask.height, smask.subtype, smask.backdrop, smask.transferMap);
    ctx.drawImage(mask, 0, 0);
  }

  const LINE_CAP_STYLES = ["butt", "round", "square"];
  const LINE_JOIN_STYLES = ["miter", "round", "bevel"];
  const NORMAL_CLIP = {};
  const EO_CLIP = {};

  class CanvasGraphics {
    constructor(canvasCtx, commonObjs, objs, canvasFactory, imageLayer, optionalContentConfig) {
      this.ctx = canvasCtx;
      this.current = new CanvasExtraState();
      this.stateStack = [];
      this.pendingClip = null;
      this.pendingEOFill = false;
      this.res = null;
      this.xobjs = null;
      this.commonObjs = commonObjs;
      this.objs = objs;
      this.canvasFactory = canvasFactory;
      this.imageLayer = imageLayer;
      this.groupStack = [];
      this.processingType3 = null;
      this.baseTransform = null;
      this.baseTransformStack = [];
      this.groupLevel = 0;
      this.smaskStack = [];
      this.smaskCounter = 0;
      this.tempSMask = null;
      this.contentVisible = true;
      this.markedContentStack = [];
      this.optionalContentConfig = optionalContentConfig;
      this.cachedCanvases = new CachedCanvases(this.canvasFactory);

      if (canvasCtx) {
        addContextCurrentTransform(canvasCtx);
      }

      this._cachedGetSinglePixelWidth = null;
    }

    beginDrawing({
      transform,
      viewport,
      transparency = false,
      background = null
    }) {
      const width = this.ctx.canvas.width;
      const height = this.ctx.canvas.height;
      this.ctx.save();
      this.ctx.fillStyle = background || "rgb(255, 255, 255)";
      this.ctx.fillRect(0, 0, width, height);
      this.ctx.restore();

      if (transparency) {
        const transparentCanvas = this.cachedCanvases.getCanvas("transparent", width, height, true);
        this.compositeCtx = this.ctx;
        this.transparentCanvas = transparentCanvas.canvas;
        this.ctx = transparentCanvas.context;
        this.ctx.save();
        this.ctx.transform.apply(this.ctx, this.compositeCtx.mozCurrentTransform);
      }

      this.ctx.save();
      resetCtxToDefault(this.ctx);

      if (transform) {
        this.ctx.transform.apply(this.ctx, transform);
      }

      this.ctx.transform.apply(this.ctx, viewport.transform);
      this.baseTransform = this.ctx.mozCurrentTransform.slice();
      this._combinedScaleFactor = Math.hypot(this.baseTransform[0], this.baseTransform[2]);

      if (this.imageLayer) {
        this.imageLayer.beginLayout();
      }
    }

    executeOperatorList(operatorList, executionStartIdx, continueCallback, stepper) {
      const argsArray = operatorList.argsArray;
      const fnArray = operatorList.fnArray;
      let i = executionStartIdx || 0;
      const argsArrayLen = argsArray.length;

      if (argsArrayLen === i) {
        return i;
      }

      const chunkOperations = argsArrayLen - i > EXECUTION_STEPS && typeof continueCallback === "function";
      const endTime = chunkOperations ? Date.now() + EXECUTION_TIME : 0;
      let steps = 0;
      const commonObjs = this.commonObjs;
      const objs = this.objs;
      let fnId;

      while (true) {
        if (stepper !== undefined && i === stepper.nextBreakPoint) {
          stepper.breakIt(i, continueCallback);
          return i;
        }

        fnId = fnArray[i];

        if (fnId !== _util.OPS.dependency) {
          this[fnId].apply(this, argsArray[i]);
        } else {
          for (const depObjId of argsArray[i]) {
            const objsPool = depObjId.startsWith("g_") ? commonObjs : objs;

            if (!objsPool.has(depObjId)) {
              objsPool.get(depObjId, continueCallback);
              return i;
            }
          }
        }

        i++;

        if (i === argsArrayLen) {
          return i;
        }

        if (chunkOperations && ++steps > EXECUTION_STEPS) {
          if (Date.now() > endTime) {
            continueCallback();
            return i;
          }

          steps = 0;
        }
      }
    }

    endDrawing() {
      while (this.stateStack.length || this.current.activeSMask !== null) {
        this.restore();
      }

      this.ctx.restore();

      if (this.transparentCanvas) {
        this.ctx = this.compositeCtx;
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.drawImage(this.transparentCanvas, 0, 0);
        this.ctx.restore();
        this.transparentCanvas = null;
      }

      this.cachedCanvases.clear();

      if (this.imageLayer) {
        this.imageLayer.endLayout();
      }
    }

    _scaleImage(img, inverseTransform) {
      const width = img.width;
      const height = img.height;
      let widthScale = Math.max(Math.hypot(inverseTransform[0], inverseTransform[1]), 1);
      let heightScale = Math.max(Math.hypot(inverseTransform[2], inverseTransform[3]), 1);
      let paintWidth = width,
          paintHeight = height;
      let tmpCanvasId = "prescale1";
      let tmpCanvas, tmpCtx;

      while (widthScale > 2 && paintWidth > 1 || heightScale > 2 && paintHeight > 1) {
        let newWidth = paintWidth,
            newHeight = paintHeight;

        if (widthScale > 2 && paintWidth > 1) {
          newWidth = Math.ceil(paintWidth / 2);
          widthScale /= paintWidth / newWidth;
        }

        if (heightScale > 2 && paintHeight > 1) {
          newHeight = Math.ceil(paintHeight / 2);
          heightScale /= paintHeight / newHeight;
        }

        tmpCanvas = this.cachedCanvases.getCanvas(tmpCanvasId, newWidth, newHeight);
        tmpCtx = tmpCanvas.context;
        tmpCtx.clearRect(0, 0, newWidth, newHeight);
        tmpCtx.drawImage(img, 0, 0, paintWidth, paintHeight, 0, 0, newWidth, newHeight);
        img = tmpCanvas.canvas;
        paintWidth = newWidth;
        paintHeight = newHeight;
        tmpCanvasId = tmpCanvasId === "prescale1" ? "prescale2" : "prescale1";
      }

      return {
        img,
        paintWidth,
        paintHeight
      };
    }

    _createMaskCanvas(img) {
      const ctx = this.ctx;
      const width = img.width,
            height = img.height;
      const fillColor = this.current.fillColor;
      const isPatternFill = this.current.patternFill;
      const maskCanvas = this.cachedCanvases.getCanvas("maskCanvas", width, height);
      const maskCtx = maskCanvas.context;
      putBinaryImageMask(maskCtx, img);
      const objToCanvas = ctx.mozCurrentTransform;

      let maskToCanvas = _util.Util.transform(objToCanvas, [1 / width, 0, 0, -1 / height, 0, 0]);

      maskToCanvas = _util.Util.transform(maskToCanvas, [1, 0, 0, 1, 0, -height]);

      const cord1 = _util.Util.applyTransform([0, 0], maskToCanvas);

      const cord2 = _util.Util.applyTransform([width, height], maskToCanvas);

      const rect = _util.Util.normalizeRect([cord1[0], cord1[1], cord2[0], cord2[1]]);

      const drawnWidth = Math.ceil(rect[2] - rect[0]);
      const drawnHeight = Math.ceil(rect[3] - rect[1]);
      const fillCanvas = this.cachedCanvases.getCanvas("fillCanvas", drawnWidth, drawnHeight, true);
      const fillCtx = fillCanvas.context;
      const offsetX = Math.min(cord1[0], cord2[0]);
      const offsetY = Math.min(cord1[1], cord2[1]);
      fillCtx.translate(-offsetX, -offsetY);
      fillCtx.transform.apply(fillCtx, maskToCanvas);

      const scaled = this._scaleImage(maskCanvas.canvas, fillCtx.mozCurrentTransformInverse);

      fillCtx.drawImage(scaled.img, 0, 0, scaled.img.width, scaled.img.height, 0, 0, width, height);
      fillCtx.globalCompositeOperation = "source-in";

      const inverse = _util.Util.transform(fillCtx.mozCurrentTransformInverse, [1, 0, 0, 1, -offsetX, -offsetY]);

      fillCtx.fillStyle = isPatternFill ? fillColor.getPattern(ctx, this, inverse, false) : fillColor;
      fillCtx.fillRect(0, 0, width, height);
      return {
        canvas: fillCanvas.canvas,
        offsetX: Math.round(offsetX),
        offsetY: Math.round(offsetY)
      };
    }

    setLineWidth(width) {
      this.current.lineWidth = width;
      this.ctx.lineWidth = width;
    }

    setLineCap(style) {
      this.ctx.lineCap = LINE_CAP_STYLES[style];
    }

    setLineJoin(style) {
      this.ctx.lineJoin = LINE_JOIN_STYLES[style];
    }

    setMiterLimit(limit) {
      this.ctx.miterLimit = limit;
    }

    setDash(dashArray, dashPhase) {
      const ctx = this.ctx;

      if (ctx.setLineDash !== undefined) {
        ctx.setLineDash(dashArray);
        ctx.lineDashOffset = dashPhase;
      }
    }

    setRenderingIntent(intent) {}

    setFlatness(flatness) {}

    setGState(states) {
      for (let i = 0, ii = states.length; i < ii; i++) {
        const state = states[i];
        const key = state[0];
        const value = state[1];

        switch (key) {
          case "LW":
            this.setLineWidth(value);
            break;

          case "LC":
            this.setLineCap(value);
            break;

          case "LJ":
            this.setLineJoin(value);
            break;

          case "ML":
            this.setMiterLimit(value);
            break;

          case "D":
            this.setDash(value[0], value[1]);
            break;

          case "RI":
            this.setRenderingIntent(value);
            break;

          case "FL":
            this.setFlatness(value);
            break;

          case "Font":
            this.setFont(value[0], value[1]);
            break;

          case "CA":
            this.current.strokeAlpha = state[1];
            break;

          case "ca":
            this.current.fillAlpha = state[1];
            this.ctx.globalAlpha = state[1];
            break;

          case "BM":
            this.ctx.globalCompositeOperation = value;
            break;

          case "SMask":
            if (this.current.activeSMask) {
              if (this.stateStack.length > 0 && this.stateStack[this.stateStack.length - 1].activeSMask === this.current.activeSMask) {
                this.suspendSMaskGroup();
              } else {
                this.endSMaskGroup();
              }
            }

            this.current.activeSMask = value ? this.tempSMask : null;

            if (this.current.activeSMask) {
              this.beginSMaskGroup();
            }

            this.tempSMask = null;
            break;

          case "TR":
            this.current.transferMaps = value;
        }
      }
    }

    beginSMaskGroup() {
      const activeSMask = this.current.activeSMask;
      const drawnWidth = activeSMask.canvas.width;
      const drawnHeight = activeSMask.canvas.height;
      const cacheId = "smaskGroupAt" + this.groupLevel;
      const scratchCanvas = this.cachedCanvases.getCanvas(cacheId, drawnWidth, drawnHeight, true);
      const currentCtx = this.ctx;
      const currentTransform = currentCtx.mozCurrentTransform;
      this.ctx.save();
      const groupCtx = scratchCanvas.context;
      groupCtx.scale(1 / activeSMask.scaleX, 1 / activeSMask.scaleY);
      groupCtx.translate(-activeSMask.offsetX, -activeSMask.offsetY);
      groupCtx.transform.apply(groupCtx, currentTransform);
      activeSMask.startTransformInverse = groupCtx.mozCurrentTransformInverse;
      copyCtxState(currentCtx, groupCtx);
      this.ctx = groupCtx;
      this.setGState([["BM", "source-over"], ["ca", 1], ["CA", 1]]);
      this.groupStack.push(currentCtx);
      this.groupLevel++;
    }

    suspendSMaskGroup() {
      const groupCtx = this.ctx;
      this.groupLevel--;
      this.ctx = this.groupStack.pop();
      composeSMask(this.ctx, this.current.activeSMask, groupCtx);
      this.ctx.restore();
      this.ctx.save();
      copyCtxState(groupCtx, this.ctx);
      this.current.resumeSMaskCtx = groupCtx;

      const deltaTransform = _util.Util.transform(this.current.activeSMask.startTransformInverse, groupCtx.mozCurrentTransform);

      this.ctx.transform.apply(this.ctx, deltaTransform);
      groupCtx.save();
      groupCtx.setTransform(1, 0, 0, 1, 0, 0);
      groupCtx.clearRect(0, 0, groupCtx.canvas.width, groupCtx.canvas.height);
      groupCtx.restore();
    }

    resumeSMaskGroup() {
      const groupCtx = this.current.resumeSMaskCtx;
      const currentCtx = this.ctx;
      this.ctx = groupCtx;
      this.groupStack.push(currentCtx);
      this.groupLevel++;
    }

    endSMaskGroup() {
      const groupCtx = this.ctx;
      this.groupLevel--;
      this.ctx = this.groupStack.pop();
      composeSMask(this.ctx, this.current.activeSMask, groupCtx);
      this.ctx.restore();
      copyCtxState(groupCtx, this.ctx);

      const deltaTransform = _util.Util.transform(this.current.activeSMask.startTransformInverse, groupCtx.mozCurrentTransform);

      this.ctx.transform.apply(this.ctx, deltaTransform);
    }

    save() {
      this.ctx.save();
      const old = this.current;
      this.stateStack.push(old);
      this.current = old.clone();
      this.current.resumeSMaskCtx = null;
    }

    restore() {
      if (this.current.resumeSMaskCtx) {
        this.resumeSMaskGroup();
      }

      if (this.current.activeSMask !== null && (this.stateStack.length === 0 || this.stateStack[this.stateStack.length - 1].activeSMask !== this.current.activeSMask)) {
        this.endSMaskGroup();
      }

      if (this.stateStack.length !== 0) {
        this.current = this.stateStack.pop();
        this.ctx.restore();
        this.pendingClip = null;
        this._cachedGetSinglePixelWidth = null;
      } else {
        this.current.activeSMask = null;
      }
    }

    transform(a, b, c, d, e, f) {
      this.ctx.transform(a, b, c, d, e, f);
      this._cachedGetSinglePixelWidth = null;
    }

    constructPath(ops, args) {
      const ctx = this.ctx;
      const current = this.current;
      let x = current.x,
          y = current.y;

      for (let i = 0, j = 0, ii = ops.length; i < ii; i++) {
        switch (ops[i] | 0) {
          case _util.OPS.rectangle:
            x = args[j++];
            y = args[j++];
            const width = args[j++];
            const height = args[j++];
            const xw = x + width;
            const yh = y + height;
            ctx.moveTo(x, y);

            if (width === 0 || height === 0) {
              ctx.lineTo(xw, yh);
            } else {
              ctx.lineTo(xw, y);
              ctx.lineTo(xw, yh);
              ctx.lineTo(x, yh);
            }

            ctx.closePath();
            break;

          case _util.OPS.moveTo:
            x = args[j++];
            y = args[j++];
            ctx.moveTo(x, y);
            break;

          case _util.OPS.lineTo:
            x = args[j++];
            y = args[j++];
            ctx.lineTo(x, y);
            break;

          case _util.OPS.curveTo:
            x = args[j + 4];
            y = args[j + 5];
            ctx.bezierCurveTo(args[j], args[j + 1], args[j + 2], args[j + 3], x, y);
            j += 6;
            break;

          case _util.OPS.curveTo2:
            ctx.bezierCurveTo(x, y, args[j], args[j + 1], args[j + 2], args[j + 3]);
            x = args[j + 2];
            y = args[j + 3];
            j += 4;
            break;

          case _util.OPS.curveTo3:
            x = args[j + 2];
            y = args[j + 3];
            ctx.bezierCurveTo(args[j], args[j + 1], x, y, x, y);
            j += 4;
            break;

          case _util.OPS.closePath:
            ctx.closePath();
            break;
        }
      }

      current.setCurrentPoint(x, y);
    }

    closePath() {
      this.ctx.closePath();
    }

    stroke(consumePath) {
      consumePath = typeof consumePath !== "undefined" ? consumePath : true;
      const ctx = this.ctx;
      const strokeColor = this.current.strokeColor;
      ctx.globalAlpha = this.current.strokeAlpha;

      if (this.contentVisible) {
        if (typeof strokeColor === "object" && strokeColor?.getPattern) {
          const lineWidth = this.getSinglePixelWidth();
          ctx.save();
          ctx.strokeStyle = strokeColor.getPattern(ctx, this, ctx.mozCurrentTransformInverse);
          ctx.lineWidth = Math.max(lineWidth, this.current.lineWidth);
          ctx.stroke();
          ctx.restore();
        } else {
          const lineWidth = this.getSinglePixelWidth();

          if (lineWidth < 0 && -lineWidth >= this.current.lineWidth) {
            ctx.save();
            ctx.resetTransform();
            ctx.lineWidth = Math.round(this._combinedScaleFactor);
            ctx.stroke();
            ctx.restore();
          } else {
            ctx.lineWidth = Math.max(lineWidth, this.current.lineWidth);
            ctx.stroke();
          }
        }
      }

      if (consumePath) {
        this.consumePath();
      }

      ctx.globalAlpha = this.current.fillAlpha;
    }

    closeStroke() {
      this.closePath();
      this.stroke();
    }

    fill(consumePath) {
      consumePath = typeof consumePath !== "undefined" ? consumePath : true;
      const ctx = this.ctx;
      const fillColor = this.current.fillColor;
      const isPatternFill = this.current.patternFill;
      let needRestore = false;

      if (isPatternFill) {
        ctx.save();
        ctx.fillStyle = fillColor.getPattern(ctx, this, ctx.mozCurrentTransformInverse);
        needRestore = true;
      }

      if (this.contentVisible) {
        if (this.pendingEOFill) {
          ctx.fill("evenodd");
          this.pendingEOFill = false;
        } else {
          ctx.fill();
        }
      }

      if (needRestore) {
        ctx.restore();
      }

      if (consumePath) {
        this.consumePath();
      }
    }

    eoFill() {
      this.pendingEOFill = true;
      this.fill();
    }

    fillStroke() {
      this.fill(false);
      this.stroke(false);
      this.consumePath();
    }

    eoFillStroke() {
      this.pendingEOFill = true;
      this.fillStroke();
    }

    closeFillStroke() {
      this.closePath();
      this.fillStroke();
    }

    closeEOFillStroke() {
      this.pendingEOFill = true;
      this.closePath();
      this.fillStroke();
    }

    endPath() {
      this.consumePath();
    }

    clip() {
      this.pendingClip = NORMAL_CLIP;
    }

    eoClip() {
      this.pendingClip = EO_CLIP;
    }

    beginText() {
      this.current.textMatrix = _util.IDENTITY_MATRIX;
      this.current.textMatrixScale = 1;
      this.current.x = this.current.lineX = 0;
      this.current.y = this.current.lineY = 0;
    }

    endText() {
      const paths = this.pendingTextPaths;
      const ctx = this.ctx;

      if (paths === undefined) {
        ctx.beginPath();
        return;
      }

      ctx.save();
      ctx.beginPath();

      for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        ctx.setTransform.apply(ctx, path.transform);
        ctx.translate(path.x, path.y);
        path.addToPath(ctx, path.fontSize);
      }

      ctx.restore();
      ctx.clip();
      ctx.beginPath();
      delete this.pendingTextPaths;
    }

    setCharSpacing(spacing) {
      this.current.charSpacing = spacing;
    }

    setWordSpacing(spacing) {
      this.current.wordSpacing = spacing;
    }

    setHScale(scale) {
      this.current.textHScale = scale / 100;
    }

    setLeading(leading) {
      this.current.leading = -leading;
    }

    setFont(fontRefName, size) {
      const fontObj = this.commonObjs.get(fontRefName);
      const current = this.current;

      if (!fontObj) {
        throw new Error(`Can't find font for ${fontRefName}`);
      }

      current.fontMatrix = fontObj.fontMatrix || _util.FONT_IDENTITY_MATRIX;

      if (current.fontMatrix[0] === 0 || current.fontMatrix[3] === 0) {
        (0, _util.warn)("Invalid font matrix for font " + fontRefName);
      }

      if (size < 0) {
        size = -size;
        current.fontDirection = -1;
      } else {
        current.fontDirection = 1;
      }

      this.current.font = fontObj;
      this.current.fontSize = size;

      if (fontObj.isType3Font) {
        return;
      }

      const name = fontObj.loadedName || "sans-serif";
      let bold = "normal";

      if (fontObj.black) {
        bold = "900";
      } else if (fontObj.bold) {
        bold = "bold";
      }

      const italic = fontObj.italic ? "italic" : "normal";
      const typeface = `"${name}", ${fontObj.fallbackName}`;
      let browserFontSize = size;

      if (size < MIN_FONT_SIZE) {
        browserFontSize = MIN_FONT_SIZE;
      } else if (size > MAX_FONT_SIZE) {
        browserFontSize = MAX_FONT_SIZE;
      }

      this.current.fontSizeScale = size / browserFontSize;
      this.ctx.font = `${italic} ${bold} ${browserFontSize}px ${typeface}`;
    }

    setTextRenderingMode(mode) {
      this.current.textRenderingMode = mode;
    }

    setTextRise(rise) {
      this.current.textRise = rise;
    }

    moveText(x, y) {
      this.current.x = this.current.lineX += x;
      this.current.y = this.current.lineY += y;
    }

    setLeadingMoveText(x, y) {
      this.setLeading(-y);
      this.moveText(x, y);
    }

    setTextMatrix(a, b, c, d, e, f) {
      this.current.textMatrix = [a, b, c, d, e, f];
      this.current.textMatrixScale = Math.hypot(a, b);
      this.current.x = this.current.lineX = 0;
      this.current.y = this.current.lineY = 0;
    }

    nextLine() {
      this.moveText(0, this.current.leading);
    }

    paintChar(character, x, y, patternTransform, resetLineWidthToOne) {
      const ctx = this.ctx;
      const current = this.current;
      const font = current.font;
      const textRenderingMode = current.textRenderingMode;
      const fontSize = current.fontSize / current.fontSizeScale;
      const fillStrokeMode = textRenderingMode & _util.TextRenderingMode.FILL_STROKE_MASK;
      const isAddToPathSet = !!(textRenderingMode & _util.TextRenderingMode.ADD_TO_PATH_FLAG);
      const patternFill = current.patternFill && !font.missingFile;
      let addToPath;

      if (font.disableFontFace || isAddToPathSet || patternFill) {
        addToPath = font.getPathGenerator(this.commonObjs, character);
      }

      if (font.disableFontFace || patternFill) {
        ctx.save();
        ctx.translate(x, y);
        ctx.beginPath();
        addToPath(ctx, fontSize);

        if (patternTransform) {
          ctx.setTransform.apply(ctx, patternTransform);
        }

        if (fillStrokeMode === _util.TextRenderingMode.FILL || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
          ctx.fill();
        }

        if (fillStrokeMode === _util.TextRenderingMode.STROKE || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
          if (resetLineWidthToOne) {
            ctx.resetTransform();
            ctx.lineWidth = Math.round(this._combinedScaleFactor);
          }

          ctx.stroke();
        }

        ctx.restore();
      } else {
        if (fillStrokeMode === _util.TextRenderingMode.FILL || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
          ctx.fillText(character, x, y);
        }

        if (fillStrokeMode === _util.TextRenderingMode.STROKE || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
          if (resetLineWidthToOne) {
            ctx.save();
            ctx.moveTo(x, y);
            ctx.resetTransform();
            ctx.lineWidth = Math.round(this._combinedScaleFactor);
            ctx.strokeText(character, 0, 0);
            ctx.restore();
          } else {
            ctx.strokeText(character, x, y);
          }
        }
      }

      if (isAddToPathSet) {
        const paths = this.pendingTextPaths || (this.pendingTextPaths = []);
        paths.push({
          transform: ctx.mozCurrentTransform,
          x,
          y,
          fontSize,
          addToPath
        });
      }
    }

    get isFontSubpixelAAEnabled() {
      const {
        context: ctx
      } = this.cachedCanvases.getCanvas("isFontSubpixelAAEnabled", 10, 10);
      ctx.scale(1.5, 1);
      ctx.fillText("I", 0, 10);
      const data = ctx.getImageData(0, 0, 10, 10).data;
      let enabled = false;

      for (let i = 3; i < data.length; i += 4) {
        if (data[i] > 0 && data[i] < 255) {
          enabled = true;
          break;
        }
      }

      return (0, _util.shadow)(this, "isFontSubpixelAAEnabled", enabled);
    }

    showText(glyphs) {
      const current = this.current;
      const font = current.font;

      if (font.isType3Font) {
        return this.showType3Text(glyphs);
      }

      const fontSize = current.fontSize;

      if (fontSize === 0) {
        return undefined;
      }

      const ctx = this.ctx;
      const fontSizeScale = current.fontSizeScale;
      const charSpacing = current.charSpacing;
      const wordSpacing = current.wordSpacing;
      const fontDirection = current.fontDirection;
      const textHScale = current.textHScale * fontDirection;
      const glyphsLength = glyphs.length;
      const vertical = font.vertical;
      const spacingDir = vertical ? 1 : -1;
      const defaultVMetrics = font.defaultVMetrics;
      const widthAdvanceScale = fontSize * current.fontMatrix[0];
      const simpleFillText = current.textRenderingMode === _util.TextRenderingMode.FILL && !font.disableFontFace && !current.patternFill;
      ctx.save();
      let patternTransform;

      if (current.patternFill) {
        ctx.save();
        const pattern = current.fillColor.getPattern(ctx, this, ctx.mozCurrentTransformInverse);
        patternTransform = ctx.mozCurrentTransform;
        ctx.restore();
        ctx.fillStyle = pattern;
      }

      ctx.transform.apply(ctx, current.textMatrix);
      ctx.translate(current.x, current.y + current.textRise);

      if (fontDirection > 0) {
        ctx.scale(textHScale, -1);
      } else {
        ctx.scale(textHScale, 1);
      }

      let lineWidth = current.lineWidth;
      let resetLineWidthToOne = false;
      const scale = current.textMatrixScale;

      if (scale === 0 || lineWidth === 0) {
        const fillStrokeMode = current.textRenderingMode & _util.TextRenderingMode.FILL_STROKE_MASK;

        if (fillStrokeMode === _util.TextRenderingMode.STROKE || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
          this._cachedGetSinglePixelWidth = null;
          lineWidth = this.getSinglePixelWidth();
          resetLineWidthToOne = lineWidth < 0;
        }
      } else {
        lineWidth /= scale;
      }

      if (fontSizeScale !== 1.0) {
        ctx.scale(fontSizeScale, fontSizeScale);
        lineWidth /= fontSizeScale;
      }

      ctx.lineWidth = lineWidth;
      let x = 0,
          i;

      for (i = 0; i < glyphsLength; ++i) {
        const glyph = glyphs[i];

        if ((0, _util.isNum)(glyph)) {
          x += spacingDir * glyph * fontSize / 1000;
          continue;
        }

        let restoreNeeded = false;
        const spacing = (glyph.isSpace ? wordSpacing : 0) + charSpacing;
        const character = glyph.fontChar;
        const accent = glyph.accent;
        let scaledX, scaledY;
        let width = glyph.width;

        if (vertical) {
          const vmetric = glyph.vmetric || defaultVMetrics;
          const vx = -(glyph.vmetric ? vmetric[1] : width * 0.5) * widthAdvanceScale;
          const vy = vmetric[2] * widthAdvanceScale;
          width = vmetric ? -vmetric[0] : width;
          scaledX = vx / fontSizeScale;
          scaledY = (x + vy) / fontSizeScale;
        } else {
          scaledX = x / fontSizeScale;
          scaledY = 0;
        }

        if (font.remeasure && width > 0) {
          const measuredWidth = ctx.measureText(character).width * 1000 / fontSize * fontSizeScale;

          if (width < measuredWidth && this.isFontSubpixelAAEnabled) {
            const characterScaleX = width / measuredWidth;
            restoreNeeded = true;
            ctx.save();
            ctx.scale(characterScaleX, 1);
            scaledX /= characterScaleX;
          } else if (width !== measuredWidth) {
            scaledX += (width - measuredWidth) / 2000 * fontSize / fontSizeScale;
          }
        }

        if (this.contentVisible && (glyph.isInFont || font.missingFile)) {
          if (simpleFillText && !accent) {
            ctx.fillText(character, scaledX, scaledY);
          } else {
            this.paintChar(character, scaledX, scaledY, patternTransform, resetLineWidthToOne);

            if (accent) {
              const scaledAccentX = scaledX + fontSize * accent.offset.x / fontSizeScale;
              const scaledAccentY = scaledY - fontSize * accent.offset.y / fontSizeScale;
              this.paintChar(accent.fontChar, scaledAccentX, scaledAccentY, patternTransform, resetLineWidthToOne);
            }
          }
        }

        let charWidth;

        if (vertical) {
          charWidth = width * widthAdvanceScale - spacing * fontDirection;
        } else {
          charWidth = width * widthAdvanceScale + spacing * fontDirection;
        }

        x += charWidth;

        if (restoreNeeded) {
          ctx.restore();
        }
      }

      if (vertical) {
        current.y -= x;
      } else {
        current.x += x * textHScale;
      }

      ctx.restore();
      return undefined;
    }

    showType3Text(glyphs) {
      const ctx = this.ctx;
      const current = this.current;
      const font = current.font;
      const fontSize = current.fontSize;
      const fontDirection = current.fontDirection;
      const spacingDir = font.vertical ? 1 : -1;
      const charSpacing = current.charSpacing;
      const wordSpacing = current.wordSpacing;
      const textHScale = current.textHScale * fontDirection;
      const fontMatrix = current.fontMatrix || _util.FONT_IDENTITY_MATRIX;
      const glyphsLength = glyphs.length;
      const isTextInvisible = current.textRenderingMode === _util.TextRenderingMode.INVISIBLE;
      let i, glyph, width, spacingLength;

      if (isTextInvisible || fontSize === 0) {
        return;
      }

      this._cachedGetSinglePixelWidth = null;
      ctx.save();
      ctx.transform.apply(ctx, current.textMatrix);
      ctx.translate(current.x, current.y);
      ctx.scale(textHScale, fontDirection);

      for (i = 0; i < glyphsLength; ++i) {
        glyph = glyphs[i];

        if ((0, _util.isNum)(glyph)) {
          spacingLength = spacingDir * glyph * fontSize / 1000;
          this.ctx.translate(spacingLength, 0);
          current.x += spacingLength * textHScale;
          continue;
        }

        const spacing = (glyph.isSpace ? wordSpacing : 0) + charSpacing;
        const operatorList = font.charProcOperatorList[glyph.operatorListId];

        if (!operatorList) {
          (0, _util.warn)(`Type3 character "${glyph.operatorListId}" is not available.`);
          continue;
        }

        if (this.contentVisible) {
          this.processingType3 = glyph;
          this.save();
          ctx.scale(fontSize, fontSize);
          ctx.transform.apply(ctx, fontMatrix);
          this.executeOperatorList(operatorList);
          this.restore();
        }

        const transformed = _util.Util.applyTransform([glyph.width, 0], fontMatrix);

        width = transformed[0] * fontSize + spacing;
        ctx.translate(width, 0);
        current.x += width * textHScale;
      }

      ctx.restore();
      this.processingType3 = null;
    }

    setCharWidth(xWidth, yWidth) {}

    setCharWidthAndBounds(xWidth, yWidth, llx, lly, urx, ury) {
      this.ctx.rect(llx, lly, urx - llx, ury - lly);
      this.clip();
      this.endPath();
    }

    getColorN_Pattern(IR) {
      let pattern;

      if (IR[0] === "TilingPattern") {
        const color = IR[1];
        const baseTransform = this.baseTransform || this.ctx.mozCurrentTransform.slice();
        const canvasGraphicsFactory = {
          createCanvasGraphics: ctx => {
            return new CanvasGraphics(ctx, this.commonObjs, this.objs, this.canvasFactory);
          }
        };
        pattern = new _pattern_helper.TilingPattern(IR, color, this.ctx, canvasGraphicsFactory, baseTransform);
      } else {
        pattern = (0, _pattern_helper.getShadingPattern)(IR);
      }

      return pattern;
    }

    setStrokeColorN() {
      this.current.strokeColor = this.getColorN_Pattern(arguments);
    }

    setFillColorN() {
      this.current.fillColor = this.getColorN_Pattern(arguments);
      this.current.patternFill = true;
    }

    setStrokeRGBColor(r, g, b) {
      const color = _util.Util.makeHexColor(r, g, b);

      this.ctx.strokeStyle = color;
      this.current.strokeColor = color;
    }

    setFillRGBColor(r, g, b) {
      const color = _util.Util.makeHexColor(r, g, b);

      this.ctx.fillStyle = color;
      this.current.fillColor = color;
      this.current.patternFill = false;
    }

    shadingFill(patternIR) {
      if (!this.contentVisible) {
        return;
      }

      const ctx = this.ctx;
      this.save();
      const pattern = (0, _pattern_helper.getShadingPattern)(patternIR);
      ctx.fillStyle = pattern.getPattern(ctx, this, ctx.mozCurrentTransformInverse, true);
      const inv = ctx.mozCurrentTransformInverse;

      if (inv) {
        const canvas = ctx.canvas;
        const width = canvas.width;
        const height = canvas.height;

        const bl = _util.Util.applyTransform([0, 0], inv);

        const br = _util.Util.applyTransform([0, height], inv);

        const ul = _util.Util.applyTransform([width, 0], inv);

        const ur = _util.Util.applyTransform([width, height], inv);

        const x0 = Math.min(bl[0], br[0], ul[0], ur[0]);
        const y0 = Math.min(bl[1], br[1], ul[1], ur[1]);
        const x1 = Math.max(bl[0], br[0], ul[0], ur[0]);
        const y1 = Math.max(bl[1], br[1], ul[1], ur[1]);
        this.ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
      } else {
        this.ctx.fillRect(-1e10, -1e10, 2e10, 2e10);
      }

      this.restore();
    }

    beginInlineImage() {
      (0, _util.unreachable)("Should not call beginInlineImage");
    }

    beginImageData() {
      (0, _util.unreachable)("Should not call beginImageData");
    }

    paintFormXObjectBegin(matrix, bbox) {
      if (!this.contentVisible) {
        return;
      }

      this.save();
      this.baseTransformStack.push(this.baseTransform);

      if (Array.isArray(matrix) && matrix.length === 6) {
        this.transform.apply(this, matrix);
      }

      this.baseTransform = this.ctx.mozCurrentTransform;

      if (bbox) {
        const width = bbox[2] - bbox[0];
        const height = bbox[3] - bbox[1];
        this.ctx.rect(bbox[0], bbox[1], width, height);
        this.clip();
        this.endPath();
      }
    }

    paintFormXObjectEnd() {
      if (!this.contentVisible) {
        return;
      }

      this.restore();
      this.baseTransform = this.baseTransformStack.pop();
    }

    beginGroup(group) {
      if (!this.contentVisible) {
        return;
      }

      this.save();
      const currentCtx = this.ctx;

      if (!group.isolated) {
        (0, _util.info)("TODO: Support non-isolated groups.");
      }

      if (group.knockout) {
        (0, _util.warn)("Knockout groups not supported.");
      }

      const currentTransform = currentCtx.mozCurrentTransform;

      if (group.matrix) {
        currentCtx.transform.apply(currentCtx, group.matrix);
      }

      if (!group.bbox) {
        throw new Error("Bounding box is required.");
      }

      let bounds = _util.Util.getAxialAlignedBoundingBox(group.bbox, currentCtx.mozCurrentTransform);

      const canvasBounds = [0, 0, currentCtx.canvas.width, currentCtx.canvas.height];
      bounds = _util.Util.intersect(bounds, canvasBounds) || [0, 0, 0, 0];
      const offsetX = Math.floor(bounds[0]);
      const offsetY = Math.floor(bounds[1]);
      let drawnWidth = Math.max(Math.ceil(bounds[2]) - offsetX, 1);
      let drawnHeight = Math.max(Math.ceil(bounds[3]) - offsetY, 1);
      let scaleX = 1,
          scaleY = 1;

      if (drawnWidth > MAX_GROUP_SIZE) {
        scaleX = drawnWidth / MAX_GROUP_SIZE;
        drawnWidth = MAX_GROUP_SIZE;
      }

      if (drawnHeight > MAX_GROUP_SIZE) {
        scaleY = drawnHeight / MAX_GROUP_SIZE;
        drawnHeight = MAX_GROUP_SIZE;
      }

      let cacheId = "groupAt" + this.groupLevel;

      if (group.smask) {
        cacheId += "_smask_" + this.smaskCounter++ % 2;
      }

      const scratchCanvas = this.cachedCanvases.getCanvas(cacheId, drawnWidth, drawnHeight, true);
      const groupCtx = scratchCanvas.context;
      groupCtx.scale(1 / scaleX, 1 / scaleY);
      groupCtx.translate(-offsetX, -offsetY);
      groupCtx.transform.apply(groupCtx, currentTransform);

      if (group.smask) {
        this.smaskStack.push({
          canvas: scratchCanvas.canvas,
          context: groupCtx,
          offsetX,
          offsetY,
          scaleX,
          scaleY,
          subtype: group.smask.subtype,
          backdrop: group.smask.backdrop,
          transferMap: group.smask.transferMap || null,
          startTransformInverse: null
        });
      } else {
        currentCtx.setTransform(1, 0, 0, 1, 0, 0);
        currentCtx.translate(offsetX, offsetY);
        currentCtx.scale(scaleX, scaleY);
      }

      copyCtxState(currentCtx, groupCtx);
      this.ctx = groupCtx;
      this.setGState([["BM", "source-over"], ["ca", 1], ["CA", 1]]);
      this.groupStack.push(currentCtx);
      this.groupLevel++;
      this.current.activeSMask = null;
    }

    endGroup(group) {
      if (!this.contentVisible) {
        return;
      }

      this.groupLevel--;
      const groupCtx = this.ctx;
      this.ctx = this.groupStack.pop();

      if (this.ctx.imageSmoothingEnabled !== undefined) {
        this.ctx.imageSmoothingEnabled = false;
      } else {
        this.ctx.mozImageSmoothingEnabled = false;
      }

      if (group.smask) {
        this.tempSMask = this.smaskStack.pop();
      } else {
        this.ctx.drawImage(groupCtx.canvas, 0, 0);
      }

      this.restore();
    }

    beginAnnotations() {
      this.save();

      if (this.baseTransform) {
        this.ctx.setTransform.apply(this.ctx, this.baseTransform);
      }
    }

    endAnnotations() {
      this.restore();
    }

    beginAnnotation(id, rect, transform, matrix) {
      this.save();
      resetCtxToDefault(this.ctx);
      this.current = new CanvasExtraState();

      if (Array.isArray(rect) && rect.length === 4) {
        const width = rect[2] - rect[0];
        const height = rect[3] - rect[1];
        this.ctx.rect(rect[0], rect[1], width, height);
        this.clip();
        this.endPath();
      }

      this.transform.apply(this, transform);
      this.transform.apply(this, matrix);
    }

    endAnnotation() {
      this.restore();
    }

    paintImageMaskXObject(img) {
      if (!this.contentVisible) {
        return;
      }

      const ctx = this.ctx;
      const width = img.width,
            height = img.height;
      const glyph = this.processingType3;

      if (COMPILE_TYPE3_GLYPHS && glyph && glyph.compiled === undefined) {
        if (width <= MAX_SIZE_TO_COMPILE && height <= MAX_SIZE_TO_COMPILE) {
          glyph.compiled = compileType3Glyph({
            data: img.data,
            width,
            height
          });
        } else {
          glyph.compiled = null;
        }
      }

      if (glyph?.compiled) {
        glyph.compiled(ctx);
        return;
      }

      const mask = this._createMaskCanvas(img);

      const maskCanvas = mask.canvas;
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(maskCanvas, mask.offsetX, mask.offsetY);
      ctx.restore();
    }

    paintImageMaskXObjectRepeat(imgData, scaleX, skewX = 0, skewY = 0, scaleY, positions) {
      if (!this.contentVisible) {
        return;
      }

      const ctx = this.ctx;
      ctx.save();
      const currentTransform = ctx.mozCurrentTransform;
      ctx.transform(scaleX, skewX, skewY, scaleY, 0, 0);

      const mask = this._createMaskCanvas(imgData);

      ctx.setTransform(1, 0, 0, 1, 0, 0);

      for (let i = 0, ii = positions.length; i < ii; i += 2) {
        const trans = _util.Util.transform(currentTransform, [scaleX, skewX, skewY, scaleY, positions[i], positions[i + 1]]);

        const [x, y] = _util.Util.applyTransform([0, 0], trans);

        ctx.drawImage(mask.canvas, x, y);
      }

      ctx.restore();
    }

    paintImageMaskXObjectGroup(images) {
      if (!this.contentVisible) {
        return;
      }

      const ctx = this.ctx;
      const fillColor = this.current.fillColor;
      const isPatternFill = this.current.patternFill;

      for (let i = 0, ii = images.length; i < ii; i++) {
        const image = images[i];
        const width = image.width,
              height = image.height;
        const maskCanvas = this.cachedCanvases.getCanvas("maskCanvas", width, height);
        const maskCtx = maskCanvas.context;
        maskCtx.save();
        putBinaryImageMask(maskCtx, image);
        maskCtx.globalCompositeOperation = "source-in";
        maskCtx.fillStyle = isPatternFill ? fillColor.getPattern(maskCtx, this, ctx.mozCurrentTransformInverse, false) : fillColor;
        maskCtx.fillRect(0, 0, width, height);
        maskCtx.restore();
        ctx.save();
        ctx.transform.apply(ctx, image.transform);
        ctx.scale(1, -1);
        ctx.drawImage(maskCanvas.canvas, 0, 0, width, height, 0, -1, 1, 1);
        ctx.restore();
      }
    }

    paintImageXObject(objId) {
      if (!this.contentVisible) {
        return;
      }

      const imgData = objId.startsWith("g_") ? this.commonObjs.get(objId) : this.objs.get(objId);

      if (!imgData) {
        (0, _util.warn)("Dependent image isn't ready yet");
        return;
      }

      this.paintInlineImageXObject(imgData);
    }

    paintImageXObjectRepeat(objId, scaleX, scaleY, positions) {
      if (!this.contentVisible) {
        return;
      }

      const imgData = objId.startsWith("g_") ? this.commonObjs.get(objId) : this.objs.get(objId);

      if (!imgData) {
        (0, _util.warn)("Dependent image isn't ready yet");
        return;
      }

      const width = imgData.width;
      const height = imgData.height;
      const map = [];

      for (let i = 0, ii = positions.length; i < ii; i += 2) {
        map.push({
          transform: [scaleX, 0, 0, scaleY, positions[i], positions[i + 1]],
          x: 0,
          y: 0,
          w: width,
          h: height
        });
      }

      this.paintInlineImageXObjectGroup(imgData, map);
    }

    paintInlineImageXObject(imgData) {
      if (!this.contentVisible) {
        return;
      }

      const width = imgData.width;
      const height = imgData.height;
      const ctx = this.ctx;
      this.save();
      ctx.scale(1 / width, -1 / height);
      let imgToPaint;

      if (typeof HTMLElement === "function" && imgData instanceof HTMLElement || !imgData.data) {
        imgToPaint = imgData;
      } else {
        const tmpCanvas = this.cachedCanvases.getCanvas("inlineImage", width, height);
        const tmpCtx = tmpCanvas.context;
        putBinaryImageData(tmpCtx, imgData, this.current.transferMaps);
        imgToPaint = tmpCanvas.canvas;
      }

      const scaled = this._scaleImage(imgToPaint, ctx.mozCurrentTransformInverse);

      ctx.drawImage(scaled.img, 0, 0, scaled.paintWidth, scaled.paintHeight, 0, -height, width, height);

      if (this.imageLayer) {
        const position = this.getCanvasPosition(0, -height);
        this.imageLayer.appendImage({
          imgData,
          left: position[0],
          top: position[1],
          width: width / ctx.mozCurrentTransformInverse[0],
          height: height / ctx.mozCurrentTransformInverse[3]
        });
      }

      this.restore();
    }

    paintInlineImageXObjectGroup(imgData, map) {
      if (!this.contentVisible) {
        return;
      }

      const ctx = this.ctx;
      const w = imgData.width;
      const h = imgData.height;
      const tmpCanvas = this.cachedCanvases.getCanvas("inlineImage", w, h);
      const tmpCtx = tmpCanvas.context;
      putBinaryImageData(tmpCtx, imgData, this.current.transferMaps);

      for (let i = 0, ii = map.length; i < ii; i++) {
        const entry = map[i];
        ctx.save();
        ctx.transform.apply(ctx, entry.transform);
        ctx.scale(1, -1);
        ctx.drawImage(tmpCanvas.canvas, entry.x, entry.y, entry.w, entry.h, 0, -1, 1, 1);

        if (this.imageLayer) {
          const position = this.getCanvasPosition(entry.x, entry.y);
          this.imageLayer.appendImage({
            imgData,
            left: position[0],
            top: position[1],
            width: w,
            height: h
          });
        }

        ctx.restore();
      }
    }

    paintSolidColorImageMask() {
      if (!this.contentVisible) {
        return;
      }

      this.ctx.fillRect(0, 0, 1, 1);
    }

    markPoint(tag) {}

    markPointProps(tag, properties) {}

    beginMarkedContent(tag) {
      this.markedContentStack.push({
        visible: true
      });
    }

    beginMarkedContentProps(tag, properties) {
      if (tag === "OC") {
        this.markedContentStack.push({
          visible: this.optionalContentConfig.isVisible(properties)
        });
      } else {
        this.markedContentStack.push({
          visible: true
        });
      }

      this.contentVisible = this.isContentVisible();
    }

    endMarkedContent() {
      this.markedContentStack.pop();
      this.contentVisible = this.isContentVisible();
    }

    beginCompat() {}

    endCompat() {}

    consumePath() {
      const ctx = this.ctx;

      if (this.pendingClip) {
        if (this.pendingClip === EO_CLIP) {
          ctx.clip("evenodd");
        } else {
          ctx.clip();
        }

        this.pendingClip = null;
      }

      ctx.beginPath();
    }

    getSinglePixelWidth() {
      if (this._cachedGetSinglePixelWidth === null) {
        const m = this.ctx.mozCurrentTransform;
        const absDet = Math.abs(m[0] * m[3] - m[2] * m[1]);
        const sqNorm1 = m[0] ** 2 + m[2] ** 2;
        const sqNorm2 = m[1] ** 2 + m[3] ** 2;
        const pixelHeight = Math.sqrt(Math.max(sqNorm1, sqNorm2)) / absDet;

        if (sqNorm1 !== sqNorm2 && this._combinedScaleFactor * pixelHeight > 1) {
          this._cachedGetSinglePixelWidth = -(this._combinedScaleFactor * pixelHeight);
        } else if (absDet > Number.EPSILON) {
          this._cachedGetSinglePixelWidth = pixelHeight;
        } else {
          this._cachedGetSinglePixelWidth = 1;
        }
      }

      return this._cachedGetSinglePixelWidth;
    }

    getCanvasPosition(x, y) {
      const transform = this.ctx.mozCurrentTransform;
      return [transform[0] * x + transform[2] * y + transform[4], transform[1] * x + transform[3] * y + transform[5]];
    }

    isContentVisible() {
      for (let i = this.markedContentStack.length - 1; i >= 0; i--) {
        if (!this.markedContentStack[i].visible) {
          return false;
        }
      }

      return true;
    }

  }

  for (const op in _util.OPS) {
    CanvasGraphics.prototype[_util.OPS[op]] = CanvasGraphics.prototype[op];
  }

  return CanvasGraphics;
}();

exports.CanvasGraphics = CanvasGraphics;

/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getShadingPattern = getShadingPattern;
exports.TilingPattern = void 0;

var _util = __w_pdfjs_require__(2);

function applyBoundingBox(ctx, bbox) {
  if (!bbox || typeof Path2D === "undefined") {
    return;
  }

  const width = bbox[2] - bbox[0];
  const height = bbox[3] - bbox[1];
  const region = new Path2D();
  region.rect(bbox[0], bbox[1], width, height);
  ctx.clip(region);
}

class BaseShadingPattern {
  constructor() {
    if (this.constructor === BaseShadingPattern) {
      (0, _util.unreachable)("Cannot initialize BaseShadingPattern.");
    }
  }

  getPattern() {
    (0, _util.unreachable)("Abstract method `getPattern` called.");
  }

}

class RadialAxialShadingPattern extends BaseShadingPattern {
  constructor(IR) {
    super();
    this._type = IR[1];
    this._bbox = IR[2];
    this._colorStops = IR[3];
    this._p0 = IR[4];
    this._p1 = IR[5];
    this._r0 = IR[6];
    this._r1 = IR[7];
    this._matrix = IR[8];
  }

  getPattern(ctx, owner, inverse, shadingFill = false) {
    const tmpCanvas = owner.cachedCanvases.getCanvas("pattern", owner.ctx.canvas.width, owner.ctx.canvas.height, true);
    const tmpCtx = tmpCanvas.context;
    tmpCtx.clearRect(0, 0, tmpCtx.canvas.width, tmpCtx.canvas.height);
    tmpCtx.beginPath();
    tmpCtx.rect(0, 0, tmpCtx.canvas.width, tmpCtx.canvas.height);

    if (!shadingFill) {
      tmpCtx.setTransform.apply(tmpCtx, owner.baseTransform);

      if (this._matrix) {
        tmpCtx.transform.apply(tmpCtx, this._matrix);
      }
    } else {
      tmpCtx.setTransform.apply(tmpCtx, ctx.mozCurrentTransform);
    }

    applyBoundingBox(tmpCtx, this._bbox);
    let grad;

    if (this._type === "axial") {
      grad = tmpCtx.createLinearGradient(this._p0[0], this._p0[1], this._p1[0], this._p1[1]);
    } else if (this._type === "radial") {
      grad = tmpCtx.createRadialGradient(this._p0[0], this._p0[1], this._r0, this._p1[0], this._p1[1], this._r1);
    }

    for (const colorStop of this._colorStops) {
      grad.addColorStop(colorStop[0], colorStop[1]);
    }

    tmpCtx.fillStyle = grad;
    tmpCtx.fill();
    const domMatrix = new DOMMatrix(inverse);
    const pattern = ctx.createPattern(tmpCanvas.canvas, "repeat");

    try {
      pattern.setTransform(domMatrix);
    } catch (ex) {
      (0, _util.warn)(`RadialAxialShadingPattern.getPattern: "${ex?.message}".`);
    }

    return pattern;
  }

}

function drawTriangle(data, context, p1, p2, p3, c1, c2, c3) {
  const coords = context.coords,
        colors = context.colors;
  const bytes = data.data,
        rowSize = data.width * 4;
  let tmp;

  if (coords[p1 + 1] > coords[p2 + 1]) {
    tmp = p1;
    p1 = p2;
    p2 = tmp;
    tmp = c1;
    c1 = c2;
    c2 = tmp;
  }

  if (coords[p2 + 1] > coords[p3 + 1]) {
    tmp = p2;
    p2 = p3;
    p3 = tmp;
    tmp = c2;
    c2 = c3;
    c3 = tmp;
  }

  if (coords[p1 + 1] > coords[p2 + 1]) {
    tmp = p1;
    p1 = p2;
    p2 = tmp;
    tmp = c1;
    c1 = c2;
    c2 = tmp;
  }

  const x1 = (coords[p1] + context.offsetX) * context.scaleX;
  const y1 = (coords[p1 + 1] + context.offsetY) * context.scaleY;
  const x2 = (coords[p2] + context.offsetX) * context.scaleX;
  const y2 = (coords[p2 + 1] + context.offsetY) * context.scaleY;
  const x3 = (coords[p3] + context.offsetX) * context.scaleX;
  const y3 = (coords[p3 + 1] + context.offsetY) * context.scaleY;

  if (y1 >= y3) {
    return;
  }

  const c1r = colors[c1],
        c1g = colors[c1 + 1],
        c1b = colors[c1 + 2];
  const c2r = colors[c2],
        c2g = colors[c2 + 1],
        c2b = colors[c2 + 2];
  const c3r = colors[c3],
        c3g = colors[c3 + 1],
        c3b = colors[c3 + 2];
  const minY = Math.round(y1),
        maxY = Math.round(y3);
  let xa, car, cag, cab;
  let xb, cbr, cbg, cbb;

  for (let y = minY; y <= maxY; y++) {
    if (y < y2) {
      let k;

      if (y < y1) {
        k = 0;
      } else if (y1 === y2) {
        k = 1;
      } else {
        k = (y1 - y) / (y1 - y2);
      }

      xa = x1 - (x1 - x2) * k;
      car = c1r - (c1r - c2r) * k;
      cag = c1g - (c1g - c2g) * k;
      cab = c1b - (c1b - c2b) * k;
    } else {
      let k;

      if (y > y3) {
        k = 1;
      } else if (y2 === y3) {
        k = 0;
      } else {
        k = (y2 - y) / (y2 - y3);
      }

      xa = x2 - (x2 - x3) * k;
      car = c2r - (c2r - c3r) * k;
      cag = c2g - (c2g - c3g) * k;
      cab = c2b - (c2b - c3b) * k;
    }

    let k;

    if (y < y1) {
      k = 0;
    } else if (y > y3) {
      k = 1;
    } else {
      k = (y1 - y) / (y1 - y3);
    }

    xb = x1 - (x1 - x3) * k;
    cbr = c1r - (c1r - c3r) * k;
    cbg = c1g - (c1g - c3g) * k;
    cbb = c1b - (c1b - c3b) * k;
    const x1_ = Math.round(Math.min(xa, xb));
    const x2_ = Math.round(Math.max(xa, xb));
    let j = rowSize * y + x1_ * 4;

    for (let x = x1_; x <= x2_; x++) {
      k = (xa - x) / (xa - xb);

      if (k < 0) {
        k = 0;
      } else if (k > 1) {
        k = 1;
      }

      bytes[j++] = car - (car - cbr) * k | 0;
      bytes[j++] = cag - (cag - cbg) * k | 0;
      bytes[j++] = cab - (cab - cbb) * k | 0;
      bytes[j++] = 255;
    }
  }
}

function drawFigure(data, figure, context) {
  const ps = figure.coords;
  const cs = figure.colors;
  let i, ii;

  switch (figure.type) {
    case "lattice":
      const verticesPerRow = figure.verticesPerRow;
      const rows = Math.floor(ps.length / verticesPerRow) - 1;
      const cols = verticesPerRow - 1;

      for (i = 0; i < rows; i++) {
        let q = i * verticesPerRow;

        for (let j = 0; j < cols; j++, q++) {
          drawTriangle(data, context, ps[q], ps[q + 1], ps[q + verticesPerRow], cs[q], cs[q + 1], cs[q + verticesPerRow]);
          drawTriangle(data, context, ps[q + verticesPerRow + 1], ps[q + 1], ps[q + verticesPerRow], cs[q + verticesPerRow + 1], cs[q + 1], cs[q + verticesPerRow]);
        }
      }

      break;

    case "triangles":
      for (i = 0, ii = ps.length; i < ii; i += 3) {
        drawTriangle(data, context, ps[i], ps[i + 1], ps[i + 2], cs[i], cs[i + 1], cs[i + 2]);
      }

      break;

    default:
      throw new Error("illegal figure");
  }
}

class MeshShadingPattern extends BaseShadingPattern {
  constructor(IR) {
    super();
    this._coords = IR[2];
    this._colors = IR[3];
    this._figures = IR[4];
    this._bounds = IR[5];
    this._matrix = IR[6];
    this._bbox = IR[7];
    this._background = IR[8];
  }

  _createMeshCanvas(combinedScale, backgroundColor, cachedCanvases) {
    const EXPECTED_SCALE = 1.1;
    const MAX_PATTERN_SIZE = 3000;
    const BORDER_SIZE = 2;
    const offsetX = Math.floor(this._bounds[0]);
    const offsetY = Math.floor(this._bounds[1]);
    const boundsWidth = Math.ceil(this._bounds[2]) - offsetX;
    const boundsHeight = Math.ceil(this._bounds[3]) - offsetY;
    const width = Math.min(Math.ceil(Math.abs(boundsWidth * combinedScale[0] * EXPECTED_SCALE)), MAX_PATTERN_SIZE);
    const height = Math.min(Math.ceil(Math.abs(boundsHeight * combinedScale[1] * EXPECTED_SCALE)), MAX_PATTERN_SIZE);
    const scaleX = boundsWidth / width;
    const scaleY = boundsHeight / height;
    const context = {
      coords: this._coords,
      colors: this._colors,
      offsetX: -offsetX,
      offsetY: -offsetY,
      scaleX: 1 / scaleX,
      scaleY: 1 / scaleY
    };
    const paddedWidth = width + BORDER_SIZE * 2;
    const paddedHeight = height + BORDER_SIZE * 2;
    const tmpCanvas = cachedCanvases.getCanvas("mesh", paddedWidth, paddedHeight, false);
    const tmpCtx = tmpCanvas.context;
    const data = tmpCtx.createImageData(width, height);

    if (backgroundColor) {
      const bytes = data.data;

      for (let i = 0, ii = bytes.length; i < ii; i += 4) {
        bytes[i] = backgroundColor[0];
        bytes[i + 1] = backgroundColor[1];
        bytes[i + 2] = backgroundColor[2];
        bytes[i + 3] = 255;
      }
    }

    for (const figure of this._figures) {
      drawFigure(data, figure, context);
    }

    tmpCtx.putImageData(data, BORDER_SIZE, BORDER_SIZE);
    const canvas = tmpCanvas.canvas;
    return {
      canvas,
      offsetX: offsetX - BORDER_SIZE * scaleX,
      offsetY: offsetY - BORDER_SIZE * scaleY,
      scaleX,
      scaleY
    };
  }

  getPattern(ctx, owner, inverse, shadingFill = false) {
    applyBoundingBox(ctx, this._bbox);
    let scale;

    if (shadingFill) {
      scale = _util.Util.singularValueDecompose2dScale(ctx.mozCurrentTransform);
    } else {
      scale = _util.Util.singularValueDecompose2dScale(owner.baseTransform);

      if (this._matrix) {
        const matrixScale = _util.Util.singularValueDecompose2dScale(this._matrix);

        scale = [scale[0] * matrixScale[0], scale[1] * matrixScale[1]];
      }
    }

    const temporaryPatternCanvas = this._createMeshCanvas(scale, shadingFill ? null : this._background, owner.cachedCanvases);

    if (!shadingFill) {
      ctx.setTransform.apply(ctx, owner.baseTransform);

      if (this._matrix) {
        ctx.transform.apply(ctx, this._matrix);
      }
    }

    ctx.translate(temporaryPatternCanvas.offsetX, temporaryPatternCanvas.offsetY);
    ctx.scale(temporaryPatternCanvas.scaleX, temporaryPatternCanvas.scaleY);
    return ctx.createPattern(temporaryPatternCanvas.canvas, "no-repeat");
  }

}

class DummyShadingPattern extends BaseShadingPattern {
  getPattern() {
    return "hotpink";
  }

}

function getShadingPattern(IR) {
  switch (IR[0]) {
    case "RadialAxial":
      return new RadialAxialShadingPattern(IR);

    case "Mesh":
      return new MeshShadingPattern(IR);

    case "Dummy":
      return new DummyShadingPattern();
  }

  throw new Error(`Unknown IR type: ${IR[0]}`);
}

const PaintType = {
  COLORED: 1,
  UNCOLORED: 2
};

class TilingPattern {
  static get MAX_PATTERN_SIZE() {
    return (0, _util.shadow)(this, "MAX_PATTERN_SIZE", 3000);
  }

  constructor(IR, color, ctx, canvasGraphicsFactory, baseTransform) {
    this.operatorList = IR[2];
    this.matrix = IR[3] || [1, 0, 0, 1, 0, 0];
    this.bbox = IR[4];
    this.xstep = IR[5];
    this.ystep = IR[6];
    this.paintType = IR[7];
    this.tilingType = IR[8];
    this.color = color;
    this.ctx = ctx;
    this.canvasGraphicsFactory = canvasGraphicsFactory;
    this.baseTransform = baseTransform;
  }

  createPatternCanvas(owner) {
    const operatorList = this.operatorList;
    const bbox = this.bbox;
    const xstep = this.xstep;
    const ystep = this.ystep;
    const paintType = this.paintType;
    const tilingType = this.tilingType;
    const color = this.color;
    const canvasGraphicsFactory = this.canvasGraphicsFactory;
    (0, _util.info)("TilingType: " + tilingType);
    const x0 = bbox[0],
          y0 = bbox[1],
          x1 = bbox[2],
          y1 = bbox[3];

    const matrixScale = _util.Util.singularValueDecompose2dScale(this.matrix);

    const curMatrixScale = _util.Util.singularValueDecompose2dScale(this.baseTransform);

    const combinedScale = [matrixScale[0] * curMatrixScale[0], matrixScale[1] * curMatrixScale[1]];
    const dimx = this.getSizeAndScale(xstep, this.ctx.canvas.width, combinedScale[0]);
    const dimy = this.getSizeAndScale(ystep, this.ctx.canvas.height, combinedScale[1]);
    const tmpCanvas = owner.cachedCanvases.getCanvas("pattern", dimx.size, dimy.size, true);
    const tmpCtx = tmpCanvas.context;
    const graphics = canvasGraphicsFactory.createCanvasGraphics(tmpCtx);
    graphics.groupLevel = owner.groupLevel;
    this.setFillAndStrokeStyleToContext(graphics, paintType, color);
    let adjustedX0 = x0;
    let adjustedY0 = y0;
    let adjustedX1 = x1;
    let adjustedY1 = y1;

    if (x0 < 0) {
      adjustedX0 = 0;
      adjustedX1 += Math.abs(x0);
    }

    if (y0 < 0) {
      adjustedY0 = 0;
      adjustedY1 += Math.abs(y0);
    }

    tmpCtx.translate(-(dimx.scale * adjustedX0), -(dimy.scale * adjustedY0));
    graphics.transform(dimx.scale, 0, 0, dimy.scale, 0, 0);
    this.clipBbox(graphics, adjustedX0, adjustedY0, adjustedX1, adjustedY1);
    graphics.baseTransform = graphics.ctx.mozCurrentTransform.slice();
    graphics.executeOperatorList(operatorList);
    graphics.endDrawing();
    return {
      canvas: tmpCanvas.canvas,
      scaleX: dimx.scale,
      scaleY: dimy.scale,
      offsetX: adjustedX0,
      offsetY: adjustedY0
    };
  }

  getSizeAndScale(step, realOutputSize, scale) {
    step = Math.abs(step);
    const maxSize = Math.max(TilingPattern.MAX_PATTERN_SIZE, realOutputSize);
    let size = Math.ceil(step * scale);

    if (size >= maxSize) {
      size = maxSize;
    } else {
      scale = size / step;
    }

    return {
      scale,
      size
    };
  }

  clipBbox(graphics, x0, y0, x1, y1) {
    const bboxWidth = x1 - x0;
    const bboxHeight = y1 - y0;
    graphics.ctx.rect(x0, y0, bboxWidth, bboxHeight);
    graphics.clip();
    graphics.endPath();
  }

  setFillAndStrokeStyleToContext(graphics, paintType, color) {
    const context = graphics.ctx,
          current = graphics.current;

    switch (paintType) {
      case PaintType.COLORED:
        const ctx = this.ctx;
        context.fillStyle = ctx.fillStyle;
        context.strokeStyle = ctx.strokeStyle;
        current.fillColor = ctx.fillStyle;
        current.strokeColor = ctx.strokeStyle;
        break;

      case PaintType.UNCOLORED:
        const cssColor = _util.Util.makeHexColor(color[0], color[1], color[2]);

        context.fillStyle = cssColor;
        context.strokeStyle = cssColor;
        current.fillColor = cssColor;
        current.strokeColor = cssColor;
        break;

      default:
        throw new _util.FormatError(`Unsupported paint type: ${paintType}`);
    }
  }

  getPattern(ctx, owner, inverse, shadingFill = false) {
    let matrix = inverse;

    if (!shadingFill) {
      matrix = _util.Util.transform(matrix, owner.baseTransform);

      if (this.matrix) {
        matrix = _util.Util.transform(matrix, this.matrix);
      }
    }

    const temporaryPatternCanvas = this.createPatternCanvas(owner);
    let domMatrix = new DOMMatrix(matrix);
    domMatrix = domMatrix.translate(temporaryPatternCanvas.offsetX, temporaryPatternCanvas.offsetY);
    domMatrix = domMatrix.scale(1 / temporaryPatternCanvas.scaleX, 1 / temporaryPatternCanvas.scaleY);
    const pattern = ctx.createPattern(temporaryPatternCanvas.canvas, "repeat");

    try {
      pattern.setTransform(domMatrix);
    } catch (ex) {
      (0, _util.warn)(`TilingPattern.getPattern: "${ex?.message}".`);
    }

    return pattern;
  }

}

exports.TilingPattern = TilingPattern;

/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.GlobalWorkerOptions = void 0;
const GlobalWorkerOptions = Object.create(null);
exports.GlobalWorkerOptions = GlobalWorkerOptions;
GlobalWorkerOptions.workerPort = GlobalWorkerOptions.workerPort === undefined ? null : GlobalWorkerOptions.workerPort;
GlobalWorkerOptions.workerSrc = GlobalWorkerOptions.workerSrc === undefined ? "" : GlobalWorkerOptions.workerSrc;

/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.MessageHandler = void 0;

var _util = __w_pdfjs_require__(2);

const CallbackKind = {
  UNKNOWN: 0,
  DATA: 1,
  ERROR: 2
};
const StreamKind = {
  UNKNOWN: 0,
  CANCEL: 1,
  CANCEL_COMPLETE: 2,
  CLOSE: 3,
  ENQUEUE: 4,
  ERROR: 5,
  PULL: 6,
  PULL_COMPLETE: 7,
  START_COMPLETE: 8
};

function wrapReason(reason) {
  if (typeof reason !== "object" || reason === null) {
    return reason;
  }

  switch (reason.name) {
    case "AbortException":
      return new _util.AbortException(reason.message);

    case "MissingPDFException":
      return new _util.MissingPDFException(reason.message);

    case "UnexpectedResponseException":
      return new _util.UnexpectedResponseException(reason.message, reason.status);

    case "UnknownErrorException":
      return new _util.UnknownErrorException(reason.message, reason.details);

    default:
      return new _util.UnknownErrorException(reason.message, reason.toString());
  }
}

class MessageHandler {
  constructor(sourceName, targetName, comObj) {
    this.sourceName = sourceName;
    this.targetName = targetName;
    this.comObj = comObj;
    this.callbackId = 1;
    this.streamId = 1;
    this.postMessageTransfers = true;
    this.streamSinks = Object.create(null);
    this.streamControllers = Object.create(null);
    this.callbackCapabilities = Object.create(null);
    this.actionHandler = Object.create(null);

    this._onComObjOnMessage = event => {
      const data = event.data;

      if (data.targetName !== this.sourceName) {
        return;
      }

      if (data.stream) {
        this._processStreamMessage(data);

        return;
      }

      if (data.callback) {
        const callbackId = data.callbackId;
        const capability = this.callbackCapabilities[callbackId];

        if (!capability) {
          throw new Error(`Cannot resolve callback ${callbackId}`);
        }

        delete this.callbackCapabilities[callbackId];

        if (data.callback === CallbackKind.DATA) {
          capability.resolve(data.data);
        } else if (data.callback === CallbackKind.ERROR) {
          capability.reject(wrapReason(data.reason));
        } else {
          throw new Error("Unexpected callback case");
        }

        return;
      }

      const action = this.actionHandler[data.action];

      if (!action) {
        throw new Error(`Unknown action from worker: ${data.action}`);
      }

      if (data.callbackId) {
        const cbSourceName = this.sourceName;
        const cbTargetName = data.sourceName;
        new Promise(function (resolve) {
          resolve(action(data.data));
        }).then(function (result) {
          comObj.postMessage({
            sourceName: cbSourceName,
            targetName: cbTargetName,
            callback: CallbackKind.DATA,
            callbackId: data.callbackId,
            data: result
          });
        }, function (reason) {
          comObj.postMessage({
            sourceName: cbSourceName,
            targetName: cbTargetName,
            callback: CallbackKind.ERROR,
            callbackId: data.callbackId,
            reason: wrapReason(reason)
          });
        });
        return;
      }

      if (data.streamId) {
        this._createStreamSink(data);

        return;
      }

      action(data.data);
    };

    comObj.addEventListener("message", this._onComObjOnMessage);
  }

  on(actionName, handler) {
    const ah = this.actionHandler;

    if (ah[actionName]) {
      throw new Error(`There is already an actionName called "${actionName}"`);
    }

    ah[actionName] = handler;
  }

  send(actionName, data, transfers) {
    this._postMessage({
      sourceName: this.sourceName,
      targetName: this.targetName,
      action: actionName,
      data
    }, transfers);
  }

  sendWithPromise(actionName, data, transfers) {
    const callbackId = this.callbackId++;
    const capability = (0, _util.createPromiseCapability)();
    this.callbackCapabilities[callbackId] = capability;

    try {
      this._postMessage({
        sourceName: this.sourceName,
        targetName: this.targetName,
        action: actionName,
        callbackId,
        data
      }, transfers);
    } catch (ex) {
      capability.reject(ex);
    }

    return capability.promise;
  }

  sendWithStream(actionName, data, queueingStrategy, transfers) {
    const streamId = this.streamId++;
    const sourceName = this.sourceName;
    const targetName = this.targetName;
    const comObj = this.comObj;
    return new ReadableStream({
      start: controller => {
        const startCapability = (0, _util.createPromiseCapability)();
        this.streamControllers[streamId] = {
          controller,
          startCall: startCapability,
          pullCall: null,
          cancelCall: null,
          isClosed: false
        };

        this._postMessage({
          sourceName,
          targetName,
          action: actionName,
          streamId,
          data,
          desiredSize: controller.desiredSize
        }, transfers);

        return startCapability.promise;
      },
      pull: controller => {
        const pullCapability = (0, _util.createPromiseCapability)();
        this.streamControllers[streamId].pullCall = pullCapability;
        comObj.postMessage({
          sourceName,
          targetName,
          stream: StreamKind.PULL,
          streamId,
          desiredSize: controller.desiredSize
        });
        return pullCapability.promise;
      },
      cancel: reason => {
        (0, _util.assert)(reason instanceof Error, "cancel must have a valid reason");
        const cancelCapability = (0, _util.createPromiseCapability)();
        this.streamControllers[streamId].cancelCall = cancelCapability;
        this.streamControllers[streamId].isClosed = true;
        comObj.postMessage({
          sourceName,
          targetName,
          stream: StreamKind.CANCEL,
          streamId,
          reason: wrapReason(reason)
        });
        return cancelCapability.promise;
      }
    }, queueingStrategy);
  }

  _createStreamSink(data) {
    const self = this;
    const action = this.actionHandler[data.action];
    const streamId = data.streamId;
    const sourceName = this.sourceName;
    const targetName = data.sourceName;
    const comObj = this.comObj;
    const streamSink = {
      enqueue(chunk, size = 1, transfers) {
        if (this.isCancelled) {
          return;
        }

        const lastDesiredSize = this.desiredSize;
        this.desiredSize -= size;

        if (lastDesiredSize > 0 && this.desiredSize <= 0) {
          this.sinkCapability = (0, _util.createPromiseCapability)();
          this.ready = this.sinkCapability.promise;
        }

        self._postMessage({
          sourceName,
          targetName,
          stream: StreamKind.ENQUEUE,
          streamId,
          chunk
        }, transfers);
      },

      close() {
        if (this.isCancelled) {
          return;
        }

        this.isCancelled = true;
        comObj.postMessage({
          sourceName,
          targetName,
          stream: StreamKind.CLOSE,
          streamId
        });
        delete self.streamSinks[streamId];
      },

      error(reason) {
        (0, _util.assert)(reason instanceof Error, "error must have a valid reason");

        if (this.isCancelled) {
          return;
        }

        this.isCancelled = true;
        comObj.postMessage({
          sourceName,
          targetName,
          stream: StreamKind.ERROR,
          streamId,
          reason: wrapReason(reason)
        });
      },

      sinkCapability: (0, _util.createPromiseCapability)(),
      onPull: null,
      onCancel: null,
      isCancelled: false,
      desiredSize: data.desiredSize,
      ready: null
    };
    streamSink.sinkCapability.resolve();
    streamSink.ready = streamSink.sinkCapability.promise;
    this.streamSinks[streamId] = streamSink;
    new Promise(function (resolve) {
      resolve(action(data.data, streamSink));
    }).then(function () {
      comObj.postMessage({
        sourceName,
        targetName,
        stream: StreamKind.START_COMPLETE,
        streamId,
        success: true
      });
    }, function (reason) {
      comObj.postMessage({
        sourceName,
        targetName,
        stream: StreamKind.START_COMPLETE,
        streamId,
        reason: wrapReason(reason)
      });
    });
  }

  _processStreamMessage(data) {
    const streamId = data.streamId;
    const sourceName = this.sourceName;
    const targetName = data.sourceName;
    const comObj = this.comObj;

    switch (data.stream) {
      case StreamKind.START_COMPLETE:
        if (data.success) {
          this.streamControllers[streamId].startCall.resolve();
        } else {
          this.streamControllers[streamId].startCall.reject(wrapReason(data.reason));
        }

        break;

      case StreamKind.PULL_COMPLETE:
        if (data.success) {
          this.streamControllers[streamId].pullCall.resolve();
        } else {
          this.streamControllers[streamId].pullCall.reject(wrapReason(data.reason));
        }

        break;

      case StreamKind.PULL:
        if (!this.streamSinks[streamId]) {
          comObj.postMessage({
            sourceName,
            targetName,
            stream: StreamKind.PULL_COMPLETE,
            streamId,
            success: true
          });
          break;
        }

        if (this.streamSinks[streamId].desiredSize <= 0 && data.desiredSize > 0) {
          this.streamSinks[streamId].sinkCapability.resolve();
        }

        this.streamSinks[streamId].desiredSize = data.desiredSize;
        const {
          onPull
        } = this.streamSinks[data.streamId];
        new Promise(function (resolve) {
          resolve(onPull && onPull());
        }).then(function () {
          comObj.postMessage({
            sourceName,
            targetName,
            stream: StreamKind.PULL_COMPLETE,
            streamId,
            success: true
          });
        }, function (reason) {
          comObj.postMessage({
            sourceName,
            targetName,
            stream: StreamKind.PULL_COMPLETE,
            streamId,
            reason: wrapReason(reason)
          });
        });
        break;

      case StreamKind.ENQUEUE:
        (0, _util.assert)(this.streamControllers[streamId], "enqueue should have stream controller");

        if (this.streamControllers[streamId].isClosed) {
          break;
        }

        this.streamControllers[streamId].controller.enqueue(data.chunk);
        break;

      case StreamKind.CLOSE:
        (0, _util.assert)(this.streamControllers[streamId], "close should have stream controller");

        if (this.streamControllers[streamId].isClosed) {
          break;
        }

        this.streamControllers[streamId].isClosed = true;
        this.streamControllers[streamId].controller.close();

        this._deleteStreamController(streamId);

        break;

      case StreamKind.ERROR:
        (0, _util.assert)(this.streamControllers[streamId], "error should have stream controller");
        this.streamControllers[streamId].controller.error(wrapReason(data.reason));

        this._deleteStreamController(streamId);

        break;

      case StreamKind.CANCEL_COMPLETE:
        if (data.success) {
          this.streamControllers[streamId].cancelCall.resolve();
        } else {
          this.streamControllers[streamId].cancelCall.reject(wrapReason(data.reason));
        }

        this._deleteStreamController(streamId);

        break;

      case StreamKind.CANCEL:
        if (!this.streamSinks[streamId]) {
          break;
        }

        const {
          onCancel
        } = this.streamSinks[data.streamId];
        new Promise(function (resolve) {
          resolve(onCancel && onCancel(wrapReason(data.reason)));
        }).then(function () {
          comObj.postMessage({
            sourceName,
            targetName,
            stream: StreamKind.CANCEL_COMPLETE,
            streamId,
            success: true
          });
        }, function (reason) {
          comObj.postMessage({
            sourceName,
            targetName,
            stream: StreamKind.CANCEL_COMPLETE,
            streamId,
            reason: wrapReason(reason)
          });
        });
        this.streamSinks[streamId].sinkCapability.reject(wrapReason(data.reason));
        this.streamSinks[streamId].isCancelled = true;
        delete this.streamSinks[streamId];
        break;

      default:
        throw new Error("Unexpected stream case");
    }
  }

  async _deleteStreamController(streamId) {
    await Promise.allSettled([this.streamControllers[streamId].startCall, this.streamControllers[streamId].pullCall, this.streamControllers[streamId].cancelCall].map(function (capability) {
      return capability && capability.promise;
    }));
    delete this.streamControllers[streamId];
  }

  _postMessage(message, transfers) {
    if (transfers && this.postMessageTransfers) {
      this.comObj.postMessage(message, transfers);
    } else {
      this.comObj.postMessage(message);
    }
  }

  destroy() {
    this.comObj.removeEventListener("message", this._onComObjOnMessage);
  }

}

exports.MessageHandler = MessageHandler;

/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Metadata = void 0;

var _util = __w_pdfjs_require__(2);

class Metadata {
  constructor({
    parsedData,
    rawData
  }) {
    this._metadataMap = parsedData;
    this._data = rawData;
  }

  getRaw() {
    return this._data;
  }

  get(name) {
    return this._metadataMap.get(name) ?? null;
  }

  getAll() {
    return (0, _util.objectFromMap)(this._metadataMap);
  }

  has(name) {
    return this._metadataMap.has(name);
  }

}

exports.Metadata = Metadata;

/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.OptionalContentConfig = void 0;

var _util = __w_pdfjs_require__(2);

class OptionalContentGroup {
  constructor(name, intent) {
    this.visible = true;
    this.name = name;
    this.intent = intent;
  }

}

class OptionalContentConfig {
  constructor(data) {
    this.name = null;
    this.creator = null;
    this._order = null;
    this._groups = new Map();

    if (data === null) {
      return;
    }

    this.name = data.name;
    this.creator = data.creator;
    this._order = data.order;

    for (const group of data.groups) {
      this._groups.set(group.id, new OptionalContentGroup(group.name, group.intent));
    }

    if (data.baseState === "OFF") {
      for (const group of this._groups) {
        group.visible = false;
      }
    }

    for (const on of data.on) {
      this._groups.get(on).visible = true;
    }

    for (const off of data.off) {
      this._groups.get(off).visible = false;
    }
  }

  _evaluateVisibilityExpression(array) {
    const length = array.length;

    if (length < 2) {
      return true;
    }

    const operator = array[0];

    for (let i = 1; i < length; i++) {
      const element = array[i];
      let state;

      if (Array.isArray(element)) {
        state = this._evaluateVisibilityExpression(element);
      } else if (this._groups.has(element)) {
        state = this._groups.get(element).visible;
      } else {
        (0, _util.warn)(`Optional content group not found: ${element}`);
        return true;
      }

      switch (operator) {
        case "And":
          if (!state) {
            return false;
          }

          break;

        case "Or":
          if (state) {
            return true;
          }

          break;

        case "Not":
          return !state;

        default:
          return true;
      }
    }

    return operator === "And";
  }

  isVisible(group) {
    if (group.type === "OCG") {
      if (!this._groups.has(group.id)) {
        (0, _util.warn)(`Optional content group not found: ${group.id}`);
        return true;
      }

      return this._groups.get(group.id).visible;
    } else if (group.type === "OCMD") {
      if (group.expression) {
        return this._evaluateVisibilityExpression(group.expression);
      }

      if (!group.policy || group.policy === "AnyOn") {
        for (const id of group.ids) {
          if (!this._groups.has(id)) {
            (0, _util.warn)(`Optional content group not found: ${id}`);
            return true;
          }

          if (this._groups.get(id).visible) {
            return true;
          }
        }

        return false;
      } else if (group.policy === "AllOn") {
        for (const id of group.ids) {
          if (!this._groups.has(id)) {
            (0, _util.warn)(`Optional content group not found: ${id}`);
            return true;
          }

          if (!this._groups.get(id).visible) {
            return false;
          }
        }

        return true;
      } else if (group.policy === "AnyOff") {
        for (const id of group.ids) {
          if (!this._groups.has(id)) {
            (0, _util.warn)(`Optional content group not found: ${id}`);
            return true;
          }

          if (!this._groups.get(id).visible) {
            return true;
          }
        }

        return false;
      } else if (group.policy === "AllOff") {
        for (const id of group.ids) {
          if (!this._groups.has(id)) {
            (0, _util.warn)(`Optional content group not found: ${id}`);
            return true;
          }

          if (this._groups.get(id).visible) {
            return false;
          }
        }

        return true;
      }

      (0, _util.warn)(`Unknown optional content policy ${group.policy}.`);
      return true;
    }

    (0, _util.warn)(`Unknown group type ${group.type}.`);
    return true;
  }

  setVisibility(id, visible = true) {
    if (!this._groups.has(id)) {
      (0, _util.warn)(`Optional content group not found: ${id}`);
      return;
    }

    this._groups.get(id).visible = !!visible;
  }

  getOrder() {
    if (!this._groups.size) {
      return null;
    }

    if (this._order) {
      return this._order.slice();
    }

    return Array.from(this._groups.keys());
  }

  getGroups() {
    return this._groups.size > 0 ? (0, _util.objectFromMap)(this._groups) : null;
  }

  getGroup(id) {
    return this._groups.get(id) || null;
  }

}

exports.OptionalContentConfig = OptionalContentConfig;

/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.PDFDataTransportStream = void 0;

var _util = __w_pdfjs_require__(2);

var _display_utils = __w_pdfjs_require__(1);

class PDFDataTransportStream {
  constructor(params, pdfDataRangeTransport) {
    (0, _util.assert)(pdfDataRangeTransport, 'PDFDataTransportStream - missing required "pdfDataRangeTransport" argument.');
    this._queuedChunks = [];
    this._progressiveDone = params.progressiveDone || false;
    this._contentDispositionFilename = params.contentDispositionFilename || null;
    const initialData = params.initialData;

    if (initialData?.length > 0) {
      const buffer = new Uint8Array(initialData).buffer;

      this._queuedChunks.push(buffer);
    }

    this._pdfDataRangeTransport = pdfDataRangeTransport;
    this._isStreamingSupported = !params.disableStream;
    this._isRangeSupported = !params.disableRange;
    this._contentLength = params.length;
    this._fullRequestReader = null;
    this._rangeReaders = [];

    this._pdfDataRangeTransport.addRangeListener((begin, chunk) => {
      this._onReceiveData({
        begin,
        chunk
      });
    });

    this._pdfDataRangeTransport.addProgressListener((loaded, total) => {
      this._onProgress({
        loaded,
        total
      });
    });

    this._pdfDataRangeTransport.addProgressiveReadListener(chunk => {
      this._onReceiveData({
        chunk
      });
    });

    this._pdfDataRangeTransport.addProgressiveDoneListener(() => {
      this._onProgressiveDone();
    });

    this._pdfDataRangeTransport.transportReady();
  }

  _onReceiveData(args) {
    const buffer = new Uint8Array(args.chunk).buffer;

    if (args.begin === undefined) {
      if (this._fullRequestReader) {
        this._fullRequestReader._enqueue(buffer);
      } else {
        this._queuedChunks.push(buffer);
      }
    } else {
      const found = this._rangeReaders.some(function (rangeReader) {
        if (rangeReader._begin !== args.begin) {
          return false;
        }

        rangeReader._enqueue(buffer);

        return true;
      });

      (0, _util.assert)(found, "_onReceiveData - no `PDFDataTransportStreamRangeReader` instance found.");
    }
  }

  get _progressiveDataLength() {
    return this._fullRequestReader?._loaded ?? 0;
  }

  _onProgress(evt) {
    if (evt.total === undefined) {
      const firstReader = this._rangeReaders[0];

      if (firstReader?.onProgress) {
        firstReader.onProgress({
          loaded: evt.loaded
        });
      }
    } else {
      const fullReader = this._fullRequestReader;

      if (fullReader?.onProgress) {
        fullReader.onProgress({
          loaded: evt.loaded,
          total: evt.total
        });
      }
    }
  }

  _onProgressiveDone() {
    if (this._fullRequestReader) {
      this._fullRequestReader.progressiveDone();
    }

    this._progressiveDone = true;
  }

  _removeRangeReader(reader) {
    const i = this._rangeReaders.indexOf(reader);

    if (i >= 0) {
      this._rangeReaders.splice(i, 1);
    }
  }

  getFullReader() {
    (0, _util.assert)(!this._fullRequestReader, "PDFDataTransportStream.getFullReader can only be called once.");
    const queuedChunks = this._queuedChunks;
    this._queuedChunks = null;
    return new PDFDataTransportStreamReader(this, queuedChunks, this._progressiveDone, this._contentDispositionFilename);
  }

  getRangeReader(begin, end) {
    if (end <= this._progressiveDataLength) {
      return null;
    }

    const reader = new PDFDataTransportStreamRangeReader(this, begin, end);

    this._pdfDataRangeTransport.requestDataRange(begin, end);

    this._rangeReaders.push(reader);

    return reader;
  }

  cancelAllRequests(reason) {
    if (this._fullRequestReader) {
      this._fullRequestReader.cancel(reason);
    }

    for (const reader of this._rangeReaders.slice(0)) {
      reader.cancel(reason);
    }

    this._pdfDataRangeTransport.abort();
  }

}

exports.PDFDataTransportStream = PDFDataTransportStream;

class PDFDataTransportStreamReader {
  constructor(stream, queuedChunks, progressiveDone = false, contentDispositionFilename = null) {
    this._stream = stream;
    this._done = progressiveDone || false;
    this._filename = (0, _display_utils.isPdfFile)(contentDispositionFilename) ? contentDispositionFilename : null;
    this._queuedChunks = queuedChunks || [];
    this._loaded = 0;

    for (const chunk of this._queuedChunks) {
      this._loaded += chunk.byteLength;
    }

    this._requests = [];
    this._headersReady = Promise.resolve();
    stream._fullRequestReader = this;
    this.onProgress = null;
  }

  _enqueue(chunk) {
    if (this._done) {
      return;
    }

    if (this._requests.length > 0) {
      const requestCapability = this._requests.shift();

      requestCapability.resolve({
        value: chunk,
        done: false
      });
    } else {
      this._queuedChunks.push(chunk);
    }

    this._loaded += chunk.byteLength;
  }

  get headersReady() {
    return this._headersReady;
  }

  get filename() {
    return this._filename;
  }

  get isRangeSupported() {
    return this._stream._isRangeSupported;
  }

  get isStreamingSupported() {
    return this._stream._isStreamingSupported;
  }

  get contentLength() {
    return this._stream._contentLength;
  }

  async read() {
    if (this._queuedChunks.length > 0) {
      const chunk = this._queuedChunks.shift();

      return {
        value: chunk,
        done: false
      };
    }

    if (this._done) {
      return {
        value: undefined,
        done: true
      };
    }

    const requestCapability = (0, _util.createPromiseCapability)();

    this._requests.push(requestCapability);

    return requestCapability.promise;
  }

  cancel(reason) {
    this._done = true;

    for (const requestCapability of this._requests) {
      requestCapability.resolve({
        value: undefined,
        done: true
      });
    }

    this._requests.length = 0;
  }

  progressiveDone() {
    if (this._done) {
      return;
    }

    this._done = true;
  }

}

class PDFDataTransportStreamRangeReader {
  constructor(stream, begin, end) {
    this._stream = stream;
    this._begin = begin;
    this._end = end;
    this._queuedChunk = null;
    this._requests = [];
    this._done = false;
    this.onProgress = null;
  }

  _enqueue(chunk) {
    if (this._done) {
      return;
    }

    if (this._requests.length === 0) {
      this._queuedChunk = chunk;
    } else {
      const requestsCapability = this._requests.shift();

      requestsCapability.resolve({
        value: chunk,
        done: false
      });

      for (const requestCapability of this._requests) {
        requestCapability.resolve({
          value: undefined,
          done: true
        });
      }

      this._requests.length = 0;
    }

    this._done = true;

    this._stream._removeRangeReader(this);
  }

  get isStreamingSupported() {
    return false;
  }

  async read() {
    if (this._queuedChunk) {
      const chunk = this._queuedChunk;
      this._queuedChunk = null;
      return {
        value: chunk,
        done: false
      };
    }

    if (this._done) {
      return {
        value: undefined,
        done: true
      };
    }

    const requestCapability = (0, _util.createPromiseCapability)();

    this._requests.push(requestCapability);

    return requestCapability.promise;
  }

  cancel(reason) {
    this._done = true;

    for (const requestCapability of this._requests) {
      requestCapability.resolve({
        value: undefined,
        done: true
      });
    }

    this._requests.length = 0;

    this._stream._removeRangeReader(this);
  }

}

/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.AnnotationLayer = void 0;

var _display_utils = __w_pdfjs_require__(1);

var _util = __w_pdfjs_require__(2);

var _annotation_storage = __w_pdfjs_require__(9);

var _scripting_utils = __w_pdfjs_require__(18);

class AnnotationElementFactory {
  static create(parameters) {
    const subtype = parameters.data.annotationType;

    switch (subtype) {
      case _util.AnnotationType.LINK:
        return new LinkAnnotationElement(parameters);

      case _util.AnnotationType.TEXT:
        return new TextAnnotationElement(parameters);

      case _util.AnnotationType.WIDGET:
        const fieldType = parameters.data.fieldType;

        switch (fieldType) {
          case "Tx":
            return new TextWidgetAnnotationElement(parameters);

          case "Btn":
            if (parameters.data.radioButton) {
              return new RadioButtonWidgetAnnotationElement(parameters);
            } else if (parameters.data.checkBox) {
              return new CheckboxWidgetAnnotationElement(parameters);
            }

            return new PushButtonWidgetAnnotationElement(parameters);

          case "Ch":
            return new ChoiceWidgetAnnotationElement(parameters);
        }

        return new WidgetAnnotationElement(parameters);

      case _util.AnnotationType.POPUP:
        return new PopupAnnotationElement(parameters);

      case _util.AnnotationType.FREETEXT:
        return new FreeTextAnnotationElement(parameters);

      case _util.AnnotationType.LINE:
        return new LineAnnotationElement(parameters);

      case _util.AnnotationType.SQUARE:
        return new SquareAnnotationElement(parameters);

      case _util.AnnotationType.CIRCLE:
        return new CircleAnnotationElement(parameters);

      case _util.AnnotationType.POLYLINE:
        return new PolylineAnnotationElement(parameters);

      case _util.AnnotationType.CARET:
        return new CaretAnnotationElement(parameters);

      case _util.AnnotationType.INK:
        return new InkAnnotationElement(parameters);

      case _util.AnnotationType.POLYGON:
        return new PolygonAnnotationElement(parameters);

      case _util.AnnotationType.HIGHLIGHT:
        return new HighlightAnnotationElement(parameters);

      case _util.AnnotationType.UNDERLINE:
        return new UnderlineAnnotationElement(parameters);

      case _util.AnnotationType.SQUIGGLY:
        return new SquigglyAnnotationElement(parameters);

      case _util.AnnotationType.STRIKEOUT:
        return new StrikeOutAnnotationElement(parameters);

      case _util.AnnotationType.STAMP:
        return new StampAnnotationElement(parameters);

      case _util.AnnotationType.FILEATTACHMENT:
        return new FileAttachmentAnnotationElement(parameters);

      default:
        return new AnnotationElement(parameters);
    }
  }

}

class AnnotationElement {
  constructor(parameters, {
    isRenderable = false,
    ignoreBorder = false,
    createQuadrilaterals = false
  } = {}) {
    this.isRenderable = isRenderable;
    this.data = parameters.data;
    this.layer = parameters.layer;
    this.page = parameters.page;
    this.viewport = parameters.viewport;
    this.linkService = parameters.linkService;
    this.downloadManager = parameters.downloadManager;
    this.imageResourcesPath = parameters.imageResourcesPath;
    this.renderInteractiveForms = parameters.renderInteractiveForms;
    this.svgFactory = parameters.svgFactory;
    this.annotationStorage = parameters.annotationStorage;
    this.enableScripting = parameters.enableScripting;
    this.hasJSActions = parameters.hasJSActions;
    this._mouseState = parameters.mouseState;

    if (isRenderable) {
      this.container = this._createContainer(ignoreBorder);
    }

    if (createQuadrilaterals) {
      this.quadrilaterals = this._createQuadrilaterals(ignoreBorder);
    }
  }

  _createContainer(ignoreBorder = false) {
    const data = this.data,
          page = this.page,
          viewport = this.viewport;
    const container = document.createElement("section");
    let width = data.rect[2] - data.rect[0];
    let height = data.rect[3] - data.rect[1];
    container.setAttribute("data-annotation-id", data.id);

    const rect = _util.Util.normalizeRect([data.rect[0], page.view[3] - data.rect[1] + page.view[1], data.rect[2], page.view[3] - data.rect[3] + page.view[1]]);

    container.style.transform = `matrix(${viewport.transform.join(",")})`;
    container.style.transformOrigin = `${-rect[0]}px ${-rect[1]}px`;

    if (!ignoreBorder && data.borderStyle.width > 0) {
      container.style.borderWidth = `${data.borderStyle.width}px`;

      if (data.borderStyle.style !== _util.AnnotationBorderStyleType.UNDERLINE) {
        width -= 2 * data.borderStyle.width;
        height -= 2 * data.borderStyle.width;
      }

      const horizontalRadius = data.borderStyle.horizontalCornerRadius;
      const verticalRadius = data.borderStyle.verticalCornerRadius;

      if (horizontalRadius > 0 || verticalRadius > 0) {
        const radius = `${horizontalRadius}px / ${verticalRadius}px`;
        container.style.borderRadius = radius;
      }

      switch (data.borderStyle.style) {
        case _util.AnnotationBorderStyleType.SOLID:
          container.style.borderStyle = "solid";
          break;

        case _util.AnnotationBorderStyleType.DASHED:
          container.style.borderStyle = "dashed";
          break;

        case _util.AnnotationBorderStyleType.BEVELED:
          (0, _util.warn)("Unimplemented border style: beveled");
          break;

        case _util.AnnotationBorderStyleType.INSET:
          (0, _util.warn)("Unimplemented border style: inset");
          break;

        case _util.AnnotationBorderStyleType.UNDERLINE:
          container.style.borderBottomStyle = "solid";
          break;

        default:
          break;
      }

      if (data.color) {
        container.style.borderColor = _util.Util.makeHexColor(data.color[0] | 0, data.color[1] | 0, data.color[2] | 0);
      } else {
        container.style.borderWidth = 0;
      }
    }

    container.style.left = `${rect[0]}px`;
    container.style.top = `${rect[1]}px`;
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    return container;
  }

  _createQuadrilaterals(ignoreBorder = false) {
    if (!this.data.quadPoints) {
      return null;
    }

    const quadrilaterals = [];
    const savedRect = this.data.rect;

    for (const quadPoint of this.data.quadPoints) {
      this.data.rect = [quadPoint[2].x, quadPoint[2].y, quadPoint[1].x, quadPoint[1].y];
      quadrilaterals.push(this._createContainer(ignoreBorder));
    }

    this.data.rect = savedRect;
    return quadrilaterals;
  }

  _createPopup(trigger, data) {
    let container = this.container;

    if (this.quadrilaterals) {
      trigger = trigger || this.quadrilaterals;
      container = this.quadrilaterals[0];
    }

    if (!trigger) {
      trigger = document.createElement("div");
      trigger.style.height = container.style.height;
      trigger.style.width = container.style.width;
      container.appendChild(trigger);
    }

    const popupElement = new PopupElement({
      container,
      trigger,
      color: data.color,
      title: data.title,
      modificationDate: data.modificationDate,
      contents: data.contents,
      hideWrapper: true
    });
    const popup = popupElement.render();
    popup.style.left = container.style.width;
    container.appendChild(popup);
  }

  _renderQuadrilaterals(className) {
    for (const quadrilateral of this.quadrilaterals) {
      quadrilateral.className = className;
    }

    return this.quadrilaterals;
  }

  render() {
    (0, _util.unreachable)("Abstract method `AnnotationElement.render` called");
  }

}

class LinkAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.url || parameters.data.dest || parameters.data.action || parameters.data.isTooltipOnly || parameters.data.actions && (parameters.data.actions.Action || parameters.data.actions["Mouse Up"] || parameters.data.actions["Mouse Down"]));
    super(parameters, {
      isRenderable,
      createQuadrilaterals: true
    });
  }

  render() {
    const {
      data,
      linkService
    } = this;
    const link = document.createElement("a");

    if (data.url) {
      (0, _display_utils.addLinkAttributes)(link, {
        url: data.url,
        target: data.newWindow ? _display_utils.LinkTarget.BLANK : linkService.externalLinkTarget,
        rel: linkService.externalLinkRel,
        enabled: linkService.externalLinkEnabled
      });
    } else if (data.action) {
      this._bindNamedAction(link, data.action);
    } else if (data.dest) {
      this._bindLink(link, data.dest);
    } else if (data.actions && (data.actions.Action || data.actions["Mouse Up"] || data.actions["Mouse Down"]) && this.enableScripting && this.hasJSActions) {
      this._bindJSAction(link, data);
    } else {
      this._bindLink(link, "");
    }

    if (this.quadrilaterals) {
      return this._renderQuadrilaterals("linkAnnotation").map((quadrilateral, index) => {
        const linkElement = index === 0 ? link : link.cloneNode();
        quadrilateral.appendChild(linkElement);
        return quadrilateral;
      });
    }

    this.container.className = "linkAnnotation";
    this.container.appendChild(link);
    return this.container;
  }

  _bindLink(link, destination) {
    link.href = this.linkService.getDestinationHash(destination);

    link.onclick = () => {
      if (destination) {
        this.linkService.goToDestination(destination);
      }

      return false;
    };

    if (destination || destination === "") {
      link.className = "internalLink";
    }
  }

  _bindNamedAction(link, action) {
    link.href = this.linkService.getAnchorUrl("");

    link.onclick = () => {
      this.linkService.executeNamedAction(action);
      return false;
    };

    link.className = "internalLink";
  }

  _bindJSAction(link, data) {
    link.href = this.linkService.getAnchorUrl("");
    const map = new Map([["Action", "onclick"], ["Mouse Up", "onmouseup"], ["Mouse Down", "onmousedown"]]);

    for (const name of Object.keys(data.actions)) {
      const jsName = map.get(name);

      if (!jsName) {
        continue;
      }

      link[jsName] = () => {
        this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
          source: this,
          detail: {
            id: data.id,
            name
          }
        });
        return false;
      };
    }

    link.className = "internalLink";
  }

}

class TextAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, {
      isRenderable
    });
  }

  render() {
    this.container.className = "textAnnotation";
    const image = document.createElement("img");
    image.style.height = this.container.style.height;
    image.style.width = this.container.style.width;
    image.src = this.imageResourcesPath + "annotation-" + this.data.name.toLowerCase() + ".svg";
    image.alt = "[{{type}} Annotation]";
    image.dataset.l10nId = "text_annotation_type";
    image.dataset.l10nArgs = JSON.stringify({
      type: this.data.name
    });

    if (!this.data.hasPopup) {
      this._createPopup(image, this.data);
    }

    this.container.appendChild(image);
    return this.container;
  }

}

class WidgetAnnotationElement extends AnnotationElement {
  render() {
    if (this.data.alternativeText) {
      this.container.title = this.data.alternativeText;
    }

    return this.container;
  }

  _getKeyModifier(event) {
    return navigator.platform.includes("Win") && event.ctrlKey || navigator.platform.includes("Mac") && event.metaKey;
  }

  _setEventListener(element, baseName, eventName, valueGetter) {
    if (baseName.includes("mouse")) {
      element.addEventListener(baseName, event => {
        this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
          source: this,
          detail: {
            id: this.data.id,
            name: eventName,
            value: valueGetter(event),
            shift: event.shiftKey,
            modifier: this._getKeyModifier(event)
          }
        });
      });
    } else {
      element.addEventListener(baseName, event => {
        this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
          source: this,
          detail: {
            id: this.data.id,
            name: eventName,
            value: event.target.checked
          }
        });
      });
    }
  }

  _setEventListeners(element, names, getter) {
    for (const [baseName, eventName] of names) {
      if (eventName === "Action" || this.data.actions?.[eventName]) {
        this._setEventListener(element, baseName, eventName, getter);
      }
    }
  }

  _dispatchEventFromSandbox(actions, jsEvent) {
    const setColor = (jsName, styleName, event) => {
      const color = event.detail[jsName];
      event.target.style[styleName] = _scripting_utils.ColorConverters[`${color[0]}_HTML`](color.slice(1));
    };

    const commonActions = {
      display: event => {
        const hidden = event.detail.display % 2 === 1;
        event.target.style.visibility = hidden ? "hidden" : "visible";
        this.annotationStorage.setValue(this.data.id, {
          hidden,
          print: event.detail.display === 0 || event.detail.display === 3
        });
      },
      print: event => {
        this.annotationStorage.setValue(this.data.id, {
          print: event.detail.print
        });
      },
      hidden: event => {
        event.target.style.visibility = event.detail.hidden ? "hidden" : "visible";
        this.annotationStorage.setValue(this.data.id, {
          hidden: event.detail.hidden
        });
      },
      focus: event => {
        setTimeout(() => event.target.focus({
          preventScroll: false
        }), 0);
      },
      userName: event => {
        event.target.title = event.detail.userName;
      },
      readonly: event => {
        if (event.detail.readonly) {
          event.target.setAttribute("readonly", "");
        } else {
          event.target.removeAttribute("readonly");
        }
      },
      required: event => {
        if (event.detail.required) {
          event.target.setAttribute("required", "");
        } else {
          event.target.removeAttribute("required");
        }
      },
      bgColor: event => {
        setColor("bgColor", "backgroundColor", event);
      },
      fillColor: event => {
        setColor("fillColor", "backgroundColor", event);
      },
      fgColor: event => {
        setColor("fgColor", "color", event);
      },
      textColor: event => {
        setColor("textColor", "color", event);
      },
      borderColor: event => {
        setColor("borderColor", "borderColor", event);
      },
      strokeColor: event => {
        setColor("strokeColor", "borderColor", event);
      }
    };

    for (const name of Object.keys(jsEvent.detail)) {
      const action = actions[name] || commonActions[name];

      if (action) {
        action(jsEvent);
      }
    }
  }

}

class TextWidgetAnnotationElement extends WidgetAnnotationElement {
  constructor(parameters) {
    const isRenderable = parameters.renderInteractiveForms || !parameters.data.hasAppearance && !!parameters.data.fieldValue;
    super(parameters, {
      isRenderable
    });
  }

  setPropertyOnSiblings(base, key, value, keyInStorage) {
    const storage = this.annotationStorage;

    for (const element of document.getElementsByName(base.name)) {
      if (element !== base) {
        element[key] = value;
        const data = Object.create(null);
        data[keyInStorage] = value;
        storage.setValue(element.getAttribute("id"), data);
      }
    }
  }

  render() {
    const storage = this.annotationStorage;
    const id = this.data.id;
    this.container.className = "textWidgetAnnotation";
    let element = null;

    if (this.renderInteractiveForms) {
      const storedData = storage.getValue(id, {
        value: this.data.fieldValue,
        valueAsString: this.data.fieldValue
      });
      const textContent = storedData.valueAsString || storedData.value || "";
      const elementData = {
        userValue: null,
        formattedValue: null,
        beforeInputSelectionRange: null,
        beforeInputValue: null
      };

      if (this.data.multiLine) {
        element = document.createElement("textarea");
        element.textContent = textContent;
      } else {
        element = document.createElement("input");
        element.type = "text";
        element.setAttribute("value", textContent);
      }

      elementData.userValue = textContent;
      element.setAttribute("id", id);
      element.addEventListener("input", event => {
        storage.setValue(id, {
          value: event.target.value
        });
        this.setPropertyOnSiblings(element, "value", event.target.value, "value");
      });

      let blurListener = event => {
        if (elementData.formattedValue) {
          event.target.value = elementData.formattedValue;
        }

        event.target.scrollLeft = 0;
        elementData.beforeInputSelectionRange = null;
      };

      if (this.enableScripting && this.hasJSActions) {
        element.addEventListener("focus", event => {
          if (elementData.userValue) {
            event.target.value = elementData.userValue;
          }
        });
        element.addEventListener("updatefromsandbox", jsEvent => {
          const actions = {
            value(event) {
              elementData.userValue = event.detail.value || "";
              storage.setValue(id, {
                value: elementData.userValue.toString()
              });

              if (!elementData.formattedValue) {
                event.target.value = elementData.userValue;
              }
            },

            valueAsString(event) {
              elementData.formattedValue = event.detail.valueAsString || "";

              if (event.target !== document.activeElement) {
                event.target.value = elementData.formattedValue;
              }

              storage.setValue(id, {
                formattedValue: elementData.formattedValue
              });
            },

            selRange(event) {
              const [selStart, selEnd] = event.detail.selRange;

              if (selStart >= 0 && selEnd < event.target.value.length) {
                event.target.setSelectionRange(selStart, selEnd);
              }
            }

          };

          this._dispatchEventFromSandbox(actions, jsEvent);
        });
        element.addEventListener("keydown", event => {
          elementData.beforeInputValue = event.target.value;
          let commitKey = -1;

          if (event.key === "Escape") {
            commitKey = 0;
          } else if (event.key === "Enter") {
            commitKey = 2;
          } else if (event.key === "Tab") {
            commitKey = 3;
          }

          if (commitKey === -1) {
            return;
          }

          elementData.userValue = event.target.value;
          this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
            source: this,
            detail: {
              id,
              name: "Keystroke",
              value: event.target.value,
              willCommit: true,
              commitKey,
              selStart: event.target.selectionStart,
              selEnd: event.target.selectionEnd
            }
          });
        });
        const _blurListener = blurListener;
        blurListener = null;
        element.addEventListener("blur", event => {
          if (this._mouseState.isDown) {
            elementData.userValue = event.target.value;
            this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
              source: this,
              detail: {
                id,
                name: "Keystroke",
                value: event.target.value,
                willCommit: true,
                commitKey: 1,
                selStart: event.target.selectionStart,
                selEnd: event.target.selectionEnd
              }
            });
          }

          _blurListener(event);
        });
        element.addEventListener("mousedown", event => {
          elementData.beforeInputValue = event.target.value;
          elementData.beforeInputSelectionRange = null;
        });
        element.addEventListener("keyup", event => {
          if (event.target.selectionStart === event.target.selectionEnd) {
            elementData.beforeInputSelectionRange = null;
          }
        });
        element.addEventListener("select", event => {
          elementData.beforeInputSelectionRange = [event.target.selectionStart, event.target.selectionEnd];
        });

        if (this.data.actions?.Keystroke) {
          element.addEventListener("input", event => {
            let selStart = -1;
            let selEnd = -1;

            if (elementData.beforeInputSelectionRange) {
              [selStart, selEnd] = elementData.beforeInputSelectionRange;
            }

            this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
              source: this,
              detail: {
                id,
                name: "Keystroke",
                value: elementData.beforeInputValue,
                change: event.data,
                willCommit: false,
                selStart,
                selEnd
              }
            });
          });
        }

        this._setEventListeners(element, [["focus", "Focus"], ["blur", "Blur"], ["mousedown", "Mouse Down"], ["mouseenter", "Mouse Enter"], ["mouseleave", "Mouse Exit"], ["mouseup", "Mouse Up"]], event => event.target.value);
      }

      if (blurListener) {
        element.addEventListener("blur", blurListener);
      }

      element.disabled = this.data.readOnly;
      element.name = this.data.fieldName;

      if (this.data.maxLen !== null) {
        element.maxLength = this.data.maxLen;
      }

      if (this.data.comb) {
        const fieldWidth = this.data.rect[2] - this.data.rect[0];
        const combWidth = fieldWidth / this.data.maxLen;
        element.classList.add("comb");
        element.style.letterSpacing = `calc(${combWidth}px - 1ch)`;
      }
    } else {
      element = document.createElement("div");
      element.textContent = this.data.fieldValue;
      element.style.verticalAlign = "middle";
      element.style.display = "table-cell";
    }

    this._setTextStyle(element);

    this.container.appendChild(element);
    return this.container;
  }

  _setTextStyle(element) {
    const TEXT_ALIGNMENT = ["left", "center", "right"];
    const {
      fontSize,
      fontColor
    } = this.data.defaultAppearanceData;
    const style = element.style;

    if (fontSize) {
      style.fontSize = `${fontSize}px`;
    }

    style.color = _util.Util.makeHexColor(fontColor[0], fontColor[1], fontColor[2]);

    if (this.data.textAlignment !== null) {
      style.textAlign = TEXT_ALIGNMENT[this.data.textAlignment];
    }
  }

}

class CheckboxWidgetAnnotationElement extends WidgetAnnotationElement {
  constructor(parameters) {
    super(parameters, {
      isRenderable: parameters.renderInteractiveForms
    });
  }

  render() {
    const storage = this.annotationStorage;
    const data = this.data;
    const id = data.id;
    let value = storage.getValue(id, {
      value: data.fieldValue && (data.exportValue && data.exportValue === data.fieldValue || !data.exportValue && data.fieldValue !== "Off")
    }).value;

    if (typeof value === "string") {
      value = value !== "Off";
      storage.setValue(id, {
        value
      });
    }

    this.container.className = "buttonWidgetAnnotation checkBox";
    const element = document.createElement("input");
    element.disabled = data.readOnly;
    element.type = "checkbox";
    element.name = this.data.fieldName;

    if (value) {
      element.setAttribute("checked", true);
    }

    element.setAttribute("id", id);
    element.addEventListener("change", function (event) {
      const name = event.target.name;

      for (const checkbox of document.getElementsByName(name)) {
        if (checkbox !== event.target) {
          checkbox.checked = false;
          storage.setValue(checkbox.parentNode.getAttribute("data-annotation-id"), {
            value: false
          });
        }
      }

      storage.setValue(id, {
        value: event.target.checked
      });
    });

    if (this.enableScripting && this.hasJSActions) {
      element.addEventListener("updatefromsandbox", jsEvent => {
        const actions = {
          value(event) {
            event.target.checked = event.detail.value !== "Off";
            storage.setValue(id, {
              value: event.target.checked
            });
          }

        };

        this._dispatchEventFromSandbox(actions, jsEvent);
      });

      this._setEventListeners(element, [["change", "Validate"], ["change", "Action"], ["focus", "Focus"], ["blur", "Blur"], ["mousedown", "Mouse Down"], ["mouseenter", "Mouse Enter"], ["mouseleave", "Mouse Exit"], ["mouseup", "Mouse Up"]], event => event.target.checked);
    }

    this.container.appendChild(element);
    return this.container;
  }

}

class RadioButtonWidgetAnnotationElement extends WidgetAnnotationElement {
  constructor(parameters) {
    super(parameters, {
      isRenderable: parameters.renderInteractiveForms
    });
  }

  render() {
    this.container.className = "buttonWidgetAnnotation radioButton";
    const storage = this.annotationStorage;
    const data = this.data;
    const id = data.id;
    let value = storage.getValue(id, {
      value: data.fieldValue === data.buttonValue
    }).value;

    if (typeof value === "string") {
      value = value !== data.buttonValue;
      storage.setValue(id, {
        value
      });
    }

    const element = document.createElement("input");
    element.disabled = data.readOnly;
    element.type = "radio";
    element.name = data.fieldName;

    if (value) {
      element.setAttribute("checked", true);
    }

    element.setAttribute("id", id);
    element.addEventListener("change", function (event) {
      const {
        target
      } = event;

      for (const radio of document.getElementsByName(target.name)) {
        if (radio !== target) {
          storage.setValue(radio.getAttribute("id"), {
            value: false
          });
        }
      }

      storage.setValue(id, {
        value: target.checked
      });
    });

    if (this.enableScripting && this.hasJSActions) {
      const pdfButtonValue = data.buttonValue;
      element.addEventListener("updatefromsandbox", jsEvent => {
        const actions = {
          value(event) {
            const checked = pdfButtonValue === event.detail.value;

            for (const radio of document.getElementsByName(event.target.name)) {
              const radioId = radio.getAttribute("id");
              radio.checked = radioId === id && checked;
              storage.setValue(radioId, {
                value: radio.checked
              });
            }
          }

        };

        this._dispatchEventFromSandbox(actions, jsEvent);
      });

      this._setEventListeners(element, [["change", "Validate"], ["change", "Action"], ["focus", "Focus"], ["blur", "Blur"], ["mousedown", "Mouse Down"], ["mouseenter", "Mouse Enter"], ["mouseleave", "Mouse Exit"], ["mouseup", "Mouse Up"]], event => event.target.checked);
    }

    this.container.appendChild(element);
    return this.container;
  }

}

class PushButtonWidgetAnnotationElement extends LinkAnnotationElement {
  render() {
    const container = super.render();
    container.className = "buttonWidgetAnnotation pushButton";

    if (this.data.alternativeText) {
      container.title = this.data.alternativeText;
    }

    return container;
  }

}

class ChoiceWidgetAnnotationElement extends WidgetAnnotationElement {
  constructor(parameters) {
    super(parameters, {
      isRenderable: parameters.renderInteractiveForms
    });
  }

  render() {
    this.container.className = "choiceWidgetAnnotation";
    const storage = this.annotationStorage;
    const id = this.data.id;
    storage.getValue(id, {
      value: this.data.fieldValue.length > 0 ? this.data.fieldValue[0] : undefined
    });
    const selectElement = document.createElement("select");
    selectElement.disabled = this.data.readOnly;
    selectElement.name = this.data.fieldName;
    selectElement.setAttribute("id", id);

    if (!this.data.combo) {
      selectElement.size = this.data.options.length;

      if (this.data.multiSelect) {
        selectElement.multiple = true;
      }
    }

    for (const option of this.data.options) {
      const optionElement = document.createElement("option");
      optionElement.textContent = option.displayValue;
      optionElement.value = option.exportValue;

      if (this.data.fieldValue.includes(option.exportValue)) {
        optionElement.setAttribute("selected", true);
      }

      selectElement.appendChild(optionElement);
    }

    const getValue = (event, isExport) => {
      const name = isExport ? "value" : "textContent";
      const options = event.target.options;

      if (!event.target.multiple) {
        return options.selectedIndex === -1 ? null : options[options.selectedIndex][name];
      }

      return Array.prototype.filter.call(options, option => option.selected).map(option => option[name]);
    };

    const getItems = event => {
      const options = event.target.options;
      return Array.prototype.map.call(options, option => {
        return {
          displayValue: option.textContent,
          exportValue: option.value
        };
      });
    };

    if (this.enableScripting && this.hasJSActions) {
      selectElement.addEventListener("updatefromsandbox", jsEvent => {
        const actions = {
          value(event) {
            const options = selectElement.options;
            const value = event.detail.value;
            const values = new Set(Array.isArray(value) ? value : [value]);
            Array.prototype.forEach.call(options, option => {
              option.selected = values.has(option.value);
            });
            storage.setValue(id, {
              value: getValue(event, true)
            });
          },

          multipleSelection(event) {
            selectElement.multiple = true;
          },

          remove(event) {
            const options = selectElement.options;
            const index = event.detail.remove;
            options[index].selected = false;
            selectElement.remove(index);

            if (options.length > 0) {
              const i = Array.prototype.findIndex.call(options, option => option.selected);

              if (i === -1) {
                options[0].selected = true;
              }
            }

            storage.setValue(id, {
              value: getValue(event, true),
              items: getItems(event)
            });
          },

          clear(event) {
            while (selectElement.length !== 0) {
              selectElement.remove(0);
            }

            storage.setValue(id, {
              value: null,
              items: []
            });
          },

          insert(event) {
            const {
              index,
              displayValue,
              exportValue
            } = event.detail.insert;
            const optionElement = document.createElement("option");
            optionElement.textContent = displayValue;
            optionElement.value = exportValue;
            selectElement.insertBefore(optionElement, selectElement.children[index]);
            storage.setValue(id, {
              value: getValue(event, true),
              items: getItems(event)
            });
          },

          items(event) {
            const {
              items
            } = event.detail;

            while (selectElement.length !== 0) {
              selectElement.remove(0);
            }

            for (const item of items) {
              const {
                displayValue,
                exportValue
              } = item;
              const optionElement = document.createElement("option");
              optionElement.textContent = displayValue;
              optionElement.value = exportValue;
              selectElement.appendChild(optionElement);
            }

            if (selectElement.options.length > 0) {
              selectElement.options[0].selected = true;
            }

            storage.setValue(id, {
              value: getValue(event, true),
              items: getItems(event)
            });
          },

          indices(event) {
            const indices = new Set(event.detail.indices);
            const options = event.target.options;
            Array.prototype.forEach.call(options, (option, i) => {
              option.selected = indices.has(i);
            });
            storage.setValue(id, {
              value: getValue(event, true)
            });
          },

          editable(event) {
            event.target.disabled = !event.detail.editable;
          }

        };

        this._dispatchEventFromSandbox(actions, jsEvent);
      });
      selectElement.addEventListener("input", event => {
        const exportValue = getValue(event, true);
        const value = getValue(event, false);
        storage.setValue(id, {
          value: exportValue
        });
        this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
          source: this,
          detail: {
            id,
            name: "Keystroke",
            value,
            changeEx: exportValue,
            willCommit: true,
            commitKey: 1,
            keyDown: false
          }
        });
      });

      this._setEventListeners(selectElement, [["focus", "Focus"], ["blur", "Blur"], ["mousedown", "Mouse Down"], ["mouseenter", "Mouse Enter"], ["mouseleave", "Mouse Exit"], ["mouseup", "Mouse Up"], ["input", "Action"]], event => event.target.checked);
    } else {
      selectElement.addEventListener("input", function (event) {
        storage.setValue(id, {
          value: getValue(event)
        });
      });
    }

    this.container.appendChild(selectElement);
    return this.container;
  }

}

class PopupAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.title || parameters.data.contents);
    super(parameters, {
      isRenderable
    });
  }

  render() {
    const IGNORE_TYPES = ["Line", "Square", "Circle", "PolyLine", "Polygon", "Ink"];
    this.container.className = "popupAnnotation";

    if (IGNORE_TYPES.includes(this.data.parentType)) {
      return this.container;
    }

    const selector = `[data-annotation-id="${this.data.parentId}"]`;
    const parentElements = this.layer.querySelectorAll(selector);

    if (parentElements.length === 0) {
      return this.container;
    }

    const popup = new PopupElement({
      container: this.container,
      trigger: Array.from(parentElements),
      color: this.data.color,
      title: this.data.title,
      modificationDate: this.data.modificationDate,
      contents: this.data.contents
    });
    const page = this.page;

    const rect = _util.Util.normalizeRect([this.data.parentRect[0], page.view[3] - this.data.parentRect[1] + page.view[1], this.data.parentRect[2], page.view[3] - this.data.parentRect[3] + page.view[1]]);

    const popupLeft = rect[0] + this.data.parentRect[2] - this.data.parentRect[0];
    const popupTop = rect[1];
    this.container.style.transformOrigin = `${-popupLeft}px ${-popupTop}px`;
    this.container.style.left = `${popupLeft}px`;
    this.container.style.top = `${popupTop}px`;
    this.container.appendChild(popup.render());
    return this.container;
  }

}

class PopupElement {
  constructor(parameters) {
    this.container = parameters.container;
    this.trigger = parameters.trigger;
    this.color = parameters.color;
    this.title = parameters.title;
    this.modificationDate = parameters.modificationDate;
    this.contents = parameters.contents;
    this.hideWrapper = parameters.hideWrapper || false;
    this.pinned = false;
  }

  render() {
    const BACKGROUND_ENLIGHT = 0.7;
    const wrapper = document.createElement("div");
    wrapper.className = "popupWrapper";
    this.hideElement = this.hideWrapper ? wrapper : this.container;
    this.hideElement.hidden = true;
    const popup = document.createElement("div");
    popup.className = "popup";
    const color = this.color;

    if (color) {
      const r = BACKGROUND_ENLIGHT * (255 - color[0]) + color[0];
      const g = BACKGROUND_ENLIGHT * (255 - color[1]) + color[1];
      const b = BACKGROUND_ENLIGHT * (255 - color[2]) + color[2];
      popup.style.backgroundColor = _util.Util.makeHexColor(r | 0, g | 0, b | 0);
    }

    const title = document.createElement("h1");
    title.textContent = this.title;
    popup.appendChild(title);

    const dateObject = _display_utils.PDFDateString.toDateObject(this.modificationDate);

    if (dateObject) {
      const modificationDate = document.createElement("span");
      modificationDate.textContent = "{{date}}, {{time}}";
      modificationDate.dataset.l10nId = "annotation_date_string";
      modificationDate.dataset.l10nArgs = JSON.stringify({
        date: dateObject.toLocaleDateString(),
        time: dateObject.toLocaleTimeString()
      });
      popup.appendChild(modificationDate);
    }

    const contents = this._formatContents(this.contents);

    popup.appendChild(contents);

    if (!Array.isArray(this.trigger)) {
      this.trigger = [this.trigger];
    }

    for (const element of this.trigger) {
      element.addEventListener("click", this._toggle.bind(this));
      element.addEventListener("mouseover", this._show.bind(this, false));
      element.addEventListener("mouseout", this._hide.bind(this, false));
    }

    popup.addEventListener("click", this._hide.bind(this, true));
    wrapper.appendChild(popup);
    return wrapper;
  }

  _formatContents(contents) {
    const p = document.createElement("p");
    const lines = contents.split(/(?:\r\n?|\n)/);

    for (let i = 0, ii = lines.length; i < ii; ++i) {
      const line = lines[i];
      p.appendChild(document.createTextNode(line));

      if (i < ii - 1) {
        p.appendChild(document.createElement("br"));
      }
    }

    return p;
  }

  _toggle() {
    if (this.pinned) {
      this._hide(true);
    } else {
      this._show(true);
    }
  }

  _show(pin = false) {
    if (pin) {
      this.pinned = true;
    }

    if (this.hideElement.hidden) {
      this.hideElement.hidden = false;
      this.container.style.zIndex += 1;
    }
  }

  _hide(unpin = true) {
    if (unpin) {
      this.pinned = false;
    }

    if (!this.hideElement.hidden && !this.pinned) {
      this.hideElement.hidden = true;
      this.container.style.zIndex -= 1;
    }
  }

}

class FreeTextAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, {
      isRenderable,
      ignoreBorder: true
    });
  }

  render() {
    this.container.className = "freeTextAnnotation";

    if (!this.data.hasPopup) {
      this._createPopup(null, this.data);
    }

    return this.container;
  }

}

class LineAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, {
      isRenderable,
      ignoreBorder: true
    });
  }

  render() {
    this.container.className = "lineAnnotation";
    const data = this.data;
    const width = data.rect[2] - data.rect[0];
    const height = data.rect[3] - data.rect[1];
    const svg = this.svgFactory.create(width, height);
    const line = this.svgFactory.createElement("svg:line");
    line.setAttribute("x1", data.rect[2] - data.lineCoordinates[0]);
    line.setAttribute("y1", data.rect[3] - data.lineCoordinates[1]);
    line.setAttribute("x2", data.rect[2] - data.lineCoordinates[2]);
    line.setAttribute("y2", data.rect[3] - data.lineCoordinates[3]);
    line.setAttribute("stroke-width", data.borderStyle.width || 1);
    line.setAttribute("stroke", "transparent");
    svg.appendChild(line);
    this.container.append(svg);

    this._createPopup(line, data);

    return this.container;
  }

}

class SquareAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, {
      isRenderable,
      ignoreBorder: true
    });
  }

  render() {
    this.container.className = "squareAnnotation";
    const data = this.data;
    const width = data.rect[2] - data.rect[0];
    const height = data.rect[3] - data.rect[1];
    const svg = this.svgFactory.create(width, height);
    const borderWidth = data.borderStyle.width;
    const square = this.svgFactory.createElement("svg:rect");
    square.setAttribute("x", borderWidth / 2);
    square.setAttribute("y", borderWidth / 2);
    square.setAttribute("width", width - borderWidth);
    square.setAttribute("height", height - borderWidth);
    square.setAttribute("stroke-width", borderWidth || 1);
    square.setAttribute("stroke", "transparent");
    square.setAttribute("fill", "none");
    svg.appendChild(square);
    this.container.append(svg);

    this._createPopup(square, data);

    return this.container;
  }

}

class CircleAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, {
      isRenderable,
      ignoreBorder: true
    });
  }

  render() {
    this.container.className = "circleAnnotation";
    const data = this.data;
    const width = data.rect[2] - data.rect[0];
    const height = data.rect[3] - data.rect[1];
    const svg = this.svgFactory.create(width, height);
    const borderWidth = data.borderStyle.width;
    const circle = this.svgFactory.createElement("svg:ellipse");
    circle.setAttribute("cx", width / 2);
    circle.setAttribute("cy", height / 2);
    circle.setAttribute("rx", width / 2 - borderWidth / 2);
    circle.setAttribute("ry", height / 2 - borderWidth / 2);
    circle.setAttribute("stroke-width", borderWidth || 1);
    circle.setAttribute("stroke", "transparent");
    circle.setAttribute("fill", "none");
    svg.appendChild(circle);
    this.container.append(svg);

    this._createPopup(circle, data);

    return this.container;
  }

}

class PolylineAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, {
      isRenderable,
      ignoreBorder: true
    });
    this.containerClassName = "polylineAnnotation";
    this.svgElementName = "svg:polyline";
  }

  render() {
    this.container.className = this.containerClassName;
    const data = this.data;
    const width = data.rect[2] - data.rect[0];
    const height = data.rect[3] - data.rect[1];
    const svg = this.svgFactory.create(width, height);
    let points = [];

    for (const coordinate of data.vertices) {
      const x = coordinate.x - data.rect[0];
      const y = data.rect[3] - coordinate.y;
      points.push(x + "," + y);
    }

    points = points.join(" ");
    const polyline = this.svgFactory.createElement(this.svgElementName);
    polyline.setAttribute("points", points);
    polyline.setAttribute("stroke-width", data.borderStyle.width || 1);
    polyline.setAttribute("stroke", "transparent");
    polyline.setAttribute("fill", "none");
    svg.appendChild(polyline);
    this.container.append(svg);

    this._createPopup(polyline, data);

    return this.container;
  }

}

class PolygonAnnotationElement extends PolylineAnnotationElement {
  constructor(parameters) {
    super(parameters);
    this.containerClassName = "polygonAnnotation";
    this.svgElementName = "svg:polygon";
  }

}

class CaretAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, {
      isRenderable,
      ignoreBorder: true
    });
  }

  render() {
    this.container.className = "caretAnnotation";

    if (!this.data.hasPopup) {
      this._createPopup(null, this.data);
    }

    return this.container;
  }

}

class InkAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, {
      isRenderable,
      ignoreBorder: true
    });
    this.containerClassName = "inkAnnotation";
    this.svgElementName = "svg:polyline";
  }

  render() {
    this.container.className = this.containerClassName;
    const data = this.data;
    const width = data.rect[2] - data.rect[0];
    const height = data.rect[3] - data.rect[1];
    const svg = this.svgFactory.create(width, height);

    for (const inkList of data.inkLists) {
      let points = [];

      for (const coordinate of inkList) {
        const x = coordinate.x - data.rect[0];
        const y = data.rect[3] - coordinate.y;
        points.push(`${x},${y}`);
      }

      points = points.join(" ");
      const polyline = this.svgFactory.createElement(this.svgElementName);
      polyline.setAttribute("points", points);
      polyline.setAttribute("stroke-width", data.borderStyle.width || 1);
      polyline.setAttribute("stroke", "transparent");
      polyline.setAttribute("fill", "none");

      this._createPopup(polyline, data);

      svg.appendChild(polyline);
    }

    this.container.append(svg);
    return this.container;
  }

}

class HighlightAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, {
      isRenderable,
      ignoreBorder: true,
      createQuadrilaterals: true
    });
  }

  render() {
    if (!this.data.hasPopup) {
      this._createPopup(null, this.data);
    }

    if (this.quadrilaterals) {
      return this._renderQuadrilaterals("highlightAnnotation");
    }

    this.container.className = "highlightAnnotation";
    return this.container;
  }

}

class UnderlineAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, {
      isRenderable,
      ignoreBorder: true,
      createQuadrilaterals: true
    });
  }

  render() {
    if (!this.data.hasPopup) {
      this._createPopup(null, this.data);
    }

    if (this.quadrilaterals) {
      return this._renderQuadrilaterals("underlineAnnotation");
    }

    this.container.className = "underlineAnnotation";
    return this.container;
  }

}

class SquigglyAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, {
      isRenderable,
      ignoreBorder: true,
      createQuadrilaterals: true
    });
  }

  render() {
    if (!this.data.hasPopup) {
      this._createPopup(null, this.data);
    }

    if (this.quadrilaterals) {
      return this._renderQuadrilaterals("squigglyAnnotation");
    }

    this.container.className = "squigglyAnnotation";
    return this.container;
  }

}

class StrikeOutAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, {
      isRenderable,
      ignoreBorder: true,
      createQuadrilaterals: true
    });
  }

  render() {
    if (!this.data.hasPopup) {
      this._createPopup(null, this.data);
    }

    if (this.quadrilaterals) {
      return this._renderQuadrilaterals("strikeoutAnnotation");
    }

    this.container.className = "strikeoutAnnotation";
    return this.container;
  }

}

class StampAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, {
      isRenderable,
      ignoreBorder: true
    });
  }

  render() {
    this.container.className = "stampAnnotation";

    if (!this.data.hasPopup) {
      this._createPopup(null, this.data);
    }

    return this.container;
  }

}

class FileAttachmentAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    super(parameters, {
      isRenderable: true
    });
    const {
      filename,
      content
    } = this.data.file;
    this.filename = (0, _display_utils.getFilenameFromUrl)(filename);
    this.content = content;
    this.linkService.eventBus?.dispatch("fileattachmentannotation", {
      source: this,
      id: (0, _util.stringToPDFString)(filename),
      filename,
      content
    });
  }

  render() {
    this.container.className = "fileAttachmentAnnotation";
    const trigger = document.createElement("div");
    trigger.style.height = this.container.style.height;
    trigger.style.width = this.container.style.width;
    trigger.addEventListener("dblclick", this._download.bind(this));

    if (!this.data.hasPopup && (this.data.title || this.data.contents)) {
      this._createPopup(trigger, this.data);
    }

    this.container.appendChild(trigger);
    return this.container;
  }

  _download() {
    this.downloadManager?.openOrDownloadData(this.container, this.content, this.filename);
  }

}

class AnnotationLayer {
  static render(parameters) {
    const sortedAnnotations = [],
          popupAnnotations = [];

    for (const data of parameters.annotations) {
      if (!data) {
        continue;
      }

      if (data.annotationType === _util.AnnotationType.POPUP) {
        popupAnnotations.push(data);
        continue;
      }

      sortedAnnotations.push(data);
    }

    if (popupAnnotations.length) {
      sortedAnnotations.push(...popupAnnotations);
    }

    for (const data of sortedAnnotations) {
      const element = AnnotationElementFactory.create({
        data,
        layer: parameters.div,
        page: parameters.page,
        viewport: parameters.viewport,
        linkService: parameters.linkService,
        downloadManager: parameters.downloadManager,
        imageResourcesPath: parameters.imageResourcesPath || "",
        renderInteractiveForms: parameters.renderInteractiveForms !== false,
        svgFactory: new _display_utils.DOMSVGFactory(),
        annotationStorage: parameters.annotationStorage || new _annotation_storage.AnnotationStorage(),
        enableScripting: parameters.enableScripting,
        hasJSActions: parameters.hasJSActions,
        mouseState: parameters.mouseState || {
          isDown: false
        }
      });

      if (element.isRenderable) {
        const rendered = element.render();

        if (data.hidden) {
          rendered.style.visibility = "hidden";
        }

        if (Array.isArray(rendered)) {
          for (const renderedElement of rendered) {
            parameters.div.appendChild(renderedElement);
          }
        } else {
          if (element instanceof PopupAnnotationElement) {
            parameters.div.prepend(rendered);
          } else {
            parameters.div.appendChild(rendered);
          }
        }
      }
    }
  }

  static update(parameters) {
    const transform = `matrix(${parameters.viewport.transform.join(",")})`;

    for (const data of parameters.annotations) {
      const elements = parameters.div.querySelectorAll(`[data-annotation-id="${data.id}"]`);

      if (elements) {
        for (const element of elements) {
          element.style.transform = transform;
        }
      }
    }

    parameters.div.hidden = false;
  }

}

exports.AnnotationLayer = AnnotationLayer;

/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ColorConverters = void 0;

function makeColorComp(n) {
  return Math.floor(Math.max(0, Math.min(1, n)) * 255).toString(16).padStart(2, "0");
}

class ColorConverters {
  static CMYK_G([c, y, m, k]) {
    return ["G", 1 - Math.min(1, 0.3 * c + 0.59 * m + 0.11 * y + k)];
  }

  static G_CMYK([g]) {
    return ["CMYK", 0, 0, 0, 1 - g];
  }

  static G_RGB([g]) {
    return ["RGB", g, g, g];
  }

  static G_HTML([g]) {
    const G = makeColorComp(g);
    return `#${G}${G}${G}`;
  }

  static RGB_G([r, g, b]) {
    return ["G", 0.3 * r + 0.59 * g + 0.11 * b];
  }

  static RGB_HTML([r, g, b]) {
    const R = makeColorComp(r);
    const G = makeColorComp(g);
    const B = makeColorComp(b);
    return `#${R}${G}${B}`;
  }

  static T_HTML() {
    return "#00000000";
  }

  static CMYK_RGB([c, y, m, k]) {
    return ["RGB", 1 - Math.min(1, c + k), 1 - Math.min(1, m + k), 1 - Math.min(1, y + k)];
  }

  static CMYK_HTML(components) {
    return this.RGB_HTML(this.CMYK_RGB(components));
  }

  static RGB_CMYK([r, g, b]) {
    const c = 1 - r;
    const m = 1 - g;
    const y = 1 - b;
    const k = Math.min(c, m, y);
    return ["CMYK", c, m, y, k];
  }

}

exports.ColorConverters = ColorConverters;

/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.renderTextLayer = renderTextLayer;

var _util = __w_pdfjs_require__(2);

const MAX_TEXT_DIVS_TO_RENDER = 100000;
const DEFAULT_FONT_SIZE = 30;
const DEFAULT_FONT_ASCENT = 0.8;
const ascentCache = new Map();
const AllWhitespaceRegexp = /^\s+$/g;

function getAscent(fontFamily, ctx) {
  const cachedAscent = ascentCache.get(fontFamily);

  if (cachedAscent) {
    return cachedAscent;
  }

  ctx.save();
  ctx.font = `${DEFAULT_FONT_SIZE}px ${fontFamily}`;
  const metrics = ctx.measureText("");
  let ascent = metrics.fontBoundingBoxAscent;
  let descent = Math.abs(metrics.fontBoundingBoxDescent);

  if (ascent) {
    ctx.restore();
    const ratio = ascent / (ascent + descent);
    ascentCache.set(fontFamily, ratio);
    return ratio;
  }

  ctx.strokeStyle = "red";
  ctx.clearRect(0, 0, DEFAULT_FONT_SIZE, DEFAULT_FONT_SIZE);
  ctx.strokeText("g", 0, 0);
  let pixels = ctx.getImageData(0, 0, DEFAULT_FONT_SIZE, DEFAULT_FONT_SIZE).data;
  descent = 0;

  for (let i = pixels.length - 1 - 3; i >= 0; i -= 4) {
    if (pixels[i] > 0) {
      descent = Math.ceil(i / 4 / DEFAULT_FONT_SIZE);
      break;
    }
  }

  ctx.clearRect(0, 0, DEFAULT_FONT_SIZE, DEFAULT_FONT_SIZE);
  ctx.strokeText("A", 0, DEFAULT_FONT_SIZE);
  pixels = ctx.getImageData(0, 0, DEFAULT_FONT_SIZE, DEFAULT_FONT_SIZE).data;
  ascent = 0;

  for (let i = 0, ii = pixels.length; i < ii; i += 4) {
    if (pixels[i] > 0) {
      ascent = DEFAULT_FONT_SIZE - Math.floor(i / 4 / DEFAULT_FONT_SIZE);
      break;
    }
  }

  ctx.restore();

  if (ascent) {
    const ratio = ascent / (ascent + descent);
    ascentCache.set(fontFamily, ratio);
    return ratio;
  }

  ascentCache.set(fontFamily, DEFAULT_FONT_ASCENT);
  return DEFAULT_FONT_ASCENT;
}

function appendText(task, geom, styles, ctx) {
  const textDiv = document.createElement("span");
  const textDivProperties = {
    angle: 0,
    canvasWidth: 0,
    hasText: geom.str !== "",
    hasEOL: geom.hasEOL,
    originalTransform: null,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    scale: 1
  };

  task._textDivs.push(textDiv);

  const tx = _util.Util.transform(task._viewport.transform, geom.transform);

  let angle = Math.atan2(tx[1], tx[0]);
  const style = styles[geom.fontName];

  if (style.vertical) {
    angle += Math.PI / 2;
  }

  const fontHeight = Math.hypot(tx[2], tx[3]);
  const fontAscent = fontHeight * getAscent(style.fontFamily, ctx);
  let left, top;

  if (angle === 0) {
    left = tx[4];
    top = tx[5] - fontAscent;
  } else {
    left = tx[4] + fontAscent * Math.sin(angle);
    top = tx[5] - fontAscent * Math.cos(angle);
  }

  textDiv.style.left = `${left}px`;
  textDiv.style.top = `${top}px`;
  textDiv.style.fontSize = `${fontHeight}px`;
  textDiv.style.fontFamily = style.fontFamily;
  textDiv.setAttribute("role", "presentation");
  textDiv.textContent = geom.str;
  textDiv.dir = geom.dir;

  if (task._fontInspectorEnabled) {
    textDiv.dataset.fontName = geom.fontName;
  }

  if (angle !== 0) {
    textDivProperties.angle = angle * (180 / Math.PI);
  }

  let shouldScaleText = false;

  if (geom.str.length > 1 || task._enhanceTextSelection && AllWhitespaceRegexp.test(geom.str)) {
    shouldScaleText = true;
  } else if (geom.transform[0] !== geom.transform[3]) {
    const absScaleX = Math.abs(geom.transform[0]),
          absScaleY = Math.abs(geom.transform[3]);

    if (absScaleX !== absScaleY && Math.max(absScaleX, absScaleY) / Math.min(absScaleX, absScaleY) > 1.5) {
      shouldScaleText = true;
    }
  }

  if (shouldScaleText) {
    if (style.vertical) {
      textDivProperties.canvasWidth = geom.height * task._viewport.scale;
    } else {
      textDivProperties.canvasWidth = geom.width * task._viewport.scale;
    }
  }

  task._textDivProperties.set(textDiv, textDivProperties);

  if (task._textContentStream) {
    task._layoutText(textDiv);
  }

  if (task._enhanceTextSelection && textDivProperties.hasText) {
    let angleCos = 1,
        angleSin = 0;

    if (angle !== 0) {
      angleCos = Math.cos(angle);
      angleSin = Math.sin(angle);
    }

    const divWidth = (style.vertical ? geom.height : geom.width) * task._viewport.scale;
    const divHeight = fontHeight;
    let m, b;

    if (angle !== 0) {
      m = [angleCos, angleSin, -angleSin, angleCos, left, top];
      b = _util.Util.getAxialAlignedBoundingBox([0, 0, divWidth, divHeight], m);
    } else {
      b = [left, top, left + divWidth, top + divHeight];
    }

    task._bounds.push({
      left: b[0],
      top: b[1],
      right: b[2],
      bottom: b[3],
      div: textDiv,
      size: [divWidth, divHeight],
      m
    });
  }
}

function render(task) {
  if (task._canceled) {
    return;
  }

  const textDivs = task._textDivs;
  const capability = task._capability;
  const textDivsLength = textDivs.length;

  if (textDivsLength > MAX_TEXT_DIVS_TO_RENDER) {
    task._renderingDone = true;
    capability.resolve();
    return;
  }

  if (!task._textContentStream) {
    for (let i = 0; i < textDivsLength; i++) {
      task._layoutText(textDivs[i]);
    }
  }

  task._renderingDone = true;
  capability.resolve();
}

function findPositiveMin(ts, offset, count) {
  let result = 0;

  for (let i = 0; i < count; i++) {
    const t = ts[offset++];

    if (t > 0) {
      result = result ? Math.min(t, result) : t;
    }
  }

  return result;
}

function expand(task) {
  const bounds = task._bounds;
  const viewport = task._viewport;
  const expanded = expandBounds(viewport.width, viewport.height, bounds);

  for (let i = 0; i < expanded.length; i++) {
    const div = bounds[i].div;

    const divProperties = task._textDivProperties.get(div);

    if (divProperties.angle === 0) {
      divProperties.paddingLeft = bounds[i].left - expanded[i].left;
      divProperties.paddingTop = bounds[i].top - expanded[i].top;
      divProperties.paddingRight = expanded[i].right - bounds[i].right;
      divProperties.paddingBottom = expanded[i].bottom - bounds[i].bottom;

      task._textDivProperties.set(div, divProperties);

      continue;
    }

    const e = expanded[i],
          b = bounds[i];
    const m = b.m,
          c = m[0],
          s = m[1];
    const points = [[0, 0], [0, b.size[1]], [b.size[0], 0], b.size];
    const ts = new Float64Array(64);

    for (let j = 0, jj = points.length; j < jj; j++) {
      const t = _util.Util.applyTransform(points[j], m);

      ts[j + 0] = c && (e.left - t[0]) / c;
      ts[j + 4] = s && (e.top - t[1]) / s;
      ts[j + 8] = c && (e.right - t[0]) / c;
      ts[j + 12] = s && (e.bottom - t[1]) / s;
      ts[j + 16] = s && (e.left - t[0]) / -s;
      ts[j + 20] = c && (e.top - t[1]) / c;
      ts[j + 24] = s && (e.right - t[0]) / -s;
      ts[j + 28] = c && (e.bottom - t[1]) / c;
      ts[j + 32] = c && (e.left - t[0]) / -c;
      ts[j + 36] = s && (e.top - t[1]) / -s;
      ts[j + 40] = c && (e.right - t[0]) / -c;
      ts[j + 44] = s && (e.bottom - t[1]) / -s;
      ts[j + 48] = s && (e.left - t[0]) / s;
      ts[j + 52] = c && (e.top - t[1]) / -c;
      ts[j + 56] = s && (e.right - t[0]) / s;
      ts[j + 60] = c && (e.bottom - t[1]) / -c;
    }

    const boxScale = 1 + Math.min(Math.abs(c), Math.abs(s));
    divProperties.paddingLeft = findPositiveMin(ts, 32, 16) / boxScale;
    divProperties.paddingTop = findPositiveMin(ts, 48, 16) / boxScale;
    divProperties.paddingRight = findPositiveMin(ts, 0, 16) / boxScale;
    divProperties.paddingBottom = findPositiveMin(ts, 16, 16) / boxScale;

    task._textDivProperties.set(div, divProperties);
  }
}

function expandBounds(width, height, boxes) {
  const bounds = boxes.map(function (box, i) {
    return {
      x1: box.left,
      y1: box.top,
      x2: box.right,
      y2: box.bottom,
      index: i,
      x1New: undefined,
      x2New: undefined
    };
  });
  expandBoundsLTR(width, bounds);
  const expanded = new Array(boxes.length);

  for (const b of bounds) {
    const i = b.index;
    expanded[i] = {
      left: b.x1New,
      top: 0,
      right: b.x2New,
      bottom: 0
    };
  }

  boxes.map(function (box, i) {
    const e = expanded[i],
          b = bounds[i];
    b.x1 = box.top;
    b.y1 = width - e.right;
    b.x2 = box.bottom;
    b.y2 = width - e.left;
    b.index = i;
    b.x1New = undefined;
    b.x2New = undefined;
  });
  expandBoundsLTR(height, bounds);

  for (const b of bounds) {
    const i = b.index;
    expanded[i].top = b.x1New;
    expanded[i].bottom = b.x2New;
  }

  return expanded;
}

function expandBoundsLTR(width, bounds) {
  bounds.sort(function (a, b) {
    return a.x1 - b.x1 || a.index - b.index;
  });
  const fakeBoundary = {
    x1: -Infinity,
    y1: -Infinity,
    x2: 0,
    y2: Infinity,
    index: -1,
    x1New: 0,
    x2New: 0
  };
  const horizon = [{
    start: -Infinity,
    end: Infinity,
    boundary: fakeBoundary
  }];

  for (const boundary of bounds) {
    let i = 0;

    while (i < horizon.length && horizon[i].end <= boundary.y1) {
      i++;
    }

    let j = horizon.length - 1;

    while (j >= 0 && horizon[j].start >= boundary.y2) {
      j--;
    }

    let horizonPart, affectedBoundary;
    let q,
        k,
        maxXNew = -Infinity;

    for (q = i; q <= j; q++) {
      horizonPart = horizon[q];
      affectedBoundary = horizonPart.boundary;
      let xNew;

      if (affectedBoundary.x2 > boundary.x1) {
        xNew = affectedBoundary.index > boundary.index ? affectedBoundary.x1New : boundary.x1;
      } else if (affectedBoundary.x2New === undefined) {
        xNew = (affectedBoundary.x2 + boundary.x1) / 2;
      } else {
        xNew = affectedBoundary.x2New;
      }

      if (xNew > maxXNew) {
        maxXNew = xNew;
      }
    }

    boundary.x1New = maxXNew;

    for (q = i; q <= j; q++) {
      horizonPart = horizon[q];
      affectedBoundary = horizonPart.boundary;

      if (affectedBoundary.x2New === undefined) {
        if (affectedBoundary.x2 > boundary.x1) {
          if (affectedBoundary.index > boundary.index) {
            affectedBoundary.x2New = affectedBoundary.x2;
          }
        } else {
          affectedBoundary.x2New = maxXNew;
        }
      } else if (affectedBoundary.x2New > maxXNew) {
        affectedBoundary.x2New = Math.max(maxXNew, affectedBoundary.x2);
      }
    }

    const changedHorizon = [];
    let lastBoundary = null;

    for (q = i; q <= j; q++) {
      horizonPart = horizon[q];
      affectedBoundary = horizonPart.boundary;
      const useBoundary = affectedBoundary.x2 > boundary.x2 ? affectedBoundary : boundary;

      if (lastBoundary === useBoundary) {
        changedHorizon[changedHorizon.length - 1].end = horizonPart.end;
      } else {
        changedHorizon.push({
          start: horizonPart.start,
          end: horizonPart.end,
          boundary: useBoundary
        });
        lastBoundary = useBoundary;
      }
    }

    if (horizon[i].start < boundary.y1) {
      changedHorizon[0].start = boundary.y1;
      changedHorizon.unshift({
        start: horizon[i].start,
        end: boundary.y1,
        boundary: horizon[i].boundary
      });
    }

    if (boundary.y2 < horizon[j].end) {
      changedHorizon[changedHorizon.length - 1].end = boundary.y2;
      changedHorizon.push({
        start: boundary.y2,
        end: horizon[j].end,
        boundary: horizon[j].boundary
      });
    }

    for (q = i; q <= j; q++) {
      horizonPart = horizon[q];
      affectedBoundary = horizonPart.boundary;

      if (affectedBoundary.x2New !== undefined) {
        continue;
      }

      let used = false;

      for (k = i - 1; !used && k >= 0 && horizon[k].start >= affectedBoundary.y1; k--) {
        used = horizon[k].boundary === affectedBoundary;
      }

      for (k = j + 1; !used && k < horizon.length && horizon[k].end <= affectedBoundary.y2; k++) {
        used = horizon[k].boundary === affectedBoundary;
      }

      for (k = 0; !used && k < changedHorizon.length; k++) {
        used = changedHorizon[k].boundary === affectedBoundary;
      }

      if (!used) {
        affectedBoundary.x2New = maxXNew;
      }
    }

    Array.prototype.splice.apply(horizon, [i, j - i + 1].concat(changedHorizon));
  }

  for (const horizonPart of horizon) {
    const affectedBoundary = horizonPart.boundary;

    if (affectedBoundary.x2New === undefined) {
      affectedBoundary.x2New = Math.max(width, affectedBoundary.x2);
    }
  }
}

class TextLayerRenderTask {
  constructor({
    textContent,
    textContentStream,
    container,
    viewport,
    textDivs,
    textContentItemsStr,
    enhanceTextSelection
  }) {
    this._textContent = textContent;
    this._textContentStream = textContentStream;
    this._container = container;
    this._document = container.ownerDocument;
    this._viewport = viewport;
    this._textDivs = textDivs || [];
    this._textContentItemsStr = textContentItemsStr || [];
    this._enhanceTextSelection = !!enhanceTextSelection;
    this._fontInspectorEnabled = !!globalThis.FontInspector?.enabled;
    this._reader = null;
    this._layoutTextLastFontSize = null;
    this._layoutTextLastFontFamily = null;
    this._layoutTextCtx = null;
    this._textDivProperties = new WeakMap();
    this._renderingDone = false;
    this._canceled = false;
    this._capability = (0, _util.createPromiseCapability)();
    this._renderTimer = null;
    this._bounds = [];

    this._capability.promise.finally(() => {
      if (this._layoutTextCtx) {
        this._layoutTextCtx.canvas.width = 0;
        this._layoutTextCtx.canvas.height = 0;
        this._layoutTextCtx = null;
      }
    }).catch(() => {});
  }

  get promise() {
    return this._capability.promise;
  }

  cancel() {
    this._canceled = true;

    if (this._reader) {
      this._reader.cancel(new _util.AbortException("TextLayer task cancelled."));

      this._reader = null;
    }

    if (this._renderTimer !== null) {
      clearTimeout(this._renderTimer);
      this._renderTimer = null;
    }

    this._capability.reject(new Error("TextLayer task cancelled."));
  }

  _processItems(items, styleCache) {
    for (let i = 0, len = items.length; i < len; i++) {
      if (items[i].str === undefined) {
        if (items[i].type === "beginMarkedContentProps" || items[i].type === "beginMarkedContent") {
          const parent = this._container;
          this._container = document.createElement("span");

          this._container.classList.add("markedContent");

          if (items[i].id !== null) {
            this._container.setAttribute("id", `${items[i].id}`);
          }

          parent.appendChild(this._container);
        } else if (items[i].type === "endMarkedContent") {
          this._container = this._container.parentNode;
        }

        continue;
      }

      this._textContentItemsStr.push(items[i].str);

      appendText(this, items[i], styleCache, this._layoutTextCtx);
    }
  }

  _layoutText(textDiv) {
    const textDivProperties = this._textDivProperties.get(textDiv);

    let transform = "";

    if (textDivProperties.canvasWidth !== 0 && textDivProperties.hasText) {
      const {
        fontSize,
        fontFamily
      } = textDiv.style;

      if (fontSize !== this._layoutTextLastFontSize || fontFamily !== this._layoutTextLastFontFamily) {
        this._layoutTextCtx.font = `${fontSize} ${fontFamily}`;
        this._layoutTextLastFontSize = fontSize;
        this._layoutTextLastFontFamily = fontFamily;
      }

      const {
        width
      } = this._layoutTextCtx.measureText(textDiv.textContent);

      if (width > 0) {
        textDivProperties.scale = textDivProperties.canvasWidth / width;
        transform = `scaleX(${textDivProperties.scale})`;
      }
    }

    if (textDivProperties.angle !== 0) {
      transform = `rotate(${textDivProperties.angle}deg) ${transform}`;
    }

    if (transform.length > 0) {
      if (this._enhanceTextSelection) {
        textDivProperties.originalTransform = transform;
      }

      textDiv.style.transform = transform;
    }

    if (textDivProperties.hasText) {
      this._container.appendChild(textDiv);
    }

    if (textDivProperties.hasEOL) {
      const br = document.createElement("br");
      br.setAttribute("role", "presentation");

      this._container.appendChild(br);
    }
  }

  _render(timeout = 0) {
    const capability = (0, _util.createPromiseCapability)();
    let styleCache = Object.create(null);

    const canvas = this._document.createElement("canvas");

    canvas.height = canvas.width = DEFAULT_FONT_SIZE;
    canvas.mozOpaque = true;
    this._layoutTextCtx = canvas.getContext("2d", {
      alpha: false
    });

    if (this._textContent) {
      const textItems = this._textContent.items;
      const textStyles = this._textContent.styles;

      this._processItems(textItems, textStyles);

      capability.resolve();
    } else if (this._textContentStream) {
      const pump = () => {
        this._reader.read().then(({
          value,
          done
        }) => {
          if (done) {
            capability.resolve();
            return;
          }

          Object.assign(styleCache, value.styles);

          this._processItems(value.items, styleCache);

          pump();
        }, capability.reject);
      };

      this._reader = this._textContentStream.getReader();
      pump();
    } else {
      throw new Error('Neither "textContent" nor "textContentStream"' + " parameters specified.");
    }

    capability.promise.then(() => {
      styleCache = null;

      if (!timeout) {
        render(this);
      } else {
        this._renderTimer = setTimeout(() => {
          render(this);
          this._renderTimer = null;
        }, timeout);
      }
    }, this._capability.reject);
  }

  expandTextDivs(expandDivs = false) {
    if (!this._enhanceTextSelection || !this._renderingDone) {
      return;
    }

    if (this._bounds !== null) {
      expand(this);
      this._bounds = null;
    }

    const transformBuf = [],
          paddingBuf = [];

    for (let i = 0, ii = this._textDivs.length; i < ii; i++) {
      const div = this._textDivs[i];

      const divProps = this._textDivProperties.get(div);

      if (!divProps.hasText) {
        continue;
      }

      if (expandDivs) {
        transformBuf.length = 0;
        paddingBuf.length = 0;

        if (divProps.originalTransform) {
          transformBuf.push(divProps.originalTransform);
        }

        if (divProps.paddingTop > 0) {
          paddingBuf.push(`${divProps.paddingTop}px`);
          transformBuf.push(`translateY(${-divProps.paddingTop}px)`);
        } else {
          paddingBuf.push(0);
        }

        if (divProps.paddingRight > 0) {
          paddingBuf.push(`${divProps.paddingRight / divProps.scale}px`);
        } else {
          paddingBuf.push(0);
        }

        if (divProps.paddingBottom > 0) {
          paddingBuf.push(`${divProps.paddingBottom}px`);
        } else {
          paddingBuf.push(0);
        }

        if (divProps.paddingLeft > 0) {
          paddingBuf.push(`${divProps.paddingLeft / divProps.scale}px`);
          transformBuf.push(`translateX(${-divProps.paddingLeft / divProps.scale}px)`);
        } else {
          paddingBuf.push(0);
        }

        div.style.padding = paddingBuf.join(" ");

        if (transformBuf.length) {
          div.style.transform = transformBuf.join(" ");
        }
      } else {
        div.style.padding = null;
        div.style.transform = divProps.originalTransform;
      }
    }
  }

}

function renderTextLayer(renderParameters) {
  const task = new TextLayerRenderTask({
    textContent: renderParameters.textContent,
    textContentStream: renderParameters.textContentStream,
    container: renderParameters.container,
    viewport: renderParameters.viewport,
    textDivs: renderParameters.textDivs,
    textContentItemsStr: renderParameters.textContentItemsStr,
    enhanceTextSelection: renderParameters.enhanceTextSelection
  });

  task._render(renderParameters.timeout);

  return task;
}

/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.SVGGraphics = void 0;

var _util = __w_pdfjs_require__(2);

var _display_utils = __w_pdfjs_require__(1);

var _is_node = __w_pdfjs_require__(4);

let SVGGraphics = class {
  constructor() {
    (0, _util.unreachable)("Not implemented: SVGGraphics");
  }

};
exports.SVGGraphics = SVGGraphics;
;

/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.XfaLayer = void 0;

class XfaLayer {
  static setupStorage(html, id, element, storage, intent) {
    const storedData = storage.getValue(id, {
      value: null
    });

    switch (element.name) {
      case "textarea":
        if (storedData.value !== null) {
          html.textContent = storedData.value;
        }

        if (intent === "print") {
          break;
        }

        html.addEventListener("input", event => {
          storage.setValue(id, {
            value: event.target.value
          });
        });
        break;

      case "input":
        if (element.attributes.type === "radio" || element.attributes.type === "checkbox") {
          if (storedData.value === element.attributes.xfaOn) {
            html.setAttribute("checked", true);
          }

          if (intent === "print") {
            break;
          }

          html.addEventListener("change", event => {
            storage.setValue(id, {
              value: event.target.getAttribute("xfaOn")
            });
          });
        } else {
          if (storedData.value !== null) {
            html.setAttribute("value", storedData.value);
          }

          if (intent === "print") {
            break;
          }

          html.addEventListener("input", event => {
            storage.setValue(id, {
              value: event.target.value
            });
          });
        }

        break;

      case "select":
        if (storedData.value !== null) {
          for (const option of element.children) {
            if (option.attributes.value === storedData.value) {
              option.attributes.selected = true;
            }
          }
        }

        html.addEventListener("input", event => {
          const options = event.target.options;
          const value = options.selectedIndex === -1 ? "" : options[options.selectedIndex].value;
          storage.setValue(id, {
            value
          });
        });
        break;
    }
  }

  static setAttributes(html, element, storage, intent) {
    const {
      attributes
    } = element;

    if (attributes.type === "radio") {
      attributes.name = `${attributes.name}-${intent}`;
    }

    for (const [key, value] of Object.entries(attributes)) {
      if (value === null || value === undefined || key === "dataId") {
        continue;
      }

      if (key !== "style") {
        if (key === "textContent") {
          html.textContent = value;
        } else if (key === "class") {
          html.setAttribute(key, value.join(" "));
        } else {
          html.setAttribute(key, value);
        }
      } else {
        Object.assign(html.style, value);
      }
    }

    if (storage && attributes.dataId) {
      this.setupStorage(html, attributes.dataId, element, storage);
    }
  }

  static render(parameters) {
    const storage = parameters.annotationStorage;
    const root = parameters.xfa;
    const intent = parameters.intent || "display";
    const rootHtml = document.createElement(root.name);

    if (root.attributes) {
      this.setAttributes(rootHtml, root);
    }

    const stack = [[root, -1, rootHtml]];
    const rootDiv = parameters.div;
    rootDiv.appendChild(rootHtml);
    const transform = `matrix(${parameters.viewport.transform.join(",")})`;
    rootDiv.style.transform = transform;
    rootDiv.setAttribute("class", "xfaLayer xfaFont");

    while (stack.length > 0) {
      const [parent, i, html] = stack[stack.length - 1];

      if (i + 1 === parent.children.length) {
        stack.pop();
        continue;
      }

      const child = parent.children[++stack[stack.length - 1][1]];

      if (child === null) {
        continue;
      }

      const {
        name
      } = child;

      if (name === "#text") {
        html.appendChild(document.createTextNode(child.value));
        continue;
      }

      let childHtml;

      if (child?.attributes?.xmlns) {
        childHtml = document.createElementNS(child.attributes.xmlns, name);
      } else {
        childHtml = document.createElement(name);
      }

      html.appendChild(childHtml);

      if (child.attributes) {
        this.setAttributes(childHtml, child, storage, intent);
      }

      if (child.children && child.children.length > 0) {
        stack.push([child, -1, childHtml]);
      } else if (child.value) {
        childHtml.appendChild(document.createTextNode(child.value));
      }
    }

    for (const el of rootDiv.querySelectorAll(".xfaNonInteractive input, .xfaNonInteractive textarea")) {
      el.setAttribute("readOnly", true);
    }
  }

  static update(parameters) {
    const transform = `matrix(${parameters.viewport.transform.join(",")})`;
    parameters.div.style.transform = transform;
    parameters.div.hidden = false;
  }

}

exports.XfaLayer = XfaLayer;

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __w_pdfjs_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __w_pdfjs_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "addLinkAttributes", ({
  enumerable: true,
  get: function () {
    return _display_utils.addLinkAttributes;
  }
}));
Object.defineProperty(exports, "getFilenameFromUrl", ({
  enumerable: true,
  get: function () {
    return _display_utils.getFilenameFromUrl;
  }
}));
Object.defineProperty(exports, "getPdfFilenameFromUrl", ({
  enumerable: true,
  get: function () {
    return _display_utils.getPdfFilenameFromUrl;
  }
}));
Object.defineProperty(exports, "getXfaPageViewport", ({
  enumerable: true,
  get: function () {
    return _display_utils.getXfaPageViewport;
  }
}));
Object.defineProperty(exports, "isPdfFile", ({
  enumerable: true,
  get: function () {
    return _display_utils.isPdfFile;
  }
}));
Object.defineProperty(exports, "LinkTarget", ({
  enumerable: true,
  get: function () {
    return _display_utils.LinkTarget;
  }
}));
Object.defineProperty(exports, "loadScript", ({
  enumerable: true,
  get: function () {
    return _display_utils.loadScript;
  }
}));
Object.defineProperty(exports, "PDFDateString", ({
  enumerable: true,
  get: function () {
    return _display_utils.PDFDateString;
  }
}));
Object.defineProperty(exports, "RenderingCancelledException", ({
  enumerable: true,
  get: function () {
    return _display_utils.RenderingCancelledException;
  }
}));
Object.defineProperty(exports, "build", ({
  enumerable: true,
  get: function () {
    return _api.build;
  }
}));
Object.defineProperty(exports, "getDocument", ({
  enumerable: true,
  get: function () {
    return _api.getDocument;
  }
}));
Object.defineProperty(exports, "LoopbackPort", ({
  enumerable: true,
  get: function () {
    return _api.LoopbackPort;
  }
}));
Object.defineProperty(exports, "PDFDataRangeTransport", ({
  enumerable: true,
  get: function () {
    return _api.PDFDataRangeTransport;
  }
}));
Object.defineProperty(exports, "PDFWorker", ({
  enumerable: true,
  get: function () {
    return _api.PDFWorker;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _api.version;
  }
}));
Object.defineProperty(exports, "CMapCompressionType", ({
  enumerable: true,
  get: function () {
    return _util.CMapCompressionType;
  }
}));
Object.defineProperty(exports, "createObjectURL", ({
  enumerable: true,
  get: function () {
    return _util.createObjectURL;
  }
}));
Object.defineProperty(exports, "createPromiseCapability", ({
  enumerable: true,
  get: function () {
    return _util.createPromiseCapability;
  }
}));
Object.defineProperty(exports, "createValidAbsoluteUrl", ({
  enumerable: true,
  get: function () {
    return _util.createValidAbsoluteUrl;
  }
}));
Object.defineProperty(exports, "InvalidPDFException", ({
  enumerable: true,
  get: function () {
    return _util.InvalidPDFException;
  }
}));
Object.defineProperty(exports, "MissingPDFException", ({
  enumerable: true,
  get: function () {
    return _util.MissingPDFException;
  }
}));
Object.defineProperty(exports, "OPS", ({
  enumerable: true,
  get: function () {
    return _util.OPS;
  }
}));
Object.defineProperty(exports, "PasswordResponses", ({
  enumerable: true,
  get: function () {
    return _util.PasswordResponses;
  }
}));
Object.defineProperty(exports, "PermissionFlag", ({
  enumerable: true,
  get: function () {
    return _util.PermissionFlag;
  }
}));
Object.defineProperty(exports, "removeNullCharacters", ({
  enumerable: true,
  get: function () {
    return _util.removeNullCharacters;
  }
}));
Object.defineProperty(exports, "shadow", ({
  enumerable: true,
  get: function () {
    return _util.shadow;
  }
}));
Object.defineProperty(exports, "UnexpectedResponseException", ({
  enumerable: true,
  get: function () {
    return _util.UnexpectedResponseException;
  }
}));
Object.defineProperty(exports, "UNSUPPORTED_FEATURES", ({
  enumerable: true,
  get: function () {
    return _util.UNSUPPORTED_FEATURES;
  }
}));
Object.defineProperty(exports, "Util", ({
  enumerable: true,
  get: function () {
    return _util.Util;
  }
}));
Object.defineProperty(exports, "VerbosityLevel", ({
  enumerable: true,
  get: function () {
    return _util.VerbosityLevel;
  }
}));
Object.defineProperty(exports, "AnnotationLayer", ({
  enumerable: true,
  get: function () {
    return _annotation_layer.AnnotationLayer;
  }
}));
Object.defineProperty(exports, "GlobalWorkerOptions", ({
  enumerable: true,
  get: function () {
    return _worker_options.GlobalWorkerOptions;
  }
}));
Object.defineProperty(exports, "renderTextLayer", ({
  enumerable: true,
  get: function () {
    return _text_layer.renderTextLayer;
  }
}));
Object.defineProperty(exports, "SVGGraphics", ({
  enumerable: true,
  get: function () {
    return _svg.SVGGraphics;
  }
}));
Object.defineProperty(exports, "XfaLayer", ({
  enumerable: true,
  get: function () {
    return _xfa_layer.XfaLayer;
  }
}));

var _display_utils = __w_pdfjs_require__(1);

var _api = __w_pdfjs_require__(6);

var _util = __w_pdfjs_require__(2);

var _annotation_layer = __w_pdfjs_require__(17);

var _worker_options = __w_pdfjs_require__(12);

var _is_node = __w_pdfjs_require__(4);

var _text_layer = __w_pdfjs_require__(19);

var _svg = __w_pdfjs_require__(20);

var _xfa_layer = __w_pdfjs_require__(21);

const pdfjsVersion = '2.10.339';
const pdfjsBuild = '07955fa1d';
;
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});