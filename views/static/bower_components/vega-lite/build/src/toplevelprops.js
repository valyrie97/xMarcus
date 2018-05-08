"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var vega_util_1 = require("vega-util");
var log = require("./log");
function _normalizeAutoSize(autosize) {
    return vega_util_1.isString(autosize) ? { type: autosize } : autosize || {};
}
function normalizeAutoSize(topLevelAutosize, configAutosize, isUnitOrLayer) {
    if (isUnitOrLayer === void 0) { isUnitOrLayer = true; }
    var autosize = __assign({ type: 'pad' }, _normalizeAutoSize(configAutosize), _normalizeAutoSize(topLevelAutosize));
    if (autosize.type === 'fit') {
        if (!isUnitOrLayer) {
            log.warn(log.message.FIT_NON_SINGLE);
            autosize.type = 'pad';
        }
    }
    return autosize;
}
exports.normalizeAutoSize = normalizeAutoSize;
var TOP_LEVEL_PROPERTIES = [
    'background', 'padding', 'datasets'
    // We do not include "autosize" here as it is supported by only unit and layer specs and thus need to be normalized
];
function extractTopLevelProperties(t) {
    return TOP_LEVEL_PROPERTIES.reduce(function (o, p) {
        if (t && t[p] !== undefined) {
            o[p] = t[p];
        }
        return o;
    }, {});
}
exports.extractTopLevelProperties = extractTopLevelProperties;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9wbGV2ZWxwcm9wcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90b3BsZXZlbHByb3BzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSx1Q0FBbUM7QUFHbkMsMkJBQTZCO0FBbUU3Qiw0QkFBNEIsUUFBdUM7SUFDakUsTUFBTSxDQUFDLG9CQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO0FBQ2hFLENBQUM7QUFFRCwyQkFBa0MsZ0JBQStDLEVBQUUsY0FBNkMsRUFBRSxhQUE2QjtJQUE3Qiw4QkFBQSxFQUFBLG9CQUE2QjtJQUM3SixJQUFNLFFBQVEsY0FDWixJQUFJLEVBQUUsS0FBSyxJQUNSLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxFQUNsQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUN4QyxDQUFDO0lBRUYsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzVCLEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUNuQixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDckMsUUFBUSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7UUFDeEIsQ0FBQztJQUNILENBQUM7SUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDO0FBQ2xCLENBQUM7QUFmRCw4Q0FlQztBQUVELElBQU0sb0JBQW9CLEdBQWlDO0lBQ3pELFlBQVksRUFBRSxTQUFTLEVBQUUsVUFBVTtJQUNuQyxtSEFBbUg7Q0FDcEgsQ0FBQztBQUVGLG1DQUF3RSxDQUFJO0lBQzFFLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQztRQUN0QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNkLENBQUM7UUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ1QsQ0FBQztBQVBELDhEQU9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc1N0cmluZ30gZnJvbSAndmVnYS11dGlsJztcblxuaW1wb3J0IHtJbmxpbmVEYXRhc2V0fSBmcm9tICcuL2RhdGEnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4vbG9nJztcbmltcG9ydCB7RGljdH0gZnJvbSAnLi91dGlsJztcblxuLyoqXG4gKiBAbWluaW11bSAwXG4gKi9cbmV4cG9ydCB0eXBlIFBhZGRpbmcgPSBudW1iZXIgfCB7dG9wPzogbnVtYmVyLCBib3R0b20/OiBudW1iZXIsIGxlZnQ/OiBudW1iZXIsIHJpZ2h0PzogbnVtYmVyfTtcblxuZXhwb3J0IHR5cGUgRGF0YXNldHMgPSBEaWN0PElubGluZURhdGFzZXQ+O1xuXG5leHBvcnQgaW50ZXJmYWNlIFRvcExldmVsUHJvcGVydGllcyB7XG4gIC8qKlxuICAgKiBDU1MgY29sb3IgcHJvcGVydHkgdG8gdXNlIGFzIHRoZSBiYWNrZ3JvdW5kIG9mIHZpc3VhbGl6YXRpb24uXG4gICAqXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBub25lICh0cmFuc3BhcmVudClcbiAgICovXG4gIGJhY2tncm91bmQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBkZWZhdWx0IHZpc3VhbGl6YXRpb24gcGFkZGluZywgaW4gcGl4ZWxzLCBmcm9tIHRoZSBlZGdlIG9mIHRoZSB2aXN1YWxpemF0aW9uIGNhbnZhcyB0byB0aGUgZGF0YSByZWN0YW5nbGUuICBJZiBhIG51bWJlciwgc3BlY2lmaWVzIHBhZGRpbmcgZm9yIGFsbCBzaWRlcy5cbiAgICogSWYgYW4gb2JqZWN0LCB0aGUgdmFsdWUgc2hvdWxkIGhhdmUgdGhlIGZvcm1hdCBge1wibGVmdFwiOiA1LCBcInRvcFwiOiA1LCBcInJpZ2h0XCI6IDUsIFwiYm90dG9tXCI6IDV9YCB0byBzcGVjaWZ5IHBhZGRpbmcgZm9yIGVhY2ggc2lkZSBvZiB0aGUgdmlzdWFsaXphdGlvbi5cbiAgICpcbiAgICogX19EZWZhdWx0IHZhbHVlX186IGA1YFxuICAgKi9cbiAgcGFkZGluZz86IFBhZGRpbmc7XG5cbiAgLyoqXG4gICAqIFNldHMgaG93IHRoZSB2aXN1YWxpemF0aW9uIHNpemUgc2hvdWxkIGJlIGRldGVybWluZWQuIElmIGEgc3RyaW5nLCBzaG91bGQgYmUgb25lIG9mIGBcInBhZFwiYCwgYFwiZml0XCJgIG9yIGBcIm5vbmVcImAuXG4gICAqIE9iamVjdCB2YWx1ZXMgY2FuIGFkZGl0aW9uYWxseSBzcGVjaWZ5IHBhcmFtZXRlcnMgZm9yIGNvbnRlbnQgc2l6aW5nIGFuZCBhdXRvbWF0aWMgcmVzaXppbmcuXG4gICAqIGBcImZpdFwiYCBpcyBvbmx5IHN1cHBvcnRlZCBmb3Igc2luZ2xlIGFuZCBsYXllcmVkIHZpZXdzIHRoYXQgZG9uJ3QgdXNlIGByYW5nZVN0ZXBgLlxuICAgKlxuICAgKiBfX0RlZmF1bHQgdmFsdWVfXzogYHBhZGBcbiAgICovXG4gIGF1dG9zaXplPzogQXV0b3NpemVUeXBlIHwgQXV0b1NpemVQYXJhbXM7XG5cbiAgLyoqXG4gICAqIEEgZ2xvYmFsIGRhdGEgc3RvcmUgZm9yIG5hbWVkIGRhdGFzZXRzLiBUaGlzIGlzIGEgbWFwcGluZyBmcm9tIG5hbWVzIHRvIGlubGluZSBkYXRhc2V0cy5cbiAgICogVGhpcyBjYW4gYmUgYW4gYXJyYXkgb2Ygb2JqZWN0cyBvciBwcmltaXRpdmUgdmFsdWVzIG9yIGEgc3RyaW5nLiBBcnJheXMgb2YgcHJpbWl0aXZlIHZhbHVlcyBhcmUgaW5nZXN0ZWQgYXMgb2JqZWN0cyB3aXRoIGEgYGRhdGFgIHByb3BlcnR5LlxuICAgKi9cbiAgZGF0YXNldHM/OiBEYXRhc2V0cztcbn1cblxuZXhwb3J0IHR5cGUgQXV0b3NpemVUeXBlID0gJ3BhZCcgfCAnZml0JyB8ICdub25lJztcblxuZXhwb3J0IGludGVyZmFjZSBBdXRvU2l6ZVBhcmFtcyB7XG4gIC8qKlxuICAgKiBUaGUgc2l6aW5nIGZvcm1hdCB0eXBlLiBPbmUgb2YgYFwicGFkXCJgLCBgXCJmaXRcImAgb3IgYFwibm9uZVwiYC4gU2VlIHRoZSBbYXV0b3NpemUgdHlwZV0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zaXplLmh0bWwjYXV0b3NpemUpIGRvY3VtZW50YXRpb24gZm9yIGRlc2NyaXB0aW9ucyBvZiBlYWNoLlxuICAgKlxuICAgKiBfX0RlZmF1bHQgdmFsdWVfXzogYFwicGFkXCJgXG4gICAqL1xuICB0eXBlPzogQXV0b3NpemVUeXBlO1xuXG4gIC8qKlxuICAgKiBBIGJvb2xlYW4gZmxhZyBpbmRpY2F0aW5nIGlmIGF1dG9zaXplIGxheW91dCBzaG91bGQgYmUgcmUtY2FsY3VsYXRlZCBvbiBldmVyeSB2aWV3IHVwZGF0ZS5cbiAgICpcbiAgICogX19EZWZhdWx0IHZhbHVlX186IGBmYWxzZWBcbiAgICovXG4gIHJlc2l6ZT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgaG93IHNpemUgY2FsY3VsYXRpb24gc2hvdWxkIGJlIHBlcmZvcm1lZCwgb25lIG9mIGBcImNvbnRlbnRcImAgb3IgYFwicGFkZGluZ1wiYC4gVGhlIGRlZmF1bHQgc2V0dGluZyAoYFwiY29udGVudFwiYCkgaW50ZXJwcmV0cyB0aGUgd2lkdGggYW5kIGhlaWdodCBzZXR0aW5ncyBhcyB0aGUgZGF0YSByZWN0YW5nbGUgKHBsb3R0aW5nKSBkaW1lbnNpb25zLCB0byB3aGljaCBwYWRkaW5nIGlzIHRoZW4gYWRkZWQuIEluIGNvbnRyYXN0LCB0aGUgYFwicGFkZGluZ1wiYCBzZXR0aW5nIGluY2x1ZGVzIHRoZSBwYWRkaW5nIHdpdGhpbiB0aGUgdmlldyBzaXplIGNhbGN1bGF0aW9ucywgc3VjaCB0aGF0IHRoZSB3aWR0aCBhbmQgaGVpZ2h0IHNldHRpbmdzIGluZGljYXRlIHRoZSAqKnRvdGFsKiogaW50ZW5kZWQgc2l6ZSBvZiB0aGUgdmlldy5cbiAgICpcbiAgICogX19EZWZhdWx0IHZhbHVlX186IGBcImNvbnRlbnRcImBcbiAgICovXG4gIGNvbnRhaW5zPzogJ2NvbnRlbnQnIHwgJ3BhZGRpbmcnO1xufVxuXG5mdW5jdGlvbiBfbm9ybWFsaXplQXV0b1NpemUoYXV0b3NpemU6IEF1dG9zaXplVHlwZSB8IEF1dG9TaXplUGFyYW1zKSB7XG4gIHJldHVybiBpc1N0cmluZyhhdXRvc2l6ZSkgPyB7dHlwZTogYXV0b3NpemV9IDogYXV0b3NpemUgfHwge307XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVBdXRvU2l6ZSh0b3BMZXZlbEF1dG9zaXplOiBBdXRvc2l6ZVR5cGUgfCBBdXRvU2l6ZVBhcmFtcywgY29uZmlnQXV0b3NpemU6IEF1dG9zaXplVHlwZSB8IEF1dG9TaXplUGFyYW1zLCBpc1VuaXRPckxheWVyOiBib29sZWFuID0gdHJ1ZSk6IEF1dG9TaXplUGFyYW1zIHtcbiAgY29uc3QgYXV0b3NpemU6IEF1dG9TaXplUGFyYW1zID0ge1xuICAgIHR5cGU6ICdwYWQnLFxuICAgIC4uLl9ub3JtYWxpemVBdXRvU2l6ZShjb25maWdBdXRvc2l6ZSksXG4gICAgLi4uX25vcm1hbGl6ZUF1dG9TaXplKHRvcExldmVsQXV0b3NpemUpXG4gIH07XG5cbiAgaWYgKGF1dG9zaXplLnR5cGUgPT09ICdmaXQnKSB7XG4gICAgaWYgKCFpc1VuaXRPckxheWVyKSB7XG4gICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5GSVRfTk9OX1NJTkdMRSk7XG4gICAgICBhdXRvc2l6ZS50eXBlID0gJ3BhZCc7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGF1dG9zaXplO1xufVxuXG5jb25zdCBUT1BfTEVWRUxfUFJPUEVSVElFUzogKGtleW9mIFRvcExldmVsUHJvcGVydGllcylbXSA9IFtcbiAgJ2JhY2tncm91bmQnLCAncGFkZGluZycsICdkYXRhc2V0cydcbiAgLy8gV2UgZG8gbm90IGluY2x1ZGUgXCJhdXRvc2l6ZVwiIGhlcmUgYXMgaXQgaXMgc3VwcG9ydGVkIGJ5IG9ubHkgdW5pdCBhbmQgbGF5ZXIgc3BlY3MgYW5kIHRodXMgbmVlZCB0byBiZSBub3JtYWxpemVkXG5dO1xuXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdFRvcExldmVsUHJvcGVydGllczxUIGV4dGVuZHMgVG9wTGV2ZWxQcm9wZXJ0aWVzPih0OiBUKSB7XG4gIHJldHVybiBUT1BfTEVWRUxfUFJPUEVSVElFUy5yZWR1Y2UoKG8sIHApID0+IHtcbiAgICBpZiAodCAmJiB0W3BdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG9bcF0gPSB0W3BdO1xuICAgIH1cbiAgICByZXR1cm4gbztcbiAgfSwge30pO1xufVxuIl19