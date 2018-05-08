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
/**
 * Utility files for producing Vega ValueRef for marks
 */
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var scale_1 = require("../../scale");
var type_1 = require("../../type");
var util_1 = require("../../util");
var common_1 = require("../common");
// TODO: we need to find a way to refactor these so that scaleName is a part of scale
// but that's complicated.  For now, this is a huge step moving forward.
/**
 * @return Vega ValueRef for stackable x or y
 */
function stackable(channel, channelDef, scaleName, scale, stack, defaultRef) {
    if (fielddef_1.isFieldDef(channelDef) && stack && channel === stack.fieldChannel) {
        // x or y use stack_end so that stacked line's point mark use stack_end too.
        return fieldRef(channelDef, scaleName, { suffix: 'end' });
    }
    return midPoint(channel, channelDef, scaleName, scale, stack, defaultRef);
}
exports.stackable = stackable;
/**
 * @return Vega ValueRef for stackable x2 or y2
 */
function stackable2(channel, aFieldDef, a2fieldDef, scaleName, scale, stack, defaultRef) {
    if (fielddef_1.isFieldDef(aFieldDef) && stack &&
        // If fieldChannel is X and channel is X2 (or Y and Y2)
        channel.charAt(0) === stack.fieldChannel.charAt(0)) {
        return fieldRef(aFieldDef, scaleName, { suffix: 'start' });
    }
    return midPoint(channel, a2fieldDef, scaleName, scale, stack, defaultRef);
}
exports.stackable2 = stackable2;
/**
 * Value Ref for binned fields
 */
function bin(fieldDef, scaleName, side, offset) {
    var binSuffix = side === 'start' ? undefined : 'end';
    return fieldRef(fieldDef, scaleName, { binSuffix: binSuffix }, offset ? { offset: offset } : {});
}
exports.bin = bin;
function fieldRef(fieldDef, scaleName, opt, mixins) {
    var ref = __assign({}, (scaleName ? { scale: scaleName } : {}), { field: fielddef_1.vgField(fieldDef, opt) });
    if (mixins) {
        return __assign({}, ref, mixins);
    }
    return ref;
}
exports.fieldRef = fieldRef;
function bandRef(scaleName, band) {
    if (band === void 0) { band = true; }
    return {
        scale: scaleName,
        band: band
    };
}
exports.bandRef = bandRef;
/**
 * Signal that returns the middle of a bin. Should only be used with x and y.
 */
function binMidSignal(fieldDef, scaleName) {
    return {
        signal: "(" +
            ("scale(\"" + scaleName + "\", " + fielddef_1.vgField(fieldDef, { expr: 'datum' }) + ")") +
            " + " +
            ("scale(\"" + scaleName + "\", " + fielddef_1.vgField(fieldDef, { binSuffix: 'end', expr: 'datum' }) + ")") +
            ")/2"
    };
}
/**
 * @returns {VgValueRef} Value Ref for xc / yc or mid point for other channels.
 */
function midPoint(channel, channelDef, scaleName, scale, stack, defaultRef) {
    // TODO: datum support
    if (channelDef) {
        /* istanbul ignore else */
        if (fielddef_1.isFieldDef(channelDef)) {
            if (channelDef.bin) {
                // Use middle only for x an y to place marks in the center between start and end of the bin range.
                // We do not use the mid point for other channels (e.g. size) so that properties of legends and marks match.
                if (util_1.contains([channel_1.X, channel_1.Y], channel) && channelDef.type === type_1.QUANTITATIVE) {
                    if (stack && stack.impute) {
                        // For stack, we computed bin_mid so we can impute.
                        return fieldRef(channelDef, scaleName, { binSuffix: 'mid' });
                    }
                    // For non-stack, we can just calculate bin mid on the fly using signal.
                    return binMidSignal(channelDef, scaleName);
                }
                return fieldRef(channelDef, scaleName, common_1.binRequiresRange(channelDef, channel) ? { binSuffix: 'range' } : {});
            }
            if (scale) {
                var scaleType = scale.get('type');
                if (scale_1.hasDiscreteDomain(scaleType)) {
                    if (scaleType === 'band') {
                        // For band, to get mid point, need to offset by half of the band
                        return fieldRef(channelDef, scaleName, { binSuffix: 'range' }, { band: 0.5 });
                    }
                    return fieldRef(channelDef, scaleName, { binSuffix: 'range' });
                }
            }
            return fieldRef(channelDef, scaleName, {}); // no need for bin suffix
        }
        else if (fielddef_1.isValueDef(channelDef)) {
            return { value: channelDef.value };
        }
        // If channelDef is neither field def or value def, it's a condition-only def.
        // In such case, we will use default ref.
    }
    if (defaultRef === 'zeroOrMin') {
        /* istanbul ignore else */
        if (channel === channel_1.X || channel === channel_1.X2) {
            return zeroOrMinX(scaleName, scale);
        }
        else if (channel === channel_1.Y || channel === channel_1.Y2) {
            return zeroOrMinY(scaleName, scale);
        }
        else {
            throw new Error("Unsupported channel " + channel + " for base function"); // FIXME add this to log.message
        }
    }
    else if (defaultRef === 'zeroOrMax') {
        /* istanbul ignore else */
        if (channel === channel_1.X || channel === channel_1.X2) {
            return zeroOrMaxX(scaleName, scale);
        }
        else if (channel === channel_1.Y || channel === channel_1.Y2) {
            return zeroOrMaxY(scaleName, scale);
        }
        else {
            throw new Error("Unsupported channel " + channel + " for base function"); // FIXME add this to log.message
        }
    }
    return defaultRef;
}
exports.midPoint = midPoint;
function text(textDef, config) {
    // text
    if (textDef) {
        if (fielddef_1.isFieldDef(textDef)) {
            return common_1.formatSignalRef(textDef, textDef.format, 'datum', config);
        }
        else if (fielddef_1.isValueDef(textDef)) {
            return { value: textDef.value };
        }
    }
    return undefined;
}
exports.text = text;
function mid(sizeRef) {
    return __assign({}, sizeRef, { mult: 0.5 });
}
exports.mid = mid;
function zeroOrMinX(scaleName, scale) {
    if (scaleName) {
        // Log / Time / UTC scale do not support zero
        if (!util_1.contains([scale_1.ScaleType.LOG, scale_1.ScaleType.TIME, scale_1.ScaleType.UTC], scale.get('type')) &&
            scale.get('zero') !== false) {
            return {
                scale: scaleName,
                value: 0
            };
        }
    }
    // Put the mark on the x-axis
    return { value: 0 };
}
/**
 * @returns {VgValueRef} base value if scale exists and return max value if scale does not exist
 */
function zeroOrMaxX(scaleName, scale) {
    if (scaleName) {
        // Log / Time / UTC scale do not support zero
        if (!util_1.contains([scale_1.ScaleType.LOG, scale_1.ScaleType.TIME, scale_1.ScaleType.UTC], scale.get('type')) &&
            scale.get('zero') !== false) {
            return {
                scale: scaleName,
                value: 0
            };
        }
    }
    return { field: { group: 'width' } };
}
function zeroOrMinY(scaleName, scale) {
    if (scaleName) {
        // Log / Time / UTC scale do not support zero
        if (!util_1.contains([scale_1.ScaleType.LOG, scale_1.ScaleType.TIME, scale_1.ScaleType.UTC], scale.get('type')) &&
            scale.get('zero') !== false) {
            return {
                scale: scaleName,
                value: 0
            };
        }
    }
    // Put the mark on the y-axis
    return { field: { group: 'height' } };
}
/**
 * @returns {VgValueRef} base value if scale exists and return max value if scale does not exist
 */
function zeroOrMaxY(scaleName, scale) {
    if (scaleName) {
        // Log / Time / UTC scale do not support zero
        if (!util_1.contains([scale_1.ScaleType.LOG, scale_1.ScaleType.TIME, scale_1.ScaleType.UTC], scale.get('type')) &&
            scale.get('zero') !== false) {
            return {
                scale: scaleName,
                value: 0
            };
        }
    }
    // Put the mark on the y-axis
    return { value: 0 };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsdWVyZWYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9tYXJrL3ZhbHVlcmVmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILHlDQUFvRDtBQUVwRCwyQ0FTd0I7QUFDeEIscUNBQXlEO0FBRXpELG1DQUF3QztBQUN4QyxtQ0FBb0M7QUFFcEMsb0NBQTREO0FBSTVELHFGQUFxRjtBQUNyRix3RUFBd0U7QUFFeEU7O0dBRUc7QUFDSCxtQkFBMEIsT0FBa0IsRUFBRSxVQUE4QixFQUFFLFNBQWlCLEVBQUUsS0FBcUIsRUFDbEgsS0FBc0IsRUFBRSxVQUFrRDtJQUM1RSxFQUFFLENBQUMsQ0FBQyxxQkFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDdEUsNEVBQTRFO1FBQzVFLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFDRCxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDNUUsQ0FBQztBQVBELDhCQU9DO0FBRUQ7O0dBRUc7QUFDSCxvQkFBMkIsT0FBb0IsRUFBRSxTQUE2QixFQUFFLFVBQThCLEVBQUUsU0FBaUIsRUFBRSxLQUFxQixFQUNwSixLQUFzQixFQUFFLFVBQWtEO0lBQzVFLEVBQUUsQ0FBQyxDQUFDLHFCQUFVLENBQUMsU0FBUyxDQUFDLElBQUksS0FBSztRQUM5Qix1REFBdUQ7UUFDdkQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQ2pELENBQUMsQ0FBQyxDQUFDO1FBQ0wsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUMsTUFBTSxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUNELE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztBQUM1RSxDQUFDO0FBVEQsZ0NBU0M7QUFFRDs7R0FFRztBQUNILGFBQW9CLFFBQTBCLEVBQUUsU0FBaUIsRUFBRSxJQUFxQixFQUFFLE1BQWU7SUFDdkcsSUFBTSxTQUFTLEdBQUcsSUFBSSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDdkQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLEVBQUMsU0FBUyxXQUFBLEVBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUMsTUFBTSxRQUFBLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDNUUsQ0FBQztBQUhELGtCQUdDO0FBRUQsa0JBQ0ksUUFBMEIsRUFBRSxTQUFpQixFQUFFLEdBQW1CLEVBQ2xFLE1BQThEO0lBR2hFLElBQU0sR0FBRyxnQkFDSixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBQyxLQUFLLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUN4QyxLQUFLLEVBQUUsa0JBQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLEdBQzlCLENBQUM7SUFFRixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ1gsTUFBTSxjQUNELEdBQUcsRUFDSCxNQUFNLEVBQ1Q7SUFDSixDQUFDO0lBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFqQkQsNEJBaUJDO0FBRUQsaUJBQXdCLFNBQWlCLEVBQUUsSUFBMkI7SUFBM0IscUJBQUEsRUFBQSxXQUEyQjtJQUNwRSxNQUFNLENBQUM7UUFDTCxLQUFLLEVBQUUsU0FBUztRQUNoQixJQUFJLEVBQUUsSUFBSTtLQUNYLENBQUM7QUFDSixDQUFDO0FBTEQsMEJBS0M7QUFFRDs7R0FFRztBQUNILHNCQUFzQixRQUEwQixFQUFFLFNBQWlCO0lBQ2pFLE1BQU0sQ0FBQztRQUNMLE1BQU0sRUFBRSxHQUFHO2FBQ1QsYUFBVSxTQUFTLFlBQU0sa0JBQU8sQ0FBQyxRQUFRLEVBQUUsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFDLENBQUMsTUFBRyxDQUFBO1lBQzlELEtBQUs7YUFDTCxhQUFVLFNBQVMsWUFBTSxrQkFBTyxDQUFDLFFBQVEsRUFBRSxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBQyxDQUFDLE1BQUcsQ0FBQTtZQUNsRixLQUFLO0tBQ04sQ0FBQztBQUNKLENBQUM7QUFFRDs7R0FFRztBQUNILGtCQUF5QixPQUFnQixFQUFFLFVBQThCLEVBQUUsU0FBaUIsRUFBRSxLQUFxQixFQUFFLEtBQXNCLEVBQ3pJLFVBQWtEO0lBQ2xELHNCQUFzQjtJQUV0QixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ2YsMEJBQTBCO1FBRTFCLEVBQUUsQ0FBQyxDQUFDLHFCQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixrR0FBa0c7Z0JBQ2xHLDRHQUE0RztnQkFDNUcsRUFBRSxDQUFDLENBQUMsZUFBUSxDQUFDLENBQUMsV0FBQyxFQUFFLFdBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxJQUFJLFVBQVUsQ0FBQyxJQUFJLEtBQUssbUJBQVksQ0FBQyxDQUFDLENBQUM7b0JBQ2xFLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDMUIsbURBQW1EO3dCQUNuRCxNQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztvQkFDN0QsQ0FBQztvQkFDRCx3RUFBd0U7b0JBQ3hFLE1BQU0sQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dCQUM3QyxDQUFDO2dCQUNELE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSx5QkFBZ0IsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM1RyxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVixJQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNwQyxFQUFFLENBQUMsQ0FBQyx5QkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2pDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO3dCQUN6QixpRUFBaUU7d0JBQ2pFLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFDO29CQUM1RSxDQUFDO29CQUNELE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO2dCQUMvRCxDQUFDO1lBQ0gsQ0FBQztZQUNELE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLHlCQUF5QjtRQUN2RSxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLHFCQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLE1BQU0sQ0FBQyxFQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsS0FBSyxFQUFDLENBQUM7UUFDbkMsQ0FBQztRQUVELDhFQUE4RTtRQUM5RSx5Q0FBeUM7SUFDM0MsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFDLFVBQVUsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQy9CLDBCQUEwQjtRQUMxQixFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssV0FBQyxJQUFJLE9BQU8sS0FBSyxZQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3RDLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLFdBQUMsSUFBSSxPQUFPLEtBQUssWUFBRSxDQUFDLENBQUMsQ0FBQztZQUMzQyxNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN0QyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF1QixPQUFPLHVCQUFvQixDQUFDLENBQUMsQ0FBQyxnQ0FBZ0M7UUFDdkcsQ0FBQztJQUNILENBQUM7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDdEMsMEJBQTBCO1FBQzFCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxXQUFDLElBQUksT0FBTyxLQUFLLFlBQUUsQ0FBQyxDQUFDLENBQUM7WUFDcEMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdEMsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssV0FBQyxJQUFJLE9BQU8sS0FBSyxZQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzNDLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3RDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXVCLE9BQU8sdUJBQW9CLENBQUMsQ0FBQyxDQUFDLGdDQUFnQztRQUN2RyxDQUFDO0lBQ0gsQ0FBQztJQUNELE1BQU0sQ0FBQyxVQUFVLENBQUM7QUFDcEIsQ0FBQztBQTdERCw0QkE2REM7QUFFRCxjQUFxQixPQUFzRCxFQUFFLE1BQWM7SUFDekYsT0FBTztJQUNQLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDWixFQUFFLENBQUMsQ0FBQyxxQkFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixNQUFNLENBQUMsd0JBQWUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbkUsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxxQkFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQixNQUFNLENBQUMsRUFBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBQyxDQUFDO1FBQ2hDLENBQUM7SUFDSCxDQUFDO0lBQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBVkQsb0JBVUM7QUFFRCxhQUFvQixPQUFvQjtJQUN0QyxNQUFNLGNBQUssT0FBTyxJQUFFLElBQUksRUFBRSxHQUFHLElBQUU7QUFDakMsQ0FBQztBQUZELGtCQUVDO0FBRUQsb0JBQW9CLFNBQWlCLEVBQUUsS0FBcUI7SUFDMUQsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNkLDZDQUE2QztRQUM3QyxFQUFFLENBQUMsQ0FBQyxDQUFDLGVBQVEsQ0FBQyxDQUFDLGlCQUFTLENBQUMsR0FBRyxFQUFFLGlCQUFTLENBQUMsSUFBSSxFQUFFLGlCQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM5RSxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFFOUIsTUFBTSxDQUFDO2dCQUNMLEtBQUssRUFBRSxTQUFTO2dCQUNoQixLQUFLLEVBQUUsQ0FBQzthQUNULENBQUM7UUFDSixDQUFDO0lBQ0gsQ0FBQztJQUNELDZCQUE2QjtJQUM3QixNQUFNLENBQUMsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFDLENBQUM7QUFDcEIsQ0FBQztBQUVEOztHQUVHO0FBQ0gsb0JBQW9CLFNBQWlCLEVBQUUsS0FBcUI7SUFDMUQsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNkLDZDQUE2QztRQUM3QyxFQUFFLENBQUMsQ0FBQyxDQUFDLGVBQVEsQ0FBQyxDQUFDLGlCQUFTLENBQUMsR0FBRyxFQUFFLGlCQUFTLENBQUMsSUFBSSxFQUFFLGlCQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM5RSxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFFOUIsTUFBTSxDQUFDO2dCQUNMLEtBQUssRUFBRSxTQUFTO2dCQUNoQixLQUFLLEVBQUUsQ0FBQzthQUNULENBQUM7UUFDSixDQUFDO0lBQ0gsQ0FBQztJQUNELE1BQU0sQ0FBQyxFQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUMsRUFBQyxDQUFDO0FBQ25DLENBQUM7QUFFRCxvQkFBb0IsU0FBaUIsRUFBRSxLQUFxQjtJQUMxRCxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ2QsNkNBQTZDO1FBQzdDLEVBQUUsQ0FBQyxDQUFDLENBQUMsZUFBUSxDQUFDLENBQUMsaUJBQVMsQ0FBQyxHQUFHLEVBQUUsaUJBQVMsQ0FBQyxJQUFJLEVBQUUsaUJBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzlFLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztZQUU5QixNQUFNLENBQUM7Z0JBQ0wsS0FBSyxFQUFFLFNBQVM7Z0JBQ2hCLEtBQUssRUFBRSxDQUFDO2FBQ1QsQ0FBQztRQUNKLENBQUM7SUFDSCxDQUFDO0lBQ0QsNkJBQTZCO0lBQzdCLE1BQU0sQ0FBQyxFQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUMsRUFBQyxDQUFDO0FBQ3BDLENBQUM7QUFFRDs7R0FFRztBQUNILG9CQUFvQixTQUFpQixFQUFFLEtBQXFCO0lBQzFELEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDZCw2Q0FBNkM7UUFDN0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxlQUFRLENBQUMsQ0FBQyxpQkFBUyxDQUFDLEdBQUcsRUFBRSxpQkFBUyxDQUFDLElBQUksRUFBRSxpQkFBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDOUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBRTlCLE1BQU0sQ0FBQztnQkFDTCxLQUFLLEVBQUUsU0FBUztnQkFDaEIsS0FBSyxFQUFFLENBQUM7YUFDVCxDQUFDO1FBQ0osQ0FBQztJQUNILENBQUM7SUFDRCw2QkFBNkI7SUFDN0IsTUFBTSxDQUFDLEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBQyxDQUFDO0FBQ3BCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFV0aWxpdHkgZmlsZXMgZm9yIHByb2R1Y2luZyBWZWdhIFZhbHVlUmVmIGZvciBtYXJrc1xuICovXG5pbXBvcnQge0NoYW5uZWwsIFgsIFgyLCBZLCBZMn0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi4vLi4vY29uZmlnJztcbmltcG9ydCB7XG4gIENoYW5uZWxEZWYsXG4gIENoYW5uZWxEZWZXaXRoQ29uZGl0aW9uLFxuICBGaWVsZERlZixcbiAgRmllbGRSZWZPcHRpb24sXG4gIGlzRmllbGREZWYsXG4gIGlzVmFsdWVEZWYsXG4gIFRleHRGaWVsZERlZixcbiAgdmdGaWVsZCxcbn0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtoYXNEaXNjcmV0ZURvbWFpbiwgU2NhbGVUeXBlfSBmcm9tICcuLi8uLi9zY2FsZSc7XG5pbXBvcnQge1N0YWNrUHJvcGVydGllc30gZnJvbSAnLi4vLi4vc3RhY2snO1xuaW1wb3J0IHtRVUFOVElUQVRJVkV9IGZyb20gJy4uLy4uL3R5cGUnO1xuaW1wb3J0IHtjb250YWluc30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnU2lnbmFsUmVmLCBWZ1ZhbHVlUmVmfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2JpblJlcXVpcmVzUmFuZ2UsIGZvcm1hdFNpZ25hbFJlZn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7U2NhbGVDb21wb25lbnR9IGZyb20gJy4uL3NjYWxlL2NvbXBvbmVudCc7XG5cblxuLy8gVE9ETzogd2UgbmVlZCB0byBmaW5kIGEgd2F5IHRvIHJlZmFjdG9yIHRoZXNlIHNvIHRoYXQgc2NhbGVOYW1lIGlzIGEgcGFydCBvZiBzY2FsZVxuLy8gYnV0IHRoYXQncyBjb21wbGljYXRlZC4gIEZvciBub3csIHRoaXMgaXMgYSBodWdlIHN0ZXAgbW92aW5nIGZvcndhcmQuXG5cbi8qKlxuICogQHJldHVybiBWZWdhIFZhbHVlUmVmIGZvciBzdGFja2FibGUgeCBvciB5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdGFja2FibGUoY2hhbm5lbDogJ3gnIHwgJ3knLCBjaGFubmVsRGVmOiBDaGFubmVsRGVmPHN0cmluZz4sIHNjYWxlTmFtZTogc3RyaW5nLCBzY2FsZTogU2NhbGVDb21wb25lbnQsXG4gICAgc3RhY2s6IFN0YWNrUHJvcGVydGllcywgZGVmYXVsdFJlZjogVmdWYWx1ZVJlZiB8ICd6ZXJvT3JNaW4nIHwgJ3plcm9Pck1heCcpOiBWZ1ZhbHVlUmVmIHtcbiAgaWYgKGlzRmllbGREZWYoY2hhbm5lbERlZikgJiYgc3RhY2sgJiYgY2hhbm5lbCA9PT0gc3RhY2suZmllbGRDaGFubmVsKSB7XG4gICAgLy8geCBvciB5IHVzZSBzdGFja19lbmQgc28gdGhhdCBzdGFja2VkIGxpbmUncyBwb2ludCBtYXJrIHVzZSBzdGFja19lbmQgdG9vLlxuICAgIHJldHVybiBmaWVsZFJlZihjaGFubmVsRGVmLCBzY2FsZU5hbWUsIHtzdWZmaXg6ICdlbmQnfSk7XG4gIH1cbiAgcmV0dXJuIG1pZFBvaW50KGNoYW5uZWwsIGNoYW5uZWxEZWYsIHNjYWxlTmFtZSwgc2NhbGUsIHN0YWNrLCBkZWZhdWx0UmVmKTtcbn1cblxuLyoqXG4gKiBAcmV0dXJuIFZlZ2EgVmFsdWVSZWYgZm9yIHN0YWNrYWJsZSB4MiBvciB5MlxuICovXG5leHBvcnQgZnVuY3Rpb24gc3RhY2thYmxlMihjaGFubmVsOiAneDInIHwgJ3kyJywgYUZpZWxkRGVmOiBDaGFubmVsRGVmPHN0cmluZz4sIGEyZmllbGREZWY6IENoYW5uZWxEZWY8c3RyaW5nPiwgc2NhbGVOYW1lOiBzdHJpbmcsIHNjYWxlOiBTY2FsZUNvbXBvbmVudCxcbiAgICBzdGFjazogU3RhY2tQcm9wZXJ0aWVzLCBkZWZhdWx0UmVmOiBWZ1ZhbHVlUmVmIHwgJ3plcm9Pck1pbicgfCAnemVyb09yTWF4Jyk6IFZnVmFsdWVSZWYge1xuICBpZiAoaXNGaWVsZERlZihhRmllbGREZWYpICYmIHN0YWNrICYmXG4gICAgICAvLyBJZiBmaWVsZENoYW5uZWwgaXMgWCBhbmQgY2hhbm5lbCBpcyBYMiAob3IgWSBhbmQgWTIpXG4gICAgICBjaGFubmVsLmNoYXJBdCgwKSA9PT0gc3RhY2suZmllbGRDaGFubmVsLmNoYXJBdCgwKVxuICAgICAgKSB7XG4gICAgcmV0dXJuIGZpZWxkUmVmKGFGaWVsZERlZiwgc2NhbGVOYW1lLCB7c3VmZml4OiAnc3RhcnQnfSk7XG4gIH1cbiAgcmV0dXJuIG1pZFBvaW50KGNoYW5uZWwsIGEyZmllbGREZWYsIHNjYWxlTmFtZSwgc2NhbGUsIHN0YWNrLCBkZWZhdWx0UmVmKTtcbn1cblxuLyoqXG4gKiBWYWx1ZSBSZWYgZm9yIGJpbm5lZCBmaWVsZHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJpbihmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgc2NhbGVOYW1lOiBzdHJpbmcsIHNpZGU6ICdzdGFydCcgfCAnZW5kJywgb2Zmc2V0PzogbnVtYmVyKSB7XG4gIGNvbnN0IGJpblN1ZmZpeCA9IHNpZGUgPT09ICdzdGFydCcgPyB1bmRlZmluZWQgOiAnZW5kJztcbiAgcmV0dXJuIGZpZWxkUmVmKGZpZWxkRGVmLCBzY2FsZU5hbWUsIHtiaW5TdWZmaXh9LCBvZmZzZXQgPyB7b2Zmc2V0fSA6IHt9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpZWxkUmVmKFxuICAgIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBzY2FsZU5hbWU6IHN0cmluZywgb3B0OiBGaWVsZFJlZk9wdGlvbixcbiAgICBtaXhpbnM/OiB7b2Zmc2V0PzogbnVtYmVyIHwgVmdWYWx1ZVJlZiwgYmFuZD86IG51bWJlcnxib29sZWFufVxuICApOiBWZ1ZhbHVlUmVmIHtcblxuICBjb25zdCByZWY6IFZnVmFsdWVSZWYgPSB7XG4gICAgLi4uKHNjYWxlTmFtZSA/IHtzY2FsZTogc2NhbGVOYW1lfSA6IHt9KSxcbiAgICBmaWVsZDogdmdGaWVsZChmaWVsZERlZiwgb3B0KSxcbiAgfTtcblxuICBpZiAobWl4aW5zKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnJlZixcbiAgICAgIC4uLm1peGluc1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIHJlZjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJhbmRSZWYoc2NhbGVOYW1lOiBzdHJpbmcsIGJhbmQ6IG51bWJlcnxib29sZWFuID0gdHJ1ZSk6IFZnVmFsdWVSZWYge1xuICByZXR1cm4ge1xuICAgIHNjYWxlOiBzY2FsZU5hbWUsXG4gICAgYmFuZDogYmFuZFxuICB9O1xufVxuXG4vKipcbiAqIFNpZ25hbCB0aGF0IHJldHVybnMgdGhlIG1pZGRsZSBvZiBhIGJpbi4gU2hvdWxkIG9ubHkgYmUgdXNlZCB3aXRoIHggYW5kIHkuXG4gKi9cbmZ1bmN0aW9uIGJpbk1pZFNpZ25hbChmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgc2NhbGVOYW1lOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHtcbiAgICBzaWduYWw6IGAoYCArXG4gICAgICBgc2NhbGUoXCIke3NjYWxlTmFtZX1cIiwgJHt2Z0ZpZWxkKGZpZWxkRGVmLCB7ZXhwcjogJ2RhdHVtJ30pfSlgICtcbiAgICAgIGAgKyBgICtcbiAgICAgIGBzY2FsZShcIiR7c2NhbGVOYW1lfVwiLCAke3ZnRmllbGQoZmllbGREZWYsIHtiaW5TdWZmaXg6ICdlbmQnLCBleHByOiAnZGF0dW0nfSl9KWArXG4gICAgYCkvMmBcbiAgfTtcbn1cblxuLyoqXG4gKiBAcmV0dXJucyB7VmdWYWx1ZVJlZn0gVmFsdWUgUmVmIGZvciB4YyAvIHljIG9yIG1pZCBwb2ludCBmb3Igb3RoZXIgY2hhbm5lbHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtaWRQb2ludChjaGFubmVsOiBDaGFubmVsLCBjaGFubmVsRGVmOiBDaGFubmVsRGVmPHN0cmluZz4sIHNjYWxlTmFtZTogc3RyaW5nLCBzY2FsZTogU2NhbGVDb21wb25lbnQsIHN0YWNrOiBTdGFja1Byb3BlcnRpZXMsXG4gIGRlZmF1bHRSZWY6IFZnVmFsdWVSZWYgfCAnemVyb09yTWluJyB8ICd6ZXJvT3JNYXgnKTogVmdWYWx1ZVJlZiB7XG4gIC8vIFRPRE86IGRhdHVtIHN1cHBvcnRcblxuICBpZiAoY2hhbm5lbERlZikge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG5cbiAgICBpZiAoaXNGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgICAgaWYgKGNoYW5uZWxEZWYuYmluKSB7XG4gICAgICAgIC8vIFVzZSBtaWRkbGUgb25seSBmb3IgeCBhbiB5IHRvIHBsYWNlIG1hcmtzIGluIHRoZSBjZW50ZXIgYmV0d2VlbiBzdGFydCBhbmQgZW5kIG9mIHRoZSBiaW4gcmFuZ2UuXG4gICAgICAgIC8vIFdlIGRvIG5vdCB1c2UgdGhlIG1pZCBwb2ludCBmb3Igb3RoZXIgY2hhbm5lbHMgKGUuZy4gc2l6ZSkgc28gdGhhdCBwcm9wZXJ0aWVzIG9mIGxlZ2VuZHMgYW5kIG1hcmtzIG1hdGNoLlxuICAgICAgICBpZiAoY29udGFpbnMoW1gsIFldLCBjaGFubmVsKSAmJiBjaGFubmVsRGVmLnR5cGUgPT09IFFVQU5USVRBVElWRSkge1xuICAgICAgICAgIGlmIChzdGFjayAmJiBzdGFjay5pbXB1dGUpIHtcbiAgICAgICAgICAgIC8vIEZvciBzdGFjaywgd2UgY29tcHV0ZWQgYmluX21pZCBzbyB3ZSBjYW4gaW1wdXRlLlxuICAgICAgICAgICAgcmV0dXJuIGZpZWxkUmVmKGNoYW5uZWxEZWYsIHNjYWxlTmFtZSwge2JpblN1ZmZpeDogJ21pZCd9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gRm9yIG5vbi1zdGFjaywgd2UgY2FuIGp1c3QgY2FsY3VsYXRlIGJpbiBtaWQgb24gdGhlIGZseSB1c2luZyBzaWduYWwuXG4gICAgICAgICAgcmV0dXJuIGJpbk1pZFNpZ25hbChjaGFubmVsRGVmLCBzY2FsZU5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaWVsZFJlZihjaGFubmVsRGVmLCBzY2FsZU5hbWUsIGJpblJlcXVpcmVzUmFuZ2UoY2hhbm5lbERlZiwgY2hhbm5lbCkgPyB7YmluU3VmZml4OiAncmFuZ2UnfSA6IHt9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNjYWxlKSB7XG4gICAgICAgIGNvbnN0IHNjYWxlVHlwZSA9IHNjYWxlLmdldCgndHlwZScpO1xuICAgICAgICBpZiAoaGFzRGlzY3JldGVEb21haW4oc2NhbGVUeXBlKSkge1xuICAgICAgICAgIGlmIChzY2FsZVR5cGUgPT09ICdiYW5kJykge1xuICAgICAgICAgICAgLy8gRm9yIGJhbmQsIHRvIGdldCBtaWQgcG9pbnQsIG5lZWQgdG8gb2Zmc2V0IGJ5IGhhbGYgb2YgdGhlIGJhbmRcbiAgICAgICAgICAgIHJldHVybiBmaWVsZFJlZihjaGFubmVsRGVmLCBzY2FsZU5hbWUsIHtiaW5TdWZmaXg6ICdyYW5nZSd9LCB7YmFuZDogMC41fSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBmaWVsZFJlZihjaGFubmVsRGVmLCBzY2FsZU5hbWUsIHtiaW5TdWZmaXg6ICdyYW5nZSd9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZpZWxkUmVmKGNoYW5uZWxEZWYsIHNjYWxlTmFtZSwge30pOyAvLyBubyBuZWVkIGZvciBiaW4gc3VmZml4XG4gICAgfSBlbHNlIGlmIChpc1ZhbHVlRGVmKGNoYW5uZWxEZWYpKSB7XG4gICAgICByZXR1cm4ge3ZhbHVlOiBjaGFubmVsRGVmLnZhbHVlfTtcbiAgICB9XG5cbiAgICAvLyBJZiBjaGFubmVsRGVmIGlzIG5laXRoZXIgZmllbGQgZGVmIG9yIHZhbHVlIGRlZiwgaXQncyBhIGNvbmRpdGlvbi1vbmx5IGRlZi5cbiAgICAvLyBJbiBzdWNoIGNhc2UsIHdlIHdpbGwgdXNlIGRlZmF1bHQgcmVmLlxuICB9XG5cbiAgaWYgKGRlZmF1bHRSZWYgPT09ICd6ZXJvT3JNaW4nKSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICBpZiAoY2hhbm5lbCA9PT0gWCB8fCBjaGFubmVsID09PSBYMikge1xuICAgICAgcmV0dXJuIHplcm9Pck1pblgoc2NhbGVOYW1lLCBzY2FsZSk7XG4gICAgfSBlbHNlIGlmIChjaGFubmVsID09PSBZIHx8IGNoYW5uZWwgPT09IFkyKSB7XG4gICAgICByZXR1cm4gemVyb09yTWluWShzY2FsZU5hbWUsIHNjYWxlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBjaGFubmVsICR7Y2hhbm5lbH0gZm9yIGJhc2UgZnVuY3Rpb25gKTsgLy8gRklYTUUgYWRkIHRoaXMgdG8gbG9nLm1lc3NhZ2VcbiAgICB9XG4gIH0gZWxzZSBpZiAoZGVmYXVsdFJlZiA9PT0gJ3plcm9Pck1heCcpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgIGlmIChjaGFubmVsID09PSBYIHx8IGNoYW5uZWwgPT09IFgyKSB7XG4gICAgICByZXR1cm4gemVyb09yTWF4WChzY2FsZU5hbWUsIHNjYWxlKTtcbiAgICB9IGVsc2UgaWYgKGNoYW5uZWwgPT09IFkgfHwgY2hhbm5lbCA9PT0gWTIpIHtcbiAgICAgIHJldHVybiB6ZXJvT3JNYXhZKHNjYWxlTmFtZSwgc2NhbGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGNoYW5uZWwgJHtjaGFubmVsfSBmb3IgYmFzZSBmdW5jdGlvbmApOyAvLyBGSVhNRSBhZGQgdGhpcyB0byBsb2cubWVzc2FnZVxuICAgIH1cbiAgfVxuICByZXR1cm4gZGVmYXVsdFJlZjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRleHQodGV4dERlZjogQ2hhbm5lbERlZldpdGhDb25kaXRpb248VGV4dEZpZWxkRGVmPHN0cmluZz4+LCBjb25maWc6IENvbmZpZyk6IFZnVmFsdWVSZWYge1xuICAvLyB0ZXh0XG4gIGlmICh0ZXh0RGVmKSB7XG4gICAgaWYgKGlzRmllbGREZWYodGV4dERlZikpIHtcbiAgICAgIHJldHVybiBmb3JtYXRTaWduYWxSZWYodGV4dERlZiwgdGV4dERlZi5mb3JtYXQsICdkYXR1bScsIGNvbmZpZyk7XG4gICAgfSBlbHNlIGlmIChpc1ZhbHVlRGVmKHRleHREZWYpKSB7XG4gICAgICByZXR1cm4ge3ZhbHVlOiB0ZXh0RGVmLnZhbHVlfTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1pZChzaXplUmVmOiBWZ1NpZ25hbFJlZik6IFZnVmFsdWVSZWYge1xuICByZXR1cm4gey4uLnNpemVSZWYsIG11bHQ6IDAuNX07XG59XG5cbmZ1bmN0aW9uIHplcm9Pck1pblgoc2NhbGVOYW1lOiBzdHJpbmcsIHNjYWxlOiBTY2FsZUNvbXBvbmVudCk6IFZnVmFsdWVSZWYge1xuICBpZiAoc2NhbGVOYW1lKSB7XG4gICAgLy8gTG9nIC8gVGltZSAvIFVUQyBzY2FsZSBkbyBub3Qgc3VwcG9ydCB6ZXJvXG4gICAgaWYgKCFjb250YWlucyhbU2NhbGVUeXBlLkxPRywgU2NhbGVUeXBlLlRJTUUsIFNjYWxlVHlwZS5VVENdLCBzY2FsZS5nZXQoJ3R5cGUnKSkgJiZcbiAgICAgIHNjYWxlLmdldCgnemVybycpICE9PSBmYWxzZSkge1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBzY2FsZTogc2NhbGVOYW1lLFxuICAgICAgICB2YWx1ZTogMFxuICAgICAgfTtcbiAgICB9XG4gIH1cbiAgLy8gUHV0IHRoZSBtYXJrIG9uIHRoZSB4LWF4aXNcbiAgcmV0dXJuIHt2YWx1ZTogMH07XG59XG5cbi8qKlxuICogQHJldHVybnMge1ZnVmFsdWVSZWZ9IGJhc2UgdmFsdWUgaWYgc2NhbGUgZXhpc3RzIGFuZCByZXR1cm4gbWF4IHZhbHVlIGlmIHNjYWxlIGRvZXMgbm90IGV4aXN0XG4gKi9cbmZ1bmN0aW9uIHplcm9Pck1heFgoc2NhbGVOYW1lOiBzdHJpbmcsIHNjYWxlOiBTY2FsZUNvbXBvbmVudCk6IFZnVmFsdWVSZWYge1xuICBpZiAoc2NhbGVOYW1lKSB7XG4gICAgLy8gTG9nIC8gVGltZSAvIFVUQyBzY2FsZSBkbyBub3Qgc3VwcG9ydCB6ZXJvXG4gICAgaWYgKCFjb250YWlucyhbU2NhbGVUeXBlLkxPRywgU2NhbGVUeXBlLlRJTUUsIFNjYWxlVHlwZS5VVENdLCBzY2FsZS5nZXQoJ3R5cGUnKSkgJiZcbiAgICAgIHNjYWxlLmdldCgnemVybycpICE9PSBmYWxzZSkge1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBzY2FsZTogc2NhbGVOYW1lLFxuICAgICAgICB2YWx1ZTogMFxuICAgICAgfTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtmaWVsZDoge2dyb3VwOiAnd2lkdGgnfX07XG59XG5cbmZ1bmN0aW9uIHplcm9Pck1pblkoc2NhbGVOYW1lOiBzdHJpbmcsIHNjYWxlOiBTY2FsZUNvbXBvbmVudCk6IFZnVmFsdWVSZWYge1xuICBpZiAoc2NhbGVOYW1lKSB7XG4gICAgLy8gTG9nIC8gVGltZSAvIFVUQyBzY2FsZSBkbyBub3Qgc3VwcG9ydCB6ZXJvXG4gICAgaWYgKCFjb250YWlucyhbU2NhbGVUeXBlLkxPRywgU2NhbGVUeXBlLlRJTUUsIFNjYWxlVHlwZS5VVENdLCBzY2FsZS5nZXQoJ3R5cGUnKSkgJiZcbiAgICAgIHNjYWxlLmdldCgnemVybycpICE9PSBmYWxzZSkge1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBzY2FsZTogc2NhbGVOYW1lLFxuICAgICAgICB2YWx1ZTogMFxuICAgICAgfTtcbiAgICB9XG4gIH1cbiAgLy8gUHV0IHRoZSBtYXJrIG9uIHRoZSB5LWF4aXNcbiAgcmV0dXJuIHtmaWVsZDoge2dyb3VwOiAnaGVpZ2h0J319O1xufVxuXG4vKipcbiAqIEByZXR1cm5zIHtWZ1ZhbHVlUmVmfSBiYXNlIHZhbHVlIGlmIHNjYWxlIGV4aXN0cyBhbmQgcmV0dXJuIG1heCB2YWx1ZSBpZiBzY2FsZSBkb2VzIG5vdCBleGlzdFxuICovXG5mdW5jdGlvbiB6ZXJvT3JNYXhZKHNjYWxlTmFtZTogc3RyaW5nLCBzY2FsZTogU2NhbGVDb21wb25lbnQpOiBWZ1ZhbHVlUmVmIHtcbiAgaWYgKHNjYWxlTmFtZSkge1xuICAgIC8vIExvZyAvIFRpbWUgLyBVVEMgc2NhbGUgZG8gbm90IHN1cHBvcnQgemVyb1xuICAgIGlmICghY29udGFpbnMoW1NjYWxlVHlwZS5MT0csIFNjYWxlVHlwZS5USU1FLCBTY2FsZVR5cGUuVVRDXSwgc2NhbGUuZ2V0KCd0eXBlJykpICYmXG4gICAgICBzY2FsZS5nZXQoJ3plcm8nKSAhPT0gZmFsc2UpIHtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc2NhbGU6IHNjYWxlTmFtZSxcbiAgICAgICAgdmFsdWU6IDBcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIC8vIFB1dCB0aGUgbWFyayBvbiB0aGUgeS1heGlzXG4gIHJldHVybiB7dmFsdWU6IDB9O1xufVxuIl19